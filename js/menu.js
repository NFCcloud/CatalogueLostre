const supabase = window.supabaseClient;

class MenuManager {
  constructor() {
    this.menuItems = [];
    this.init();
  }

  async init() {
    try {
      await this.loadMenuItems();
      this.setupRealTimeUpdates();
      this.hideLoading();
    } catch (error) {
      console.error('Error initializing menu:', error);
      this.showError();
    }
  }

  async loadMenuItems() {
    try {
      const { data: items, error } = await supabase
        .from('menu_items')
        .select('*')
        .eq('is_active', true)
        .order('category')
        .order('sort_order');

      if (error) throw error;

      this.menuItems = items || [];
      this.renderMenu();
    } catch (error) {
      console.error('Error loading menu items:', error);
      throw error;
    }
  }

  setupRealTimeUpdates() {
    const subscription = supabase
      .channel('menu_changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'menu_items',
          filter: 'is_active=eq.true'
        }, 
        () => this.loadMenuItems()
      )
      .subscribe();
  }

  renderMenu() {
    const container = document.getElementById('menuContainer');
    container.innerHTML = '';

    if (this.menuItems.length === 0) {
      this.showEmptyState();
      return;
    }

    // Group items by category
    const categories = [...new Set(this.menuItems.map(item => item.category))];

    categories.forEach(category => {
      const categoryItems = this.menuItems.filter(item => item.category === category);

      const categorySection = document.createElement('div');
      categorySection.className = 'mb-8 px-4';
      categorySection.innerHTML = `
        <h2 class="text-2xl font-bold text-gray-800 mb-6 border-b pb-2">
          ${category}
        </h2>
        <div class="grid gap-6">
      `;

      categoryItems.forEach(item => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'bg-white rounded-lg shadow p-4 flex justify-between items-start';
        itemDiv.innerHTML = `
          <div class="flex-1">
            <div class="flex justify-between items-start mb-2">
              <h3 class="font-bold text-gray-800">${item.name}</h3>
              <span class="font-bold text-green-600 ml-4">€${parseFloat(item.price).toFixed(2)}</span>
            </div>
            ${item.description ? `
              <p class="text-sm text-gray-600 mt-1">${item.description}</p>
            ` : ''}
          </div>
        `;
        categorySection.appendChild(itemDiv);
      });

      container.appendChild(categorySection);
    });
  }

  showEmptyState() {
    const container = document.getElementById('menuContainer');
    container.innerHTML = `
      <div class="bg-white rounded-lg shadow-sm p-8 text-center">
        <div class="text-4xl mb-4">🍽️</div>
        <h3 class="text-lg font-medium text-gray-800 mb-2">Το μενού ετοιμάζεται</h3>
        <p class="text-gray-600">Σύντομα θα υπάρχουν διαθέσιμα πιάτα!</p>
      </div>
    `;
  }

  hideLoading() {
    document.getElementById('loading').classList.add('hidden');
    document.getElementById('header').classList.remove('hidden');
    document.getElementById('menuContainer').classList.remove('hidden');
  }

  showError() {
    document.getElementById('loading').classList.add('hidden');
    document.getElementById('errorState').classList.remove('hidden');
  }
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', () => {
  new MenuManager();
});
