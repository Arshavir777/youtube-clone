import {useParams} from "react-router-dom"
import {useChannel} from "../../hooks/useChannel.tsx";
import {useVideos} from "../../hooks/useVideos.tsx";

export default function ChannelPage() {
    const {id} = useParams()
    const {channel, loading} = useChannel(id!)
    const {videos} = useVideos({channel_id: id!})

    if (loading) return <div>Loading...</div>
    if (!channel) return <div>Channel not found</div>

    return (
        <div>

            <div>
                Channel INFO

                {channel.name}
            </div>

            {/*<div className="flex items-center gap-4 mb-6">*/}
            {/*    <img*/}
            {/*        src={videos[0].channel.avatar}*/}
            {/*        className="w-20 h-20 rounded-full"*/}
            {/*    />*/}
            {/*    <h1 className="text-2xl font-bold">*/}
            {/*        {videos[0].channel.name}*/}
            {/*    </h1>*/}
            {/*</div>*/}

            <div className="grid grid-cols-3 gap-6">
                {videos.map((video) => (
                    <img
                        key={video.id}
                        src={video.thumbnail_url!}
                        className="rounded-xl"
                    />
                ))}
            </div>
        </div>
    )
}