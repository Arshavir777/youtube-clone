import type {Tables} from "./database.types.ts";

export type Video = Tables<'videos'> & { channels?: Channel }
export type Profile = Tables<'profiles'>
export type Channel = Tables<'channels'>
