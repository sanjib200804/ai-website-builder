import mongoose from 'mongoose'

async function connectDB () {
  try {
    await mongoose.connect(process.env.MONGO_URI)
    console.log('MongoDB connected')
  } catch (error) {
    console.log(error)
  }
}

export default connectDB
