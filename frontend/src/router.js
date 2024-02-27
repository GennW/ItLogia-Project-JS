import { Form } from "./components/form.js";
import { Diagram } from "./components/diagramm.js";
import { Costs } from "./components/costs.JS";
import { Income } from "./components/income.JS";
import { CostsCreate } from "./components/costsCreate.JS";
import { CostsEdit } from "./components/costsEdit.JS";
import { IncomeAndCosts } from "./components/incomeAndCosts.JS";
import { IncomeCostsCreate } from "./components/incomeCostsCreate.JS";
import { IncomeCostsEdit } from "./components/incomeCostsEdit.JS";
import { IncomeCreate } from "./components/incomeCreate.JS";
import { IncomeEdit } from "./components/incomeEdit.JS";
import { Auth } from "./components/services/auth.js";
import { Logout } from "./components/services/logout.js";

export class Router {
    constructor() {
        this.contentElement = document.getElementById('content');
        this.stylesElement = document.getElementById('styles');
        this.additionalStyleElement = document.getElementById('additionalStyle');
        this.titleElement = document.getElementById('title');


        this.routes = [
            {
                route: '#/',
                title: 'Главная',
                template: 'templates/index.html',
                styles: 'css/index.css',
                additionalStyle: '',
                isAuth: true,
                load: () => { // для скриптов под каждую страницу

                    const diagram1 = new Diagram('myPieChart1', 'Доходы');
                    diagram1.createChartWithCanvas1(); // Создает диаграмму с dataCanvas1

                    const diagram2 = new Diagram('myPieChart2', 'Расходы');
                    diagram2.createChartWithCanvas2(); // Создает диаграмму с dataCanvas2

                    new Logout();
                }
            },
            {
                route: '#/signup',
                title: 'Регистрация',
                template: 'templates/signup.html',
                styles: '',
                additionalStyle: '',
                isAuth: false,
                load: () => {
                    new Form('signup');
                }
            },
            {
                route: '#/signin',
                title: 'Авторизация',
                template: 'templates/signin.html',
                styles: '',
                additionalStyle: '',
                isAuth: false,
                load: () => {
                    new Form('signin');
                }
            },
            {
                route: '#/costs',
                title: 'Расходы',
                template: 'templates/costs.html',
                styles: 'css/costs.css',
                additionalStyle: '',
                isAuth: true,
                load: () => {
                    new Costs();
                    new Logout();
                }
            },
            {
                route: '#/costsCreate',
                title: 'Создание категории расходов',
                template: 'templates/costsCreate.html',
                styles: '',
                additionalStyle: '',
                isAuth: true,
                load: () => {
                    new CostsCreate();
                    new Logout();
                }
            },
            {
                route: '#/costsEdit',
                title: 'Редактирование категории расходов',
                template: 'templates/costsEdit.html',
                styles: '',
                additionalStyle: '',
                isAuth: true,
                load: () => {
                    new CostsEdit();
                    new Logout();
                }
            },
            {
                route: '#/income',
                title: 'Доходы',
                template: 'templates/income.html',
                styles: 'css/income.css',
                additionalStyle: '',
                isAuth: true,
                load: () => {
                    new Income();
                    new Logout();
                }
            },
            {
                route: '#/incomeAndCosts',
                title: 'Доходы и расходы',
                template: 'templates/incomeAndCosts.html',
                styles: 'css/index.css',
                additionalStyle: 'css/incomeAndCosts.css',
                isAuth: true,
                load: () => {
                    new IncomeAndCosts();
                    new Logout();
                }
            },
            {
                route: '#/incomeCostsCreate',
                title: 'Создание дохода/расхода',
                template: 'templates/incomeCostsCreate.html',
                styles: '',
                additionalStyle: '',
                isAuth: true,
                load: () => {
                    new IncomeCostsCreate();
                    new Logout();
                }
            },
            {
                route: '#/incomeCostsEdit',
                title: 'Редактирование дохода/расхода',
                template: 'templates/incomeCostsEdit.html',
                styles: '',
                additionalStyle: '',
                isAuth: true,
                load: () => {
                    new IncomeCostsEdit();
                    new Logout();
                }
            },
            {
                route: '#/incomeCreate',
                title: 'Создание категории доходов',
                template: 'templates/incomeCreate.html',
                styles: '',
                additionalStyle: '',
                isAuth: true,
                load: () => {
                    new IncomeCreate();
                    new Logout();
                }
            },
            {
                route: '#/incomeEdit',
                title: 'Редактирование категории доходов',
                template: 'templates/incomeEdit.html',
                styles: '',
                additionalStyle: '',
                isAuth: true,
                load: () => {
                    new IncomeEdit();
                    new Logout();
                }
            },

        ]
    }

    async openRoute() {
        // выход из системы
        const urlRout = window.location.hash.split('?')[0];
        if (urlRout === '#/logout') {
            Auth.logout();

            window.location.href = '#/signin';
            return;
        }


        const newRoute = this.routes.find(item => {
            return item.route === urlRout;

        });

        if (!newRoute) {
            console.log('Rout не найден!!!!!!!!!!')
            window.location.href = '#/signin';
            return;
        }

        if (!Auth.checkAuth() && newRoute.isAuth) {
            window.location.href = '#/signup'; // перенаправление на страницу авторизации
            return;
        }

        //24min + 1:41:50 Проект Quiz: часть 4
        this.contentElement.innerHTML =
            await fetch(newRoute.template)
                .then(response => response.text());

        // добавляем основные стили
        if (newRoute.styles && newRoute.styles.length > 0) {
            this.stylesElement.setAttribute('href', newRoute.styles);

        }

        // добавляем дополнительные стили
        if (newRoute.additionalStyle && newRoute.additionalStyle.length > 0) {
            this.additionalStyleElement.setAttribute('href', newRoute.additionalStyle);
        }
        // Проверяем, существует ли элемент дополнительного стиля
        if (this.additionalStyleElement) {
            // Очищаем дополнительный стиль при переходе на страницу, которой он не требуется
            if (!newRoute.additionalStyle || newRoute.additionalStyle.length === 0) {
                this.additionalStyleElement.setAttribute('href', '');
            } else {
                // Устанавливаем дополнительный стиль при переходе на страницу, которая его требует
                this.additionalStyleElement.setAttribute('href', newRoute.additionalStyle);
            }
        }
        // сокращенный код с добавлением дополнительного стиля
        // // добавляем дополнительные стили
        // this.additionalStyleElement.setAttribute('href', newRoute.additionalStyle || '');

        // // Устанавливаем дополнительный стиль при переходе на страницу, которая его требует
        // // и очищаем его при переходе на страницу, которой он не требуется
        // this.additionalStyleElement.setAttribute('href', newRoute.additionalStyle && newRoute.additionalStyle.length > 0 ? newRoute.additionalStyle : '');

        this.titleElement.innerText = newRoute.title;

        // обрабатываем данные пользователя  1:40:30 Проект Quiz: часть 4

        const userInfo = Auth.getUserInfo();
        const accessToken = localStorage.getItem(Auth.accessTokenKey);
        const profileFullName = document.getElementById('profile-full-name');

        if (userInfo && accessToken && profileFullName) {
            profileFullName.innerText = `${userInfo.name} ${userInfo.lastName}`;
        } else {
            if (profileFullName) {
                profileFullName.innerText = 'User'
            }
        }

        newRoute.load();

    }
}