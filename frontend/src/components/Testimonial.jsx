import {assets} from "../assets/assets"
import {useEffect, useState} from "react"
import {Star, Pencil} from "lucide-react"
import axios from "axios"
import {useAuth} from "@clerk/clerk-react"
import toast from "react-hot-toast"

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL

const Testimonial = () => {

    const {isSignedIn, getToken} = useAuth()

    const [reviews, setReviews] = useState([])
    const [showModal, setShowModal] = useState(false)
    const [reviewContent, setReviewContent] = useState("")
    const [rating, setRating] = useState(0)
    const [loading, setLoading] = useState(false)

    const fetchReviews = async () => {
        try {
            const {data} = await axios.get('/api/reviews/get-reviews')
            if(data.success) setReviews(data.reviews)
        }
        catch(error) {
            const errorMessage = error.response?.data?.message || error.message
            console.error("Fetch reviews error :", errorMessage)
        }
    }

    useEffect(() => {
        fetchReviews()
    }, [])

    const submitReview = async (event) => {
        event.preventDefault()
        if(!reviewContent.trim()) {
            toast.error("Review content cannot be empty")
            return
        }
        if(rating === 0) {
            toast.error("Please select a star rating")
            return
        }
        try {
            setLoading(true)
            const {data} = await axios.post('/api/reviews/add-review', {content: reviewContent, rating}, {headers: {Authorization: `Bearer ${await getToken()}`}})
            if(data.success) {
                toast.success("Review added")
                setShowModal(false)
                setReviewContent("")
                setRating(0)
                fetchReviews()
            }
            else toast.error(data.message)
        }
        catch(error) {
            const errorMessage = error.response?.data?.message || error.message
            console.error("Submit review error :", errorMessage)
            toast.error(errorMessage)
        }
        finally {
            setLoading(false)
        }
    }

    return (
        <div className='px-4 sm:px-20 xl:px-32 py-24'>
            <div className='text-center'>
                <h2 className='text-slate-700 text-[42px] font-semibold'>Loved by Creators</h2>
                <p className='text-gray-500 max-w-lg mx-auto'>Don't just take our word for it. Here's what our users are saying.</p>
                <div className="flex justify-center mt-6">
                    <Pencil className='w-7 h-7 text-blue-500 opacity-80'/>
                </div>
                <button 
                    onClick={() => {
                        if(!isSignedIn) {
                            toast.error("Please sign in to add a review")
                            return
                        }
                        setShowModal(true)
                    }}
                    className='mt-3 px-6 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-full hover:shadow-lg transition-all mx-auto'>
                    Add A Review
                </button>
            </div>
            <div className='flex flex-wrap mt-10 justify-center'>
                {reviews.map((item, index) => (
                    <div key={index} className='p-8 m-4 max-w-xs w-full rounded-lg bg-[#FDFDFE] shadow-lg border border-gray-100 hover:-translate-y-1 transition duration-300 cursor-pointer flex flex-col justify-between'>
                        <div>
                            <div className='flex items-center gap-1'>
                                {Array(5).fill(0).map((_, index) => <Star key={index} className={`w-4 h-4 ${index < item.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200 fill-gray-200'}`} />)}
                            </div>
                            <p className='text-gray-500 text-sm my-5'>{item.content}</p>
                        </div>
                        <div>
                            <hr className='mb-5 border-gray-300' />
                            <div className='flex items-center gap-4'>
                                <img src={item.image || assets.profile_img_1} className='w-12 h-12 object-cover rounded-full' alt='' />
                                <div className='text-sm text-gray-600'>
                                    <h3 className='font-medium'>{item.name}</h3>
                                    <p className='text-xs text-gray-500'>{item.title}</p>
                                </div>
                            </div>
                        </div>

                    </div>
                ))}
                {reviews.length === 0 && <p className='text-gray-400 mt-10'>No reviews yet. Be the first to share your experience.</p>}
            </div>
            {showModal && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md relative">
                        <button onClick={() => setShowModal(false)} className='absolute top-4 right-4 text-gray-400 hover:text-gray-600'>✕</button>
                        <h3 className='text-xl font-semibold mb-4 text-slate-700'>Write A Review</h3>
                        <form onSubmit={submitReview}>
                            <div className='mb-4'>
                                <label className='block text-sm font-medium text-gray-700 mb-1'>Your Rating</label>
                                <div className='flex gap-2'>
                                    {[1, 2, 3, 4, 5].map((item, index) => (
                                        <button key={index} onClick={() => setRating(item)} type='button' className='focus:outline-none'>
                                            <Star className={`w-6 h-6 ${item <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200 fill-gray-200'}`} />
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div className='mb-4'>
                                <label className='block text-sm font-medium text-gray-700 mb-1'>Your Review</label>
                                <textarea onChange={(e) => setReviewContent(e.target.value)} value={reviewContent} className='w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none' rows={4} placeholder="Tell us about our AI tools..." required />
                            </div>
                            <button disabled={loading} type='submit' className='w-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg py-2 hover:opacity-90 transition-opacity disabled:opacity-50'>{loading ? "Submitting..." : "Submit Review"}</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
    
}

export default Testimonial