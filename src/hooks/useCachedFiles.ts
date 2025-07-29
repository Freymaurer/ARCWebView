import { useContext, useEffect, useState } from 'react';
import { FileCacheContext } from '../contexts';
import type { FileTypes } from '../util/types';

export const useFileCacheContext = () => {
    const ctx = useContext(FileCacheContext);
    if (!ctx) throw new Error("useFileCacheContext must be used within FileCacheProvider");
    return ctx;
};

type FetchFunction = (key: string) => Promise<FileTypes>;

export const useCachedFiles = (
    keys: string[],
    fetchFile: FetchFunction
) => {
    const { files, setFile } = useFileCacheContext();

    const [loading, setLoading] = useState(true);
    const [errors, setErrors] = useState<Record<string, Error>>({});
    const [results, setResults] = useState<Record<string, FileTypes>>({});

    const keyString = keys.join(',');

    useEffect(() => {
        let isMounted = true;

        const fetchMissingFiles = async () => {
            setLoading(true);
            const newErrors: Record<string, Error> = {};
            const newResults: Record<string, FileTypes> = {};

            const missingKeys = keys.filter(key => !(key in files));

            await Promise.all(
                missingKeys.map(async (key) => {
                    try {
                        const result = await fetchFile(key);
                        if (isMounted) {
                            setFile(key, result);
                            newResults[key] = result;
                        }
                    } catch (err) {
                        if (isMounted) {
                            newErrors[key] = err as Error;
                        }
                    }
                })
            );

            if (isMounted) {
                // Add already cached files
                const cachedResults = keys
                    .filter(key => key in files)
                    .reduce((acc, key) => {
                        acc[key] = files[key];
                        return acc;
                    }, {} as Record<string, FileTypes>);

                setResults({ ...cachedResults, ...newResults });
                setErrors(newErrors);
                setLoading(false);
            }
        };

        fetchMissingFiles();

        return () => {
            isMounted = false;
        };
    }, [keyString]);

    return { files: results, loading, errors };
};