import type { ContentType, FileTypes, FileViewerContent } from "../../util/types";
import {SkeletonText, UnderlinePanels} from '@primer/react/experimental'
import { useCachedFiles } from "../../hooks/useCachedFiles";
import MarkdownRender from "../MarkdownRender";

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

  const { files, loading, errors } = useCachedFiles(
    nodes.map(node => node.node.id),
    async (key: string) => {
      const node = nodes.find(node => node.node.id === key);
      if (!node) {
        throw new Error(`Node with id ${key} not found`);
      }
      return node.content();
    }
  )

  return (
    <div className="border rounded-2">
      {loading  
        ? <SkeletonText lines={10} />
        : <UnderlinePanels className="border-bottom" aria-label="Select a file" id="panels">
          {nodes.map((node) => (
            <UnderlinePanels.Tab key={node.node.id} onSelect={event => console.log(event)}>{node.node.name}</UnderlinePanels.Tab>
          ))}
          {nodes.map((node) => (
            <UnderlinePanels.Panel key={node.node.id} className="p-5">
              {
                errors[node.node.id] 
                  ? <div className="text-danger">Error loading file: {errors[node.node.id].message}</div>
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