import { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';
import type { Gif, GiphyApiResponse } from '../types';

const API_KEY = import.meta.env.VITE_GIPHY_API_KEY;
const BASE_URL = import.meta.env.VITE_GIPHY_API_BASE_URL;
const PAGE_SIZE = 24;

interface UseGifSearchProps {
    apiEndpoint: string;
    apiParams?: Record<string, any>;
    isEnabled?: boolean;
}

export function useGifSearch({ apiEndpoint, apiParams, isEnabled = true }: UseGifSearchProps) {
    const [gifs, setGifs] = useState<Gif[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [offset, setOffset] = useState(0);


    const paramsRef = useRef(JSON.stringify(apiParams));


    const fetchGifs = useCallback(async (isNewSearch: boolean) => {
        if (!isEnabled) {
            setIsLoading(false);
            setGifs([]);
            return;
        }

        if (isNewSearch) {
            setIsLoading(true);
            setGifs([]);
        } else {
            setIsLoadingMore(true);
        }
        setError(null);

        const currentOffset = isNewSearch ? 0 : offset;

        try {
            const response = await axios.get<GiphyApiResponse>(`${BASE_URL}/${apiEndpoint}`, {
                params: {
                    api_key: API_KEY,
                    limit: PAGE_SIZE,
                    rating: 'g',
                    lang: 'uk',
                    offset: currentOffset,
                    ...apiParams,
                },
            });

            const newGifs = response.data.data;
            setGifs((prevGifs) =>
                isNewSearch ? newGifs : [...prevGifs, ...newGifs]
            );
            setOffset(currentOffset + newGifs.length);

        } catch (err) {
            setError('Не вдалося завантажити дані.');
            console.error(err);
        } finally {
            setIsLoading(false);
            setIsLoadingMore(false);
        }
    }, [apiEndpoint, apiParams, offset, isEnabled]);




    useEffect(() => {

        const newParamsString = JSON.stringify(apiParams);
        if (paramsRef.current !== newParamsString || isEnabled) {
            fetchGifs(true);
            paramsRef.current = newParamsString;
        }
    }, [apiEndpoint, apiParams, isEnabled, fetchGifs]);


    const loadMore = useCallback(() => {
        if (isLoading || isLoadingMore || !isEnabled) return;
        fetchGifs(false);
    }, [isLoading, isLoadingMore, isEnabled, fetchGifs]);

    return { gifs, isLoading, isLoadingMore, error, loadMore };
}