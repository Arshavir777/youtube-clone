import {Link} from "react-router-dom";
import type {Video} from "../../types";
import {useViewCount} from "../../context/ViewCountContext";
import {formatViewCount} from "../../utils";

interface Props {
    videos: Video[];
    currentVideoId: string;
}

export default function SuggestedVideosSidebar({videos, currentVideoId}: Props) {
    const {getViewCount} = useViewCount();

    return (
        <div className="w-full lg:w-100 lg:shrink-0">
            <h2 className="text-lg font-semibold mb-4">Suggested Videos</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3">
                {videos
                    .filter(v => v.id !== currentVideoId)
                    .slice(0, 10)
                    .map(video => (
                        <div key={video.id} className="flex gap-2">
                            <Link to={`/watch/${video.id}`} className="flex-shrink-0">
                                <img
                                    src={video.thumbnail_url!}
                                    className="w-32 sm:w-40 aspect-video object-cover rounded-lg"
                                />
                            </Link>
                            <div className="flex-1 min-w-0">
                                <Link to={`/watch/${video.id}`}>
                                    <h3 className="font-semibold text-sm line-clamp-2">
                                        {video.title}
                                    </h3>
                                </Link>
                                <Link to={`/channel/${video.channel_id}`}>
                                    <p className="text-xs text-zinc-400 mt-1">
                                        @{video.channels?.name}
                                    </p>
                                </Link>
                                <p className="text-xs text-zinc-400">
                                    {formatViewCount(getViewCount(video.id))} views • {new Date(video.created_at!).toLocaleDateString('en-US', {
                                        month: 'short',
                                        day: 'numeric'
                                    })}
                                </p>
                            </div>
                        </div>
                    ))}
            </div>
        </div>
    );
}
