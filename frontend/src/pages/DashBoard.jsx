import React, { useEffect, useState } from 'react'
import { FaArrowLeft, FaExternalLinkAlt, FaPlus, FaGlobe, FaEdit } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useSelector } from 'react-redux'
import axios from 'axios'
import { serverurl } from '../config/axios'


const DashBoard = () => {
  const navigate = useNavigate()
  const userData = useSelector(state => state.user.userData)
  const [websites, setWebsites] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchWebsites = async () => {
      try {
        const res = await axios.get(`${serverurl}/api/website/get-all`, {
          withCredentials: true
        })
        setWebsites(res.data)
      } catch (error) {
        console.error('Error fetching websites:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchWebsites()
  }, [])

  return (
    <div className='min-h-screen bg-[#050505] text-white'>
      {/* Header */}
      <div className='sticky top-0 z-40 backdrop-blur-xl bg-black/50 border-b border-white/10'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between'>
          {/* Left */}
          <div className='flex items-center gap-4'>
            <button
              onClick={() => navigate('/')}
              className='p-2 rounded-lg hover:bg-white/10 transition'
            >
              <FaArrowLeft />
            </button>

            <h1 className='text-lg sm:text-xl font-semibold'>Dashboard</h1>
          </div>

          {/* Right */}
          <button
            className='flex items-center gap-2 px-4 py-2 rounded-lg text-black bg-white text-sm font-semibold hover:scale-105 transition'
            onClick={() => {
              navigate('/generate')
            }}
          >
            <FaPlus size={12} />
            <span>New Project</span>
          </button>
        </div>
      </div>

      <div className='max-w-7xl mx-auto px-6 py-10'>
        {/* Profile/Welcome banner */}
        <motion.div
          className='mb-12'
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <p className='text-sm text-zinc-400 mb-1'>Welcome Back</p>
          <h1 className='text-3xl font-bold bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent'>
            {userData?.user?.name}
          </h1>
          {userData?.user && (
            <p className='text-xs text-zinc-500 mt-1'>
              Available Credits: <span className='text-white font-semibold'>{userData.user.credits}</span>
            </p>
          )}
        </motion.div>

        {/* Projects Section */}
        <div>
          <h2 className='text-xl font-semibold mb-6'>Your Projects</h2>

          {loading ? (
            <div className='flex items-center justify-center py-20'>
              <div className='w-8 h-8 border-4 border-white/20 border-t-white rounded-full animate-spin'></div>
            </div>
          ) : websites.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className='text-center py-20 border border-dashed border-white/10 rounded-2xl bg-white/2'
            >
              <p className='text-zinc-500 mb-4'>No websites generated yet</p>
              <button
                onClick={() => navigate('/generate')}
                className='px-6 py-2.5 rounded-lg bg-white/10 border border-white/15 text-sm font-medium hover:bg-white/15 transition'
              >
                Create your first website
              </button>
            </motion.div>
          ) : (
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
              {websites.map((web, idx) => (
                <motion.div
                  key={web._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className='group relative rounded-2xl bg-zinc-950 border border-white/10 p-6 hover:border-white/20 transition flex flex-col justify-between h-48'
                >
                  <div>
                    <div className='flex items-start justify-between gap-2 mb-2'>
                      <h3 className='font-semibold text-lg truncate flex-1 group-hover:text-purple-400 transition'>
                        {web.title || 'Untitled Website'}
                      </h3>
                      {web.deployed ? (
                        <span className='inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'>
                          Live
                        </span>
                      ) : (
                        <span className='inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-zinc-500/10 text-zinc-400 border border-zinc-500/20'>
                          Draft
                        </span>
                      )}
                    </div>
                    <p className='text-xs text-zinc-500'>
                      Created: {new Date(web.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                  <div className='flex items-center gap-3 mt-4'>
                    <button
                      onClick={() => navigate(`/editor/${web._id}`)}
                      className='flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-xl bg-white text-black font-semibold text-sm hover:bg-zinc-200 transition'
                    >
                      <FaEdit size={14} />
                      <span>Edit</span>
                    </button>

                    {web.deployed && (
                      <a
                        href={web.deployedUrl}
                        target='_blank'
                        rel='noopener noreferrer'
                        className='p-2 rounded-xl border border-white/10 hover:bg-white/5 text-zinc-400 hover:text-white transition'
                        title='View deployed site'
                      >
                        <FaExternalLinkAlt size={14} />
                      </a>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default DashBoard
