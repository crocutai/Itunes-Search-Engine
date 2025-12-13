import axios from "axios";

export type ItunesSearchAPIResult = {
    artistId?: number;
    artistName?: string;
    artistViewUrl?: string;
    artworkUrl30?: string;
    artworkUrl60?: string;
    artworkUrl100?: string;
    collectionCensoredName?: string;
    collectionExplicitness?: string;
    collectionId?: number;
    collectionName?: string;
    collectionPrice?: number;
    collectionViewUrl?: string;
    country?: string;
    currency?: string;
    discCount?: number;
    discNumber?: number;
    isStreamable?: boolean;
    kind?: string;
    previewUrl?: string;
    primaryGenreName?: string;
    releaseDate?: string;
    trackCensoredName?: string;
    trackCount?: number;
    trackExplicitness?: string;
    trackId?: number;
    trackName?: string;
    trackNumber?: number;
    trackPrice?: number;
    trackTimeMillis?: number;
    trackViewUrl?: string;
    wrapperType?: string;
}

export type ItunesSearchAPIResponse = {
    resultCount: number;
    results: Array<ItunesSearchAPIResult>;
}

export class ITunesSearchAPI {
    /**
     * Itunes Search API
     * https://performance-partners.apple.com/search-api
     */
    static async search(query: string): Promise<ItunesSearchAPIResponse> {
        const url = process.env.NEXT_PUBLIC_ITUNE_HOST + `?term=${encodeURIComponent(query)}&limit=50&media=music`;

        return axios.get<ItunesSearchAPIResponse>(url)
            .then(response => response.data)
    }
}