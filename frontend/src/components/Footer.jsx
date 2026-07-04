import {assets} from '../assets/assets'
import {Mail, Phone, MapPin} from 'lucide-react'

const Footer = () => {

    return (
        <footer className='pt-16 mt-20'>
            <div className='px-6 md:px-16 lg:px-24 xl:px-32 w-full max-w-7xl mx-auto'>
                <div className='flex flex-col md:flex-row justify-between w-full gap-12 pb-12'>
                    <div className='md:max-w-md'>
                        <img src={assets.logo} alt="" className='h-9 mb-6' />
                        <p className='text-slate-500 text-sm leading-relaxed'>Experience the power of AI. Transform your content creation with our suite of premium AI tools. From generating high-quality articles to creating custom visuals, Quick.ai provides the tools you need to build faster and smarter.</p>
                    </div>
                    <div className='flex flex-col items-start'>
                        <h3 className='font-bold text-slate-800 text-lg mb-6'>Contact Us</h3>
                        <div className='text-slate-500 text-sm space-y-4'>
                            <div className='flex items-center gap-3 hover:text-slate-800 transition-colors'>
                                <Mail className="w-4 h-4 text-blue-600" />
                                <p>chahatkhandelwal1045@gmail.com</p>
                            </div>
                            <div className='flex items-center gap-3 hover:text-slate-800 transition-colors'>
                                <Phone className="w-4 h-4 text-blue-600" />
                                <p>9340489301</p>
                            </div>
                            <div className='flex items-center gap-3 hover:text-slate-800 transition-colors'>
                                <MapPin className="w-4 h-4 text-blue-600" />
                                <p>C-50, Silicon Avenue, Mumbai, India</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='border-t border-slate-200 py-6 text-center text-xs md:text-sm text-slate-400'>
                    <p>© 2026 Quick.ai. All Rights Reserved.</p>
                </div>
            </div>
        </footer>
    )
    
}

export default Footer