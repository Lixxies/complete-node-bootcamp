import mongoose from "mongoose";

import dateNowFixed from "../utils/dateNowFixed.js";

const reviewSchema = new mongoose.Schema({
    review: {
        type: String,
        required: [true, 'Please share your opinion about the tour.'],
        minlength: [10, 'A review name must have more or equal then 10 characters']
    },
    rating: {
        type: Number,
        min: 1,
        max: 5
    },
    createdAt: {
        type: Date,
        default: dateNowFixed()
    },
    tourRef: {
        type: mongoose.Schema.ObjectId,
        ref: "Tour",
        required: [true, 'Review must belong to a tour.']
    },
    userRef: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: [true, 'Review must belong to a user.']
    }
},
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    })

reviewSchema.pre(/^find/, function (next) {
    this.populate({
        path: 'userRef',
        select: 'name photo'
    })
    next()
})

const Review = mongoose.model('Review', reviewSchema)

export default Review
