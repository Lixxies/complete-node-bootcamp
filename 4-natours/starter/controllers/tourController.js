import multer from 'multer'
import sharp from 'sharp';

import Tour from '../models/tourModel.js'
import catchAsync from '../utils/catchAsync.js'
import AppError from '../utils/appError.js'
import { createOne, deleteOne, updateOne, getOne, getAll } from './handlerFactory.js'
import dateNowFixed from '../utils/dateNowFixed.js';

const multerStorage = multer.memoryStorage()

const multerFilter = (req, file, callback) => {
    if (file.mimetype.startsWith('image')) {
        callback(null, true)
    } else {
        callback(new AppError('Not an image! Please upload only images.', 400), false)
    }
}

const upload = multer({
    storage: multerStorage,
    fileFilter: multerFilter
})

export const uploadTourImages = upload.fields([
    { name: 'imageCover', maxCount: 1 },
    { name: 'images', maxCount: 3 }
])

export const resizeTourImages = catchAsync(async function (req, res, next) {
    if (!req.files.imageCover && !req.files.images) {
        return next()
    }

    req.body.imageCover = `tour-${req.params.id}-${dateNowFixed()}-cover.jpeg`

    await sharp(req.files.imageCover[0].buffer)
        .resize(2000, 1333)
        .toFormat('jpeg')
        .jpeg({ quality: 90 })
        .toFile(`public/img/tours/${req.body.imageCover}`)

    req.body.images = []

    await Promise.all(req.files.images.map(async (image, ind) => {
        const filename = `tour-${req.params.id}-${dateNowFixed()}-${ind + 1}.jpeg`

        await sharp(file.buffer)
            .resize(2000, 1333)
            .toFormat('jpeg')
            .jpeg({ quality: 90 })
            .toFile(`public/img/tours/${filename}`)

        req.body.images.push(filename)
    }))

    next()
})

// Middleware
export function aliasTopTours(req, res, next) {
    req.query.limit = '5'
    req.query.sort = '-ratingsAverage,price'
    req.query.fields = 'name,price,ratingsAverage,summary,difficulty'
    next()
}

export const getAllTours = getAll(Tour)
export const getTour = getOne(Tour, { path: 'reviews' })
export const postTour = createOne(Tour)
export const patchTour = updateOne(Tour)
export const deleteTour = deleteOne(Tour)

export const getTourStats = catchAsync(async (req, res, next) => {
    const stats = await Tour.aggregate([
        {
            $match: { ratingsAverage: { $gte: 4.5 } }
        },
        {
            $group: {
                _id: { $toUpper: '$difficulty' },
                numTours: { $sum: 1 },
                numRatings: { $sum: '$ratingsQuantity' },
                avgRating: { $avg: '$ratingsAverage' },
                avgPrice: { $avg: '$price' },
                minPrice: { $min: '$price' },
                maxPrice: { $max: '$price' }
            }
        },
        {
            $sort: { avgPrice: 1 }
        },
        // {
        //     $match: { _id: { $ne: 'EASY' } }
        // }
    ])

    res.status(200).json({
        status: 'success',
        data: {
            stats
        }
    })
})

export const getMonthlyPlan = catchAsync(async (req, res, next) => {
    const year = +req.params.year

    const plan = await Tour.aggregate([
        {
            $unwind: '$startDates'
        },
        {
            $match: {
                startDates: {
                    $gte: new Date(`${year}-01-01`),
                    $lte: new Date(`${year}-12-31`)
                }
            }
        },
        {
            $group: {
                _id: { $month: '$startDates' },
                numTours: { $sum: 1 },
                tours: { $push: '$name' }
            }
        },
        {
            $addFields: { month: '$_id' },
        },
        {
            $sort: { numTours: -1 }
        },
        {
            $project: { _id: 0 }
        },
        {
            $limit: 12
        }
    ])

    res.status(200).json({
        status: 'success',
        data: {
            plan
        }
    })
})

// GEOSPACIAL QUERIES

function invalidCoordinates(next) {
    return next(new AppError('Please provide latitude and longitude in the format lat,lng.', 400))
}

export const getToursWithin = catchAsync(async function (req, res, next) {
    const { distance, latlng, unit } = req.params
    const [lat, lng] = latlng.split(',')

    if (!lat || !lng) {
        return invalidCoordinates(next)
    }

    const radius = unit === 'mi' ? distance / 3963.2 : distance / 6378.1

    const tours = await Tour.find({
        startLocation: {
            $geoWithin: {
                $centerSphere: [
                    [lng, lat],
                    radius
                ]
            }
        }
    })

    res.status(200).json({
        status: 'success',
        results: tours.length,
        data: {
            tours
        }
    })
})

export const getDistances = catchAsync(async function (req, res, next) {
    const { latlng, unit } = req.params
    const [lat, lng] = latlng.split(',')

    if (!lat || !lng) {
        return invalidCoordinates(next)
    }

    const distances = await Tour.aggregate([
        {
            $geoNear: {
                near: {
                    type: 'Point',
                    coordinates: [lng * 1, lat * 1]
                },
                distanceField: 'distance',
                distanceMultiplier: unit === 'mi' ? 0.000621371 : 0.001
            }
        },
        {
            $project: {
                distance: 1,
                name: 1
            }
        }
    ])

    res.status(200).json({
        status: 'success',
        data: {
            distances
        }
    })
})
