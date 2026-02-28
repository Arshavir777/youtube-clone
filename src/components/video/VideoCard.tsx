import {Link} from "react-router-dom"
import type {Video} from "../../types";

interface Props {
    video: Video
}

export default function VideoCard({video}: Props) {

    if (!video) {
        return
    }

    return (
        <Link to={`/watch/${video.id}`} className="cursor-pointer">
            <div className="relative">
                <img
                    src={video.thumbnail_url!}
                    className="rounded-xl w-full"
                />
                <span className="absolute bottom-2 right-2 bg-black px-2 py-1 text-xs rounded">
                  {video.duration ?? '0'}
                </span>
            </div>

            <div className="flex mt-3 gap-3">
                <img
                    src={video.channels?.avatar_url as string}
                    className="w-10 h-10 rounded-full"
                />

                <div>
                    <h3 className="font-semibold">{video.title}</h3>
                    <p className="text-sm text-green-400">
                        @{video.channels?.name}
                    </p>
                    <p className="text-sm text-zinc-400">
                        22K views • 2 days ago
                    </p>
                </div>
            </div>
        </Link>
    )
}