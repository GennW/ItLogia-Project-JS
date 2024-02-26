import config from "../../config/config.js";
import { UrlManager } from "../utils/url-manager.js";
import { CustomHttp } from "./services/custom-http.js";


export class Income {
    constructor() {
        this.routeParams = UrlManager.getQueryParams();
        this.income = [];
        this.getCategories();
    }

    async getCategories() {

        try {
            const result = await CustomHttp.request(config.host + '/categories/income');
            if (result) {
                if (result.error) {
                    throw new Error(result.message)
                }

                this.income = result;
                console.log(this.income)
                this.processIncome();
            }

        } catch (error) {
            // Обработка ошибки
            console.error('Ошибка:', error);
        }
    }

    processIncome() {
        const container = document.querySelector('.main-items');

        this.income.forEach(category => {
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
    

}