

import express from 'express'
import { UserController } from './user.controller'
import validateRequest from '../../middleware/validateRequest'
import { UserValidation } from './user.validation'
import auth from '../../middleware/auth'
import { UserRole } from '@prisma/client'

const router = express.Router()

router.post('/register', validateRequest(UserValidation.createUserValidation), UserController.RegisterUser)
router.get('/', auth(UserRole.ADMIN), UserController.getAllUserData)
router.get('/:id', UserController.getUserById)
router.patch('/:id',  auth(UserRole.ADMIN, UserRole.USER), UserController.UpdateUser)
router.delete('/:id', auth(UserRole.ADMIN), UserController.DeleteUser)


export const UserRoutes = router