let cartCount = 0;
let currentPage = 'home';
let cartItems = [];


document.addEventListener('DOMContentLoaded', () => {
  initNav();
  initCart();
  initAuthForms();
  initContactForm();
  showPage('home');
});


function initNav() {
  const navLinks = document.querySelectorAll('.nav-link');
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      const target = link.dataset.page;
      navigateTo(target);
    });
  });

  // Logo click goes home
  document.querySelector('.logo').addEventListener('click', () => navigateTo('home'));

  // Login/Register button in header
  document.getElementById('headerAuthBtn').addEventListener('click', () => navigateTo('login'));
}

function navigateTo(pageName) {
  showPage(pageName);
  updateNav(pageName);
  currentPage = pageName;
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function showPage(pageName) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  const target = document.getElementById('page-' + pageName);
  if (target) target.classList.add('active');
}

function updateNav(pageName) {
  document.querySelectorAll('.nav-link').forEach(link => {
    link.classList.toggle('active', link.dataset.page === pageName);
  });
}

// =============================================
// SIDEBAR CATEGORY LINKS
// =============================================
function filterCategory(category) {
  navigateTo('products');
  showToast('Showing: ' + category);
}

// =============================================
// CART
// =============================================
function initCart() {
  updateCartBadge();
}

function openCart() {
  renderCart();
  navigateTo('cart');
}

function addToCart(productName) {
  const existing = cartItems.find(i => i.name === productName);
  if (existing) {
    existing.qty++;
  } else {
    cartItems.push({ name: productName, qty: 1 });
  }
  cartCount++;
  updateCartBadge();
  showToast('🛒 ' + productName + ' ditambahkan ke keranjang!');
}

function removeFromCart(index) {
  cartCount -= cartItems[index].qty;
  cartItems.splice(index, 1);
  updateCartBadge();
  renderCart();
  showToast('🗑️ Produk dihapus dari keranjang.');
}

function renderCart() {
  const container = document.getElementById('cartItemsContainer');
  if (!container) return;
  if (cartItems.length === 0) {
    container.innerHTML = '<p style="text-align:center; color:#aaa; padding:40px 0;">Keranjang kosong 🛒</p>';
  } else {
    container.innerHTML = cartItems.map((item, i) => `
      <div style="display:flex; justify-content:space-between; align-items:center;
                  padding:14px 0; border-bottom:1px solid #f0e6f6;">
        <div>
          <strong>${item.name}</strong>
          <div style="color:#aaa; font-size:13px;">Qty: ${item.qty}</div>
        </div>
        <button onclick="removeFromCart(${i})"
          style="background:none; border:none; font-size:20px; cursor:pointer;">🗑️</button>
      </div>
    `).join('');
  }
}

function updateCartBadge() {
  const badge = document.getElementById('cartBadge');
  if (badge) {
    badge.textContent = cartCount;
    badge.style.display = cartCount > 0 ? 'flex' : 'none';
  }
}

// =============================================
// CHECKOUT - Perbaikan! Keranjang akan kosong
// =============================================
function checkout() {
  if (cartItems.length === 0) {
    showToast('⚠️ Keranjang kosong! Tambahkan produk terlebih dahulu.');
    return;
  }
  
  // Kosongkan keranjang
  cartItems = [];
  cartCount = 0;
  updateCartBadge();
  renderCart();
  
  showToast('✅ Checkout berhasil! Terima kasih sudah berbelanja.');
}

// =============================================
// AUTH FORMS
// =============================================
function initAuthForms() {
  // Login form
  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('loginEmail').value;
      const pass  = document.getElementById('loginPass').value;
      if (!email || !pass) {
        showToast('⚠️ Isi email dan password terlebih dahulu!');
        return;
      }
      showToast('✅ Login berhasil! Selamat datang.');
      setTimeout(() => navigateTo('home'), 800);
    });
  }

  // Register form
  const regForm = document.getElementById('registerForm');
  if (regForm) {
    regForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name  = document.getElementById('regName').value;
      const email = document.getElementById('regEmail').value;
      const pass  = document.getElementById('regPass').value;
      const conf  = document.getElementById('regConfirm').value;
      if (!name || !email || !pass || !conf) {
        showToast('⚠️ Semua field wajib diisi!');
        return;
      }
      if (pass !== conf) {
        showToast('⚠️ Password tidak cocok!');
        return;
      }
      showToast('🎉 Akun berhasil dibuat! Silakan login.');
      setTimeout(() => navigateTo('login'), 1000);
    });
  }
}

// =============================================
// CONTACT FORM
// =============================================
function initContactForm() {
  const form = document.getElementById('contactForm');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('contactName').value;
      const email = document.getElementById('contactEmail').value;
      const msg  = document.getElementById('contactMsg').value;
      if (!name || !email || !msg) {
        showToast('⚠️ Mohon lengkapi semua field!');
        return;
      }
      showToast('✉️ Pesan terkirim! Kami akan segera menghubungi Anda.');
      form.reset();
    });
  }
}

// =============================================
// TOGGLE PASSWORD VISIBILITY
// =============================================
function togglePassword(inputId, btnEl) {
  const input = document.getElementById(inputId);
  if (input.type === 'password') {
    input.type = 'text';
    btnEl.textContent = '🙈';
  } else {
    input.type = 'password';
    btnEl.textContent = '👁️';
  }
}

// =============================================
// TOAST NOTIFICATION
// =============================================
function showToast(message) {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3000);
}

// =============================================
// SEARCH - Improved version
// =============================================
function openSearch() {
  const headerActions = document.querySelector('.header-actions');
  const searchBtn = document.querySelector('.icon-btn[title="Cari"]');
  
  // Cek apakah sudah ada input search
  let searchContainer = document.querySelector('.search-container');
  
  if (!searchContainer) {
    // Buat container search
    searchContainer = document.createElement('div');
    searchContainer.className = 'search-container active';
    searchContainer.innerHTML = `
      <input type="text" class="search-input" placeholder="Cari produk..." id="searchInput" autofocus>
      <button class="icon-btn" onclick="closeSearch()" style="font-size:16px; min-width:34px; min-height:34px; padding:4px 8px;">✕</button>
    `;
    
    // Sisipkan setelah tombol search
    searchBtn.parentNode.insertBefore(searchContainer, searchBtn.nextSibling);
    
    // Focus ke input
    setTimeout(() => {
      document.getElementById('searchInput').focus();
    }, 100);
    
    // Event untuk search
    document.getElementById('searchInput').addEventListener('keyup', function(e) {
      if (e.key === 'Enter') {
        const query = this.value.trim();
        if (query) {
          navigateTo('products');
          showToast('🔍 Mencari: ' + query);
          closeSearch();
        }
      }
    });
    
    // Event untuk blur - dengan delay agar klik close bekerja
    document.getElementById('searchInput').addEventListener('blur', function(e) {
      setTimeout(() => {
        if (!document.activeElement || !document.activeElement.closest('.search-container')) {
          closeSearch();
        }
      }, 200);
    });
    
  } else {
    // Jika sudah ada, toggle visibility
    if (searchContainer.classList.contains('active')) {
      closeSearch();
    } else {
      searchContainer.classList.add('active');
      setTimeout(() => {
        document.getElementById('searchInput').focus();
      }, 100);
    }
  }
}

function closeSearch() {
  const container = document.querySelector('.search-container');
  if (container) {
    container.classList.remove('active');
    setTimeout(() => {
      if (container && !container.classList.contains('active')) {
        container.remove();
      }
    }, 300);
  }
}