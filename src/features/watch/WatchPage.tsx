import {Link, useParams} from "react-router-dom"
import {useVideo} from "../../hooks/useVideos.tsx";
import LikeDislikeBlock from "../../components/video/LikeDislikeBlock.tsx";
import Loader from "../../components/ui/Loader.tsx";

export default function WatchPage() {
    const {id} = useParams()
    const {video, loading, error} = useVideo(id!)

    if (loading) return <Loader size={'lg'} />
    if (error) return error
    if (!video) return

    return (
        <div className="max-w-5xl">
            <video className='w-100 h-100' style={{objectFit: 'contain', width: '100%'}} controls
                   src={video.video_url}></video>

            <h1 className="text-2xl font-bold mt-2">
                {video.title}
            </h1>

            <div className='flex items-center justify-between mt-4'>
                <div className="flex gap-3">
                    <img
                        src={video.channels?.avatar_url as string}
                        className="w-10 h-10 rounded-full"
                    />

                    <div>
                        <Link to={`/channel/${video.channel_id}`}>
                            <p className="text-sm font-bold text-green-400">
                                @{video.channels?.name}
                            </p>
                        </Link>

                        <p className="text-sm text-zinc-400">
                            22K subscribers
                        </p>
                    </div>
                </div>

                <LikeDislikeBlock videoId={video.id}/>
            </div>


            <div className='mt-4'>
                {video.description}
            </div>

            <p className="text-zinc-400 mt-2">
                {/*{video?.views ?? 0} views • {video.createdAt}*/}
            </p>
        </div>
    )
}