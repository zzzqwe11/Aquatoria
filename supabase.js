const SUPABASE_URL = "https://pcokuewjoqvlcaffxbkl.supabase.co";
const SUPABASE_KEY = "sb_publishable_5LDnrOUGjLov4y7Q8w6T6A_un7Tdo5p";

window.supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);