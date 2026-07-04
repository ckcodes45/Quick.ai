import sql from '../config/neondb.js'

const parseLikes = (likes) => {
    if(typeof likes === 'string') {
        if(likes === "{}" || likes === "") return []
        return likes.replace(/^{|}$/g, '').split(',').filter(Boolean)
    }
    return Array.isArray(likes) ? likes : []
}

export const getUserCreations = async (req, res) => {
    try {
        const {userId} = req.auth()
        const creations = await sql `SELECT * FROM creations WHERE user_id = ${userId} ORDER BY created_at DESC`
        const parsedCreations = creations.map(prev => ({...prev, likes: parseLikes(prev.likes)}))
        res.json({success: true, creations: parsedCreations})
    } 
    catch(error) {
        console.error("Get user creations error :", error)
        res.status(error.status || 500).json({success: false, message: error.message})
    }
}

export const getPublishedCreations = async (req, res) => {
    try {
        const creations = await sql `SELECT * FROM creations WHERE publish = true ORDER BY created_at DESC`
        const parsedCreations = creations.map(prev => ({...prev, likes: parseLikes(prev.likes)}))
        res.json({success: true, creations: parsedCreations})
    } 
    catch(error) {
        console.error("Get published creations error :", error)
        res.status(error.status || 500).json({success: false, message: error.message})
    }
}