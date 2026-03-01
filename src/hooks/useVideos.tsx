import {useEffect, useState} from "react"
import type {Video} from "../types";
import {getAllVideos, getVideoById} from "../api/video.ts";

export const useVideos = (filter: Partial<Video> = {}) => {
    const [videos, setVideos] = useState<Video[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetch = async () => {
            try {
                const data = await getAllVideos(filter)
                console.log('fetched videos', data)
                setVideos(data)
            } catch (err: unknown) {
                console.log('error fetching videos', err)
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
    }, [JSON.stringify(filter)])

    return {videos, loading, error}
}

export const useVideo = (id: string) => {
    const [video, setVideo] = useState<Video>()
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetch = async () => {
            try {
                const data = await getVideoById(id)
                setVideo(data)
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
    }, [id])

    return {video, loading, error}
}