import WebViewer from './components/WebViewer';
import { useEffect, useState } from 'react';
import {Banner, Blankslate} from '@primer/react/experimental'
import Icons from './components/Icons';
import { FileCacheProvider, SearchCacheProvider } from './ContextProvider';
import { marked } from 'marked';



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



marked.use({
  renderer: {
    code: function (code) {
      if (code.lang == 'mermaid') return `<pre class="mermaid">${code.text}</pre>`;
      return `<pre>${code.text}</pre>`;
    }
  }
})

interface AppProps {
  jsonString?: () => Promise<string>;
  readmefetch?: () => Promise<string>;
  licensefetch?: () => Promise<string>;
}

function App({ jsonString: outerJson, readmefetch, licensefetch }: AppProps) {

  const [jsonString, setJsonString] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchJson = async () => {
      if (outerJson) {
        try {
          setLoading(true);
          const json = await outerJson();
          setJsonString(json);
        } catch (err) {
          console.error('Error fetching JSON:', err);
          setError('Failed to load JSON data.');
        } finally {
          setLoading(false);
        }
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
        console.warn('arcwebview.getROCJson is not available.');
        setLoading(false);
      }
    };
    fetchJson();
    }, [outerJson]);

  return (
    <FileCacheProvider>
      <SearchCacheProvider>
        {
          error && <ErrorBanner error={error} />
        }
        {
          loading || !jsonString 
            ? <BlankSlate /> 
            : <WebViewer jsonString={jsonString} readmefetch={readmefetch} licensefetch={licensefetch} />
        }
      </SearchCacheProvider>
    </FileCacheProvider>

  )
}

export default App
