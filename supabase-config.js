const SUPABASE_URL = 'https://wwoejvzxdcrhxhdjeqqc.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind3b2Vqdnp4ZGNyaHhoZGplcXFjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY2NTYzNzQsImV4cCI6MjA3MjIzMjM3NH0.xoKLN1_AyP-KG_x977PTiuumYlLtkk5-FM3LGaWhzdk';

// Create a single instance of the Supabase client
export const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

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
    // Validate file type and size
    if (!file.type.startsWith('image/')) {
      const error = new Error('Μη έγκυρος τύπος αρχείου. Παρακαλώ επιλέξτε ένα αρχείο εικόνας.');
      error.userMessage = error.message;
      throw error;
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      const error = new Error('Το μέγεθος της εικόνας πρέπει να είναι μικρότερο από 5MB');
      error.userMessage = error.message;
      throw error;
    }

    // First check if bucket exists
    const { data: buckets, error: bucketError } = await supabase
      .storage
      .listBuckets();

    if (bucketError) throw bucketError;

    const bucketExists = buckets.some(b => b.name === bucket);
    if (!bucketExists) {
      throw new Error('Storage bucket not found. Please ensure the bucket is created in Supabase dashboard.');
    }

    // Prepare file for upload
    const timestamp = Date.now();
    const fileExt = file.name.split('.').pop();
    const fileName = `${timestamp}_${Math.random().toString(36).substring(7)}.${fileExt}`;
    
    // Upload file
    const { data, error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: true,
        contentType: file.type
      });
    
    if (uploadError) throw uploadError;
    
    // Get public URL
    const { data: { publicUrl }, error: urlError } = supabase.storage
      .from(bucket)
      .getPublicUrl(fileName);
    
    if (urlError) throw urlError;
    
    return publicUrl;
  } catch (error) {
    console.error('Error uploading file:', error);
    if (error.message.includes('bucket not found')) {
      error.userMessage = 'Ο χώρος αποθήκευσης δεν έχει ρυθμιστεί σωστά. Παρακαλώ επικοινωνήστε με τον διαχειριστή.';
    } else {
      error.userMessage = 'Σφάλμα κατά το ανέβασμα του αρχείου. Παρακαλώ δοκιμάστε ξανά.';
    }
    throw error;
  }
}
