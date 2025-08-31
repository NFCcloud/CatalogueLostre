
// Import Firebase services
import { db, storage } from './firebase-config.js';

	const form = document.getElementById('addFoodForm');
	const menuItemsList = document.getElementById('menuItemsList');
	const notification = document.getElementById('notification');
	let editingId = null;

	function showNotification(message, type = 'success') {
		const notificationEl = document.getElementById('notification');
		const messageEl = document.getElementById('notificationMessage');
		
		// Set message
		messageEl.textContent = message;
		
		// Update colors based on type
		const notificationBox = notificationEl.querySelector('div');
		if (type === 'success') {
			notificationBox.className = 'bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded shadow-lg flex items-center';
		} else {
			notificationBox.className = 'bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded shadow-lg flex items-center';
		}

		// Show notification
		notificationEl.classList.remove('translate-x-full');
		
		// Hide after 3 seconds
		setTimeout(() => {
			notificationEl.classList.add('translate-x-full');
		}, 3000);
	}

	function showErrorNotification(message) {
		showNotification(message, 'error');
	}

	form.addEventListener('submit', async (e) => {
		e.preventDefault();
		const name = document.getElementById('foodName').value.trim();
		const description = document.getElementById('foodDescription').value.trim();
		const price = parseFloat(document.getElementById('foodPrice').value);
		const category = document.getElementById('foodCategory').value.trim();
		const imageFile = document.getElementById('foodImage').files[0];
		if (!name || !description || !category || isNaN(price) || (!imageFile && !editingId)) return;

		try {
			let imageUrl = null;
			if (imageFile) {
				try {
					const timestamp = Date.now();
					const fileName = `menu-images/${timestamp}_${imageFile.name.replace(/[^a-zA-Z0-9.]/g, '_')}`;
					const imageRef = storage.ref(fileName);
					
					const metadata = {
						contentType: imageFile.type
					};
					
					await imageRef.put(imageFile, metadata);
					imageUrl = await imageRef.getDownloadURL();
				} catch (uploadError) {
					console.error('Upload error:', uploadError);
					showErrorNotification('Σφάλμα κατά το ανέβασμα της εικόνας. Παρακαλώ δοκιμάστε ξανά.');
					throw uploadError;
				}
			}

			if (editingId) {
				const updateData = {
					name,
					description,
					price,
					category,
					updatedAt: serverTimestamp()
				};
				if (imageUrl) updateData.imageUrl = imageUrl;
				await updateDoc(doc(db, 'menuItems', editingId), updateData);
				editingId = null;
				showNotification('Το πιάτο ενημερώθηκε επιτυχώς! 👍');
			} else {
				await addDoc(collection(db, 'menuItems'), {
					name,
					description,
					price,
					category,
					imageUrl,
					isActive: true,
					sortOrder: Date.now(),
					createdAt: serverTimestamp(),
					updatedAt: serverTimestamp()
				});
				showNotification('Το πιάτο προστέθηκε επιτυχώς! ✨');
			}
			form.reset();
			form.removeAttribute('data-edit-id');
		} catch (error) {
			alert('Σφάλμα κατά την αποθήκευση: ' + error.message);
		}
	});

	function renderMenuItems(items) {
		menuItemsList.innerHTML = '';
		if (!items.length) {
			menuItemsList.innerHTML = '<div class="text-center text-gray-500">Δεν υπάρχουν πιάτα στο μενού.</div>';
			return;
		}
		items.forEach(item => {
			const div = document.createElement('div');
			div.className = 'flex items-center bg-white rounded-lg shadow mb-4 p-4';
			div.innerHTML = `
				<img src="${item.imageUrl}" alt="${item.name}" class="w-20 h-16 object-cover rounded mr-4" />
				<div class="flex-1">
					<div class="font-bold text-lg">${item.name}</div>
					<div class="text-gray-600 text-sm mb-1">${item.description}</div>
					<div class="font-semibold">${item.price.toFixed(2)}€</div>
					<div class="text-xs text-gray-400">${item.category}</div>
				</div>
				<button class="ml-2 text-blue-600 hover:underline" data-edit="${item.id}">Επεξεργασία</button>
				<button class="ml-2 text-red-600 hover:underline" data-delete="${item.id}">Διαγραφή</button>
			`;
			menuItemsList.appendChild(div);
		});

		menuItemsList.querySelectorAll('[data-delete]').forEach(btn => {
			btn.addEventListener('click', async (e) => {
				const id = btn.getAttribute('data-delete');
				if (confirm('Διαγραφή πιάτου;')) {
					try {
						await deleteDoc(doc(db, 'menuItems', id));
					} catch (err) {
						showErrorNotification('Σφάλμα διαγραφής: ' + err.message);
					}
				}
			});
		});

		menuItemsList.querySelectorAll('[data-edit]').forEach(btn => {
			btn.addEventListener('click', async (e) => {
				const id = btn.getAttribute('data-edit');
				const item = items.find(i => i.id === id);
				if (!item) return;
				document.getElementById('foodName').value = item.name;
				document.getElementById('foodDescription').value = item.description;
				document.getElementById('foodPrice').value = item.price;
				document.getElementById('foodCategory').value = item.category;
				editingId = id;
				form.setAttribute('data-edit-id', id);
				window.scrollTo({ top: 0, behavior: 'smooth' });
			});
		});
	}

	const q = query(collection(db, 'menuItems'), orderBy('sortOrder'));
	onSnapshot(q, (snapshot) => {
		const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
		renderMenuItems(items);
	});
