import config from "../../config/config.js";
import icons from "../../config/icons.js";
import { UrlManager } from "../utils/url-manager.js";
import { CustomHttp } from "./services/custom-http.js";



export class IncomeAndCosts {
    constructor() {
        this.routeParams = UrlManager.getQueryParams();
        this.operations = [];
        this.buttons = {
            FILTER_DAY: document.getElementById('btn-filter-day'),
            FILTER_WEEK: document.getElementById('btn-filter-week'),
            FILTER_MONTH: document.getElementById('btn-filter-month'),
            FILTER_YEAR: document.getElementById('btn-filter-year'),
            FILTER_ALL: document.getElementById('btn-filter-all'),
            FILTER_INTERVAL: document.getElementById('btn-filter-interval')
        };
        this.init();

    }

    init() {
        this.getOperations('all');
        this.btnCreateRedirectWithId();
        this.setDefaultActiveButton();
        this.bntFilterOperations();
        this.handleIntervalFilter();
    }

    async getOperations(period) {
        try {
            const result = await CustomHttp.request(config.host + `/operations?period=${period}`);
            if (result && !result.error) {
                this.operations = result;

                this.createTable();
            }
        } catch (error) {
            console.error('Ошибка:', error);
        }
    }

    createTable() {
        const wrapperContent = document.getElementById('content-table'); // Получение контейнера для таблицы
        const table = document.createElement('table'); // Создание элемента таблицы
        table.classList.add('table', 'text-center', 'fs-6'); // Добавление классов к таблице

        const thead = this.createTableHeader(); // Создание заголовка таблицы
        table.appendChild(thead); // Добавление заголовка к таблице

        const tbody = this.createTableBody(); // Создание тела таблицы
        table.appendChild(tbody); // Добавление тела к таблице

        wrapperContent.appendChild(table); // Добавление таблицы в контейнер
    }

    createTableHeader() {
        const thead = document.createElement('thead'); // Создание элемента заголовка таблицы
        const headerNames = ['№ операции', 'Тип', 'Категория', 'Сумма', 'Дата', 'Комментарий', '']; // Наименование столбцов
        const headerRow = this.createTableRow(headerNames, 'text-primary-emphasis'); // Создание строки заголовка таблицы
        thead.appendChild(headerRow); // Добавление строки заголовка к заголовку таблицы
        return thead; // Возврат заголовка таблицы
    }

    createTableBody() {
        const tbody = document.createElement('tbody'); // Создание элемента тела таблицы

        let rowNum = 1; // Начинаем нумерацию с 1
        this.operations.forEach((data) => { // Перебор операций для создания строк таблицы
            //массив данных для каждой строки в таблице операций, где каждый элемент массива представляет определенный столбец в таблице
            console.log(data.category)
            if (data.category !== undefined) { // Проверка наличия значения в колонке "Категория"
                const cellData = [
                    rowNum,
                    data.type === 'expense' ? 'Расходы' : 'Доходы', //Если тип равен 'expense', в ячейке будет отображаться 'Расходы', иначе 'Доходы'.
                    data.category,
                    data.amount,
                    data.date,
                    data.comment
                ];
                const row = this.createTableRow(cellData);
                const iconCell = this.createIconCell(data.id);
                row.appendChild(iconCell);
                tbody.appendChild(row);
                rowNum++;  // Увеличиваем номер строки для следующей итерации
            }
        });

        return tbody;
    }

    createTableRow(data) {
        const row = document.createElement('tr');
        data.forEach(text => {
            const cell = document.createElement('td');
            cell.textContent = text;
            row.appendChild(cell);
        });
        return row;
    }

    createIconCell(operationId) {
        const iconCell = document.createElement('td');
        const icoWrapper = document.createElement('div');
        icoWrapper.classList.add('ico-wrapper', 'text-end');

        const deleteLink = this.createIconLink('Delete', 'modal', '#exampleModal', icons.icoDelete, operationId);
        const editLink = this.createIconLink('Edit', 'incomeCostsEdit', '', icons.icoEdit, operationId);

        icoWrapper.appendChild(deleteLink);
        icoWrapper.appendChild(editLink);

        iconCell.appendChild(icoWrapper);


        return iconCell;
    }



    createIconLink(action, toggle, target, icon, operationId) {
        const link = document.createElement('a');
        link.classList.add('link-offset-2', 'link-', 'link-underline-opacity-0');
        link.href = 'javascript:void(0)';
        link.setAttribute('data-bs-toggle', toggle);
        link.setAttribute('data-bs-target', target);
        link.setAttribute('data-id', operationId);
        link.innerHTML = icon;


        link.addEventListener('click', () => {
            this.editDeleteLinkHandler(action, operationId);
        });

        return link;
    }

    async deleteOperation(operationId) {

        try {
            const result = await CustomHttp.request(config.host + '/operations/' + operationId, 'DELETE');
            if (result && !result.error) {

                location.href = '#/incomeAndCosts';
                // this.updateTable();

                // Удаление модального окна
                const modalBackdrop = document.querySelector('.modal-backdrop.show');

                if (modalBackdrop) {
                    // Удаляем элемент
                    modalBackdrop.remove();
                }

            }
        } catch (error) {
            console.error('Ошибка при удалении операции:', error);
        }
    }

    editDeleteLinkHandler(action, operationId) {
        this.populateModal(operationId);
        const deleteOperationButton = document.getElementById('delete-operation');
        if (action === 'Delete') {
            deleteOperationButton.onclick = () => {
                this.deleteOperation(operationId);
            };
        } else if (action === 'Edit') {
            const operation = this.operations.find(op => op.id === operationId); // Находим операцию по идентификатору
            const operationData = JSON.stringify(operation); // Преобразуем данные операции в JSON строку
            // const encodedOperationData = encodeURIComponent(operationData); // Кодируем JSON строку для передачи через URL            
            localStorage.setItem('operationData', operationData); // Сохраняем данные операции в localStorage
            location.href = `#/incomeCostsEdit?operationId=${operation.id}`; // Переходим на страницу редактирования с передачей operationId в URL

        }
    }


