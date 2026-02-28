import {Outlet} from "react-router-dom"
import Navbar from "../components/navbar/Navbar"
import Sidebar from "../components/sidebar/Sidebar.tsx"

export default function MainLayout() {
    return (
        <div className="h-screen bg-zinc-950 text-white">
            <Navbar/>
            <div className="flex h-[calc(100%-64px)]">
                <Sidebar/>
                <main className="flex-1 overflow-y-auto p-6">
                    <Outlet/>
                </main>
            </div>
        </div>
    )
}
