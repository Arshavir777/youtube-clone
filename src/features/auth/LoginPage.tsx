import {useState} from "react"
import {Link, useNavigate} from "react-router-dom"
import {signIn} from "../../api/auth.ts";
import GoogleSignInButton from "../../components/auth/GoogleSignInButton";

export default function LoginPage() {
    const navigate = useNavigate()
    const [email, setEmail] = useState("11-arshogharibyan@gmail.com")
    const [password, setPassword] = useState("youtubeclone2026")
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)

    const handleLogin = async (e: any) => {
        e.preventDefault()

        setLoading(true)
        const {error} = await signIn(email, password)

        setLoading(false)
        if (error) {
            setError(error.message)
        } else {
            navigate("/")
        }
    }

    return (
        <>
            <Link to='/'>
                <h1 className="text-xl font-bold text-white m-2">Home Page</h1>
            </Link>
            <div className="h-screen flex items-center justify-center bg-zinc-950">
                <form
                    onSubmit={handleLogin}
                    className="bg-zinc-900 p-8 rounded-xl w-96 space-y-4"
                >

                    <h1 className="text-xl font-bold text-white">Login</h1>

                    {error && <p className="text-red-500">{error}</p>}

                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        className="w-full p-3 bg-zinc-800 rounded"
                        onChange={(e) => setEmail(e.target.value)}
                    />

                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        className="w-full p-3 bg-zinc-800 rounded"
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    <button className="w-full bg-red-600 p-3 rounded cursor-pointer">
                        {loading ? "Logging..." : "Login"}
                    </button>

                    <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-zinc-700"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-zinc-900 text-zinc-400">Or continue with</span>
                        </div>
                    </div>

                    <GoogleSignInButton text="Sign in with Google" />

                    <p className="text-sm text-zinc-400">
                        No account? <Link to="/register" className="text-white hover:underline">Register</Link>
                    </p>
                </form>
            </div>
        </>

    )
}