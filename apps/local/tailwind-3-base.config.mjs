// tailwind-3-base.config.js
module.exports = {
    content: [
        './dist/html/index.html'
        // './dist/css/tailwind.apply.css'
    ],
    corePlugins: {
      // preflight
      preflight: true,
      container: false,
      accessibility: false,
      // ... 
    },
    plugins: []
  }