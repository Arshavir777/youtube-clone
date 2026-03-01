import {createRoot} from 'react-dom/client'
import {BrowserRouter} from "react-router-dom"
import {AuthProvider} from "./context/AuthContext.tsx";
import {UIProvider} from "./context/UIContext.tsx";
import {ViewCountProvider} from "./context/ViewCountContext.tsx";
import App from './App.tsx'
import './index.css'
import {useAuth} from "./hooks/useAuth.tsx";

function AppWrapper() {
    const {loading} = useAuth()

    if (loading) {
        return (
            <div className="h-screen w-screen bg-zinc-950 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"/>
                    <p className="text-zinc-400">Loading...</p>
                </div>
            </div>
        )
    }

    return <App/>
}

createRoot(document.getElementById('root')!).render(
    <BrowserRouter>
        <UIProvider>
            <AuthProvider>
                <ViewCountProvider>
                    <AppWrapper/>
                </ViewCountProvider>
            </AuthProvider>
        </UIProvider>
    </BrowserRouter>,
)
