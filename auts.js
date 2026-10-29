function getUsers() {

    return JSON.parse(
        localStorage.getItem(
            "aquatoriaUsers"
        )
    ) || [];

}


function saveUsers(users) {

    localStorage.setItem(
        "aquatoriaUsers",
        JSON.stringify(users)
    );

}


document.addEventListener(
    "DOMContentLoaded",
    () => {



        const registerForm =
            document.getElementById(
                "register-form"
            );


        if (registerForm) {

            registerForm.addEventListener(
                "submit",
                event => {

                    event.preventDefault();


                    const name =
                        document.getElementById(
                            "register-name"
                        ).value;


                    const phone =
                        document.getElementById(
                            "register-phone"
                        ).value;


                    const email =
                        document.getElementById(
                            "register-email"
                        ).value;


                    const password =
                        document.getElementById(
                            "register-password"
                        ).value;


                    const users =
                        getUsers();


                    const exists =
                        users.find(
                            user =>
                                user.email === email
                        );


                    if (exists) {

                        alert(
                            "Пользователь с таким E-mail уже существует."
                        );

                        return;

                    }


                    const user = {

                        name,
                        phone,
                        email,
                        password

                    };


                    users.push(user);


                    saveUsers(users);


                    localStorage.setItem(

                        "aquatoriaCurrentUser",

                        JSON.stringify(user)

                    );


                    alert(
                        "Регистрация прошла успешно!"
                    );


                    window.location.href =
                        "profile.html";

                }
            );

        }




        const loginForm =
            document.getElementById(
                "login-form"
            );


        if (loginForm) {

            loginForm.addEventListener(
                "submit",
                event => {

                    event.preventDefault();


                    const email =
                        document.getElementById(
                            "login-email"
                        ).value;


                    const password =
                        document.getElementById(
                            "login-password"
                        ).value;


                    const users =
                        getUsers();


                    const user =
                        users.find(
                            item =>
                                item.email === email &&
                                item.password === password
                        );


                    if (!user) {

                        alert(
                            "Неверный E-mail или пароль."
                        );

                        return;

                    }


                    localStorage.setItem(

                        "aquatoriaCurrentUser",

                        JSON.stringify(user)

                    );


                    window.location.href =
                        "profile.html";

                }
            );

        }




        const profileName =
            document.getElementById(
                "profile-name"
            );


        if (profileName) {

            const user =
                JSON.parse(
                    localStorage.getItem(
                        "aquatoriaCurrentUser"
                    )
                );


            if (!user) {

                window.location.href =
                    "login.html";

                return;

            }


            profileName.textContent =
                user.name;


            document.getElementById(
                "profile-user-name"
            ).textContent =
                user.name;


            document.getElementById(
                "profile-email"
            ).textContent =
                user.email;


            document.getElementById(
                "profile-phone"
            ).textContent =
                user.phone;


            renderBookings(user);

        }

    }
);


function renderBookings(user) {

    const container =
        document.getElementById(
            "profile-bookings"
        );


    if (!container) return;


    const bookings =
        JSON.parse(
            localStorage.getItem(
                "aquatoriaBookings"
            )
        ) || [];


    const userBookings =
        bookings.filter(
            booking =>
                booking.userEmail === user.email
        );


    if (!userBookings.length) {

        container.textContent =
            "Пока нет бронирований.";

        return;

    }


    container.innerHTML =
        userBookings.map(
            booking => `

                <div style="
                    padding:15px 0;
                    border-bottom:1px solid #ddd;
                ">

                    <strong>
                        ${booking.boatName}
                    </strong>

                    <br>

                    ${booking.date}
                    · ${booking.time}

                    <br>

                    ${booking.duration} ч.

                    <br>

                    <small>
                        ${booking.status}
                    </small>

                </div>

            `
        ).join("");

}


function logout() {
    localStorage.removeItem(
        "aquatoriaCurrentUser"
    );

    window.location.href =
        "index.html";

}
