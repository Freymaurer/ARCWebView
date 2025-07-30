const FileIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
    <rect width="24" height="24" fill="none" />
    <path fill="currentColor" d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zm4 18H6V4h7v5h5z" />
</svg>

const FolderIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
	<rect width="24" height="24" fill="none" />
	<path fill="currentColor" d="M4 20q-.825 0-1.412-.587T2 18V6q0-.825.588-1.412T4 4h6l2 2h8q.825 0 1.413.588T22 8v10q0 .825-.587 1.413T20 20z" />
</svg>

const TermIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
  <rect width="24" height="24" fill="none" />
  <path fill="currentColor" d="M7 22q-1.25 0-2.125-.875T4 19q0-.975.563-1.75T6 16.175v-8.35q-.875-.3-1.437-1.075T4 5q0-1.25.875-2.125T7 2t2.125.875T10 5q0 .975-.562 1.75T8 7.825V8q0 1.25.875 2.125T11 11h2q2.075 0 3.538 1.463T18 16v.175q.875.3 1.438 1.075T20 19q0 1.25-.875 2.125T17 22t-2.125-.875T14 19q0-.975.563-1.75T16 16.175V16q0-1.25-.875-2.125T13 13h-2q-.85 0-1.612-.262T8 12v4.175q.875.3 1.438 1.075T10 19q0 1.25-.875 2.125T7 22m0-2q.425 0 .713-.288T8 19t-.288-.712T7 18t-.712.288T6 19t.288.713T7 20m10 0q.425 0 .713-.288T18 19t-.288-.712T17 18t-.712.288T16 19t.288.713T17 20M7 6q.425 0 .713-.288T8 5t-.288-.712T7 4t-.712.288T6 5t.288.713T7 6" />
</svg>

const TableIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
  <rect width="24" height="24" fill="none" />
  <path fill="currentColor" d="M11 16H3v3q0 .825.588 1.413T5 21h6zm2 0v5h6q.825 0 1.413-.587T21 19v-3zm-2-2V9H3v5zm2 0h8V9h-8zM3 7h18V5q0-.825-.587-1.412T19 3H5q-.825 0-1.412.588T3 5z" />
</svg>

const IsaFileIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
  <rect width="24" height="24" fill="none" />
  <path fill="currentColor" d="M8 18h8v-2H8zm0-4h8v-2H8zm-2 8q-.825 0-1.412-.587T4 20V4q0-.825.588-1.412T6 2h8l6 6v12q0 .825-.587 1.413T18 22zm7-13h5l-5-5z" />
</svg>

const PersonIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
  <rect width="24" height="24" fill="none" />
  <path fill="currentColor" d="M12 12q-1.65 0-2.825-1.175T8 8t1.175-2.825T12 4t2.825 1.175T16 8t-1.175 2.825T12 12m-8 8v-2.8q0-.85.438-1.562T5.6 14.55q1.55-.775 3.15-1.162T12 13t3.25.388t3.15 1.162q.725.375 1.163 1.088T20 17.2V20z" />
</svg>

const SearchIcon = () => <div className='d-flex align-items-center justify-content-center'>
  <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 24 24">
    <rect width="24" height="24" fill="none" />
    <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="m21 21l-4.343-4.343m0 0A8 8 0 1 0 5.343 5.343a8 8 0 0 0 11.314 11.314" />
  </svg>
</div>

const SidebarExpandIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 16 16">
  <rect width="16" height="16" fill="none" />
  <path fill="currentColor" d="m4.177 7.823l2.396-2.396A.25.25 0 0 1 7 5.604v4.792a.25.25 0 0 1-.427.177L4.177 8.177a.25.25 0 0 1 0-.354" />
  <path fill="currentColor" d="M0 1.75C0 .784.784 0 1.75 0h12.5C15.216 0 16 .784 16 1.75v12.5A1.75 1.75 0 0 1 14.25 16H1.75A1.75 1.75 0 0 1 0 14.25Zm1.75-.25a.25.25 0 0 0-.25.25v12.5c0 .138.112.25.25.25H9.5v-13Zm12.5 13a.25.25 0 0 0 .25-.25V1.75a.25.25 0 0 0-.25-.25H11v13Z" />
</svg>

const SidebarCollapseIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 16 16">
  <rect width="16" height="16" fill="none" />
  <path fill="currentColor" d="M6.823 7.823a.25.25 0 0 1 0 .354l-2.396 2.396A.25.25 0 0 1 4 10.396V5.604a.25.25 0 0 1 .427-.177Z" />
  <path fill="currentColor" d="M1.75 0h12.5C15.216 0 16 .784 16 1.75v12.5A1.75 1.75 0 0 1 14.25 16H1.75A1.75 1.75 0 0 1 0 14.25V1.75C0 .784.784 0 1.75 0M1.5 1.75v12.5c0 .138.112.25.25.25H9.5v-13H1.75a.25.25 0 0 0-.25.25M11 14.5h3.25a.25.25 0 0 0 .25-.25V1.75a.25.25 0 0 0-.25-.25H11Z" />
</svg>

const DownloadIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
	<rect width="24" height="24" fill="none" />
	<path fill="currentColor" d="m12 16l-5-5l1.4-1.45l2.6 2.6V4h2v8.15l2.6-2.6L17 11zm-6 4q-.825 0-1.412-.587T4 18v-3h2v3h12v-3h2v3q0 .825-.587 1.413T18 20z" />
</svg>

const XlsxIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 32 32">
	<rect width="32" height="32" fill="none" />
	<path fill="#20744a" fillRule="evenodd" d="M28.781 4.405h-10.13V2.018L2 4.588v22.527l16.651 2.868v-3.538h10.13A1.16 1.16 0 0 0 30 25.349V5.5a1.16 1.16 0 0 0-1.219-1.095m.16 21.126H18.617l-.017-1.889h2.487v-2.2h-2.506l-.012-1.3h2.518v-2.2H18.55l-.012-1.3h2.549v-2.2H18.53v-1.3h2.557v-2.2H18.53v-1.3h2.557v-2.2H18.53v-2h10.411Z" />
	<path fill="#20744a" d="M22.487 7.439h4.323v2.2h-4.323zm0 3.501h4.323v2.2h-4.323zm0 3.501h4.323v2.2h-4.323zm0 3.501h4.323v2.2h-4.323zm0 3.501h4.323v2.2h-4.323z" />
	<path fill="#fff" fillRule="evenodd" d="m6.347 10.673l2.146-.123l1.349 3.709l1.594-3.862l2.146-.123l-2.606 5.266l2.606 5.279l-2.269-.153l-1.532-4.024l-1.533 3.871l-2.085-.184l2.422-4.663z" />
</svg>

const Icons = {
  FileIcon,
  FolderIcon,
  TermIcon,
  TableIcon,
  IsaFileIcon,
  PersonIcon,
  SearchIcon,
  SidebarExpandIcon,
  SidebarCollapseIcon,
  DownloadIcon,
  XlsxIcon
}

export default Icons;