import express from 'express'
import dotenv from 'dotenv'
import connectDB from './src/config/db.js'

import cookieParser from 'cookie-parser'
import cors from 'cors'
import router from './src/routes/auth.routers.js'
import userRouter from './src/routes/user.routes.js'
import webRouter from './src/routes/website.routes.js'
dotenv.config()

const app = express()
const port = process.env.PORT || 3001
connectDB()

app.use(express.json())
app.use(cookieParser())
app.use(
  cors({
    origin: ['http://localhost:5174', 'https://webgenie-ai-u89a.onrender.com'],
    credentials: true
  })
)

app.use('/api/auth', router)

//user
app.use('/api/user', userRouter)

app.use('/api/website', webRouter)

app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})
export default app
