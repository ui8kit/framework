import React from "react"
import UnCSSTool from './components/UnCSSTool'

function App() {
  return (
    <div className="App">
      <header className="header">
        <h1>UnCSS Online!</h1>
        <p><strong>Simply UnCSS your styles online!</strong></p>
      </header>

      <main className="container">
        <h3>Usage:</h3>
        <ul>
          <li>Copy&amp;paste your HTML and CSS into boxes below</li>
          <li>Click button</li>
          <li>Wait for magic to happen</li>
          <li>Unused CSS <a href="https://www.youtube.com/watch?v=DgS4DD0CgHs" target="_blank" rel="noopener">is gone</a>, take the rest and use it!</li>
        </ul>

        <UnCSSTool />

        <h3>Advanced usage</h3>
        <p>
          For advanced options please consider adding UnCSS to your devstack -{' '}
          <a href="https://github.com/RyanZim/postcss-uncss" target="_blank" rel="noopener">PostCSS</a>,{' '}
          <a href="https://github.com/ben-eb/gulp-uncss" target="_blank" rel="noopener">Gulp</a>,{' '}
          <a href="https://github.com/addyosmani/grunt-uncss" target="_blank" rel="noopener">Grunt</a>.
        </p>

        <h3>What is this good for?</h3>
        <p>
          Do you have static 404 or 500 page, bundled styles for the whole site and you need only couple of CSS for
          these static pages to work? Well, here you have the tool for that. You're welcome.
        </p>
      </main>

      <footer className="footer">
        <div className="container">
          <span>
            Made with ❤️ using{' '}
            <a href="https://github.com/uncss/uncss" target="_blank" rel="noopener">UnCSS</a>{' '}
            &{' '}
            <a href="https://vitejs.dev" target="_blank" rel="noopener">Vite.js</a>
          </span>
        </div>
      </footer>
    </div>
  )
}

export default App