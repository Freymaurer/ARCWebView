import { StrictMode} from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { BaseStyles, ThemeProvider } from '@primer/react'

declare global {
  interface Window {
    arcwebview: {
      getROCJson: () => Promise<string>;
    };
  }
}

const loadExmpReadme = async () => {
  const readme = await import('./assets/README.md?raw');
  return readme.default;
}

const loadExmpJson = async () => {
  const json = await import('./assets/arc-ro-crate-metadata.json?raw');
  return json.default;
}

function isPlugin() {
  return !!window.arcwebview && !!window.arcwebview.getROCJson;
}

/// add getROCJson to to test plugin mode
// window.arcwebview = {
//   getROCJson: async () => {
//     const json = await loadExmpJson();
//     return json;
//   },
// }

import '@primer/primitives/dist/css/functional/themes/light.css'
import "@primer/css/dist/primer.css";

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <BaseStyles>
        <App jsonString={isPlugin() ? undefined : loadExmpJson} readmefetch={isPlugin() ? undefined : loadExmpReadme} />
        {/* <App /> */}
      </BaseStyles>
    </ThemeProvider>
  </StrictMode>,
)
