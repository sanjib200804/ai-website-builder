import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaGoogle } from 'react-icons/fa'
import { X, Sparkles, ShieldCheck } from 'lucide-react'
import { auth, provider } from '../config/firebase.js'
import { signInWithPopup } from 'firebase/auth'
import { serverurl } from '../config/axios'

import axios from 'axios'
import { useDispatch } from 'react-redux'
import { setUserData } from '../redux/userSlice.js'
import toast from 'react-hot-toast'

const LoginModal = ({ open, onClose }) => {
  const dispatch = useDispatch()
  const handeGoogleAuth = async () => {
    try {
      const result = await signInWithPopup(auth, provider)

      const { data } = await axios.post(
        `${serverurl}/api/auth/register`,
        {
          name: result.user.displayName,
          email: result.user.email,
          avatar: result.user.photoURL
        },
        {
          withCredentials: true
        }
      )
      dispatch(setUserData(data))
      onClose()
      toast.success('Login Successful')
    } catch (error) {
      console.log(error)
      toast.error('Login Unsuccessful')
    }
  }
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className='fixed inset-0 z-[110] flex items-center justify-center bg-black/60 backdrop-blur-xl px-4 py-10'
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className='relative w-full max-w-lg bg-[#0A0A0F] border border-white/10 rounded-[2.5rem] shadow-2xl overflow-hidden'
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            onClick={e => e.stopPropagation()}
          >
            {/* Background Glows */}
            <div className='absolute -top-24 -left-24 w-64 h-64 bg-purple-600/10 blur-[80px] pointer-events-none' />
            <div className='absolute -bottom-24 -right-24 w-64 h-64 bg-blue-600/10 blur-[80px] pointer-events-none' />

            {/* Close Button */}
            <button
              onClick={onClose}
              className='absolute top-6 right-6 p-2 rounded-full bg-white/5 border border-white/10 text-zinc-400 hover:text-white transition-colors z-20'
            >
              <X size={20} />
            </button>

            <div className='relative px-8 pt-16 pb-12 text-center'>
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className='inline-flex items-center gap-2 mb-6 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold text-zinc-400 uppercase tracking-widest'
              >
                <Sparkles size={12} className='text-purple-400' />
                AI-powered website builder
              </motion.div>

              <h2 className='text-4xl font-bold text-white mb-4 tracking-tight'>
                Welcome to{' '}
                <span className='bg-gradient-to-r from-[#8B5CF6] via-[#6366F1] to-[#3B82F6] bg-clip-text text-transparent'>
                  WebGenie<span className='text-zinc-400'>AI</span>
                </span>
              </h2>

              <p className='text-[#A1A1AA] text-lg mb-10 max-w-sm mx-auto leading-relaxed'>
                Sign in to start building your next generation website with AI.
              </p>

              <motion.button
                onClick={handeGoogleAuth}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className='group relative w-full h-14 flex items-center justify-center gap-3 rounded-2xl bg-white text-black font-bold text-sm shadow-xl hover:shadow-white/10 transition-all duration-300'
              >
                <FaGoogle className='text-lg' />
                <span>Continue with Google</span>
              </motion.button>

              <div className='mt-10'>
                <div className='flex items-center gap-4 mb-6'>
                  <div className='h-px flex-1 bg-white/10' />
                  <div className='flex items-center gap-1.5'>
                    <ShieldCheck size={14} className='text-zinc-500' />
                    <span className='text-[10px] font-bold text-zinc-500 uppercase tracking-wider'>
                      Secure Login
                    </span>
                  </div>
                  <div className='h-px flex-1 bg-white/10' />
                </div>

                <p className='text-xs text-zinc-500 leading-relaxed max-w-xs mx-auto'>
                  By continuing you agree to our{' '}
                  <span className='text-zinc-300 hover:text-white cursor-pointer transition-colors'>
                    Terms of Service
                  </span>{' '}
                  and{' '}
                  <span className='text-zinc-300 hover:text-white cursor-pointer transition-colors'>
                    Privacy Policy
                  </span>
                  .
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default LoginModal
