import React, { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Sparkles, Code2, Layout, Zap, ArrowRight } from 'lucide-react'
import LoginModel from '../components/LoginModel'
import { useDispatch, useSelector } from 'react-redux'
import { serverurl } from '../config/axios'

import axios from 'axios'
import { setUserData } from '../redux/userSlice'
import { useNavigate } from 'react-router-dom'
import PricingModal from '../components/PricingModal'
import toast from 'react-hot-toast'

const Home = () => {
  const highlights = [
    {
      title: 'AI Generated Code',
      desc: 'Our advanced neural networks produce semantic, clean, and efficient code tailored to your exact requirements.',
      icon: <Code2 className='text-purple-400' size={24} />
    },
    {
      title: 'Fully Responsive',
      desc: 'Generate layouts that adapt flawlessly to any screen size, ensuring a premium experience for all your users.',
      icon: <Layout className='text-blue-400' size={24} />
    },
    {
      title: 'Production Ready',
      desc: 'Get production-grade output following industry best practices, ready to be deployed instantly to the web.',
      icon: <Zap className='text-indigo-400' size={24} />
    }
  ]
  const navigate = useNavigate()
  const [opengoogle, setOpenGoogle] = useState(false)
  const [showPricing, setShowPricing] = useState(false)
  const userData = useSelector(state => state.user.userData)

  const [openProfile, setOpenProfile] = useState(false)
  const dispatch = useDispatch()
  const handelLogout = async () => {
    try {
      const result = await axios.get(`${serverurl}/api/auth/logout`, {
        withCredentials: true
      })
      dispatch(setUserData(null))
      setOpenProfile(false)
      // window.location.reload()
      toast.success('Logout Successful')
    } catch (error) {
      toast.error('Logout Unsuccessful')
      console.log(error)
    }
  }

  return (
    <div className='relative min-h-screen bg-[#0A0A0F] text-white overflow-hidden selection:bg-purple-500/30'>
      {/* Background Ambient Glows */}
      <div className='absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10'>
        <div className='absolute -top-[10%] -left-[10%] w-[50%] h-[50%] bg-purple-600/10 blur-[120px] rounded-full animate-pulse' />
        <div className='absolute top-[20%] -right-[10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full' />
        <div className='absolute -bottom-[10%] left-[20%] w-[45%] h-[45%] bg-indigo-600/10 blur-[120px] rounded-full animate-pulse' />
      </div>

      <motion.div
        className='fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-black/20 border-b border-white/5'
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        <div className='max-w-7xl mx-auto px-6 py-4 flex justify-between items-center'>
          <div className='text-lg font-semibold'>
            WebGenie <span className='text-zinc-400'>{''}AI</span>
          </div>
          <div className='flex items-center gap-5'>
            {userData && (
              <div
                className='hidden md:inline text-sm text-zinc-400 hover:text-white cursor-pointer transition-colors'
                onClick={() => setShowPricing(true)}
              >
                Pricing
              </div>
            )}
            {userData && (
              <div className='hidden md:flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-sm cursor-pointer hover:bg-white/10 transition-all active:scale-95'>
                <span>Credits</span>:<span>{userData.user.credits}</span>
              </div>
            )}
            {!userData ? (
              <button
                className='px-5 py-2 rounded-xl bg-white text-black font-semibold text-sm hover:brightness-110 transition-all active:scale-95 shadow-lg shadow-white/5'
                onClick={() => setOpenGoogle(true)}
              >
                Get started
              </button>
            ) : (
              <div className='relative'>
                <button
                  className=' flex items-center '
                  onClick={() => setOpenProfile(!openProfile)}
                >
                  <img
                    className='w-9 h-9 rounded-full border border-white/20 object-cover'
                    src={
                      userData.user?.avatar ||
                      `https://ui-avatars.com/api/?name=${userData.user.name}`
                    }
                    alt=''
                  />
                </button>
                <AnimatePresence>
                  {openProfile && (
                    <>
                      <motion.div
                        className='absolute right-0 mt-3 w-64 z-5 rounded-[1.5rem] bg-[#0A0A0F]/90 backdrop-blur-2xl border border-white/10 shadow-2xl overflow-hidden'
                        initial={{ y: -10, scale: 0.95, opacity: 0 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      >
                        <div className='px-4 py-3 border-b border-white/10 '>
                          <p className='text-sm font-medium truncate'>
                            {userData.user.name}
                          </p>
                          <p className='text-xs text-zinc-500 truncate'>
                            {userData.user.email}
                          </p>
                        </div>
                        <button className='md:hidden w-full flex gap-2 items-center px-4 py-4 bg-white/5 border-b border-white/5 text-sm cursor-pointer hover:bg-white/10 transition'>
                          <div>
                            <span>Credits</span>:
                            <span>{userData.user.credits}</span>
                          </div>
                        </button>
                        <button
                          className='w-full items-center justify-center px-4 py-3 text-left text-sm hover:bg-white/5 transition-colors'
                          onClick={() => navigate('/dashboard')}
                        >
                          Dashboard
                        </button>
                        <button
                          className=' w-full px-4 py-4 text-left text-sm hover:bg-red-500/10 text-red-500 transition-colors font-medium'
                          onClick={handelLogout}
                        >
                          Logout
                        </button>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>
      </motion.div>
      <section className='pt-44 pb-32 px-6 text-center'>
        <motion.h1
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.2 }}
          className='text-5xl md:text-7xl font-bold tracking-tight'
        >
          Build Stunning Website <br />
          <span className='bg-linear-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent'>
            with AI
          </span>
        </motion.h1>
        <motion.p
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.2 }}
          className='mt-8 max-w-2xl mx-auto text-zinc-400 text-lg'
        >
          Describe your idea and let AI generate a modern, responsive,
          production-ready website.
        </motion.p>
        <motion.div
          className='mt-15'
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.2 }}
        >
          <button
            className='px-10 py-4 rounded-xl bg-white text-black font-semibold hover:scale-105 transition '
            onClick={() => {
              if (userData) {
                navigate('/dashboard')
              } else {
                setOpenGoogle(true)
              }
            }}
          >
            {userData ? 'Go to Dashboard' : ' Get Started'}
          </button>
        </motion.div>
      </section>
      <section className='mx-7xl mx-auto px-6 pb-32'>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-10'>
          {highlights.map((h, i) => (
            <motion.div
              key={i}
              initial={{ y: 40, opacity: 0 }}
              whileInView={{ opacity: 1, y: 0 }}
              className='rounded-2xl bg-white/5 border border-white/10 p-8'
            >
              <div className='mb-4'>{h.icon}</div>
              <h1 className='text-xl font-semibold mb-3'>{h.title}</h1>
              <p className='text-sm text-zinc-400'>{h.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>
      <footer className='border-t border-white/10 py-10 text-center text-sm text-zinc-500'>
        &copy; {new Date().getFullYear()} WebGenie AI All rights reserved.
      </footer>
      {opengoogle && (
        <LoginModel open={opengoogle} onClose={() => setOpenGoogle(false)} />
      )}
      <PricingModal
        isOpen={showPricing}
        onClose={() => setShowPricing(false)}
      />
    </div>
  )
}

export default Home
