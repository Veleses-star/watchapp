class UserService {
    constructor() {
        this.users = [{ username: 'admin', password: 'admin123', role: 'admin' }];
        this.currentUser = null;
        this.isLoggedIn = false;
    }

    login(username, password) {
        const user = this.users.find(u => u.username === username && u.password === password);
        if (user) {
            this.isLoggedIn = true;
            this.currentUser = user;
            return true;
        }
        return false;
    }

    register(username, password) {
        if (this.users.find(u => u.username === username)) {
            return false;
        }
        this.users.push({ username, password, role: 'user' });
        return true;
    }

    logout() {
        this.isLoggedIn = false;
        this.currentUser = null;
    }
}

class ProductService {
    constructor() {
        this.products = [
            { id: 1, name: 'Rolex Submariner', description: 'Классические часы с автоматическим подзаводом', image: 'https://via.placeholder.com/150', price: 600000, currency: '₽', category: 'Классические' },
            { id: 2, name: 'Omega Seamaster', description: 'Спортивные часы с хронографом', image: 'https://via.placeholder.com/150', price: 450000, currency: '₽', category: 'Спортивные' },
            { id: 3, name: 'Tag Heuer Carrera', description: 'Роскошные часы для особых случаев', image: 'https://via.placeholder.com/150', price: 300000, currency: '₽', category: 'Роскошные' }
        ];
        this.cart = [];
    }

    addProduct(name, description, image, price, currency, category) {
        const newProduct = {
            id: this.products.length + 1,
            name,
            description,
            image,
            price,
            currency,
            category
        };
        this.products.push(newProduct);
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
    }

    removeFromCart(productId) {
        this.cart = this.cart.filter(product => product.id !== productId);
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
                <h2>Добро пожаловать в WatchApp!</h2>
                <p>На нашем приложении вы найдете самые стильные и функциональные часы.</p>
                <section class="news">
                    <h3>Новости</h3>
                    <article>
                        <h4>Новая коллекция часов!</h4>
                        <p>Мы представляем нашу новую коллекцию стильных и современных часов! Не пропустите шанс стать владельцем уникального аксессуара.</p>
                    </article>
                    <article>
                        <h4>Скидки на прошлые коллекции</h4>
                        <p>Предложение ограничено! Успейте купить часы из прошлой коллекции по сниженным ценам!</p>
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
            mainContent.innerHTML = `${addProductButton}<h2>Наши товары</h2><div id="productList" class="product-grid"></div>`;

            const productListEl = document.getElementById('productList');
            const categories = productService.getAllCategories();
            categories.forEach(category => {
                productListEl.innerHTML += `<h3>${category}</h3>`;
                productService.getProductsByCategory(category).forEach(product => {
                    productListEl.innerHTML += `
                        <div class="product-card" onclick="viewProduct(${product.id})">
                            <img src="${product.image}" alt="${product.name}">
                            <h3>${product.name}</h3>
                            <p>${product.price} ${product.currency}</p>
                            <button class="add-to-cart" onclick="addToCart(${product.id}, event)">Добавить в корзину</button>
                        </div>`;
                });
            });
            break;
        case 'about':
            mainContent.innerHTML = `
                <h1>О компании</h1>
                <p>Мы создаем уникальные часы с любовью и вниманием к деталям.</p>`;
            break;
        case 'login':
            mainContent.innerHTML = `
                <h2>Авторизация</h2>
                <form id="loginForm">
                    <input type="text" id="username" placeholder="Логин" required>
                    <input type="password" id="password" placeholder="Пароль" required>
                    <button type="submit">Войти</button>
                </form>
                <div id="message" style="display: none; color: red;">Неверный логин или пароль!</div>
                <p>Нет аккаунта? <a href="javascript:void(0);" onclick="loadPage('register')">Зарегистрироваться</a></p>`;
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
                <h2>Регистрация</h2>
                <form id="registerForm">
                    <input type="text" id="newUsername" placeholder="Логин" required>
                    <input type="password" id="newPassword" placeholder="Пароль" required>
                    <button type="submit">Зарегистрироваться</button>
                </form>
                <div id="registerMessage" style="display: none; color: green;">Вы успешно зарегистрированы!</div>
                <p>Уже есть аккаунт? <a href="javascript:void(0);" onclick="loadPage('login')">Войти</a></p>`;
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
                    <input type="url" placeholder="Ссылка на ваше новое фото" required>
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
                    <input type="url" id="productImage" placeholder="URL изображения товара" required>
                    <input type="number" id="productPrice" placeholder="Цена товара" required>
                    <select id="productCurrency" required>
                        <option value="$">$</option>
                        <option value="₽">₽</option>
                        <option value="€">€</option>
                    </select>
                    <input type="text" id="productCategory" placeholder="Категория товара" required>
                    <button type="submit">Добавить товар</button>
                </form>`;
            document.getElementById('addProductForm').addEventListener('submit', (event) => {
                event.preventDefault();
                const name = document.getElementById('productName').value;
                const description = document.getElementById('productDescription').value;
                const image = document.getElementById('productImage').value;
                const price = document.getElementById('productPrice').value;
                const currency = document.getElementById('productCurrency').value;
                const category = document.getElementById('productCategory').value;

                if (name && description && image && price && currency && category) {
                    productService.addProduct(name, description, image, price, currency, category);
                    alert("Товар добавлен успешно!");
                    loadPage('products');
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
    const newProfileImage = event.target[0].value;
    if (userService.currentUser) {
        userService.currentUser.profileImage = newProfileImage;
        updateProfileInfo();
    }
    alert('Профиль обновлен!');
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

document.getElementById('menuToggle').addEventListener('click', () => {
    menuService.openMenu();
});

document.getElementById('closeMenu').addEventListener('click', () => {
    menuService.closeMenu();
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
