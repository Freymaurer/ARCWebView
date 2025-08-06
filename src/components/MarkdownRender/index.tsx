import { useEffect, useLayoutEffect, useState } from 'react';
import { marked } from 'marked';
import mermaid from 'mermaid';
import {SkeletonText} from '@primer/react/experimental'

interface MarkdownRenderProps {
  // must be markdown string
  content: string;
}

mermaid.initialize({startOnLoad: false})

export default function MarkdownRender({content}: MarkdownRenderProps) { 

  const [renderedContent, setRenderedContent] = useState<string>("")
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const parseContent = async () => {
      // Parse the content with marked
      const htmlContent = await marked.parse(content);
      setRenderedContent(htmlContent);
      setLoading(false);
    };
    parseContent();
  }, [content]);

  useLayoutEffect(() => {

    const mermaidElements = document.querySelectorAll(".mermaid");
    console.log("Mermaid elements found:", mermaidElements.length);

    const loadMermaid = async () => {
      console.log("Loading Mermaid...");
      await mermaid.run();
    }
    loadMermaid();
  }, [renderedContent, loading]);

  return (
      loading
        ? <SkeletonText lines={10} />
        : <div className='markdown-body' dangerouslySetInnerHTML={{ __html: renderedContent }} />
  )
}