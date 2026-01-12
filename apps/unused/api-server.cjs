const express = require('express')
const cors = require('cors')
const uncss = require('uncss')

const app = express()
const PORT = 5001

// Middleware
app.use(cors())
app.use(express.json({ limit: '10mb' }))

// UnCSS promise wrapper
const uncssPromise = (html, css) => {
  return new Promise((resolve, reject) => {
    uncss(
      html,
      {
        raw: css,
        banner: false,
        ignoreSheets: [/./],
      },
      (error, output) => {
        if (error) return reject(error)
        return resolve(output)
      }
    )
  })
}

// API endpoint
app.post('/api/uncss', async (req, res) => {
  try {
    const { inputHtml, inputCss } = req.body

    if (!inputHtml) {
      return res.status(400).json({ error: 'Cannot process empty HTML' })
    }

    if (!inputCss) {
      return res.status(400).json({ error: 'Cannot process empty CSS' })
    }

    // Clean HTML from scripts
    const html = inputHtml.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")

    // Process with UnCSS
    const result = await uncssPromise(html, inputCss)

    res.json({ outputCss: result })

  } catch (error) {
    console.error('UnCSS Error:', error)
    res.status(400).json({ error: error.message })
  }
})

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' })
})

// Start server
app.listen(PORT, () => {
  console.log(`🚀 UnCSS API server running on http://localhost:${PORT}`)
  console.log(`📡 API endpoint: http://localhost:${PORT}/api/uncss`)
})