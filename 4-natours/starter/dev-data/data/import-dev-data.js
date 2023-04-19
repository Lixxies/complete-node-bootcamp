import dotenv from "dotenv";
dotenv.config({ path: './config.env' })

import mongoose from "mongoose";
import fs from "fs";

import Tour from "../../models/tourModel.js";
import Review from "../../models/reviewModel.js";
import User from "../../models/userModel.js";

const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);

await mongoose
    .connect(DB, {
        bufferCommands: false,
    })
    .then(con => console.log('DB connection successful!'))

const data = JSON.parse(fs.readFileSync('./dev-data/data/users.json', 'utf-8'))

async function importData() {
    try {
        await User.create(data, {
            validateBeforeSave: false
        })
        console.log('Data successfully loaded!')
    }
    catch (err) {
        console.log(err)
    }

    process.exit()
}

async function deleteData() {
    try {
        await Tour.deleteMany()
        console.log('Data successfully deleted!')

    }
    catch (err) {
        console.log(err)
    }

    process.exit()
}

if (process.argv[2] === '--import') {
    importData()
} else if (process.argv[2] === '--delete') {
    deleteData()
}
