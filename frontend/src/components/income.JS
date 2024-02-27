import config from "../../config/config.js";
import { UrlManager } from "../utils/url-manager.js";
import { CustomHttp } from "./services/custom-http.js";



export class Income {
    constructor() {
        this.routeParams = UrlManager.getQueryParams();
        this.income = [];
        this.getCategories();
        this.categotyDelete = null;
        this.categotyEdit = null;
    }

    async getCategories() {

        try {
            const result = await CustomHttp.request(config.host + '/categories/income');
            if (result) {
                if (result.error) {
                    throw new Error(result.message)
                }

                this.income = result;
                this.processIncome();
            }

        } catch (error) {
            // Обработка ошибки
            console.error('Ошибка:', error);
        }
    }

    //Удаление категории
    async deleteCategory(dataId) {
        try {
            // Выполнить запрос DELETE к API с передачей идентификатора категории
            this.categotyDelete = await CustomHttp.request(config.host + '/categories/income/' + dataId, 'DELETE');
            if (this.categotyDelete) {
                if (this.categotyDelete.error) {
                    throw new Error(this.categotyDelete.error);
                }
            }
        } catch (error) {
            console.error(error);
        }
    }

   

    processIncome() {
        const container = document.querySelector('.main-items');
        const deleteCategoryElement = document.getElementById('delete-category');
        const editCategoryElement = document.getElementById('edit-category');


        this.income.forEach(category => {
            const that = this;

            const card = document.createElement('div');
            const cardBody = document.createElement('div');
            const title = document.createElement('h5');
            const editButton = document.createElement('a');
            const deleteButton = document.createElement('a');

            /////////////////////////////////////////
            //////////////////////////////////////////

            // Добавление обработчика события клика для кнопки удаления
            deleteButton.onclick = () => {
                this.populateModal(category.title, category.id); // Передаем название и идентификатор категории в метод для заполнения модального окна
            }

            // Добавление обработчика события клика для кнопки удаления модального окна
            deleteCategoryElement.onclick = function () {
                that.deleteCategoryIncome(this)
            }


            // Добавление обработчика события клика для кнопки редактирования
            editButton.onclick = () => {
                location.href = '#/incomeEdit' + category.id;

                // this.editCategory(category.id); // Передаем идентификатор категории в метод 
            }

            // Добавление обработчика события клика для кнопки редактирования 
            editCategoryElement.onclick = function () {
                that.editCategoryIncome(this)
            }
            card.classList.add('card', 'col-12', 'col-md-6', 'col-lg-4', 'm-2');
            cardBody.classList.add('card-body');
            title.classList.add('card-title', 'mb-3');
            editButton.classList.add('btn', 'btn-primary', 'me-3');
            deleteButton.classList.add('btn', 'btn-danger');

            title.textContent = category.title;
            editButton.textContent = 'Редактировать';
            editButton.href = 'javascript:void(0)';
            deleteButton.textContent = 'Удалить';
            deleteButton.href = 'javascript:void(0)';
            deleteButton.setAttribute('data-bs-toggle', 'modal');
            deleteButton.setAttribute('data-bs-target', '#exampleModal');

            // берем с бекенда и назначаем id карточкам
            card.setAttribute('data-id', category.id);


            cardBody.appendChild(title);
            cardBody.appendChild(editButton);
            cardBody.appendChild(deleteButton);
            card.appendChild(cardBody);
            container.appendChild(card);
        });

        // Создание элемента "Добавить новую категорию"
        const newCategoryCard = document.createElement('div');
        const newCategoryCardBody = document.createElement('div');
        const link = document.createElement('a');

        newCategoryCard.classList.add('card', 'col-12', 'col-md-6', 'col-lg-4', 'm-2');
        newCategoryCardBody.classList.add('card-body', 'card-body-last', 'd-flex', 'align-items-center', 'justify-content-center');
        link.classList.add('link-secondary', 'link-offset-2', 'link-underline', 'link-underline-opacity-0');
        link.textContent = '+';
        link.href = '#/incomeCreate';

        newCategoryCardBody.appendChild(link);
        newCategoryCard.appendChild(newCategoryCardBody);
        container.appendChild(newCategoryCard);
    }

    // заполняем модальное окно инфо о выбранной категории. 
    //устанавливам идентификатор категории в атрибут data-id кнопки "удалить" в модальном окне.
    populateModal(title, id) {
        const modalTitle = document.querySelector('.modal-title'); // Находим элемент с заголовком модального окна
        const deleteCategoryButton = document.getElementById('delete-category'); // Находим кнопку "удалить" в модальном окне
        modalTitle.textContent = `Вы действительно хотите удалить категорию "${title}"? Связанные доходы будут удалены навсегда.`;
        deleteCategoryButton.setAttribute('data-id', id); // Устанавливаем data-id для кнопки "удалить" в модальном окне, чтобы иметь доступ к идентификатору категории при подтверждении удаления
    }

    // editPage(id) {
    //     const saveModifiedCategoryElement = document.getElementById('save-modified-category-btn');
    //     const editCategoryInputElement = document.getElementById('edit-category-input');

    //     saveModifiedCategoryElement.setAttribute('data-id', id);
    //     console.log(editCategoryInputElement.value);

    // }

    deleteCategoryIncome(element) {
        if (!element) {
            console.error('Отсутствует элемент для удаления категории');
            return;
        }

        const dataId = element.getAttribute('data-id'); // Получаем идентификатор категории из data-id

        if (dataId) {

            // удаление модального окна и переход на новую страницу будут происходить только при успешном удалении категории
            try {
                // Выполняем запрос на удаление категории
                const deletionResult = this.deleteCategory(dataId);
                // Проверяем успешность удаления перед переходом на новую страницу
                if (deletionResult && !deletionResult.error) {
                    // Успешное удаление - переходим на новую страницу
                    location.href = '#/income';
                } else {
                    // В случае ошибки выводим сообщение в консоль и не переходим на новую страницу
                    console.error('Ошибка при удалении категории:', deletionResult.message);
                }

            } catch (error) {
                throw new Error('Ошибка при удалении категории:', error);
            }

            // Удаление модального окна
            const modalBackdrop = document.querySelector('.modal-backdrop.show');

            if (modalBackdrop) {
                // Удаляем элемент
                modalBackdrop.remove();
            }
        }
    }


}