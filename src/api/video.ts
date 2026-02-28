import {supabase} from "../lib/supabase"
import type {Video} from '../types'

export const getAllVideos = async (filter?: Partial<Video>): Promise<Video[]> => {

    let query = supabase.from("videos")
        .select(`*, channels(*)`);

    if (filter?.channel_id) {
        query = query.eq('channel_id', filter.channel_id)
    }

    const {data, error} = await query

    if (error) throw error
    return (data ?? []).map((video) => ({
        ...video,
        channels: video.channels ?? undefined,
    })) as Video[]
}

export const getVideoById = async (id: string): Promise<Video> => {
    const {data, error} = await supabase.from("videos")
        .select(`*, channels(*)`).eq('id', id)
        .single()

    if (error) throw error
    return {...data, channels: data.channels} as Video
}