import {Link} from "react-router-dom"
import type {ReactNode} from "react";
import {useUI} from "../../context/UIContext";

interface Props {
    icon: ReactNode
    label: string
    path: string
}

export default function SidebarItem({icon, label, path}: Props) {
    const {closeSidebar} = useUI()

    return (
        <Link
            to={path}
            onClick={closeSidebar}
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-zinc-800 transition"
        >
            {icon}
            <span>{label}</span>
        </Link>
    )
}
