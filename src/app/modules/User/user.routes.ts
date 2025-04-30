

import express from 'express'
import { UserController } from './user.controller'

const router = express.Router()

router.post('/register', UserController.RegisterUser)
// router.get('/users/')
// router.get('/users/:id')
// router.patch('/users/:id')
// router.delete('/users/:id')


export const UserRoutes = router