
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://orgemkxezkgnewfpzrpc.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_XNP2nFzHLhc7PUFihsrwyg_yo1XPh61';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
