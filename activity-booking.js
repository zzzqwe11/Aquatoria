/* =========================================
   ОТПРАВКА ЗАЯВКИ АКТИВНОСТИ В TELEGRAM
========================================= */

function sendActivityToTelegram(text) {

    if (typeof TELEGRAM_TOKEN === "undefined" ||
        typeof TELEGRAM_CHAT_ID === "undefined") {
        console.warn("Telegram не настроен (нет токена или chat_id)");
        return;
    }

    const url =
        `https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`;

    fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            chat_id: TELEGRAM_CHAT_ID,
            text: text,
            parse_mode: "HTML"
        })
    })
    .then(r => r.json())
    .then(data => {
        if (data.ok) {
            console.log("✅ Заявка (активность) отправлена");
        } else {
            console.error("❌ Ошибка Telegram:", data.description);
        }
    })
    .catch(err => console.error("❌ Ошибка сети:", err));

}


/* =========================================
   БРОНИРОВАНИЕ АКТИВНОСТИ
========================================= */

function openActivityBooking(activityId) {

    const activity =
        activities.find(
            item => item.id === activityId
        );


    if (!activity) return;


    const date =
        prompt(
            "Введите дату бронирования (например, 20.09.2026):"
        );

    if (!date) return;


    const time =
        prompt(
            "Введите время начала (например, 18:00):"
        );

    if (!time) return;


    const people =
        prompt(
            "Сколько человек?"
        );

    if (!people) return;


    const place =
        prompt(
            "Место посадки (например, турбаза «Иволга»):"
        );

    if (!place) return;


    const user =
        JSON.parse(
            localStorage.getItem(
                "aquatoriaCurrentUser"
            )
        );


    if (!user) {

        alert(
            "Для бронирования необходимо войти в аккаунт."
        );

        window.location.href =
            "login.html";

        return;

    }


    /* Сохраняем бронь */

    const booking = {

        id: Date.now(),

        type: "activity",

        userEmail: user.email,

        boatId: activity.id,

        boatName: activity.name,

        date: date,

        time: time,

        duration: people + " чел.",

        place: place,

        totalPrice: activity.price,

        status: "Ожидает подтверждения"

    };


    const bookings =
        JSON.parse(
            localStorage.getItem(
                "aquatoriaBookings"
            )
        ) || [];


    bookings.push(booking);


    localStorage.setItem(
        "aquatoriaBookings",
        JSON.stringify(bookings)
    );


    /* Формируем сообщение для Telegram */

    const message =
        `📞 ${user.phone || "—"}\n` +
        `🎯 ${activity.name}\n` +
        `📅 ${date}, в ${time}\n` +
        `👥 ${people} чел.\n` +
        `📍 Посадка: ${place}\n` +
        `💰 ${activity.price}`;


    /* Отправляем в Telegram */

    sendActivityToTelegram(message);


    alert(
        "Бронирование успешно создано!"
    );

}