import { supabase } from "../lib/supabase"

export const getVideoReactions = async (videoId: string) => {
    const { data, error } = await supabase
        .from("video_likes")
        .select("type")
        .eq("video_id", videoId)

    if (error) throw error
    return data
}

export const getUserReaction = async (videoId: string, userId: string) => {
    const { data, error } = await supabase
        .from("video_likes")
        .select("*")
        .eq("video_id", videoId)
        .eq("user_id", userId)
        .single()

    if (error && error.code !== "PGRST116") throw error
    return data
}

export const toggleReaction = async (
    videoId: string,
    userId: string,
    type: "like" | "dislike"
) => {
    const { data: existing } = await supabase
        .from("video_likes")
        .select("*")
        .eq("video_id", videoId)
        .eq("user_id", userId)
        .single()

    if (!existing) {
        return supabase.from("video_likes").insert({
            video_id: videoId,
            user_id: userId,
            type,
        })
    }

    if (existing.type === type) {
        return supabase
            .from("video_likes")
            .delete()
            .eq("id", existing.id)
    }

    return supabase
        .from("video_likes")
        .update({ type })
        .eq("id", existing.id)
}