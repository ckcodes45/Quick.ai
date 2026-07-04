import {clerkClient} from '@clerk/express'

export const auth = async (req, res, next) => {
    try {
        const {userId, has} = req.auth()
        const hasPremiumPlan = await has({plan: 'premium'})
        if(hasPremiumPlan) {
            req.plan = 'premium'
            req.free_usage = 0
            return next()
        }
        const user = await clerkClient.users.getUser(userId)
        req.plan = 'free'
        req.free_usage = user.privateMetadata?.free_usage || 0
        next()
    } 
    catch(error) {
        console.error("Auth middleware error :", error.message)
        res.status(error.status || 500).json({success: false, message: error.message})
    }
}