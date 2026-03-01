import {useEffect, useState} from "react";
import {useAuth} from "../../hooks/useAuth";
import {supabase} from "../../lib/supabase";
import type {Channel} from "../../types";
import {Link} from "react-router-dom";
import Loader from "../../components/ui/Loader";
import {getSubscriberCount} from "../../api/subscription";

interface SubscriptionWithChannel {
    id: string;
    channel_id: string;
    channels: Channel;
}

export default function SubscriptionsPage() {
    const {user} = useAuth();
    const [subscriptions, setSubscriptions] = useState<SubscriptionWithChannel[]>([]);
    const [loading, setLoading] = useState(true);
    const [subscriberCounts, setSubscriberCounts] = useState<Record<string, number>>({});

    useEffect(() => {
        const fetchSubscriptions = async () => {
            if (!user) {
                setLoading(false);
                return;
            }

            try {
                const {data, error} = await supabase
                    .from('subscriptions')
                    .select('id, channel_id, channels(*)')
                    .eq('subscriber_id', user.id);

                if (error) throw error;

                setSubscriptions(data as SubscriptionWithChannel[] || []);

                // Fetch subscriber counts for all channels
                if (data && data.length > 0) {
                    const counts: Record<string, number> = {};
                    await Promise.all(
                        data.map(async (sub) => {
                            const count = await getSubscriberCount(sub.channel_id);
                            counts[sub.channel_id] = count;
                        })
                    );
                    setSubscriberCounts(counts);
                }
            } catch (error) {
                console.error('Error fetching subscriptions:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchSubscriptions();
    }, [user]);

    const formatSubscriberCount = (count: number) => {
        if (count >= 1000000) {
            return `${(count / 1000000).toFixed(1)}M`;
        } else if (count >= 1000) {
            return `${(count / 1000).toFixed(1)}K`;
        }
        return count.toString();
    };

    if (loading) return <Loader fullScreen={true} />;

    if (!user) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
                <h2 className="text-2xl font-bold mb-4">Sign in to see your subscriptions</h2>
                <p className="text-zinc-400 mb-6">Sign in to view channels you're subscribed to</p>
                <Link
                    to="/login"
                    className="bg-white text-black px-6 py-3 rounded-full font-semibold hover:bg-zinc-200 transition"
                >
                    Sign In
                </Link>
            </div>
        );
    }

    if (subscriptions.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
                <h2 className="text-2xl font-bold mb-4">No subscriptions yet</h2>
                <p className="text-zinc-400 mb-6">Subscribe to channels to see them here</p>
                <Link
                    to="/"
                    className="bg-white text-black px-6 py-3 rounded-full font-semibold hover:bg-zinc-200 transition"
                >
                    Explore Channels
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 py-6">
            <h1 className="text-3xl font-bold mb-8">Subscriptions</h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {subscriptions.map((subscription) => (
                    <Link
                        key={subscription.id}
                        to={`/channel/${subscription.channel_id}`}
                        className="flex flex-col items-center text-center group"
                    >
                        <div className="relative mb-4">
                            <img
                                src={subscription.channels.avatar_url!}
                                alt={subscription.channels.name}
                                className="w-32 h-32 rounded-full object-cover group-hover:opacity-80 transition"
                            />
                        </div>
                        <h3 className="font-semibold text-lg group-hover:text-green-400 transition">
                            {subscription.channels.name}
                        </h3>
                        <p className="text-sm text-zinc-400 mt-1">
                            {formatSubscriberCount(subscriberCounts[subscription.channel_id] || 0)} subscribers
                        </p>
                        {subscription.channels.description && (
                            <p className="text-sm text-zinc-500 mt-2 line-clamp-2">
                                {subscription.channels.description}
                            </p>
                        )}
                    </Link>
                ))}
            </div>
        </div>
    );
}
