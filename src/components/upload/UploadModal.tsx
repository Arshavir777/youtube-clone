import {useState} from "react"
import {supabase} from "../../lib/supabase"
import VideoUploadDropzone from "../ui/VideoUploadDropzone.tsx";
import {useAuth} from "../../hooks/useAuth.tsx";
import type {Channel} from "../../types";

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
    const [error, setError] = useState("")

    if (!isOpen) return null

    const handleOnDrop = (files: File[]) => {
        setFile(files[0])
    }

    const handleUpload = async () => {
        setError('')
        if (!file || !user) {
            setError('Upload File')
            return
        }

        setLoading(true)

        const filePath = `${user.id}/${Date.now()}-${file.name}`

        const {error: uploadError} = await supabase.storage
            .from("videos")
            .upload(filePath, file)

        if (uploadError) {
            console.error({uploadError})
            setLoading(false)
            return
        }

        const {data: publicUrl} = supabase.storage
            .from("videos")
            .getPublicUrl(filePath)

        await supabase.from("videos").insert({
            user_id: user.id,
            title,
            description,
            channel_id: channel.id,
            thumbnail_url: 'sdfsd',
            video_url: publicUrl.publicUrl,
        })

        setLoading(false)
        onClose()
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

                <div className='mb-3 '>
                    {file && 'Uploaded: ' + file.name}
                </div>

                <div className='mt-2 text-red-400'>
                    {error && error}
                </div>

                <VideoUploadDropzone onDrop={handleOnDrop}/>

                <div className="flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-zinc-700 rounded cursor-pointer"
                    >
                        Cancel
                    </button>

                    <button
                        onClick={handleUpload}
                        disabled={loading}
                        className="px-4 py-2 bg-red-600 rounded cursor-pointer"
                    >
                        {loading ? "Uploading..." : "Upload"}
                    </button>
                </div>
            </div>
        </div>
    )
}