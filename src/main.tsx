import { StrictMode, useState} from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import '@primer/primitives/dist/css/functional/themes/light.css'
import "@primer/css/dist/primer.css";
import {BaseStyles, ThemeProvider} from '@primer/react'
import {marked} from 'marked'
import type { FileCache, FileTypes, SearchCache } from './util/types.ts'
import { FileCacheContext, SearchCacheContext } from './contexts.ts'

marked.use({
  renderer: {
    code: function (code) {
      if (code.lang == 'mermaid') return `<pre class="mermaid">${code.text}</pre>`;
      return `<pre>${code.text}</pre>`;
    }
  }
})

const FileCacheProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [files, setFiles] = useState<FileCache>({});

    const setFile = (key: string, file: FileTypes) => {
        setFiles(prev => ({ ...prev, [key]: file }));
    };

    return (
      <FileCacheContext.Provider value= {{ files, setFile }}>
        { children }
      </FileCacheContext.Provider>
    );
};

const SortCacheProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [cache, setCache] = useState<SearchCache[]>([]);

    return (
      <SearchCacheContext.Provider value= {{ cache, setCache }}>
        { children }
      </SearchCacheContext.Provider>
    );
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <BaseStyles>
        <FileCacheProvider>
          <SortCacheProvider>
            <App />
          </SortCacheProvider>
        </FileCacheProvider>
      </BaseStyles>
    </ThemeProvider>
  </StrictMode>,
)
