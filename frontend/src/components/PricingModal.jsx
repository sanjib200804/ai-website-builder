import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Check, Zap, Sparkles, Crown } from 'lucide-react'

const PricingModal = ({ isOpen, onClose }) => {
  const plans = [
    {
      name: 'Basic',
      credits: '100 Credits',
      price: '50',
      features: ['100 AI Credits', 'Fast Responses', 'Email Support'],
      icon: <Zap className='w-5 h-5 text-[#A1A1AA]' />,
      recommended: false
    },
    {
      name: 'Advanced',
      credits: '200 Credits',
      price: '100',
      features: [
        '200 AI Credits',
        'Faster Responses',
        'Priority Support',
        'Better AI Performance'
      ],
      icon: <Sparkles className='w-5 h-5 text-[#8B5CF6]' />,
      recommended: true
    },
    {
      name: 'Premium',
      credits: '300 Credits',
      price: '150',
      features: [
        '300 AI Credits',
        'Ultra Fast Responses',
        'Premium Support',
        'Highest AI Priority',
        'Early Access Features'
      ],
      icon: <Crown className='w-5 h-5 text-[#3B82F6]' />,
      recommended: false
    }
  ]

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className='fixed inset-0 z-[110] flex items-center justify-center bg-black/60 backdrop-blur-xl px-4 py-10'
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className='relative w-full max-w-6xl bg-[#0A0A0F] border border-white/10 rounded-[2.5rem] shadow-2xl overflow-hidden'
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            onClick={e => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className='absolute top-6 right-6 p-2 rounded-full bg-white/5 border border-white/10 text-zinc-400 hover:text-white transition-colors z-20'
            >
              <X size={20} />
            </button>

            {/* Header */}
            <div className='pt-16 pb-8 text-center px-6'>
              <motion.h2
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className='text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight'
              >
                Upgrade Your{' '}
                <span className='bg-gradient-to-r from-[#8B5CF6] via-[#6366F1] to-[#3B82F6] bg-clip-text text-transparent'>
                  Credits
                </span>
              </motion.h2>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className='text-[#A1A1AA] text-lg max-w-xl mx-auto'
              >
                Choose a plan and unlock more AI credits for uninterrupted
                usage.
              </motion.p>
            </div>

            {/* Pricing Grid */}
            <div className='grid grid-cols-1 md:grid-cols-3 gap-6 p-8 lg:p-12 items-stretch'>
              {plans.map((plan, index) => (
                <motion.div
                  key={plan.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  whileHover={{ y: -8, scale: 1.03 }}
                  className={`relative flex flex-col p-8 rounded-[2rem] transition-all duration-300 group
                    ${
                      plan.recommended
                        ? 'bg-white/[0.08] border-purple-500/50 shadow-[0_0_40px_rgba(139,92,246,0.15)] md:scale-110 z-10'
                        : 'bg-white/[0.04] border-white/10 hover:border-white/20 shadow-xl'
                    } border backdrop-blur-md`}
                >
                  {plan.recommended && (
                    <div className='absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#8B5CF6] to-[#6366F1] px-4 py-1 rounded-full flex items-center gap-1 shadow-lg shadow-purple-500/20 whitespace-nowrap'>
                      <Sparkles size={12} className='text-white' />
                      <span className='text-[10px] font-bold text-white uppercase tracking-wider'>
                        Most Popular
                      </span>
                    </div>
                  )}

                  <div className='flex items-center gap-3 mb-6'>
                    <div className='p-2.5 rounded-xl bg-white/5 border border-white/10 group-hover:border-white/20 transition-colors'>
                      {plan.icon}
                    </div>
                    <div>
                      <h3 className='text-lg font-semibold text-white'>
                        {plan.name}
                      </h3>
                      <p className='text-sm text-zinc-500'>{plan.credits}</p>
                    </div>
                  </div>

                  <div className='mb-8'>
                    <span className='text-4xl font-bold text-white'>
                      ₹{plan.price}
                    </span>
                    <span className='text-zinc-500 text-sm ml-1'>/ pack</span>
                  </div>

                  <div className='space-y-4 mb-10 flex-1'>
                    {plan.features.map((feature, i) => (
                      <div key={i} className='flex items-center gap-3'>
                        <div
                          className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center border ${
                            plan.recommended
                              ? 'bg-purple-500/10 border-purple-500/30'
                              : 'bg-white/5 border-white/10'
                          }`}
                        >
                          <Check
                            size={12}
                            className={
                              plan.recommended
                                ? 'text-purple-400'
                                : 'text-zinc-500'
                            }
                          />
                        </div>
                        <span className='text-sm text-zinc-300 group-hover:text-zinc-100 transition-colors'>
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>

                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    className={`w-full py-4 rounded-2xl font-bold text-sm transition-all duration-300 shadow-lg
                      ${
                        plan.recommended
                          ? 'bg-gradient-to-r from-[#8B5CF6] via-[#6366F1] to-[#3B82F6] text-white hover:shadow-purple-500/25 hover:brightness-110'
                          : 'bg-white text-black hover:bg-zinc-200'
                      }`}
                  >
                    Buy Now
                  </motion.button>

                  {/* Glow effect for recommended plan */}
                  {plan.recommended && (
                    <div className='absolute inset-0 rounded-[2rem] bg-gradient-to-br from-purple-500/5 to-blue-500/5 pointer-events-none' />
                  )}
                </motion.div>
              ))}
            </div>

            {/* Subtle Footer Note */}
            <div className='pb-10 text-center'>
              <p className='text-xs text-zinc-500'>
                All transactions are encrypted and secure.
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default PricingModal
