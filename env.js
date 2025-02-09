module.exports = {
  supabase: {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://vsnfewogxjiukoarykfq.supabase.co',
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
    serviceRole: process.env.SUPABASE_SERVICE_ROLE_KEY || ''
  }
}