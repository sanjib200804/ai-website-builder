import axios from 'axios'
import React, { useEffect, useState, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { serverurl } from '../config'
import Header from '../components/Header'
import Chat from '../components/Chat'
import {
  FaCode,
  FaDesktop,
  FaMobileAlt,
  FaRocket,
  FaCopy,
  FaCheck,
  FaTimes,
  FaArrowLeft
} from 'react-icons/fa'
import toast from 'react-hot-toast'

const Editor = () => {
  const { id } = useParams()
  const navigate = useNavigate()

  const [website, setWebsite] = useState(null)
  const [error, setError] = useState('')
  const [code, setCode] = useState('')
  const [messages, setMessages] = useState([])

  // Premium interactive states
  const [deploying, setDeploying] = useState(false)
  const [deployedUrl, setDeployedUrl] = useState('')
  const [showDeployModal, setShowDeployModal] = useState(false)

  const [showCodeModal, setShowCodeModal] = useState(false)
  const [copied, setCopied] = useState(false)
  const [copiedUrl, setCopiedUrl] = useState(false)

  const [previewMode, setPreviewMode] = useState('desktop') // 'desktop' or 'mobile'

  const iframeRef = useRef(null)

  // ✅ get website
  useEffect(() => {
    const handelGetWebsite = async () => {
      try {
        const res = await axios.get(
          `${serverurl}/api/website/get-by-id/${id}`,
          { withCredentials: true }
        )

        setWebsite(res.data)
        setCode(res.data.latestCode)
        setMessages(res.data.conversation)
        if (res.data.deployed) {
          setDeployedUrl(res.data.deployedUrl)
        }
      } catch (error) {
        console.error('Error fetching website:', error)
        toast.success('Deployment URL copied!')
      }
    }

    handelGetWebsite()
  }, [id])

  // ✅ update preview when code changes
  useEffect(() => {
    if (!iframeRef.current) return
    if (!code) return

    const blob = new Blob([code], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    iframeRef.current.src = url

    return () => URL.revokeObjectURL(url)
  }, [code])

  // ✅ deploy function
  const handleDeploy = async () => {
    setDeploying(true)
    const loadingToast = toast.loading('Deploying website...')

    try {
      const res = await axios.post(
        `${serverurl}/api/website/deploy/${id}`,
        {},
        { withCredentials: true }
      )
      setDeployedUrl(res.data.deployedUrl)
      toast.success('Website deployed successfully!', {
        id: loadingToast
      })

      setShowDeployModal(true)
    } catch (error) {
      console.error('Deploy error:', error)
      toast.error('Failed to deploy website.', {
        id: loadingToast
      })
    } finally {
      setDeploying(false)
    }
  }

  // ✅ copy code function
  const handleCopyCode = () => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    toast.success('Code copied to clipboard!')
    setTimeout(() => setCopied(false), 2000)
  }

  // ✅ copy url function
  const handleCopyUrl = () => {
    navigator.clipboard.writeText(deployedUrl)
    setCopiedUrl(true)
    toast.success('Deployment URL copied!')

    setTimeout(() => setCopiedUrl(false), 2000)
  }

  if (error) {
    return (
      <div className='h-screen flex flex-col items-center justify-center bg-black text-white px-4 text-center'>
        <p className='text-red-400 text-lg font-semibold mb-4'>{error}</p>
        <button
          onClick={() => navigate('/dashboard')}
          className='px-6 py-2.5 rounded-xl bg-white text-black font-semibold text-sm hover:scale-105 transition'
        >
          Return to Dashboard
        </button>
      </div>
    )
  }

  if (!website) {
    return (
      <div className='h-screen flex items-center justify-center bg-black text-white'>
        <div className='flex flex-col items-center gap-4'>
          <div className='w-10 h-10 border-4 border-white/20 border-t-white rounded-full animate-spin'></div>
          <p className='text-sm text-zinc-400'>
            Loading developer environment...
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className='h-screen w-screen flex bg-black text-white overflow-hidden'>
      {/* LEFT PANEL: Chat and Header */}
      <aside className='w-[380px] flex flex-col border-r border-white/10 bg-black/80 h-full shrink-0'>
        <div className='flex items-center border-b border-white/10 h-14 px-2'>
          <button
            onClick={() => navigate('/dashboard')}
            className='p-2 rounded-lg hover:bg-white/10 transition text-zinc-400 hover:text-white mr-1'
            title='Back to Dashboard'
          >
            <FaArrowLeft size={14} />
          </button>
          <Header website={website} />
        </div>

        <Chat
          website={website}
          setCode={setCode}
          messages={messages}
          setMessages={setMessages}
        />
      </aside>

      {/* RIGHT PANEL: Preview and Top Bar */}
      <div className='flex-1 flex flex-col h-full bg-[#0a0a0a]'>
        {/* top bar */}
        <div className='h-14 px-4 flex justify-between items-center border-b border-white/10 bg-black/80 shrink-0'>
          <div className='flex items-center gap-4'>
            <span className='text-xs text-zinc-400 font-medium tracking-wide uppercase'>
              Live Preview
            </span>
            <div className='flex items-center bg-white/5 border border-white/10 rounded-lg p-0.5'>
              <button
                onClick={() => setPreviewMode('desktop')}
                className={`p-1.5 rounded-md transition ${
                  previewMode === 'desktop'
                    ? 'bg-white text-black'
                    : 'text-zinc-400 hover:text-white'
                }`}
                title='Desktop View'
              >
                <FaDesktop size={14} />
              </button>
              <button
                onClick={() => setPreviewMode('mobile')}
                className={`p-1.5 rounded-md transition ${
                  previewMode === 'mobile'
                    ? 'bg-white text-black'
                    : 'text-zinc-400 hover:text-white'
                }`}
                title='Mobile View'
              >
                <FaMobileAlt size={14} />
              </button>
            </div>
          </div>

          <div className='flex items-center gap-3'>
            <button
              onClick={() => setShowCodeModal(true)}
              className='p-2 rounded-lg border border-white/10 hover:bg-white/5 text-zinc-400 hover:text-white transition'
              title='View Source Code'
            >
              <FaCode size={16} />
            </button>

            <button
              onClick={handleDeploy}
              disabled={deploying}
              className='flex items-center gap-2 py-1.5 px-4 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 text-sm font-semibold hover:opacity-90 transition disabled:opacity-50'
            >
              {deploying ? (
                <div className='w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin'></div>
              ) : (
                <FaRocket size={12} />
              )}
              <span>{deploying ? 'Deploying...' : 'Deploy'}</span>
            </button>
          </div>
        </div>

        {/* iframe container with dynamic responsive wrapper */}
        <div className='flex-1 p-6 flex items-center justify-center overflow-auto'>
          <div
            className={`transition-all duration-300 h-full bg-white flex ${
              previewMode === 'mobile'
                ? 'w-[375px] max-w-full rounded-[36px] border-[12px] border-zinc-900 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] overflow-hidden relative'
                : 'w-full rounded-2xl shadow-2xl border border-white/10 overflow-hidden'
            }`}
          >
            <iframe
              ref={iframeRef}
              title='preview'
              className='w-full h-full border-0'
            />
          </div>
        </div>
      </div>

      {/* MODAL 1: VIEW CODE */}
      {showCodeModal && (
        <div className='fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md px-4'>
          <div className='w-full max-w-4xl rounded-2xl bg-zinc-950 border border-white/10 shadow-2xl overflow-hidden flex flex-col h-[80vh]'>
            <div className='px-6 py-4 border-b border-white/10 flex items-center justify-between'>
              <h3 className='font-semibold text-lg'>Source Code</h3>
              <div className='flex items-center gap-2'>
                <button
                  onClick={handleCopyCode}
                  className='flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs hover:bg-white/10 transition text-zinc-300 hover:text-white'
                >
                  {copied ? (
                    <FaCheck className='text-emerald-400' />
                  ) : (
                    <FaCopy />
                  )}
                  <span>{copied ? 'Copied!' : 'Copy Code'}</span>
                </button>
                <button
                  onClick={() => setShowCodeModal(false)}
                  className='p-2 rounded-lg hover:bg-white/10 transition text-zinc-400 hover:text-white'
                >
                  <FaTimes size={16} />
                </button>
              </div>
            </div>
            <div className='flex-1 p-6 overflow-hidden'>
              <textarea
                readOnly
                value={code}
                className='w-full h-full p-4 rounded-xl bg-zinc-900 border border-white/5 font-mono text-xs text-zinc-300 outline-none resize-none overflow-auto'
              />
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: DEPLOY SUCCESS */}
      {showDeployModal && (
        <div className='fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md px-4'>
          <div className='w-full max-w-md rounded-2xl bg-zinc-950 border border-white/10 p-6 shadow-2xl text-center relative'>
            <button
              onClick={() => setShowDeployModal(false)}
              className='absolute top-4 right-4 p-2 rounded-lg hover:bg-white/10 transition text-zinc-400 hover:text-white'
            >
              <FaTimes size={14} />
            </button>

            <div className='w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-4 text-xl'>
              <FaCheck />
            </div>

            <h3 className='font-bold text-xl mb-2'>Website Live!</h3>
            <p className='text-sm text-zinc-400 mb-6'>
              Your website has been successfully deployed onto public servers.
            </p>

            <div className='flex items-center gap-2 p-2 rounded-xl bg-zinc-900 border border-white/5 mb-6'>
              <input
                type='text'
                readOnly
                value={deployedUrl}
                className='flex-1 bg-transparent border-0 outline-none text-xs text-zinc-300 px-2 truncate'
              />
              <button
                onClick={handleCopyUrl}
                className='p-2 rounded-lg bg-white/5 hover:bg-white/10 transition text-zinc-400 hover:text-white shrink-0'
                title='Copy URL'
              >
                {copiedUrl ? (
                  <FaCheck className='text-emerald-400' size={14} />
                ) : (
                  <FaCopy size={14} />
                )}
              </button>
            </div>

            <a
              href={deployedUrl}
              target='_blank'
              rel='noopener noreferrer'
              className='w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-white text-black font-semibold hover:bg-zinc-200 transition'
            >
              <span>View Website</span>
              <FaExternalLinkAlt size={12} />
            </a>
          </div>
        </div>
      )}
    </div>
  )
}

// Inline fallback for missing icon import check
const FaExternalLinkAlt = props => (
  <svg
    stroke='currentColor'
    fill='currentColor'
    strokeWidth='0'
    viewBox='0 0 512 512'
    height={props.size || '1em'}
    width={props.size || '1em'}
    xmlns='http://www.w3.org/2000/svg'
  >
    <path d='M432,320H400a16,16,0,0,0-16,16V448H64V128H176a16,16,0,0,0,16-16V80a16,16,0,0,0-16-16H48A48,48,0,0,0,0,112V464a48,48,0,0,0,48,48H400a48,48,0,0,0,48-48V336A16,16,0,0,0,432,320ZM488,0H344a24,24,0,0,0-24,24V40a24,24,0,0,0,24,24H424L219.8,268.2a24,24,0,0,0,0,33.9l10.1,10.1a24,24,0,0,0,33.9,0L468,108v80a24,24,0,0,0,24,24h16a24,24,0,0,0,24-24V24A24,24,0,0,0,488,0Z'></path>
  </svg>
)

export default Editor
