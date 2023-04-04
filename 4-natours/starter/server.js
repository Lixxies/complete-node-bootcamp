import mongoose from "mongoose";

import appShutdown from "./utils/appShutdown.js";

process.on('unhandledRejection', err => appShutdown(err))

process.on('uncoughtException', err => appShutdown(err))

import app from "./app.js";

const port = process.env.PORT;
const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);

mongoose
    .connect(DB, {
        useNewUrlParser: true,
    })
    .then(con => console.log('DB connection successful!'))

////////////////////////////////////////
const server = app.listen(port, () => {
    console.log(`App running on http://localhost:${port}`);
})
