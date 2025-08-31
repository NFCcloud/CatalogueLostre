// Menu management class

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
        .order('subcategory')
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
      
      // Create category header
      const categoryHeader = document.createElement('h2');
      categoryHeader.className = 'text-2xl font-bold text-gray-800 mb-6 border-b pb-2';
      categoryHeader.textContent = this.formatCategoryName(category);
      categorySection.appendChild(categoryHeader);

      if (category === 'coffee_menu') {
        // Group coffee menu items by subcategory
        const subcategories = [...new Set(categoryItems.map(item => item.subcategory))];
        
        subcategories.forEach(subcategory => {
          if (!subcategory) return; // Skip items without subcategory
          
          const subcategoryItems = categoryItems.filter(item => item.subcategory === subcategory);
          
          // Create subcategory section
          const subcategoryDiv = document.createElement('div');
          subcategoryDiv.className = 'mb-6';
          
          // Add subcategory header
          const subcategoryHeader = document.createElement('h3');
          subcategoryHeader.className = 'text-xl font-semibold text-gray-700 mb-4 ml-4 capitalize';
          subcategoryHeader.textContent = this.formatCategoryName(subcategory);
          subcategoryDiv.appendChild(subcategoryHeader);
          
          // Add items grid
          const itemsGrid = document.createElement('div');
          itemsGrid.className = 'grid gap-4 ml-4';
          
          subcategoryItems.forEach(item => {
            const itemDiv = this.createItemElement(item);
            itemsGrid.appendChild(itemDiv);
          });
          
          subcategoryDiv.appendChild(itemsGrid);
          categorySection.appendChild(subcategoryDiv);
        });
      } else {
        // Regular category without subcategories
        const itemsGrid = document.createElement('div');
        itemsGrid.className = 'grid gap-4';
        
        categoryItems.forEach(item => {
          const itemDiv = this.createItemElement(item);
          itemsGrid.appendChild(itemDiv);
        });
        
        categorySection.appendChild(itemsGrid);
      }

      container.appendChild(categorySection);
    });
  }

  createItemElement(item) {
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
    return itemDiv;
  }

  formatCategoryName(category) {
    if (!category) return '';
    // Convert snake_case to Title Case
    return category
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  }

  showEmptyState() {
    const container = document.getElementById('menuContainer');
    container.innerHTML = `
      <div class="text-center py-12">
        <p class="text-gray-500">No menu items available.</p>
      </div>
    `;
  }

  hideLoading() {
    const loader = document.getElementById('menuLoader');
    if (loader) {
      loader.style.display = 'none';
    }
  }

  showError() {
    const container = document.getElementById('menuContainer');
    container.innerHTML = `
      <div class="text-center py-12">
        <p class="text-red-500">Error loading menu items. Please try again later.</p>
      </div>
    `;
  }
}

// Initialize the menu manager when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new MenuManager();
});
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
    return itemDiv;
  }

  formatCategoryName(category) {
    // Convert snake_case to Title Case
    return category
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  }

  showEmptyState() {;
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
        .order('subcategory')
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
      
      // Create category header
      const categoryHeader = document.createElement('h2');
      categoryHeader.className = 'text-2xl font-bold text-gray-800 mb-6 border-b pb-2';
      categoryHeader.textContent = this.formatCategoryName(category);
      categorySection.appendChild(categoryHeader);

      if (category === 'coffee_menu') {
        // Group coffee menu items by subcategory
        const subcategories = [...new Set(categoryItems.map(item => item.subcategory))];
        
        subcategories.forEach(subcategory => {
          const subcategoryItems = categoryItems.filter(item => item.subcategory === subcategory);
          
          // Create subcategory section
          const subcategoryDiv = document.createElement('div');
          subcategoryDiv.className = 'mb-6';
          
          // Add subcategory header
          const subcategoryHeader = document.createElement('h3');
          subcategoryHeader.className = 'text-xl font-semibold text-gray-700 mb-4 capitalize';
          subcategoryHeader.textContent = this.formatCategoryName(subcategory);
          subcategoryDiv.appendChild(subcategoryHeader);
          
          // Add items grid
          const itemsGrid = document.createElement('div');
          itemsGrid.className = 'grid gap-4';
          
          subcategoryItems.forEach(item => {
            const itemDiv = this.createItemElement(item);
            itemsGrid.appendChild(itemDiv);
          });
          
          subcategoryDiv.appendChild(itemsGrid);
          categorySection.appendChild(subcategoryDiv);
        });
      } else {
        // Regular category without subcategories
        const itemsGrid = document.createElement('div');
        itemsGrid.className = 'grid gap-4';
        
        categoryItems.forEach(item => {
          const itemDiv = this.createItemElement(item);
          itemsGrid.appendChild(itemDiv);
        });
        
        categorySection.appendChild(itemsGrid);
      }

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
