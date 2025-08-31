// Temporary menu.js for testing
class MenuManager {
  constructor() {
    this.init();
  }

  async init() {
    try {
      const { data, error } = await window.supabaseClient
        .from('menu_items')
        .select('*')
        .eq('is_active', true);

      if (error) throw error;
      
      console.log('Menu items loaded:', data);
      document.getElementById('loading')?.classList.add('hidden');
      document.getElementById('menuContainer')?.classList.remove('hidden');
      
    } catch (error) {
      console.error('Menu loading error:', error);
      document.getElementById('loading')?.classList.add('hidden');
      document.getElementById('errorState')?.classList.remove('hidden');
    }
  }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  new MenuManager();
});
