import { Autocomplete, FormControl, ActionList } from '@primer/react'
import { Dialog } from '@primer/react/experimental'
import { useSearchCacheContext } from '../../contexts'
import type { SearchCache } from '../../util/types'
import { useCallback, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

interface TreeSearchProps {
    navigateTo: (path: string) => void;
}

const FileIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
    <rect width="24" height="24" fill="none" />
    <path fill="currentColor" d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zm4 18H6V4h7v5h5z" />
</svg>

interface MyMenuItem {
    text: string;
    id: string;
    leadingVisual: () => JSX.Element;
}

function cacheToMenuItem(cache: SearchCache): MyMenuItem {
    return {
        text: cache.name,
        id: cache.path,
        leadingVisual: () => <FileIcon />
    };
}

function distinctByTextMenuItems(items: MyMenuItem[]): MyMenuItem[] {
    const seen = new Set<string>();
    return items.filter(item => {
        if (seen.has(item.text)) return false;
        seen.add(item.text);
        return true;
    });
}

function SearchResultsDialog({ searchResults, onDialogClose, returnFocus, onSelect }: {
    searchResults: SearchCache[],
    onDialogClose: () => void,
    returnFocus: React.RefObject<HTMLDivElement>,
    onSelect: (item: SearchCache) => void
}) {
    const index0SearchResult = useRef<any>(null)

    const isOpen = searchResults.length > 0;

    return createPortal(
        <div>
            {isOpen && (
                <Dialog
                    title="Search Results"
                    onClose={onDialogClose}
                    returnFocusRef={returnFocus}
                    initialFocusRef={index0SearchResult}>
                    <ActionList aria-label="Search Results" id="search-results-list">
                        {searchResults.map((item, index) => (
                            <ActionList.Item
                                key={index}
                                ref={index === 0 ? index0SearchResult : null}
                                onSelect={() => onSelect(item)}
                            >
                                {item.name}
                                <ActionList.Description variant="block">{item.path}</ActionList.Description>
                            </ActionList.Item>
                        ))}
                    </ActionList>
                </Dialog>
            )}
        </div>,
        document.body
    )
}

export default function TreeSearch({ navigateTo }: TreeSearchProps) {
    const { cache } = useSearchCacheContext()
    const [searchResults, setSearchResults] = useState<SearchCache[]>([]);

    const items = distinctByTextMenuItems(cache.map(cacheToMenuItem));
    const inputRef = useRef<any>(null);
    const onDialogClose = useCallback(() => setSearchResults([]), [])


    const onSelect = (items: any) => {
        // ensure items is MyMenuItem[]
        setSearchResults([]);
        if (!Array.isArray(items)) {
            console.error("Expected items to be an array");
            return;
        }
        if (items.length === 0) {
            return;
        } else {
            const item = items[0] as MyMenuItem;
            const relatedCacheItems = cache.filter(c => c.name === item.text);
            if (relatedCacheItems.length > 1) {
                setSearchResults(relatedCacheItems);
                return;
            }
            navigateTo(item.id);
        }
    }
    return (
        <div>
            <SearchResultsDialog
                searchResults={searchResults}
                onDialogClose={onDialogClose}
                returnFocus={inputRef}
                onSelect={(item) => {
                    navigateTo(item.path);
                    setSearchResults([]);
                }}
            />
            <FormControl>
                <FormControl.Label id="autocompleteLabel-default">Label</FormControl.Label>
                <Autocomplete>
                    <Autocomplete.Input ref={inputRef} />
                    <Autocomplete.Overlay>
                        <Autocomplete.Menu
                            onSelectedChange={onSelect}
                            selectedItemIds={[]}
                            aria-labelledby="autocompleteLabel-default"
                            items={items}
                        />
                    </Autocomplete.Overlay>
                </Autocomplete>
            </FormControl>
        </div>
    )
}
