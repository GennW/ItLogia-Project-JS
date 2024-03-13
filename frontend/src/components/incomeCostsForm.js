import config from "../../config/config.js";
import { UrlManager } from "../utils/url-manager.js";
import { CustomHttp } from "./services/custom-http.js";

export class incomeCostsForm {
    constructor() {
        this.routeParams = UrlManager.getQueryParams();
        this.editOperation = localStorage.getItem('operationData');
        this.operation = JSON.parse(this.editOperation);
        this.income = [];
        this.selectedType;
        this.selectedOptionId;
        this.amountInput;
        this.dateInput;
        this.commentInput;
        this.typeOptions;
        this.getCategoriesEndpointHost = '';
        this.renderSelects();

    }

    showHideTitleElements(incomeVisible, costVisible) {
        const titlePageIncome = document.getElementById('title-income');
        const titlePageCost = document.getElementById('title-cost');
        titlePageIncome.style.display = incomeVisible ? 'inline' : 'none';
        titlePageCost.style.display = costVisible ? 'inline' : 'none';
    }


    defineTransactionType() {
// определяем тип (доход или расход) на основе параметров URL страницы 
// incomeCostsCreate где параметр передаем через url и данных  на странице incomeCostsEdit
// в коротой параметр (тип операции) передаем через localstorage
        if (this.routeParams.idIncome === 'create-income-btn' || this.routeParams.operationId) {
            this.typeOptions = ['Доход'];
            this.selectedType = 'income';
            this.getCategoriesEndpointHost = '/categories/income';
            this.showHideTitleElements(true, false);
        } else if (this.routeParams.idCost === 'create-cost-btn' || this.routeParams.operationId) {
            this.typeOptions = ['Расход'];
            this.selectedType = 'expense';
            this.getCategoriesEndpointHost = '/categories/expense';
            this.showHideTitleElements(false, true);
        } else {
            console.log('Ошибка в вариантах выбора "Тип"');
        }
    }

    async renderSelects() {
        const selectContainer = document.querySelector('.col-4');
        this.typeOptions = [];
        this.defineTransactionType();

        try {
            const result = await CustomHttp.request(config.host + this.getCategoriesEndpointHost);
            if (result && !result.error) {
                if (result.error) {
                    throw new Error(result.message)
                }
                this.income = result;
            }
        } catch (error) {
            console.error('Ошибка:', error);
        }

        this.createTypeSelect(selectContainer);
        this.createCategorySelect(selectContainer);
        this.createAmountInput(selectContainer);
        this.createDateInput(selectContainer);
        this.createCommentInput(selectContainer);

        if (!this.routeParams.idIncome && !this.routeParams.idCost) {
            
            // вызываем фунцию заполнения полей из class IncomeCostsEdit extends incomeCostsForm
        this.fillFormFieldsFromOperation();
        }
        
    }

    createTypeSelect(selectContainer) {
        const typeSelect = document.createElement('select');
        typeSelect.id = 'type';
        typeSelect.className = 'form-control mb-2 select-placeholder';
        typeSelect.setAttribute('name', 'Тип');
        typeSelect.style.color = 'black';

        this.typeOptions.forEach((option) => {
            const optionElement = document.createElement('option');
            optionElement.value = option;
            optionElement.textContent = option;
            typeSelect.appendChild(optionElement);
        });

        selectContainer.appendChild(typeSelect);
    }

    createCategorySelect(selectContainer) {
        const selectElement = document.createElement('select');
        selectElement.id = 'select';
        selectElement.className = 'form-control mb-2 select-placeholder';
        selectElement.setAttribute('name', 'Тип');
        selectElement.style.color = 'grey';

        const defaultOption = document.createElement('option');
        defaultOption.id = `placeholder`;
        defaultOption.value = '';
        defaultOption.selected = true;
        defaultOption.textContent = 'Тип...';
        selectElement.appendChild(defaultOption);

        this.income.forEach((option) => {
            const optionElement = document.createElement('option');
            optionElement.id = `${option.id}`;
            optionElement.value = option.title;
            optionElement.textContent = option.title;
            selectElement.appendChild(optionElement);

            selectElement.addEventListener('change', (event) => {
                event.target.style.color = 'black';
            });

            selectContainer.appendChild(selectElement);
        });
    }

    createAmountInput(selectContainer) {
        const amountInput = document.createElement('input');
        amountInput.id = 'summ';
        amountInput.className = 'form-control mb-2';
        amountInput.setAttribute('type', 'number');
        amountInput.setAttribute('placeholder', 'Сумма в $...');
        selectContainer.appendChild(amountInput);

        amountInput.addEventListener('keydown', function (event) {
            if (!(event.key >= '0' && event.key <= '9'
                || event.key === 'Backspace' || event.key === 'Delete'
                || event.key === 'ArrowLeft' || event.key === 'ArrowRight')) {
                event.preventDefault();
            }
        });
    }

    createDateInput(selectContainer) {
        const dateInput = document.createElement('input');
        dateInput.id = 'date-input';
        dateInput.className = 'form-control mb-2';
        dateInput.setAttribute('type', 'date');
        dateInput.setAttribute('placeholder', 'Дата...');
        selectContainer.appendChild(dateInput);

    }

    createCommentInput(selectContainer) {
        const commentInput = document.createElement('input');
        commentInput.id = 'comment';
        commentInput.className = 'form-control md-2';
        commentInput.setAttribute('type', 'text');
        commentInput.setAttribute('placeholder', 'Комментарий...');
        selectContainer.appendChild(commentInput);
    }

    // formatDate(dateInput) {
    //     const dateParts = dateInput.split('.');

    //     return `${dateParts[2]}.${dateParts[1]}.${dateParts[0]}`;
    // }


}