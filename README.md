# Snacknest Kitchen - Technical Specification

## Component Inventory

### shadcn/ui Components (Not applicable - vanilla JS project)
This is a pure HTML/CSS/JS project, no React components needed.

### Custom Components
1. **Navbar** - Sticky glassmorphism navigation
2. **HeroSection** - 3D tilt burger showcase
3. **FeatureCards** - Why choose us section
4. **MenuSection** - Categorized menu with add-to-cart
5. **CartDrawer** - Slide-in cart panel
6. **SpecialOffers** - Promotional cards
7. **ReviewsSection** - Testimonial cards
8. **AboutSection** - Brand story
9. **ContactSection** - Contact form and info
10. **Footer** - Site footer

### Custom Hooks/Functions
1. **CartManager** - Cart state management (add, remove, update qty)
2. **ScrollReveal** - Intersection Observer for scroll animations
3. **Tilt3D** - Mouse tracking for 3D effect
4. **SoundEffect** - Audio playback for cart actions

## Animation Implementation Table

| Animation | Library | Implementation Approach | Complexity |
|-----------|---------|------------------------|------------|
| Page load fade-in | CSS + JS | CSS transitions with JS trigger | Low |
| Scroll reveal | Intersection Observer | Native API with CSS classes | Medium |
| 3D tilt hero | Vanilla JS | Mouse event tracking + transform | Medium |
| Card hover lift | CSS | transform + box-shadow transition | Low |
| Cart drawer slide | CSS + JS | translateX transition | Low |
| Button hover glow | CSS | box-shadow + scale transition | Low |
| Background glow pulse | CSS | @keyframes animation | Low |
| Gradient border rotate | CSS | conic-gradient + animation | Medium |
| Cart badge bounce | CSS | @keyframes scale bounce | Low |
| Add to cart sound | Web Audio API | Audio element playback | Low |

## Animation Library Choices

**Primary: CSS Animations + Transitions**
- All hover effects
- Scroll reveals (with Intersection Observer)
- Background animations
- Card transitions

**Secondary: Vanilla JavaScript**
- 3D tilt effect (mouse tracking)
- Cart state management
- Scroll behavior
- Sound effects

## Project File Structure

```
/mnt/okcomputer/output/app/
├── index.html          # Main HTML file
├── css/
│   └── styles.css      # All styles
├── js/
│   └── app.js          # All JavaScript functionality
├── assets/
│   └── images/         # Generated images
│       └── hero-burger.jpg
└── sounds/
    └── add-to-cart.mp3 # Sound effect
```

## Dependencies

**External (CDN):**
- Google Fonts: Poppins (300, 400, 600, 700, 800)
- Font Awesome (for icons) - optional, can use SVG

**No npm packages required** - pure vanilla implementation

## Technical Implementation Notes

### Cart System Architecture
```javascript
// Cart state
let cart = [
  { name: "Zinger Burger", price: 300, qty: 2 }
];

// Functions
- addToCart(name, price)
- removeFromCart(name)
- updateQuantity(name, change)
- calculateTotal()
- renderCart()
- generateWhatsAppMessage()
```

### Menu Data Structure
```javascript
const menuData = {
  "Rice & Pasta": [
    ["Fried Rice Veg", 200],
    // ...
  ],
  // ...
};
```

### WhatsApp Integration
```javascript
function checkout() {
  const message = generateOrderMessage();
  const phone = "923001234567";
  window.open(`https://wa.me/${phone}?text=${message}`);
}
```

### 3D Tilt Implementation
```javascript
// Mouse tracking with smooth interpolation
let targetX = 0, targetY = 0;
let currentX = 0, currentY = 0;

document.addEventListener('mousemove', (e) => {
  const rect = element.getBoundingClientRect();
  targetX = (e.clientX - rect.centerX) / 20;
  targetY = (e.clientY - rect.centerY) / 20;
});

// Animation loop
function animate() {
  currentX += (targetX - currentX) * 0.08;
  currentY += (targetY - currentY) * 0.08;
  element.style.transform = `rotateY(${currentX}deg) rotateX(${-currentY}deg)`;
  requestAnimationFrame(animate);
}
```

### Scroll Reveal Implementation
```javascript
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('revealed');
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
```

## Responsive Breakpoints

- Desktop: > 1024px
- Tablet: 768px - 1024px
- Mobile: < 768px

## Performance Optimizations

1. CSS transforms instead of position changes
2. will-change on animated elements
3. Intersection Observer for scroll effects
4. requestAnimationFrame for smooth animations
5. Lazy loading for images
6. Minified CSS and JS (optional)

