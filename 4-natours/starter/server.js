import mongoose from "mongoose";
import app from "./app.js";

const port = process.env.PORT;
const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);

mongoose
    .connect(DB, {
        useNewUrlParser: true,
    })
    .then(con => console.log('DB connection successful!'))

////////////////////////////////////////
app.listen(port, () => {
    console.log(`App running on http://localhost:${port}`);
})
