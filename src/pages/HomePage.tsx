import React, { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';
import type {
    Gif,
    GiphyApiResponse,
    GiphyCategoriesResponse,
} from '../types';
import { useStore } from '../store';
import { useDebounce } from '../hooks/useDebounce';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { AnimatePresence } from 'framer-motion';


import Header from '../components/Header';
import Footer from '../components/Footer';
import SearchBar from '../components/SearchBar';
import GifList from '../components/GifList';
import GifModal from '../components/GifModal';
import GifListSkeleton from '../components/GifListSkeleton';
import NothingFound from '../components/NothingFound';
import CategoryList from '../components/CategoryList';

export type SearchType = 'gifs' | 'stickers';
type ViewMode = 'trending' | 'search' | 'favorites';

const API_KEY = import.meta.env.VITE_GIPHY_API_KEY;
const BASE_URL = import.meta.env.VITE_GIPHY_API_BASE_URL;
const PAGE_SIZE = 24;


const fetchGifsFromApi = async ({ pageParam = 0, queryKey }: { pageParam?: number; queryKey: (string | object)[]; }) => {
    const [_, searchType, mode, params] = queryKey;
    const endpoint = `${searchType}/${mode}`;
    const response = await axios.get<GiphyApiResponse>(`${BASE_URL}/${endpoint}`, { params: { api_key: API_KEY, limit: PAGE_SIZE, rating: 'g', lang: 'uk', offset: pageParam, ...(params as object) } });
    return response.data;
};
const fetchCategories = async () => {
    const response = await axios.get<GiphyCategoriesResponse>(`${BASE_URL}/gifs/categories`, { params: { api_key: API_KEY } });
    return response.data.data.slice(0, 10).map((cat) => cat.name);
};
const fetchRandomGif = async (searchType: SearchType) => {
    const endpoint = `${searchType}/random`;
    const response = await axios.get<GiphyApiResponse>(`${BASE_URL}/${endpoint}`, {
        params: { api_key: API_KEY, rating: 'g' },
    });
    return response.data.data as unknown as Gif;
};


function HomePage() {

    const favoriteGifs = useStore((state) => state.favorites);
    const [selectedGif, setSelectedGif] = useState<Gif | null>(null);
    const [pageTitle, setPageTitle] = useState('Популярні GIF');
    const [searchType, setSearchType] = useState<SearchType>('gifs');
    const [viewMode, setViewMode] = useState<ViewMode>('trending');
    const [liveSearchTerm, setLiveSearchTerm] = useState('');
    const debouncedSearchTerm = useDebounce(liveSearchTerm, 500);
    const loadMoreTriggerRef = useRef<HTMLDivElement>(null);


    useEffect(() => {

        if (viewMode !== 'favorites') {
            if (debouncedSearchTerm) {
                setViewMode('search');
                setPageTitle(`Результати для: "${debouncedSearchTerm}"`);
            } else {
                setViewMode('trending');
                setPageTitle(`Популярні ${searchType === 'gifs' ? 'GIF' : 'Стікери'}`);
            }
        }
    }, [debouncedSearchTerm, viewMode, searchType]);


    const { mode, params } = React.useMemo(() => {

        if (viewMode === 'search' && debouncedSearchTerm) {
            return { mode: 'search', params: { q: debouncedSearchTerm } };
        }


        return { mode: 'trending', params: {} };
    }, [viewMode, debouncedSearchTerm]);


    const {
        data, error, isLoading, isError, fetchNextPage, hasNextPage, isFetchingNextPage,
    } = useInfiniteQuery({
        queryKey: ['gifs', searchType, mode, params],
        queryFn: fetchGifsFromApi,
        initialPageParam: 0,
        enabled: viewMode !== 'favorites',
        getNextPageParam: (lastPage) => {
            const { pagination } = lastPage;
            if (!pagination) return undefined;
            const nextOffset = pagination.offset + pagination.count;
            return nextOffset < pagination.total_count ? nextOffset : undefined;
        },
    });


    const { data: categories = [] } = useQuery({
        queryKey: ['categories'],
        queryFn: fetchCategories,
        staleTime: 1000 * 60 * 60,
    });


    const { refetch: fetchRandom, isFetching: isFetchingRandom } = useQuery({
        queryKey: ['randomGif', searchType],
        queryFn: () => fetchRandomGif(searchType),
        enabled: false,
    });

    const handleRandomClick = async () => {
        const { data: randomGif } = await fetchRandom();
        if (randomGif) {
            setSelectedGif(randomGif);
        }
    };


    useEffect(() => {
    
    if (viewMode !== 'favorites') {
      const observer = new IntersectionObserver(
        (entries) => {
          
          if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
          }
        },
        { threshold: 1.0 }
      );

      const trigger = loadMoreTriggerRef.current;
      if (trigger) {
        observer.observe(trigger);
      }

      
      return () => {
        if (trigger) {
          observer.unobserve(trigger);
        }
      };
    }
    
    
  }, [viewMode, hasNextPage, isFetchingNextPage, fetchNextPage]);


    const handleCategoryClick = (category: string) => {

        setLiveSearchTerm(category);
        setViewMode('search');
        setPageTitle(`Результати для: "${category}"`);
    };

    const handleShowFavorites = () => {

        setViewMode('favorites');
        setPageTitle('Мої Обрані');

    };

    const handleShowTrending = () => {

        setLiveSearchTerm('');
        setViewMode('trending');
        setPageTitle(`Популярні ${searchType === 'gifs' ? 'GIF' : 'Стікери'}`);
    };

    const handleClearSearch = () => {

        handleShowTrending();
    };


    const gifsFromQuery = data?.pages.flatMap((page) => page.data) ?? [];
    const gifsToShow = viewMode === 'favorites' ? favoriteGifs : gifsFromQuery;
    const showNothingFound = !isLoading && gifsToShow.length === 0;


    return (
        <div className="flex flex-col min-h-screen px-4 text-gray-800 bg-gray-50 dark:bg-gray-900 dark:text-gray-200">

            <div className="py-8">
                <Header
                    onShowFavorites={handleShowFavorites}
                    onShowTrending={handleShowTrending}
                />
            </div>

            <main className="flex-grow w-full max-w-6xl mx-auto">

                <div className="flex justify-center mb-4 space-x-2">
                    <button
                        onClick={() => setSearchType('gifs')}
                        className={`px-5 py-2 font-semibold rounded-full ${searchType === 'gifs'
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-200'
                            }`}
                    >
                        GIFs
                    </button>
                    <button
                        onClick={() => setSearchType('stickers')}
                        className={`px-5 py-2 font-semibold rounded-full ${searchType === 'stickers'
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-200'
                            }`}
                    >
                        Стікери
                    </button>
                </div>

                <div className="sticky top-0 z-10 py-4 backdrop-blur-sm">
                    <SearchBar
                        onSearchSubmit={(term) => {
                            setLiveSearchTerm(term);
                            setViewMode('search');
                            setPageTitle(`Результати для: "${term}"`);
                        }}
                        onSearchChange={setLiveSearchTerm}
                        onRandom={handleRandomClick}
                        onClear={handleClearSearch}
                        isSearchLoading={isLoading}
                        isRandomLoading={isFetchingRandom}
                        placeholder={`Пошук ${searchType}...`}
                    />
                </div>

                <h3 className="mb-4 mt-8 text-xl font-semibold text-center text-gray-700 dark:text-gray-300">
                    Популярні категорії
                </h3>
                <CategoryList categories={categories} onCategoryClick={handleCategoryClick} />

                <h2 className="mt-8 mb-6 text-2xl font-semibold text-center capitalize md:text-3xl">
                    {pageTitle}
                </h2>

                {isLoading && <GifListSkeleton />}

                {isError && (
                    <NothingFound message={error?.message || 'Не вдалося завантажити дані.'} />
                )}

                {!isLoading && !isError && showNothingFound && (
                    <NothingFound
                        message={
                            viewMode === 'favorites'
                                ? "Ви ще нічого не додали в Обране."
                                : `Нічого не знайдено. Спробуйте інший запит.`
                        }
                    />
                )}

                {!isLoading && !isError && gifsToShow.length > 0 && (
                    <GifList gifs={gifsToShow} onGifClick={setSelectedGif} />
                )}

                {/* Тригер для скролу (Показуємо ТІЛЬКИ не в "Обраному") */}
                {viewMode !== 'favorites' && (
                    <div ref={loadMoreTriggerRef} className="h-10 text-center mt-10">
                        {hasNextPage && isFetchingNextPage && (
                            <div className="inline-block w-8 h-8 border-4 border-blue-200 rounded-full border-t-blue-600 animate-spin" />
                        )}
                    </div>
                )}

            </main>

            <div className="py-8">
                <Footer />
            </div>

            <AnimatePresence>
                {selectedGif && (
                    <GifModal gif={selectedGif} onClose={() => setSelectedGif(null)} />
                )}
            </AnimatePresence>
        </div>
    );
}

export default HomePage;