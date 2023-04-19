import User from '../models/userModel.js'
import catchAsync from '../utils/catchAsync.js'
import AppError from '../utils/appError.js'
import { deleteOne, updateOne, getOne, getAll } from './handlerFactory.js'

export const getAllUsers = getAll(User)
export const getUser = getOne(User)
export const patchUser = updateOne(User)
export const deleteUser = deleteOne(User)

export function getMe(req, res, next) {
    req.params.id = req.user.id
    next()
}

function filterBody(body, ...allowedFields) {
    const filteredBody = {}
    Object.keys(body).map(el => allowedFields.includes(el) ? filteredBody[el] = body[el] : null)
    return filteredBody
}

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
        message: 'This route is not defined. Please use /signup instead'
    })
}
