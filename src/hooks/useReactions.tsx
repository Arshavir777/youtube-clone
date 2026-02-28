import {useEffect, useState} from "react"
import {
    getVideoReactions,
    getUserReaction,
    toggleReaction,
} from "../api/likes"
import {useAuth} from "./useAuth.tsx";

export const useReactions = (videoId: string) => {
    const {user} = useAuth()

    const [likes, setLikes] = useState(0)
    const [dislikes, setDislikes] = useState(0)
    const [userReaction, setUserReaction] = useState<
        "like" | "dislike" | null
    >(null)

    const load = async () => {
        const reactions = await getVideoReactions(videoId)

        setLikes(reactions.filter((r) => r.type === "like").length)
        setDislikes(reactions.filter((r) => r.type === "dislike").length)

        if (user) {
            const userData = await getUserReaction(videoId, user.id)
            if (userData) {
                setUserReaction(userData.type === 'like' ? 'like' : 'dislike')
            }
        }
    }

    useEffect(() => {
        void load()
    }, [videoId, user])

    const handleReaction = async (type: "like" | "dislike") => {
        if (!user) return

        // Optimistic UI
        if (userReaction === type) {
            setUserReaction(null)
            if (type === "like")
                setLikes((l) => l - 1)
            else
                setDislikes((d) => d - 1)
        } else {
            if (userReaction === "like") setLikes((l) => l - 1)
            if (userReaction === "dislike") setDislikes((d) => d - 1)

            setUserReaction(type)
            if (type === "like")
                setLikes((l) => l + 1)
            else
                setDislikes((d) => d + 1)
        }

        await toggleReaction(videoId, user.id, type)
    }

    return {
        likes,
        dislikes,
        userReaction,
        handleReaction,
    }
}