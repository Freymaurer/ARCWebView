import {IconButton, Link, useResponsiveValue } from '@primer/react'
import {Table, DataTable} from '@primer/react/experimental'
import { type TreeNode } from '../../util/types'

const DownloadIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
	<rect width="24" height="24" fill="none" />
	<path fill="currentColor" d="m12 16l-5-5l1.4-1.45l2.6 2.6V4h2v8.15l2.6-2.6L17 11zm-6 4q-.825 0-1.412-.587T4 18v-3h2v3h12v-3h2v3q0 .825-.587 1.413T18 20z" />
</svg>


const FileIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
	<rect width="24" height="24" fill="none" />
	<path fill="currentColor" d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zm4 18H6V4h7v5h5z" />
</svg>

const FolderIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
	<rect width="24" height="24" fill="none" />
	<path fill="currentColor" d="M4 20q-.825 0-1.412-.587T2 18V6q0-.825.588-1.412T4 4h6l2 2h8q.825 0 1.413.588T22 8v10q0 .825-.587 1.413T20 20z" />
</svg>

const XlsxIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 32 32">
	<defs>
		<linearGradient id="vscodeIconsFileTypeExcel0" x1={4.494} x2={13.832} y1={-2092.086} y2={-2075.914} gradientTransform="translate(0 2100)" gradientUnits="userSpaceOnUse">
			<stop offset={0} stopColor="#18884f"></stop>
			<stop offset={0.5} stopColor="#117e43"></stop>
			<stop offset={1} stopColor="#0b6631"></stop>
		</linearGradient>
	</defs>
	<path fill="#185c37" d="M19.581 15.35L8.512 13.4v14.409A1.19 1.19 0 0 0 9.705 29h19.1A1.19 1.19 0 0 0 30 27.809V22.5Z"></path>
	<path fill="#21a366" d="M19.581 3H9.705a1.19 1.19 0 0 0-1.193 1.191V9.5L19.581 16l5.861 1.95L30 16V9.5Z"></path>
	<path fill="#107c41" d="M8.512 9.5h11.069V16H8.512Z"></path>
	<path d="M16.434 8.2H8.512v16.25h7.922a1.2 1.2 0 0 0 1.194-1.191V9.391A1.2 1.2 0 0 0 16.434 8.2" opacity={0.1}></path>
	<path d="M15.783 8.85H8.512V25.1h7.271a1.2 1.2 0 0 0 1.194-1.191V10.041a1.2 1.2 0 0 0-1.194-1.191" opacity={0.2}></path>
	<path d="M15.783 8.85H8.512V23.8h7.271a1.2 1.2 0 0 0 1.194-1.191V10.041a1.2 1.2 0 0 0-1.194-1.191" opacity={0.2}></path>
	<path d="M15.132 8.85h-6.62V23.8h6.62a1.2 1.2 0 0 0 1.194-1.191V10.041a1.2 1.2 0 0 0-1.194-1.191" opacity={0.2}></path>
	<path fill="url(#vscodeIconsFileTypeExcel0)" d="M3.194 8.85h11.938a1.193 1.193 0 0 1 1.194 1.191v11.918a1.193 1.193 0 0 1-1.194 1.191H3.194A1.19 1.19 0 0 1 2 21.959V10.041A1.19 1.19 0 0 1 3.194 8.85"></path>
	<path fill="#fff" d="m5.7 19.873l2.511-3.884l-2.3-3.862h1.847L9.013 14.6c.116.234.2.408.238.524h.017q.123-.281.26-.546l1.342-2.447h1.7l-2.359 3.84l2.419 3.905h-1.809l-1.45-2.711A2.4 2.4 0 0 1 9.2 16.8h-.024a1.7 1.7 0 0 1-.168.351l-1.493 2.722Z"></path>
	<path fill="#33c481" d="M28.806 3h-9.225v6.5H30V4.191A1.19 1.19 0 0 0 28.806 3"></path>
	<path fill="#107c41" d="M19.581 16H30v6.5H19.581Z"></path>
</svg>

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
              {isXlsx ? <XlsxIcon /> : isFile ? <FileIcon aria-hidden="true" /> : <FolderIcon aria-hidden="true" />}
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
            <Link href="#" style={{color: 'inherit'}} onClick={() => navigateTo(row.id)}>{row.name}</Link>
          );
        }
      },
      ...(
        responsiveValue !== 'narrow' ? [{
          header: 'Path',
          field: 'id',
        }] : []
      ),
      {
        id: 'actions',
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
              actions
            </div>
        ),
        renderCell: (row: TreeNode) => {
          return (
            <IconButton
              aria-label={`Download: ${row.name}`}
              title={`Download: ${row.name}`}
              icon={DownloadIcon}
              variant="invisible"
              onClick={() => {
                alert(`Fake downloading ${row.name}`)
              }}
            />
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