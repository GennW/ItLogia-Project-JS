import config from "../../config/config.js";
import { UrlManager } from "../utils/url-manager.js";
import { CustomHttp } from "./services/custom-http.js";



export class IncomeEdit {
    constructor() {
        this.routeParams = UrlManager.getQueryParams();
        this.cancelModifiedCostsCategory();
        this.initializeUpdateIncomeCategoryListener(); // Инициализация слушателя для обновления категории дохода
        this.populateInputWithRouteParamsTitle(); // Вызов метода подстановки значения routeParams.title в input
    }
    

    // Дополнительный метод для подстановки значения из routeParams.title в input
    populateInputWithRouteParamsTitle() {
        const editCategoryInputElement = document.getElementById('edit-category-input');
        editCategoryInputElement.value = this.routeParams.title; // Подстановка значения из routeParams.title в инпут
    }

    // Метод для обновления категории дохода
    async updateIncomeCategory(title) {
        try {
            // Создаем объект данных с новым заголовком
            const data = { title: title };
            // Выполняем запрос на сервер для обновления категории дохода
            const result = await CustomHttp.request(config.host + '/categories/income/' + this.routeParams.id, 'PUT', data);
            // Проверяем наличие ошибок в результате запроса
            if (result.error) {
                throw new Error(result.error);
            }
            console.log('Категория успешно изменена:', result);
            // Перенаправляем пользователя на страницу с доходами после успешного обновления
            location.href = '#/income';
        } catch (error) {
            console.error('Ошибка при сохранении изменений категории:', error);
        }
    }

    // Инициализация слушателя события для кнопки сохранения измененной категории
    initializeUpdateIncomeCategoryListener() {
        // Получаем элемент кнопки сохранения
        const saveModifiedCategoryElement = document.getElementById('save-modified-category-btn');


        saveModifiedCategoryElement.addEventListener('click', () => { // Добавляем слушателя события для нажатия на кнопку
            const editCategoryInputElement = document.getElementById('edit-category-input');
            const title = editCategoryInputElement.value; // Получаем значение нового заголовка категории
            this.updateIncomeCategory(title); // Вызываем метод обновления категории с новым заголовком
        });
    }

    // Метод для отмены изменения категории income
    cancelModifiedCostsCategory() {
        const cancelModifiedCategoryElement = document.getElementById('cancel-modified-category-btn');
        if (cancelModifiedCategoryElement) {
            cancelModifiedCategoryElement.addEventListener('click', () => { // Добавляем слушателя события для нажатия на кнопку
                location.href = '#/income';
            });
        } else {
            console.log('id не найден');
        }

    }
}
