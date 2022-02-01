import { createClient } from '@supabase/supabase-js';

const SECRET_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseURL = process.env.NEXT_PUBLIC_SUPABASE_URL;

export const supabaseClient = createClient(supabaseURL, SECRET_KEY);

