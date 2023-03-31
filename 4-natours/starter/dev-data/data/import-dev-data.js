import dotenv from "dotenv";
dotenv.config({ path: './config.env' })

import mongoose from "mongoose";
import fs from "fs";

import Tour from "../../models/tourModel.js";

const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);

mongoose
    .connect(DB, {
        useNewUrlParser: true,
    })
    .then(con => console.log('DB connection successful!'))

const tours = JSON.parse(fs.readFileSync('./dev-data/data/tours-simple.json', 'utf-8')) 

async function importData() {
    try {
        await Tour.create(tours)
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
