const supabaseUrl = 'https://wwoejvzxdcrhxhdjeqqc.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind3b2Vqdnp4ZGNyaHhoZGplcXFjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY2NTYzNzQsImV4cCI6MjA3MjIzMjM3NH0.xoKLN1_AyP-KG_x977PTiuumYlLtkk5-FM3LGaWhzdk';

// Initialize the Supabase client globally
window.supabaseClient = supabase.createClient(supabaseUrl, supabaseKey);

// Helper function for file upload
export async function uploadFile(file, bucket = 'menu-images') {
  try {
    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      throw new Error('Μη έγκυρος τύπος αρχείου. Επιτρέπονται μόνο JPG, PNG και WebP.');
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      throw new Error('Το μέγεθος της εικόνας πρέπει να είναι μικρότερο από 5MB.');
    }

    // Generate safe filename
    const timestamp = Date.now();
    const fileExt = file.name.split('.').pop().toLowerCase();
    const fileName = `menu-images/${timestamp}_${Math.random().toString(36).substring(7)}.${fileExt}`;

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
    throw error;
  }
}
