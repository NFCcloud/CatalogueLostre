import { supabase, uploadFile } from './supabase-config.js';

let editingId = null;

function showNotification(message, type = 'success') {
  const container = document.getElementById('notificationContainer');
  const notification = document.createElement('div');
  notification.className = `notification transform transition-all duration-300 ${
    type === 'success' ? 'bg-green-100 border-green-500 text-green-700' : 'bg-red-100 border-red-500 text-red-700'
  } border-l-4 p-4 rounded shadow-lg`;
  
  notification.innerHTML = `
    <p class="text-sm">${message}</p>
    <button class="absolute top-2 right-2 text-gray-500 hover:text-gray-700" onclick="this.parentElement.remove()">×</button>
  `;
  
  container.appendChild(notification);
  setTimeout(() => notification.remove(), 5000);
}

async function handleFormSubmit(event) {
  event.preventDefault();
  console.log('Form submission started');
  
  const form = event.target;
  const name = form.name.value.trim();
  const description = form.description.value.trim();
  const price = parseFloat(form.price.value);
  const category = form.category.value.trim();
  const imageFile = form.image.files[0];
  const currentImageUrl = form.imageUrl ? form.imageUrl.value : '';

  try {
    console.log('Processing form data:', { name, description, price, category });
    
    let imageUrl = currentImageUrl;
    if (imageFile) {
      console.log('Uploading image file...');
      imageUrl = await uploadFile(imageFile);
      console.log('Image uploaded successfully:', imageUrl);
    }

    const itemData = {
      name,
      description,
      price,
      category,
      image_url: imageUrl || null,
      updated_at: new Date().toISOString()
    };

    console.log('Preparing to save data:', itemData);

    if (editingId) {
      console.log('Updating existing item:', editingId);
      const { data, error } = await supabase
        .from('menu_items')
        .update(itemData)
        .eq('id', editingId)
        .select();

      if (error) throw error;
      showNotification('Το πιάτο ενημερώθηκε επιτυχώς! 👍');
    } else {
      console.log('Creating new item');
      const newItem = {
        ...itemData,
        is_active: true,
        sort_order: Date.now(),
        created_at: new Date().toISOString()
      };
      
      console.log('New item data:', newItem);
      
      const { data, error } = await supabase
        .from('menu_items')
        .insert([newItem])
        .select();

      console.log('Insert response:', { data, error });

      if (error) throw error;
      if (data) console.log('Saved successfully:', data[0]);
      showNotification('Το πιάτο προστέθηκε επιτυχώς! ✨');
    }

    resetForm();
    await loadMenuItems();
  } catch (error) {
    showNotification(error.message || 'Σφάλμα επεξεργασίας πιάτου.', 'error');
  }
}

function resetForm() {
  const form = document.getElementById('menuForm');
  form.reset();
  form.imageUrl.value = '';
  editingId = null;
  document.getElementById('editingId').value = '';
  document.getElementById('cancelBtn').classList.add('hidden');
}

async function loadMenuItems() {
  try {
    const { data: items, error } = await supabase
      .from('menu_items')
      .select('*')
      .order('sort_order', { ascending: true });

    if (error) throw error;

    const menuItemsList = document.getElementById('menuItemsList');
    menuItemsList.innerHTML = '';

    if (!items?.length) {
      menuItemsList.innerHTML = '<div class="text-center text-gray-500">Δεν υπάρχουν πιάτα στο μενού.</div>';
      return;
    }

    items.forEach(item => {
      const div = document.createElement('div');
      div.className = 'flex items-center bg-white rounded-lg shadow mb-4 p-4';
      div.innerHTML = `
        <img src="${item.image_url}" alt="${item.name}" class="w-20 h-16 object-cover rounded mr-4" 
             onerror="this.src='https://via.placeholder.com/160x128?text=No+Image'" />
        <div class="flex-1">
          <div class="font-bold text-lg">${item.name}</div>
          <div class="text-gray-600 text-sm mb-1">${item.description}</div>
          <div class="font-semibold">${item.price.toFixed(2)}€</div>
          <div class="text-xs text-gray-400">${item.category}</div>
        </div>
        <div class="flex flex-col space-y-2">
          <button class="text-blue-600 hover:underline" data-edit="${item.id}">
            Επεξεργασία
          </button>
          <button class="text-red-600 hover:underline" data-delete="${item.id}">
            Διαγραφή
          </button>
        </div>
      `;
      menuItemsList.appendChild(div);
    });

    // Add event listeners
    menuItemsList.querySelectorAll('[data-edit]').forEach(btn => {
      btn.addEventListener('click', () => editItem(items.find(i => i.id === btn.dataset.edit)));
    });

    menuItemsList.querySelectorAll('[data-delete]').forEach(btn => {
      btn.addEventListener('click', () => deleteItem(btn.dataset.delete));
    });
  } catch (error) {
    showNotification('Σφάλμα φόρτωσης μενού: ' + error.message, 'error');
  }
}

function editItem(item) {
  const form = document.getElementById('menuForm');
  form.name.value = item.name;
  form.description.value = item.description;
  form.price.value = item.price;
  form.category.value = item.category;
  form.imageUrl.value = item.image_url;
  editingId = item.id;
  document.getElementById('editingId').value = item.id;
  document.getElementById('cancelBtn').classList.remove('hidden');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

async function deleteItem(id) {
  if (!confirm('Είστε σίγουροι ότι θέλετε να διαγράψετε αυτό το πιάτο;')) return;

  try {
    const { error } = await supabase
      .from('menu_items')
      .delete()
      .eq('id', id);

    if (error) throw error;
    showNotification('Το πιάτο διαγράφηκε επιτυχώς! 🗑️');
    await loadMenuItems();
  } catch (error) {
    showNotification('Σφάλμα διαγραφής: ' + error.message, 'error');
  }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('menuForm');
  form.addEventListener('submit', handleFormSubmit);

  document.getElementById('cancelBtn').addEventListener('click', resetForm);

  // Initial load
  loadMenuItems();

  // Set up real-time subscription
  const menuChanges = supabase
    .channel('menu_changes')
    .on('postgres_changes', 
      { event: '*', schema: 'public', table: 'menu_items' }, 
      () => loadMenuItems()
    )
    .subscribe();
});
