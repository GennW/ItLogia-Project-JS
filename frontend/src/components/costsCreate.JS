import config from "../../config/config.js";
import { UrlManager } from "../utils/url-manager.js";
import { CustomHttp } from "./services/custom-http.js";



export class CostsCreate {
    constructor() {
        this.routeParams = UrlManager.getQueryParams();
        this.newCategoryNameElement = document.getElementById('new-cost-category-name');
        this.category = [];

        this.createNewCategoryElement = document.getElementById('create-new-category');
        this.clearNewCategoryElement = document.getElementById('clear-new-category'); // Находим элемент для очистки
        this.createNewCategoryElement.addEventListener('click', this.createCategory.bind(this));
        this.clearNewCategoryElement.addEventListener('click', this.clearCategory.bind(this)); // Добавляем обработчик для очистки
        this.createCategory();

    }

    async createCategory() {
        // const userInfo = Auth.getUserInfo();
        const newCategoryName = this.newCategoryNameElement.value;
        console.log(newCategoryName)
        if (newCategoryName.trim() !== '') {
            try {
                const response = await CustomHttp.request(config.host + '/categories/expense', 'POST', { title: newCategoryName });
                // Обработка ответа от сервера
                console.log('Ответ сервера:', response);
            } catch (error) {
                // Обработка ошибки
                console.error('Ошибка:', error);
            }
        } else {
            // Обработка ошибки пустого ввода
            console.log('Пустой ввод');
        }
    }

    clearCategory() {
        this.newCategoryNameElement.value = ''; // Очищаем значение поля
    }
}