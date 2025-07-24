import { useEffect, useState } from "react";
import type { TreeNode } from "../../util/types";

interface FileViewerProps {
  node: TreeNode;
}

export default function FileViewer ({node}: FileViewerProps) {

  const [,] = useState<unknown>(null);
  useEffect(() => {
    console.log("FileViewer component mounted with node:", node);
  }, [node]);
  
  // useEffect(() => {
  //   async function fetchFile() {
  //     if (!fetchUrl) return;
  //     try {
  //       const response = await fetch(fetchUrl);
  //       if (!response.ok) {
  //         throw new Error(`HTTP error! status: ${response.status}`);
  //       }
  //       const data = await response.json();
  //       console.log(data);
  //       setFile(data);
  //     } catch (error) {
  //       console.error("Error fetching file:", error);
  //     }
  //   }
  //   fetchFile();
  // }, [fetchUrl]);

  return (
    <div>
      <h1>File Viewer</h1>
      <p>This component is under construction.</p>
      {/* Additional content can be added here */}
    </div>
  )
}