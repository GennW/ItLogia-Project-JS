import config from "../../config/config.js";
import { UrlManager } from "../utils/url-manager.js";
import { CustomHttp } from "./services/custom-http.js";



export class Income {
    constructor() {
        this.income = [];
        this.categotyDelete = null;

        this.getIncomeCategories(); // Получение категорий при создании экземпляра класса

    }

    // Получение списка категорий
    async getIncomeCategories() {

        try {
            // Запрос к API для получения категорий дохода
            const result = await CustomHttp.request(config.host + '/categories/income');
            if (result) {
                if (result.error) {
                    throw new Error(result.message)
                }

                this.income = result; // Сохранение полученных категорий в массив
                this.processIncome(); // Отображение категорий на странице
            }

        } catch (error) {
            // Обработка ошибки
            console.error('Ошибка:', error);
        }
    }


    // Обработка и отображение категорий дохода на странице
    processIncome() {
        const container = document.querySelector('.main-items');
        const deleteCategoryElement = document.getElementById('delete-category');


        this.income.forEach(category => {
            const that = this;

            // Создание элементов для отображения категорий
            const card = document.createElement('div');
            const cardBody = document.createElement('div');
            const title = document.createElement('h5');
            const editButton = document.createElement('a');
            const deleteButton = document.createElement('a');


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


            // Обработчики событий для кнопок удаления, редактирования
            // Добавление обработчика события клика для кнопки удаления
            deleteButton.onclick = () => {
                this.populateModal(category.title, category.id); // Передаем название и идентификатор категории в метод для заполнения модального окна
            }

            // Добавление обработчика события клика для кнопки удаления модального окна
            deleteCategoryElement.onclick = function () {
                that.deleteCategoryIncome(this)
            }

            // Добавление обработчика события клика для кнопки редактирования ПЕРЕДАЧА ID на другую страницу
            editButton.onclick = () => {
                location.href = '#/incomeEdit?id=' + category.id + '&title=' + category.title;
            }
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

    // Удаление категории доходов
    async deleteCategoryIncome(element) {
        const dataId = element.getAttribute('data-id'); // Получаем идентификатор категории из data-id

        if (dataId) {
            try {
                // Выполняем запрос DELETE к API с передачей идентификатора категории
                const deletionResult = await CustomHttp.request(config.host + '/categories/income/' + dataId, 'DELETE');

                if (deletionResult) {
                    if (deletionResult.error) {
                        console.error('Ошибка при удалении категории:', deletionResult.error);
                    } else {
                        // Успешное удаление - переходим на новую страницу
                        location.href = '#/income';
                    }
                }
            } catch (error) {
                console.error('Ошибка при удалении категории:', error);
            }
        }

        // Удаление модального окна
        const modalBackdrop = document.querySelector('.modal-backdrop.show');

        if (modalBackdrop) {
            // Удаляем элемент
            modalBackdrop.remove();
        }
    }
}