    btnCreateRedirectWithId() {
        const btnIncome = document.getElementById('create-income-btn');
        const btnCost = document.getElementById('create-cost-btn');

        if (btnIncome) {
            btnIncome.addEventListener('click', function () {
                localStorage.setItem('incomeId', btnIncome.id); // Устанавливаем значение id в локальное хранилище
                location.href = '/#/incomeCostsCreate?idIncome=' + btnIncome.id;
            });
        }
        if (btnCost) {
            btnCost.addEventListener('click', function () {
                localStorage.setItem('costId', btnCost.id); // Устанавливаем значение id в локальное хранилище
                location.href = '/#/incomeCostsCreate?idCost=' + btnCost.id;
            });
        }
    }

    populateModal(id) {
        // const modalTitle = document.querySelector('.modal-title'); // Находим элемент с заголовком модального окна
        const deleteOperationButton = document.getElementById('delete-operation'); // Находим кнопку "удалить" в модальном окне
        // modalTitle.textContent = `Вы действительно хотите удалить категорию? Связанные доходы будут удалены навсегда.`;
        deleteOperationButton.setAttribute('data-id', id); // Устанавливаем data-id для кнопки "удалить" в модальном окне, чтобы иметь доступ к идентификатору категории при подтверждении удаления
    }


    bntFilterOperations() {
        // объект для хранения соответствия между идентификаторами кнопок и периодами
        const periodHandlers = {
            'FILTER_ALL': 'all',
            'FILTER_DAY': 'day',
            'FILTER_WEEK': 'week',
            'FILTER_MONTH': 'month',
            'FILTER_YEAR': 'year',
            'FILTER_INTERVAL': 'interval'
        };

        // обработчики событий клика кнопкам в соответствии с периодами
        for (const buttonId in periodHandlers) {
            // Добавляем обработчик события клика для каждой кнопки
            this.buttons[buttonId].addEventListener('click', () => {
                // Вызываем функцию для обновления классов кнопок в зависимости от выбранной кнопки
                this.updateButtonClass(buttonId);
                // Очищаем содержимое контейнера таблицы перед обновлением
                this.clearTableWithOperations();
                // Получаем и отображаем операции в зависимости от выбранного периода
                this.getOperations(periodHandlers[buttonId]);
            });
        }
    }

    // обработка выбора даты начала и конца интервала
    handleIntervalFilter() {
        // Получаем элементы для выбора дат "От" и "До" интервала
        const dateFrom = document.getElementById('startDate');
        const dateTo = document.getElementById('endDate');
        const period = 'interval';  // Устанавливаем период для запроса

        const handleIntervalChange = () => {
            this.getOperationsWithInterval(period, dateFrom.value, dateTo.value);
        };

        // обработчик при клике на даты без выбора фильтра интервал
        const handleFilterIntervalClick = () => {

            if (dateFrom.value !== '' && dateTo.value !== '') { // Проверяем, заполнены ли оба поля даты
                this.updateButtonClass('FILTER_INTERVAL'); // Обновляем класс кнопки "Интервал" для отображения активного состояния
                this.getOperationsWithInterval(period, dateFrom.value, dateTo.value); // Вызываем метод для получения операций с учетом выбранного интервала
            } else {
                console.log('Подалуйста заполните оба поля дат.');
            }
        };
        // Добавляем обработчики событий для изменения даты "От" и "До" интервала
        dateTo.addEventListener('change', handleIntervalChange);
        dateFrom.addEventListener('change', handleIntervalChange);

        // Добавляем обработчик события клика на кнопку "Интервал" при изменении значений дат
        dateTo.addEventListener('change', handleFilterIntervalClick);
        dateFrom.addEventListener('change', handleFilterIntervalClick);
        // Добавляем обработчик события клика на кнопку "Интервал" при изменении значений дат
        this.buttons.FILTER_INTERVAL.addEventListener('click', handleFilterIntervalClick);
    }

    async getOperationsWithInterval(period, dateFrom, dateTo) {

        try {
            const result = await CustomHttp.request(config.host + `/operations?period=${period}&dateFrom=${dateFrom}&dateTo=${dateTo}`);
            if (result && !result.error) {
                this.operations = result;
                this.clearTableWithOperations();
                this.createTable();
            }
        } catch (error) {
            console.error('Ошибка при получении операций за интервал:', error);
        }
    }


    updateButtonClass(activeButton) {
        // Удаляем класс "active" у всех кнопок
        Object.values(this.buttons).forEach(button => {
            button.classList.remove('active');
        });
        // Добавляем класс "active" только к выбранной кнопке
        this.buttons[activeButton].classList.add('active');
    }

    clearTableWithOperations() {
        const wrapperContent = document.getElementById('content-table');
        wrapperContent.innerHTML = '';  // Очищаем содержимое обертки перед добавлением новой таблицы
    }

    // Метод для установки кнопки "Все" по умолчанию
    setDefaultActiveButton() {
        const activeButton = this.getActiveButton();
        if (!activeButton) {
            this.buttons.FILTER_ALL.classList.add('active');
        }
    }

    getActiveButton() {
        for (const buttonId in this.buttons) {
            if (this.buttons[buttonId].classList.contains('active')) {
                return this.buttons[buttonId]; // Возвращаем активную кнопку
            }
        }
        return null; // Если нет активной кнопки, возвращаем null
    }
}
