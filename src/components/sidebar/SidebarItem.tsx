import {Link} from "react-router-dom"
import type {ReactNode} from "react";

interface Props {
    icon: ReactNode
    label: string
    path: string
}

export default function SidebarItem({icon, label, path}: Props) {
    return (
        <Link
            to={path}
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-zinc-800 transition"
        >
            {icon}
            <span>{label}</span>
        </Link>
    )
}
