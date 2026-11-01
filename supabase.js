const SUPABASE_URL = "https://pcokuewjoqvlcaffxbkl.supabase.co";
const SUPABASE_KEY = "sb_publishable_5LDnrOUGjLov4y7Q8w6T6A_un7T7do5p"; // ВНИМАНИЕ: проверь ключ, я исправил опечатку

if (!window.supabaseClient) {
    window.supabaseClient = window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_KEY,
        {
            auth: {
                persistSession: true,
                autoRefreshToken: true,
                detectSessionInUrl: true
            }
        }
    );
}
