import {Link, useParams} from "react-router-dom"
import {useVideo, useVideos} from "../../hooks/useVideos.tsx";
import LikeDislikeBlock from "../../components/video/LikeDislikeBlock.tsx";
import Loader from "../../components/ui/Loader.tsx";
import Player from "../../components/video/Player.tsx";
import {useAuth} from "../../hooks/useAuth.tsx";
import {useState, useEffect} from "react";
import {checkSubscription, getSubscriberCount, subscribe, unsubscribe} from "../../api/subscription.ts";
import {getVideoViewCount, trackVideoView, hasUserViewedVideo} from "../../api/views.ts";
import {useViewCount} from "../../context/ViewCountContext.tsx";
import SuggestedVideosSidebar from "../../components/video/SuggestedVideosSidebar.tsx";
import {formatSubscriberCount, formatViewCount} from "../../utils";

export default function WatchPage() {
    const {id} = useParams()
    const {video, loading, error} = useVideo(id!)
    const {videos: suggestedVideos} = useVideos()
    const {user, profile} = useAuth()
    const {fetchViewCounts} = useViewCount()
    const [isSubscribed, setIsSubscribed] = useState(false)
    const [subscriberCount, setSubscriberCount] = useState(0)
    const [loadingSubscription, setLoadingSubscription] = useState(false)
    const [viewCount, setViewCount] = useState(0)

    useEffect(() => {
        const fetchSubscriptionData = async () => {
            if (!video?.channel_id) return

            try {
                const count = await getSubscriberCount(video.channel_id)
                setSubscriberCount(count)

                if (user) {
                    const subscribed = await checkSubscription(video.channel_id, user.id)
                    setIsSubscribed(subscribed)
                }
            } catch (error) {
                console.error('Error fetching subscription data:', error)
            }
        }

        void fetchSubscriptionData()
    }, [video?.channel_id, user])

    // Fetch view counts for suggested videos in a batch
    useEffect(() => {
        if (suggestedVideos.length > 0) {
            const videoIds = suggestedVideos.map(v => v.id)
            void fetchViewCounts(videoIds)
        }
    }, [suggestedVideos, fetchViewCounts])

    // Fetch and track video views
    useEffect(() => {
        const handleVideoView = async () => {
            if (!video?.id || !user?.id) return

            try {
                // Get the current view count
                const count = await getVideoViewCount(video.id)
                setViewCount(count)

                // Track the view if the user hasn't viewed this video yet
                if (user) {
                    const hasViewed = await hasUserViewedVideo(video.id, user.id)
                    if (!hasViewed) {
                        await trackVideoView(video.id, user.id)
                        setViewCount(prev => prev + 1)
                    }
                } else {
                    // Track the anonymous view (you might want to use sessionStorage to prevent duplicate counts)
                    const sessionKey = `viewed_${video.id}`
                    if (!sessionStorage.getItem(sessionKey)) {
                        await trackVideoView(video.id)
                        sessionStorage.setItem(sessionKey, 'true')
                        setViewCount(prev => prev + 1)
                    }
                }
            } catch (error) {
                console.error('Error handling video view:', error)
            }
        }

        void handleVideoView()
    }, [video?.id, user])

    const toggleSubscribe = async () => {
        if (!video?.channel_id || !user) return

        setLoadingSubscription(true)
        try {
            if (isSubscribed) {
                await unsubscribe(video.channel_id, user.id)
                setIsSubscribed(false)
                setSubscriberCount(prev => prev - 1)
            } else {
                await subscribe(video.channel_id, user.id)
                setIsSubscribed(true)
                setSubscriberCount(prev => prev + 1)
            }
        } catch (error) {
            console.error('Error toggling subscription:', error)
        } finally {
            setLoadingSubscription(false)
        }
    }

    if (loading) return <Loader />
    if (error) return error
    if (!video) return

    return (
        <div className="flex flex-col lg:flex-row gap-6 max-w-450 mx-auto lg:px-0">
            <div className="flex-1 lg:max-w-5xl">
                <Player video={video} />

                <h1 className="text-xl md:text-2xl font-bold mt-2">
                    {video.title}
                </h1>

                <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between mt-4 gap-4'>
                    <div className="flex gap-3 items-center">
                        <img
                            src={video.channels?.avatar_url as string}
                            className="w-10 h-10 rounded-full"
                        />

                        <div className="flex-1 min-w-0">
                            <Link to={`/channel/${video.channel_id}`}>
                                <p className="text-sm font-bold text-green-400">
                                    @{video.channels?.name}
                                </p>
                            </Link>

                            <p className="text-sm text-zinc-400">
                                {formatSubscriberCount(subscriberCount)} subscribers
                            </p>
                        </div>

                        <button
                            onClick={toggleSubscribe}
                            disabled={!user || loadingSubscription}
                            className={`px-3 cursor-pointer sm:px-4 py-2 rounded-full font-semibold transition text-sm ${
                                isSubscribed
                                    ? 'bg-zinc-700 hover:bg-zinc-600 text-white'
                                    : 'bg-white hover:bg-zinc-200 text-black'
                            } disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap`}
                        >
                            {loadingSubscription ? '...' : isSubscribed ? 'Subscribed' : 'Subscribe'}
                        </button>
                    </div>

                    <LikeDislikeBlock videoId={video.id}/>
                </div>


                <div className='mt-4 bg-zinc-800 rounded-lg p-3 md:p-4'>
                    <p className="text-sm text-zinc-400 mb-2">
                        {formatViewCount(viewCount)} views • {new Date(video.created_at!).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                        })}
                    </p>
                    <p className="whitespace-pre-wrap text-sm md:text-base">{video.description}</p>
                </div>

                {/* Comments Section */}
                <div className="mt-6 mb-8 lg:mb-0">
                    <h2 className="text-lg md:text-xl font-bold mb-4">Comments</h2>
                    <div className="space-y-4">
                        {user && (
                            <div className="flex gap-3">
                                <img
                                    src={profile?.avatar_url || '/default-avatar.png'}
                                    alt={profile?.username || 'User'}
                                    className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover"
                                />
                                <div className="flex-1">
                                    <input
                                        type="text"
                                        placeholder="Add a comment..."
                                        className="w-full bg-transparent border-b border-zinc-700 pb-2 focus:border-white outline-none text-sm md:text-base"
                                    />
                                </div>
                            </div>
                        )}
                        <div className="text-zinc-400 text-sm">
                            Comments feature coming soon...
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Sidebar */}
            <SuggestedVideosSidebar videos={suggestedVideos} currentVideoId={video.id} />
        </div>
    )
}