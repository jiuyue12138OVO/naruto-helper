import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://hlzlzoqelekodeovflqv.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhsemx6b3FlbGVrb2Rlb3ZmbHF2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ3OTEyNTIsImV4cCI6MjEwMDM2NzI1Mn0.J3IX34RuU2XcgvdXyxqPw2VxeQQhWWlNE6CmPByRwV4'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)