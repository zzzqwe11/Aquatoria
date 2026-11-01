"use strict";

function getSupabase() {
    if (!window.supabaseClient) throw new Error("Supabase не подключён.");
    return window.supabaseClient;
}

function showAuthMessage(message, isError = false) {
    let box = document.getElementById("auth-message");
    if (!box) {
        box = document.createElement("p");
        box.id = "auth-message";
        box.style.margin = "15px 0";
        box.style.lineHeight = "1.5";
        const form = document.getElementById("register-form") || document.getElementById("login-form");
        if (form) form.insertAdjacentElement("beforebegin", box);
    }
    box.textContent = message;
    box.style.color = isError ? "#b42318" : "#18794e";
}

async function saveProfile(user, name = "", phone = "") {
    const client = getSupabase();
    const metadata = user.user_metadata || {};

    const profile = {
        user_id: user.id,
        full_name: name || metadata.full_name || "",
        phone: phone || metadata.phone || "",
        role: "user" // ВАЖНО: именно "user", а не "client"
    };

    const { error } = await client.from("profiles").upsert(profile, { onConflict: "user_id" });
    if (error) console.error("Ошибка сохранения профиля:", error);
}

document.addEventListener("DOMContentLoaded", async () => {
    const client = window.supabaseClient;
    if (!client) return;

    // --- РЕГИСТРАЦИЯ ---
    const registerForm = document.getElementById("register-form");
    if (registerForm) {
        registerForm.addEventListener("submit", async (event) => {
            event.preventDefault();
            const name = document.getElementById("register-name").value.trim();
            const phone = document.getElementById("register-phone").value.trim();
            const email = document.getElementById("register-email").value.trim().toLowerCase();
            const password = document.getElementById("register-password").value;

            if (!name || !phone || !email || !password) {
                showAuthMessage("Заполни все поля.", true);
                return;
            }

            const button = registerForm.querySelector('button[type="submit"]');
            if (button) button.disabled = true;

            try {
                showAuthMessage("Создаём аккаунт...");
                const { data, error } = await client.auth.signUp({
                    email, password,
                    options: { data: { full_name: name, phone: phone } }
                });

                if (error) throw error;

                // Если сессия есть (автовход разрешён), сразу сохраняем профиль и идём в ЛК
                if (data.session) {
                    await saveProfile(data.user, name, phone);
                    showAuthMessage("Успешно! Переходим в профиль...");
                    window.location.href = "profile.html";
                } else {
                    showAuthMessage("Аккаунт создан. Проверь почту для подтверждения.");
                }
            } catch (error) {
                showAuthMessage(error.message, true);
            } finally {
                if (button) button.disabled = false;
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
            const button = loginForm.querySelector('button[type="submit"]');
            if (button) button.disabled = true;

            try {
                showAuthMessage("Входим...");
                const { data, error } = await client.auth.signInWithPassword({ email, password });
                if (error) throw error;
                await saveProfile(data.user);
                window.location.href = "profile.html";
            } catch (error) {
                showAuthMessage(error.message, true);
            } finally {
                if (button) button.disabled = false;
            }
        });
    }

    // --- ЗАГРУЗКА ПРОФИЛЯ ---
    const profileName = document.getElementById("profile-name");
    if (profileName) {
        try {
            const { data: { session } } = await client.auth.getSession();
            if (!session) { window.location.href = "login.html"; return; }

            const user = session.user;
            const metadata = user.user_metadata || {};
            let name = metadata.full_name || "Клиент";
            let phone = metadata.phone || "";

            const { data: profile } = await client.from("profiles").select("full_name, phone").eq("user_id", user.id).maybeSingle();
            if (profile) {
                name = profile.full_name || name;
                phone = profile.phone || phone;
            }

            profileName.textContent = name;
            if (document.getElementById("profile-user-name")) document.getElementById("profile-user-name").textContent = name;
            if (document.getElementById("profile-email")) document.getElementById("profile-email").textContent = user.email || "";
            if (document.getElementById("profile-phone")) document.getElementById("profile-phone").textContent = phone;

            renderBookings({ email: user.email });
        } catch (error) {
            console.error(error);
        }
    }
});

// Заглушка для старых броней
function renderBookings(user) {
    const container = document.getElementById("profile-bookings");
    if (!container) return;
    container.textContent = "Пока нет бронирований.";
}

async function logout() {
    try { await getSupabase().auth.signOut(); } catch (e) {}
    window.location.href = "index.html";
}
