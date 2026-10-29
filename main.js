function toggleMenu() {
    const nav = document.querySelector(".nav");

    if (nav) {
        nav.classList.toggle("mobile-open");
    }
}


document.addEventListener("DOMContentLoaded", () => {

    const forms = document.querySelectorAll(
        ".contact-form, .captain-form"
    );

    forms.forEach(form => {

        form.addEventListener("submit", function(event) {

            event.preventDefault();

            alert(
                "Спасибо! Ваше сообщение отправлено."
            );

            form.reset();

        });

    });

});

function setScrollbarWidth() {
    const width = window.innerWidth - document.documentElement.clientWidth;
    document.documentElement.style.setProperty('--scrollbar-width', width + 'px');
}

document.addEventListener('DOMContentLoaded', setScrollbarWidth);
window.addEventListener('resize', setScrollbarWidth);


document.addEventListener("DOMContentLoaded", function () {

    const toggle =
        document.querySelector(".menu-toggle");

    const menu =
        document.getElementById("mobile-menu");

    if (!toggle || !menu) return;


    toggle.addEventListener("click", function () {

        const isOpen =
            menu.classList.toggle("active");

        toggle.classList.toggle("active", isOpen);

        document.body.classList.toggle(
            "menu-open",
            isOpen
        );

        toggle.setAttribute(
            "aria-expanded",
            isOpen ? "true" : "false"
        );

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
   КНОПКА "НАЗАД" НА СТРАНИЦАХ АВТОРИЗАЦИИ
========================================= */

function goBack() {

    /* Если у пользователя есть история переходов — вернёмся назад */

    if (window.history.length > 1) {
        window.history.back();
    } else {
        /* Иначе — на главную */
        window.location.href = "index.html";
    }

}