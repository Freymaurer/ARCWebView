import { useEffect, useLayoutEffect, useState } from 'react';
import { marked } from 'marked';
import mermaid from 'mermaid';
import {SkeletonText} from '@primer/react/experimental'

interface MarkdownRenderProps {
  content: string | (() => Promise<string | null>);
}

export default function MarkdownRender({content}: MarkdownRenderProps) { 

  const [renderedContent, setRenderedContent] = useState<null | string>(null)
  const [noReadme, setNoReadme] = useState<boolean>(false);

  useEffect(() => {
    const parseContent = async () => {
      // If content is a function, call it to get the markdown string
      const markdownContent = typeof content === 'function' ? await content() : content;
      // Parse the content with marked
      if (!markdownContent) {
        setRenderedContent(null);
        setNoReadme(true);
        return;
      }
      const htmlContent = await marked.parse(markdownContent);
      setRenderedContent(htmlContent);
      // Initialize mermaid
    };
    parseContent();
  }, [content]);

  useLayoutEffect(() => {
    if (content) {
      mermaid.initialize({ startOnLoad: true });
      mermaid.contentLoaded();
    }
  });

  return (
    noReadme 
      ? <div hidden >No README found</div>
      : renderedContent === null
        ? <SkeletonText lines={10} />
        : <div className='markdown-body' dangerouslySetInnerHTML={{ __html: renderedContent }} />
  )
}