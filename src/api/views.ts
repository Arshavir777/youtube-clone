import { supabase } from "../lib/supabase"

export const getVideoViewCount = async (videoId: string): Promise<number> => {
    const { count, error } = await supabase
        .from('video_views')
        .select('*', { count: 'exact', head: true })
        .eq('video_id', videoId)

    if (error) throw error
    return count || 0
}

export const getBatchVideoViewCounts = async (videoIds: string[]): Promise<Record<string, number>> => {
    if (videoIds.length === 0) return {}

    const { data, error } = await supabase
        .from('video_views')
        .select('video_id')
        .in('video_id', videoIds)

    if (error) throw error

    // Count views per video_id
    const viewCounts: Record<string, number> = {}

    // Initialize all video IDs with 0 views
    videoIds.forEach(id => {
        viewCounts[id] = 0
    })

    // Count the views
    data?.forEach(view => {
        if (view.video_id) {
            viewCounts[view.video_id] = (viewCounts[view.video_id] || 0) + 1
        }
    })

    return viewCounts
}

export const trackVideoView = async (videoId: string, userId?: string) => {
    const { error } = await supabase
        .from('video_views')
        .insert({
            video_id: videoId,
            viewer_id: userId || null
        })

    if (error) throw error
}

export const hasUserViewedVideo = async (videoId: string, userId: string): Promise<boolean> => {
    const { data, error } = await supabase
        .from('video_views')
        .select('id')
        .eq('video_id', videoId)
        .eq('viewer_id', userId)
        .maybeSingle()

    if (error) throw error
    return !!data
}
