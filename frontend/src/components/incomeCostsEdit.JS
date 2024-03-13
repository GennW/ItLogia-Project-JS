import config from "../../config/config.js";
import { UrlManager } from "../utils/url-manager.js";
import { incomeCostsForm } from "./incomeCostsForm.js";
import { CustomHttp } from "./services/custom-http.js";



export class IncomeCostsEdit extends incomeCostsForm {
    constructor() {
        super();
        this.routeParams = UrlManager.getQueryParams();
        console.log('routeParams.operationId',this.routeParams.operationId)


        // меняем заголовок "Редактирование дохода(расхода)"
        if (this.operation.type === 'expense') {
            this.showHideTitleElements(false, true);
        } else {
            this.showHideTitleElements(true, false);

        }


        this.handleOperationCreationClick();
    }


    fillFormFieldsFromOperation() {
        const typeSelect = document.getElementById('type');
        const amountInput = document.getElementById('summ');
        console.log(this.operation)
        const dateInput = document.getElementById('date-input');
        const commentInput = document.getElementById('comment');
        const selectElement = document.getElementById('select');

        // Устанавливаем значение суммы
        amountInput.value = this.operation.amount;

        // Устанавливаем значение даты
        dateInput.value = this.operation.date;

        // Устанавливаем значение комментария
        commentInput.value = this.operation.comment;

        // Устанавливаем значение категории
        selectElement.value = this.operation.category;

        console.log('this.operation.category===', this.operation.type, this.selectedType, this.typeOptions)


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
            // this.formattedDate = this.formatDate(this.dateInput);
            

            if (!this.selectedOptionId || this.amountInput === '' || this.dateInput === '' || this.commentInput === '') {
                alert('Пожалуйста, заполните все поля.');
                return;
            } else {
                this.createOperation(this.selectedType, this.selectedOptionId, this.amountInput, this.dateInput, this.commentInput);
            }
        });
    }

    async createOperation(selectedType, selectedOptionId, amountInput, dateInput, commentInput) {
        
        try {
            const createOperation = await CustomHttp.request(config.host + '/operations/' + this.operation.id, 'PUT', {
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