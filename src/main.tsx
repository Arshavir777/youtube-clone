import {createRoot} from 'react-dom/client'
import {BrowserRouter} from "react-router-dom"
import {AuthProvider} from "./context/AuthContext.tsx";
import {UIProvider} from "./context/UIContext.tsx";
import {ViewCountProvider} from "./context/ViewCountContext.tsx";
import App from './App.tsx'
import './index.css'

createRoot(document.getElementById('root')!).render(
    <BrowserRouter>
        <UIProvider>
            <AuthProvider>
                <ViewCountProvider>
                    <App/>
                </ViewCountProvider>
            </AuthProvider>
        </UIProvider>
    </BrowserRouter>,
)
