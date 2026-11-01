/* =========================================
   МОБИЛЬНОЕ МЕНЮ
========================================= */
document.addEventListener("DOMContentLoaded", function () {
    const toggle = document.querySelector(".menu-toggle");
    const menu = document.getElementById("mobile-menu");
    if (toggle && menu) {
        toggle.addEventListener("click", function () {
            const isOpen = menu.classList.toggle("active");
            toggle.classList.toggle("active", isOpen);
            document.body.classList.toggle("menu-open", isOpen);
        });
    }
});

/* =========================================
   ФОРМЫ ОБРАТНОЙ СВЯЗИ
========================================= */
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
   ОБНОВЛЕНИЕ ХЕДЕРА (ПРОФИЛЬ / ВОЙТИ)
========================================= */
async function updateHeaderAuth() {
    if (!window.supabaseClient) return;

    const loginBtn = document.getElementById("header-login");
    const regBtn = document.getElementById("header-register");
    const userBtn = document.getElementById("header-user");
    const userName = document.getElementById("header-user-name");
    const logoutBtn = document.getElementById("header-logout");

    if (!loginBtn) return;

    // Обработчик выхода
    if (logoutBtn && !logoutBtn.dataset.bound) {
        logoutBtn.dataset.bound = "true";
        logoutBtn.addEventListener("click", async (e) => {
            e.preventDefault();
            await window.supabaseClient.auth.signOut();
            window.location.href = "index.html";
        });
    }

    const { data: { session } } = await window.supabaseClient.auth.getSession();

    if (session) {
        // Вошел
        loginBtn.style.display = "none";
        if (regBtn) regBtn.style.display = "none";
        if (userBtn) userBtn.style.display = "inline-flex";
        if (logoutBtn) logoutBtn.style.display = "inline-block";
        
        const name = session.user.user_metadata?.full_name || session.user.email;
        if (userName) userName.textContent = name;
    } else {
        // Не вошел
        loginBtn.style.display = "inline-block";
        if (regBtn) regBtn.style.display = "inline-block";
        if (userBtn) userBtn.style.display = "none";
        if (logoutBtn) logoutBtn.style.display = "none";
    }
}

document.addEventListener("DOMContentLoaded", () => {
    updateHeaderAuth();
    if (window.supabaseClient) {
        window.supabaseClient.auth.onAuthStateChange(() => updateHeaderAuth());
    }
});

/* =========================================
   КНОПКА "НАЗАД"
========================================= */
function goBack() {
    if (window.history.length > 1) window.history.back();
    else window.location.href = "index.html";
}
