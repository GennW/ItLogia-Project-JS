import config from "../../config/config.js";
import { UrlManager } from "../utils/url-manager.js";
import { CustomHttp } from "./services/custom-http.js";


export class IncomeCreate {
    constructor() {
        this.routeParams = UrlManager.getQueryParams();
        this.newCategoryNameElement = document.getElementById('new-cost-category-name');
        this.category = [];
        this.newCategoryNameElement = document.getElementById('new-income-category-name');

        this.createNewCategoryElement = document.getElementById('create-new-category');
        this.clearNewCategoryElement = document.getElementById('clear-new-category'); // Находим элемент для очистки
        this.createNewCategoryElement.addEventListener('click', this.createCategory.bind(this));
        this.clearNewCategoryElement.addEventListener('click', this.clearCategory.bind(this)); // Добавляем обработчик для очистки
        this.createCategory();
    }

    async createCategory() {
        // Получаем значение нового имени категории из элемента формы
        let newCategoryName = this.newCategoryNameElement.value;

        // Форматируем новое имя категории: делаем первую букву заглавной и все остальные буквы строчными
        const formattedCategoryName = newCategoryName.trim() !== '' ? newCategoryName.charAt(0).toUpperCase() + newCategoryName.slice(1).toLowerCase() : '';

        // Присваиваем отформатированное имя обратно переменной newCategoryName (если желаете сохранить это значение)
        newCategoryName = formattedCategoryName;
        if (formattedCategoryName !== '') { // Проверяем, что отформатированное имя не пустое
            try {
                const response = await CustomHttp.request(config.host + '/categories/income', 'POST', { title: newCategoryName });

                // Обработка ответа от сервера
                console.log(`Новая категория "${formattedCategoryName}" создана`);
                location.href = '#/income';

                
            } catch (error) {
                if (error) {
                    alert(`Категория "${formattedCategoryName}" уже существует`);
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