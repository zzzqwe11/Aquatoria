/* =========================================
   1. МОБИЛЬНОЕ МЕНЮ
========================================= */
function toggleMenu() {
    const nav = document.querySelector(".nav");
    if (nav) nav.classList.toggle("mobile-open");
}

document.addEventListener("DOMContentLoaded", function () {
    const toggle = document.querySelector(".menu-toggle");
    const menu = document.getElementById("mobile-menu");
    if (!toggle || !menu) return;

    toggle.addEventListener("click", function () {
        const isOpen = menu.classList.toggle("active");
        toggle.classList.toggle("active", isOpen);
        document.body.classList.toggle("menu-open", isOpen);
        toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });

    menu.querySelectorAll("a").forEach(function (link) {
        link.addEventListener("click", function () {
            menu.classList.remove("active");
            toggle.classList.remove("active");
            document.body.classList.remove("menu-open");
            toggle.setAttribute("aria-expanded", "false");
        });
    });

    document.addEventListener("keydown", function (event) {
        if (event.key === "Escape" && menu.classList.contains("active")) {
            menu.classList.remove("active");
            toggle.classList.remove("active");
            document.body.classList.remove("menu-open");
            toggle.setAttribute("aria-expanded", "false");
        }
    });
});


/* =========================================
   2. КОМПЕНСАЦИЯ СКРОЛЛБАРА И ФОРМЫ
========================================= */
function setScrollbarWidth() {
    const width = window.innerWidth - document.documentElement.clientWidth;
    document.documentElement.style.setProperty('--scrollbar-width', width + 'px');
}
document.addEventListener('DOMContentLoaded', setScrollbarWidth);
window.addEventListener('resize', setScrollbarWidth);

document.addEventListener("DOMContentLoaded", () => {
    const forms = document.querySelectorAll(".contact-form, .captain-form");
    forms.forEach(form => {
        form.addEventListener("submit", function(event) {
            event.preventDefault();
            alert("Спасибо! Ваше сообщение отправлено.");
            form.reset();
        });
    });
});


/* =========================================
   3. КНОПКА "НАЗАД"
========================================= */
function goBack() {
    if (window.history.length > 1) window.history.back();
    else window.location.href = "index.html";
}


/* =========================================
   4. АВТОРИЗАЦИЯ В ХЕДЕРЕ
========================================= */
async function updateHeaderAuth() {
    if (!window.supabaseClient) return;

    const loginBtn    = document.getElementById("header-login");
    const registerBtn = document.getElementById("header-register");
    const userBtn     = document.getElementById("header-user");
    const userName    = document.getElementById("header-user-name");
    const logoutBtn   = document.getElementById("header-logout");

    if (!loginBtn) return;

    // Привязываем выход
    if (logoutBtn && !logoutBtn.dataset.bound) {
        logoutBtn.dataset.bound = "true";
        logoutBtn.addEventListener("click", async (e) => {
            e.preventDefault();
            try { await window.supabaseClient.auth.signOut(); } catch (err) {}
            window.location.href = "index.html";
        });
    }

    try {
        const { data: { session } } = await window.supabaseClient.auth.getSession();

        if (session && session.user) {
            // Пользователь вошел
            loginBtn.style.display = "none";
            if (registerBtn) registerBtn.style.display = "none";
            if (userBtn) userBtn.style.display = "inline-flex";
            
            // Делаем кнопку "Выйти" красивой (как "Регистрация")
            if (logoutBtn) {
                logoutBtn.style.display = "inline-block";
                // Добавляем классы btn и btn-light, чтобы кнопка стала овальной и светлой
                logoutBtn.className = "header-logout btn btn-light"; 
            }

            const name = session.user.user_metadata?.full_name || session.user.email;
            if (userName) userName.textContent = name;
        } else {
            // Не вошел
            loginBtn.style.display = "inline-block";
            if (registerBtn) registerBtn.style.display = "inline-block";
            if (userBtn) userBtn.style.display = "none";
            if (logoutBtn) logoutBtn.style.display = "none";
        }
    } catch (e) {
        console.error("Ошибка сессии:", e);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    updateHeaderAuth();
    if (window.supabaseClient) {
        window.supabaseClient.auth.onAuthStateChange(() => updateHeaderAuth());
    }
});
