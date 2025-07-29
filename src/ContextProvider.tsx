import { useState } from "react";
import type { FileCache, FileTypes, SearchCache } from "./util/types";
import { FileCacheContext, SearchCacheContext } from "./contexts";

export const FileCacheProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [files, setFiles] = useState<FileCache>({});

    const setFile = (key: string, file: FileTypes) => {
        setFiles(prev => ({ ...prev, [key]: file }));
    };

    return (
      <FileCacheContext.Provider value= {{ files, setFile }}>
        { children }
      </FileCacheContext.Provider>
    );
};

export const SearchCacheProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [cache, setCache] = useState<SearchCache[]>([]);

    return (
      <SearchCacheContext.Provider value= {{ cache, setCache }}>
        { children }
      </SearchCacheContext.Provider>
    );
};
