"use client";
import { ITunesSearchAPI, ItunesSearchAPIResponse } from "@/classes/ITunes";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { Item, ItemContent, ItemDescription, ItemGroup, ItemMedia, ItemTitle } from "@/components/ui/item";
import { SearchIcon } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { ToggleGroup, ToggleGroupItem } from "../ui/toggle-group";

export default function SearchBar() {
    const [filterBy, setFilterBy] = useState<String | null>("SongName");
    const [searchResult, setSearchResult] = useState<ItunesSearchAPIResponse | null>(null);
    const songlist = useMemo(() => {
        if (!searchResult) return [];
        if (filterBy === "SongName") {
            return searchResult.results.toSorted((a, b) => 
                (a.trackName || "").localeCompare(b.trackName || "")
            );
        } else if (filterBy === "AlbumName") {
            return searchResult.results.toSorted((a, b) => 
                (a.collectionName || "").localeCompare(b.collectionName || "")
            );
        }
        return searchResult.results;
    }, [searchResult, filterBy]);

    const onSearch = useCallback(async (query: string) => {
        ITunesSearchAPI.search(query)
            .then(response => setSearchResult(response))
            .catch(error => {
                console.error("[Error] fetching iTunes data:", error);
            })
    }, []);

    return (
        <>
            <InputGroup>
                <InputGroupInput placeholder="Search..." onChange={event => onSearch(event.target.value)} />
                <InputGroupAddon>
                    <SearchIcon />
                </InputGroupAddon>
                {searchResult?.resultCount ? <InputGroupAddon align="inline-end">{searchResult.resultCount} results</InputGroupAddon> : null}
            </InputGroup>

            <ToggleGroup type="multiple" spacing={2}>
                <ToggleGroupItem value="">Filter By: </ToggleGroupItem>
                <ToggleGroupItem variant={filterBy=== "SongName" ? "outline" : "default"} className="cursor-pointer data-[state=on]:bg-transparent data-[state=on]:*:[svg]:fill-yellow-500 data-[state=on]:*:[svg]:stroke-yellow-500" value="SongName" onClick={()=> setFilterBy("SongName")}>
                    Song
                </ToggleGroupItem>
                <ToggleGroupItem variant={filterBy=== "AlbumName" ? "outline" : "default"} className="cursor-pointer" value="AlbumName" onClick={()=> setFilterBy("AlbumName")}>
                    Album
                </ToggleGroupItem>
            </ToggleGroup>

            <ItemGroup className="w-full max-w-md h-64 overflow-y-auto gap-2">
                {songlist?.map((result) => (
                    <Item key={result.trackId} variant="outline" asChild role="listitem">
                        <a href="#">
                            <ItemMedia variant="image">
                                <img src={result.artworkUrl100 || ""} alt="" />
                            </ItemMedia>
                            <ItemContent>
                                <ItemTitle className="line-clamp-1">
                                    {result.trackName}
                                </ItemTitle>
                                <ItemDescription>{result.collectionName}</ItemDescription>
                            </ItemContent>
                        </a>
                    </Item>
                ))}
            </ItemGroup>
        </>
    );
}
