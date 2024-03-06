import config from "../../config/config.js";
import { UrlManager } from "../utils/url-manager.js";
import { CustomHttp } from "./services/custom-http.js";

export class IncomeCostsCreate {
    constructor() {
        this.routeParams = UrlManager.getQueryParams();
        this.income = [];
        this.selectedType;
        this.selectedOptionId;
        this.amountInput;
        this.dateInput;
        this.commentInput;
        this.formattedDate;
        this.typeOptions;
        this.getCategoriesEndpointHost = '';
        this.renderSelects();
        this.handleOperationCreationClick();
    }

    showHideTitleElements(incomeVisible, costVisible) {
        const titlePageIncome = document.getElementById('title-income');
        const titlePageCost = document.getElementById('title-cost');
        titlePageIncome.style.display = incomeVisible ? 'inline' : 'none';
        titlePageCost.style.display = costVisible ? 'inline' : 'none';
    }

    defineTransactionType() {
        if (this.routeParams.idIncome === 'create-income-btn') {
            this.typeOptions = ['Доход'];
            this.selectedType = 'income';
            this.getCategoriesEndpointHost = '/categories/income';
            this.showHideTitleElements(true, false);
        } else if (this.routeParams.idCost === 'create-cost-btn') {
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
        // let getCategoriesEndpointHost = '/categories/income';
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

        this.income.forEach((option, optionIndex) => {
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
            if (!(event.key >= '0' && event.key <= '9')) {
                event.preventDefault();
            }
        });
    }

    createDateInput(selectContainer) {
        const dateInput = document.createElement('input');
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

    formatDate(dateInput) {
        const dateParts = dateInput.split('-');
        return `${dateParts[2]}.${dateParts[1]}.${dateParts[0]}`;
    }

    handleOperationCreationClick() {
        document.getElementById('btn-create-operation').addEventListener('click', () => {
            const selectedCategory = document.getElementById('select');
            const typeSelect = document.getElementById('type');
            this.amountInput = document.getElementById('summ').value;
            this.dateInput = document.querySelector('input[type="date"]').value;
            this.commentInput = document.getElementById('comment').value;
            this.selectedOptionId = Number(selectedCategory.options[selectedCategory.selectedIndex].id);
            this.selectedType = typeSelect.options[typeSelect.selectedIndex].value === 'Доход' ? 'income' : 'expense';
            this.formattedDate = this.formatDate(this.dateInput);

            if (!this.selectedOptionId || this.amountInput === '' || this.dateInput === '' || this.commentInput === '') {
                alert('Пожалуйста, заполните все поля.');
                return;
            } else {
                this.createOperation(this.selectedType, this.selectedOptionId, this.amountInput, this.formattedDate, this.commentInput);
            }
        });
    }

    async createOperation(selectedType, selectedOptionId, amountInput, dateInput, commentInput) {
        try {
            const createOperation = await CustomHttp.request(config.host + '/operations', 'POST', {
                type: selectedType,
                amount: amountInput,
                date: dateInput,
                comment: commentInput,
                category_id: selectedOptionId
            });

            if (createOperation && createOperation.error) {
                if (createOperation.message === "This record already exists") {
                    console.error("Ошибка: Запись уже существует");
                } else {
                    console.error("Ошибка при создании операции:", createOperation.message);
                }
            } else {
                location.href = '#/incomeAndCosts';
            }
        } catch (error) {
            console.error('Ошибка при создании операции:', error);
        }
    }
}