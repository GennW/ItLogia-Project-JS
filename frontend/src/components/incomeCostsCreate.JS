import config from "../../config/config.js";
import { UrlManager } from "../utils/url-manager.js";
import { CustomHttp } from "./services/custom-http.js";

export class IncomeCostsCreate {
    constructor() {
        this.routeParams = UrlManager.getQueryParams();
        this.income = [];

        // Объявление переменных
        this.selectedType;
        this.selectedOptionId;
        this.amountInput;
        this.dateInput;
        this.commentInput;
        this.formattedDate;

        this.renderSelects();
        this.handleOperationCreationClick();
    }


    async renderSelects() {
        const selectContainer = document.querySelector('.col-4'); // Находим контейнер для размещения select

        let typeOptions = [];

        let getCategoriesEndpointHost = '/categories/income';
        const titlePageIncome = document.getElementById('title-income');
        const titlePageCost = document.getElementById('title-cost');

        // Определяем варианты для поля "Тип" select
        if (this.routeParams.idIncome === 'create-income-btn') {
            typeOptions = ['Доход'];
            titlePageCost.style.display = 'none';
        } else if (this.routeParams.idCost === 'create-cost-btn') {
            typeOptions = ['Расход'];
            titlePageIncome.style.display = 'none';
            getCategoriesEndpointHost = '/categories/expense';
        } else {
            console.log('Ошибка в вариантах выбора "Тип"')
        }
        try {
            // Запрос к API для получения категорий
            const result = await CustomHttp.request(config.host + getCategoriesEndpointHost);
            if (result && !result.error) {
                if (result.error) {
                    throw new Error(result.message)
                }

                this.income = result; // Сохранение полученных категорий в массив
            }

        } catch (error) {
            // Обработка ошибки
            console.error('Ошибка:', error);
        }

        // Создаем и добавляем "Тип" select с правильными вариантами
        const typeSelect = document.createElement('select');
        typeSelect.id = 'type'; // Устанавливаем id для "Тип" select
        typeSelect.className = 'form-control mb-2 select-placeholder';
        typeSelect.setAttribute('name', 'Тип');
        typeSelect.style.color = 'black';

        // Заполняем "Тип" select вариантами
        typeOptions.forEach((option) => {
            const optionElement = document.createElement('option');
            optionElement.value = option;
            optionElement.textContent = option;
            typeSelect.appendChild(optionElement);
        });

        selectContainer.appendChild(typeSelect); // Добавляем "Тип" select в контейнер

        const selectElement = document.createElement('select'); // Создаем элемент select
        selectElement.id = 'select'; // Присваиваем уникальный id на основе имени в нижнем регистре
        selectElement.className = 'form-control mb-2 select-placeholder'; // Добавляем классы для стилей
        selectElement.setAttribute('name', 'Тип'); // Устанавливаем имя для select
        selectElement.style.color = 'grey'; // Устанавливаем серый цвет

        const defaultOption = document.createElement('option'); // Создаем элемент option для плейсхолдера
        defaultOption.id = `placeholder`; // Генерируем  id для плейсхолдера
        defaultOption.value = '';
        defaultOption.selected = true;
        defaultOption.textContent = 'Тип...'; // Устанавливаем текст для плейсхолдера
        selectElement.appendChild(defaultOption); // Добавляем плейсхолдер в select

        this.income.forEach((option, optionIndex) => {
            const optionElement = document.createElement('option'); // Создаем элемент option для каждого варианта выбора
            optionElement.id = `${option.id}`; // Генерируем уникальный id для каждого варианта выбора
            optionElement.value = option.title; // Устанавливаем значение для варианта выбора
            optionElement.textContent = option.title; // Устанавливаем текст для варианта выбора
            selectElement.appendChild(optionElement); // Добавляем вариант выбора в select


            selectElement.addEventListener('change', (event) => {
                event.target.style.color = 'black'; // Изменяем цвет выбранного селекта на черный после выбора
            });

            selectContainer.appendChild(selectElement); // Добавляем select в контейнер
        });

        const amountInput = document.createElement('input'); // Создаем элемент input для ввода суммы
        amountInput.id = 'summ'; // Присваиваем уникальный id для input суммы
        amountInput.className = 'form-control mb-2'; // Добавляем классы для стилей
        amountInput.setAttribute('type', 'number'); // Устанавливаем тип input
        amountInput.setAttribute('placeholder', 'Сумма в $...'); // Устанавливаем плейсхолдер для input
        selectContainer.appendChild(amountInput); // Добавляем input суммы в контейнер для select

        // валидация поля на цифры
        amountInput.addEventListener('keydown', function (event) {
            if (!(event.key >= '0' && event.key <= '9')) { // Проверяем, что введен символ является цифрой
                event.preventDefault(); // Отменяем вставку любого символа, кроме цифр
            }
        });

        const dateInput = document.createElement('input'); // Создаем элемент input для ввода даты
        dateInput.className = 'form-control mb-2'; // Добавляем классы для стилей
        dateInput.setAttribute('type', 'date'); // Устанавливаем тип input
        dateInput.setAttribute('placeholder', 'Дата...'); // Устанавливаем плейсхолдер для input
        selectContainer.appendChild(dateInput); // Добавляем input даты в контейнер для select

        const commentInput = document.createElement('input'); // Создаем элемент input для ввода комментария
        commentInput.id = 'comment'; // Присваиваем уникальный id для input комментария
        commentInput.className = 'form-control md-2'; // Добавляем классы для стилей
        commentInput.setAttribute('type', 'text'); // Устанавливаем тип input
        commentInput.setAttribute('placeholder', 'Комментарий...'); // Устанавливаем плейсхолдер для input
        selectContainer.appendChild(commentInput); // Добавляем input комментария в контейнер для select
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
                alert('Пожалуйста, заполните все поля перед созданием операции.');
                return; // Прерываем выполнение функции, если не все поля заполнены
            } else {
                this.createOperation(this.selectedType, this.selectedOptionId, this.amountInput, this.formattedDate, this.commentInput);

            }
            // console.log('selectedType ===', this.selectedType);
            // console.log('selectedCategoryId ===', this.selectedOptionId);
            // console.log('amountInput ===', this.amountInput);
            // console.log('dateInput ===', this.dateInput);
            // console.log('commentInput ===', this.commentInput);
            // console.log('formattedDate ===', this.formattedDate);
        });
    }



    // отправка на сервер операций по доходам расходам
    async createOperation(selectedType, selectedOptionId, amountInput, dateInput, commentInput) {

        try {
            // Выполняем запрос с передачей объекта
            const createOperation = await CustomHttp.request(config.host + '/operations', 'POST', {
                type: selectedType, // Отправляем выбранный тип
                amount: amountInput, // Отправляем введенную сумму
                date: dateInput, // Отправляем отформатированную дату
                comment: commentInput, // Отправляем введенный комментарий
                category_id: selectedOptionId // Отправляем выбранный идентификатор категории
            });

            if (createOperation && createOperation.error) {
                if (createOperation.message === "This record already exists") {
                    console.error("Ошибка: Запись уже существует");
                    // Дополнительные действия при необходимости, например, вывод сообщения пользователю
                } else {
                    console.error("Ошибка при создании операции:", createOperation.message);
                }
            } else {
                // Успешное создание - выполните необходимые действия
                location.href = '#/incomeAndCosts';
            }
        } catch (error) {
            console.error('Ошибка при создании операции:', error);
        }
    }
}
