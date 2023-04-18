import express from 'express';

import { getAllReviews, getReview, postReview, patchReview, deleteReview, setTourUserRefs } from '../controllers/reviewController.js';
import { protect, restrictTo } from '../controllers/authController.js';

const router = express.Router({ mergeParams: true })

router
    .route('/')
    .get(getAllReviews)
    .post(protect, restrictTo('user'), setTourUserRefs, postReview)

router
    .route('/:id')
    .get(getReview)
    .patch(protect, patchReview)
    .delete(protect, deleteReview)

export default router
