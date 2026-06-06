import axios from 'axios'
import React, { useState } from 'react'
import { FaPaperPlane } from 'react-icons/fa'
import { serverurl } from '../config/axios'


const Chat = ({ website, setCode, messages, setMessages }) => {
  const [prompt, setPrompt] = useState('')
  const [loading, setLoading] = useState(false)

  const handelUpdate = async () => {
    if (!prompt.trim() || loading) return

    const userPrompt = prompt
    setMessages(m => [...m, { role: 'user', content: userPrompt }])
    setPrompt('')
    setLoading(true)

    try {
      const res = await axios.post(
        `${serverurl}/api/website/update/${website._id}`,
        { prompt: userPrompt },
        { withCredentials: true }
      )

      setMessages(m => [...m, { role: 'ai', content: res.data.message }])
      setCode(res.data.code)
    } catch (error) {
      console.error('Error updating website:', error)
      setMessages(m => [
        ...m,
        { role: 'ai', content: 'Failed to update website. Please try again.' }
      ])
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handelUpdate()
    }
  }

  return (
    <div className='flex flex-col h-full'>
      {/* messages */}
      <div className='flex-1 overflow-y-auto px-4 py-4 space-y-4'>
        {messages?.map((m, i) => (
          <div
            key={i}
            className={`max-w-[85%] ${
              m.role === 'user' ? 'ml-auto' : 'mr-auto'
            }`}
          >
            <div
              className={`px-4 py-2.5 rounded-2xl text-sm ${
                m.role === 'user'
                  ? 'bg-white text-black'
                  : 'bg-white/10 border border-white/10'
              }`}
            >
              {m.content}
            </div>
          </div>
        ))}
        {loading && (
          <div className='max-w-[85%] mr-auto'>
            <div className='px-4 py-2.5 rounded-2xl text-sm bg-white/10 border border-white/10 flex items-center gap-2'>
              <div className='w-4 h-4 border-2 border-zinc-500 border-t-zinc-300 rounded-full animate-spin'></div>
              <span className='text-zinc-400'>AI is updating website...</span>
            </div>
          </div>
        )}
      </div>

      {/* input */}
      <div className='p-3 border-t border-white/10'>
        <div className='flex gap-2'>
          <textarea
            value={prompt}
            onChange={e => setPrompt(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={loading}
            rows='1'
            placeholder={loading ? 'AI is processing changes...' : 'Describe Changes...'}
            className='flex-1 resize-none rounded-2xl px-4 py-3 bg-white/10 text-sm outline-none disabled:opacity-50'
          />

          <button
            onClick={handelUpdate}
            disabled={loading || !prompt.trim()}
            className='px-4 py-3 rounded-2xl bg-white text-black disabled:bg-zinc-800 disabled:text-zinc-500 disabled:cursor-not-allowed transition'
          >
            <FaPaperPlane size={12} />
          </button>
        </div>
      </div>
    </div>
  )
}

export default Chat
