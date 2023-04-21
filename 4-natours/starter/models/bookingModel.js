import mongoose from "mongoose";

import dateNowFixed from "../utils/dateNowFixed.js";

const bookingSchema = new mongoose.Schema({
    tourRef: {
        type: mongoose.Schema.ObjectId,
        ref: 'Tour',
        required: [true, 'Booking must belong to a tour.']
    },
    userRef: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true, 'Booking must belong to a user.']
    },
    price: {
        type: Number,
        required: [true, 'Booking must have a price.']
    },
    createdAt: {
        type: Date,
        default: dateNowFixed()
    },
    paid: {
        type: Boolean,
        default: true
    }
},
{
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
})

bookingSchema.pre(/^find/, function(next) {
    this
        .populate('userRef')
        .populate({
            path: 'tourRef',
            select: 'name'
        })
    
    next()
})

const Booking = mongoose.model('Booking', bookingSchema)

export default Booking
