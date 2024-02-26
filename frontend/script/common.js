document.addEventListener('DOMContentLoaded', function () {
   
    // бургер меню
    const burgerIcon = document.querySelector('.burger-icon');
    const sidebar = document.querySelector('.sidebar');
    console.log(sidebar)

    // Вызов функции toggleSidebar() при загрузке страницы
    toggleSidebar();

    if (burgerIcon) {
        burgerIcon.addEventListener('click', function () {
            sidebar.classList.toggle('active'); // Переключает класс "active" для открытия/закрытия сайдбара
        });

        // Добавляем обработчик события для закрытия сайдбара при клике в любом месте страницы
        document.addEventListener('click', function (event) {
            if (!sidebar.contains(event.target) && event.target !== burgerIcon) {
                sidebar.classList.remove('active');
            }
        });
    }

    // сайдбар при изменении экрана
    function toggleSidebar() {
        let width = window.innerWidth;
        let burger = document.querySelector('.burger');
        let btnClose = document.querySelector('.btn-close');
        let sidebar = document.querySelector('.sidebar-wrapper');

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

            // Добавляем остальные атрибуты
            sidebar.setAttribute('data-bs-backdrop', 'static');
            sidebar.setAttribute('tabindex', '-1');
            sidebar.setAttribute('id', 'staticBackdrop');
            sidebar.setAttribute('aria-labelledby', 'staticBackdropLabel');
        }
    }
    // Вызов функции при загрузке страницы

    window.addEventListener('resize', toggleSidebar);


    // проверка url код см.  Проект: Quiz часть 2 43:15


    // при нажатии на выход из системы ссылка в ссылке исправить!!!!!!!!!!!!!!!!!!!
    // Найти элемент с классом "logout"
    const logoutElement = document.querySelector('.logout');

    // Добавить обработчик события click
    logoutElement.addEventListener('click', function() {
        if (logoutElement) {
            logoutElement.addEventListener('click', function (event) {
                // Изменить ссылку при клике
                const parentElement = logoutElement.closest('.dropdown');
                const linkElement = parentElement.querySelector('a');
                linkElement.href = '#/logout';
            });
        }
    });
});
 