import React from 'react'
import { useNavigate } from 'react-router-dom'
import { FaArrowLeft } from 'react-icons/fa'
import { motion } from 'framer-motion'
import { useState } from 'react'
import { serverurl } from '../config'
import axios from 'axios'
import toast from 'react-hot-toast'

const Generate = () => {
  const navigate = useNavigate()
  const [prompt, setPrompt] = useState('')
  const [loading, setLoading] = useState(false)

  const handelGenerateWebsite = async () => {
    if (!prompt.trim() || loading) return
    setLoading(true)
    try {
      const res = await axios.post(
        `${serverurl}/api/website/generate`,
        { prompt },
        { withCredentials: true }
      )

      toast.success('Your Website Generated')
      navigate(`/editor/${res.data.websiteId}`)
    } catch (error) {
      console.log('ERROR:', error.response?.data)
      toast.error('Your Website Not Generated')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-[#050505] via-[#0b0b0b] to-[#050505] text-white'>
      {/* Navbar */}
      <div className='sticky top-0 z-40 backdrop-blur-xl bg-black/50 border-b border-white/10'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between'>
          <div className='flex items-center gap-4'>
            <button
              className='p-2 rounded-lg hover:bg-white/10 transition'
              disabled={loading}
              onClick={() => navigate(-1)}
            >
              <FaArrowLeft />
            </button>

            <h1 className='text-lg sm:text-xl font-semibold'>
              WebGenie <span className='text-zinc-400'>{''}AI</span>
            </h1>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className='max-w-7xl mx-auto px-6 py-10'>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className='text-center mb-10'
        >
          <h1 className='text-4xl md:text-5xl font-bold mb-5 leading-tight'>
            Build Websites with{' '}
            <span className='block bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent'>
              Real AI Power
            </span>
          </h1>

          <p className='text-zinc-400 max-w-2xl mx-auto'>
            This Process May Take Several Minutes. WebGenie AI Focuses on
            Quality, not Shortcuts.
          </p>
        </motion.div>

        {/* textarea */}
        <div className='mb-14'>
          <h1 className='text-xl font-semibold mb-2'>Describe your website</h1>

          <div className='relative'>
            <textarea
              disabled={loading}
              onChange={e => {
                setPrompt(e.target.value)
              }}
              value={prompt}
              placeholder='Describe your website in detail...'
              className='w-full h-56 p-6 rounded-3xl bg-black/60 border border-white/10 outline-none resize-none text-sm leading-relaxed focus:ring-2 focus:ring-white/20 disabled:opacity-50'
            />
          </div>
        </div>

        {/* button */}
        <div className='flex flex-col items-center justify-center gap-4'>
          <motion.button
            onClick={handelGenerateWebsite}
            disabled={loading || !prompt.trim()}
            whileHover={loading || !prompt.trim() ? {} : { scale: 1.05 }}
            whileTap={loading || !prompt.trim() ? {} : { scale: 0.96 }}
            className='px-14 py-4 rounded-2xl font-semibold text-lg bg-white text-black disabled:bg-zinc-800 disabled:text-zinc-500 disabled:cursor-not-allowed flex items-center gap-3 transition'
          >
            {loading && (
              <div className='w-5 h-5 border-2 border-zinc-500 border-t-zinc-300 rounded-full animate-spin'></div>
            )}
            <span>
              {loading ? 'Generating Webpage...' : 'Generate Website'}
            </span>
          </motion.button>

          {loading && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className='text-xs text-zinc-500 text-center max-w-md'
            >
              Our AI is crafting a custom responsive layout with CSS animations.
              This takes about 30-60 seconds.
            </motion.p>
          )}
        </div>
      </div>
    </div>
  )
}

export default Generate
