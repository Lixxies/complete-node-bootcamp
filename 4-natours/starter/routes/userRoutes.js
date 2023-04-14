import express from 'express';

import { getAllUsers, getUser, postUser, patchUser, deleteUser, updateMe, deleteMe } from '../controllers/userController.js'
import { signup, login, forgotPassword, resetPassword, updatePassword, protect } from '../controllers/authController.js'

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
    .get(getAllUsers)
    .post(postUser)

router
    .route('/:id')
    .get(getUser)
    .patch(patchUser)
    .delete(deleteUser)

export default router
