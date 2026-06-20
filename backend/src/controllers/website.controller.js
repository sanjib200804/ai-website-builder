import {
  generateWithDeepSeek,
  generateWithGemini,
  generateWithOpenai
} from '../config/aiModel.js'

import { User } from '../model/user.model.js'
import Website from '../model/website.model.js'
import slugify from 'slugify'

const masterPrompt = `YOU ARE A PRINCIPAL FRONTEND ARCHITECT
AND A SENIOR UI/UX ENGINEER
SPECIALIZED IN RESPONSIVE DESIGN SYSTEMS.

YOU BUILD HIGH-END, REAL-WORLD, PRODUCTION-GRADE WEB PROJECTS
USING ONLY HTML, CSS, AND JAVASCRIPT
THAT WORK PERFECTLY ON ALL SCREEN SIZES.

THE OUTPUT MUST BE CLIENT-DELIVERABLE WITHOUT ANY MODIFICATION.

❌ NO FRAMEWORKS
❌ NO LIBRARIES
❌ NO PLACEHOLDERS
❌ NO NON-RESPONSIVE LAYOUTS
❌ NO UNNECESSARY UI THAT THE REQUEST DIDN'T ASK FOR

--------------------------------------------------
USER REQUIREMENT:
{USER_PROMPT}
--------------------------------------------------

STEP 0 — CLASSIFY THE REQUEST FIRST (MANDATORY)
--------------------------------------------------
Before writing any code, decide what kind of project this is:

TYPE A — "TOOL / UTILITY / WIDGET"
  Examples: calculator, converter, timer, todo app, color picker,
  generator, game, single dashboard, single-purpose interactive tool.
  → Build EXACTLY what was asked. ONE focused screen.
  → DO NOT add a navbar, multi-page SPA, About, Services, or Contact
    page unless the user explicitly asked for them.
  → Polish means: good layout, spacing, responsiveness, and
    micro-interactions for the tool itself — not extra marketing pages.

TYPE B — "WEBSITE / BUSINESS SITE / LANDING PAGE / PORTFOLIO"
  Examples: company site, agency site, product landing page,
  portfolio, restaurant site, SaaS marketing site.
  → Build a full SPA-style multi-page experience
    (the REQUIRED SPA PAGES section below applies here).

TYPE C — "EXPLICIT CUSTOM STRUCTURE"
  The user names specific pages/sections/features.
  → Build exactly the pages/sections/features named.
    Do not add ones they didn't request, do not omit ones they did.

If the request is ambiguous, default to the SMALLEST structure that
fully satisfies it (i.e. prefer Type A/C over inventing Type B scope).

THE NAVBAR, MULTI-PAGE ROUTING, AND "REQUIRED SPA PAGES" SECTION BELOW
ONLY APPLY WHEN STEP 0 CLASSIFIES THE REQUEST AS TYPE B.

--------------------------------------------------
GLOBAL QUALITY BAR (NON-NEGOTIABLE, ALL TYPES)
--------------------------------------------------
- Premium, modern UI (2026–2027)
- Professional typography & spacing
- Clean visual hierarchy
- Real, business-ready content where content exists (NO lorem ipsum)
- Smooth transitions & hover effects
- Production-ready, readable code

--------------------------------------------------
RESPONSIVE DESIGN (ABSOLUTE REQUIREMENT, ALL TYPES)
--------------------------------------------------
THIS PROJECT MUST BE FULLY RESPONSIVE.

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
  - If a navbar exists (Type B/C only), it collapses/stacks on mobile
  - Sections/panels stack vertically on mobile where appropriate
  - Multi-column layouts become single-column on small screens
  - Images scale proportionally
  - Text remains readable on all devices
  - No horizontal scrolling on mobile
  - Touch-friendly buttons and controls on mobile

IF THE PROJECT IS NOT RESPONSIVE → RESPONSE IS INVALID.

--------------------------------------------------
IMAGES (CONDITIONAL — ONLY WHEN RELEVANT)
--------------------------------------------------
Only include images if the project type/content calls for them
(e.g. websites, portfolios, landing pages). Tools like calculators,
converters, or games should NOT have stock images forced in.

When images ARE used:
- Use high-quality images ONLY from:
  https://images.unsplash.com/
- EVERY image URL MUST include:
  ?auto=format&fit=crop&w=1200&q=80
- Images must:
  - Be responsive (max-width: 100%)
  - Resize correctly on mobile
  - Never overflow containers

--------------------------------------------------
TECHNICAL RULES (VERY IMPORTANT, ALL TYPES)
--------------------------------------------------
- Output ONE single HTML file
- Exactly ONE <style> tag
- Exactly ONE <script> tag
- NO external CSS / JS / fonts
- Use system fonts only
- iframe srcdoc compatible
- No page reloads
- No dead UI
- No broken buttons

--------------------------------------------------
SPA VISIBILITY RULE (MANDATORY — TYPE B/C WITH MULTIPLE PAGES ONLY)
--------------------------------------------------
- Pages MUST NOT be hidden permanently
- If .page { display: none } is used,
  then .page.active { display: block } is REQUIRED
- At least ONE page MUST be visible on initial load
- Hiding all content is INVALID
- This rule does NOT apply to Type A single-screen tools.

--------------------------------------------------
REQUIRED SPA PAGES (TYPE B ONLY — DO NOT APPLY TO TYPE A)
--------------------------------------------------
- Home
- About
- Services / Features
- Contact

(For Type C, replace this list with whatever pages/sections the user
explicitly named.)

--------------------------------------------------
FUNCTIONAL REQUIREMENTS (ALL TYPES)
--------------------------------------------------
- If navigation exists, it must switch views using JS with active
  state updates
- Forms (if any) must have JS validation
- Buttons must show hover + active/focus states
- Smooth transitions for any view/state changes
- Tool logic (calculator math, converter logic, game rules, etc.)
  must be fully functional and correct — this is the core deliverable
  for Type A projects

--------------------------------------------------
FINAL SELF-CHECK (MANDATORY)
--------------------------------------------------
BEFORE RESPONDING, ENSURE:

1. Step 0 classification was done, and structure matches that type
2. No unrequested pages/sections were added (esp. for Type A)
3. Layout works on mobile, tablet, desktop
4. No horizontal scroll on mobile
5. Any images present are responsive; none added unnecessarily
6. All sections/controls adapt properly
7. Media queries are present and used
8. Navigation (if present) works on all screen sizes
9. At least one view is visible/usable without extra interaction
10. The core requested functionality actually works (not just UI)

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
- IF FORMAT IS BROKEN → RESPONSE IS INVALID`

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

    if (!prompt || typeof prompt !== 'string' || !prompt.trim()) {
      return res.status(400).json({ message: 'Prompt is required' })
    }

    const website = await Website.findOne({
      _id: req.params.id,
      user: req.user._id
    })

    if (!website) {
      return res.status(404).json({ message: 'Website not found' })
    }


    const user = await User.findOneAndUpdate(
      { _id: req.user._id, credits: { $gte: CREDIT_COST } },
      { $inc: { credits: -CREDIT_COST } },
      { returnDocument: 'after' }
    )

    if (!user) {

      const exists = await User.exists({ _id: req.user._id })
      return res
        .status(exists ? 402 : 401)
        .json({ message: exists ? 'Insufficient credits' : 'User not found' })
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

    let rawCode
    try {
      rawCode = await generateWithGemini(updatePrompt)
    } catch (genError) {

      await User.findByIdAndUpdate(req.user._id, { $inc: { credits: CREDIT_COST } })
      console.log('changes error (generation):', genError)
      return res.status(502).json({ message: 'AI generation failed' })
    }

    const code = cleanAICode(rawCode)

    if (!code) {

      await User.findByIdAndUpdate(req.user._id, { $inc: { credits: CREDIT_COST } })
      return res.status(400).json({ message: 'AI returned invalid response' })
    }

    website.conversation.push(
      { role: 'user', content: prompt },
      { role: 'ai', content: 'Website updated successfully' }
    )
    website.latestCode = code
    await website.save()

    return res.status(200).json({
      message: 'Website updated successfully',
      code,
      websiteId: website._id,
      remainingCredits: user.credits
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
