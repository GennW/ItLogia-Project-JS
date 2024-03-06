import { UrlManager } from "../utils/url-manager.js";


export class IncomeCostsEdit {
    constructor() {
        // Получаем данные операции из localStorage
        const editOperation = localStorage.getItem('operationData');
        
        if (editOperation) {
            const operation = JSON.parse(editOperation);
            
            // Находим соответствующие элементы формы
            const incomeInput = document.querySelector('input[placeholder="Доход"]');
            const categoryInput = document.querySelector('input[placeholder="Зарплата"]');
            const amountInput = document.querySelector('input[placeholder="500$"]');
            const dateInput = document.querySelector('input[type="date"]');
            const commentInput = document.querySelector('input[placeholder="Комментарий..."]');
            
            // Заполняем поля формы данными операции
            incomeInput.value = operation.type === 'income' ? 'Доход' : 'Расход';
            categoryInput.value = operation.category;
            amountInput.value = operation.amount;
            dateInput.value = operation.date;
            commentInput.value = operation.comment;
        }
    }
}