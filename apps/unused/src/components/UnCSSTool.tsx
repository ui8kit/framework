import React, { FormEvent, useEffect, useState } from "react"
import ClipboardJS from "clipboard"

const apiUrl = "/api/uncss"

const UnCSSTool: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<Error | null>(null)
  const [clipboardMessage, setClipboardMessage] = useState<string | null>(null)
  const [outputCss, setOutputCss] = useState<string>("")

  const clipboardButton = React.useRef<HTMLButtonElement>()
  const inputHtml = React.useRef<HTMLTextAreaElement>()
  const inputCss = React.useRef<HTMLTextAreaElement>()

  useEffect(() => {
    const clipboard = new ClipboardJS(clipboardButton.current)

    clipboard.on("success", () => {
      setClipboardMessage("Copied to your clipboard")
    })
    clipboard.on("error", () => {
      setClipboardMessage("Press Command+C to copy")
    })
  }, [])

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setLoading(true)

    const data = {
      inputHtml: inputHtml.current.value,
      inputCss: inputCss.current.value,
    }

    try {
      if (!data.inputHtml) throw new Error("Cannot process empty HTML")
      if (!data.inputCss) throw new Error("Cannot process empty CSS")

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Unknown error')
      }

      setOutputCss(result.outputCss)
      setError(null)
    } catch (error) {
      if (error?.response?.data?.error) {
        setError(Error(error.response.data.error))
      } else {
        setError(error)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {error && (
        <div className="error">
          <div className="error-message">{error.message}</div>
        </div>
      )}

      <form onSubmit={handleSubmit}>
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
            className="button button-large"
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