import VideoCard from "./VideoCard"
import type {Tables} from "../../types/database.types.ts";

interface Props {
    videos: Tables<'videos'>[]
}

export default function VideoGrid({videos}: Props) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {videos.map((video) => (
                <VideoCard key={video.id} video={video}/>
            ))}
        </div>
    )
}