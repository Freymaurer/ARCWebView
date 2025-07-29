import { Autocomplete, FormControl, ActionList, useFocusZone } from '@primer/react'
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

const TermIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
	<rect width="24" height="24" fill="none" />
	<path fill="currentColor" d="M7 22q-1.25 0-2.125-.875T4 19q0-.975.563-1.75T6 16.175v-8.35q-.875-.3-1.437-1.075T4 5q0-1.25.875-2.125T7 2t2.125.875T10 5q0 .975-.562 1.75T8 7.825V8q0 1.25.875 2.125T11 11h2q2.075 0 3.538 1.463T18 16v.175q.875.3 1.438 1.075T20 19q0 1.25-.875 2.125T17 22t-2.125-.875T14 19q0-.975.563-1.75T16 16.175V16q0-1.25-.875-2.125T13 13h-2q-.85 0-1.612-.262T8 12v4.175q.875.3 1.438 1.075T10 19q0 1.25-.875 2.125T7 22m0-2q.425 0 .713-.288T8 19t-.288-.712T7 18t-.712.288T6 19t.288.713T7 20m10 0q.425 0 .713-.288T18 19t-.288-.712T17 18t-.712.288T16 19t.288.713T17 20M7 6q.425 0 .713-.288T8 5t-.288-.712T7 4t-.712.288T6 5t.288.713T7 6" />
</svg>

const TableIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
	<rect width="24" height="24" fill="none" />
	<path fill="currentColor" d="M11 16H3v3q0 .825.588 1.413T5 21h6zm2 0v5h6q.825 0 1.413-.587T21 19v-3zm-2-2V9H3v5zm2 0h8V9h-8zM3 7h18V5q0-.825-.587-1.412T19 3H5q-.825 0-1.412.588T3 5z" />
</svg>

const IsaFileIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
	<rect width="24" height="24" fill="none" />
	<path fill="currentColor" d="M8 18h8v-2H8zm0-4h8v-2H8zm-2 8q-.825 0-1.412-.587T4 20V4q0-.825.588-1.412T6 2h8l6 6v12q0 .825-.587 1.413T18 22zm7-13h5l-5-5z" />
</svg>

const PersonIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
	<rect width="24" height="24" fill="none" />
	<path fill="currentColor" d="M12 12q-1.65 0-2.825-1.175T8 8t1.175-2.825T12 4t2.825 1.175T16 8t-1.175 2.825T12 12m-8 8v-2.8q0-.85.438-1.562T5.6 14.55q1.55-.775 3.15-1.162T12 13t3.25.388t3.15 1.162q.725.375 1.163 1.088T20 17.2V20z" />
</svg>

const SearchIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24">
	<rect width="24" height="24" fill="none" />
	<path fill="currentColor" d="m19.6 21l-6.3-6.3q-.75.6-1.725.95T9.5 16q-2.725 0-4.612-1.888T3 9.5t1.888-4.612T9.5 3t4.613 1.888T16 9.5q0 1.1-.35 2.075T14.7 13.3l6.3 6.3zM9.5 14q1.875 0 3.188-1.312T14 9.5t-1.312-3.187T9.5 5T6.313 6.313T5 9.5t1.313 3.188T9.5 14" />
</svg>

interface MyMenuItem {
    text: string;
    id: string;
    path: string;
    leadingVisual: () => JSX.Element;
}

function cacheTypeToIcon(type: "file" | "header" | "isa-title" | "isa-table" | "person"): () => JSX.Element {
    switch (type) {
        case "file":
            return () => <FileIcon />;
        case "header":
            return () => <TermIcon />;
        case "isa-table":
            return () => <TableIcon />;
        case "isa-title":
            return () => <IsaFileIcon />;
        case "person":
            return () => <PersonIcon />;
        default:
            return () => <FileIcon />;
    }
}

