import express from 'express'
import {auth} from '../middlewares/auth.js'
import {generateArticle, generateBlogTitle, generateImage, removeImageBackground, removeImageObject, resumeReview, rateCreation, publishCreation} from '../controllers/aiController.js'
import upload from "../middlewares/multer.js"

const aiRouter = express.Router()

aiRouter.post('/generate-article', auth, generateArticle)
aiRouter.post('/generate-blog-titles', auth, generateBlogTitle)
aiRouter.post('/generate-image', auth, generateImage)
aiRouter.post('/remove-image-background', upload.single('image'), auth, removeImageBackground)
aiRouter.post('/remove-image-object', upload.single('image'), auth, removeImageObject)
aiRouter.post('/resume-review', upload.single('resume'), auth, resumeReview)
aiRouter.post('/rate-creation', auth, rateCreation)
aiRouter.post('/publish-creation', auth, publishCreation)

export default aiRouter