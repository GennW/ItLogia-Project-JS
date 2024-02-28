import config from "../../config/config.js";
import { UrlManager } from "../utils/url-manager.js";
import { CustomHttp } from "./services/custom-http.js";



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

        const deleteCategoryElement = document.getElementById('delete-category');


        // Проходимся по массиву категорий и создаем для каждой категории соответствующий HTML-элемент
        this.costs.forEach(category => {
            const that = this;
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

            // Обработчики событий для кнопок удаления, редактирования
            // Добавление обработчика события клика для кнопки удаления
            deleteButton.onclick = () => {
                this.populateModal(category.title, category.id); // Передаем название и идентификатор категории в метод для заполнения модального окна
            }

            // Добавление обработчика события клика для кнопки удаления модального окна
            deleteCategoryElement.onclick = function () {
                that.deleteCategoryCost(this)
            }

            // Добавление обработчика события клика для кнопки редактирования ПЕРЕДАЧА ID на другую страницу
            editButton.onclick = () => {
                location.href = '#/costsEdit?id=' + category.id + '&title=' + category.title;
            }

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

        // заполняем модальное окно инфо о выбранной категории. 
    //устанавливам идентификатор категории в атрибут data-id кнопки "удалить" в модальном окне.
    populateModal(title, id) {
        const modalTitle = document.querySelector('.modal-title'); // Находим элемент с заголовком модального окна
        const deleteCategoryButton = document.getElementById('delete-category'); // Находим кнопку "удалить" в модальном окне
        modalTitle.textContent = `Вы действительно хотите удалить категорию "${title}"? Связанные расходы будут удалены навсегда.`;
        deleteCategoryButton.setAttribute('data-id', id); // Устанавливаем data-id для кнопки "удалить" в модальном окне, чтобы иметь доступ к идентификатору категории при подтверждении удаления
    }

    // Удаление категории расходов
    async deleteCategoryCost(element) {
        const dataId = element.getAttribute('data-id'); // Получаем идентификатор категории из data-id

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