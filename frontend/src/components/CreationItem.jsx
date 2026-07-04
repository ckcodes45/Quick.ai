import React, {useState} from 'react'
import Markdown from 'react-markdown'
import {Star} from 'lucide-react'

const CreationItem = ({item}) => {

    const [expanded, setExpanded] = useState(false)

    return (
        <div onClick={() => setExpanded(!expanded)} className='p-4 max-w-5xl text-sm bg-white border border-gray-200 rounded-lg cursor-pointer'>
            <div className='flex justify-between items-center gap-4'>
                <div>
                    <h2>{item.prompt}</h2>
                    <p className='text-gray-500'>{item.type} - {new Date(item.created_at).toLocaleDateString()}</p>
                </div>
                <div className='flex items-center gap-1'>
                    {Array(5).fill(0).map((_, index) => <Star key={index} className={`w-4 h-4 ${index < (item.rating || 0) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200 fill-gray-200'}`}/>)}
                </div>
            </div>
            {expanded && 
                <div>
                    {item.type === 'image' ?
                        <div>
                            <img src={item.content} alt="" className='mt-3 w-full max-w-md'/>
                        </div>
                    : 
                        <div className='mt-3 flex-1 min-h-0 overflow-y-scroll text-sm text-slate-700'>
                            <div className='reset-tw'>
                                <Markdown>{item.content}</Markdown>
                            </div>
                        </div>
                    }
                </div>
            }
        </div>
    )
    
}

export default CreationItem