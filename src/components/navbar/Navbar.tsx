import {Link} from "react-router-dom"
import {Menu, Youtube} from "lucide-react";
import {useState} from "react";
import UploadModal from "../upload/UploadModal.tsx";
import {useAuth} from "../../hooks/useAuth.tsx";
import {useUserChannels} from "../../hooks/useChannel.tsx";
import {useUI} from "../../context/UIContext.tsx";
import AvatarDropdown from "./AvatarDropdown.tsx";
import SearchBar from "./SearchBar.tsx";

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
        <header className="h-16 px-3 md:px-6 flex items-center justify-between gap-2 md:gap-4 border-b border-zinc-800 bg-zinc-900">

            <div className='flex items-center flex-shrink-0'>
                <button
                    onClick={toggleSidebar}
                    className="p-2 mr-1 md:mr-3 cursor-pointer rounded hover:bg-zinc-800"
                >
                    <Menu size={22}/>
                </button>

                <Link to="/" className="text-lg md:text-xl font-bold text-white">
                    <div className='flex items-center'>
                        <Youtube className='mr-1 text-green-500'/>
                        <span className="hidden sm:inline">Youtube</span>
                    </div>
                </Link>
            </div>

            <div className="flex-1 max-w-2xl mx-2 md:mx-4">
                <SearchBar />
            </div>

            <div className="flex items-center gap-2 md:gap-4 flex-shrink-0">
                {user ? LoggedInSection() :
                    <Link to='/login'>
                        <button
                            className="bg-zinc-700 px-3 md:px-4 py-2 rounded-lg cursor-pointer text-sm md:text-base"
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