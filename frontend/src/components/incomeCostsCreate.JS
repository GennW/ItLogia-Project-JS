import { UrlManager } from "../utils/url-manager.js";

export class IncomeCostsCreate {
    constructor() {
        this.routeParams = UrlManager.getQueryParams();
        this.renderSelects();
    }
    /////////////////////////////////////////////////////////////////////////////////////
    renderSelects() {

        const selectContainer = document.querySelector('.col-4'); // Контейнер для полей select
        const selectsData = [
            { name: 'Тип', options: ['Доход', 'Расход'], placeholder: 'Тип...' },
            { name: 'Категория', options: ['Категория 1', 'Категория 2', 'Категория 3'], placeholder: 'Категория...' },

        ];

        // Создаем поля select на основе данных
        selectsData.forEach((selectData) => {
            const selectElement = document.createElement('select');

            // Добавляем класс для стилей
            selectElement.className = 'form-control mb-2 select-placeholder'; // Добавляем класс плейсхолдера
            // Устанавливаем имя для селекта
            selectElement.setAttribute('name', selectData.name);

            // Создаем и добавляем плейсхолдер в селект
            const defaultOption = document.createElement('option');
            defaultOption.value = '';
            defaultOption.disabled = true;
            defaultOption.selected = true;
            defaultOption.textContent = selectData.placeholder;
            selectElement.appendChild(defaultOption);

            // Добавляем пункты выбора в селект на основе данных из selectData
            selectData.options.forEach((option) => {
                const optionElement = document.createElement('option');
                optionElement.text = option;
                optionElement.value = option;
                selectElement.appendChild(optionElement);
            });

            // Устанавливаем серый цвет для всех селектов при загрузке страницы
            selectElement.style.color = 'grey';

            // Добавляем слушателя событий для каждого селекта
            selectElement.addEventListener('change', (event) => {
                event.target.style.color = 'black'; // Изменяем цвет выбранного селекта на черный
            });

            selectContainer.appendChild(selectElement);
        });

        // Добавляем текстовые поля под существующими селектами
        const amountInput = document.createElement('input');
        amountInput.className = 'form-control mb-2';
        amountInput.setAttribute('type', 'text');
        amountInput.setAttribute('placeholder', 'Сумма в $...');
        selectContainer.appendChild(amountInput);

        // Добавляем слушатель для ввода только цифр 
        amountInput.addEventListener('input', function (event) {
            if (event.key === 'e') { // Проверяем, если введен символ "e"
                event.preventDefault(); // Отменяем действие по вводу символа "e"
            }
            if (/\D/.test(this.value)) { // Проверяем наличие любого символа, не являющегося цифрой 
                this.value = this.value.replace(/\D/g, ''); // Заменяем недопустимые символы на пустую строку
            }
        });


        const dateInput = document.createElement('input');
        dateInput.className = 'form-control mb-2';
        dateInput.setAttribute('type', 'date');
        dateInput.setAttribute('placeholder', 'Дата...');
        selectContainer.appendChild(dateInput);

        const commentInput = document.createElement('input');
        commentInput.className = 'form-control mb-2';
        commentInput.setAttribute('type', 'text');
        commentInput.setAttribute('placeholder', 'Комментарий...');
        selectContainer.appendChild(commentInput);
    }

}
