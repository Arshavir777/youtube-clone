import VideoGrid from "../../components/video/VideoGrid"
import {useVideos} from "../../hooks/useVideos.tsx";
import Loader from "../../components/ui/Loader.tsx";

export default function HomePage() {
    const {videos, loading, error} = useVideos({})

    if (loading) return <Loader fullScreen={true} />

    if (error) return error

    return <VideoGrid videos={videos}/>;
}