import { supabase, uploadFile } from './supabase-config.js';
import { getCurrentSession, signOut } from './auth-supabase.js';

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
    notificationBox.className = 'bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded-lg shadow-xl flex items-center transform transition-all duration-300 ease-in-out';
  } else {
    notificationBox.className = 'bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-lg shadow-xl flex items-center transform transition-all duration-300 ease-in-out';
  }

  // Add animation
  notificationEl.classList.remove('translate-x-full', 'opacity-0');
  notificationEl.classList.add('opacity-100');
  
  // Hide after 3 seconds with fade out
  setTimeout(() => {
    notificationEl.classList.add('translate-x-full', 'opacity-0');
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
  
  if (!name || !description || !category || isNaN(price) || (!imageFile && !editingId)) {
    showErrorNotification('Παρακαλώ συμπληρώστε όλα τα απαραίτητα πεδία');
    return;
  }

  try {
    let imageUrl = null;
    if (imageFile) {
      try {
        // Check file size
        if (imageFile.size > 5 * 1024 * 1024) { // 5MB limit
          throw new Error('Το μέγεθος της εικόνας πρέπει να είναι μικρότερο από 5MB');
        }

        // Check file type
        if (!imageFile.type.startsWith('image/')) {
          throw new Error('Παρακαλώ επιλέξτε ένα αρχείο εικόνας');
        }

        imageUrl = await uploadFile(imageFile);
        showNotification('Η εικόνα ανέβηκε επιτυχώς! 🖼️');
      } catch (uploadError) {
        showErrorNotification(uploadError.userMessage || 'Σφάλμα κατά το ανέβασμα της εικόνας: ' + uploadError.message);
        return;
      }
    }

    if (editingId) {
      const updateData = {
        name,
        description,
        price,
        category,
        updated_at: new Date().toISOString()
      };
      if (imageUrl) updateData.image_url = imageUrl;

      const { error } = await supabase
        .from('menu_items')
        .update(updateData)
        .eq('id', editingId);

      if (error) throw error;
      editingId = null;
      showNotification('Το πιάτο ενημερώθηκε επιτυχώς! 👍');
    } else {
      const { error } = await supabase
        .from('menu_items')
        .insert([{
          name,
          description,
          price,
          category,
          image_url: imageUrl,
          is_active: true,
          sort_order: Date.now(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }]);

      if (error) throw error;
      showNotification('Το πιάτο προστέθηκε επιτυχώς! ✨');
    }
    
    form.reset();
    form.removeAttribute('data-edit-id');
  } catch (error) {
    showErrorNotification('Σφάλμα: ' + error.message);
  }
});

async function renderMenuItems() {
  try {
    const { data: items, error } = await supabase
      .from('menu_items')
      .select('*')
      .order('sort_order', { ascending: true });
    
    if (error) {
      console.error('Error fetching menu items:', error);
      if (error.code === '42P01') {  // Table doesn't exist error
        showErrorNotification('Η βάση δεδομένων δεν έχει ρυθμιστεί σωστά. Παρακαλώ επικοινωνήστε με τον διαχειριστή.');
      } else {
        showErrorNotification('Σφάλμα φόρτωσης μενού: ' + error.message);
      }
      return;
    }

    if (error) throw error;

    menuItemsList.innerHTML = '';
    if (!items || !items.length) {
      menuItemsList.innerHTML = '<div class="text-center text-gray-500">Δεν υπάρχουν πιάτα στο μενού.</div>';
      return;
    }

    items.forEach(item => {
      const div = document.createElement('div');
      div.className = 'flex items-center bg-white rounded-lg shadow mb-4 p-4';
      div.innerHTML = `
        <img src="${item.image_url}" alt="${item.name}" class="w-20 h-16 object-cover rounded mr-4" />
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

    // Add event listeners for edit and delete buttons
    menuItemsList.querySelectorAll('[data-delete]').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        const id = btn.getAttribute('data-delete');
        if (confirm('Διαγραφή πιάτου;')) {
          try {
            const { error } = await supabase
              .from('menu_items')
              .delete()
              .eq('id', id);
            
            if (error) throw error;
            showNotification('Το πιάτο διαγράφηκε επιτυχώς! 🗑️');
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
        if (!item) {
          showErrorNotification('Το πιάτο δεν βρέθηκε.');
          return;
        }
        document.getElementById('foodName').value = item.name;
        document.getElementById('foodDescription').value = item.description;
        document.getElementById('foodPrice').value = item.price;
        document.getElementById('foodCategory').value = item.category;
        editingId = id;
        form.setAttribute('data-edit-id', id);
        window.scrollTo({ top: 0, behavior: 'smooth' });
        showNotification('Μπορείτε να επεξεργαστείτε το πιάτο. ✏️');
      });
    });
  } catch (error) {
    showErrorNotification('Σφάλμα φόρτωσης μενού: ' + error.message);
  }
}

// Check authentication before initializing
async function initializeAdmin() {
  const session = await getCurrentSession();
  if (!session) {
    window.location.href = 'login-supabase.html';
    return;
  }

  // Initial render and set up real-time subscription
  renderMenuItems();
}

initializeAdmin();

// Set up real-time subscription for menu updates
const menuSubscription = supabase
  .channel('menu_changes')
  .on('postgres_changes', { event: '*', schema: 'public', table: 'menu_items' }, renderMenuItems)
  .subscribe();
