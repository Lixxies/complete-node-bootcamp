import crypto from "crypto";
import jwt from "jsonwebtoken";
import { promisify } from "util";

import User from "../models/userModel.js";
import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/appError.js";
import Email from "../utils/email.js";

function signToken(id) {
    return jwt.sign({ id: id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN })
}

function createSendToken(user, statusCode, req, res) {
    const token = signToken(user._id)
    const date = Date.now() + 120 * 60 * 1000
    const cookieOptions = {
        expires: new Date(date + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000),
        httpOnly: true,
        secure: req.secure
    }

    res.cookie('jwt', token, cookieOptions)

    user.password = undefined

    res.status(statusCode).json({
        status: 'success',
        token,
        data: {
            user
        }
    })
}

export const signup = catchAsync(async function (req, res, next) {
    const newUser = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm,
        passwordChangedAt: req.body.passwordChangedAt
    })

    const url = `${req.protocol}://${req.get('host')}/me`
    await new Email(newUser, url).sendWelcome()

    createSendToken(newUser, 201, req, res)
})

export const login = catchAsync(async function (req, res, next) {
    const { email, password } = req.body

    if (!email || !password) {
        return next(new AppError('Please provide email and password', 400))
    }

    const user = await User.findOne({ email }).select('+password')

    if (!user || !(await user.correctPassword(password, user.password))) {
        return next(new AppError('Incorrect email or password', 401))
    }

    createSendToken(user, 200, req, res)
})

export const protect = catchAsync(async function (req, res, next) {
    const auth = req.headers.authorization
    let token

    if (auth && auth.startsWith('Bearer')) token = auth.slice(7)

    if (!token) {
        return next(new AppError('You are not logged in! Please log in to get access.', 401))
    }

    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET)

    const foundUser = await User.findById(decoded.id)

    if (!foundUser) {
        return next(new AppError('The user belonging to this token does no longer exist.', 401))
    }

    if (foundUser.changedPassword(decoded.iat * 1000)) {
        return next(new AppError('User recently changed password! Please log in again.', 401))
    }

    req.user = foundUser

    next()
})

export function restrictTo(...roles) {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(new AppError('You do not have permission to perform this action', 403))
        }

        next()
    }
}

export const forgotPassword = catchAsync(async function (req, res, next) {
    const user = await User.findOne({ email: req.body.email })

    if (!user) {
        return next(new AppError('A user with this email address does not exist.', 404))
    }

    const resetToken = user.createPasswordResetToken()
    await user.save({ validateBeforeSave: false })

    try {
        const resetURL = `${req.protocol}://${req.get('host')}/api/v1/users/reset-password/${resetToken}`
        
        await new Email(user, resetURL).sendPasswordReset()

        res.status(200).json({
            status: 'success',
            message: 'Token sent to email!'
        })
    }

    catch (err) {
        user.passwordResetToken = undefined
        user.passwordResetTokenExpires = undefined
        await user.save({ validateBeforeSave: false })

        return next(new AppError('There was an error sending the email. Try again later!', 500))
    }

    res.status(200).json({
        status: 'success',
        message: 'Token sent to email!'
    })
})

export const resetPassword = catchAsync(async function (req, res, next) {
    const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex')
    const user = await User.findOne({ passwordResetToken: hashedToken, passwordResetTokenExpires: { $gt: Date.now().toString() } })

    if (!user) {
        return next(new AppError('Token is invalid or has expired', 400))
    }

    user.password = req.body.password
    user.passwordConfirm = req.body.passwordConfirm
    user.passwordResetToken = undefined
    user.passwordResetTokenExpires = undefined
    await user.save()

    createSendToken(user, 200, req, res)
})

export const updatePassword = catchAsync(async function (req, res, next) {
    const user = await User.findById(req.user._id).select('+password')

    if (!user.correctPassword(req.body.currentPassword, user.password)) {
        return next(new AppError('Current password is incorrect!', 401))
    }

    user.password = req.body.newPassword
    user.passwordConfirm = req.body.newPassword
    await user.save()

    createSendToken(user, 200, req, res)
})
