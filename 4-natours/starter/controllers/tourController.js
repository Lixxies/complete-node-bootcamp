import Tour from '../models/tourModel.js'
import catchAsync from '../utils/catchAsync.js'
import { createOne, deleteOne, updateOne, getOne, getAll } from './handlerFactory.js'

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
