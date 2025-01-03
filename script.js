class UserService {
    constructor() {
        this.users = JSON.parse(localStorage.getItem('users')) || [{ username: 'admin', password: 'admin123', role: 'admin' }];
        this.currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;
        this.isLoggedIn = !!this.currentUser;
    }

    login(username, password) {
        const user = this.users.find(u => u.username === username && u.password === password);
        if (user) {
            this.isLoggedIn = true;
            this.currentUser = user;
            localStorage.setItem('currentUser', JSON.stringify(user));
            return true;
        }
        return false;
    }

    register(username, password) {
        if (this.users.find(u => u.username === username)) {
            return false;
        }
        this.users.push({ username, password, role: 'user' });
        localStorage.setItem('users', JSON.stringify(this.users));
        return true;
    }

    logout() {
        this.isLoggedIn = false;
        this.currentUser = null;
        localStorage.removeItem('currentUser');
    }
}

class ProductService {
    constructor() {
        this.products = JSON.parse(localStorage.getItem('products')) || [
            { id: 1, name: 'Rolex Submariner', description: 'Классические часы с автоматическим подзаводом', image: 'https://www.watchclub.com/upload/watches/gallery_big/watch-club-rolex-submariner-date-rolex-warranty-to-dec-2023-ref-116610ln-year-2018-13923-wb.jpgwbwbwbwbwb1.jpg', price: 600000, currency: '₽', category: 'Классические' },
            { id: 2, name: 'Omega Seamaster', description: 'Спортивные часы с хронографом', image: 'https://chasogolik.ru/wp-content/uploads/2018/04/Omega-Seamaster-Diver-300M-2.jpg', price: 450000, currency: '₽', category: 'Спортивные' },
            { id: 3, name: 'Tag Heuer Carrera', description: 'Роскошные часы для особых случаев', image: 'https://i.pinimg.com/originals/98/4a/4b/984a4b23dcb44dc4f9de7ae1f330b492.png', price: 300000, currency: '₽', category: 'Роскошные' }
        ];
        this.cart = JSON.parse(localStorage.getItem('cart')) || [];
    }

    addProduct(name, description, image, price, category) {
        const newProduct = {
            id: this.products.length + 1,
            name,
            description,
            image,
            price,
            currency: '₽', // Устанавливаем валюту по умолчанию на рубли
            category
        };
        this.products.push(newProduct);
        localStorage.setItem('products', JSON.stringify(this.products));
    }

    updateProduct(id, name, description, image, price, category) {
        const product = this.getProductById(id);
        if (product) {
            product.name = name;
            product.description = description;
            product.image = image;
            product.price = price;
            product.category = category;
            localStorage.setItem('products', JSON.stringify(this.products));
        }
    }

    deleteProduct(id) {
        this.products = this.products.filter(product => product.id !== id);
        localStorage.setItem('products', JSON.stringify(this.products));
    }

    getProducts() {
        return this.products;
    }

    getProductById(id) {
        return this.products.find(product => product.id === id);
    }

    getProductsByCategory(category) {
        return this.products.filter(product => product.category === category);
    }

    getAllCategories() {
        const categories = new Set(this.products.map(product => product.category));
        return Array.from(categories);
    }

    addToCart(product) {
        this.cart.push(product);
        localStorage.setItem('cart', JSON.stringify(this.cart));
    }

    removeFromCart(productId) {
        this.cart = this.cart.filter(product => product.id !== productId);
        localStorage.setItem('cart', JSON.stringify(this.cart));
    }

    getCart() {
        return this.cart;
    }
}

class MenuService {
    constructor() {
        this.isMenuOpen = false;
    }

    openMenu() {
        document.getElementById('sidebar').style.left = '0';
        this.isMenuOpen = true;
    }

    closeMenu() {
        document.getElementById('sidebar').style.left = '-300px';
        this.isMenuOpen = false;
    }
}

const userService = new UserService();
const productService = new ProductService();
const menuService = new MenuService();

