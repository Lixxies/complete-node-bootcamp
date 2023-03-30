import express from 'express';

import { getAllTours, getTour, postTour, patchTour, deleteTour, checkID, checkBody } from '../controllers/tourController.js'

const router = express.Router()

router.param('id', checkID)

router
    .route('/')
    .get(getAllTours)
    .post(checkBody, postTour)

router
    .route('/:id')
    .get(getTour)
    .patch(patchTour)
    .delete(deleteTour)

export default router
