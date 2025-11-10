
interface GifImageDetails {
    url: string;
}

interface GifImages {
    original: GifImageDetails;
    fixed_width: GifImageDetails;
}

interface User {
    display_name: string;
    username: string;
}

export interface Gif {
    id: string;
    title: string;
    slug: string;
    import_datetime: string;
    images: GifImages;
    user?: User;
}




interface Pagination {
    total_count: number;
    count: number;
    offset: number;
}


export interface GiphyApiResponse {
    data: Gif[];
    pagination: Pagination;
}


export interface GiphyCategory {
    name: string;
    name_encoded: string;
}

export interface GiphyCategoriesResponse {
    data: GiphyCategory[];
}