// Shopping Cart System with Stripe Integration
// Manages cart state, UI overlay, and Stripe checkout

class ShoppingCart {
  constructor() {
    this.items = [];
    this.inventory = {};
    this.loadCart();
    this.initializeUI();
    this.attachEventListeners();
    this.loadInventory();
  }

  // Load cart from localStorage
  loadCart() {
    const savedCart = localStorage.getItem('tokenCart');
    if (savedCart) {
      this.items = JSON.parse(savedCart);
    }
    this.updateCartCount();
  }

  // Save cart to localStorage
  saveCart() {
    localStorage.setItem('tokenCart', JSON.stringify(this.items));
    this.updateCartCount();
  }

  // Load inventory from backend
  async loadInventory() {
    try {
      const response = await fetch('get-inventory.php');
      if (response.ok) {
        this.inventory = await response.json();
        this.updateCartDisplay();
      }
    } catch (error) {
      console.error('Failed to load inventory:', error);
    }
  }

  // Add item to cart
  addItem(id, name, price, image) {
    const existingItem = this.items.find(item => item.id === id);

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      this.items.push({
        id,
        name,
        price,
        image,
        quantity: 1
      });
    }

    this.saveCart();
    this.showNotification(`${name} added to cart!`);
    this.updateCartDisplay();
  }

  // Remove item from cart
  removeItem(id) {
    this.items = this.items.filter(item => item.id !== id);
    this.saveCart();
    this.updateCartDisplay();
  }

  // Update item quantity
  updateQuantity(id, quantity) {
    const item = this.items.find(item => item.id === id);
    if (item) {
      if (quantity <= 0) {
        this.removeItem(id);
      } else {
        item.quantity = quantity;
        this.saveCart();
        this.updateCartDisplay();
      }
    }
  }

  // Clear cart
  clearCart() {
    this.items = [];
    this.saveCart();
    this.updateCartDisplay();
  }

  // Get cart total
  getTotal() {
    return this.items.reduce((total, item) => total + (item.price * item.quantity), 0);
  }

  // Update cart count in nav
  updateCartCount() {
    const countElement = document.getElementById('cart-count');
    if (countElement) {
      const totalItems = this.items.reduce((sum, item) => sum + item.quantity, 0);
      countElement.textContent = totalItems;
    }
  }

  // Initialize cart overlay UI
  initializeUI() {
    const overlay = document.createElement('div');
    overlay.id = 'cart-overlay';
    overlay.className = 'cart-overlay';
    overlay.innerHTML = `
      <div class="cart-panel">
        <div class="cart-header">
          <h2>Shopping Cart</h2>
          <button class="close-cart" id="close-cart">&times;</button>
        </div>
        <div class="cart-items" id="cart-items">
          <!-- Cart items will be inserted here -->
        </div>
        <div class="cart-footer">
          <div id="cart-error-message" class="cart-error-message" style="display: none;"></div>
          <div class="cart-total">
            <span>Total:</span>
            <span id="cart-total">$0.00</span>
          </div>
          <button class="checkout-button" id="checkout-button">Proceed to Checkout</button>
          <button class="clear-cart-button" id="clear-cart-button">Clear Cart</button>
        </div>
      </div>
    `;
    document.body.appendChild(overlay);

    this.addCartStyles();
  }

  // Add CSS styles for cart overlay
  addCartStyles() {
    const style = document.createElement('style');
    style.textContent = `
      .cart-overlay {
        position: fixed;
        top: 0;
        right: -100%;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        z-index: 10000;
        transition: right 0.3s ease;
      }

      .cart-overlay.active {
        right: 0;
      }

      .cart-panel {
        position: absolute;
        right: 0;
        top: 0;
        width: 400px;
        max-width: 90%;
        height: 100%;
        background: white;
        box-shadow: -2px 0 10px rgba(0, 0, 0, 0.3);
        display: flex;
        flex-direction: column;
      }

      .cart-header {
        padding: 20px;
        border-bottom: 1px solid #ddd;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .cart-header h2 {
        margin: 0;
        font-size: 24px;
      }

      .close-cart {
        background: none;
        border: none;
        font-size: 32px;
        cursor: pointer;
        color: #666;
        line-height: 1;
      }

      .close-cart:hover {
        color: #000;
      }

      .cart-items {
        flex: 1;
        overflow-y: auto;
        padding: 20px;
      }

      .cart-item {
        display: flex;
        gap: 15px;
        padding: 15px;
        border-bottom: 1px solid #eee;
        align-items: center;
      }

      .cart-item-image {
        width: 60px;
        height: 60px;
        object-fit: cover;
        border-radius: 4px;
      }

      .cart-item-details {
        flex: 1;
      }

      .cart-item-name {
        font-weight: bold;
        margin-bottom: 5px;
      }

      .cart-item-price {
        color: #666;
        font-size: 14px;
      }

      .cart-item-controls {
        display: flex;
        align-items: center;
        gap: 10px;
      }

      .quantity-control {
        display: flex;
        align-items: center;
        gap: 5px;
      }

      .quantity-btn {
        width: 25px;
        height: 25px;
        border: 1px solid #ddd;
        background: white;
        cursor: pointer;
        font-size: 16px;
        border-radius: 3px;
      }

      .quantity-btn:hover {
        background: #f0f0f0;
      }

      .quantity-value {
        min-width: 30px;
        text-align: center;
      }

      .remove-item {
        background: #ff4444;
        color: white;
        border: none;
        padding: 5px 10px;
        cursor: pointer;
        border-radius: 3px;
        font-size: 12px;
      }

      .remove-item:hover {
        background: #cc0000;
      }

      .cart-footer {
        padding: 20px;
        border-top: 1px solid #ddd;
      }

      .cart-error-message {
        background: #fee;
        border: 1px solid #f88;
        color: #c00;
        padding: 12px;
        border-radius: 5px;
        margin-bottom: 15px;
        font-size: 14px;
        line-height: 1.5;
      }

      .cart-error-message strong {
        display: block;
        margin-bottom: 5px;
        font-size: 15px;
      }

      .cart-total {
        display: flex;
        justify-content: space-between;
        font-size: 20px;
        font-weight: bold;
        margin-bottom: 15px;
      }

      .checkout-button,
      .clear-cart-button {
        width: 100%;
        padding: 12px;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        font-size: 16px;
        font-weight: bold;
        margin-bottom: 10px;
      }

      .checkout-button {
        background: #4CAF50;
        color: white;
      }

      .checkout-button:hover {
        background: #45a049;
      }

      .checkout-button:disabled {
        background: #ccc;
        cursor: not-allowed;
      }

      .clear-cart-button {
        background: #f44336;
        color: white;
      }

      .clear-cart-button:hover {
        background: #da190b;
      }

      .cart-empty {
        text-align: center;
        padding: 40px 20px;
        color: #666;
      }

      .stock-warning {
        color: #ff0000;
        font-size: 12px;
        font-weight: bold;
        margin-top: 5px;
        background: #ffe6e6;
        padding: 4px 8px;
        border-radius: 3px;
        display: inline-block;
      }

      .stock-info {
        color: #ff9800;
        font-size: 12px;
        margin-top: 5px;
        background: #fff3e0;
        padding: 4px 8px;
        border-radius: 3px;
        display: inline-block;
      }

      .cart-item.out-of-stock {
        border-left: 3px solid #ff0000;
        background: #fff5f5;
      }

      .add-to-cart-btn {
        background: #4CAF50;
        color: white;
        border: none;
        padding: 10px 20px;
        cursor: pointer;
        border-radius: 5px;
        font-size: 14px;
        margin-top: 10px;
        width: 100%;
      }

      .add-to-cart-btn:hover {
        background: #45a049;
      }

      .notification {
        position: fixed;
        top: 80px;
        right: 20px;
        background: #4CAF50;
        color: white;
        padding: 15px 25px;
        border-radius: 5px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        z-index: 10001;
        animation: slideIn 0.3s ease;
      }

      @keyframes slideIn {
        from {
          transform: translateX(400px);
          opacity: 0;
        }
        to {
          transform: translateX(0);
          opacity: 1;
        }
      }

      @media (max-width: 768px) {
        .cart-panel {
          width: 100%;
          max-width: 100%;
        }
      }
    `;
    document.head.appendChild(style);
  }

  // Show notification
  showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
      notification.remove();
    }, 3000);
  }

  // Toggle cart overlay
  toggleCart() {
    const overlay = document.getElementById('cart-overlay');
    overlay.classList.toggle('active');
    // Refresh inventory when cart is opened
    if (overlay.classList.contains('active')) {
      this.loadInventory();
    }
    this.updateCartDisplay();
  }

  // Close cart
  closeCart() {
    const overlay = document.getElementById('cart-overlay');
    overlay.classList.remove('active');
  }

  // Update cart display
  updateCartDisplay() {
    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotalElement = document.getElementById('cart-total');
    const checkoutButton = document.getElementById('checkout-button');

    // Hide error message when cart is updated
    this.hideCartError();

    if (this.items.length === 0) {
      cartItemsContainer.innerHTML = '<div class="cart-empty">Your cart is empty</div>';
      checkoutButton.disabled = true;
    } else {
      cartItemsContainer.innerHTML = this.items.map(item => {
        const availableStock = this.inventory[item.id] || 0;
        const isOutOfStock = item.quantity > availableStock;
        const stockWarning = isOutOfStock
          ? `<div class="stock-warning">⚠️ Only ${availableStock} available!</div>`
          : availableStock <= 5
            ? `<div class="stock-info">📦 ${availableStock} in stock</div>`
            : '';

        return `
          <div class="cart-item ${isOutOfStock ? 'out-of-stock' : ''}">
            <img src="${item.image}" alt="${item.name}" class="cart-item-image">
            <div class="cart-item-details">
              <div class="cart-item-name">${item.name}</div>
              <div class="cart-item-price">$${item.price.toFixed(2)} each</div>
              ${stockWarning}
            </div>
            <div class="cart-item-controls">
              <div class="quantity-control">
                <button class="quantity-btn" onclick="cart.updateQuantity('${item.id}', ${item.quantity - 1})">-</button>
                <span class="quantity-value">${item.quantity}</span>
                <button class="quantity-btn" onclick="cart.updateQuantity('${item.id}', ${item.quantity + 1})">+</button>
              </div>
              <button class="remove-item" onclick="cart.removeItem('${item.id}')">Remove</button>
            </div>
          </div>
        `;
      }).join('');

      // Disable checkout if any items are out of stock
      const hasOutOfStock = this.items.some(item =>
        item.quantity > (this.inventory[item.id] || 0)
      );
      checkoutButton.disabled = hasOutOfStock;
    }

    cartTotalElement.textContent = `$${this.getTotal().toFixed(2)}`;
  }

  // Attach event listeners
  attachEventListeners() {
    // Cart button click
    document.addEventListener('DOMContentLoaded', () => {
      const cartButton = document.getElementById('cart-button');
      if (cartButton) {
        cartButton.addEventListener('click', (e) => {
          e.preventDefault();
          this.toggleCart();
        });
      }

      // Close cart button
      const closeButton = document.getElementById('close-cart');
      if (closeButton) {
        closeButton.addEventListener('click', () => this.closeCart());
      }

      // Click outside cart to close
      const overlay = document.getElementById('cart-overlay');
      if (overlay) {
        overlay.addEventListener('click', (e) => {
          if (e.target === overlay) {
            this.closeCart();
          }
        });
      }

      // Checkout button
      const checkoutButton = document.getElementById('checkout-button');
      if (checkoutButton) {
        checkoutButton.addEventListener('click', () => this.checkout());
      }

      // Clear cart button
      const clearCartButton = document.getElementById('clear-cart-button');
      if (clearCartButton) {
        clearCartButton.addEventListener('click', () => {
          if (confirm('Are you sure you want to clear your cart?')) {
            this.clearCart();
          }
        });
      }
    });
  }

  // Show error message in cart
  showCartError(message) {
    const errorElement = document.getElementById('cart-error-message');
    if (errorElement) {
      errorElement.innerHTML = message;
      errorElement.style.display = 'block';

      // Scroll to top of cart to see error
      const cartItems = document.getElementById('cart-items');
      if (cartItems) {
        cartItems.scrollTop = 0;
      }
    }
  }

  // Hide error message
  hideCartError() {
    const errorElement = document.getElementById('cart-error-message');
    if (errorElement) {
      errorElement.style.display = 'none';
    }
  }

  // Checkout with Stripe
  async checkout() {
    // Hide any previous errors
    this.hideCartError();

    if (this.items.length === 0) {
      this.showCartError('<strong>Cart is empty</strong><br>Please add items to your cart before checking out.');
      return;
    }

    // Disable checkout button to prevent double-clicks
    const checkoutButton = document.getElementById('checkout-button');
    checkoutButton.disabled = true;
    checkoutButton.textContent = 'Processing...';

    try {
      // Send cart data to our PHP backend
      const response = await fetch('create-checkout.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: this.items
        })
      });

      if (!response.ok) {
        const errorData = await response.json();

        // Format out of stock error nicely
        if (errorData.outOfStock && errorData.outOfStock.length > 0) {
          const outOfStockList = errorData.outOfStock.map(item =>
            `• <strong>${item.name}</strong>: You want ${item.requested}, but only ${item.available} available`
          ).join('<br>');

          this.showCartError(`<strong>Some items are out of stock:</strong><br>${outOfStockList}<br><br>Please adjust quantities and try again.`);
        } else {
          this.showCartError(`<strong>Checkout Error:</strong><br>${errorData.error || 'Failed to create checkout session'}`);
        }

        // Re-enable the checkout button
        checkoutButton.disabled = false;
        checkoutButton.textContent = 'Proceed to Checkout';
        return;
      }

      const session = await response.json();

      // Redirect to Stripe Checkout page
      if (session.url) {
        window.location.href = session.url;
      } else {
        throw new Error('No checkout URL received');
      }

    } catch (error) {
      console.error('Checkout error:', error);
      this.showCartError(`<strong>Error:</strong><br>${error.message}<br><br>Please try again or contact support if the problem persists.`);

      // Re-enable the checkout button
      checkoutButton.disabled = false;
      checkoutButton.textContent = 'Proceed to Checkout';
    }
  }
}

// Initialize cart
const cart = new ShoppingCart();

// Helper function to add item to cart from buttons
function addToCart(id, name, price, image) {
  cart.addItem(id, name, price, image);
}
