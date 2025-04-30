

import express from 'express'
import { UserController } from './user.controller'
import validateRequest from '../../middleware/validateRequest'
import { UserValidation } from './user.validation'

const router = express.Router()

router.post('/register', validateRequest(UserValidation.createUserValidation), UserController.RegisterUser)
router.get('/', UserController.getAllUserData)
router.get('/:id', UserController.getUserById)
router.patch('/:id', UserController.UpdateUser)
router.delete('/:id',UserController.DeleteUser)


export const UserRoutes = router