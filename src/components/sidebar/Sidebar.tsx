import {Home, User, History} from "lucide-react"
import SidebarItem from "./SidebarItem"
import {useUI} from "../../context/UIContext"

export default function Sidebar() {
    const {isSidebarOpen, closeSidebar} = useUI()

    return (
        <>
            {/* Overlay (mobile) */}
            {isSidebarOpen && (
                <div
                    onClick={closeSidebar}
                    className="fixed inset-0 bg-black/50 z-30 md:hidden"
                />
            )}

            <aside
                className={`
          fixed top-16 left-0 h-[calc(100%-64px)]
          w-64 bg-zinc-900 border-r border-zinc-800
          transform transition-transform duration-300 ease-in-out z-40
          ${isSidebarOpen ? "block": "hidden"}
          md:translate-x-0 md:static md:h-auto
        `}
            >
                <nav className="flex flex-col p-4 gap-2">
                    <SidebarItem icon={<Home size={20}/>} label="Home" path="/"/>
                    <SidebarItem icon={<User size={20}/>} label="Subscriptions" path="/"/>
                    <SidebarItem icon={<History size={20}/>} label="History" path="/"/>
                </nav>
            </aside>
        </>
    )
}