function loadPage(page) {
    const mainContent = document.getElementById('mainContent');

    switch (page) {
        case 'home':
            mainContent.innerHTML = `
                <div class="welcome-block">
                    <h2>Добро пожаловать в WatchApp!</h2>
                    <p>На нашем приложении вы найдете самые стильные и функциональные часы.</p>
                </div>
                <section class="news-section">
                    <h3>Новости</h3>
                    <article>
                        <h4>Новая коллекция часов!</h4>
                        <p>Мы представляем нашу новую коллекцию стильных и современных часов! Не пропустите шанс стать владельцем уникального аксессуара.</p>
                    </article>
                    <article>
                        <h4>Скидки на прошлые коллекции</h4>
                        <p>Предложение ограничено! Успейте купить часы из прошлых коллекций по сниженным ценам!</p>
                    </article>
                    <article>
                        <h4>Специальные предложения для подписчиков</h4>
                        <p>Подпишитесь на рассылку и получайте специальные предложения и новости о новых поступлениях.</p>
                    </article>
                </section>`;
            break;
        case 'products':
            const addProductButton = userService.currentUser && userService.currentUser.role === 'admin'
                ? `<button onclick="loadPage('addProduct')">Добавить товар</button>`
                : '';
            mainContent.innerHTML = `${addProductButton}
                <h2>Наши товары</h2>
                <div class="filter-section">
                    <input type="text" id="searchInput" placeholder="Поиск по названию" onkeyup="filterProducts()">
                    <select id="categoryFilter" onchange="filterProducts()">
                        <option value="">Все категории</option>
                        ${productService.getAllCategories().map(category => `<option value="${category}">${category}</option>`).join('')}
                    </select>
                    <input type="number" id="minPrice" placeholder="Мин. цена" onkeyup="filterProducts()">
                    <input type="number" id="maxPrice" placeholder="Макс. цена" onkeyup="filterProducts()">
                </div>
                <div id="productList" class="product-grid"></div>`;

            filterProducts();
            break;
        case 'about':
            mainContent.innerHTML = `
                <h1>О компании</h1>
                <p>Мы продаем уникальные часы с любовью и вниманием к деталям.</p>
                <p>Наша миссия - сделать так, чтобы каждый человек мог найти часы, которые идеально подходят его стилю и потребностям. Мы гордимся тем, что наши часы носят люди по всему миру, и мы продолжаем работать над тем, чтобы улучшать наши продукты и услуги.</p>
                <p>Спасибо, что выбрали нас!</p>`;
            break;
        case 'login':
            mainContent.innerHTML = `
                <div class="auth-form">
                    <h2>Авторизация</h2>
                    <form id="loginForm">
                        <input type="text" id="username" placeholder="Логин" required>
                        <input type="password" id="password" placeholder="Пароль" required>
                        <button type="submit">Войти</button>
                    </form>
                    <div id="message" style="display: none; color: red;">Неверный логин или пароль!</div>
                    <p>Нет аккаунта? <a href="javascript:void(0);" onclick="loadPage('register')">Зарегистрироваться</a></p>
                </div>`;
            document.getElementById('loginForm').addEventListener('submit', (event) => {
                event.preventDefault();
                const username = document.getElementById('username').value;
                const password = document.getElementById('password').value;
                if (userService.login(username, password)) {
                    alert('Вы успешно вошли!');
                    loadPage('profile');
                } else {
                    document.getElementById('message').style.display = 'block';
                }
            });
            break;
        case 'register':
            mainContent.innerHTML = `
                <div class="auth-form">
                    <h2>Регистрация</h2>
                    <form id="registerForm">
                        <input type="text" id="newUsername" placeholder="Логин" required>
                        <input type="password" id="newPassword" placeholder="Пароль" required>
                        <button type="submit">Зарегистрироваться</button>
                    </form>
                    <div id="registerMessage" style="display: none; color: green;">Вы успешно зарегистрированы!</div>
                    <p>Уже есть аккаунт? <a href="javascript:void(0);" onclick="loadPage('login')">Войти</a></p>
                </div>`;
            document.getElementById('registerForm').addEventListener('submit', (event) => {
                event.preventDefault();
                const username = document.getElementById('newUsername').value;
                const password = document.getElementById('newPassword').value;
                if (userService.register(username, password)) {
                    document.getElementById('registerMessage').style.display = 'block';
                    alert('Вы успешно зарегистрированы!');
                    loadPage('login');
                } else {
                    alert('Пользователь с таким логином уже существует!');
                }
            });
            break;
        case 'profile':
            mainContent.innerHTML = `
                <h2>Профиль пользователя</h2>
                <div id="profileInfo"></div>
                <form id="profileForm">
                    <input type="file" id="profileImageInput" accept="image/*">
                    <button type="submit">Сохранить</button>
                </form>
                <div id="profileImage"></div>`;
            updateProfileInfo();
            document.getElementById('profileForm').addEventListener('submit', updateProfile);
            break;
        case 'addProduct':
            mainContent.innerHTML = `
                <h2>Добавить товар</h2>
                <form id="addProductForm" class="add-product-form">
                    <input type="text" id="productName" placeholder="Название товара" required>
                    <textarea id="productDescription" placeholder="Описание товара" required></textarea>
                    <input type="file" id="productImage" accept="image/*" required>
                    <input type="number" id="productPrice" placeholder="Цена товара" required>
                    <input type="text" id="productCategory" placeholder="Категория товара" required>
                    <button type="submit">Добавить товар</button>
                </form>`;
            document.getElementById('addProductForm').addEventListener('submit', (event) => {
                event.preventDefault();
                const name = document.getElementById('productName').value;
                const description = document.getElementById('productDescription').value;
                const imageFile = document.getElementById('productImage').files[0];
                const price = document.getElementById('productPrice').value;
                const category = document.getElementById('productCategory').value;

                if (name && description && imageFile && price && category) {
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        const image = e.target.result;
                        productService.addProduct(name, description, image, price, category);
                        alert("Товар добавлен успешно!");
                        loadPage('products');
                    };
                    reader.readAsDataURL(imageFile);
                } else {
                    alert("Пожалуйста, заполните все поля.");
                }
            });
            break;
        case 'editProduct':
            const productId = sessionStorage.getItem('editProductId');
            const product = productService.getProductById(parseInt(productId));
            mainContent.innerHTML = `
                <h2>Редактировать товар</h2>
                <form id="editProductForm" class="add-product-form">
                    <input type="text" id="productName" placeholder="Название товара" value="${product.name}" required>
                    <textarea id="productDescription" placeholder="Описание товара" required>${product.description}</textarea>
                    <input type="file" id="productImage" accept="image/*">
                    <input type="number" id="productPrice" placeholder="Цена товара" value="${product.price}" required>
                    <input type="text" id="productCategory" placeholder="Категория товара" value="${product.category}" required>
                    <button type="submit">Сохранить изменения</button>
                </form>`;
            document.getElementById('editProductForm').addEventListener('submit', (event) => {
                event.preventDefault();
                const name = document.getElementById('productName').value;
                const description = document.getElementById('productDescription').value;
                const imageFile = document.getElementById('productImage').files[0];
                const price = document.getElementById('productPrice').value;
                const category = document.getElementById('productCategory').value;

                if (name && description && price && category) {
                    let image = product.image;
                    if (imageFile) {
                        const reader = new FileReader();
                        reader.onload = (e) => {
                            image = e.target.result;
                            productService.updateProduct(parseInt(productId), name, description, image, price, category);
                            alert("Товар обновлен успешно!");
                            loadPage('products');
                        };
                        reader.readAsDataURL(imageFile);
                    } else {
                        productService.updateProduct(parseInt(productId), name, description, image, price, category);
                        alert("Товар обновлен успешно!");
                        loadPage('products');
                    }
                } else {
                    alert("Пожалуйста, заполните все поля.");
                }
            });
            break;
        case 'cart':
            mainContent.innerHTML = `
                <h2>Корзина</h2>
                <div id="cartList" class="cart"></div>`;
            updateCart();
            break;
    }
    updateAuthUI();
}

