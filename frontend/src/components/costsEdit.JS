import config from "../../config/config.js";
import { InputValidation } from "../../config/inputValid.js";
import { UrlManager } from "../utils/url-manager.js";
import { CustomHttp } from "./services/custom-http.js";


export class CostsEdit {
    constructor() {
        this.routeParams = UrlManager.getQueryParams();
        this.cancelModifiedCostsCategory();
        this.initializeUpdateCostsCategoryListener();
        this.populateInputWithRouteParamsTitle();
    }

    // Дополнительный метод для подстановки значения из routeParams.title в input
    populateInputWithRouteParamsTitle() {
        const editCategoryInputElement = document.getElementById('edit-category-input');
        editCategoryInputElement.value = this.routeParams.title; // Подстановка значения из routeParams.title в инпут
    }


    // Метод для обновления категории costs
    async updateCostsCategory(title) {
        try {
            // Создаем объект данных с новым заголовком
            const data = { title: title };
            // Выполняем запрос на сервер для обновления категории дохода
            const result = await CustomHttp.request(config.host + '/categories/expense/' + this.routeParams.id, 'PUT', data);
            // Проверяем наличие ошибок в результате запроса
            if (result.error) {
                throw new Error(result.error);
            }
            console.log('Категория успешно изменена:', result);
            // Перенаправляем пользователя на страницу с доходами после успешного обновления
            location.href = '#/costs';
        } catch (error) {
            console.error('Ошибка при сохранении изменений категории:', error);
        }
    }

    // Инициализация слушателя события для кнопки сохранения измененной категории
    initializeUpdateCostsCategoryListener() {
        // Получаем элемент кнопки сохранения
        const saveModifiedCategoryElement = document.getElementById('save-modified-category-btn');
        const inputValidation = new InputValidation('edit-category-input'); //можно передать в роуты
 
        // Добавляем слушателя события для нажатия на кнопку сохранения
        saveModifiedCategoryElement.addEventListener('click', () => {
            const title = inputValidation.inputElement.value;
            this.updateCostsCategory(title); // Вызываем метод обновления категории с новым заголовком
        });
    }




    // Метод для отмены изменения категории costs
    cancelModifiedCostsCategory() {
        const cancelModifiedCategoryElement = document.getElementById('cancel-modified-category-btn');

        cancelModifiedCategoryElement.addEventListener('click', () => { // Добавляем слушателя события для нажатия на кнопку
            location.href = '#/costs';
        });
    }


}