import express from 'express'
import { googleAuth, login, logout, } from '../controllers/auth.controller.js'

const router = express.Router()

router.post('/register',googleAuth)
router.post('/login',login)
router.get('/logout',logout)






export default router