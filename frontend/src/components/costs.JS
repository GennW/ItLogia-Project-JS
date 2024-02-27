import config from "../../config/config.js";
import { UrlManager } from "../utils/url-manager.js";
import { CustomHttp } from "./services/custom-http.js";
import { Logout } from "./services/logout.js";



export class Costs {
    constructor() {
        this.routeParams = UrlManager.getQueryParams();
        this.costs = [];


        this.getCategories();
    }

    async getCategories() {

        try {
            const result = await CustomHttp.request(config.host + '/categories/expense');
            if (result) {
                if (result.error) {
                    throw new Error(result.message)
                }

                this.costs = result;
                this.processCosts();

            }

        } catch (error) {
            // Обработка ошибки
            console.error('Ошибка:', error);
        }
    }

    processCosts() {



        // Находим контейнер, в котором будем отрисовывать категории
        const container = document.querySelector('.main-items');

        // Проходимся по массиву категорий и создаем для каждой категории соответствующий HTML-элемент
        this.costs.forEach(category => {
            // Создаем элементы
            const card = document.createElement('div');
            const cardBody = document.createElement('div');
            const title = document.createElement('h5');
            const editButton = document.createElement('a');
            const deleteButton = document.createElement('a');

            // Добавляем классы элементам
            card.classList.add('card', 'col-12', 'col-md-6', 'col-lg-4', 'm-2');
            cardBody.classList.add('card-body');
            title.classList.add('card-title', 'mb-3');
            editButton.classList.add('btn', 'btn-primary', 'me-2');
            deleteButton.classList.add('btn', 'btn-danger');

            // Устанавливаем текст и атрибуты элементов
            title.textContent = category.title;
            editButton.textContent = 'Редактировать';
            editButton.href = 'javascript:void(0)';
            deleteButton.textContent = 'Удалить';
            deleteButton.href = 'javascript:void(0)';
            deleteButton.setAttribute('data-bs-toggle', 'modal');
            deleteButton.setAttribute('data-bs-target', '#exampleModal');

            // Добавляем дочерние элементы карточкам
            cardBody.appendChild(title);
            cardBody.appendChild(editButton);
            cardBody.appendChild(deleteButton);
            card.appendChild(cardBody);
            card.appendChild(cardBody);

            // Добавляем карточку к контейнеру
            container.appendChild(card);
        });

        // Создаем элемент "Добавить новую категорию"
        const newCategoryCard = document.createElement('div'); // Создаем элемент div для обертки
        const newCategoryCardBody = document.createElement('div'); // Создаем элемент div для содержимого карточки
        const link = document.createElement('a'); // Создаем элемент a для ссылки

        // Добавляем классы к созданным элементам
        newCategoryCard.classList.add('card', 'col-12', 'col-md-6', 'col-lg-4', 'm-2'); // Добавляем классы карточке
        newCategoryCardBody.classList.add('card-body', 'card-body-last', 'd-flex', 'align-items-center', 'justify-content-center'); // Добавляем классы для содержимого карточки
        link.classList.add('link-secondary', 'link-offset-2', 'link-underline', 'link-underline-opacity-0'); // Добавляем классы для ссылки

        link.textContent = '+'; // Устанавливаем текст содержимому ссылки
        link.href = '#/costsCreate'; // Добавляем href ссылке

        newCategoryCardBody.appendChild(link); // Добавляем ссылку в содержимое карточки
        newCategoryCard.appendChild(newCategoryCardBody); // Добавляем содержимое карточки в карточку
        container.appendChild(newCategoryCard); // Добавляем карточку в контейнер

    }
}