import { UrlManager } from "../utils/url-manager.js";


export class IncomeEdit {
    constructor() {
        this.routeParams = UrlManager.getQueryParams();
    }

     //редактирование категрии
     async editCategory(dataId) {
        try {
            // Выполнить запрос PUT к API с передачей идентификатора категории
            categotyEdit = await CustomHttp.request(config.host + '/categories/income/' + dataId, 'PUT');
            if (this.categotyEdit) {
                console.log(this.categotyEdit)
                if (this.categotyEdit.error) {
                    throw new Error(this.categotyEdit.error);
                }
            }
        } catch (error) {
            console.error(error);
        }
    }

    editCategoryIncome(element) {
        if (!element) {
            console.error('Отсутствует элемент для правки категории');
            return;
        }

        const dataId = element.getAttribute('data-id'); // Получаем идентификатор категории из data-id

        if (dataId) {

            // удаление модального окна и переход на новую страницу будут происходить только при успешном удалении категории
            try {
                // Выполняем запрос на удаление категории
                const editionResult = this.editCategory(dataId);
                // Проверяем успешность удаления перед переходом на новую страницу
                if (editionResult && !editionResult.error) {
                    // Успешное удаление - переходим на новую страницу
                    location.href = '#/income';
                } else {
                    // В случае ошибки выводим сообщение в консоль и не переходим на новую страницу
                    console.error('Ошибка при удалении категории:', editionResult.message);
                }

            } catch (error) {
                throw new Error('Ошибка при удалении категории:', error);
            }
        }
    }
}