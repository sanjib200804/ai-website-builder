import mongoose from 'mongoose'

const messageSchema = new mongoose.Schema(
  {
    role: {
      type: String,
      enum: ['ai', 'user'],
      required: true
    },
    content: {
      type: String,
      required: true
    }
  },
  { timestamps: true }
)

const websiteSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },

    title: {
      type: String,
      default: 'Untitled Website'
    },

    latestCode: {
      type: String,
      required: true
    },

    conversation: [messageSchema],

    deployed: {
      type: Boolean,
      default: false
    },

    deployedUrl: String,

    slug: {
      type: String
    }
  },
  { timestamps: true } // ✅ FIXED (you wrote timeseries)
)

const Website = mongoose.model('Website', websiteSchema)

export default Website
