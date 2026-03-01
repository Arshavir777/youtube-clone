import {Link} from "react-router-dom"
import {useState} from "react"
import type {Video} from "../../types";
import {useViewCount} from "../../context/ViewCountContext";

interface Props {
    video: Video
}

function formatDuration(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);

    if (hours > 0) {
        return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
}

export default function VideoCard({video}: Props) {
    const [showMenu, setShowMenu] = useState(false);
    const {getViewCount} = useViewCount();

    if (!video) {
        return
    }

    const viewCount = getViewCount(video.id);

    const handleCopyLink = (e: React.MouseEvent) => {
        e.preventDefault();
        const url = `${window.location.origin}/watch/${video.id}`;
        navigator.clipboard.writeText(url);
        setShowMenu(false);
    };

    const formatViewCount = (count: number) => {
        if (count >= 1000000) {
            return `${(count / 1000000).toFixed(1)}M`;
        } else if (count >= 1000) {
            return `${(count / 1000).toFixed(1)}K`;
        }
        return count.toString();
    };

    const getTimeAgo = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

        const intervals = {
            year: 31536000,
            month: 2592000,
            week: 604800,
            day: 86400,
            hour: 3600,
            minute: 60,
        };

        for (const [unit, secondsInUnit] of Object.entries(intervals)) {
            const interval = Math.floor(seconds / secondsInUnit);
            if (interval >= 1) {
                return `${interval} ${unit}${interval === 1 ? '' : 's'} ago`;
            }
        }
        return 'just now';
    };

    return (
        <div className="relative">
            <Link to={`/watch/${video.id}`} className="cursor-pointer block">
                <div className="relative">
                    <img
                        src={video.thumbnail_url!}
                        className="rounded-xl w-full aspect-video object-cover"
                    />
                    <span className="absolute bottom-2 right-2 bg-black px-2 py-1 text-xs rounded">
                      {formatDuration(video.duration ?? 0)}
                    </span>
                </div>

                <div className="flex mt-3 gap-3">
                    <img
                        src={video.channels?.avatar_url as string}
                        className="w-10 h-10 rounded-full"
                    />

                    <div className="flex-1">
                        <h3 className="font-semibold line-clamp-1">{video.title}</h3>
                        <p className="text-sm text-green-400">
                            @{video.channels?.name}
                        </p>
                        <p className="text-sm text-zinc-400">
                            {formatViewCount(viewCount)} views • {getTimeAgo(video.created_at!)}
                        </p>
                    </div>
                </div>
            </Link>

            <button
                onClick={(e) => {
                    e.preventDefault();
                    setShowMenu(!showMenu);
                }}
                className="absolute top-2 right-2 text-white bg-black/70 hover:bg-black rounded-full w-8 h-8 flex items-center justify-center"
            >
                ⋮
            </button>

            {showMenu && (
                <>
                    <div
                        className="fixed inset-0 z-10"
                        onClick={() => setShowMenu(false)}
                    />
                    <div className="absolute top-12 right-2 bg-zinc-800 rounded-lg shadow-lg py-2 w-48 z-20">
                        <button
                            onClick={handleCopyLink}
                            className="w-full px-4 py-2 text-left hover:bg-zinc-700 flex items-center gap-2"
                        >
                            <span>🔗</span>
                            <span>Copy link</span>
                        </button>
                    </div>
                </>
            )}
        </div>
    )
}