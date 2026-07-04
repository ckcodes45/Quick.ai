import React, {useState, useEffect} from 'react'
import {Star} from 'lucide-react'
import axios from 'axios'
import {useAuth} from '@clerk/clerk-react'
import toast from 'react-hot-toast'

const RateCreation = ({creationId, children}) => {

    const {getToken} = useAuth()

    const [rating, setRating] = useState(0)
    const [hoverRating, setHoverRating] = useState(0)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [submitted, setSubmitted] = useState(false)

    useEffect(() => {
        setSubmitted(false)
        setRating(0)
        setHoverRating(0)
        setIsSubmitting(false)
    }, [creationId])

    if(!creationId) return <> {typeof children === 'function' ? children(submitted) : children} </>

    const handleRating = async (selectedRating) => {
        if(!creationId || submitted) return
        setRating(selectedRating)
        setIsSubmitting(true)
        try {
            const {data} = await axios.post('/api/ai/rate-creation', {id: creationId, rating: selectedRating}, {headers: {Authorization: `Bearer ${await getToken()}`}})
            if(data.success) {
                toast.success('Rating saved')
                setSubmitted(true)
            } 
            else toast.error(data.message)
        } 
        catch(error) {
            const errorMessage = error.response?.data?.message || error.message
            console.error("Rate creation error :", errorMessage)
            toast.error(errorMessage)
        } 
        finally {
            setIsSubmitting(false)
        }
    }

    if(submitted) return <> {typeof children === 'function' ? children(submitted) : children} </>

    return (
        <div className='fixed inset-0 bg-black/60 z-[999] flex items-center justify-center p-4 backdrop-blur-sm'>
            <div className='bg-white rounded-2xl shadow-2xl w-full max-w-4xl flex flex-col max-h-[90vh] overflow-hidden'>
                <div className='p-6 bg-slate-800 text-white text-center shrink-0'>
                    <h2 className='text-2xl font-bold mb-2'>Here's Your Result</h2>
                    <p className='opacity-90'>Please rate the result to continue using the tool</p>
                </div>
                <div className='flex-1 overflow-y-auto p-6 bg-slate-50'>
                    <div className='bg-white border border-slate-200 rounded-xl p-6 shadow-sm min-h-[200px]'>
                        {typeof children === 'function' ? children(submitted) : children}
                    </div>
                </div>
                <div className='p-6 border-t border-slate-200 flex flex-col items-center bg-white shrink-0'>
                    <p className='text-sm font-semibold text-slate-700 mb-4 uppercase tracking-wider'>Select a Star Rating</p>
                    <div className='flex gap-3'>
                        {[1, 2, 3, 4, 5].map((item, index) => (
                            <button key={index} onClick={() => handleRating(item)} onMouseEnter={() => setHoverRating(item)} onMouseLeave={() => setHoverRating(0)} disabled={isSubmitting}  type='button' className='focus:outline-none disabled:opacity-50 transition-transform hover:scale-110 cursor-pointer'>
                                <Star className={`w-10 h-10 transition-colors ${item <= (hoverRating || rating) ? 'text-yellow-400 fill-yellow-400 drop-shadow-md' : 'text-gray-200 fill-gray-200'}`}/>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
    
}

export default RateCreation