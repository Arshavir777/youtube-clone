import { useEffect, useState } from "react"
import { supabase } from "../../lib/supabase"
import { useNavigate, Link } from "react-router-dom"
import type {Channel, Profile} from "../../types";
import {useAuth} from "../../hooks/useAuth.tsx";

export default function ProfilePage() {
    const { user, signOut } = useAuth()
    const [profile, setProfile] = useState<Profile|null>(null)
    const [channels, setChannels] = useState<Channel[]>([])
    const navigate = useNavigate()

    useEffect(() => {
        if (!user) return

        const fetchProfile = async () => {
            const { data } = await supabase
                .from("profiles")
                .select("*")
                .eq("id", user.id)
                .single()

            console.log({data})
            setProfile(data)
        }

        const fetchChannels = async () => {
            const { data } = await supabase
                .from("channels")
                .select("*")
                .eq("owner_id", user.id)
            setChannels(data || [])
        }

        fetchProfile()
        fetchChannels()
    }, [user])

    const handleDeleteProfile = async () => {
        if (!user) return
        const confirm = window.confirm(
            "Are you sure you want to delete your profile? This will remove all channels and videos!"
        )
        if (!confirm) return

        // Delete auth user
        await supabase.auth.admin.deleteUser(user.id)
        // Sign out
        signOut()
        navigate("/register")
    }

    if (!profile) return <div>Loading...</div>

    return (
        <div className="max-w-dvw mx-auto p-6">
            <h1 className="text-2xl font-bold mb-4">My Profile</h1>

            <div className="flex items-center gap-4 mb-6">
                <img
                    src={profile.avatar_url || `https://i.pravatar.cc/100?u=${profile.id}`}
                    className="w-20 h-20 rounded-full"
                />
                <div>
                    <p className="text-lg font-semibold">{profile.username || "No username"}</p>
                    <p className="text-sm text-zinc-400">{user?.email}</p>
                </div>
            </div>

            <button
                onClick={handleDeleteProfile}
                className="bg-red-600 px-4 py-2 rounded mb-6 cursor-pointer"
            >
                Delete Profile
            </button>

            <h2 className="text-xl font-bold mb-2">My Channels</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {channels.map((channel) => (
                    <Link
                        key={channel.id}
                        to={`/channel/${channel.id}`}
                        className="bg-zinc-800 p-4 rounded hover:bg-zinc-700 transition"
                    >
                        <img
                            src={channel.avatar_url || `https://i.pravatar.cc/50?u=${channel.id}`}
                            className="w-12 h-12 rounded-full mb-2"
                        />
                        <p className="font-semibold text-green-400">@{channel.name}</p>
                        <p className="text-sm text-zinc-400">{channel.description}</p>
                    </Link>
                ))}
            </div>
        </div>
    )
}