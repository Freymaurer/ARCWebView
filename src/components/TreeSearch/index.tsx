import { Autocomplete, FormControl, ActionList, useFocusZone } from '@primer/react'
import { Dialog } from '@primer/react/experimental'
import { useSearchCacheContext } from '../../contexts'
import type { SearchCache } from '../../util/types'
import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import Icons from '../Icons';

interface TreeSearchProps {
    navigateTo: (path: string) => void;
}
interface MyMenuItem {
    text: string;
    id: string;
    path: string;
    leadingVisual: () => JSX.Element;
}

function cacheTypeToIcon(type: "file" | "header" | "isa-title" | "isa-table" | "person"): () => JSX.Element {
    switch (type) {
        case "file":
            return () => <Icons.FileIcon />;
        case "header":
            return () => <Icons.TermIcon />;
        case "isa-table":
            return () => <Icons.TableIcon />;
        case "isa-title":
            return () => <Icons.IsaFileIcon />;
        case "person":
            return () => <Icons.PersonIcon />;
        default:
            return () => <Icons.FileIcon />;
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
      if (filteredItems.length > 10) {
        return filteredItems.sort((a, b) => a.text.localeCompare(b.text)).slice(0, 10);
      }
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
    const fileItems = cacheArrayToDistinctMenuItems(cache.filter(item => item.type === "file").slice(0, 10));
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

    useEffect(() => {
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 't' && document.activeElement !== inputRef.current) {
          e.preventDefault(); // optional
          inputRef.current?.focus();
        }
      };

      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

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
                    <Autocomplete.Input ref={inputRef} onChange={onChange} leadingVisual={<Icons.SearchIcon />} trailingVisual={() => <kbd>t</kbd>} />
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
