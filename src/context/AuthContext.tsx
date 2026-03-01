import {
    createContext,
    type ReactNode,
    useEffect,
    useState,
} from "react"
import {supabase} from "../lib/supabase"
import type {Session, User} from "@supabase/supabase-js"
import type {Profile} from "../types"
import {getProfile} from "../api/profile"
import {createUserProfileAndChannel} from "../api/auth"

interface AuthContextType {
    user: User | null
    profile: Profile | null
    session: Session | null
    loading: boolean
    signOut: () => Promise<void>
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({children}: { children: ReactNode }) {
    const [session, setSession] = useState<Session | null>(null)
    const [user, setUser] = useState<User | null>(null)
    const [profile, setProfile] = useState<Profile | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        let mounted = true

        const fetchSession = async () => {
            try {
                const {data} = await supabase.auth.getSession()

                if (!mounted) return

                setSession(data.session)
                setUser(data.session?.user ?? null)

                // Fetch profile if user exists
                if (data.session?.user) {
                    try {
                        const userProfile = await getProfile(data.session.user.id)
                        if (mounted) {
                            setProfile(userProfile)
                        }
                    } catch (error) {
                        console.error("Error fetching profile:", error)

                        // If profile doesn't exist (OAuth user), create it
                        if (data.session.user.email) {
                            try {
                                await createUserProfileAndChannel(data.session.user.id, data.session.user.email)
                                const newProfile = await getProfile(data.session.user.id)
                                if (mounted) {
                                    setProfile(newProfile)
                                }
                            } catch (createError) {
                                console.error("Error creating profile:", createError)
                                if (mounted) {
                                    setProfile(null)
                                }
                            }
                        } else {
                            if (mounted) {
                                setProfile(null)
                            }
                        }
                    }
                } else {
                    if (mounted) {
                        setProfile(null)
                    }
                }
            } catch (error) {
                console.error("Error fetching session:", error)
            } finally {
                if (mounted) {
                    setLoading(false)
                }
            }
        }

        fetchSession()

        const {
            data: {subscription},
        } = supabase.auth.onAuthStateChange(async (_event, session) => {
            if (!mounted) return

            setSession(session)
            setUser(session?.user ?? null)

            // Fetch profile when auth state changes
            if (session?.user) {
                try {
                    const userProfile = await getProfile(session.user.id)
                    if (mounted) {
                        setProfile(userProfile)
                    }
                } catch (error) {
                    console.error("Error fetching profile:", error)

                    // If profile doesn't exist (OAuth user), create it
                    if (session.user.email) {
                        try {
                            await createUserProfileAndChannel(session.user.id, session.user.email)
                            const newProfile = await getProfile(session.user.id)
                            if (mounted) {
                                setProfile(newProfile)
                            }
                        } catch (createError) {
                            console.error("Error creating profile:", createError)
                            if (mounted) {
                                setProfile(null)
                            }
                        }
                    } else {
                        if (mounted) {
                            setProfile(null)
                        }
                    }
                }
            } else {
                if (mounted) {
                    setProfile(null)
                }
            }
        })

        return () => {
            mounted = false
            subscription.unsubscribe()
        }
    }, [])

    const signOut = async () => {
        await supabase.auth.signOut()
        setProfile(null)
    }

    return (
        <AuthContext.Provider value={{user, profile, session, loading, signOut}}>
            {children}
        </AuthContext.Provider>
    )
}
