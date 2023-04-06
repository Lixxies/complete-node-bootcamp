import User from '../models/userModel.js'
import catchAsync from '../utils/catchAsync.js'

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
