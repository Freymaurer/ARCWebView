import jsonString from '../../assets/arc-ro-crate-metadata.json?raw'
import { useEffect, useState } from 'react'
import { JsonController, ARC, OntologyAnnotation, ArcInvestigation } from '@nfdi4plants/arctrl'
import FileViewer from '../FileViewer'
import FileTable from '../FileTable'
import FileBreadcrumbs from '../FileBreadcrumbs'
import {PageLayout, Stack} from '@primer/react'
import { type ContentType, type SearchCache, type TreeNode } from '../../util/types'
import readme from '../../assets/README.md?raw'
import TreeSearch from '../TreeSearch'
import { useSearchCacheContext } from '../../contexts'
import AnnotationTable from '../AnnotationTable'
import AssayMetadata from '../Metadata/AssayMetadata'
import StudyMetadata from '../Metadata/StudyMetadata'
import ARCMetadata from '../Metadata/ARCMetadata'


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

export default function WebViewer() {

  const [arc, setArc] = useState<ARC | null>(null)
  const [tree, setTree] = useState<TreeNode | null>(null)
  const [currentTreeNode, setCurrentTreeNode] = useState<TreeNode | null>(null)
  const [loading, setLoading] = useState(true)
  const {setCache} = useSearchCacheContext()

  useEffect(() => {
    // This is just to simulate a data fetch, in a real application you would fetch this
    // data from an API or some other source.
    // const g = JsonController.LDGraph.fromROCrateJsonString(jsonString);
    const arc = JsonController.ARC.fromROCrateJsonString(jsonString)
    setArc(arc)
    const paths = arc.FileSystem.Tree.ToFilePaths(true)
    const tree = pathsToFileTree(paths)
    setTree(tree)
    setCurrentTreeNode(tree)
    asyncDataToSearchCache(tree, arc, setCache);
    setLoading(false)
  }, [setCache])

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
    <PageLayout>
      <PageLayout.Header >
        <Stack direction="horizontal" align="center">
          <TreeSearch navigateTo={navigateTo} />
          {currentTreeNode && arc && arc.Title && <FileBreadcrumbs currentTreeNode={currentTreeNode} navigateTo={navigateTo} title={arc.Title} />}
        </Stack>
      </PageLayout.Header>
      <PageLayout.Content>
        {/* <Placeholder height={400}>Content</Placeholder> */}
        <Stack>
          {
            currentTreeNode && currentTreeNode.type === 'file' && arc
              ? (renderFileComponentByName(currentTreeNode, arc)) 
              : <FileTable loading={loading} currentTreeNode={currentTreeNode} navigateTo={navigateTo} />
          }
          {tree && currentTreeNode && currentTreeNode.name === "root" && currentTreeNode.type === 'folder' &&
            <FileViewer nodes={[
              { node: {id: currentTreeNode.name + "readme", name: "README.md", type: "file"}, contentType: "markdown", content: async () => findReadme(currentTreeNode) },
            ]}  />
          }
        </Stack>
      </PageLayout.Content>
      {/* <PageLayout.Pane>
        <Placeholder height={200}>Pane</Placeholder>
      </PageLayout.Pane> */}
      {/* <PageLayout.Footer>
        <Placeholder height={64}>Footer</Placeholder>
      </PageLayout.Footer> */}
    </PageLayout>
  )
}