
class MenuManager {
	constructor() {
		this.menuItems = [];
		this.selectedCategory = null;
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
			const { data, error } = await window.supabase
				.from('menu_items')
				.select('*')
				.eq('is_active', true)
				.order('category')
				.order('sort_order');

			if (error) {
				console.error('Error loading menu items:', error);
				throw error;
			}

			this.menuItems = data;
			this.renderMainCategories();
			if (this.selectedCategory) {
				this.renderMenuItems(this.selectedCategory);
			}
		} catch (error) {
			console.error('Error in loadMenuItems:', error);
			this.showError();
		}
	}

	setupRealTimeUpdates() {
		const channel = window.supabase
			.channel('menu_changes')
			.on('postgres_changes', 
				{
					event: '*',
					schema: 'public',
					table: 'menu_items'
				},
				(payload) => {
					this.loadMenuItems(); // Reload all items when any change occurs
				}
			)
			.subscribe();
	}

	renderMainCategories() {
		const container = document.getElementById('main-categories');
		container.innerHTML = '';

		// Get unique main categories
		const mainCategories = ['Food Menu', 'Coffee Menu'];

		mainCategories.forEach(category => {
			const button = document.createElement('button');
			button.className = `w-full px-4 py-2 text-left rounded-lg ${
				this.selectedCategory === category 
					? 'bg-blue-500 text-white' 
					: 'bg-white text-gray-800 hover:bg-gray-50'
			}`;
			button.textContent = category;
			button.addEventListener('click', () => this.selectCategory(category));
			container.appendChild(button);
		});
	}

	selectCategory(category) {
		this.selectedCategory = category;
		this.renderMainCategories(); // Update the selected state
		this.renderMenuItems(category);
	}

	renderMenuItems(category) {
		const container = document.getElementById('menu-items');
		container.innerHTML = '';

		const categoryItems = this.menuItems.filter(item => 
			category === 'Food Menu' 
				? item.category !== 'Drinks' && item.category !== 'Coffee'
				: ['Drinks', 'Coffee'].includes(item.category)
		);

		if (categoryItems.length === 0) {
			this.showEmptyState();
			return;
		}

		// Group items by subcategory
		const subcategories = [...new Set(categoryItems.map(item => item.subcategory || 'General'))];

		subcategories.forEach(subcategory => {
			const subcategoryItems = categoryItems.filter(item => (item.subcategory || 'General') === subcategory);

			const categorySection = document.createElement('div');
			categorySection.className = 'bg-white mb-4 rounded-lg shadow-sm';
			categorySection.innerHTML = `
				<div class="px-4 py-3 border-b border-gray-200 bg-gray-50 rounded-t-lg">
					<h2 class="text-lg font-bold text-gray-800">${subcategory}</h2>
				</div>
			`;

			subcategoryItems.forEach((item, index) => {
				const itemDiv = document.createElement('div');
				itemDiv.className = `p-4 ${index < subcategoryItems.length - 1 ? 'border-b border-gray-100' : ''}`;
				itemDiv.innerHTML = `
					<div class="flex gap-3">
						<div class="flex-1">
							<h3 class="font-semibold text-gray-800 mb-1">${item.name}</h3>
							<p class="text-sm text-gray-600 mb-2 leading-relaxed">${item.description || ''}</p>
							<p class="text-lg font-bold text-blue-600">€${parseFloat(item.price).toFixed(2)}</p>
						</div>
						${item.imageUrl ? `
						<div class="flex-shrink-0">
							<img
								src="${item.imageUrl}"
								alt="${item.name}"
								class="w-20 h-16 object-cover rounded-lg"
								loading="lazy"
							/>
						</div>
						` : ''}
					</div>
				`;
				categorySection.appendChild(itemDiv);
			});

			container.appendChild(categorySection);
		});
	}

	showEmptyState() {
		const container = document.getElementById('menu-items');
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
		document.getElementById('menu-content').classList.remove('hidden');
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
