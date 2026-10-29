/* =========================================
   ОТЗЫВЫ ПО УМОЛЧАНИЮ
========================================= */

const defaultReviews = [

    {
        name: "Алексей",
        boat: "Общий отзыв",
        rating: 5,
        text: "Отлично провели время! Катер в прекрасном состоянии, всё прошло комфортно."
    },

    {
        name: "Мария",
        boat: "Общий отзыв",
        rating: 5,
        text: "Очень понравилась прогулка. Красивые места и отличный сервис."
    },

    {
        name: "Дмитрий",
        boat: "Общий отзыв",
        rating: 5,
        text: "Брали катер компанией друзей. Всё понравилось от начала до конца."
    }

];


/* =========================================
   LOCALSTORAGE
========================================= */

function getReviews() {

    let reviews =
        JSON.parse(localStorage.getItem("aquatoriaReviews"));

    if (!reviews) {

        reviews = defaultReviews;

        localStorage.setItem(
            "aquatoriaReviews",
            JSON.stringify(reviews)
        );

    }

    return reviews;

}


function saveReviews(reviews) {

    localStorage.setItem(
        "aquatoriaReviews",
        JSON.stringify(reviews)
    );

}


/* =========================================
   ТЕКУЩИЙ ПОЛЬЗОВАТЕЛЬ
========================================= */

function getCurrentUser() {

    return JSON.parse(
        localStorage.getItem("aquatoriaCurrentUser")
    );

}


/* =========================================
   ОТРИСОВКА ВСЕХ ОТЗЫВОВ (reviews.html)
========================================= */

function renderReviews() {

    const container =
        document.getElementById("reviews-list");

    if (!container) return;


    const reviews = getReviews();
    const user = getCurrentUser();


    container.innerHTML =
        reviews.map((review, index) => {

            /* Кнопка удаления — только для автора отзыва */

            const isAuthor =
                user &&
                review.userEmail &&
                review.userEmail === user.email;

            const deleteBtn = isAuthor
                ? `
                    <button
                        class="review-delete"
                        data-index="${index}"
                        type="button"
                        aria-label="Удалить отзыв">

                        Удалить

                    </button>
                `
                : "";


            return `

                <article class="review">

                    <div class="review-stars">

                        ${"★".repeat(review.rating)}
                        ${"☆".repeat(5 - review.rating)}

                    </div>

                    <p>
                        «${review.text}»
                    </p>

                    <div class="review-author">

                        ${review.name}

                        <small>
                            · ${review.boat}
                        </small>

                    </div>

                    ${deleteBtn}

                </article>

            `;

        }).join("");


    /* Обработчики на кнопки удаления */

    container
        .querySelectorAll(".review-delete")
        .forEach(function (btn) {

            btn.addEventListener("click", function () {

                const index = Number(this.dataset.index);

                const reviews = getReviews();
                const user = getCurrentUser();

                /* Проверяем, что это автор */

                if (
                    !user ||
                    reviews[index].userEmail !== user.email
                ) {
                    alert("Вы можете удалять только свои отзывы.");
                    return;
                }

                if (!confirm("Удалить этот отзыв?")) return;

                reviews.splice(index, 1);

                saveReviews(reviews);

                renderReviews();

                if (typeof renderHomeReviews === "function") {
                    renderHomeReviews();
                }

            });

        });

}


/* =========================================
   ОТРИСОВКА 3 ОТЗЫВОВ НА ГЛАВНОЙ
========================================= */

function renderHomeReviews() {

    const container =
        document.getElementById("home-reviews");

    if (!container) return;


    const reviews = getReviews();


    container.innerHTML =
        reviews.slice(0, 3)
        .map(review => `

            <article class="review">

                <div class="review-stars">
                    ${"★".repeat(review.rating)}
                </div>

                <p>
                    «${review.text}»
                </p>

                <div class="review-author">
                    ${review.name}
                </div>

            </article>

        `)
        .join("");

}


/* =========================================
   БЛОКИРОВКА / ПОКАЗ ФОРМЫ
========================================= */

function toggleReviewForm() {

    const formWrapper =
        document.getElementById("review-form-wrapper");

    const lockedWrapper =
        document.getElementById("review-form-locked");

    const usernameLabel =
        document.getElementById("review-form-username");


    if (!formWrapper || !lockedWrapper) return;


    const user = getCurrentUser();


    if (user) {

        /* Авторизован — показываем форму */

        formWrapper.style.display = "";
        lockedWrapper.style.display = "none";

        if (usernameLabel) {
            usernameLabel.textContent =
                user.name || user.email;
        }

    } else {

        /* Не авторизован — показываем заглушку */

        formWrapper.style.display = "none";
        lockedWrapper.style.display = "";

    }

}


/* =========================================
   ЗАПУСК
========================================= */

document.addEventListener("DOMContentLoaded", () => {

    renderReviews();
    renderHomeReviews();
    toggleReviewForm();


    /* ================= ФОРМА ОТЗЫВА ================= */

    const form =
        document.getElementById("review-form");


    if (form) {

        form.addEventListener("submit", event => {

            event.preventDefault();


            const user = getCurrentUser();


            /* Защита: если каким-то образом форму отправил
               неавторизованный — не сохраняем */

            if (!user) {

                alert("Чтобы оставить отзыв, войдите в аккаунт.");

                window.location.href = "login.html";

                return;

            }


            const boat =
                document.getElementById("review-boat").value;


            const rating =
                Number(
                    document.getElementById("review-rating").value
                );


            const text =
                document.getElementById("review-text").value;


            const reviews = getReviews();


            reviews.unshift({

                name: user.name || user.email,

                userEmail: user.email,

                boat,
                rating,
                text

            });


            saveReviews(reviews);


            alert("Спасибо за ваш отзыв!");


            form.reset();


            renderReviews();
            renderHomeReviews();

        });

    }

});