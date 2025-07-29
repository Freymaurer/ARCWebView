import { createContext, useContext } from "react";
import type { FileCacheContextType, SearchCacheContextType } from "./util/types";

export const FileCacheContext = createContext<FileCacheContextType | undefined>(undefined);
export const SearchCacheContext = createContext<SearchCacheContextType | undefined>(undefined);

export const useSearchCacheContext = () => {
    const context = useContext(SearchCacheContext);
    if (!context) {
        throw new Error("useSortCacheContext must be used within a SortCacheProvider");
    }
    return context;
}