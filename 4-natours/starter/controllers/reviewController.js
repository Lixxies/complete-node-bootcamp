import Review from '../models/reviewModel.js';
import { createOne, deleteOne, getAll, getOne, updateOne } from './handlerFactory.js';

export const getAllReviews = getAll(Review)
export const getReview = getOne(Review)

export function setTourUserRefs(req, res, next) {
    if (!req.body.tourRef) req.body.tourRef = req.params.tourId
    if (!req.body.userRef) req.body.userRef = req.user.id
    next()
}

export const postReview = createOne(Review)
export const patchReview = updateOne(Review)
export const deleteReview = deleteOne(Review)
