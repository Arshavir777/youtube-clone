import {supabase} from "../lib/supabase.ts";

export const signIn = (email: string, password: string) => {
    return supabase.auth.signInWithPassword({
        email,
        password,
    })
}

export const signUp = async (username: string, email: string, password: string): Promise<{
    error: string
} | undefined> => {
    // Sign Up
    const {error: signUpError, data: newUser} = await supabase.auth.signUp({
        email: new Date().getSeconds() + '-' + email,
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
