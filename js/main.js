document.addEventListener('DOMContentLoaded', function () {
    
    // ==================================================
    // ЧАСТИНА 1: ЗАГАЛЬНІ ФУНКЦІЇ (Працюють скрізь)
    // ==================================================

    // --- 1. Темна тема (Dark Mode) ---
    const themeBtn = document.getElementById('theme-toggle');
    const body = document.body;
    
    // Перевіряємо, чи збережена тема в пам'яті браузера
    if (localStorage.getItem('site-theme') === 'dark') {
        body.classList.add('dark-theme');
        if(themeBtn) themeBtn.textContent = '☀️';
    }

    if (themeBtn) {
        themeBtn.addEventListener('click', function () {
            body.classList.toggle('dark-theme');
            
            // Змінюємо іконку і зберігаємо вибір
            if (body.classList.contains('dark-theme')) {
                themeBtn.textContent = '☀️';
                localStorage.setItem('site-theme', 'dark');
            } else {
                themeBtn.textContent = '🌙';
                localStorage.setItem('site-theme', 'light');
            }
        });
    }

    // --- 2. Підсвітка меню при наведенні ---
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('mouseenter', () => {
            link.style.textDecoration = 'underline'; 
        });
        link.addEventListener('mouseleave', () => {
            link.style.textDecoration = 'none';
        });
    });

    // --- 3. Зміна розміру шрифту клавішами (ArrowUp / ArrowDown) ---
    let currentFontSize = 100; // Початковий розмір у відсотках %
    window.addEventListener('keydown', function (event) {
        // Працюємо тільки якщо натиснуті стрілки
        if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
            // 1. ЗУПИНЯЄМО ПРОКРУТКУ СТОРІНКИ
            event.preventDefault();

            if (event.key === 'ArrowUp') {
                // 2. ВСТАНОВЛЮЄМО ВЕРХНЮ МЕЖУ (щоб не було гігантського тексту)
                if (currentFontSize < 130) { // Максимум 130%
                    currentFontSize += 5;
                }
            }
            else if (event.key === 'ArrowDown') {
                // 3. ВСТАНОВЛЮЄМО НИЖНЮ МЕЖУ (щоб текст не зник)
                if (currentFontSize > 70) { // Мінімум 70%
                    currentFontSize -= 5;
                }
            }
            // Застосовуємо новий розмір
            document.body.style.fontSize = currentFontSize + '%';
        }
        // Якщо натиснули ESCAPE (скидаємо до 100%)
        else if (event.key === 'Escape') {
            currentFontSize = 100;
            document.body.style.fontSize = '100%';
            // Можна додати тимчасове повідомлення у консоль для перевірки
            console.log('Розмір шрифту скинуто до 100%');
        }
    });


    // ==================================================
    // ЧАСТИНА 2: ГОЛОВНА СТОРІНКА (index.html)
    // ==================================================
    
    // --- 4. Дата у футері ---
    const footerInfo = document.querySelector('.copyright');
    // Перевіряємо, чи ми ще не додали дату (щоб не дублювалася)
    if (footerInfo && !footerInfo.innerHTML.includes('Сьогодні:')) {
        const date = new Date().toLocaleDateString('uk-UA');
        footerInfo.innerHTML += ` <br> <span style="font-size: 0.9em; color: gray;">Сьогодні: ${date}</span>`;
    }

    // --- 5. Акордеон ("Читати далі") ---
    const toggleBtn = document.getElementById('toggle-btn');
    const moreText = document.getElementById('more-text');
    const dots = document.getElementById('dots');
    
    // Перевіряємо, чи є ці елементи на сторінці
    if (toggleBtn && moreText && dots) {
        toggleBtn.addEventListener('click', () => {
            if (moreText.style.display === 'none') {
                // ВІДКРИВАЄМО:
                moreText.style.display = 'inline'; // Текст стає в рядок
                dots.style.display = 'none';       // Ховаємо "..."
                toggleBtn.textContent = 'Згорнути'; 
            } else {
                // ЗАКРИВАЄМО:
                moreText.style.display = 'none';
                dots.style.display = 'inline';     // Повертаємо "..."
                toggleBtn.textContent = 'Читати далі';
            }
        });
    }


    // ==================================================
    // ЧАСТИНА 3: ВАЛІДАЦІЯ ФОРМИ (profile.html)
    // ==================================================

    const profileForm = document.querySelector('.profile-page form');

    if (profileForm) {
        profileForm.addEventListener('submit', function (event) {
            // Зупиняємо стандартну відправку форми на сервер
            event.preventDefault(); 
            
            clearErrors(); // Очищаємо старі помилки

            // --- Перевірка імені (мінімум 2 літери) ---
            const firstName = document.getElementById('first_name');
            if (firstName && firstName.value.trim().length < 2) {
                showError(firstName, "Ім'я має бути довшим за 1 букву");
                return; // СТОП! Далі не перевіряємо, поки не виправлять це
            }

            //--- Перевірка Прізвища (теж мінімум 2 літери) ---
            const lastName = document.getElementById('last_name');
            if (lastName && lastName.value.trim().length < 2) {
                showError(lastName, "Прізвище має бути довшим за 1 букву");
                return;
            }

            // --- Перевірка телефону (рівно 9 цифр) ---
            const phone = document.getElementById('phone');
            const phoneRegex = /^\d{9}$/; 
            if (phone && !phoneRegex.test(phone.value)) {
                showError(phone, "Номер має містити 9 цифр (без +380)");
                return;
            }

            // --- Перевірка пароля (ОНОВЛЕНО) ---
            const currentPass = document.getElementById('current_password');
            const newPass = document.getElementById('new_password');
            const confirmPass = document.getElementById('confirm_new_password');
            
            // Перевіряємо, чи користувач намагається змінити пароль 
            // (тобто ввів хоч щось у поле "Поточний" АБО "Новий")
            if ((currentPass && currentPass.value.length > 0) || (newPass && newPass.value.length > 0)) {
                // 1. Якщо ввели поточний, але забули новий
                if (newPass.value.length === 0) {
                    showError(newPass, "Введіть новий пароль");
                    return;
                }
                // 2. Якщо ввели новий, але не підтвердили поточним
                if (currentPass.value.length === 0) {
                    showError(currentPass, "Введіть поточний пароль");
                    return;
                }
                // 3. Перевірка довжини
                if (newPass.value.length < 8) {
                    showError(newPass, "Пароль має бути мінімум 8 символів");
                    return;
                }
                // 4. Перевірка співпадіння
                if (confirmPass && newPass.value !== confirmPass.value) {
                    showError(confirmPass, "Паролі не співпадають");
                    return;
                }
            }
            // --- ФІНІШ ---
            // Якщо код дійшов сюди, значить жоден return не спрацював.
            // Отже, всі дані правильні!
            console.log("=== Дані форми отримано ===");
            console.log("Ім'я:", firstName.value);
            console.log("Прізвище:", lastName.value);
            console.log("Телефон:", phone.value);
            console.log("Новий пароль:", newPass.value);
            alert("Дані успішно перевірено та 'збережено'!");
            // Бонус: зберігаємо ім'я користувача
            if (firstName) localStorage.setItem('userName', firstName.value);

            // Зберігаємо пароль (якщо він був змінений)
            if (newPass && newPass.value.length > 0) {
                localStorage.setItem('userPassword', newPass.value);
            }
        });
    }

    // --- Допоміжна функція: Показати помилку ---
    function showError(inputElement, messageText) {
        inputElement.classList.add('input-error'); // Додає червону рамку (з CSS)
        
        const msg = document.createElement('span');
        msg.className = 'error-message';
        msg.innerText = messageText;
        
        // Додаємо текст помилки в батьківський блок (після поля)
        inputElement.parentElement.appendChild(msg);
    }

    // --- Допоміжна функція: Очистити помилки ---
    function clearErrors() {
        const inputs = document.querySelectorAll('.input-error');
        inputs.forEach(el => el.classList.remove('input-error'));
        
        const msgs = document.querySelectorAll('.error-message');
        msgs.forEach(el => el.remove());
    }

    /* --- ЗАВДАННЯ 2.1: Маніпуляція елементами --- */

    function executeLabTask() {
        // 1. Знайти всі елементи з класом '.product-card'
        const allCards = document.querySelectorAll('.product-card'); 

        // Перебираємо знайдені елементи і змінюємо стиль
        allCards.forEach(card => {
            // Наприклад, додаємо легку тінь або змінюємо колір рамки
            card.style.border = '2px solid #FFD200'; // Жовта рамка
            card.style.backgroundColor = '#f9f9f9'; // Світло-сірий фон
        });
        console.log(`Змінено стиль для ${allCards.length} елементів.`);

        // 2. Додати новий елемент <p> у кінець <main>
        const mainContainer = document.querySelector('main');

        if (mainContainer) {
            // Створюємо елемент
            const newElement = document.createElement('p');
            
            // Наповнюємо текстом
            newElement.textContent = 'Це динамічний елемент, доданий через JavaScript (виконання п. 2.1)';
            
            // Можна додати трохи стилів, щоб його було видно
            newElement.style.textAlign = 'center';
            newElement.style.color = 'gray';
            newElement.style.marginTop = '20px';

            // Додаємо в кінець main
            mainContainer.append(newElement);
            console.log("Новий елемент додано в <main>.");
        }
    }

    // Викликаємо функцію, щоб зміни застосувалися одразу при завантаженні
    // Або можна прив'язати це до якоїсь кнопки
    executeLabTask();
});