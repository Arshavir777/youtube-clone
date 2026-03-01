import VideoGrid from "../../components/video/VideoGrid"
import {useVideos} from "../../hooks/useVideos.tsx";
import Loader from "../../components/ui/Loader.tsx";
import {useViewCount} from "../../context/ViewCountContext.tsx";
import {useEffect} from "react";

export default function HomePage() {

    const {videos, loading, error} = useVideos()

    const {fetchViewCounts} = useViewCount()

    useEffect(() => {
        if (videos.length > 0) {
            const videoIds = videos.map(v => v.id)
            void fetchViewCounts(videoIds)
        }
    }, [videos, fetchViewCounts])

    if (loading) return <Loader fullScreen={true} />

    if (error) return error

    return <VideoGrid videos={videos}/>;
}