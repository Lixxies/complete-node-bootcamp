import User from '../models/userModel.js'
import catchAsync from '../utils/catchAsync.js'
import AppError from '../utils/appError.js'

function filterBody(body, ...allowedFields) {
    const filteredBody = {}
    Object.keys(body).map(el => allowedFields.includes(el) ? filteredBody[el] = body[el] : null)
    return filteredBody
}

export const getAllUsers = catchAsync(async function (req, res, next) {
    const users = await User.find()

    res.status(200).json({
        status: 'success',
        results: users.length,
        data: {
            users
        }
    })
})

export const updateMe = catchAsync(async function (req, res, next) {
    if (req.body.password || req.body.passwordConfirm) {
        return next(new AppError('This route is not for password updates. Please use /update-password', 400))
    }

    const updatedUser = await User.findByIdAndUpdate(req.user.id, filterBody(req.body, 'name', 'email'), {
        returnNewDocument: true
    })

    res.status(200).json({
        status: 'success',
        data: {
            user: updatedUser
        }
    })
})

export const deleteMe = catchAsync(async function (req, res, next) {
    await User.findByIdAndUpdate(req.user.id, { active: false })

    res.status(204).json({
        status: 'success',
        data: null
    })
})

export function postUser(req, res) {
    res.status(500).json({
        status: 'error',
        message: 'This route is not yet defined'
    })
}

export function getUser(req, res) {
    res.status(500).json({
        status: 'error',
        message: 'This route is not yet defined'
    })
}

export function patchUser(req, res) {
    res.status(500).json({
        status: 'error',
        message: 'This route is not yet defined'
    })
}

export function deleteUser(req, res) {
    res.status(500).json({
        status: 'error',
        message: 'This route is not yet defined'
    })
}
