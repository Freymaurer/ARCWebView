import { useEffect, useMemo, useState } from 'react'
import { JsonController, ARC, OntologyAnnotation, ArcInvestigation, ROCrate } from '@nfdi4plants/arctrl'
import FileViewer from '../FileViewer'
import FileTable from '../FileTable'
import FileBreadcrumbs from '../FileBreadcrumbs'
import { SplitPageLayout, Stack, IconButton, useResponsiveValue, Dialog} from '@primer/react'
import { type ContentType, type SearchCache, type TreeNode } from '../../util/types'
// import readme from '../../assets/README.md?raw'
import TreeSearch from '../TreeSearch'
import { useSearchCacheContext } from '../../contexts'
import AnnotationTable from '../AnnotationTable'
import AssayMetadata from '../Metadata/AssayMetadata'
import StudyMetadata from '../Metadata/StudyMetadata'
import ARCMetadata from '../Metadata/ARCMetadata'
import FileTree from '../FileTree'
import Icons from '../Icons'

function pathsToFileTree(paths: string[], exportMetadataMap: Map<string, ARCExportMetadata>) {
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
          sha256: exportMetadataMap.get(pathSoFar)?.sha256 || undefined, // Use sha256 if available
          contentSize: exportMetadataMap.get(pathSoFar)?.contentSize || undefined, // Use contentSize if available
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

// async function findReadme(tree: TreeNode): Promise<string> {
//   if (tree.name !== "root") 
//     return "No Readme found";
//   return readme;
// }

async function fetchFileByNode(tree: TreeNode, arc: ArcInvestigation) {
  console.warn("Fetching file by node not implemented yet: fetchFileByNode", tree, arc);
  return "This feature is not implemented yet. At the moment you can only view metadata files."
}

function flattenTreeToSearchCache(node: TreeNode, path: SearchCache[] = []): SearchCache[] {
  if(node.type === 'file') {
    return [ { name: node.name, path: node.id, type: "file" } ];
  }

  if(node.type === 'folder' && node.children) {
    return [ ...node.children.flatMap(child => flattenTreeToSearchCache(child, path)) ];
  }

  return []
}


async function asyncDataToSearchCache(tree: TreeNode, arc: ARC, setCache: React.Dispatch<React.SetStateAction<SearchCache[]>>): Promise<void> {
  const treeCache = flattenTreeToSearchCache(tree);
  setCache(treeCache);
  const headers = new Set<SearchCache>();
  arc.Assays.forEach(assay => {
    const path = `assays/${assay.Identifier}/isa.assay.xlsx`;
    headers.add({ name: assay.Identifier, path, type: "isa-title" });
    assay.Performers.forEach(contact => {
      if (contact.ORCID) {
        headers.add({ name: contact.ORCID, path, type: "person" });
      }
      const name = [contact.FirstName, contact.MidInitials, contact.LastName].filter(Boolean).join(" ")
      if (name) {
        headers.add({ name, path, type: "person" });
      }
    })
    assay.tables.forEach(table => {
      headers.add({ name: table.Name, path, type: "isa-table" });
      table.Headers.forEach(header => {
        const term = header.TryGetTerm();
        if (!term) {
          headers.add({ name: header.toString(), path, type: "header" });        
        } 
        if (term) {
          const nametext = (term as OntologyAnnotation).NameText;
          if (nametext) {
            headers.add({ name: nametext, path, type: "header" });
          }
        }
      });
    });
  });
  arc.Studies.forEach(study => {
    const path = `studies/${study.Identifier}/isa.study.xlsx`;
    headers.add({ name: study.Identifier, path, type: "isa-title" });
    study.Contacts.forEach(contact => {
      if (contact.ORCID) {
        headers.add({ name: contact.ORCID, path, type: "person" });
      }
      const name = [contact.FirstName, contact.MidInitials, contact.LastName].filter(Boolean).join(" ")
      if (name) {
        headers.add({ name, path, type: "person" });
      }
    })
    study.tables.forEach(table => {
      headers.add({ name: table.Name, path, type: "isa-table" });
      table.Headers.forEach(header => {
        const term = header.TryGetTerm();
        if (!term) {
          headers.add({ name: header.toString(), path, type: "header" });
        }
        if (term) {
          const nametext = (term as OntologyAnnotation).NameText;
          if (nametext) {
            headers.add({ name: nametext, path, type: "header" });
          }
        }
      });
    });
  });
  const investigationPath = `isa.investigation.xlsx`;
  arc.Contacts.forEach(contact => {
    if (contact.ORCID) {
      headers.add({ name: contact.ORCID, path: investigationPath, type: "person" });
    }
    const name = [contact.FirstName, contact.MidInitials, contact.LastName].filter(Boolean).join(" ")
    if (name) {
      headers.add({ name, path: investigationPath, type: "person" });
    }
  })
  setCache(prevCache => [...prevCache, ...Array.from(headers)]);
  return;
}

function FileViewerAssay({currentTreeNode, arc}: {currentTreeNode: TreeNode, arc: ARC}): JSX.Element {

  const assayIdent = currentTreeNode.id.match(/assays\/([^/]+)\/isa\.assay\.xlsx/)

  const assay = arc.Assays.find(a => a.Identifier === assayIdent?.[1]);

  if (!assay) {
    return <div>Assay not found</div>;
  }

  return (
    <FileViewer nodes={[
      { node: currentTreeNode, name: "Metadata", component: <AssayMetadata assay={assay}/>, contentType: "jsx" },
      ...(assay.Tables.map(table => ({
        node: currentTreeNode,
        name: table.Name,
        contentType: "jsx" as ContentType,
        component: <AnnotationTable table={table} />
      })))
    ]} />
  );
}

function FileViewerStudy({currentTreeNode, arc}: {currentTreeNode: TreeNode, arc: ARC}): JSX.Element {

  const studyIdent = currentTreeNode.id.match(/studies\/([^/]+)\/isa\.study\.xlsx/)

  const study = arc.Studies.find(s => s.Identifier === studyIdent?.[1]);

  if (!study) {
    return <div>Study not found</div>;
  }

  return (
    <FileViewer nodes={[
      { node: currentTreeNode, component: <StudyMetadata study={study}/>, contentType: "jsx" },
      ...(study.Tables.map(table => ({
        node: currentTreeNode,
        name: table.Name,
        contentType: "jsx" as ContentType,
        component: <AnnotationTable table={table} />
      })))
    ]} />
  );
}

function FileViewerInvestigation({currentTreeNode, arc}: {currentTreeNode: TreeNode, arc: ARC}): JSX.Element {

  return (
    <FileViewer nodes={[
      { node: currentTreeNode, component: <ARCMetadata arc={arc} />, contentType: "jsx" }
    ]} />
  );
}

function renderFileComponentByName(currentTreeNode: TreeNode, arc: ARC): JSX.Element {
  switch (currentTreeNode.name) {
    case "isa.investigation.xlsx":
      return <FileViewerInvestigation currentTreeNode={currentTreeNode} arc={arc} />;
    case "isa.study.xlsx":
      return <FileViewerStudy currentTreeNode={currentTreeNode} arc={arc} />;
    case "isa.assay.xlsx":
      return <FileViewerAssay currentTreeNode={currentTreeNode} arc={arc} />;
    default:
      return <FileViewer nodes={[
        { node: currentTreeNode, content: () => fetchFileByNode(currentTreeNode, arc) }]
      } />
  }
}

interface SideSheetProps {
  close: () => void;
  children?: React.ReactNode;
}

function SideSheet({close, children}: SideSheetProps) {

  return (
    <Dialog title="My Dialog" onClose={close} position="left" >
      {children}
    </Dialog>
  )
}

// Helper to find the path to the currentId (returns list of folder IDs)
function findPathToNode(tree: TreeNode[], targetId: string, path: string[] = []): string[] | null {
  for (const node of tree) {
    if (node.id === targetId) {
      console.log("Found node:", node);
      return path;
    }
    if (node.type === "folder" && node.children) {
      const result = findPathToNode(node.children, targetId, [...path, node.id]);
      if (result) return result;
    }
  }
  return null;
}

function navigateToPathInTree(path: string, tree: TreeNode | null, setCurrentTreeNode: React.Dispatch<React.SetStateAction<TreeNode | null>>) {
  if (!tree) return;
  const node = findNodeAtPath(tree, path);
  if (node) {
    setCurrentTreeNode(node);
  } else {
    console.warn(`Node not found for path: ${path}`);
  }
}


interface WebViewerProps {
  jsonString: string;
  readmefetch?: () => Promise<string>;
  licensefetch?: () => Promise<string>;
}

function formatFileSize(input: string): string {
  const match = input.match(/^(\d+)(b|B)$/);
  if (!match) return input;

  const bytes = parseInt(match[1], 10);
  if (isNaN(bytes)) return input;

  const units = ["B", "KB", "MB", "GB", "TB", "PB"];
  let i = 0;
  let size = bytes;

  while (size >= 1024 && i < units.length - 1) {
    size /= 1024;
    i++;
  }

  return `${size.toFixed(2)} ${units[i]}`;
}

interface ARCExportMetadata {
  sha256: string;
  contentSize: string | undefined;
}

export default function WebViewer({ jsonString }: WebViewerProps) {

  const [arc, setArc] = useState<ARC | null>(null)
  const [tree, setTree] = useState<TreeNode | null>(null)
  const [currentTreeNode, setCurrentTreeNode] = useState<TreeNode | null>(null)
  const [loading, setLoading] = useState(true)
  const {setCache} = useSearchCacheContext()

  const [sidebarActive, setSidebarActive] = useState(false);

  const isSmallScreen = useResponsiveValue({
    narrow: true,
    regular: true,
    wide: false
  }, false)

  const navigateTo = useMemo(() => {
    return (path: string) => {
      navigateToPathInTree(path, tree, setCurrentTreeNode);
      if (isSmallScreen) {
        setSidebarActive(false);
      }
    }
  }, [tree, isSmallScreen]);

  useEffect(() => {
    // This is just to simulate a data fetch, in a real application you would fetch this
    // data from an API or some other source.
    const g = JsonController.LDGraph.fromROCrateJsonString(jsonString);
    const arc = JsonController.ARC.fromROCrateJsonString(jsonString);
    const files = g.Nodes.filter(n => ROCrate.LDFile.validate(n, g.TryGetContext() as any));
    const fileIdExportMetadataMap = new Map<string, ARCExportMetadata>();
    files.forEach(file => {
      const id = file.id;
      const sha = file.TryGetProperty('http://schema.org/sha256', g.TryGetContext() as any);
      if (id && sha) {
        const contentSize = file.TryGetProperty("contentSize");
        fileIdExportMetadataMap.set(id, { sha256: sha, contentSize: contentSize ? formatFileSize(contentSize) : undefined });
      }
    });
    setArc(arc)
    const paths = arc.FileSystem.Tree.ToFilePaths(true)
    const tree = pathsToFileTree(paths, fileIdExportMetadataMap);
    setTree(tree)
    setCurrentTreeNode(tree)
    asyncDataToSearchCache(tree, arc, setCache);
    setLoading(false)
  }, [setCache, jsonString])

  const expandedFolderIds = useMemo(() => {
    return currentTreeNode?.id ? findPathToNode(tree?.children || [], currentTreeNode.id) ?? [] : []; 
  }, [tree, currentTreeNode]);

  const renderedTree = useMemo(() => (
    <FileTree tree={tree} currentTreeNode={currentTreeNode} expandedFolderIds={expandedFolderIds} navigateTo={navigateTo} />
  ), [tree, currentTreeNode, expandedFolderIds, navigateTo]);

  return (
    <SplitPageLayout>
      {/* <SplitPageLayout.Header >
      </SplitPageLayout.Header> */}
      <div className="z-2">
        { sidebarActive && isSmallScreen as boolean && (
          <SideSheet close={() => setSidebarActive(false)} >
            {renderedTree}
          </SideSheet>
        )}
      </div>
      <SplitPageLayout.Pane 
        aria-label="Sidebar" 
        resizable={true} 
        widthStorageKey={"arc-webviewer-sidebar-width"}
        hidden={!sidebarActive || isSmallScreen as boolean} 
        sticky={true}
      >
        {renderedTree}
      </SplitPageLayout.Pane>
      <SplitPageLayout.Content>
        <Stack>
          <div className="bgColor-default py-2 position-sticky top-0 z-1 d-flex flex-items-start">
            <Stack className="flex-column flex-sm-row flex-items-start flex-sm-items-center" >
              <div className="d-flex flex-row" style={{ gap: "0.5rem" }}>
                <IconButton aria-label="Expand sidebar" variant='invisible' icon={sidebarActive ? Icons.SidebarCollapseIcon : Icons.SidebarExpandIcon} onClick={() => setSidebarActive(!sidebarActive)} />
                <TreeSearch navigateTo={navigateTo} />
              </div>
              {currentTreeNode && arc && arc.Title && <FileBreadcrumbs currentTreeNode={currentTreeNode} navigateTo={navigateTo} title={arc.Title} />}
            </Stack>
          </div>
          {
            currentTreeNode && currentTreeNode.type === 'file' && arc
              ? (renderFileComponentByName(currentTreeNode, arc)) 
              : <FileTable loading={loading} currentTreeNode={currentTreeNode} navigateTo={navigateTo} />
          }
          {/* {tree && currentTreeNode && currentTreeNode.name === "root" && currentTreeNode.type === 'folder' &&
            <FileViewer nodes={[
              { node: {id: currentTreeNode.name + "readme", name: "README.md", type: "file"}, contentType: "markdown", content: async () => findReadme(currentTreeNode) },
            ]}  />
          } */}
        </Stack>
      </SplitPageLayout.Content>
    </SplitPageLayout>
  )
}