function addToCart(productId, event) {
    event.stopPropagation();
    if (!userService.isLoggedIn) {
        alert('Пожалуйста, авторизуйтесь, чтобы добавить товар в корзину.');
        loadPage('login');
        return;
    }
    const product = productService.getProductById(productId);
    productService.addToCart(product);
    alert('Товар добавлен в корзину!');
    updateCart();
}

function removeFromCart(productId) {
    productService.removeFromCart(productId);
    updateCart();
}

function updateCart() {
    const cartListEl = document.getElementById('cartList');
    const cartItems = productService.getCart();
    if (cartItems.length === 0) {
        cartListEl.innerHTML = '<p>Ваша корзина пуста.</p>';
    } else {
        cartListEl.innerHTML = '';
        cartItems.forEach(item => {
            cartListEl.innerHTML += `
                <div class="cart-item">
                    <img src="${item.image}" alt="${item.name}">
                    <div>
                        <h3>${item.name}</h3>
                        <p>${item.price} ${item.currency}</p>
                    </div>
                    <button class="remove-from-cart" onclick="removeFromCart(${item.id})">Удалить</button>
                </div>`;
        });
    }
}

function viewProduct(productId) {
    const product = productService.getProductById(productId);
    const mainContent = document.getElementById('mainContent');
    mainContent.innerHTML = `
        <div class="product-details">
            <h2>${product.name}</h2>
            <img src="${product.image}" alt="${product.name}">
            <p>${product.description}</p>
            <p><strong>Цена:</strong> ${product.price} ${product.currency}</p>
            <button onclick="loadPage('products')">Назад к товарам</button>
        </div>`;
}

