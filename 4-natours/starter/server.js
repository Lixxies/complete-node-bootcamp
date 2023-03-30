import mongoose from "mongoose";
import app from "./app.js";

const port = process.env.PORT;
const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);

mongoose
    .connect(DB, {
        useNewUrlParser: true,
    })
    .then(con => console.log('DB connection successful!'))

const tourSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'A tour must have a name'],
        unique: true
    },
    rating: {
        type: Number,
        default: 4.5
    },
    price: {
        type: Number,
        required: [true, 'A tour must have a price']
    }
})

const Tour = mongoose.model('Tour', tourSchema)

const testTour = ({
    name: 'The Park Camper',
    rating: 4.7,
    price: 497
})

////////////////////////////////////////
app.listen(port, () => {
    console.log(`App running on http://localhost:${port}`);
})
