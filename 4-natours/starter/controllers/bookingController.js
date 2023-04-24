import Stripe from 'stripe'

import Booking from '../models/bookingModel.js'
import Tour from '../models/tourModel.js'
import catchAsync from '../utils/catchAsync.js'
import { createOne, deleteOne, getAll, getOne, updateOne } from './handlerFactory.js'

export const postBooking = createOne(Booking)
export const getAllBookings = getAll(Booking)
export const getBooking = getOne(Booking)
export const patchBooking = updateOne(Booking)
export const deleteBooking = deleteOne(Booking)

export const getCheckoutSession = catchAsync(async function (req, res, next) {
    const tour = await Tour.findById(req.params.tourID)

    const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        success_url: `${req.protocol}://${req.get('host')}/?tour=${req.params.tourID}&user=${req.user.id}&price=${tour.price}`,
        cancel_url: `${req.protocol}://${req.get('host')}/tour/${tour.slug}`,
        customer_email: req.user.email,
        client_reference_id: req.params.tourID,
        line_items: [
            {
                quantity: 1,
                price_data: {
                    currency: 'eur',
                    unit_amount: tour.price * 100,
                    product_data: {
                        name: `${tour.name} Tour`,
                        description: tour.summary,
                        images: [`https://www.natours.dev/img/tours/${tour.imageCover}`]
                    }
                }
            }
        ],
        mode: 'payment'
    })

    res.status(200).json({
        status: 'success',
        session
    })
})

export const createBookingCheckout = catchAsync(async function(req, res, next) {
    // Since the project is not deployed, this solution is only TEMPORARY, because it's UNSECURE: everyone can make bookings without paying
    const { tour, user, price} = req.query

    if (!tour || !user || !price) {
        return next()
    }

    await Booking.create({ 
        tourRef: tour, 
        userRef: user, 
        price 
    })

    res.redirect(req.originalUrl.split('?')[0])
})
