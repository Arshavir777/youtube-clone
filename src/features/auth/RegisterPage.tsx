import {useState} from "react"
import {Link, useNavigate} from "react-router-dom"
import {signUp} from "../../api/auth.ts";
import GoogleSignInButton from "../../components/auth/GoogleSignInButton";

export default function RegisterPage() {
    const navigate = useNavigate()
    const [email, setEmail] = useState("")
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault()

        setError('')
        setLoading(true);

        const result = await signUp(username, email, password);

        if (result?.error) {
            setError(result.error)
            return
        }

        setLoading(false)
        navigate('/')
    }

    return (
        <div className="h-screen flex items-center justify-center bg-zinc-950">
            <form
                onSubmit={handleRegister}
                className="bg-zinc-900 p-8 rounded-xl w-96 space-y-4"
            >
                <h1 className="text-xl font-bold">Register</h1>

                {error && <p className="text-red-500">{error}</p>}

                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    className="w-full p-3 bg-zinc-800 rounded"
                    onChange={(e) => setEmail(e.target.value)}
                />

                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    className="w-full p-3 bg-zinc-800 rounded"
                    onChange={(e) => setUsername(e.target.value)}
                />

                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    className="w-full p-3 bg-zinc-800 rounded"
                    onChange={(e) => setPassword(e.target.value)}
                />

                <button className="w-full bg-red-600 p-3 rounded cursor-pointer">
                    {loading ? 'Registration...' : 'Register'}
                </button>

                <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-zinc-700"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-zinc-900 text-zinc-400">Or continue with</span>
                    </div>
                </div>

                <GoogleSignInButton text="Sign up with Google" />

                <p className="text-sm text-zinc-400">
                    Already have account? <Link to="/login" className="text-white hover:underline">Login</Link>
                </p>
            </form>
        </div>
    )
}