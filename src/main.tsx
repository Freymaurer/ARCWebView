import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import '@primer/primitives/dist/css/functional/themes/light.css'
import {BaseStyles, ThemeProvider} from '@primer/react'
import {marked} from 'marked'

marked.use({
  renderer: {
    code: function (code) {
      if (code.lang == 'mermaid') return `<pre class="mermaid">${code.text}</pre>`;
      return `<pre>${code.text}</pre>`;
    }
  }
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <BaseStyles>
        <App />
      </BaseStyles>
    </ThemeProvider>
  </StrictMode>,
)
