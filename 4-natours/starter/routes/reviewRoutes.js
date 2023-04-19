import express from 'express';

import { getAllReviews, getReview, postReview, patchReview, deleteReview, setTourUserRefs } from '../controllers/reviewController.js';
import { protect, restrictTo } from '../controllers/authController.js';

const router = express.Router({ mergeParams: true })

router.use(protect)

router
    .route('/')
    .get(getAllReviews)
    .post(restrictTo('user'), setTourUserRefs, postReview)

router
    .route('/:id')
    .get(getReview)
    .patch(restrictTo('user', 'admin'), patchReview)
    .delete(restrictTo('user', 'admin'), deleteReview)

export default router
