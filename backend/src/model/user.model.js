import mongoose from 'mongoose'

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      minlength: [3, 'Name must be at least 3 characters'],
      max: [50, 'Name must be less than 50 characters']
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      match: [
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        'Please provide a valid email'
      ]
    },
    avatar: {
      type: String
    },
    credits: {
      type: Number,
      default: 100
    },
    plan: {
      type: String,
      enum: ['free', 'pro', 'enterprise'],
      default: 'free'
    }
  },
  { timestamps: true }
)

// userSchema.pre('save', async function (next) {
//   if (!this.isModified('password')) {
//     return next()
//   }

// //   const salt = await bcrypt.genSalt(10)
// //   this.password = await bcrypt.hash(this.password, salt)

// //   next()
// // })

export const User = mongoose.model('User', userSchema)


