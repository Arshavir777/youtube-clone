import { supabase } from "../lib/supabase"

export const getChannelsByUser = async (userId: string) => {
    const { data, error } = await supabase
        .from("channels")
        .select("*")
        .eq("owner_id", userId)
    if (error) throw error
    return data
}

export const getChannelById = async (channelId: string) => {
    const { data, error } = await supabase
        .from("channels")
        .select("*")
        .eq("id", channelId)
        .single()
    if (error) throw error
    return data
}

export const createChannel = async (payload: {
    owner_id: string
    name: string
    handle: string
    avatar_url?: string
    banner_url?: string
    description?: string
}) => {
    const { data, error } = await supabase
        .from("channels")
        .insert([payload])
        .select()
    if (error) throw error
    return data?.[0]
}