import express from 'express'
import { googleAuth, login, logout, } from '../controllers/auth.controller.js'
import isAuth from '../middlewares/isAuth.js'
import { generatedemo, getCurrentUser } from '../controllers/user.controller.js'

const userRouter = express.Router()
userRouter.get('/me',isAuth,getCurrentUser)
userRouter.post('/gen', isAuth, generatedemo)







export default userRouter