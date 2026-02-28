interface LoaderProps {
    size?: "sm" | "md" | "lg"
    fullScreen?: boolean
}

export default function Loader({
                                   size = "md",
                                   fullScreen = false,
                               }: LoaderProps) {
    const sizeMap = {
        sm: "w-4 h-4 border-2",
        md: "w-8 h-8 border-4",
        lg: "w-14 h-14 border-4",
    }

    const spinner = (
        <div
            className={`
        ${sizeMap[size]}
        border-zinc-700
        border-t-red-600
        rounded-full
        animate-spin
      `}
        />
    )

    if (fullScreen) {
        return (
            <div className="fixed inset-0 flex items-center justify-center bg-zinc-950 z-50">
                {spinner}
            </div>
        )
    }

    return (
        <div className="flex items-center justify-center p-4">
            {spinner}
        </div>
    )
}