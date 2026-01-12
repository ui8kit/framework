import React, { useState, useRef, useEffect } from 'react'
import ClipboardJS from 'clipboard'

// Browser version of UnCSS
class BrowserUnCSS {
  static async process(html: string, css: string): Promise<string> {
    try {
      // Parse HTML
      const parser = new DOMParser()
      const doc = parser.parseFromString(html, 'text/html')

      // Extract all selectors from CSS
      const cssSelectors = this.extractSelectorsFromCSS(css)

      // Check which selectors are used in HTML
      const usedSelectors = new Set<string>()

      cssSelectors.forEach(selector => {
        try {
          // Check if there are elements with this selector
          const elements = doc.querySelectorAll(selector)
          if (elements.length > 0) {
            usedSelectors.add(selector)
          }
        } catch (e) {
          // Ignore invalid selectors
        }
      })

      // Generate new CSS with only used selectors
      return this.generateCleanCSS(css, usedSelectors)
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error)
      throw new Error(`UnCSS processing failed: ${message}`)
    }
  }

  private static extractSelectorsFromCSS(css: string): string[] {
    const selectors: string[] = []
    const rules = css.split('}')

    rules.forEach(rule => {
      const parts = rule.split('{')
      if (parts.length === 2) {
        const selectorPart = parts[0].trim()
        if (selectorPart) {
          // Split compound selectors
          const individualSelectors = selectorPart.split(',').map(s => s.trim())
          selectors.push(...individualSelectors)
        }
      }
    })

    return selectors
  }

  private static generateCleanCSS(originalCSS: string, usedSelectors: Set<string>): string {
    const rules = originalCSS.split('}')
    const cleanRules: string[] = []

    rules.forEach(rule => {
      const parts = rule.split('{')
      if (parts.length === 2) {
        const selectorPart = parts[0].trim()
        const declarationPart = parts[1].trim()

        if (selectorPart && declarationPart) {
          // Check if at least one selector is used
          const selectors = selectorPart.split(',').map(s => s.trim())
          const hasUsedSelector = selectors.some(sel => usedSelectors.has(sel))

          if (hasUsedSelector) {
            cleanRules.push(`${selectorPart} {${declarationPart}}`)
          }
        }
      }
    })

    return cleanRules.join('\n\n') + '\n'
  }
}

const UnCSSTool: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<Error | null>(null)
  const [outputCss, setOutputCss] = useState<string>('')
  const [clipboardMessage, setClipboardMessage] = useState<string | null>(null)

  const clipboardButton = useRef<HTMLButtonElement>(null)
  const inputHtml = useRef<HTMLTextAreaElement>(null)
  const inputCss = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    const clipboard = new ClipboardJS(clipboardButton.current!)

    clipboard.on('success', () => {
      setClipboardMessage('Copied to your clipboard')
    })

    clipboard.on('error', () => {
      setClipboardMessage('Press Command+C to copy')
    })

    return () => {
      clipboard.destroy()
    }
  }, [])

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setLoading(true)
    setError(null)

    const html = inputHtml.current?.value || ''
    const css = inputCss.current?.value || ''

    if (!html) {
      setError(new Error('Cannot process empty HTML'))
      setLoading(false)
      return
    }

    if (!css) {
      setError(new Error('Cannot process empty CSS'))
      setLoading(false)
      return
    }

    try {
      // Use UnCSS directly in the browser
      const result = await processWithUnCSS(html, css)
      setOutputCss(result)
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error occurred')
      setError(error)
    } finally {
      setLoading(false)
    }
  }

  // Function to process UnCSS in the browser
  const processWithUnCSS = async (html: string, css: string): Promise<string> => {
    try {
      // Clean HTML from script tags (as in the original API)
      const cleanHtml = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')

      // Use our browser version of UnCSS
      const result = await BrowserUnCSS.process(cleanHtml, css)
      return result
    } catch (error) {
      throw error
    }
  }

  return (
    <>
      {error && (
        <div className="error">
          <h5 className="error-name">{error.name}</h5>
          <div className="error-message">{error.message}</div>
        </div>
      )}

      <form id="uncss-form" onSubmit={handleSubmit}>
        <div className="row">
          <div className="column">
            <label htmlFor="inputHtml">Your HTML</label>
            <textarea
              placeholder="Insert your HTML here"
              rows={20}
              name="inputHtml"
              id="inputHtml"
              ref={inputHtml}
              defaultValue={`<!DOCTYPE html>
<html>
<head>
  <title>Example</title>
</head>
<body>
  <div class="container">
    <h1 class="title">Hello World</h1>
    <p class="text">This is a sample page</p>
    <button class="btn btn-primary">Click me</button>
    <button class="btn btn-secondary">Cancel</button>
  </div>
</body>
</html>`}
            />
          </div>
          <div className="column">
            <label htmlFor="inputCss">Your CSS</label>
            <textarea
              placeholder="Insert your CSS here"
              rows={20}
              name="inputCss"
              id="inputCss"
              ref={inputCss}
              defaultValue={`.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.title {
  color: #333;
  font-size: 2rem;
  margin-bottom: 1rem;
}

.text {
  color: #666;
  line-height: 1.6;
}

.btn {
  display: inline-block;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  margin-right: 10px;
}

.btn-primary {
  background-color: #007bff;
  color: white;
}

.btn-secondary {
  background-color: #6c757d;
  color: white;
}

/* Unused styles */
.unused-class {
  color: red;
  font-weight: bold;
}

.another-unused {
  background: yellow;
  padding: 50px;
}`}
            />
          </div>
        </div>
        <div className="text-center">
          <button
            id="submitButton"
            className={`button button-large ${loading ? 'button-loading' : ''}`}
            type="submit"
            disabled={loading}
          >
            {loading ? 'Processing...' : 'UnCSS my styles'}
          </button>
        </div>
      </form>

      <div className="row">
        <div className="column">
          <label htmlFor="outputCss">Your shortened CSS</label>
          <textarea
            placeholder="Take your shortened CSS and use it!"
            rows={20}
            name="outputCss"
            id="outputCss"
            readOnly
            value={outputCss}
          />
        </div>
      </div>

      <div className="row">
        <div className="column text-center">
          <button
            className="button js-clipboard"
            data-clipboard-action="copy"
            data-clipboard-target="#outputCss"
            ref={clipboardButton}
          >
            Copy to clipboard
          </button>
          {clipboardMessage && <p id="js-clipboard-message">{clipboardMessage}</p>}
        </div>
      </div>
    </>
  )
}

export default UnCSSTool