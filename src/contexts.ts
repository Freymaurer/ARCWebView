import { createContext } from "react";
import type { FileCacheContextType } from "./util/types";

export const FileCacheContext = createContext<FileCacheContextType | undefined>(undefined);