import jwt from "jsonwebtoken";
import { promisify } from "util";

import User from "../models/userModel.js";
import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/appError.js";

function signToken(id) {
    return jwt.sign({ id: id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN })
}

export const signup = catchAsync(async function (req, res, next) {
    const newUser = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm,
        passwordChangedAt: req.body.passwordChangedAt
    })

    const token = signToken(newUser._id)

    res.status(201).json({
        status: 'success',
        token,
        data: {
            user: newUser
        }
    })
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

    const token = signToken(user._id)

    res.status(200).json({
        status: 'success',
        token
    })
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

    if (foundUser.changedPassword(decoded.iat)) {
        return next(new AppError('User recently changed password! Please log in again.', 401))
    }

    req.user = foundUser

    next()
})
