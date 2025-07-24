import jsonString from '../../assets/arc-ro-crate-metadata.json?raw'
import { useEffect, useState } from 'react'
import { JsonController, ARC } from '@nfdi4plants/arctrl'
import FileViewer from '../FileViewer'
import FileTable from '../FileTable'
import FileBreadcrumbs from '../FileBreadcrumbs'
import {Stack} from '@primer/react'
import { type TreeNode } from '../../util/types'
import readme from '../../assets/README.md?raw'
import MarkdownRender from '../MarkdownRender'

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

async function findReadme(tree: TreeNode): Promise<string | null> {
  if (tree.name !== "root") return null;
  return readme;
}

export default function WebViewer() {

  const [arc, setArc] = useState<ARC | null>(null)
  const [tree, setTree] = useState<TreeNode | null>(null)
  const [currentTreeNode, setCurrentTreeNode] = useState<TreeNode | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // This is just to simulate a data fetch, in a real application you would fetch this
    // data from an API or some other source.
    const arc = JsonController.ARC.fromROCrateJsonString(jsonString)
    setArc(arc)
    const paths = arc.FileSystem.Tree.ToFilePaths(true)
    const tree = pathsToFileTree(paths)
    setTree(tree)
    setCurrentTreeNode(tree)
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
      {currentTreeNode && arc && arc.Title && <FileBreadcrumbs currentTreeNode={currentTreeNode} navigateTo={navigateTo} title={arc.Title} />}
      {
        currentTreeNode && currentTreeNode.type === 'file'
          ? <FileViewer node={currentTreeNode} />
          : <FileTable loading={loading} currentTreeNode={currentTreeNode} navigateTo={navigateTo} />
      }
      {tree && currentTreeNode && currentTreeNode.type === 'folder' && 
        <MarkdownRender content={() => findReadme(currentTreeNode)} />
      }
    </Stack>
  )
}