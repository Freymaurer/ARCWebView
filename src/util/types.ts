export type TreeNode = {
  name: string;
  id: string;
  type: "file" | "folder";
  children?: TreeNode[];
};

export type FileTypes = File | Blob | string;

export type ContentType = "text" | "markdown" | "assay" | "study" | "investigation" | "binary";

export type FileViewerContent = {
  node: TreeNode;
  content: () => Promise<FileTypes>;
  contentType?: ContentType; // Default content type if not specified
}

export type FileCache = Record<string, FileTypes>; // adjust based on your file types

export type FileCacheContextType = {
    files: FileCache;
    setFile: (key: string, file: FileTypes) => void;
};

export interface SearchCache {
  name: string
  path: string
}; // adjust based on your file types

export type SearchCacheContextType = {
    cache: SearchCache[];
    setCache: (sortCache: SearchCache[]) => void;
};