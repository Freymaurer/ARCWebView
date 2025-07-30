import {IconButton, Link, Truncate, useResponsiveValue } from '@primer/react'
import {Table, DataTable} from '@primer/react/experimental'
import { type TreeNode } from '../../util/types'
import Icons from '../Icons'


function sortTreeNode(node: TreeNode | null): TreeNode[] {
  if (!node) return [];
  if (!node.children) return [];

  return [...node.children].sort((a, b) => {
    if (a.type === b.type) return a.name.localeCompare(b.name);
    return a.type === "folder" ? -1 : 1;
  });
}

interface HeaderProps {
  navigateTo: (path: string) => void;
  responsiveValue: "narrow" | "regular" | "wide"
}

const mkHeader = ({navigateTo, responsiveValue}: HeaderProps) => {
    return [
      {
        id: 'icon',
        width: 'auto',
        minWidth: '50px',
        header: () => (
            <div
              style={{
                clipPath: 'inset(50%)',
                height: '1px',
                overflow: 'hidden',
                position: 'absolute',
                whiteSpace: 'nowrap',
                width: '1px',
              }}
            >
              icon
            </div>
        ),
        renderCell: (row: TreeNode) => {
          const isFile = row.type === 'file';
          const label = isFile ? 'File' : 'Folder';
          const isXlsx = row.name.endsWith('.xlsx');

          return (
            <span
              aria-label={label}
              // title={label}
              role="img"
            >
              {isXlsx ? <Icons.XlsxIcon /> : isFile ? <Icons.FileIcon aria-hidden="true" /> : <Icons.FolderIcon aria-hidden="true" />}
            </span>
          );
        }
      },
      {
        header: 'Name',
        field: 'name',
        rowHeader: true,
        renderCell: (row: TreeNode) => {
          return (
            <Link href="#" style={{color: 'inherit'}} onClick={() => navigateTo(row.id)}>
              <Truncate title={row.name} maxWidth="200px" expandable>{row.name}</Truncate >
            </Link>
          );
        }
      },
      ...(
        responsiveValue !== 'narrow' ? [{
          header: 'Path',
          field: 'id',
          renderCell: (row: TreeNode) => {
            return (
              <div style={{width: "content-min"}}>
                <Truncate title={row.id} maxWidth="200px">{row.id}</Truncate >
              </div>
            );
          }
        }] : []
      ),
      {
        id: 'actions',
        width: 'auto',
        minWidth: '50px',
        align: 'end',
        header: "Download",
        renderCell: (row: TreeNode) => {
          return (
            row.sha256 
              ? <IconButton
                aria-label={`Download: ${row.name}`}
                title={`Download: ${row.name}`}
                icon={Icons.DownloadIcon}
                variant="invisible"
                onClick={() => {
                  const url = `https://lfs-resolver.nfdi4plants.org/presigned-url/?oid=${row.sha256}`;
                  const link = document.createElement('a');
                  link.href = url;
                  link.target = '_blank';
                  link.rel = 'noopener';
                  link.download = '';
                  link.click();
                }} />
              : <small>unavailable</small>
          )
        },
      }
    ]
}

interface FileTableProps {
  loading: boolean;
  currentTreeNode: TreeNode | null;
  navigateTo: (path: string) => void;
}

export default function FileTable({ loading, currentTreeNode, navigateTo }: FileTableProps) {

  const headerVal = useResponsiveValue(
    {
      narrow: mkHeader({ navigateTo, responsiveValue: 'narrow' }),
      regular: mkHeader({ navigateTo, responsiveValue: 'regular' }),
      wide: mkHeader({ navigateTo, responsiveValue: 'wide' }),
    }, 
    mkHeader({ navigateTo, responsiveValue: 'regular' })
  )

  return (
      <Table.Container>
        {/* <Table.Actions>
          <Button>Action</Button>
        </Table.Actions> */}
        { loading 
          ? <Table.Skeleton
            aria-labelledby="repositories-loading"
            cellPadding="condensed"
            rows={10}
            //@ts-expect-error Too lazy to figure out why exactly the component is unhappy with the type
            columns={headerVal}
          />
          : <DataTable
            aria-labelledby="repositories-default-headerAction"
            aria-describedby="repositories-subtitle-headerAction"
            cellPadding="condensed"
            data={sortTreeNode(currentTreeNode)}
            //@ts-expect-error Too lazy to figure out why exactly the component is unhappy with the type
            columns={headerVal}
          />
        }
      </Table.Container>
  )
}