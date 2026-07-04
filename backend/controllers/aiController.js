import sql from '../config/neondb.js'
import {clerkClient} from '@clerk/express'
import axios from 'axios'
import {v2 as cloudinary} from 'cloudinary'
import fs from 'fs'
import pdf from 'pdf-parse/lib/pdf-parse.js'

const callGemini = async (prompt) => {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`
    const response = await axios.post(url, {
        contents: [{parts: [{text: prompt}]}],
        generationConfig: {temperature: 0.7}
    })
    return response.data.candidates[0].content.parts[0].text
}

export const generateArticle = async (req, res) => {
    try {
        const {userId} = req.auth()
        const {prompt, length} = req.body
        const plan = req.plan
        const free_usage = req.free_usage
        if(plan !== 'premium' && free_usage >= 10) return res.json({success: false, message: "Limit reached, upgrade to continue"})
        const content = await callGemini(`${prompt} (Write approximately ${length} words)`)
        const [creation] = await sql `INSERT INTO creations (user_id, prompt, content, type) VALUES (${userId}, ${prompt}, ${content}, 'article') RETURNING id`
        if(plan !== 'premium') {
            await clerkClient.users.updateUserMetadata(userId, {
                privateMetadata: {
                    free_usage: free_usage + 1
                }
            })
        }
        res.json({success: true, content, creationId: creation.id})
    } 
    catch(error) {
        console.error(error)
        if(error.status === 429 || error.message.includes('429')) return res.json({success: false, message: "AI rate limit reached, please wait for few minutes to resume"})
        res.json({success: false, message: error.message})
    }
}

export const generateBlogTitle = async (req, res) => {
    try {
        const {userId} = req.auth()
        const {prompt} = req.body
        const plan = req.plan
        const free_usage = req.free_usage
        if(plan !== 'premium' && free_usage >= 10) return res.json({success: false, message: "Free usage limit reached, please upgrade to continue"})
        const content = await callGemini(prompt);
        const [creation] = await sql `INSERT INTO creations (user_id, prompt, content, type) VALUES (${userId}, ${prompt}, ${content}, 'blog-titles') RETURNING id`
        if(plan !== 'premium') {
            await clerkClient.users.updateUserMetadata(userId, {
                privateMetadata: {
                    free_usage: free_usage + 1
                }
            })
        }
        res.json({success: true, content, creationId: creation.id})
    } 
    catch(error) {
        console.error(error)
        if(error.status === 429 || error.message.includes('429')) return res.json({success: false, message: "AI rate limit reached, please wait for few minutes to resume"})
        res.json({success: false, message: error.message})
    }
}

export const generateImage = async (req, res) => {
    try {
        const {userId} = req.auth()
        const {prompt, publish} = req.body
        const plan = req.plan
        if(plan !== 'premium') return res.json({success: false, message: "This feature is only available for premium subscriptions"})
        const formData = new FormData()
        formData.append('prompt', prompt)
        const {data} = await axios.post("https://clipdrop-api.co/text-to-image/v1", formData, {
            headers: {'x-api-key': process.env.CLIPDROP_API_KEY},
            responseType: "arraybuffer"
        })
        const base64Image = `data:image/png;base64,${Buffer.from(data, 'binary').toString('base64')}`
        const {secure_url} = await cloudinary.uploader.upload(base64Image)
        const [creation] = await sql `INSERT INTO creations (user_id, prompt, content, type, publish) VALUES (${userId}, ${prompt}, ${secure_url}, 'image', ${publish ?? false}) RETURNING id`
        res.json({success: true, content: secure_url, creationId: creation.id})
    } 
    catch(error) {
        console.error(error)
        if(error.status === 429 || error.message.includes('429')) return res.json({success: false, message: "AI rate limit reached, please wait for few minutes to resume"})
        res.json({success: false, message: error.message})
    }
}

export const removeImageBackground = async (req, res) => {
    try {
        const {userId} = req.auth();
        const image = req.file;
        const plan = req.plan;
        if(plan !== 'premium') return res.json({success: false, message: "This feature is only available for premium subscriptions"})
        const {secure_url} = await cloudinary.uploader.upload(image.path, {
            transformation: [{
                effect: 'background_removal',
                background_removal: 'remove_the_background'
            }]
        })
        const [creation] = await sql `INSERT INTO creations (user_id, prompt, content, type) VALUES (${userId}, 'Remove background from the uploaded image', ${secure_url}, 'image') RETURNING id`
        res.json({success: true, content: secure_url, creationId: creation.id})
    } 
    catch(error) {
        console.error(error)
        if(error.status === 429 || error.message.includes('429')) return res.json({success: false, message: "AI rate limit reached, please wait for few minutes to resume"})
        res.json({success: false, message: error.message}) 
    }
}

export const removeImageObject = async (req, res) => {
    try {
        const {userId} = req.auth()
        const {object} = req.body
        const image = req.file
        const plan = req.plan
        if(plan !== 'premium') return res.json({success: false, message: "This feature is only available for premium subscriptions"})
        const {secure_url} = await cloudinary.uploader.upload(image.path, {
            transformation: [{
                effect: `gen_remove:${object}`
            }]
        })
        const [creation] = await sql `INSERT INTO creations (user_id, prompt, content, type) VALUES (${userId}, ${`Remove "${object}" from the uploaded image`}, ${secure_url}, 'image') RETURNING id`
        res.json({success: true, content: secure_url, creationId: creation.id})
    } 
    catch(error) {
        console.error(error)
        if(error.status === 429 || error.message.includes('429')) return res.json({success: false, message: "AI rate limit reached, please wait for few minutes to resume"})
        res.json({success: false, message: error.message}) 
    }
}

export const resumeReview = async (req, res) => {
    try {
        const {userId} = req.auth()
        const resume = req.file
        const plan = req.plan
        if(plan !== 'premium') return res.json({success: false, message: "This feature is only available for premium subscriptions"})
        if(resume.size > 5 * 1024 * 1024) return res.json({success: false, message: "Resume pdf size exceeds the allowed size (5MB)"})
        const dataBuffer = fs.readFileSync(resume.path)
        const pdfData = await pdf(dataBuffer)
        const prompt = `Review the following resume and provide constructive feedback on its strengths, weaknesses, and areas for improvement. Resume Content:\n\n${pdfData.text}`
        const content = await callGemini(prompt)
        const [creation] = await sql `INSERT INTO creations (user_id, prompt, content, type) VALUES (${userId}, 'Review the uploaded resume', ${content}, 'resume-review') RETURNING id`
        res.json({success: true, content, creationId: creation.id})
    } 
    catch(error) {
        console.error(error)
        if(error.status === 429 || error.message.includes('429')) return res.json({success: false, message: "AI rate limit reached, please wait for few minutes to resume"})
        res.json({success: false, message: error.message}) 
    }
}

export const rateCreation = async (req, res) => {
    try {
        const {userId} = req.auth()
        const {id, rating} = req.body
        if(!id || !rating) return res.json({success: false, message: "Creation ID and rating are required"})
        const [creation] = await sql `SELECT id FROM creations WHERE id = ${id} AND user_id = ${userId}`
        if(!creation) return res.json({success: false, message: "Creation not found or unauthorized access"})
        await sql `UPDATE creations SET rating = ${rating} WHERE id = ${id}`
        res.json({success: true, message: "Rating updated."})
    } 
    catch(error) {
        console.error("Rate creation error :", error)
        res.status(500).json({success: false, message: error.message})
    }
}

export const publishCreation = async (req, res) => {
    try {
        const {userId} = req.auth();
        const {id} = req.body;
        if(!id) return res.json({success: false, message: "Creation ID is required"})
        const [creation] = await sql `SELECT id FROM creations WHERE id = ${id} AND user_id = ${userId}`
        if(!creation) return res.json({success: false, message: "Creation not found or unauthorized access"})
        await sql `UPDATE creations SET publish = true WHERE id = ${id}`
        res.json({success: true, message: "Published to community"})
    } 
    catch(error) {
        console.error("Publish creation error :", error)
        res.status(500).json({success: false, message: error.message})
    }
}