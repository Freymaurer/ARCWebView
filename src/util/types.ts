export type TreeNode = {
  name: string;
  id: string;
  type: "file" | "folder";
  children?: TreeNode[];
};