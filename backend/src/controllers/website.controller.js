import {
  generateWithDeepSeek,
  generateWithGemini,
  generateWithOpenai
} from '../config/aiModel.js'

import { User } from '../model/user.model.js'
import Website from '../model/website.model.js'
import slugify from 'slugify'

const masterPrompt = `
YOU ARE A PRINCIPAL FRONTEND ARCHITECT
AND A SENIOR UI/UX ENGINEER
SPECIALIZED IN RESPONSIVE DESIGN SYSTEMS.

YOU BUILD HIGH-END, REAL-WORLD, PRODUCTION-GRADE WEBSITES
USING ONLY HTML, CSS, AND JAVASCRIPT
THAT WORK PERFECTLY ON ALL SCREEN SIZES.

THE OUTPUT MUST BE CLIENT-DELIVERABLE WITHOUT ANY MODIFICATION.

❌ NO FRAMEWORKS
❌ NO LIBRARIES
❌ NO BASIC SITES
❌ NO PLACEHOLDERS
❌ NO NON-RESPONSIVE LAYOUTS

--------------------------------------------------
USER REQUIREMENT:
{USER_PROMPT}
--------------------------------------------------

GLOBAL QUALITY BAR (NON-NEGOTIABLE)
--------------------------------------------------
- Premium, modern UI (2026–2027)
- Professional typography & spacing
- Clean visual hierarchy
- Business-ready content (NO lorem ipsum)
- Smooth transitions & hover effects
- SPA-style multi-page experience
- Production-ready, readable code

--------------------------------------------------
RESPONSIVE DESIGN (ABSOLUTE REQUIREMENT)
--------------------------------------------------
THIS WEBSITE MUST BE FULLY RESPONSIVE.

YOU MUST IMPLEMENT:

✔ Mobile-first CSS approach
✔ Responsive layout for:
  - Mobile (<768px)
  - Tablet (768px–1024px)
  - Desktop (>1024px)

✔ Use:
  - CSS Grid / Flexbox
  - Relative units (%, rem, vw)
  - Media queries

✔ REQUIRED RESPONSIVE BEHAVIOR:
  - Navbar collapses / stacks on mobile
  - Sections stack vertically on mobile
  - Multi-column layouts become single-column on small screens
  - Images scale proportionally
  - Text remains readable on all devices
  - No horizontal scrolling on mobile
  - Touch-friendly buttons on mobile

IF THE WEBSITE IS NOT RESPONSIVE → RESPONSE IS INVALID.

--------------------------------------------------
IMAGES (MANDATORY & RESPONSIVE)
--------------------------------------------------
- Use high-quality images ONLY from:
  https://images.unsplash.com/
- EVERY image URL MUST include:
  ?auto=format&fit=crop&w=1200&q=80

- Images must:
  - Be responsive (max-width: 100%)
  - Resize correctly on mobile
  - Never overflow containers

--------------------------------------------------
TECHNICAL RULES (VERY IMPORTANT)
--------------------------------------------------
- Output ONE single HTML file
- Exactly ONE <style> tag
- Exactly ONE <script> tag
- NO external CSS / JS / fonts
- Use system fonts only
- iframe srcdoc compatible
- SPA-style navigation using JavaScript
- No page reloads
- No dead UI
- No broken buttons
--------------------------------------------------
SPA VISIBILITY RULE (MANDATORY)
--------------------------------------------------
- Pages MUST NOT be hidden permanently
- If .page { display: none } is used,
  then .page.active { display: block } is REQUIRED
- At least ONE page MUST be visible on initial load
- Hiding all content is INVALID


--------------------------------------------------
REQUIRED SPA PAGES
--------------------------------------------------
- Home
- About
- Services / Features
- Contact

--------------------------------------------------
FUNCTIONAL REQUIREMENTS
--------------------------------------------------
- Navigation must switch pages using JS
- Active nav state must update
- Forms must have JS validation
- Buttons must show hover + active states
- Smooth section/page transitions

--------------------------------------------------
FINAL SELF-CHECK (MANDATORY)
--------------------------------------------------
BEFORE RESPONDING, ENSURE:

1. Layout works on mobile, tablet, desktop
2. No horizontal scroll on mobile
3. All images are responsive
4. All sections adapt properly
5. Media queries are present and used
6. Navigation works on all screen sizes
7. At least ONE page is visible without user interaction

IF ANY CHECK FAILS → RESPONSE IS INVALID

--------------------------------------------------
OUTPUT FORMAT:
--------------------------------------------------
Return ONLY the full raw HTML code. Do NOT wrap it in JSON. Do NOT output markdown formatting like code blocks. Start directly with <!DOCTYPE html> and end with </html>.

--------------------------------------------------
ABSOLUTE RULES:
--------------------------------------------------
- RETURN HTML ONLY
- NO markdown code blocks
- NO explanations
- NO extra text
- IF FORMAT IS BROKEN → RESPONSE IS INVALID
`

const CREDIT_COST = 5

