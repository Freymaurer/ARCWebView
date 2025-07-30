import { TreeView } from "@primer/react";
import { type TreeNode } from "../../util/types";
import Icons from "../Icons";

interface FileTreeProps {
  tree: TreeNode | null;
  expandedFolderIds: string[];
  currentTreeNode: TreeNode | null;
  navigateTo: (path: string) => void;
}

function isXlsxFile(name: string): boolean {
  return name.endsWith('.xlsx');
}

export default function FileTree({tree, currentTreeNode, expandedFolderIds, navigateTo}: FileTreeProps) {

  const renderNode = (node: TreeNode) => {
    const isFolder = node.type === "folder";
    const isCurrent = node.id === currentTreeNode?.id;
    const shouldExpand = expandedFolderIds.includes(node.id);

    return (
      <TreeView.Item key={node.id} id={node.id} current={isCurrent} defaultExpanded={shouldExpand} onSelect={() => navigateTo(node.id)}>
        <TreeView.LeadingVisual>
          {isFolder ? <TreeView.DirectoryIcon /> : isXlsxFile(node.name) ? <Icons.XlsxIcon /> : <Icons.FileIcon />}
        </TreeView.LeadingVisual>
        {node.name}
        {isFolder && node.children && node.children.length > 0 && (
          <TreeView.SubTree>
            {node.children.map(renderNode)}
          </TreeView.SubTree>
        )}
      </TreeView.Item>
    );
  };

  if (!tree || !tree.children || !currentTreeNode) {
    return <div>No files to display</div>;
  }

  return <TreeView aria-label="File Tree">
    {tree.children?.map(renderNode)}
  </TreeView>;
}