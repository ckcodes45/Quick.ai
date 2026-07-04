import express from 'express'
import {requireAuth} from '@clerk/express'
import {getReviews, addReview} from '../controllers/reviewController.js'

const reviewRouter = express.Router()

reviewRouter.get('/get-reviews', getReviews)
reviewRouter.post('/add-review', requireAuth(), addReview)

export default reviewRouter