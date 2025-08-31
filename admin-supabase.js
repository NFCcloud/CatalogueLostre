import { supabase, uploadFile } from './supabase-config.js';
import { getCurrentSession, signOut } from './auth-supabase.js';

const form = document.getElementById('addFoodForm');
const menuItemsList = document.getElementById('menuItemsList');
const notification = document.getElementById('notification');
let editingId = null;

function formatCategoryName(name) {
  if (!name) return '';
  return name
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

async function editItem(itemId) {
  try {
    const { data: item, error } = await supabase
      .from('menu_items')
      .select('*')
      .eq('id', itemId)
      .single();

    if (error) throw error;

    // Populate form with item data
    document.getElementById('foodName').value = item.name;
    document.getElementById('foodDescription').value = item.description || '';
    document.getElementById('foodPrice').value = item.price;
    document.getElementById('foodCategory').value = item.category;
    
    // Handle subcategory if it exists
    const subcategoryContainer = document.getElementById('subcategoryContainer');
    const subcategorySelect = document.getElementById('foodSubcategory');
    
    if (item.category === 'coffee_menu') {
      subcategoryContainer.style.display = 'block';
      subcategorySelect.value = item.subcategory || '';
    } else {
      subcategoryContainer.style.display = 'none';
      subcategorySelect.value = '';
    }

    // Set editing state
    editingId = itemId;
    
    // Scroll form into view
    form.scrollIntoView({ behavior: 'smooth' });
    
    // Update submit button text
    const submitBtn = form.querySelector('button[type="submit"]');
    if (submitBtn) {
      submitBtn.textContent = 'Ενημέρωση Προϊόντος';
    }
  } catch (error) {
    console.error('Error loading item for edit:', error);
    showErrorNotification('Σφάλμα φόρτωσης προϊόντος: ' + error.message);
  }
}

async function deleteItem(itemId) {
  try {
    const result = await Swal.fire({
      title: 'Είστε σίγουροι;',
      text: "Δεν θα μπορείτε να το επαναφέρετε!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Ναι, διαγραφή',
      cancelButtonText: 'Άκυρο'
    });

    if (result.isConfirmed) {
      const { error } = await supabase
        .from('menu_items')
        .update({ is_active: false })
        .eq('id', itemId);

      if (error) throw error;

      await renderMenuItems();
      showNotification('Το προϊόν διαγράφηκε επιτυχώς');
    }
  } catch (error) {
    console.error('Error deleting item:', error);
    showErrorNotification('Σφάλμα διαγραφής: ' + error.message);
  }
}

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
  const subcategory = document.getElementById('foodSubcategory').value.trim();
  const imageFile = document.getElementById('foodImage').files[0];
  
  try {
    // Validate required fields
    if (!name || !category || isNaN(price)) {
      throw new Error('Παρακαλώ συμπληρώστε τα υποχρεωτικά πεδία (όνομα, κατηγορία, τιμή)');
    }

    // Prepare menu item data
    const menuItem = {
      name,
      description,
      price,
      category,
      subcategory: subcategory || null,
      is_active: true,
      sort_order: 999 // Will be updated later
    };

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

// Handle category changes and update subcategory options
document.getElementById('foodCategory').addEventListener('change', function(e) {
  const category = e.target.value;
  const subcategoryContainer = document.getElementById('subcategoryContainer');
  const subcategorySelect = document.getElementById('foodSubcategory');
  
  if (category === 'coffee_menu') {
    subcategoryContainer.style.display = 'block';
    // Clear existing options
    subcategorySelect.innerHTML = `
      <option value="">Επιλέξτε υποκατηγορία</option>
      <option value="coffee">Καφές</option>
      <option value="extras">Extras</option>
      <option value="juice">Χυμοί</option>
      <option value="soft_drinks">Αναψυκτικά</option>
      <option value="beverages">Ροφήματα</option>
      <option value="tea">Τσάι</option>
    `;
  } else {
    subcategoryContainer.style.display = 'none';
    subcategorySelect.value = '';
  }
});

async function renderMenuItems() {
  try {
    const { data: items, error } = await supabase
      .from('menu_items')
      .select('*')
      .order('category')
      .order('subcategory')
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
    
    // Group items by category and subcategory
    const groupedItems = items.reduce((acc, item) => {
      if (!acc[item.category]) {
        acc[item.category] = {};
      }
      
      const subcategory = item.subcategory || 'other';
      if (!acc[item.category][subcategory]) {
        acc[item.category][subcategory] = [];
      }
      
      acc[item.category][subcategory].push(item);
      return acc;
    }, {});

    if (!items || !items.length) {
      menuItemsList.innerHTML = `
        <div class="text-center py-8">
          <p class="text-gray-500">Δεν υπάρχουν καταχωρημένα προϊόντα</p>
        </div>
      `;
      return;
    }

    // Render grouped items
    function formatCategoryName(name) {
      if (!name) return '';
      return name
        .split('_')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
    }

    Object.entries(groupedItems).forEach(([category, subcategories]) => {
      const categoryTitle = document.createElement('h2');
      categoryTitle.className = 'text-xl font-bold mb-4 mt-8 text-gray-800 border-b pb-2';
      categoryTitle.textContent = formatCategoryName(category);
      menuItemsList.appendChild(categoryTitle);

      Object.entries(subcategories).forEach(([subcategory, items]) => {
        if (subcategory !== 'other') {
          const subcategoryTitle = document.createElement('h3');
          subcategoryTitle.className = 'text-lg font-semibold mb-3 ml-4 text-gray-700';
          subcategoryTitle.textContent = formatCategoryName(subcategory);
          menuItemsList.appendChild(subcategoryTitle);
        }

        const itemsGrid = document.createElement('div');
        itemsGrid.className = 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6 ml-4';
        
        items.forEach(item => {
          const itemCard = document.createElement('div');
          itemCard.className = 'bg-white rounded-lg shadow-md p-4 flex flex-col justify-between';
          itemCard.innerHTML = `
            <div>
              <div class="flex justify-between items-start mb-2">
                <h4 class="font-semibold text-gray-800">${item.name}</h4>
                <span class="text-green-600 font-bold">€${item.price.toFixed(2)}</span>
              </div>
              ${item.description ? `<p class="text-sm text-gray-600 mb-2">${item.description}</p>` : ''}
            </div>
            <div class="flex justify-end gap-2 mt-3">
              <button onclick="editItem('${item.id}')" class="text-blue-500 hover:text-blue-700">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                </svg>
              </button>
              <button onclick="deleteItem('${item.id}')" class="text-red-500 hover:text-red-700">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                </svg>
              </button>
            </div>
          `;
          itemsGrid.appendChild(itemCard);
        });

        menuItemsList.appendChild(itemsGrid);
      });
    });
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
