import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://dgvaiejyixwxallybbcl.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRndmFpZWp5aXh3eGFsbHliYmNsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA0MzIxNjcsImV4cCI6MjA4NjAwODE2N30.5vUiSmvriYugVcqgV5fEnV42ILEz8mGRIq_DmQGONe4';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);