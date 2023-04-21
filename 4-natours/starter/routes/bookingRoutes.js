import express from 'express';

import {  getCheckoutSession, getAllBookings, postBooking, getBooking, patchBooking, deleteBooking } from '../controllers/bookingController.js';
import { protect, restrictTo } from '../controllers/authController.js';

const router = express.Router()

router.use(protect)

router
    .route('/checkout-sesson/:tourID')
    .get(getCheckoutSession)

router.use(restrictTo('admin,', 'lead-guide'))
    
router
    .route('/')
    .get(getAllBookings)
    .post(postBooking)

router.use(restrictTo('user', 'admin'))

router
    .route('/:id')
    .get(getBooking)
    .patch(patchBooking)
    .delete(deleteBooking)

export default router
