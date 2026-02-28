import {ThumbsUp, ThumbsDown} from "lucide-react"
import {useReactions} from "../../hooks/useReactions"

export default function LikeDislikeBlock({
                                             videoId,
                                         }: {
    videoId: string
}) {
    const {
        likes,
        dislikes,
        userReaction,
        handleReaction,
    } = useReactions(videoId)

    return (
        <div className="flex items-center gap-6 mt-4">
            <button
                onClick={() => handleReaction("like")}
                className={`cursor-pointer flex items-center gap-2 px-4 py-2 rounded-full ${
                    userReaction === "like"
                        ? "bg-white text-black"
                        : "bg-zinc-800"
                }`}
            >
                <ThumbsUp size={18}/>
                {likes}
            </button>

            <button
                onClick={() => handleReaction("dislike")}
                className={`cursor-pointer flex items-center gap-2 px-4 py-2 rounded-full ${
                    userReaction === "dislike"
                        ? "bg-white text-black"
                        : "bg-zinc-800"
                }`}
            >
                <ThumbsDown size={18}/>
                {dislikes}
            </button>
        </div>
    )
}