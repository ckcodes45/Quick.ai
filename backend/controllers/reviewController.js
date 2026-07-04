import sql from '../config/neondb.js'
import {clerkClient} from '@clerk/express'

export const getReviews = async (req, res) => {
    try {
        const reviews = await sql `SELECT * FROM reviews ORDER BY created_at ASC`
        res.json({success: true, reviews})
    } 
    catch(error) {
        console.error("Get reviews error :", error)
        res.status(error.status || 500).json({success: false, message: error.message})
    }
}

export const addReview = async (req, res) => {
    try {
        const {userId} = req.auth()
        const {content, rating} = req.body
        if(!content) return res.json({success: false, message: "Review content is required"})
        const userCreations = await sql `SELECT id FROM creations WHERE user_id = ${userId} LIMIT 1`
        if(userCreations.length === 0) return res.json({success: false, message: "You must use atleast one AI tool before leaving a review"})
        const user = await clerkClient.users.getUser(userId)
        const name = user.fullName || user.firstName || "Anonymous"
        const image = user.imageUrl || ""
        const title = "User"
        await sql` INSERT INTO reviews (user_id, name, title, image, content, rating) VALUES (${userId}, ${name}, ${title}, ${image}, ${content}, ${rating || 5})`
        res.json({success: true, message: "Review added"})
    } 
    catch(error) {
        console.error("Add review error :", error)
        res.status(error.status || 500).json({success: false, message: error.message})
    }
}