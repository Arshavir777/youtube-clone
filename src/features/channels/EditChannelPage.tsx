import {useParams, useNavigate} from "react-router-dom"
import {useChannel} from "../../hooks/useChannel.tsx";
import {useAuth} from "../../hooks/useAuth.tsx";
import {useState, useEffect} from "react";
import {supabase} from "../../lib/supabase.ts";
import Loader from "../../components/ui/Loader.tsx";
import {ArrowLeft} from "lucide-react";

export default function EditChannelPage() {
    const {id} = useParams()
    const navigate = useNavigate()
    const {channel, loading} = useChannel(id!)
    const {user} = useAuth()

    const [name, setName] = useState("")
    const [description, setDescription] = useState("")
    const [avatarUrl, setAvatarUrl] = useState("")
    const [bannerUrl, setBannerUrl] = useState("")
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        if (channel) {
            setName(channel.name)
            setDescription(channel.description || "")
            setAvatarUrl(channel.avatar_url || "")
            setBannerUrl(channel.banner_url || "")
        }
    }, [channel])

    // Check if user owns this channel
    const isOwner = user && channel?.owner_id === user.id

    useEffect(() => {
        if (!loading && !isOwner) {
            navigate(`/channel/${id}`)
        }
    }, [loading, isOwner, id, navigate])

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!channel) return

        setSaving(true)
        setError(null)

        try {
            const {error: updateError} = await supabase
                .from('channels')
                .update({
                    name: name.trim(),
                    description: description.trim() || null,
                    avatar_url: avatarUrl.trim() || null,
                    banner_url: bannerUrl.trim() || null,
                })
                .eq('id', channel.id)

            if (updateError) throw updateError

            navigate(`/channel/${id}`)
        } catch (err) {
            console.error('Error updating channel:', err)
            setError(err instanceof Error ? err.message : 'Failed to update channel')
        } finally {
            setSaving(false)
        }
    }

    if (loading) return <Loader fullScreen={true} />
    if (!channel || !isOwner) return null

    return (
        <div className="max-w-4xl mx-auto px-4 py-6">
            <button
                onClick={() => navigate(`/channel/${id}`)}
                className="flex items-center gap-2 text-zinc-400 hover:text-white mb-6 transition"
            >
                <ArrowLeft size={20} />
                Back to Channel
            </button>

            <h1 className="text-3xl font-bold mb-8">Edit Channel</h1>

            <form onSubmit={handleSave} className="space-y-6">
                {/* Channel Name */}
                <div>
                    <label className="block text-sm font-semibold mb-2">
                        Channel Name <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        className="w-full px-4 py-3 rounded-lg bg-zinc-800 border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-zinc-600"
                        placeholder="Enter channel name"
                    />
                </div>

                {/* Description */}
                <div>
                    <label className="block text-sm font-semibold mb-2">
                        Description
                    </label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows={4}
                        className="w-full px-4 py-3 rounded-lg bg-zinc-800 border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-zinc-600 resize-none"
                        placeholder="Tell viewers about your channel"
                    />
                    <p className="text-xs text-zinc-400 mt-1">
                        {description.length} characters
                    </p>
                </div>

                {/* Avatar URL */}
                <div>
                    <label className="block text-sm font-semibold mb-2">
                        Avatar URL
                    </label>
                    <input
                        type="url"
                        value={avatarUrl}
                        onChange={(e) => setAvatarUrl(e.target.value)}
                        className="w-full px-4 py-3 rounded-lg bg-zinc-800 border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-zinc-600"
                        placeholder="https://example.com/avatar.jpg"
                    />
                    {avatarUrl && (
                        <div className="mt-3">
                            <p className="text-xs text-zinc-400 mb-2">Preview:</p>
                            <img
                                src={avatarUrl}
                                alt="Avatar preview"
                                className="w-24 h-24 rounded-full object-cover"
                                onError={(e) => {
                                    e.currentTarget.style.display = 'none'
                                }}
                            />
                        </div>
                    )}
                </div>

                {/* Banner URL */}
                <div>
                    <label className="block text-sm font-semibold mb-2">
                        Banner URL
                    </label>
                    <input
                        type="url"
                        value={bannerUrl}
                        onChange={(e) => setBannerUrl(e.target.value)}
                        className="w-full px-4 py-3 rounded-lg bg-zinc-800 border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-zinc-600"
                        placeholder="https://example.com/banner.jpg"
                    />
                    {bannerUrl && (
                        <div className="mt-3">
                            <p className="text-xs text-zinc-400 mb-2">Preview:</p>
                            <img
                                src={bannerUrl}
                                alt="Banner preview"
                                className="w-full h-32 rounded-lg object-cover"
                                onError={(e) => {
                                    e.currentTarget.style.display = 'none'
                                }}
                            />
                        </div>
                    )}
                </div>

                {/* Error Message */}
                {error && (
                    <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded-lg">
                        {error}
                    </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-4 pt-4">
                    <button
                        type="submit"
                        disabled={saving || !name.trim()}
                        className="px-6 py-3 bg-white text-black rounded-full font-semibold hover:bg-zinc-200 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                    <button
                        type="button"
                        onClick={() => navigate(`/channel/${id}`)}
                        className="px-6 py-3 bg-zinc-700 text-white rounded-full font-semibold hover:bg-zinc-600 transition"
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    )
}
