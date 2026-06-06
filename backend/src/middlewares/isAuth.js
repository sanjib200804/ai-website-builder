import jwt from 'jsonwebtoken'
import{ User }from '../model/user.model.js'
const isAuth = async (req, res, next) => {
  try {
    const token = req.cookies?.token
    if (!token) {
      return res
        .status(401)
        .json({ message: 'unauthenticated or invalid token' })
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    if (!decoded || !decoded.id) {
      return res
        .status(401)
        .json({ message: 'unauthenticated or invalid token' })
    }
    const user = await User.findById(decoded.id)
    if (!user) {
      return res.status(401).json({ message: 'User not found' })
    }
    req.user = user
    next()
  } catch (error) {
    console.error('isAuth middleware error:', error)
    return res
      .status(401)
      .json({ message: 'unauthenticated or invalid token' })
  }
}

export default isAuth