function cacheToMenuItem(cache: SearchCache, index: number): MyMenuItem {
    return {
        text: cache.name,
        id: `${cache.path}{${index}}`,
        path: cache.path,
        leadingVisual: cacheTypeToIcon(cache.type),
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

function cacheArrayToDistinctMenuItems(cache: SearchCache[]): MyMenuItem[] {
    const menuItems = cache.map((item, index) => cacheToMenuItem(item, index));
    return distinctByTextMenuItems(menuItems);
}

function SearchResultsDialog({ searchResults, onDialogClose, returnFocus, onSelect }: {
    searchResults: SearchCache[],
    onDialogClose: () => void,
    returnFocus: React.RefObject<HTMLElement>,
    onSelect: (item: SearchCache) => void
}) {
    const index0SearchResult = useRef<any>(null)

    const { containerRef } = useFocusZone();

    return (
      <Dialog
          title="Search Results"
          onClose={onDialogClose}
          returnFocusRef={returnFocus}
          initialFocusRef={index0SearchResult}>
            <div ref={containerRef as any}>
              <ActionList aria-label="Search Results" id="search-results-list" >
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
            </div>
      </Dialog>

    )
}

function findItemsFromCache(cache: SearchCache[], text: string): MyMenuItem[] {
    if (text.length < 3) {
      const filteredItems = cacheArrayToDistinctMenuItems(cache.filter(item => item.type === "file"));
      return filteredItems;
    } else {
      const filteredCache = cache.filter(item => item.name.toLowerCase().includes(text.toLowerCase()));
      const filteredItems = cacheArrayToDistinctMenuItems(filteredCache);
      if (filteredItems.length > 10) {
        return filteredItems.sort((a, b) => a.text.localeCompare(b.text)).slice(0, 10);
      }
      return filteredItems;
    }
}

export default function TreeSearch({ navigateTo }: TreeSearchProps) {
    const { cache } = useSearchCacheContext()
    
    const [loading, setLoading] = useState(false);
    const fileItems = cacheArrayToDistinctMenuItems(cache.filter(item => item.type === "file"));
    const [items, setItems] = useState<MyMenuItem[]>(fileItems);
    const [multiSelectOptions, setMultiSelectOptions] = useState<SearchCache[]>([]);
    const inputRef = useRef<any>(null);
    const onDialogClose = useCallback(() => setMultiSelectOptions([]), [])
    const wasClosed = useRef(false);

    const onOpenChange = (open: boolean) => {

      if (!open && !wasClosed.current) {
        wasClosed.current = true;
        setItems(fileItems);
        return;
      }
      if (open && wasClosed.current) {
        const nextItems = findItemsFromCache(cache, inputRef.current.value);
        wasClosed.current = false;
        setItems(nextItems);
      }
    }

    const onChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
      const v = e.target.value;
      setLoading(true);
      const nextItems = findItemsFromCache(cache, v);
      setItems(nextItems);
      setLoading(false);
      return;
    }

    const onSelect = (items: unknown) => {
        // ensure items is MyMenuItem[]
        setMultiSelectOptions([]);
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
                setMultiSelectOptions(relatedCacheItems);
                return;
            }
            navigateTo(item.path);
        }
    }
    return (
        <div>
          {
            createPortal(
              <div>
                {multiSelectOptions.length > 0 && (
                  <SearchResultsDialog
                      searchResults={multiSelectOptions}
                      onDialogClose={onDialogClose}
                      returnFocus={inputRef}
                      onSelect={(item) => {
                          navigateTo(item.path);
                          setMultiSelectOptions([]);
                      }}/>
                    )}
                </div>,
              document.body
            )}
            <FormControl>
                <FormControl.Label visuallyHidden id="autocompleteLabel-arc-search">Autocomplete search for ARC</FormControl.Label>
                <Autocomplete>
                    <Autocomplete.Input ref={inputRef} onChange={onChange} trailingVisual={<SearchIcon />} />
                    <Autocomplete.Overlay style={{width: "max-content"}}>
                        <Autocomplete.Menu
                            onOpenChange={onOpenChange}
                            loading={loading}
                            onSelectedChange={onSelect}
                            selectedItemIds={[]}
                            aria-labelledby="autocomplete-arc-search"
                            items={items}
                        />
                    </Autocomplete.Overlay>
                </Autocomplete>
            </FormControl>
        </div>
    )
}
