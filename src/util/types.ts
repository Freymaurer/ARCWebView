
export type TreeNode = {
  name: string;
  id: string;
  type: "file" | "folder";
  children?: TreeNode[];
  sha256?: string; // Optional, used for file download
};

export type FileTypes = File | Blob | string;

export type ContentType = "text" | "markdown" | "binary" | "jsx";

export type FileViewerContent = {
  node: TreeNode;
  name?: string;
  content?: () => Promise<FileTypes>;
  component?: React.JSX.Element;
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
  type: "file" | "header" | "isa-title" | "isa-table" | "person"
}; // adjust based on your file types

export type SearchCacheContextType = {
    cache: SearchCache[];
    setCache: React.Dispatch<React.SetStateAction<SearchCache[]>>;
};