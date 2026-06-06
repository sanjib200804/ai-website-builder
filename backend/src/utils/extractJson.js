export const extractJson = text => {
  if (!text) return null

  try {
    // ✅ FIX 1: if already object → return directly
    if (typeof text === 'object') {
      return text
    }

    // ❌ if not string → invalid
    if (typeof text !== 'string') {
      return null
    }

    // remove markdown
    let cleaned = text
      .replace(/```json/gi, '')
      .replace(/```/g, '')
      .replace(/'''json/gi, '')
      .replace(/'''/g, '')
      .trim()

    // find first {
    const firstBrace = cleaned.indexOf('{')
    if (firstBrace === -1) return null

    cleaned = cleaned.slice(firstBrace)

    // try parse normally
    try {
      return JSON.parse(cleaned)
    } catch {
      // try fix cut JSON
      const lastBrace = cleaned.lastIndexOf('}')
      if (lastBrace !== -1) {
        const fixed = cleaned.slice(0, lastBrace + 1)
        return JSON.parse(fixed)
      }
    }

    return null
  } catch (err) {
    console.error('JSON parse error:', err)
    return null
  }
}
