import express from 'express';

import { aliasTopTours, getAllTours, getTour, postTour, patchTour, deleteTour, getTourStats, getMonthlyPlan } from '../controllers/tourController.js'

const router = express.Router()

router
    .route('/')
    .get(getAllTours)
    .post(postTour)

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
    .patch(patchTour)
    .delete(deleteTour)

export default router
