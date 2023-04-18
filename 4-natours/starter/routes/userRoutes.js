import express from 'express';

import { getAllUsers, getUser, postUser, patchUser, deleteUser, updateMe, deleteMe } from '../controllers/userController.js'
import { signup, login, forgotPassword, resetPassword, updatePassword, protect, restrictTo } from '../controllers/authController.js'

const router = express.Router()

router.post('/signup', signup)
router.post('/login', login)

router.post('/forgot-password', forgotPassword)
router.patch('/reset-password/:token', resetPassword)
router.patch('/update-password', protect, updatePassword)

router.patch('/update-me', protect, updateMe)
router.patch('/delete-me', protect, deleteMe)

router
    .route('/')
    .get(protect, restrictTo('admin'), getAllUsers)
    .post(postUser)

router
    .route('/:id')
    .get(protect, restrictTo('admin'), getUser)
    .patch(protect, restrictTo('admin'), patchUser)
    .delete(protect, restrictTo('admin'), deleteUser)

export default router
