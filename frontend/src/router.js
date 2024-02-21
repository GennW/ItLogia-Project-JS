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

export class Router {
    constructor() {
        this.routes = [
            {
                route: '#/',
                title: 'Главная',
                template: 'templates/index.html',
                styles: 'css/index.css',
                isAuth: true,
                load: () => { // для скриптов под каждую страницу
                    
                    const diagram1 = new Diagram('myPieChart1', 'Доходы');
                    diagram1.createChartWithCanvas1(); // Создает диаграмму с dataCanvas1

                    const diagram2 = new Diagram('myPieChart2', 'Расходы');
                    diagram2.createChartWithCanvas2(); // Создает диаграмму с dataCanvas2
                }
            },
            {
                route: '#/signup',
                title: 'Регистрация',
                template: 'templates/signup.html',
                styles: '',
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
                isAuth: false,
                load: () => {
                    new Form('signin');
                }
            },
            {
                route: '#/costs',
                title: 'Расходы',
                template: 'templates/costs.html',
                styles: '',
                isAuth: true,
                load: () => {
                    new Costs();
                }
            },
            {
                route: '#/costsCreate',
                title: 'Создание категории расходов',
                template: 'templates/costsCreate.html',
                // styles: 'css/index.css',
                isAuth: true,
                load: () => {
                    new CostsCreate();
                }
            },
            {
                route: '#/costsEdit',
                title: 'Редактирование категории расходов',
                template: 'templates/costsEdit.html',
                // styles: 'css/index.css',
                isAuth: true,
                load: () => {
                    new CostsEdit();
                }
            },
            {
                route: '#/income',
                title: 'Доходы',
                template: 'templates/income.html',
                styles: 'css/income.css',
                isAuth: true,
                load: () => {
                    new Income();
                }
            },
            {
                route: '#/incomeAndCosts',
                title: 'Доходы и расходы',
                template: 'templates/incomeAndCosts.html',
                styles: 'css/incomeAndCosts.css',
                isAuth: true,
                load: () => {
                    new IncomeAndCosts();
                }
            },
            {
                route: '#/incomeCostsCreate',
                title: 'Создание дохода/расхода',
                template: 'templates/incomeCostsCreate.html',
                // styles: 'css/index.css',
                isAuth: true,
                load: () => {
                    new IncomeCostsCreate();
                }
            },
            {
                route: '#/incomeCostsEdit',
                title: 'Редактирование дохода/расхода',
                template: 'templates/incomeCostsEdit.html',
                // styles: 'css/index.css',
                isAuth: true,
                load: () => {
                    new IncomeCostsEdit();
                }
            },
            {
                route: '#/incomeCreate',
                title: 'Создание категории доходов',
                template: 'templates/incomeCreate.html',
                // styles: 'css/index.css',
                isAuth: true,
                load: () => {
                    new IncomeCreate();
                }
            },
            {
                route: '#/incomeEdit',
                title: 'Редактирование категории доходов',
                template: 'templates/incomeEdit.html',
                // styles: 'css/index.css',
                isAuth: true,
                load: () => {
                    new IncomeEdit();
                }
            },

        ]
    }

    async openRoute() {
        const newRoute = this.routes.find(item => {
            return item.route === window.location.hash.split('?')[0];
        });

        if (!newRoute) {
            console.log('Rout не найден!!!!!!!!!!')
            window.location.href = '#/';
            return;
        }

        if (!Auth.checkAuth() && newRoute.isAuth) {
            window.location.href = '#/signup'; // перенаправление на страницу авторизации
            return;
          }

        //24min
        document.getElementById('content').innerHTML =
            await fetch(newRoute.template)
                .then(response => response.text());

        if (newRoute.styles && newRoute.styles.length > 0) {
            console.log(document.getElementById('styles'))
            document.getElementById('styles').setAttribute('href', newRoute.styles);
        }

        document.getElementById('title').innerText = newRoute.title;

        newRoute.load();


        //подключение стиля index.css перед incomeAndCosts.css
        if (window.location.hash === '#/incomeAndCosts') {  // Проверяем, страницу
            const additionalStyle = document.createElement('link');  // Создаем новый элемент link
            additionalStyle.setAttribute('rel', 'stylesheet');  // Устанавливаем атрибут rel в значении "stylesheet"
            additionalStyle.setAttribute('href', 'css/index.css');  // Устанавливаем атрибут href с ссылкой на css/index.css
            const existingStyles = document.getElementById('styles');  // Получаем элемент стилей, который уже существует
            document.head.insertBefore(additionalStyle, existingStyles);  // Вставляем index.css перед существующими стилями
        }

        // удаление index.css там где он не нужен
        if (window.location.hash !== '#/incomeAndCosts' && window.location.hash !== '#/') {
            let existingIndexStyles = document.querySelector('link[href="css/index.css"]');
            if (existingIndexStyles) {
                document.head.removeChild(existingIndexStyles);
            }
        }

    }
}