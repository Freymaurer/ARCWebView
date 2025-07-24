import {type TreeNode} from '../../util/types'
import {Breadcrumbs} from '@primer/react'

interface FileBreadcrumbsProps {
  currentTreeNode: TreeNode;
  title?: string;
  navigateTo: (path: string) => void;
}

export default function FileBreadcrumbs({ currentTreeNode, navigateTo, title = "root" }: FileBreadcrumbsProps) {
  const parts = currentTreeNode.id.split('/').filter(Boolean);

  return (
    <Breadcrumbs>
      <Breadcrumbs.Item
          key="root"
          href="#"
          onClick={() => navigateTo("")}
          selected={parts.length === 0}
        >
          {title}
      </Breadcrumbs.Item>
      {parts.map((part, index) => {
        const path = parts.slice(0, index + 1).join('/');
        return (
          <Breadcrumbs.Item
            key={path}
            href="#"
            onClick={() => navigateTo(path)}
            selected={index === parts.length - 1}
          >
            {part}
          </Breadcrumbs.Item>
        );
      })}
    </Breadcrumbs>
  );
}