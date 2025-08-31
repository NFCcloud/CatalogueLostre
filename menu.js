
import { db } from './firebase-config.js';
import {
	collection,
	getDocs,
	query,
	where,
	orderBy,
	onSnapshot
} from 'https://www.gstatic.com/firebasejs/10.3.1/firebase-firestore.js';

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
		const menuRef = collection(db, 'menuItems');
		const q = query(
			menuRef,
			where('isActive', '==', true),
			orderBy('category'),
			orderBy('sortOrder')
		);

		const snapshot = await getDocs(q);
		this.menuItems = snapshot.docs.map(doc => ({
			id: doc.id,
			...doc.data()
		}));

		this.renderMenu();
	}

	setupRealTimeUpdates() {
		const menuRef = collection(db, 'menuItems');
		const q = query(
			menuRef,
			where('isActive', '==', true),
			orderBy('category'),
			orderBy('sortOrder')
		);

		onSnapshot(q, (snapshot) => {
			this.menuItems = snapshot.docs.map(doc => ({
				id: doc.id,
				...doc.data()
			}));
			this.renderMenu();
		}, (error) => {
			console.error('Real-time update error:', error);
		});
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
			categorySection.className = 'bg-white mb-4 rounded-lg shadow-sm';
			categorySection.innerHTML = `
				<div class="px-4 py-3 border-b border-gray-200 bg-gray-50 rounded-t-lg">
					<h2 class="text-lg font-bold text-gray-800">${category}</h2>
				</div>
			`;

			categoryItems.forEach((item, index) => {
				const itemDiv = document.createElement('div');
				itemDiv.className = `p-4 ${index < categoryItems.length - 1 ? 'border-b border-gray-100' : ''}`;
				itemDiv.innerHTML = `
					<div class="flex gap-3">
						<div class="flex-1">
							<h3 class="font-semibold text-gray-800 mb-1">${item.name}</h3>
							<p class="text-sm text-gray-600 mb-2 leading-relaxed">${item.description}</p>
							<p class="text-lg font-bold text-blue-600">€${parseFloat(item.price).toFixed(2)}</p>
						</div>
						<div class="flex-shrink-0">
							<img
								src="${item.imageUrl || 'https://images.unsplash.com/photo-1546039907-7fa05f864c02?w=400&h=300&fit=crop'}"
								alt="${item.name}"
								class="w-20 h-16 object-cover rounded-lg"
								loading="lazy"
							/>
						</div>
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
