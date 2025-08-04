import './App.css'
import WebViewer from './components/WebViewer';
import { useEffect, useState } from 'react';
import {Banner, Blankslate} from '@primer/react/experimental'
import Icons from './components/Icons';
import { BaseStyles, ThemeProvider } from '@primer/react';
import { FileCacheProvider, SearchCacheProvider } from './ContextProvider';
import { marked } from 'marked';

import '@primer/primitives/dist/css/functional/themes/light.css'
import "@primer/css/dist/primer.css";

function ErrorBanner({error}: {error: string}) {
  return (
    <Banner
      aria-label="Error"
      title="Error"
      description={error}
      variant="critical"
    />
  )
}

function BlankSlate() {
  return (
    <Blankslate>
      <Blankslate.Visual>
        <Icons.SearchIcon />
      </Blankslate.Visual>
      <Blankslate.Heading>Welcome to the ARC web viewer</Blankslate.Heading>
      <Blankslate.Description>
        This viewer allows you to explore and visualize your ARC metadata. Currently no data is loaded.
      </Blankslate.Description>
      {/* <Blankslate.PrimaryAction href="#">Create the first page</Blankslate.PrimaryAction> */}
    </Blankslate>
  )
}

declare global {
  interface Window {
    arcwebview: {
      getROCJson: () => Promise<string>;
    };
  }
}

marked.use({
  renderer: {
    code: function (code) {
      if (code.lang == 'mermaid') return `<pre class="mermaid">${code.text}</pre>`;
      return `<pre>${code.text}</pre>`;
    }
  }
})

interface AppProps {
  jsonString?: string;
}

function App({ jsonString: outerJson }: AppProps) {

  const [jsonString, setJsonString] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchJson = async () => {
      if (outerJson) {
        setJsonString(outerJson);
        setLoading(false);
        return;
      }
      if (window.arcwebview && window.arcwebview.getROCJson) {
        try {
          setLoading(true);
          const json = await window.arcwebview.getROCJson();
          setJsonString(json);
        } catch (err) {
          console.error('Error fetching JSON:', err);
          setError('Failed to load JSON data.');
        } finally {
          setLoading(false);
        }
      } else {
        console.warn('arcwebview.getROCJson is not available, using example JSON.');
        const exmpJsonString = await import('./assets/arc-ro-crate-metadata.json?raw');
        setJsonString(exmpJsonString.default);
        setLoading(false);
      }
    };
    fetchJson();
    }, []);

  return (
    <ThemeProvider>
      <BaseStyles>
        <FileCacheProvider>
          <SearchCacheProvider>
            {
              error && <ErrorBanner error={error} />
            }
            {
              loading 
                ? <BlankSlate /> 
                : jsonString && <WebViewer jsonString={jsonString} />
            }
          </SearchCacheProvider>
        </FileCacheProvider>
      </BaseStyles>
    </ThemeProvider>
  )
}

export default App
