import { createClient } from "@supabase/supabase-js";

const supabaseUrl = 'https://zspqatmuzpthezzivgkk.supabase.co';
const supabaseKey = 'sb_publishable_1pVWsEhJ26VviLiHfuLTbA_7QscMw0A';

export const supabase = createClient(
  supabaseUrl,
  supabaseKey
);