import express from 'express';

import { getAllUsers, getUser, postUser, patchUser, deleteUser, updateMe, deleteMe, getMe } from '../controllers/userController.js'
import { signup, login, forgotPassword, resetPassword, updatePassword, protect, restrictTo } from '../controllers/authController.js'

const router = express.Router()

router.post('/signup', signup)
router.post('/login', login)

router.post('/forgot-password', forgotPassword)
router.patch('/reset-password/:token', resetPassword)

// Protect all routes after this middleware

router.use(protect) 

router.patch('/update-password', updatePassword)

router.get('/me', getMe, getUser)
router.patch('/update-me', updateMe)
router.patch('/delete-me', deleteMe)

router.use(restrictTo('admin'))

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
