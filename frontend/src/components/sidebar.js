import { CustomHttp } from "./services/custom-http.js";
import config from "../../config/config.js";

export class Sidebar {

    constructor() {
        this.init();
        this.addEventListeners();
    }

    async init() {
        this.toggleSidebar();
        const balanceElement = document.getElementById('common-balance');

        try {
            // Выполняем запрос на получение баланса
            const getBalance = await CustomHttp.request(config.host + '/balance');

            if (getBalance) {
                if (getBalance.error) {
                    console.error('Ошибка при получении баланса:', getBalance.error);
                } else {
                    const formattedBalance = getBalance.balance.toLocaleString();  // Применение форматирования разделителя разрядов
                    balanceElement.innerText = formattedBalance + '$';
                }
            }
        } catch (error) {
            console.error('Ошибка при получении баланса:', error);
        }
    }

    addEventListeners() {

        const burgerIcon = document.querySelector('.burger-icon');
        const sidebar = document.querySelector('.sidebar');
    
        if (burgerIcon) {

            burgerIcon.addEventListener('click', function (event) {
                if (!sidebar.contains(event.target) && event.target.tagName !== 'A') {
                    sidebar.classList.toggle('active'); // Переключает класс "active" для открытия/закрытия сайдбара

                }
            });
    

        }
    
        window.addEventListener('resize', this.toggleSidebar);
    
       
    }

    toggleSidebar() {
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
        } else if (width < 1024) {
            sidebar.style.display = 'none';
            burger.style.display = 'block';
            btnClose.style.display = 'block';
            sidebar.classList.add('offcanvas', 'offcanvas-start');
            sidebar.setAttribute('data-bs-backdrop', 'static');
            sidebar.setAttribute('tabindex', '-1');
            sidebar.setAttribute('id', 'staticBackdrop');
            sidebar.setAttribute('aria-labelledby', 'staticBackdropLabel');
        }
    }
}