function updateProfile(event) {
    event.preventDefault();
    const profileImageInput = document.getElementById('profileImageInput').files[0];
    if (profileImageInput) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const newProfileImage = e.target.result;
            if (userService.currentUser) {
                userService.currentUser.profileImage = newProfileImage;
                localStorage.setItem('currentUser', JSON.stringify(userService.currentUser));
                updateProfileInfo();
            }
            alert('Профиль обновлен!');
        };
        reader.readAsDataURL(profileImageInput);
    } else {
        alert('Пожалуйста, выберите изображение.');
    }
}

function updateProfileInfo() {
    const profilePhoto = document.getElementById('profilePhoto');
    const profileName = document.getElementById('profileName');
    profilePhoto.src = userService.currentUser && userService.currentUser.profileImage ? userService.currentUser.profileImage : 'default_avatar.png';
    profileName.textContent = userService.currentUser ? userService.currentUser.username : 'Гость';
}

function updateAuthUI() {
    const authButtons = document.getElementById('authButtons');
    if (userService.isLoggedIn) {
        authButtons.innerHTML = `<a href="javascript:void(0);" onclick="logout()">Выход</a>`;
    } else {
        authButtons.innerHTML = `
            <a href="javascript:void(0);" onclick="loadPage('login')">Авторизация</a>
            <a href="javascript:void(0);" onclick="loadPage('register')">Регистрация</a>`;
    }
}

function logout() {
    userService.logout();
    updateProfileInfo();
    loadPage('home');
}

function filterProducts() {
    const searchInput = document.getElementById('searchInput').value.toLowerCase();
    const categoryFilter = document.getElementById('categoryFilter').value;
    const minPrice = parseFloat(document.getElementById('minPrice').value) || 0;
    const maxPrice = parseFloat(document.getElementById('maxPrice').value) || Infinity;
    const productListEl = document.getElementById('productList');
    const filteredProducts = productService.getProducts().filter(product =>
        product.name.toLowerCase().includes(searchInput) &&
        (categoryFilter === '' || product.category === categoryFilter) &&
        product.price >= minPrice &&
        product.price <= maxPrice
    );

    productListEl.innerHTML = '';
    filteredProducts.forEach(product => {
        const editButton = userService.currentUser && userService.currentUser.role === 'admin'
            ? `<button class="edit-product" onclick="editProduct(${product.id}, event)">Редактировать</button>`
            : '';
        const deleteButton = userService.currentUser && userService.currentUser.role === 'admin'
            ? `<button class="delete-product" onclick="deleteProduct(${product.id}, event)">Удалить</button>`
            : '';
        productListEl.innerHTML += `
            <div class="product-card" onclick="viewProduct(${product.id})">
                <img src="${product.image}" alt="${product.name}">
                <h3>${product.name}</h3>
                <p>${product.description}</p>
                <p><strong>Цена:</strong> ${product.price} ${product.currency}</p>
                <div style="margin-bottom: 1rem;"></div>
                <button class="add-to-cart" onclick="addToCart(${product.id}, event)">Добавить в корзину</button>
                ${editButton}
                ${deleteButton}
            </div>`;
    });
}

function editProduct(productId, event) {
    event.stopPropagation();
    sessionStorage.setItem('editProductId', productId);
    loadPage('editProduct');
}

function deleteProduct(productId, event) {
    event.stopPropagation();
    if (confirm('Вы уверены, что хотите удалить этот товар?')) {
        productService.deleteProduct(productId);
        alert('Товар удален успешно!');
        loadPage('products');
    }
}

document.getElementById('menuToggle').addEventListener('click', () => {
    menuService.openMenu();
});

document.getElementById('closeMenu').addEventListener('click', () => {
    menuService.closeMenu();
});

document.getElementById('profilePhoto').addEventListener('click', () => {
    if (userService.isLoggedIn) {
        loadPage('profile');
    } else {
        loadPage('login');
    }
});

let startX;
document.addEventListener('touchstart', (event) => {
    startX = event.touches[0].clientX;
});

document.addEventListener('touchmove', (event) => {
    const currentX = event.touches[0].clientX;
    const deltaX = currentX - startX;
    if (deltaX > 50 && !menuService.isMenuOpen) {
        menuService.openMenu();
    } else if (deltaX < -50 && menuService.isMenuOpen) {
        menuService.closeMenu();
    }
});

document.addEventListener('click', function(event) {
    const sidebar = document.getElementById('sidebar');
    const menuToggleButton = document.getElementById('menuToggle');
    if (menuService.isMenuOpen && !sidebar.contains(event.target) && !menuToggleButton.contains(event.target)) {
        menuService.closeMenu();
    }
});

// Инициализация
loadPage('home');
updateProfileInfo();
