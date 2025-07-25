import { StrictMode, useState} from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import '@primer/primitives/dist/css/functional/themes/light.css'
import "@primer/css/dist/primer.css";
import {BaseStyles, ThemeProvider} from '@primer/react'
import {marked} from 'marked'
import type { FileCache } from './util/types.ts'
import { FileCacheContext } from './contexts.ts'

marked.use({
  renderer: {
    code: function (code) {
      if (code.lang == 'mermaid') return `<pre class="mermaid">${code.text}</pre>`;
      return `<pre>${code.text}</pre>`;
    }
  }
})

export const FileCacheProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [files, setFiles] = useState<FileCache>({});

    const setFile = (key: string, file: File | Blob | string | null) => {
        setFiles(prev => ({ ...prev, [key]: file }));
    };

    return (
      <FileCacheContext.Provider value= {{ files, setFile }}>
        { children }
      </FileCacheContext.Provider>
    );
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <BaseStyles>
        <FileCacheProvider>
          <App />
        </FileCacheProvider>
      </BaseStyles>
    </ThemeProvider>
  </StrictMode>,
)
