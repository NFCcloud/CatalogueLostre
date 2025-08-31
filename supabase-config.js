import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

// Create a single supabase client for interacting with your database
const supabaseUrl = 'https://[YOUR-PROJECT-ID].supabase.co'  // Replace with your URL
const supabaseKey = '[YOUR-ANON-KEY]'  // Replace with your anon key

export const supabase = createClient(supabaseUrl, supabaseKey)

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