const cleanAICode = code => {
  if (!code || typeof code !== 'string') return null
  return code
    .replace(/```html/gi, '')
    .replace(/```/g, '')
    .trim()
}

export const generateWebsite = async (req, res) => {
  try {
    const { prompt } = req.body

    if (!prompt) {
      return res.status(400).json({ message: 'Prompt is required' })
    }

    const user = await User.findById(req.user._id)

    if (!user) {
      return res.status(401).json({ message: 'User not found' })
    }

    if (user.credits < CREDIT_COST) {
      return res.status(402).json({ message: 'Insufficient credits' })
    }

    // ✅ slug
    const slug =
      slugify(prompt.slice(0, 30), {
        lower: true,
        strict: true
      }) +
      '-' +
      Date.now()

    const finalPrompt = masterPrompt.replace('{USER_PROMPT}', prompt)

    // const rawCode = await generateWithDeepSeek(finalPrompt)
    // const rawCode = await generateWithOpenai(finalPrompt)

    const rawCode = await generateWithGemini(finalPrompt)
    const code = cleanAICode(rawCode)

    if (!code) {
      return res.status(400).json({
        message: 'AI returned invalid response'
      })
    }

    const newWebsite = await Website.create({
      user: user._id,
      title: prompt.slice(0, 60),
      latestCode: code,
      slug,
      conversation: [
        {
          role: 'user',
          content: prompt
        },
        {
          role: 'ai',
          content: 'Website generated successfully'
        }
      ]
    })

    user.credits -= CREDIT_COST
    await user.save()

    return res.status(200).json({
      message: 'Website generated successfully',
      code,
      websiteId: newWebsite._id
    })
  } catch (error) {
    console.log('generate website error:', error)

    return res.status(500).json({
      message: 'Generate web error'
    })
  }
}

export const getWebsiteById = async (req, res) => {
  try {
    const website = await Website.findOne({
      _id: req.params.id,
      user: req.user._id
    })

    if (!website) {
      return res.status(404).json({ message: 'Website not found' })
    }

    return res.status(200).json(website)
  } catch (error) {
    console.log('get website error:', error)
    return res.status(500).json({ message: 'Failed to retrieve website' })
  }
}

export const changes = async (req, res) => {
  try {
    const { prompt } = req.body

    if (!prompt) {
      return res.status(400).json({ message: 'Prompt is required' })
    }

    const website = await Website.findOne({
      _id: req.params.id,
      user: req.user._id
    })

    if (!website) {
      return res.status(404).json({ message: 'Website not found' })
    }

    const user = await User.findById(req.user._id)

    if (!user) {
      return res.status(401).json({ message: 'User not found' })
    }

    if (user.credits < CREDIT_COST) {
      return res.status(402).json({ message: 'Insufficient credits' })
    }

    const updatePrompt = `
Update this HTML website:

CURRENT CODE:
${website.latestCode}

USER REQUEST:
${prompt}

RULES:
- Return ONLY full updated HTML
- No explanation
- No JSON
`

    const rawCode = await generateWithGemini(updatePrompt)
    const code = cleanAICode(rawCode)

    if (!code) {
      return res.status(400).json({
        message: 'AI returned invalid response'
      })
    }

    website.conversation.push(
      { role: 'user', content: prompt },
      { role: 'ai', content: 'Website updated successfully' }
    )

    website.latestCode = code
    await website.save()

    user.credits -= CREDIT_COST
    await user.save()

    return res.status(200).json({
      message: 'Website updated successfully',
      code,
      websiteId: website._id
    })
  } catch (error) {
    console.log('changes error:', error)
    return res.status(500).json({ message: 'Update failed' })
  }
}

export const getAllWebsites = async (req, res) => {
  try {
    const websites = await Website.find({ user: req.user._id })

    return res.status(200).json(websites)
  } catch (err) {
    console.error('Get All Websites Error:', err)
    return res.status(500).json({ message: 'Failed to fetch websites' })
  }
}

export const previewWebsite = async (req, res) => {
  try {
    const website = await Website.findById(req.params.id)
    if (!website) {
      return res.status(404).send('<h1>Website not found</h1>')
    }
    res.setHeader('Content-Type', 'text/html')
    return res.send(website.latestCode)
  } catch (error) {
    console.error('Preview error:', error)
    return res.status(500).send('<h1>Preview failed</h1>')
  }
}

export const deployWebsite = async (req, res) => {
  try {
    const website = await Website.findOne({
      _id: req.params.id,
      user: req.user._id
    })
    if (!website) {
      return res.status(404).json({ message: 'Website not found' })
    }

    website.deployed = true
    website.deployedUrl = `${req.protocol}://${req.get(
      'host'
    )}/api/website/preview/${website._id}`
    await website.save()

    return res.status(200).json({
      message: 'Website deployed successfully',
      deployedUrl: website.deployedUrl
    })
  } catch (error) {
    console.error('Deploy error:', error)
    return res.status(500).json({ message: 'Deployment failed' })
  }
}
