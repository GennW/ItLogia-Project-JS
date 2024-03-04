import { DomCreateCard } from "../../config/DOMCreate.js";
import config from "../../config/config.js";
import { UrlManager } from "../utils/url-manager.js";
import { CustomHttp } from "./services/custom-http.js";



export class Costs {
    constructor() {
        this.routeParams = UrlManager.getQueryParams();
        this.costs = [];
        this.createCard = new DomCreateCard();

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




   // Обработка списка категорий расходов и добавление их на страницу
   processCosts() {

    // Находим элементы
    const container = document.querySelector('.main-items'); // Получаем контейнер, в котором будем отображать категории
    const deleteCategoryElement = document.getElementById('delete-category'); // Получаем кнопку удаления категории

    this.costs.forEach(category => { // Проходим по каждой категории и создаем соответствующие HTML-элементы
        const that = this; // Сохраняем ссылку на текущий контекст

        // Создаем основные элементы
        const card = this.createCard.createElement('div', ['card', 'col-12', 'col-md-6', 'col-lg-4', 'm-2'], null, { 'data-id': category.id }); // Создаем карточку категории
        const cardBody = this.createCard.createElement('div', ['card-body']); // Создаем контейнер для содержимого карточки
        const title = this.createCard.createElement('h5', ['card-title', 'mb-3'], category.title); // Создаем заголовок категории
        const editButton = this.createCard.createElement('a', ['btn', 'btn-primary', 'me-2'], 'Редактировать', { href: 'javascript:void(0)' }); // Создаем кнопку "Редактировать"
        const deleteButton = this.createCard.createElement('a', ['btn', 'btn-danger'], 'Удалить', // Создаем кнопку "Удалить"
            {
                href: 'javascript:void(0)',
                'data-bs-toggle': 'modal',
                'data-bs-target': '#exampleModal'
            }
        );

        // Добавляем содержимое в карточку
        cardBody.appendChild(title); // Добавляем заголовок в карточку
        cardBody.appendChild(editButton); // Добавляем кнопку "Редактировать" в карточку
        cardBody.appendChild(deleteButton); // Добавляем кнопку "Удалить" в карточку
        card.appendChild(cardBody); // Добавляем содержимое карточки
        container.appendChild(card); // Добавляем карточку в контейнер

        // Обработчики событий для кнопок
        deleteButton.onclick = () => {
            this.populateModal(category.title, category.id); // При нажатии кнопки "Удалить" вызываем метод для заполнения модального окна
        }

        // Добавление обработчика события клика для кнопки удаления модального окна
        deleteCategoryElement.onclick = function () {
            that.deleteCategoryCost(this); // При нажатии кнопки удаления вызываем метод удаления категории
        }

        editButton.onclick = () => {
            location.href = `#/costsEdit?id=${category.id}&title=${category.title}`; // При нажатии кнопки "Редактировать" осуществляем переход на другую страницу
        }
    });

    // Создаем элемент "Добавить новую категорию"
    const newCategoryCard = this.createCard.createElement('div', ['card', 'col-12', 'col-md-6', 'col-lg-4', 'm-2']); // Создаем контейнер для новой категории
    const newCategoryCardBody = this.createCard.createElement('div', ['card-body', 'card-body-last', 'd-flex', 'align-items-center', 'justify-content-center']); // Создаем содержимое для новой категории
    const link = this.createCard.createElement('a', ['link-secondary', 'link-offset-2', 'link-underline', 'link-underline-opacity-0'], '+', { href: '#/costsCreate' }); // Создаем ссылку для создания новой категории

    newCategoryCardBody.appendChild(link); // Добавляем ссылку в содержимое карточки
    newCategoryCard.appendChild(newCategoryCardBody); // Добавляем содержимое карточки
    container.appendChild(newCategoryCard); // Добавляем карточку в контейнер
}


    //устанавливам идентификатор категории в атрибут data-id кнопки "удалить" в модальном окне.
    populateModal(title, id) {
        const modalTitle = document.querySelector('.modal-title'); // Находим элемент с заголовком модального окна
        const deleteCategoryButton = document.getElementById('delete-category'); // Находим кнопку "удалить" в модальном окне
        modalTitle.textContent = `Вы действительно хотите удалить категорию "${title}"? Связанные расходы будут удалены навсегда.`;
        deleteCategoryButton.setAttribute('data-id', id); // Устанавливаем data-id для кнопки "удалить" в модальном окне, чтобы иметь доступ к идентификатору категории при подтверждении удаления
    }



    // Удаление категории расходов
    async deleteCategoryCost(element) {
        const dataId = element.getAttribute('data-id'); // Получаем идентификатор категории 
console.log(dataId, element)
        if (dataId) {
            try {
                // Выполняем запрос DELETE к API с передачей идентификатора категории
                const deletionResult = await CustomHttp.request(config.host + '/categories/expense/' + dataId, 'DELETE');

                if (deletionResult) {
                    if (deletionResult.error) {
                        console.error('Ошибка при удалении категории:', deletionResult.error);
                    } else {
                        // Успешное удаление - переходим на новую страницу
                        location.href = '#/costs';
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