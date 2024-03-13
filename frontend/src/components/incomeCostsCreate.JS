import config from "../../config/config.js";
import { UrlManager } from "../utils/url-manager.js";
import { incomeCostsForm } from "./incomeCostsForm.js";
import { CustomHttp } from "./services/custom-http.js";

export class IncomeCostsCreate extends incomeCostsForm {
    constructor() {
        super();
       
        this.handleOperationCreationClick();
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