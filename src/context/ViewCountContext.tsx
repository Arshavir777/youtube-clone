import {createContext, type ReactNode, useContext, useState} from 'react';
import {getBatchVideoViewCounts} from '../api/views';

interface ViewCountContextType {
    viewCounts: Record<string, number>;
    fetchViewCounts: (videoIds: string[]) => Promise<void>;
    getViewCount: (videoId: string) => number;
}

const ViewCountContext = createContext<ViewCountContextType | undefined>(undefined);

export function ViewCountProvider({children}: {children: ReactNode}) {
    const [viewCounts, setViewCounts] = useState<Record<string, number>>({});
    const [fetchedIds, setFetchedIds] = useState<Set<string>>(new Set());

    const fetchViewCounts = async (videoIds: string[]) => {
        // Filter out already fetched IDs
        const idsToFetch = videoIds.filter(id => !fetchedIds.has(id));

        if (idsToFetch.length === 0) return;

        try {
            const counts = await getBatchVideoViewCounts(idsToFetch);
            setViewCounts(prev => ({...prev, ...counts}));
            setFetchedIds(prev => new Set([...prev, ...idsToFetch]));
        } catch (error) {
            console.error('Error fetching view counts:', error);
        }
    };

    const getViewCount = (videoId: string): number => {
        return viewCounts[videoId] || 0;
    };

    return (
        <ViewCountContext.Provider value={{viewCounts, fetchViewCounts, getViewCount}}>
            {children}
        </ViewCountContext.Provider>
    );
}

export function useViewCount() {
    const context = useContext(ViewCountContext);
    if (!context) {
        throw new Error('useViewCount must be used within ViewCountProvider');
    }
    return context;
}
