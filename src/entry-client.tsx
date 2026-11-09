import '@fontsource-variable/geist'
import '@fontsource-variable/jetbrains-mono'
import './styles/global.css'
import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import { App } from './App.tsx'

const container = document.getElementById('root')

if (!container) {
  throw new Error('Root element not found')
}

const app = (
  <StrictMode>
    <App />
  </StrictMode>
)

// The production HTML is prerendered, the dev server starts from an empty root.
if (container.firstElementChild) {
  hydrateRoot(container, app)
} else {
  createRoot(container).render(app)
}
