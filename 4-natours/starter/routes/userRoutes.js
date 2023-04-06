import express from 'express';

import { getAllUsers, getUser, postUser, patchUser, deleteUser } from '../controllers/userController.js'
import { signup, login } from '../controllers/authController.js'

const router = express.Router()

router.post('/signup', signup)

router.post('/login', login)

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
