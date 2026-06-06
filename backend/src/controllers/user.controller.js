import { extractJson } from '../utils/extractJson.js'

export const getCurrentUser = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' })
    }
    return res.status(200).json({ user: req.user })
  } catch (error) {
    console.error('Get Current User Error:', error)
    return res.status(500).json({ message: 'Failed to fetch user profile' })
  }
}

export const generatedemo = async (req, res) => {
  try {
    const { prompt } = req.body // ✅ get prompt from frontend

    if (!prompt) {
      return res.status(400).json({ message: 'Prompt is required' })
    }

    const response = await generateResponse(prompt)
    const data = await extractJson(response)
    if (!data) {
      return res
        .status(422)
        .json({ message: 'Failed to extract valid demo data' })
    }
    return res.status(200).json(data)
  } catch (error) {
    console.error('Generate Demo Error:', error)
    return res.status(500).json({ message: 'Demo generation failed' })
  }
}
