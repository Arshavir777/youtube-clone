import { supabase } from "../lib/supabase"

export const checkSubscription = async (channelId: string, userId: string) => {
    const { data, error } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('channel_id', channelId)
        .eq('subscriber_id', userId)
        .single()

    if (error && error.code !== 'PGRST116') throw error
    return !!data
}

export const getSubscriberCount = async (channelId: string) => {
    const { data, error } = await supabase
        .from('subscriptions')
        .select('*', { count: 'exact' })
        .eq('channel_id', channelId)

    if (error) throw error
    return data?.length || 0
}

export const subscribe = async (channelId: string, userId: string) => {
    const { error } = await supabase
        .from('subscriptions')
        .insert({
            channel_id: channelId,
            subscriber_id: userId
        })

    if (error) throw error
}

export const unsubscribe = async (channelId: string, userId: string) => {
    const { error } = await supabase
        .from('subscriptions')
        .delete()
        .eq('channel_id', channelId)
        .eq('subscriber_id', userId)

    if (error) throw error
}
