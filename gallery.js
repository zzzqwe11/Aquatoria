document.addEventListener("DOMContentLoaded", function () {


    const buttons = document.querySelectorAll(
        ".gallery-filter button"
    );

    const items = document.querySelectorAll(
        ".gallery-item"
    );


    buttons.forEach(function (button) {

        button.addEventListener("click", function () {

            const filter =
                this.getAttribute("data-filter");


            buttons.forEach(function (btn) {
                btn.classList.remove("active");
            });

            this.classList.add("active");


            items.forEach(function (item) {

                const category =
                    item.getAttribute("data-category");

                if (
                    filter === "all" ||
                    category === filter
                ) {
                    item.style.display = "";
                } else {
                    item.style.display = "none";
                }

            });

        });

    });



    const lightbox =
        document.getElementById("lightbox");

    const lightboxImage =
        document.getElementById("lightbox-image");

    const closeBtn =
        document.getElementById("lightbox-close");

    const prevBtn =
        document.getElementById("lightbox-prev");

    const nextBtn =
        document.getElementById("lightbox-next");


    if (!lightbox) return;



    function getVisibleImages() {

        const all =
            document.querySelectorAll(".gallery-item");

        const visible = [];

        all.forEach(function (item) {

            /* Пропускаем скрытые фильтром */

            if (item.style.display === "none") return;

            const img =
                item.querySelector("img");

            if (img) visible.push(img);

        });

        return visible;

    }


    let currentIndex = 0;


    function openLightbox(index) {

        const images = getVisibleImages();

        if (!images.length) return;

        if (index < 0) index = images.length - 1;
        if (index >= images.length) index = 0;

        currentIndex = index;

        lightboxImage.src = images[index].src;
        lightboxImage.alt = images[index].alt || "";

        lightbox.classList.add("active");

        document.body.style.overflow = "hidden";
    }


    function closeLightbox() {

        lightbox.classList.remove("active");

        document.body.style.overflow = "";

    }



    items.forEach(function (item) {

        item.addEventListener("click", function () {

            const img = this.querySelector("img");

            if (!img) return;

            /* Находим индекс картинки среди видимых */

            const visibleImages = getVisibleImages();

            const index =
                visibleImages.indexOf(img);

            openLightbox(index);

        });

    });



    prevBtn.addEventListener("click", function (event) {

        event.stopPropagation();

        openLightbox(currentIndex - 1);

    });


    nextBtn.addEventListener("click", function (event) {

        event.stopPropagation();

        openLightbox(currentIndex + 1);

    });



    closeBtn.addEventListener("click", closeLightbox);



    lightbox.addEventListener("click", function (event) {

        if (event.target === lightbox) {
            closeLightbox();
        }

    });



    document.addEventListener("keydown", function (event) {

        if (!lightbox.classList.contains("active")) return;

        if (event.key === "Escape") {
            closeLightbox();
        }

        if (event.key === "ArrowLeft") {
            openLightbox(currentIndex - 1);
        }

        if (event.key === "ArrowRight") {
            openLightbox(currentIndex + 1);
        }

    });

});