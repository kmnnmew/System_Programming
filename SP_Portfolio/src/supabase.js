import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://izdhrcrrsaapbnclzcsp.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml6ZGhyY3Jyc2FhcGJuY2x6Y3NwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ1NzU0MzAsImV4cCI6MjA5MDE1MTQzMH0.yi1XfEkk5CXmtVhJ2sPDsIwLw-N4rfycNOr9kw1Xksc'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
