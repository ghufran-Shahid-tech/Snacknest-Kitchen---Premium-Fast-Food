/**
 * SNACKNEST KITCHEN - Premium Restaurant Website
 * JavaScript Functionality
 * 
 * Features:
 * - Cart Management System
 * - 3D Tilt Effect for Hero Image
 * - Scroll Reveal Animations
 * - WhatsApp Checkout Integration
 * - Mobile Menu Toggle
 * - Toast Notifications
 */

// ============================================
// MENU DATA
// ============================================
const menuData = {
  "Rice & Pasta": [
    ["Fried Rice Veg", 200],
    ["Fried Rice Chicken", 250],
    ["Chilli Chicken", 250],
    ["Chow Mein", 250],
    ["Alfredo Pasta", 350],
    ["Lasagne", 500]
  ],
  "Burgers": [
    ["Bun Kabab", 100],
    ["Anday Wala Burger", 150],
    ["Zinger Breast", 300],
    ["Zinger Breast Cheese", 350],
    ["Zinger Thigh", 350],
    ["Zinger Thigh Cheese", 400]
  ],
  "Fast Food": [
    ["Momos", 200],
    ["Fries", 150],
    ["Loaded Fries", 300],
    ["Chicken Nuggets", 350]
  ],
  "Drinks": [
    ["Coke", 100],
    ["Sprite", 100],
    ["Mint Margarita", 180]
  ]
};

// ============================================
// CART STATE
// ============================================
let cart = [];

// ============================================
// DOM ELEMENTS
// ============================================
const cartDrawer = document.getElementById('cartDrawer');
const cartOverlay = document.getElementById('cartOverlay');
const cartItems = document.getElementById('cartItems');
const cartBadge = document.getElementById('cartBadge');
const cartTotal = document.getElementById('cartTotal');
const cartFooter = document.getElementById('cartFooter');
const cartEmpty = document.getElementById('cartEmpty');
const toast = document.getElementById('toast');
const toastMessage = document.getElementById('toastMessage');
const mobileMenu = document.getElementById('mobileMenu');

// ============================================
// INITIALIZATION
// ============================================
document.addEventListener('DOMContentLoaded', () => {
  initMenu();
  init3DTilt();
  initScrollReveal();
  initNavbarScroll();
});

// ============================================
// MENU RENDERING
// ============================================
function initMenu() {
  const menuContainer = document.getElementById('menuCategories');
  
  Object.entries(menuData).forEach(([category, items], categoryIndex) => {
    const categorySection = document.createElement('div');
    categorySection.className = 'menu-category';
    categorySection.style.animationDelay = `${categoryIndex * 0.1}s`;
    
    const categoryTitle = document.createElement('h3');
    categoryTitle.className = 'category-title';
    categoryTitle.textContent = category;
    
    const menuGrid = document.createElement('div');
    menuGrid.className = 'menu-grid';
    
    items.forEach(([name, price], itemIndex) => {
      const menuItem = createMenuItem(name, price, itemIndex);
      menuGrid.appendChild(menuItem);
    });
    
    categorySection.appendChild(categoryTitle);
    categorySection.appendChild(menuGrid);
    menuContainer.appendChild(categorySection);
  });
}

function createMenuItem(name, price, index) {
  const item = document.createElement('div');
  item.className = 'menu-item';
  item.style.animationDelay = `${index * 0.05}s`;
  
  item.innerHTML = `
    <div class="menu-item-info">
      <span class="menu-item-name">${name}</span>
      <span class="menu-item-price">Rs ${price}</span>
    </div>
    <button class="btn-add" onclick="addToCart('${name}', ${price})">
      <i class="fas fa-plus"></i> Add
    </button>
  `;
  
  return item;
}

// ============================================
// CART MANAGEMENT
// ============================================
function addToCart(name, price) {
  const existingItem = cart.find(item => item.name === name);
  
  if (existingItem) {
    existingItem.qty++;
  } else {
    cart.push({ name, price, qty: 1 });
  }
  
  renderCart();
  showToast(`${name} added to cart!`);
  playAddSound();
  
  // Animate cart badge
  cartBadge.style.animation = 'none';
  setTimeout(() => {
    cartBadge.style.animation = 'badgeBounce 0.3s ease';
  }, 10);
}

function removeFromCart(name) {
  cart = cart.filter(item => item.name !== name);
  renderCart();
}

function updateQuantity(name, change) {
  const item = cart.find(item => item.name === name);
  
  if (!item) return;
  
  item.qty += change;
  
  if (item.qty <= 0) {
    removeFromCart(name);
    return;
  }
  
  renderCart();
}

function renderCart() {
  // Update badge
  const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
  cartBadge.textContent = totalItems;
  cartBadge.style.display = totalItems > 0 ? 'flex' : 'none';
  
  // Show/hide empty state and footer
  if (cart.length === 0) {
    cartEmpty.style.display = 'flex';
    cartFooter.style.display = 'none';
    cartItems.innerHTML = '';
    cartItems.appendChild(cartEmpty);
    return;
  }
  
  cartEmpty.style.display = 'none';
  cartFooter.style.display = 'block';
  
  // Render items
  cartItems.innerHTML = '';
  let total = 0;
  
  cart.forEach(item => {
    total += item.price * item.qty;
    
    const cartItem = document.createElement('div');
    cartItem.className = 'cart-item';
    cartItem.innerHTML = `
      <div class="cart-item-info">
        <div class="cart-item-name">${item.name}</div>
        <div class="cart-item-price">Rs ${item.price}</div>
      </div>
      <div class="cart-item-controls">
        <button class="qty-btn" onclick="updateQuantity('${item.name}', -1)">-</button>
        <span class="cart-item-qty">${item.qty}</span>
        <button class="qty-btn" onclick="updateQuantity('${item.name}', 1)">+</button>
        <button class="cart-item-remove" onclick="removeFromCart('${item.name}')">
          <i class="fas fa-trash-alt"></i>
        </button>
      </div>
    `;
    
    cartItems.appendChild(cartItem);
  });
  
  // Update total
  cartTotal.textContent = `Rs ${total}`;
}

