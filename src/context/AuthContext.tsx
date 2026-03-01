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

type TimeoutId = ReturnType<typeof setTimeout>;

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({children}: { children: ReactNode }) {
    const [session, setSession] = useState<Session | null>(null)
    const [user, setUser] = useState<User | null>(null)
    const [profile, setProfile] = useState<Profile | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        let mounted = true
        let loadingTimeout: TimeoutId | null = null

        // Safety timeout - ensure the loading state clears even if something fails
        loadingTimeout = setTimeout(() => {
            if (mounted && loading) {
                console.warn("Auth loading timeout - forcing loading to false")
                setLoading(false)
            }
        }, 10000) // 10-second timeout

        const fetchSession = async () => {
            try {
                const {data, error} = await supabase.auth.getSession()

                if (error) {
                    console.error("Session fetch error:", error)
                    // Clear a potentially corrupted auth state
                    await supabase.auth.signOut()
                    throw error
                }

                if (!mounted) return

                setSession(data.session)
                setUser(data.session?.user ?? null)

                // Fetch a profile if the user exists
                if (data.session?.user) {
                    try {
                        const userProfile = await getProfile(data.session.user.id)
                        if (mounted) {
                            setProfile(userProfile)
                        }
                    } catch (error) {
                        console.error("Error fetching profile:", error)

                        // If a profile doesn't exist (OAuth user), create it
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
                // Even on error, clear session and profile
                if (mounted) {
                    setSession(null)
                    setUser(null)
                    setProfile(null)
                }
            } finally {
                if (mounted) {
                    setLoading(false)
                    if (loadingTimeout) {
                        clearTimeout(loadingTimeout)
                    }
                }
            }
        }

        void fetchSession()

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
                        setLoading(false)
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
                                setLoading(false)
                            }
                        } catch (createError) {
                            console.error("Error creating profile:", createError)
                            if (mounted) {
                                setProfile(null)
                                setLoading(false)
                            }
                        }
                    } else {
                        if (mounted) {
                            setProfile(null)
                            setLoading(false)
                        }
                    }
                }
            } else {
                if (mounted) {
                    setProfile(null)
                    setLoading(false)
                }
            }
        })

        return () => {
            mounted = false
            if (loadingTimeout) {
                clearTimeout(loadingTimeout)
            }
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
