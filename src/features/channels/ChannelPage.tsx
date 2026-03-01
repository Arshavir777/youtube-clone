import {useParams, Link} from "react-router-dom"
import {useChannel} from "../../hooks/useChannel.tsx";
import {useVideos} from "../../hooks/useVideos.tsx";
import {useAuth} from "../../hooks/useAuth.tsx";
import {useState, useEffect} from "react";
import {checkSubscription, getSubscriberCount, subscribe, unsubscribe} from "../../api/subscription.ts";
import {useViewCount} from "../../context/ViewCountContext.tsx";
import Loader from "../../components/ui/Loader.tsx";
import VideoGrid from "../../components/video/VideoGrid.tsx";
import {Settings} from "lucide-react";

export default function ChannelPage() {
    const {id} = useParams()
    const {channel, loading} = useChannel(id!)
    const {videos, loading: videosLoading} = useVideos({channel_id: id!})
    const {user} = useAuth()
    const {fetchViewCounts} = useViewCount()
    const [activeTab, setActiveTab] = useState<'videos' | 'about'>('videos')
    const [isSubscribed, setIsSubscribed] = useState(false)
    const [subscriberCount, setSubscriberCount] = useState(0)
    const [loadingSubscription, setLoadingSubscription] = useState(false)

    useEffect(() => {
        const fetchSubscriptionData = async () => {
            if (!id) return

            try {
                const count = await getSubscriberCount(id)
                setSubscriberCount(count)

                if (user) {
                    const subscribed = await checkSubscription(id, user.id)
                    setIsSubscribed(subscribed)
                }
            } catch (error) {
                console.error('Error fetching subscription data:', error)
            }
        }

        fetchSubscriptionData()
    }, [id, user])

    useEffect(() => {
        if (videos.length > 0) {
            const videoIds = videos.map(v => v.id)
            fetchViewCounts(videoIds)
        }
    }, [videos])

    const toggleSubscribe = async () => {
        if (!id || !user) return

        setLoadingSubscription(true)
        try {
            if (isSubscribed) {
                await unsubscribe(id, user.id)
                setIsSubscribed(false)
                setSubscriberCount(prev => prev - 1)
            } else {
                await subscribe(id, user.id)
                setIsSubscribed(true)
                setSubscriberCount(prev => prev + 1)
            }
        } catch (error) {
            console.error('Error toggling subscription:', error)
        } finally {
            setLoadingSubscription(false)
        }
    }


    const formatSubscriberCount = (count: number) => {
        if (count >= 1000000) {
            return `${(count / 1000000).toFixed(1)}M`
        } else if (count >= 1000) {
            return `${(count / 1000).toFixed(1)}K`
        }
        return count.toString()
    }

    // Check if the current user owns this channel
    const isOwner = user && channel?.owner_id === user.id

    if (loading) return <Loader fullScreen={true} />
    if (!channel) return <div>Channel not found</div>

    return (
        <div className="w-full">
            {/* Banner */}
            {channel.banner_url && (
                <div className="w-full h-32 md:h-48 lg:h-64 overflow-hidden">
                    <img
                        src={channel.banner_url}
                        alt={`${channel.name} banner`}
                        className="w-full h-full object-cover"
                    />
                </div>
            )}

            {/* Channel Info */}
            <div className="max-w-7xl mx-auto px-4 py-6">
                <div className="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-6">
                    <img
                        src={channel.avatar_url!}
                        alt={channel.name}
                        className="w-20 h-20 md:w-32 md:h-32 rounded-full"
                        style={{objectFit: 'cover'}}
                    />
                    <div className="flex-1">
                        <h1 className="text-2xl md:text-4xl font-bold">{channel.name}</h1>
                        <div className="flex items-center gap-2 mt-2 text-sm md:text-base text-zinc-400">
                            <span className='text-green-400'>@{channel.name.toLowerCase().replace(/\s+/g, '')}</span>
                            <span>•</span>
                            <span>{formatSubscriberCount(subscriberCount)} subscribers</span>
                            <span>•</span>
                            <span>{videos.length} videos</span>
                        </div>
                        {channel.description && (
                            <p className="mt-2 text-sm md:text-base text-zinc-300 line-clamp-2">
                                {channel.description}
                            </p>
                        )}
                    </div>
                    {isOwner ? (
                        <Link
                            to={`/channel/${id}/edit`}
                            className="px-4 md:px-6 py-2 md:py-3 rounded-full font-semibold transition whitespace-nowrap bg-zinc-700 hover:bg-zinc-600 text-white flex items-center gap-2"
                        >
                            <Settings size={18} />
                            <span>Edit Channel</span>
                        </Link>
                    ) : (
                        <button
                            onClick={toggleSubscribe}
                            disabled={!user || loadingSubscription}
                            className={`px-4 md:px-6 py-2 md:py-3 rounded-full font-semibold transition whitespace-nowrap ${
                                isSubscribed
                                    ? 'bg-zinc-700 hover:bg-zinc-600 text-white'
                                    : 'bg-white hover:bg-zinc-200 text-black'
                            } disabled:opacity-50 disabled:cursor-not-allowed`}
                        >
                            {loadingSubscription ? '...' : isSubscribed ? 'Subscribed' : 'Subscribe'}
                        </button>
                    )}
                </div>

                {/* Tabs */}
                <div className="mt-6 border-b border-zinc-700">
                    <div className="flex gap-6">
                        <button
                            onClick={() => setActiveTab('videos')}
                            className={`px-4 py-3 font-semibold transition relative ${
                                activeTab === 'videos'
                                    ? 'text-white'
                                    : 'text-zinc-400 hover:text-white'
                            }`}
                        >
                            Videos
                            {activeTab === 'videos' && (
                                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white" />
                            )}
                        </button>
                        <button
                            onClick={() => setActiveTab('about')}
                            className={`px-4 py-3 font-semibold transition relative ${
                                activeTab === 'about'
                                    ? 'text-white'
                                    : 'text-zinc-400 hover:text-white'
                            }`}
                        >
                            About
                            {activeTab === 'about' && (
                                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white" />
                            )}
                        </button>
                    </div>
                </div>

                {/* Tab Content */}
                <div className="mt-6">
                    {activeTab === 'videos' && (
                        <div>
                            {videosLoading ? (
                                <Loader size="lg" />
                            ) : videos.length > 0 ? (
                                <VideoGrid videos={videos} />
                            ) : (
                                <div className="text-center py-12 text-zinc-400">
                                    No videos yet
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'about' && (
                        <div className="bg-zinc-800 rounded-lg p-6 max-w-4xl">
                            <h2 className="text-xl font-bold mb-4">About</h2>
                            {channel.description ? (
                                <p className="text-zinc-300 whitespace-pre-wrap">{channel.description}</p>
                            ) : (
                                <p className="text-zinc-400">No description available</p>
                            )}
                            <div className="mt-6 space-y-2 text-sm text-zinc-400">
                                <p>{formatSubscriberCount(subscriberCount)} subscribers</p>
                                <p>{videos.length} videos</p>
                                <p>Joined {new Date(channel.created_at!).toLocaleDateString('en-US', {
                                    month: 'long',
                                    year: 'numeric'
                                })}</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}