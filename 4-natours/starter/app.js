import dotenv from "dotenv";
dotenv.config({ path: './config.env' })

import express from "express";
import morgan from "morgan";

import tourRouter from "./routes/tourRoutes.js";
import userRouter from "./routes/userRoutes.js";

const app = express();
const route = '/api/v1/'
const toursRoute = `${route}tours/`
const usersRoute = `${route}users/`

// MIDDLEWARES
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'))
}

app.use(express.json())

app.use((req, res, next) => {
    req.requestTime = new Date().toISOString()
    next()
})

// ROUTES
app.use(toursRoute, tourRouter)
app.use(usersRoute, userRouter)

export default app