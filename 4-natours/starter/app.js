import dotenv from "dotenv";
dotenv.config({ path: './config.env' })

import express from "express";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import mongoSanitize from "express-mongo-sanitize";
import xss from "xss-clean";
import hpp from "hpp";

import tourRouter from "./routes/tourRoutes.js";
import userRouter from "./routes/userRoutes.js";
import AppError from "./utils/appError.js";
import globalErrorHandler from "./controllers/errorController.js";

const app = express();
const route = '/api/v1/'
const toursRoute = `${route}tours/`
const usersRoute = `${route}users/`

// MIDDLEWARES
app.use(helmet())

if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'))
}

const limiter = rateLimit({
    max: 100,
    windowMs: 60 * 60 * 1000,
    message: 'Too many requests from this IP, please try again in an hour!'
})

app.use('/api', limiter)

app.use(express.json({ limit: '10kb' }))

app.use(mongoSanitize())

app.use(xss())

app.use(hpp({
    whitelist: ['duration', 'ratingsAverage', 'ratingsQuantity', 'maxGroupSize', 'difficulty', 'price']
}))

// ROUTES
app.use(toursRoute, tourRouter)
app.use(usersRoute, userRouter)

app.all('*', (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404))
})

app.use(globalErrorHandler)

export default app
