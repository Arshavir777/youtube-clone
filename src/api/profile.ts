import { supabase } from "../lib/supabase"

export const getProfile = async (userId: string) => {
    const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single()
    if (error) throw error
    return data
}

export const updateProfile = async (userId: string, payload: any) => {
    const { data, error } = await supabase
        .from("profiles")
        .update(payload)
        .eq("id", userId)
        .select()
    if (error) throw error
    return data?.[0]
}