import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

// Create a single supabase client for interacting with your database
const supabaseUrl = 'https://wwoejvzxdcrhxhdjeqqc.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind3b2Vqdnp4ZGNyaHhoZGplcXFjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY2NTYzNzQsImV4cCI6MjA3MjIzMjM3NH0.xoKLN1_AyP-KG_x977PTiuumYlLtkk5-FM3LGaWhzdk'

export const supabase = createClient(supabaseUrl, supabaseKey)

// Test database connection
async function testConnection() {
  const { data, error } = await supabase
    .from('menu_items')
    .select('count(*)')
  
  if (error) {
    console.error('Database connection error:', error)
    return false
  }
  console.log('Database connected successfully')
  return true
}

// Helper function for file upload
export async function uploadFile(file, bucket = 'menu-images') {
  try {
    const timestamp = Date.now()
    const fileName = `${timestamp}_${file.name.replace(/[^a-zA-Z0-9.]/g, '_')}`
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      })
    
    if (error) throw error
    
    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(fileName)
    
    return publicUrl
  } catch (error) {
    console.error('Error uploading file:', error)
    throw error
  }
}
