import config from "../../config/config.js";
import { UrlManager } from "../utils/url-manager.js";
import { CustomHttp } from "./services/custom-http.js";

export class IncomeCostsCreate {
    constructor() {
        this.routeParams = UrlManager.getQueryParams();
        this.renderSelects();


    }


    renderSelects() {
        const selectContainer = document.querySelector('.col-4'); // Находим контейнер для размещения select
        const selectsData = [
            { name: 'Тип', options: ['Доход', 'Расход'], placeholder: 'Тип...' }, // Данные для первого select
            { name: 'Категория', options: ['Категория 1', 'Категория 2', 'Категория 3'], placeholder: 'Категория...' }, // Данные для второго select
        ];

        selectsData.forEach((selectData) => {
            const selectElement = document.createElement('select'); // Создаем элемент select
            selectElement.id = selectData.name.toLowerCase(); // Присваиваем уникальный id на основе имени в нижнем регистре
            selectElement.className = 'form-control mb-2 select-placeholder'; // Добавляем классы для стилей
            selectElement.setAttribute('name', selectData.name); // Устанавливаем имя для select
            selectElement.style.color = 'grey'; // Устанавливаем серый цвет

            const defaultOption = document.createElement('option'); // Создаем элемент option для плейсхолдера
            defaultOption.id = `${selectData.name.toLowerCase()}-1`; // Генерируем уникальный id для плейсхолдера
            defaultOption.value = '';
            defaultOption.selected = true;
            defaultOption.textContent = selectData.placeholder; // Устанавливаем текст для плейсхолдера
            selectElement.appendChild(defaultOption); // Добавляем плейсхолдер в select

            selectData.options.forEach((option, optionIndex) => {
                const optionElement = document.createElement('option'); // Создаем элемент option для каждого варианта выбора
                optionElement.id = `${selectData.name.toLowerCase()}-${optionIndex + 2}`; // Генерируем уникальный id для каждого варианта выбора
                optionElement.value = option; // Устанавливаем значение для варианта выбора
                optionElement.textContent = option; // Устанавливаем текст для варианта выбора
                selectElement.appendChild(optionElement); // Добавляем вариант выбора в select
            });

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


    // отправка на сервер операций по доходам расходам
    async createOperationIncome() {
        
        // if (this.routeParams.idIncome === 'create-income-btn') {}

            try {
                // Выполняем запрос с передачей объекта
                const createOperation = await CustomHttp.request(config.host + '/operations', 'POST', {
                    type: "income",
                    amount: 250,
                    date: "2022-01-01",
                    comment: "new comment",
                    category_id: 2
                });

                if (deletionResult) {
                    if (deletionResult.error) {
                        console.error('Ошибка при удалении категории:', deletionResult.error);
                    } else {
                        // Успешное удаление - переходим на новую страницу
                        location.href = '#/income';
                    }
                }
            } catch (error) {
                console.error('Ошибка при удалении категории:', error);
            }
        

    }

}
