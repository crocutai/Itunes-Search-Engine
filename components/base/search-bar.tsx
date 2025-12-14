"use client";
import { ITunesSearchAPI, ItunesSearchAPIResponse, ItunesSearchAPIResult } from "@/classes/ITunes";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { Item, ItemContent, ItemDescription, ItemGroup, ItemMedia, ItemTitle } from "@/components/ui/item";
import { SearchIcon } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { ToggleGroup, ToggleGroupItem } from "../ui/toggle-group";
import { cn } from "@/lib/utils";

export default function SearchBar() {
    const [filterBy, setFilterBy] = useState<string>("SongName");
    const [searchResult, setSearchResult] = useState<ItunesSearchAPIResponse | null>(null);

    /**
     * Song List Memoized
     * @return Sorted Song List based on Song Name or Album Name
     */
    const songlist: ItunesSearchAPIResult[] = useMemo(() => {
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

    /**
     * Handle Search on Input Change
     * searching should be performed after user adding/removing a letter in the input field
     * @param query Search Query
     * @return void
     */
    const onSearch = useCallback(async (query: string) => {
        ITunesSearchAPI.search(query)
            .then(response => setSearchResult(response))
            .catch(error => {
                console.error("[Error] fetching iTunes data:", error);
            })
    }, []);

    return (
        <form className="flex w-full h-full flex-col items-center gap-2">
            <InputGroup>
                <InputGroupInput placeholder="Search..." onChange={event => onSearch(event.target.value)} />
                <InputGroupAddon>
                    <SearchIcon />
                </InputGroupAddon>
                {searchResult?.resultCount ? <InputGroupAddon align="inline-end">{searchResult.resultCount} results</InputGroupAddon> : null}
            </InputGroup>

            <ToggleGroup type="single" spacing={2} value={filterBy} onValueChange={value => setFilterBy(value || filterBy)}>
                <ToggleGroupItem value="">Filter By: </ToggleGroupItem>
                <ToggleGroupItem variant="default" className={`cursor-pointer ${cn("data-[state=on]:bg-black data-[state=on]:text-white")}`} value="SongName" onClick={()=> setFilterBy("SongName")}>
                    Song
                </ToggleGroupItem>
                <ToggleGroupItem variant="default" className={`cursor-pointer ${cn("data-[state=on]:bg-black data-[state=on]:text-white")}`} value="AlbumName" onClick={()=> setFilterBy("AlbumName")}>
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
                                <ItemDescription><b>Album: </b>{result.collectionName}</ItemDescription>
                            </ItemContent>
                        </a>
                    </Item>
                ))}
            </ItemGroup>
        </form>
    );
}
