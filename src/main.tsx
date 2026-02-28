import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import {BrowserRouter} from "react-router-dom"
import {AuthProvider} from "./context/AuthContext.tsx";
import {UIProvider} from "./context/UIContext.tsx";
import App from './App.tsx'
import './index.css'

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <BrowserRouter>
            <UIProvider>
                <AuthProvider>
                    <App/>
                </AuthProvider>
            </UIProvider>
        </BrowserRouter>
    </StrictMode>,
)
