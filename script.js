const products = [
  {
    id: 1,
    name: "Fresh Apples",
    category: "Fruits",
    price: 160,
    unit: "1 kg",
    image: "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=500&q=80"
  },
  {
    id: 2,
    name: "Fresh Bananas",
    category: "Fruits",
    price: 60,
    unit: "1 dozen",
    image: "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=500&q=80"
  },
  {
    id: 3,
    name: "Red Tomatoes",
    category: "Vegetables",
    price: 40,
    unit: "1 kg",
    image: "https://images.unsplash.com/photo-1546094096-0df4bcaaa337?auto=format&fit=crop&w=500&q=80"
  },
  {
    id: 4,
    name: "Fresh Broccoli",
    category: "Vegetables",
    price: 80,
    unit: "1 piece",
    image: "https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?auto=format&fit=crop&w=500&q=80"
  },
  {
    id: 5,
    name: "Fresh Milk",
    category: "Dairy",
    price: 32,
    unit: "500 ml",
    image: "https://images.unsplash.com/photo-1563636619-e9143da7973b?auto=format&fit=crop&w=500&q=80"
  },
  {
    id: 6,
    name: "Brown Bread",
    category: "Bakery",
    price: 45,
    unit: "1 loaf",
    image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=500&q=80"
  },
  {
    id: 7,
    name: "Fresh Oranges",
    category: "Fruits",
    price: 90,
    unit: "1 kg",
    image: "https://images.unsplash.com/photo-1547514701-42782101795e?auto=format&fit=crop&w=500&q=80"
  },
  {
    id: 8,
    name: "Fresh Carrots",
    category: "Vegetables",
    price: 50,
    unit: "1 kg",
    image: "https://images.unsplash.com/photo-1445282768818-728615cc910a?auto=format&fit=crop&w=500&q=80"
  },
  {
    id: 9,
    name: "Farm Eggs",
    category: "Dairy",
    price: 90,
    unit: "6 pieces",
    image: "https://images.unsplash.com/photo-1506976785307-8732e854ad03?auto=format&fit=crop&w=500&q=80"
  },
  {
    id: 10,
    name: "Rice",
    category: "Staples",
    price: 70,
    unit: "1 kg",
    image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=500&q=80"
  },
  {
    id: 11,
    name: "Fresh Grapes",
    category: "Fruits",
    price: 100,
    unit: "500 g",
    image: "https://images.unsplash.com/photo-1537640538966-79f369143f8f?auto=format&fit=crop&w=500&q=80"
  },
  {
    id: 12,
    name: "Potatoes",
    category: "Vegetables",
    price: 35,
    unit: "1 kg",
    image: "https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=500&q=80"
  }
];

const productGrid = document.getElementById("productGrid");
const searchInput = document.getElementById("searchInput");
const resultMessage = document.getElementById("resultMessage");
const categoryButtons = document.querySelectorAll(".category");

const cartBtn = document.getElementById("cartBtn");
const cartDrawer = document.getElementById("cartDrawer");
const cartOverlay = document.getElementById("cartOverlay");
const closeCartBtn = document.getElementById("closeCart");
const cartItems = document.getElementById("cartItems");
const cartCount = document.getElementById("cartCount");
const cartTotal = document.getElementById("cartTotal");
const checkoutBtn = document.getElementById("checkoutBtn");

const menuToggle = document.getElementById("menuToggle");
const navMenu = document.getElementById("navMenu");

const loginBtn = document.getElementById("loginBtn");
const loginModal = document.getElementById("loginModal");
const closeLogin = document.getElementById("closeLogin");
const loginForm = document.getElementById("loginForm");
const customerName = document.getElementById("customerName");
const customerEmail = document.getElementById("customerEmail");
const loginMessage = document.getElementById("loginMessage");

const toast = document.getElementById("toast");

let selectedCategory = "All";
let cart = loadCart();
let toastTimer;

function loadCart() {
  try {
    const saved = JSON.parse(localStorage.getItem("freshmart-cart"));
    if (!Array.isArray(saved)) return [];

    return saved
      .filter(item =>
        products.some(product =>
          product.id === item.id
        ) &&
        Number.isInteger(item.quantity) &&
        item.quantity > 0 &&
        item.quantity <= 99
      )
      .map(item => ({
        id: item.id,
        quantity: item.quantity
      }));
  } catch {
    return [];
  }
}

function saveCart() {
  try {
    localStorage.setItem("freshmart-cart", JSON.stringify(cart));
  } catch {
    // The cart still works during this session.
  }
}

function formatPrice(price) {
  return "₹" + price.toLocaleString("en-IN");
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");

  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.classList.remove("show");
  }, 2500);
}

function renderProducts() {
  const searchTerm = searchInput.value.trim().toLowerCase();

  const filteredProducts = products.filter(product => {
    const matchesCategory =
      selectedCategory === "All" ||
      product.category === selectedCategory;

    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm) ||
      product.category.toLowerCase().includes(searchTerm);

    return matchesCategory && matchesSearch;
  });

  resultMessage.textContent =
    `${filteredProducts.length} product(s) found`;

  if (filteredProducts.length === 0) {
    productGrid.innerHTML = `
      <div class="empty-products">
        <h3>No products found</h3>
        <p>Try another product name or category.</p>
      </div>`;
    return;
  }

  productGrid.innerHTML = filteredProducts.map(product => `
    <article class="product-card">
      <img
        class="product-image"
        src="${product.image}"
        alt="${product.name}"
        loading="lazy"
      >
      <div class="product-info">
        <p class="product-category">${product.category}</p>
        <h3>${product.name}</h3>
        <p class="product-unit">${product.unit}</p>
        <div class="product-bottom">
          <span class="product-price">${formatPrice(product.price)}</span>
          <button class="add-button" data-add="${product.id}">
            + Add
          </button>
        </div>
      </div>
    </article>
  `).join("");
}

