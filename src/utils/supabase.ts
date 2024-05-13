/* eslint-disable import/no-extraneous-dependencies */
import { createClient } from '@supabase/supabase-js';

console.log('dodd', import.meta.env.VITE_APP_SUPABASE_URL);

const supabaseUrl: string = import.meta.env.VITE_APP_SUPABASE_URL ?? '';
console.log('🚀 ~ supabaseUrl:', supabaseUrl);
const supabaseKey: string = import.meta.env.VITE_APP_SUPABASE_KEY ?? '';

// eslint-disable-next-line import/prefer-default-export
export const supabase = createClient(supabaseUrl, supabaseKey);
