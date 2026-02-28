import { useEffect, useRef, useState } from "react"
import { LogOut, User } from "lucide-react"
import { useNavigate } from "react-router-dom"
import {useAuth} from "../../hooks/useAuth.tsx";

export default function AvatarDropdown() {
    const [open, setOpen] = useState(false)
    const dropdownRef = useRef<HTMLDivElement>(null)
    const navigate = useNavigate()
    const {signOut } = useAuth()

    const handleLogout = async () => {
        await signOut()
        navigate("/login")
    }

    // Close on outside click
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
                setOpen(false)
            }
        }

        document.addEventListener("mousedown", handleClickOutside)
        return () =>
            document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    return (
        <div className="relative" ref={dropdownRef}>
            {/* Avatar Button */}
            <button
                onClick={() => setOpen((prev) => !prev)}
                className="w-9 h-9 rounded-full bg-red-600 cursor-pointer flex items-center justify-center font-semibold"
            >
                <User size={18} />
            </button>

            {/* Dropdown */}
            {open && (
                <div
                    className="absolute right-0 mt-2 w-48 bg-zinc-900 border border-zinc-800 rounded-lg shadow-lg overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-100">
                    <button
                        onClick={() => {
                            navigate("/profile")
                            setOpen(false)
                        }}
                        className="flex cursor-pointer items-center gap-3 w-full px-4 py-3 hover:bg-zinc-800 text-left"
                    >
                        <User size={18} />
                        Profile
                    </button>

                    <button
                        onClick={handleLogout}
                        className="flex cursor-pointer items-center gap-3 w-full px-4 py-3 hover:bg-zinc-800 text-left text-red-500"
                    >
                        <LogOut size={18} />
                        Logout
                    </button>
                </div>
            )}
        </div>
    )
}