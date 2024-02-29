import config from "../../config/config.js";
import { InputValidation } from "../../config/inputValid.js";
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
        /// Получаем значение нового имени категории из элемента формы
        let newCategoryName = this.newCategoryNameElement.value;

        // Форматируем новое имя категории: делаем первую букву заглавной и все остальные буквы строчными
        const inputValidation = new InputValidation('new-cost-category-name');
        if (inputValidation.inputElement) {
            newCategoryName = inputValidation.inputElement.value; // Получаем отформатированное значение из экземпляра InputValidation

        } else {
            console.log('Элемент с id не найден');
            return;
        }

        if (newCategoryName !== '') {
            try {
                const response = await CustomHttp.request(config.host + '/categories/expense', 'POST', { title: newCategoryName });

                location.href = '#/costs';

            } catch (error) {
                if (error) {
                    alert(`Категория "${newCategoryName}" уже существует`);
                } else {
                    // Обработка ошибки
                    console.error('Ошибка:', error);
                }
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