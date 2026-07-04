import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import {clerkMiddleware} from '@clerk/express'
import aiRouter from './routes/aiRoutes.js'
import connectCloudinary from './config/cloudinary.js'
import userRouter from './routes/userRoutes.js'
import reviewRouter from './routes/reviewRoutes.js'

const app = express()

connectCloudinary()

app.use(cors())
app.use(express.json())
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`)
    next()
})
app.use(clerkMiddleware())

app.get('/', (req, res) => res.send('Server started running'))

app.use('/api/user', userRouter)
app.use('/api/ai', aiRouter)
app.use('/api/reviews', reviewRouter)

app.use((error, req, res, next) => {
    console.error("Global error handler :", error.message)
    const statusCode = error.status || (error.message.includes('429') ? 429 : 500)
    res.status(statusCode).json({success: false, message: error.message})
})

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {console.log('Server started running on PORT :', PORT)})