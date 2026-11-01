"use strict";

// Функция для показа сообщений
function showAuthMessage(message, isError = false) {
    let box = document.getElementById("auth-message");
    if (!box) {
        box = document.createElement("p");
        box.id = "auth-message";
        box.style.margin = "15px 0";
        box.style.padding = "10px";
        box.style.borderRadius = "5px";
        box.style.textAlign = "center";
        box.style.fontSize = "14px";
        const form = document.getElementById("register-form") || document.getElementById("login-form");
        if (form) form.insertAdjacentElement("beforebegin", box);
    }
    box.textContent = message;
    box.style.background = isError ? "#fee2e2" : "#dcfce7";
    box.style.color = isError ? "#b42318" : "#18794e";
}

document.addEventListener("DOMContentLoaded", () => {
    const client = window.supabaseClient;
    if (!client) {
        console.error("Supabase не подключён!");
        return;
    }

    // --- РЕГИСТРАЦИЯ ---
    const registerForm = document.getElementById("register-form");
    if (registerForm) {
        registerForm.addEventListener("submit", async (event) => {
            event.preventDefault(); // Отменяем перезагрузку страницы

            const name = document.getElementById("register-name").value.trim();
            const phone = document.getElementById("register-phone").value.trim();
            const email = document.getElementById("register-email").value.trim().toLowerCase();
            const password = document.getElementById("register-password").value;

            if (!name || !phone || !email || !password) {
                showAuthMessage("Пожалуйста, заполните все поля.", true);
                return;
            }

            const btn = registerForm.querySelector('button[type="submit"]');
            if (btn) { btn.disabled = true; btn.textContent = "Загрузка..."; }

            try {
                showAuthMessage("Создаём аккаунт...");

                const { data, error } = await client.auth.signUp({
                    email: email,
                    password: password,
                    options: {
                        data: { full_name: name, phone: phone }
                    }
                });

                if (error) throw error;

                // Сохраняем профиль в таблицу
                if (data.user) {
                    await client.from("profiles").upsert({
                        user_id: data.user.id,
                        full_name: name,
                        phone: phone,
                        role: "user"
                    }, { onConflict: "user_id" });
                }

                if (data.session) {
                    showAuthMessage("Успешно! Переходим в профиль...");
                    setTimeout(() => { window.location.href = "profile.html"; }, 1000);
                } else {
                    showAuthMessage("Аккаунт создан! Проверьте почту для подтверждения.");
                }
            } catch (error) {
                console.error("Ошибка регистрации:", error);
                showAuthMessage(error.message || "Ошибка регистрации", true);
            } finally {
                if (btn) { btn.disabled = false; btn.textContent = "Зарегистрироваться"; }
            }
        });
    }

    // --- ВХОД ---
    const loginForm = document.getElementById("login-form");
    if (loginForm) {
        loginForm.addEventListener("submit", async (event) => {
            event.preventDefault();

            const email = document.getElementById("login-email").value.trim().toLowerCase();
            const password = document.getElementById("login-password").value;
            const btn = loginForm.querySelector('button[type="submit"]');
            
            if (btn) { btn.disabled = true; btn.textContent = "Вход..."; }

            try {
                showAuthMessage("Выполняется вход...");
                const { data, error } = await client.auth.signInWithPassword({ email, password });
                
                if (error) throw error;
                
                showAuthMessage("Вход выполнен!");
                setTimeout(() => { window.location.href = "profile.html"; }, 800);

            } catch (error) {
                console.error("Ошибка входа:", error);
                showAuthMessage(error.message || "Неверный email или пароль", true);
            } finally {
                if (btn) { btn.disabled = false; btn.textContent = "Войти"; }
            }
        });
    }

    // --- ЗАГРУЗКА ПРОФИЛЯ ---
    const profileName = document.getElementById("profile-name");
    if (profileName) {
        async function loadProfile() {
            const { data: { session } } = await client.auth.getSession();
            if (!session) { window.location.href = "login.html"; return; }

            const user = session.user;
            let name = user.user_metadata?.full_name || "Клиент";
            let phone = user.user_metadata?.phone || "";

            // Подтягиваем из БД
            const { data: profile } = await client.from("profiles").select("*").eq("user_id", user.id).maybeSingle();
            if (profile) {
                name = profile.full_name || name;
                phone = profile.phone || phone;
            }

            if (document.getElementById("profile-name")) document.getElementById("profile-name").textContent = name;
            if (document.getElementById("profile-user-name")) document.getElementById("profile-user-name").textContent = name;
            if (document.getElementById("profile-email")) document.getElementById("profile-email").textContent = user.email;
            if (document.getElementById("profile-phone")) document.getElementById("profile-phone").textContent = phone;
        }
        loadProfile();
    }
});

async function logout() {
    if (window.supabaseClient) {
        await window.supabaseClient.auth.signOut();
    }
    window.location.href = "index.html";
}
