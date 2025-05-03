import express from 'express'
import { AdminController } from './admin.controller'

const router = express.Router()

router.patch('/:userId/block', AdminController.AdminBlockUser)


export const AdminRoutes = router