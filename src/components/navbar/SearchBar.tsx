import {useState, useEffect, useRef} from "react";
import {useNavigate} from "react-router-dom";
import {Search} from "lucide-react";
import {searchVideos} from "../../api/video";
import type {Video} from "../../types";
import {formatDuration} from "../../utils";

export default function SearchBar() {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<Video[]>([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const [loading, setLoading] = useState(false);
    const searchRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setShowDropdown(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        const delayDebounceFn = setTimeout(async () => {
            if (query.trim()) {
                setLoading(true);
                try {
                    const searchResults = await searchVideos(query);
                    setResults(searchResults);
                    setShowDropdown(true);
                } catch (error) {
                    console.error("Search error:", error);
                } finally {
                    setLoading(false);
                }
            } else {
                setResults([]);
                setShowDropdown(false);
            }
        }, 300);

        return () => clearTimeout(delayDebounceFn);
    }, [query]);

    const handleVideoClick = (videoId: string) => {
        navigate(`/watch/${videoId}`);
        setQuery("");
        setShowDropdown(false);
        setResults([]);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (results.length > 0) {
            handleVideoClick(results[0].id);
        }
    };


    return (
        <div ref={searchRef} className="relative w-full">
            <form onSubmit={handleSubmit} className="relative">
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => {
                        if (results.length > 0) setShowDropdown(true);
                    }}
                    placeholder="Search"
                    className="w-full px-3 md:px-4 py-2 pr-10 rounded-full bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-zinc-600 text-sm md:text-base"
                />
                <button
                    type="submit"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white"
                >
                    <Search size={18} className="md:w-5 md:h-5" />
                </button>
            </form>

            {/* Dropdown */}
            {showDropdown && (
                <div className="absolute top-full mt-2 w-full bg-zinc-800 rounded-lg shadow-lg max-h-96 overflow-y-auto z-50">
                    {loading ? (
                        <div className="p-4 text-center text-zinc-400">
                            Searching...
                        </div>
                    ) : results.length > 0 ? (
                        results.map((video) => (
                            <div
                                key={video.id}
                                onClick={() => handleVideoClick(video.id)}
                                className="flex gap-2 md:gap-3 p-2 md:p-3 hover:bg-zinc-700 cursor-pointer transition"
                            >
                                <div className="relative flex-shrink-0">
                                    <img
                                        src={video.thumbnail_url!}
                                        alt={video.title}
                                        className="w-24 md:w-40 aspect-video object-cover rounded"
                                    />
                                    <span className="absolute bottom-1 right-1 bg-black px-1 py-0.5 text-xs rounded">
                                        {formatDuration(video.duration ?? 0)}
                                    </span>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-semibold line-clamp-2 text-xs md:text-sm">
                                        {video.title}
                                    </h3>
                                    <p className="text-xs text-zinc-400 mt-1">
                                        @{video.channels?.name}
                                    </p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="p-4 text-center text-zinc-400">
                            No results found
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
