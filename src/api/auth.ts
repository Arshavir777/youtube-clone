import {supabase} from "../lib/supabase.ts";

export const signIn = (email: string, password: string) => {
    return supabase.auth.signInWithPassword({
        email,
        password,
    })
}

export const signInWithGoogle = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
            redirectTo: `${window.location.origin}/`,
            queryParams: {
                access_type: 'offline',
                prompt: 'consent',
            }
        }
    })

    if (error) throw error
    return data
}

export const signUp = async (username: string, email: string, password: string): Promise<{
    error: string
} | undefined> => {
    // Sign Up
    const {error: signUpError, data: newUser} = await supabase.auth.signUp({
        email,
        password,
    })

    if (signUpError) {
        return {error: signUpError.message}
    }

    const {user} = newUser
    if (!user) return {error: 'Something went wrong'}

    // Create Profile
    const {error: createProfileError} = await supabase.from('profiles').insert({
        username,
        id: user.id
    })

    if (createProfileError) {
        return {error: createProfileError.message}
    }

    // Create Channel
    const {error: createChannelError} = await supabase.from('channels').insert({
        owner_id: user.id,
        name: username,
    })

    if (createChannelError) {
        return {error: createChannelError.message}
    }
}

export const createUserProfileAndChannel = async (userId: string, email: string) => {
    // Check if a profile already exists
    const {data: existingProfile} = await supabase
        .from('profiles')
        .select('id')
        .eq('id', userId)
        .single()

    if (existingProfile) {
        return // Profile already exists
    }

    // Generate username from email
    const username = email.split('@')[0]

    // Create Profile
    const {error: createProfileError} = await supabase.from('profiles').insert({
        username,
        id: userId
    })

    if (createProfileError) {
        console.error('Error creating profile:', createProfileError)
        throw createProfileError
    }

    // Create Channel
    const {error: createChannelError} = await supabase.from('channels').insert({
        owner_id: userId,
        name: username,
    })

    if (createChannelError) {
        console.error('Error creating channel:', createChannelError)
        throw createChannelError
    }
}
