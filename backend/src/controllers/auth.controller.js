import jwt from 'jsonwebtoken'
import { User } from '../model/user.model.js'

const isProduction = process.env.NODE_ENV === 'production'

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? 'none' : 'lax',
  maxAge: 1000 * 60 * 60 * 24 * 7// 7 day
}

export async function googleAuth (req, res) {
  try {
    const { name, email, avatar } = req.body

    // check fields
    if (!name || !email) {
      return res.status(400).json({
        message: 'All fields are required'
      })
    }

    // find user
    let user = await User.findOne({ email })

    // if user not exist → create
    if (!user) {
      user = await User.create({
        name,
        email,
        avatar
      })
    }

    // create token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1d'
    })

    res.cookie('token', token, COOKIE_OPTIONS)

    return res.status(200).json({
      message: 'Login success',
      user,
      token
    })
  } catch (error) {
    console.error('Google Auth Error:', error)
    res.status(500).json({ message: 'Authentication failed' })
  }
}

export async function login (req, res) {
  try {
    const { email } = req.body
    if (!email) {
      return res.status(400).json({ message: 'Email is required' })
    }
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1d'
    })
    res.cookie('token', token, COOKIE_OPTIONS)
    return res
      .status(200)
      .json({ message: 'User logged in successfully', user, token })
  } catch (error) {
    console.error('Login Error:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}

export async function logout (req, res) {
  try {
    const { maxAge, ...clearOptions } = COOKIE_OPTIONS
    return res
      .clearCookie('token', clearOptions)
      .json({ message: 'User logged out' })
  } catch (error) {
    res.status(500).json({ message: 'Logout failed' })
  }
}
