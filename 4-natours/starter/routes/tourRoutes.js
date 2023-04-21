import express from 'express';

import { aliasTopTours, getAllTours, getTour, postTour, patchTour, deleteTour, getTourStats, getMonthlyPlan, getToursWithin, getDistances, uploadTourImages, resizeTourImages } from '../controllers/tourController.js'
import { protect, restrictTo } from '../controllers/authController.js'
import reviewRouter from './reviewRoutes.js'

const router = express.Router()

router.use('/:tourId/reviews', reviewRouter)

router
    .route('/tours-within/:distance/center/:latlng/unit/:unit')
    .get(getToursWithin)

router
    .route('/distances/:latlng/unit/:unit')
    .get(getDistances)

router
    .route('/')
    .get(getAllTours)
    .post(protect, restrictTo('admin', 'lead-guide'), postTour)

router
    .route('/top-5-cheap')
    .get(aliasTopTours, getAllTours)

router
    .route('/tour-stats')
    .get(getTourStats)

router
    .route('/monthly-plan/:year')
    .get(protect, restrictTo('admin', 'lead-guide', 'guide'), getMonthlyPlan)

router
    .route('/:id')
    .get(getTour)
    .patch(protect, restrictTo('admin', 'lead-guide'), uploadTourImages, resizeTourImages, patchTour)
    .delete(protect, restrictTo('admin', 'lead-guide'), deleteTour)

export default router
