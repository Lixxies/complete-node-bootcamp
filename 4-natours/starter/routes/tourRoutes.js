import express from 'express';

import { aliasTopTours, getAllTours, getTour, postTour, patchTour, deleteTour, getTourStats, getMonthlyPlan } from '../controllers/tourController.js'
import { protect, restrictTo } from '../controllers/authController.js'
import reviewRouter from './reviewRoutes.js'

const router = express.Router()

router.use('/:tourId/reviews', reviewRouter)

router
    .route('/')
    .get(protect, getAllTours)
    .post(protect, restrictTo('admin', 'lead-guide'), postTour)

router
    .route('/top-5-cheap')
    .get(aliasTopTours, getAllTours)

router
    .route('/tour-stats')
    .get(getTourStats)

router
    .route('/monthly-plan/:year')
    .get(getMonthlyPlan)

router
    .route('/:id')
    .get(getTour)
    .patch(protect, restrictTo('admin', 'lead-guide'), patchTour)
    .delete(protect, restrictTo('admin', 'lead-guide'), deleteTour)

export default router
