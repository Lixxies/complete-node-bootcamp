import AppError from '../utils/appError.js'

function sendErrorDev(err, res) {
    res.status(err.statusCode).json({
        status: err.status,
        error: err,
        message: err.message,
        stack: err.stack
    })
}

function sendErrorProd(err, res) {
    if (err.isOperational) {
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message
        })
    } else {
        console.error('ERROR', err)

        res.status(500).json({
            status: 'error',
            message: 'Something went very wrong!'
        })
    }
}

function handleCastErrorDB(err) {
    const message = `Invalid ${err.path}: ${err.value}`
    return new AppError(message, 400)
}

function handleDuplicateFieldsDB(err) {
    const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0]
    const message = `Duplicate field value: ${value}. Please use another value!`
    return new AppError(message, 400)
}

function handleValidationErrorDB(err) {
    const errors = Object.values(err.errors).map(el => el.message)
    const message = `Invalid input data. ${errors.join('. ')}`
    return new AppError(message, 400)
}

function handleJWTError() {
    return new AppError('Invalid token. Please log in again!', 401)
}

function handleJWTExpiredError() {
    return new AppError('Your token has expired! Please log in again.', 401)
}

//////////////////////////////////////////////////

export default function globalErrorHandler(err, req, res, next) {
    err.statusCode = err.statusCode || 500
    err.status = err.status || 'error'

    if (process.env.NODE_ENV === 'production') {
        let error = Object.assign(err)

        if (error.code === 11000) error = handleDuplicateFieldsDB(error)

        switch (error.name) {
            case 'CastError':
                error = handleCastErrorDB(error)
                break
            case 'ValidationError':
                error = handleValidationErrorDB(error)
                break
            case 'JsonWebTokenError':
                error = handleJWTError()
                break
            case 'TokenExpiredError':
                error = handleJWTExpiredError()
            default:
                error
        }

        sendErrorProd(error, res)
    } else {
        sendErrorDev(err, res)
    }
}
