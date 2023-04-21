import mongoose from "mongoose";

import Tour from "./tourModel.js";
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

reviewSchema.statics.calcAverageRatings = async function (tourId) {
    const stats = await this.aggregate([
        {
            $match: { tourRef: tourId }
        },
        {
            $group: {
                _id: '$tourRef',
                nRating: { $sum: 1 },
                avgRating: { $avg: '$rating' }
            }
        }
    ])

    if (stats.length > 0) {
        Tour.findByIdAndUpdate(tourId, {
            ratingsQuantity: stats[0].nRating,
            ratingsAverage: stats[0].avgRating
        })
    } else {
        Tour.findByIdAndUpdate(tourId, {
            ratingsQuantity: 0,
            ratingsAverage: 4.5
        })
    }
}

reviewSchema.index({ tourRef: 1, userRef: 1 }, { unique: true })

reviewSchema.post('save', function () {
    this.constructor.calcAverageRatings(this.tourRef)
})

reviewSchema.pre(/^findOneAnd/, async function (next) {
    this.r = await this.findOne()
    next()
})

reviewSchema.post(/^findOneAnd/, async function () {
    await this.r.constructor.calcAverageRatings(this.r.tourRef)
})

const Review = mongoose.model('Review', reviewSchema)

export default Review
