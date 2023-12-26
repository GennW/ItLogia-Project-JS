document.addEventListener('DOMContentLoaded', function () {

    // сайдбар при изменении экрана
    function toggleSidebar() {
        var width = window.innerWidth;
        var burger = document.querySelector('.burger');
        var btnClose = document.querySelector('.btn-close');
        var sidebar = document.querySelector('.sidebar-wrapper');

        if (width >= 1024) {
            sidebar.style.display = 'block';
            sidebar.classList.remove('offcanvas', 'offcanvas-start');
            sidebar.removeAttribute('data-bs-backdrop');
            sidebar.removeAttribute('tabindex');
            sidebar.removeAttribute('id');
            sidebar.removeAttribute('aria-labelledby');

            burger.style.display = 'none';
            btnClose.style.display = 'none';
            console.log(btnClose)

        } else if (width < 1024) {
            sidebar.style.display = 'none';
            burger.style.display = 'block';
            btnClose.style.display = 'block';
            // Добавляем класс "offcanvas" и "offcanvas-start"
            sidebar.classList.add('offcanvas', 'offcanvas-start');

            // Добавляем остальные указанные атрибуты
            sidebar.setAttribute('data-bs-backdrop', 'static');
            sidebar.setAttribute('tabindex', '-1');
            sidebar.setAttribute('id', 'staticBackdrop');
            sidebar.setAttribute('aria-labelledby', 'staticBackdropLabel');
        }
    }
    // Вызов функции при загрузке страницы

    window.addEventListener('resize', toggleSidebar);

});