function addToCart(productId) {
  const existingItem = cart.find(item => item.id === productId);

  if (existingItem) {
    if (existingItem.quantity >= 99) {
      showToast("Maximum quantity is 99.");
      return;
    }
    existingItem.quantity += 1;
  } else {
    cart.push({ id: productId, quantity: 1 });
  }

  saveCart();
  renderCart();
  showToast("Product added to your cart!");
}

function changeQuantity(productId, amount) {
  const item = cart.find(item => item.id === productId);
  if (!item) return;

  item.quantity += amount;

  if (item.quantity <= 0) {
    cart = cart.filter(item => item.id !== productId);
  } else if (item.quantity > 99) {
    item.quantity = 99;
    showToast("Maximum quantity is 99.");
  }

  saveCart();
  renderCart();
}

function removeFromCart(productId) {
  cart = cart.filter(item => item.id !== productId);
  saveCart();
  renderCart();
  showToast("Product removed from cart.");
}

function renderCart() {
  const totalQuantity = cart.reduce(
    (total, item) => total + item.quantity, 0
  );

  const totalPrice = cart.reduce((total, item) => {
    const product = products.find(p => p.id === item.id);
    return total + (product ? product.price * item.quantity : 0);
  }, 0);

  cartCount.textContent = totalQuantity;
  cartTotal.textContent = formatPrice(totalPrice);

  if (cart.length === 0) {
    cartItems.innerHTML = `
      <div class="cart-empty">
        <div>🛒</div>
        <h3>Your cart is empty</h3>
        <p>Add some fresh groceries to get started.</p>
      </div>`;
    return;
  }

  cartItems.innerHTML = cart.map(item => {
    const product = products.find(p => p.id === item.id);
    if (!product) return "";

    return `
      <div class="cart-item">
        <img src="${product.image}" alt="${product.name}">
        <div>
          <h3>${product.name}</h3>
          <p class="item-price">
            ${formatPrice(product.price * item.quantity)}
          </p>
          <div class="quantity-controls">
            <button data-change="${product.id}" data-amount="-1"
              aria-label="Decrease ${product.name}">−</button>
            <span>${item.quantity}</span>
            <button data-change="${product.id}" data-amount="1"
              aria-label="Increase ${product.name}">+</button>
          </div>
          <button class="remove-button" data-remove="${product.id}">
            Remove
          </button>
        </div>
      </div>
    `;
  }).join("");
}

function openCart() {
  cartDrawer.classList.add("open");
  cartOverlay.classList.add("show");
  cartDrawer.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
  closeCartBtn.focus();
}

function closeCart() {
  cartDrawer.classList.remove("open");
  cartOverlay.classList.remove("show");
  cartDrawer.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

function openLogin() {
  navMenu.classList.remove("show");
  menuToggle.setAttribute("aria-expanded", "false");
  loginMessage.textContent = "";
  loginModal.classList.add("show");
  loginModal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
  customerName.focus();
}

function closeLoginModal() {
  loginModal.classList.remove("show");
  loginModal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

productGrid.addEventListener("click", event => {
  const button = event.target.closest("[data-add]");
  if (button) addToCart(Number(button.dataset.add));
});

cartItems.addEventListener("click", event => {
  const quantityButton = event.target.closest("[data-change]");
  const removeButton = event.target.closest("[data-remove]");

  if (quantityButton) {
    changeQuantity(
      Number(quantityButton.dataset.change),
      Number(quantityButton.dataset.amount)
    );
  }

  if (removeButton) {
    removeFromCart(Number(removeButton.dataset.remove));
  }
});

searchInput.addEventListener("input", renderProducts);

categoryButtons.forEach(button => {
  button.addEventListener("click", () => {
    selectedCategory = button.dataset.category;

    categoryButtons.forEach(categoryButton => {
      categoryButton.classList.toggle(
        "active",
        categoryButton === button
      );
    });

    renderProducts();
  });
});

cartBtn.addEventListener("click", openCart);
closeCartBtn.addEventListener("click", closeCart);
cartOverlay.addEventListener("click", closeCart);

checkoutBtn.addEventListener("click", () => {
  if (cart.length === 0) {
    showToast("Your cart is empty.");
    return;
  }

  showToast("Demo only: connect a backend for real checkout.");
});

menuToggle.addEventListener("click", () => {
  const isOpen = navMenu.classList.toggle("show");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.textContent = isOpen ? "✕" : "☰";
});

navMenu.querySelectorAll("a").forEach(link => {
  link.addEventListener("click", () => {
    navMenu.classList.remove("show");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.textContent = "☰";
  });
});

loginBtn.addEventListener("click", openLogin);
closeLogin.addEventListener("click", closeLoginModal);

loginModal.addEventListener("click", event => {
  if (event.target === loginModal) closeLoginModal();
});

loginForm.addEventListener("submit", event => {
  event.preventDefault();

  const name = customerName.value.trim();
  const email = customerEmail.value.trim();

  if (!name || !email) return;

  // Demo greeting only. No password or account is created.
  loginMessage.textContent = `Welcome, ${name}! Demo sign-in complete.`;
  showToast(`Welcome to FreshMart, ${name}!`);
  loginBtn.textContent = `Hi, ${name.split(" ")[0]}`;

  setTimeout(closeLoginModal, 1200);
});

document.addEventListener("keydown", event => {
  if (event.key === "Escape") {
    closeCart();
    closeLoginModal();
    navMenu.classList.remove("show");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.textContent = "☰";
  }
});

document.getElementById("year").textContent =
  new Date().getFullYear();

renderProducts();
renderCart();