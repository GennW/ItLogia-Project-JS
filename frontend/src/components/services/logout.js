export class Logout {
    constructor() {
        this.addLogoutClickHandler();
    }
    // выход из системы разлогирование
    addLogoutClickHandler() {
        // Найти первый элемент с классом "logout"
        const logoutElement = document.querySelector('.logout');

        // Если элемент был найден, добавить ему обработчик события click
        if (logoutElement) {
            logoutElement.addEventListener('click', function (event) {
                // Изменить ссылку при клике
                const parentElement = logoutElement.closest('.dropdown');
                const linkElement = parentElement.querySelector('a');
                linkElement.href = '#/logout';
            });
        }
    }
}