function toggleCart() {
  cartDrawer.classList.toggle('active');
  cartOverlay.classList.toggle('active');
  document.body.style.overflow = cartDrawer.classList.contains('active') ? 'hidden' : '';
}

// ============================================
// WHATSAPP CHECKOUT
// ============================================
function checkout() {
  if (cart.length === 0) {
    showToast('Your cart is empty!');
    return;
  }
  
  const phoneNumber = '+92 316 2341381'; // Replace with actual WhatsApp number
  let message = '*Hello Snacknest Kitchen!* %0A%0AI would like to order:%0A%0A';
  let total = 0;
  
  cart.forEach((item, index) => {
    const itemTotal = item.price * item.qty;
    total += itemTotal;
    message += `${index + 1}. *${item.name}* x${item.qty} = Rs ${itemTotal}%0A`;
  });
  
  message += `%0A*Total: Rs ${total}*%0A%0AThank you!`;
  
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;
  window.open(whatsappUrl, '_blank');
}

// ============================================
// 3D TILT EFFECT (Hero Image)
// ============================================
function init3DTilt() {
  const container = document.getElementById('heroImageContainer');
  const image = document.getElementById('heroImage');
  
  if (!container || !image) return;
  
  // Check if touch device
  const isTouchDevice = window.matchMedia('(pointer: coarse)').matches;
  if (isTouchDevice) return;
  
  let targetX = 0;
  let targetY = 0;
  let currentX = 0;
  let currentY = 0;
  
  document.addEventListener('mousemove', (e) => {
    const rect = container.getBoundingClientRect();
    const centerX = rect.left + rect.width / 10;
    const centerY = rect.top + rect.height / 10;
    
    targetX = (e.clientX - centerX) / 15;
    targetY = (e.clientY - centerY) / 15;
    
    // Clamp values
    targetX = Math.max(-15, Math.min(15, targetX));
    targetY = Math.max(-15, Math.min(15, targetY));
  });
  
  function animate() {
    // Smooth interpolation
    currentX += (targetX - currentX) * 0.08;
    currentY += (targetY - currentY) * 0.08;
    
    image.style.transform = `rotateY(${currentX}deg) rotateX(${-currentY}deg)`;
    
    requestAnimationFrame(animate);
  }
  
  animate();
  
  // Reset on mouse leave
  document.addEventListener('mouseleave', () => {
    targetX = 0;
    targetY = 0;
  });
}

// ============================================
// SCROLL REVEAL ANIMATIONS
// ============================================
function initScrollReveal() {
  const revealElements = document.querySelectorAll('.reveal');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });
  
  revealElements.forEach((el, index) => {
    el.style.transitionDelay = `${index * 0.1}s`;
    observer.observe(el);
  });
}

// ============================================
// NAVBAR SCROLL EFFECT
// ============================================
function initNavbarScroll() {
  const navbar = document.getElementById('navbar');
  let lastScroll = 0;
  
  window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
      navbar.style.transform = currentScroll > lastScroll ? 'translateY(-100%)' : 'translateY(0)';
    } else {
      navbar.style.transform = 'translateY(0)';
    }
    
    lastScroll = currentScroll;
  });
}

// ============================================
// MOBILE MENU
// ============================================
function toggleMobileMenu() {
  mobileMenu.classList.toggle('active');
  document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
}

// ============================================
// TOAST NOTIFICATIONS
// ============================================
function showToast(message) {
  toastMessage.textContent = message;
  toast.classList.add('active');
  
  setTimeout(() => {
    toast.classList.remove('active');
  }, 3000);
}

// ============================================
// SOUND EFFECT (Simulated)
// ============================================
function playAddSound() {
  // Create a simple beep using Web Audio API
  try {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = 800;
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.1);
  } catch (e) {
    // Silent fail if audio not supported
  }
}

// ============================================
// UTILITY FUNCTIONS
// ============================================
function scrollToMenu() {
  document.getElementById('menu').scrollIntoView({ behavior: 'smooth' });
}

function handleContactSubmit(e) {
  e.preventDefault();
  showToast('Message sent successfully!');
  e.target.reset();
}

// Close cart on escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    if (cartDrawer.classList.contains('active')) {
      toggleCart();
    }
    if (mobileMenu.classList.contains('active')) {
      toggleMobileMenu();
    }
  }
});

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

const contactForm = document.getElementById('contactForm');

contactForm.addEventListener('submit', function(e){
  e.preventDefault();
  
  emailjs.sendForm('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', this)
    .then(() => {
      showToast('Message sent successfully via snacknestkitchen@gmail.com!');
      contactForm.reset();
    }, (error) => {
      showToast('Failed to send message. Try again!');
      console.error(error);
    });
});
