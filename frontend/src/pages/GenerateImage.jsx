import {Image, Sparkles} from 'lucide-react'
import {useState} from 'react'
import axios from 'axios'
import {useAuth} from '@clerk/clerk-react'
import toast from 'react-hot-toast'
import RateCreation from '../components/RateCreation'

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL

const GenerateImage = () => {

  const {getToken} = useAuth()

  const imageStyle = ['Realistic', 'Ghibli', 'Anime', 'Cartoon', 'Fantasy', '3D', 'Portrait']

  const [selectedStyle, setSelectedStyle] = useState('Realistic')
  const [input, setInput] = useState('')
  const [isPublished, setIsPublished] = useState(false)
  const [loading, setLoading] = useState(false)
  const [content, setContent] = useState('')
  const [creationId, setCreationId] = useState(null)
  
  const onSubmitHandler = async (event) => {
    event.preventDefault()
    try {
      setLoading(true)
      const prompt = `Generate an image of "${input}"`
      const {data} = await axios.post('/api/ai/generate-image', {prompt}, {headers: {Authorization: `Bearer ${await getToken()}`}})
      if(data.success) {
      setContent(data.content)
      setCreationId(data.creationId)
      setInput('')
      setSelectedStyle(imageStyle[0])
      setIsPublished(false)
      event.target.reset()
      }
      else toast.error(data.message)
    } 
    catch(error) {
      const errorMessage = error.response?.data?.message || error.message
      toast.error(errorMessage)
    }
    finally {
      setLoading(false)
    }
  }

  const publishHandler = async () => {
    if(!creationId || isPublished) return
    try {
      const {data} = await axios.post('/api/ai/publish-creation', {id: creationId}, {headers: {Authorization: `Bearer ${await getToken()}`}})
      if(data.success) {
        toast.success('Image published')
        setIsPublished(true)
      } 
      else toast.error(data.message)
    } 
    catch(error) {
      const errorMessage = error.response?.data?.message || error.message
      toast.error(errorMessage)
    }
  }

  return (
    <div className='h-full overflow-y-scroll p-6 flex items-start flex-wrap gap-4 text-slate-700'>
      <form onSubmit={onSubmitHandler} className='w-full max-w-lg p-4 bg-white rounded-lg border border-gray-200'>
        <div className='flex items-center gap-3'>
          <Sparkles className='w-6 text-[#00AD25]'/>
          <h1 className='text-xl font-semibold'>Image Generator</h1>
        </div>
        <p className='mt-6 text-sm font-medium'>Image Description</p>
        <textarea onChange={(e) => setInput(e.target.value)} value={input} className='w-full p-2 px-3 mt-2 outline-none text-sm rounded-md border border-gray-300' rows={4} required/>
        <p className='mt-4 text-sm font-medium'>Style</p>
        <div className='mt-3 flex gap-3 flex-wrap sm:max-w-9/11'>
          {imageStyle.map((item) => (
            <span key={item} onClick={() => setSelectedStyle(item)} className={`text-xs px-4 py-1 border rounded-full cursor-pointer ${selectedStyle === item ? 'bg-green-50 text-green-700' : 'text-gray-500 border-gray-300'}`}>{item}</span>
          ))}
        </div>
          <button disabled={loading} className='w-full flex justify-center items-center gap-2 bg-gradient-to-r from-[#00AD25] to-[#04FF50] text-white px-4 py-2 mt-6 text-sm rounded-lg cursor-pointer'>
            {loading ? <span className='w-4 h-4 my-1 rounded-full border-2 border-t-transparent animate-spin'></span> : <Image className='w-5'/>} Generate Image
          </button>
      </form>
      <div className='w-full max-w-lg p-4 bg-white rounded-lg flex flex-col border border-gray-200 min-h-96'>
        <div className='flex items-center gap-3'>
          <Image className='w-5 h-5 text-[#00AD25]'/>
          <h1 className='text-xl font-semibold'>Generated Image</h1>
        </div>
        {!content ? 
          <div className='flex-1 flex justify-center items-center'>
            <div className='text-sm flex flex-col items-center gap-5 text-gray-400'>
              <Image className='w-9 h-9'/>
              <p>Enter a topic and click “Generate Image” to get started</p>
            </div>
          </div>
        : 
          <RateCreation creationId={creationId}>
            {(isSubmitted) => (
              <div className='mt-3 h-full flex flex-col justify-between'>
                <img src={content} alt="" className='w-full h-full object-contain max-h-[60vh]'/>
                {isSubmitted && (
                  <div className="mt-4 flex justify-end">
                      <button onClick={publishHandler} disabled={isPublished} className={`px-4 py-2 text-sm rounded-lg transition-colors ${isPublished ? 'bg-green-100 text-green-700 cursor-not-allowed' : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'}`}>
                        {isPublished ? 'Published to Community' : 'Publish to Community'}
                      </button>
                  </div>
                )}
              </div>
            )}
          </RateCreation>
        }
      </div>
    </div>
  )
  
}

export default GenerateImage