import jsonString from '../../assets/arc-ro-crate-metadata.json?raw'
import { useEffect, useState } from 'react'
import { JsonController, ARC } from '@nfdi4plants/arctrl'
import FileViewer from '../FileViewer'
import FileTable from '../FileTable'
import FileBreadcrumbs from '../FileBreadcrumbs'
import {Stack} from '@primer/react'
import { type SearchCache, type TreeNode } from '../../util/types'
import readme from '../../assets/README.md?raw'
import TreeSearch from '../TreeSearch'
import { useSearchCacheContext } from '../../contexts'

function pathsToFileTree(paths: string[]) {
  const root: TreeNode = { name: "root", id: "", type: "folder", children: [] };

  const preFilteredPaths = paths.filter(p => !p.endsWith(".gitkeep"));

  for (const path of preFilteredPaths) {
    const parts = path.split("/");
    let current = root;

    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      const isFile = i === parts.length - 1;

      if (!current.children) current.children = [];

      let existing = current.children.find(child => child.name === part);

      if (!existing) {
        const pathSoFar = parts.slice(0, i + 1).join("/")
        existing = {
          name: part,
          id: pathSoFar,
          ...(isFile
            ? { type: "file" }
            : { type: "folder", children: [] })
        };
        current.children.push(existing);
      }

      current = existing;
    }
  }

  return root;
}

function findNodeAtPath(tree: TreeNode, targetPath: string): TreeNode | null {
  const parts = targetPath.split("/").filter(Boolean);
  let current: TreeNode = tree;

  for (const part of parts) {
    if (!current.children) return null;
    const next = current.children.find(child => child.name === part);
    if (!next) return null;
    current = next;
  }

  return current;
}

async function findReadme(tree: TreeNode): Promise<string> {
  if (tree.name !== "root") 
    return "No Readme found";
  return readme;
}

async function fetchFileByNode(tree: TreeNode) {
  console.log("Fetching file for tree node not implemented yet:", tree);
  return "Fetching file for tree node not implemented yet: fetchFileByPath"
}

function flattenTreeToSearchCache(node: TreeNode, path: SearchCache[] = []): SearchCache[] {
  if(node.type === 'file') {
    return [ { name: node.name, path: node.id }];
  }

  if(node.type === 'folder' && node.children) {
    return [ ...node.children.flatMap(child => flattenTreeToSearchCache(child, path)) ];
  }

  return []
}

export default function WebViewer() {

  const [arc, setArc] = useState<ARC | null>(null)
  const [tree, setTree] = useState<TreeNode | null>(null)
  const [currentTreeNode, setCurrentTreeNode] = useState<TreeNode | null>(null)
  const [loading, setLoading] = useState(true)
  const {setCache} = useSearchCacheContext()

  useEffect(() => {
    // This is just to simulate a data fetch, in a real application you would fetch this
    // data from an API or some other source.
    const arc = JsonController.ARC.fromROCrateJsonString(jsonString)
    setArc(arc)
    const paths = arc.FileSystem.Tree.ToFilePaths(true)
    const tree = pathsToFileTree(paths)
    setTree(tree)
    setCurrentTreeNode(tree)
    const flattenedSearchCache = flattenTreeToSearchCache(tree);
    setCache(flattenedSearchCache);
    setLoading(false)
  }, [])

  function navigateTo(path: string) {
    if (!tree) return;
    const node = findNodeAtPath(tree, path);
    if (node) {
      setCurrentTreeNode(node);
    } else {
      console.warn(`Node not found for path: ${path}`);
    }
  }

  return (
    <Stack>
      <TreeSearch navigateTo={navigateTo} />
      {currentTreeNode && arc && arc.Title && <FileBreadcrumbs currentTreeNode={currentTreeNode} navigateTo={navigateTo} title={arc.Title} />}
      {
        currentTreeNode && currentTreeNode.type === 'file'
          ? <FileViewer nodes={[{ node: currentTreeNode, content: () => fetchFileByNode(currentTreeNode) }]} />
          : <FileTable loading={loading} currentTreeNode={currentTreeNode} navigateTo={navigateTo} />
      }
      {tree && currentTreeNode && currentTreeNode.type === 'folder' &&
        <FileViewer nodes={[
          { node: {id: "readme", name: "README.md", type: "file"}, contentType: "markdown", content: () => findReadme(currentTreeNode) },
          { node: {id: "test", name: "Test File", type: "file"}, contentType: "text", content: async () => "aklsöjdkalsöjd" },
          { node: {id: "error testing", name: "Error file", type: "file"}, contentType: "text", content: async () => { throw new Error("Error loading file"); } }
        ]}  />
      }
    </Stack>
  )
}