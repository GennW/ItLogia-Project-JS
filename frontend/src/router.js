import { Form } from "./components/form.js";
import { Diagram } from "./components/diagramm.js";

export class Router {
    constructor() {
        this.routes = [
            {
                route: '#/',
                title: 'Главная',
                template: 'templates/index.html',
                styles: 'css/index.css',
                load: () => { // для скриптов под каждую страницу
                    new Diagram();
                }
            },
            {
                route: '#/signup',
                title: 'Регистрация',
                template: 'templates/signup.html',
                // styles: 'css/index.css',
                load: () => {
                    new Form();

                }
            },
            {
                route: '#/signin',
                title: 'Авторизация',
                template: 'templates/signin.html',
                // styles: 'css/index.css',
                load: () => {
                    new Form();
                }
            },
            {
                route: '#/costs',
                title: 'Расходы',
                template: 'templates/costs.html',
                // styles: 'css/index.css',
                load: () => {
                }
            },
            {
                route: '#/costsCreate',
                title: 'Создание категории расходов',
                template: 'templates/costsCreate.html',
                // styles: 'css/index.css',
                load: () => {
                }
            },
            {
                route: '#/costsEdit',
                title: 'Редактирование категории расходов',
                template: 'templates/costsEdit.html',
                // styles: 'css/index.css',
                load: () => {
                }
            },
            {
                route: '#/income',
                title: 'Доходы',
                template: 'templates/income.html',
                styles: 'css/income.css',
                load: () => {
                }
            },
            {
                route: '#/incomeAndCosts',
                title: 'Доходы и расходы',
                template: 'templates/incomeAndCosts.html',
                styles: 'css/incomeAndCosts.css',
                load: () => {
                }
            },
            {
                route: '#/incomeCostsCreate',
                title: 'Создание дохода/расхода',
                template: 'templates/incomeCostsCreate.html',
                // styles: 'css/index.css',
                load: () => {
                }
            },
            {
                route: '#/incomeCostsEdit',
                title: 'Редактирование дохода/расхода',
                template: 'templates/incomeCostsEdit.html',
                // styles: 'css/index.css',
                load: () => {
                }
            },
            {
                route: '#/incomeCreate',
                title: 'Создание категории доходов',
                template: 'templates/incomeCreate.html',
                // styles: 'css/index.css',
                load: () => {
                }
            },
            {
                route: '#/incomeEdit',
                title: 'Редактирование категории доходов',
                template: 'templates/incomeEdit.html',
                // styles: 'css/index.css',
                load: () => {
                }
            },

        ]
    }

    async openRoute() {
        const newRoute = this.routes.find(item => {
            return item.route === window.location.hash;
        });

        if (!newRoute) {
            window.location.href = '#/';
            return;
        }

        document.getElementById('content').innerHTML =
            await fetch(newRoute.template).then(response => response.text());
        document.getElementById('styles').setAttribute('href', newRoute.styles);
        document.getElementById('title').innerText = newRoute.title;
        
        newRoute.load();
        //почему при первом переходе на #/income или на #/costs подключается стиль index.css? 
        //но если перезагрузить эту страницу то стиль index.css не подключается, то есть работает нормально

        if (window.location.hash === '#/incomeAndCosts') {  // Проверяем, страницу
            const additionalStyle = document.createElement('link');  // Создаем новый элемент link
            additionalStyle.setAttribute('rel', 'stylesheet');  // Устанавливаем атрибут rel в значении "stylesheet"
            additionalStyle.setAttribute('href', 'css/index.css');  // Устанавливаем атрибут href с ссылкой на css/index.css
            const existingStyles = document.getElementById('styles');  // Получаем элемент стилей, который уже существует
            document.head.insertBefore(additionalStyle, existingStyles);  // Вставляем index.css перед существующими стилями
        }        
        
    }
}