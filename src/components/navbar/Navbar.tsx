import {Link} from "react-router-dom"
import {Menu, Youtube} from "lucide-react";
import {useState} from "react";
import UploadModal from "../upload/UploadModal.tsx";
import {useAuth} from "../../hooks/useAuth.tsx";
import {useUserChannels} from "../../hooks/useChannel.tsx";
import {useUI} from "../../context/UIContext.tsx";
import AvatarDropdown from "./AvatarDropdown.tsx";

export default function Navbar() {
    const {user} = useAuth()
    const {toggleSidebar} = useUI()
    const {channels} = useUserChannels(user?.id ?? "")

    const [isUploadOpen, setIsUploadOpen] = useState(false)

    const LoggedInSection = () => {
        return (
            <>
                <button className="bg-red-600 px-4 py-2 rounded-lg cursor-pointer"
                        onClick={() => setIsUploadOpen(true)}
                >+ Upload
                </button>
                <AvatarDropdown />
            </>

        )
    }
    return (
        <header className="h-16 px-6 flex items-center justify-between border-b border-zinc-800 bg-zinc-900">

            <div className='flex items-center'>
                <button
                    onClick={toggleSidebar}
                    className="p-2 mr-3 cursor-pointer rounded hover:bg-zinc-800"
                >
                    <Menu size={22}/>
                </button>

                <Link to="/" className="text-xl font-bold text-white">
                    <div className='flex items-center'>
                        <Youtube className='mr-1 text-red-500'/> YouDube
                    </div>
                </Link>
            </div>

            <input
                type="text"
                placeholder="Search"
                className="w-96 px-4 py-2 rounded-full bg-zinc-800 focus:outline-none"
            />

            <div className="flex items-center gap-4">
                {user ? LoggedInSection() :
                    <Link to='/login'>
                        <button
                            className="bg-zinc-700 px-4 py-2 rounded-lg cursor-pointer"
                        >
                            Sign In
                        </button>
                    </Link>}
            </div>

            <UploadModal
                isOpen={isUploadOpen}
                channel={channels[0]}
                onClose={() => setIsUploadOpen(false)}
            />
        </header>
    )
}