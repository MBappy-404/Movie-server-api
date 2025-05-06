import express from 'express'
import { AdminController } from './admin.controller'
import auth from '../../middleware/auth'
import { UserRole } from '@prisma/client'

const router = express.Router()

router.patch('/:userId/block', AdminController.AdminBlockUser)
router.get('/dashboard-stats', auth(UserRole.ADMIN) ,AdminController.getAdminDashboardStats)


export const AdminRoutes = router