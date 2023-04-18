import catchAsync from "../utils/catchAsync.js"
import AppError from "../utils/appError.js"
import APIFeatures from "../utils/apiFeatures.js"

export const deleteOne = Model => catchAsync(async function (req, res, next) {
    const doc = await Model.findByIdAndDelete(req.params.id)

    if (!doc) {
        return next(new AppError("No document found with that ID", 404))
    }

    res.status(204).json({
        status: "success",
        data: null
    })
})

export const updateOne = Model => catchAsync(async function (req, res, next) {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    })

    if (!doc) {
        return next(new AppError("No document found with that ID", 404))
    }

    res.status(200).json({
        status: 'success',
        data: {
            data: doc
        }
    })
})

export const createOne = Model => catchAsync(async function (req, res, next) {
    const newDoc = await Model.create(req.body)


    res.status(201).json({
        status: 'success',
        data: {
            data: newDoc
        }
    })
})

export const getOne = (Model, populateOptions) => catchAsync(async function (req, res, next) {
    const query = Model.findById(req.params.id)
    let doc

    if(populateOptions) {
        doc = await query.populate(populateOptions)
    } else {
        doc = await query
    }

    if (!doc) {
        return next(new AppError('No tour found with that ID', 404))
    }

    res.status(200).json({
        status: 'success',
        data: {
            data: doc
        }
    })
})

export const getAll = Model => catchAsync(async function (req, res, next) {
    // To allow for nested GET reviews on tour
    let filter
    if (req.params.tourId) filter = { tourRef: req.params.tourId }

    const features = new APIFeatures(Model.find(filter), req.query)
        .filter()
        .sort()
        .limitFields()
        .paginate()

    const docs = await features.query

    res.status(200).json({
        status: 'success',
        results: docs.length,
        data: {
            data: docs
        }
    })
})
