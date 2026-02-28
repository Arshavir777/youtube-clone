import {useEffect, useState} from "react"
import {getChannelsByUser, getChannelById} from "../api/channel"
import type {Channel} from "../types";

export const useUserChannels = (userId: string) => {
    const [channels, setChannels] = useState<Channel[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        if (!userId) return
        const fetch = async () => {
            try {
                const data = await getChannelsByUser(userId)
                setChannels(data || [])
            } catch (err: unknown) {
                if (err instanceof Error) {
                    setError(err.message)
                } else {
                    setError('Something went wrong')
                }
            } finally {
                setLoading(false)
            }
        }
        void fetch()
    }, [userId])

    return {channels, loading, error}
}

export const useChannel = (channelId: string) => {
    const [channel, setChannel] = useState<Channel | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        if (!channelId) return
        const fetch = async () => {
            try {
                const data = await getChannelById(channelId)
                setChannel(data)
            } catch (err: unknown) {
                if (err instanceof Error) {
                    setError(err.message)
                } else {
                    setError('Something went wrong')
                }
            } finally {
                setLoading(false)
            }
        }
        fetch()
    }, [channelId])

    return {channel, loading, error}
}