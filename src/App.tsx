import {Routes, Route} from "react-router-dom"
import ProtectedRoute from "./components/auth/ProtectedRoute"
import LoginPage from "./features/auth/LoginPage"
import RegisterPage from "./features/auth/RegisterPage"
import MainLayout from "./layouts/MainLayout.tsx";
import WatchPage from "./features/watch/WatchPage.tsx";
import HomePage from "./features/home/HomePage.tsx";
import ChannelPage from "./features/channels/ChannelPage.tsx";
import EditChannelPage from "./features/channels/EditChannelPage.tsx";
import ProfilePage from "./features/profile/ProfilePage.tsx";
import SubscriptionsPage from "./features/subscriptions/SubscriptionsPage.tsx";
import NotFoundPage from "./features/system/NotFoundPage.tsx";

export default function App() {
    return (
        <Routes>

            <Route path="/login" element={<LoginPage/>}/>
            <Route path="/register" element={<RegisterPage/>}/>

            <Route
                element={<MainLayout/>}
            >
                <Route path="/" element={<HomePage/>}/>
                <Route path="/watch/:id" element={<WatchPage/>}/>
                <Route path="/channel/:id" element={<ChannelPage/>}/>
                <Route path="/subscriptions" element={<SubscriptionsPage/>}/>
            </Route>

            <Route
                element={
                    <ProtectedRoute>
                        <MainLayout/>
                    </ProtectedRoute>
                }
            >
                <Route path="/profile" element={<ProfilePage/>}/>
                <Route path="/channel/:id/edit" element={<EditChannelPage/>}/>
            </Route>

            <Route path="*" element={<NotFoundPage/>}/>
        </Routes>
    )
}