import {useState} from "react"
import {supabase} from "../../lib/supabase"
import VideoUploadDropzone from "../ui/VideoUploadDropzone.tsx";
import {useAuth} from "../../hooks/useAuth.tsx";
import type {Channel} from "../../types";
import {uploadVideo} from "../../lib/cloudinary.ts";

interface Props {
    isOpen: boolean
    onClose: () => void
    channel: Channel
}

export default function UploadModal({isOpen, onClose, channel}: Props) {
    const {user} = useAuth()

    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [file, setFile] = useState<File | null>(null)
    const [loading, setLoading] = useState(false)
    const [uploadProgress, setUploadProgress] = useState(0)
    const [error, setError] = useState("")

    if (!isOpen) return null

    const handleOnDrop = (files: File[]) => {
        setFile(files[0])
        setError("")
    }

    const handleUpload = async () => {
        setError('')
        setUploadProgress(0)

        if (!file) {
            setError('Please select a video file')
            return
        }

        if (!user) {
            setError('You must be logged in to upload')
            return
        }

        if (!title.trim()) {
            setError('Please enter a video title')
            return
        }

        setLoading(true)

        try {
            const cloudData = await uploadVideo(file, {
                onProgress: (progress) => {
                    setUploadProgress(progress)
                }
            })

            if (!cloudData) {
                throw new Error('Upload failed - no data returned')
            }

            const {error: dbError} = await supabase.from("videos").insert({
                user_id: user.id,
                title,
                description,
                channel_id: channel.id,
                public_id: cloudData.publicId,
                thumbnail_url: cloudData.thumbnail,
                video_url: cloudData.url,
            })

            if (dbError) {
                throw new Error(`Database error: ${dbError.message}`)
            }

            setLoading(false)
            setUploadProgress(0)
            onClose()
        } catch (err) {
            console.error('Upload error:', err)
            setError(err instanceof Error ? err.message : 'Upload failed. Please try again.')
            setLoading(false)
            setUploadProgress(0)
        }
    }

    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-40">
            <div className="bg-zinc-900 p-6 rounded-xl w-125 space-y-4">
                <h2 className="text-xl font-bold">Upload Video</h2>

                <h4 className='my-2'>
                    Channel: <b className='font-bold text-green-400'>@{channel.name}</b>
                </h4>


                <input
                    type="text"
                    placeholder="Title"
                    className="w-full p-3 bg-zinc-800 rounded"
                    onChange={(e) => setTitle(e.target.value)}
                />

                <textarea placeholder='Description' className="w-full p-3 bg-zinc-800 rounded" onChange={(e) => setDescription(e.target.value)}
                />

                <div className='mb-3'>
                    {file && (
                        <div className="text-sm text-zinc-400">
                            Selected: <span className="text-white">{file.name}</span>
                        </div>
                    )}
                </div>

                {loading && uploadProgress > 0 && (
                    <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                            <span className="text-zinc-400">Uploading...</span>
                            <span className="text-white font-semibold">{uploadProgress}%</span>
                        </div>
                        <div className="w-full bg-zinc-700 rounded-full h-2.5">
                            <div
                                className="bg-red-600 h-2.5 rounded-full transition-all duration-300"
                                style={{width: `${uploadProgress}%`}}
                            />
                        </div>
                    </div>
                )}

                {error && (
                    <div className='p-3 bg-red-900/30 border border-red-500 rounded text-red-400 text-sm'>
                        {error}
                    </div>
                )}

                <VideoUploadDropzone onDrop={handleOnDrop}/>

                <div className="flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        disabled={loading}
                        className="px-4 py-2 bg-zinc-700 rounded hover:bg-zinc-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Cancel
                    </button>

                    <button
                        onClick={handleUpload}
                        disabled={loading || !file || !title.trim()}
                        className="px-4 py-2 bg-red-600 rounded hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? `Uploading... ${uploadProgress}%` : "Upload"}
                    </button>
                </div>
            </div>
        </div>
    )
}