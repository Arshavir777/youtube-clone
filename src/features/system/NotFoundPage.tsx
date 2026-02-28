import { Link, useNavigate } from "react-router-dom"

export default function NotFoundPage() {
    const navigate = useNavigate()

    return (
        <div className="h-screen flex flex-col items-center justify-center bg-zinc-950 text-white px-6">
            <h1 className="text-7xl font-bold mb-4 animate-bounce">404</h1>

            <p className="text-xl text-zinc-400 mb-8 text-center">
                The page you’re looking for doesn’t exist.
            </p>

            <div className="flex gap-4">
                <button
                    onClick={() => navigate(-1)}
                    className="px-6 py-3 bg-zinc-800 rounded-lg hover:bg-zinc-700 transition cursor-pointer"
                >
                    Go Back
                </button>

                <Link
                    to="/"
                    className="px-6 py-3 bg-red-600 rounded-lg hover:bg-red-500 transition"
                >
                    Go Home
                </Link>
            </div>
        </div>
    )
}