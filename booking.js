/* =========================================
   ОТПРАВКА ЗАЯВКИ В TELEGRAM
========================================= */

function sendToTelegram(text) {

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
            console.log("✅ Заявка отправлена в Telegram");
        } else {
            console.error("❌ Ошибка Telegram:", data.description);
        }
    })
    .catch(err => console.error("❌ Ошибка сети:", err));

}


/* =========================================
   БРОНИРОВАНИЕ КАТЕРА
========================================= */

function openBooking(boatId) {

    const boat =
        boats.find(
            item => item.id === boatId
        );


    if (!boat) return;


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


    const duration =
        prompt(
            "На сколько часов забронировать?"
        );


    if (!duration) return;


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


    /* Считаем стоимость: цена катера × часы */

    const pricePerHour =
        Number(boat.price.replace(/[^\d]/g, "")) || 0;

    const totalPrice =
        pricePerHour * Number(duration);

    const totalPriceText =
        totalPrice.toLocaleString("ru-RU") + " ₽";


    /* Считаем время окончания */

    const [hh, mm] = time.split(":").map(Number);

    const endH = (hh + Number(duration)) % 24;

    const endTime =
        String(endH).padStart(2, "0") + ":" +
        String(mm || 0).padStart(2, "0");


    /* Сохраняем бронь */

    const booking = {

        id: Date.now(),

        userEmail: user.email,

        boatId: boat.id,

        boatName: boat.name,

        date: date,

        time: time,

        duration: duration,

        place: place,

        totalPrice: totalPriceText,

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
        `🛥 Катер «${boat.name}»\n` +
        `📅 ${date}, ${duration} ч.\n` +
        `🕒 с ${time} до ${endTime}\n` +
        `📍 Посадка: ${place}\n` +
        `💰 ${totalPriceText}`;


    /* Отправляем в Telegram */

    sendToTelegram(message);


    alert(
        "Бронирование успешно создано!"
    );

}