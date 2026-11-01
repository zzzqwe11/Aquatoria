/* =========================================
   ДАННЫЕ АКТИВНОСТЕЙ
========================================= */
const activities = [
    {
        id: 1,
        slug: "tube",
        name: "Ватрушка",
        category: "Ватрушка",
        shortDescription: "Яркое развлечение для тех, кто хочет получить максимум эмоций и скорости.",
        description: "Ватрушка (бублик, тюбинг) — самое популярное развлечение на воде...",
        price: "от 1 500 ₽ / сет",
        duration: "10 минут",
        capacity: "до 2 человек",
        location: "Г.Энгельс Поселок Лесной 7 база Наша Гавань",
        included: ["Жилеты", "Инструктаж", "Катер", "Ватрушка"],
        images: ["images/buksiruemye_ballony_sunset_3_mestnye_4.jpg"]
    },
    {
        id: 2,
        slug: "ski",
        name: "Водные лыжи",
        category: "Водные лыжи",
        shortDescription: "Скорость, вода и настоящее ощущение свободы.",
        description: "Водные лыжи — классика активного отдыха на воде...",
        price: "от 3 500 ₽ / сет",
        duration: "15–20 минут",
        capacity: "1 человек",
        location: "Г.Энгельс Поселок Лесной 7 база Наша Гавань",
        included: ["Лыжи", "Жилет", "Инструктаж", "Катер"],
        images: ["images/126-excursion-02.jpg"]
    },
    {
        id: 3,
        slug: "wake",
        name: "Вейкборд",
        category: "Вейкборд",
        shortDescription: "Для тех, кто хочет освоить новые трюки и испытать себя.",
        description: "Вейкборд — динамичное развлечение для тех, кто любит вызов...",
        price: "от 3 500 ₽ / сет",
        duration: "20 минут",
        capacity: "1 человек",
        location: "Г.Энгельс Поселок Лесной 7 база Наша Гавань",
        included: ["Вейкборд", "Жилет", "Инструктаж", "Катер"],
        images: ["images/578220.jpg"]
    },
    {
        id: 4,
        slug: "surf",
        name: "Серф",
        category: "Серф",
        shortDescription: "Спокойный и красивый способ провести время на воде.",
        description: "Серф — это не только спорт, но и медитация на воде...",
        price: "от 4 000 ₽ / сет",
        duration: "15 минут",
        capacity: "1 человек",
        location: "Г.Энгельс Поселок Лесной 7 база Наша Гавань",
        included: ["Доска", "Гидрокостюм", "Инструктаж"],
        images: ["images/D4F49E44-4F10-4B8D-8.jpeg.webp"]
    },
    {
        id: 5,
        slug: "gaiding",
        name: "Рыбалка с гидом",
        category: "Рыбалка",
        shortDescription: "Отправляйтесь на рыбалку вместе с опытным гидом.",
        description: "Рыбалка с гидом — для тех, кто хочет не просто отдых, а результат...",
        price: "от 5 000 ₽ / сет",
        duration: "от 3 часов",
        capacity: "до 2 человек",
        location: "Г.Энгельс Поселок Лесной 7 база Наша Гавань",
        included: ["Снасти", "Гид", "Катер", "Жилеты", "Чай"],
        images: ["images/550Evo_galery_obzor_01.jpg"]
    }
];


/* =========================================
   ОТРИСОВКА СПИСКА АКТИВНОСТЕЙ (activities.html)
========================================= */
function renderActivitiesList() {
    const container = document.getElementById("activities-list");
    if (!container) return;

    container.innerHTML = activities.map(activity => `
        <article class="activity-large" id="${activity.slug}">
            <img src="${activity.images[0]}" alt="${activity.name}">
            <div>
                <h2>${activity.name}</h2>
                <p>${activity.shortDescription}</p>
                <strong>${activity.price}</strong>
                <a href="activity.html?id=${activity.id}" class="text-link activity-more-link">Подробнее →</a>
            </div>
        </article>
    `).join("");
}


/* =========================================
   ОТРИСОВКА ОДНОЙ АКТИВНОСТИ (activity.html)
========================================= */
function renderActivityPage() {
    const container = document.getElementById("activity-page");
    if (!container) return;

    const params = new URLSearchParams(window.location.search);
    const activityId = Number(params.get("id"));
    const activity = activities.find(item => item.id === activityId);

    if (!activity) {
        container.innerHTML = `
            <section class="section">
                <p class="eyebrow dark">АКТИВНОСТЬ НЕ НАЙДЕНА</p>
                <h1 style="font-size:60px;line-height:.9;letter-spacing:-3px;">Такой активности<br><span>у нас нет</span></h1>
                <a href="activities.html" class="btn btn-dark" style="margin-top:40px;">Вернуться к активностям</a>
            </section>
        `;
        return;
    }

    const thumbs = activity.images.map((src, index) => `
        <button type="button" class="activity-thumb ${index === 0 ? "active" : ""}" data-index="${index}">
            <img src="${src}" alt="">
        </button>
    `).join("");

    container.innerHTML = `
        <section class="activity-page-hero">
            <div class="activity-page-gallery">
                <div class="activity-main-photo">
                    <img class="activity-main-image" src="${activity.images[0]}" alt="${activity.name}">
                </div>
                <div class="activity-thumbs">${thumbs}</div>
            </div>

            <div class="activity-page-info">
                <p class="boat-category">${activity.category.toUpperCase()}</p>
                <h1>${activity.name}</h1>
                <p class="activity-page-description">${activity.description}</p>

                <div class="activity-page-specs">
                    <div class="boat-spec"><span class="spec-title">Стоимость</span><strong>${activity.price}</strong></div>
                    <div class="boat-spec"><span class="spec-title">Длительность</span><strong>${activity.duration}</strong></div>
                    <div class="boat-spec"><span class="spec-title">Вместимость</span><strong>${activity.capacity}</strong></div>
                </div>

                <div class="activity-page-included">
                    <p class="eyebrow dark">В СТОИМОСТЬ ВХОДИТ</p>
                    <ul>${activity.included.map(item => `<li>${item}</li>`).join("")}</ul>
                </div>

                <div class="activity-page-location">
                    <p class="eyebrow dark">МЕСТО ПРОВЕДЕНИЯ</p>
                    <p>${activity.location}</p>
                </div>

                <button type="button" class="btn btn-dark activity-book-btn" onclick="openActivityBooking(${activity.id})">
                    Забронировать
                </button>
            </div>
        </section>
    `;

    setupActivityGallery(activity);
}


/* =========================================
   ГАЛЕРЕЯ НА СТРАНИЦЕ АКТИВНОСТИ
========================================= */
function setupActivityGallery(activity) {
    const mainImage = document.querySelector(".activity-main-image");
    const thumbs = document.querySelectorAll(".activity-thumb");
    if (!mainImage) return;

    thumbs.forEach(function (thumb) {
        thumb.addEventListener("click", function () {
            const index = Number(this.dataset.index);
            mainImage.src = activity.images[index];
            thumbs.forEach(t => t.classList.remove("active"));
            this.classList.add("active");
        });
    });
}


/* =========================================
   ЗАПУСК
========================================= */
document.addEventListener("DOMContentLoaded", function () {
    renderActivitiesList();
    renderActivityPage();
});
