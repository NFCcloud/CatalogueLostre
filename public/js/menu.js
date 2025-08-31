// No import! Use window.supabase directly

class MenuManager {
	constructor() {
		this.menuItems = [];
		this.mainCategories = ['food_menu', 'coffee_menu'];
		this.activeMainCategory = 'food_menu';
		this.activeSubCategory = null;
		this.init();
	}

	async init() {
		try {
			await this.loadMenuItems();
			this.renderMainCategories();
			this.renderSubCategories();
			this.renderMenuItems();
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
				.order('sort_order');

			if (error) {
				console.error('Error loading menu items:', error);
				throw error;
			}
			this.menuItems = data;
		} catch (error) {
			console.error('Error in loadMenuItems:', error);
			this.showError();
		}
	}

	renderMainCategories() {
		const container = document.getElementById('main-categories');
		container.innerHTML = '';
		this.mainCategories.forEach(category => {
			const button = document.createElement('button');
			button.textContent = category === 'food_menu' ? 'Food Menu' : 'Coffee Menu';
			button.className = `px-4 py-2 rounded-lg font-semibold transition-colors ${
				this.activeMainCategory === category
					? 'bg-blue-600 text-white'
					: 'bg-gray-200 text-gray-700 hover:bg-gray-300'
			}`;
			button.onclick = () => {
				this.activeMainCategory = category;
				this.activeSubCategory = null;
				this.renderMainCategories();
				this.renderSubCategories();
				this.renderMenuItems();
			};
			container.appendChild(button);
		});
	}

	renderSubCategories() {
		const container = document.getElementById('sub-categories');
		container.innerHTML = '';
		const subcategories = [...new Set(
			this.menuItems
				.filter(item => item.category === this.activeMainCategory && item.subcategory)
				.map(item => item.subcategory)
		)];

		subcategories.forEach(subcategory => {
			const a = document.createElement('a');
			a.href = '#';
			a.textContent = subcategory.replace(/_/g, ' ');
			a.className = `block px-4 py-2 rounded-md capitalize transition-colors ${
				this.activeSubCategory === subcategory
					? 'bg-blue-100 text-blue-700'
					: 'text-gray-600 hover:bg-gray-100'
			}`;
			a.onclick = (e) => {
				e.preventDefault();
				this.activeSubCategory = subcategory;
				this.renderSubCategories();
				this.renderMenuItems();
			};
			container.appendChild(a);
		});
	}

	renderMenuItems() {
		const container = document.getElementById('menu-items');
		container.innerHTML = '';
		const itemsToRender = this.menuItems.filter(item =>
			item.category === this.activeMainCategory &&
			(!this.activeSubCategory || item.subcategory === this.activeSubCategory)
		);

		if (itemsToRender.length === 0) {
			this.showEmptyState(container);
			return;
		}

		const subcategories = [...new Set(itemsToRender.map(item => item.subcategory))];

		subcategories.forEach(subcategory => {
			const section = document.createElement('div');
			section.className = 'mb-8';
			const title = document.createElement('h2');
			title.textContent = subcategory.replace(/_/g, ' ');
			title.className = 'text-2xl font-bold text-gray-800 mb-4 capitalize';
			section.appendChild(title);

			const grid = document.createElement('div');
			grid.className = 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6';
			section.appendChild(grid);

			itemsToRender
				.filter(item => item.subcategory === subcategory)
				.forEach(item => {
					const itemDiv = document.createElement('div');
					itemDiv.className = 'bg-white rounded-lg shadow-md overflow-hidden flex flex-col';
					itemDiv.innerHTML = `
						<img src="${item.image_url || 'https://images.unsplash.com/photo-1546039907-7fa05f864c02?w=400&h=300&fit=crop'}" alt="${item.name}" class="w-full h-48 object-cover">
						<div class="p-4 flex-grow">
							<h3 class="font-bold text-lg text-gray-800">${item.name}</h3>
							<p class="text-sm text-gray-600 mt-1">${item.description || ''}</p>
						</div>
						<div class="p-4 flex justify-between items-center border-t border-gray-200">
							<span class="font-bold text-lg text-blue-600">€${parseFloat(item.price).toFixed(2)}</span>
							<button class="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-blue-600 transition-colors">
								<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
									<path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd" />
								</svg>
							</button>
						</div>
					`;
					grid.appendChild(itemDiv);
				});
			container.appendChild(section);
		});
	}

	setupRealTimeUpdates() {
		window.supabase
			.channel('menu_changes')
			.on('postgres_changes', { event: '*', schema: 'public', table: 'menu_items' },
				(payload) => {
					this.loadMenuItems().then(() => {
						this.renderSubCategories();
						this.renderMenuItems();
					});
				}
			)
			.subscribe();
	}

	showEmptyState(container) {
		container.innerHTML = `
			<div class="bg-white rounded-lg shadow-sm p-8 text-center">
				<div class="text-4xl mb-4">🍽️</div>
				<h3 class="text-lg font-medium text-gray-800 mb-2">No items found</h3>
				<p class="text-gray-600">Please select another category.</p>
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
