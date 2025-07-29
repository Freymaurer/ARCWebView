import type { ContentType, FileTypes, FileViewerContent } from "../../util/types";
import {SkeletonText, UnderlinePanels} from '@primer/react/experimental'
import { useCachedFiles } from "../../hooks/useCachedFiles";
import MarkdownRender from "../MarkdownRender";
import { useState } from "react";

interface FileViewerContentProps {
  file: FileTypes;
  contentType: ContentType;
}

interface FileViewerProps {
  nodes: FileViewerContent[]
}

function FileViewerContent({ file, contentType }: FileViewerContentProps) {
  return (
    <div>
      {/* {file && (typeof file === "jsx") && file} */}
      {file && (typeof file === "string") &&
        contentType === "markdown" 
          ? <MarkdownRender content={file as string} /> 
          : <div>{file as string}</div>
      }
      {(file instanceof File) &&
        <div>
          <strong>File:</strong> {file.name} ({file.type}, {file.size} bytes)
        </div>
      }
      {(file instanceof Blob && !(file instanceof File)) &&
        <div>
          <strong>Blob:</strong> {file.type} ({file.size} bytes)
        </div>
      }
    </div>
  );
}

export default function FileViewer ({nodes}: FileViewerProps) {

  const filteredNodes = nodes.filter(node => !!node.content);

  const { files, loading, errors } = useCachedFiles(
    filteredNodes.map(node => node.node.id),
    async (key: string) => {
      const node = filteredNodes.find(node => node.node.id === key);
      if (!node) {
        throw new Error(`Node with id ${key} not found`);
      }
      return node.content ? await node.content() : await (async () => "none")();
    }
  )

  const [selectedTab, setSelectedTab] = useState<string | null>(null);

  return (
    <div className="border rounded-2">
      {loading  
        ? <SkeletonText lines={10} />
        : <UnderlinePanels className="border-bottom" aria-label="Select a file" id="panels">
          {nodes.map((node) => (
            <UnderlinePanels.Tab key={node.node.id + node.name} aria-selected={selectedTab === node.node.id + node.name} onSelect={() => setSelectedTab(node.node.id + node.name)}>{node.name || node.node.name}</UnderlinePanels.Tab>
          ))}
          {nodes.map((node) => (
            <UnderlinePanels.Panel key={node.node.id + node.name} className="p-5">
              {
                errors[node.node.id] 
                  ? <div className="text-danger">Error loading file: {errors[node.node.id].message}</div>
                  : node.component
                  ? node.component
                  : <FileViewerContent
                    file={files[node.node.id]}
                    contentType={node.contentType || "text"}
                  />
              }
            </UnderlinePanels.Panel>
          ))}
        </UnderlinePanels>
      }
    </div>
  )
}