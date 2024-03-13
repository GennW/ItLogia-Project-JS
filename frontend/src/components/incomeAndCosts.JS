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
        this.getOperations('all'); 
        this.btnCreateRedirectWithId();
        
        // console.log(this.buttons.FILTER_ALL)
        this.bntFilterOperations()
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

        this.operations.forEach((data, index) => { // Перебор операций для создания строк таблицы
            //массив данных для каждой строки в таблице операций, где каждый элемент массива представляет определенный столбец в таблице
            const cellData = [
                index + 1,
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
    //////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////
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

    // обновления таблицы после удаления операции дохода или расхода
    // updateTable() {
    //     const wrapperContent = document.getElementById('content-table');
    //     wrapperContent.innerHTML = ''; // Очищаем содержимое обертки перед обновлением
    //     this.createTable(); // Заново создаем таблицу с обновленными операциями
    // }

    // bntFilterOperations() {

    //     // Назначение обработчиков для кнопок
    //     this.buttons.FILTER_ALL.addEventListener('click', () => {
    //         this.updateButtonClass('FILTER_ALL');
    //         this.clearTableWithOperations(); // Очищаем пердыдущий запрос
    //         this.getOperations('all'); 
    //     });

    //     this.buttons.FILTER_DAY.addEventListener('click', () => {
    //         this.updateButtonClass('FILTER_DAY');
    //         this.clearTableWithOperations(); // Очищаем пердыдущий запрос
    //         this.getOperations('day');
    //     });

    //     this.buttons.FILTER_WEEK.addEventListener('click', () => {
    //         this.updateButtonClass('FILTER_WEEK');
    //         this.clearTableWithOperations(); // Очищаем пердыдущий запрос
    //         this.getOperations('week');
    //     });

    //     this.buttons.FILTER_MONTH.addEventListener('click', () => {
    //         this.updateButtonClass('FILTER_MONTH');
    //         this.clearTableWithOperations(); // Очищаем пердыдущий запрос
    //         this.getOperations('month');
    //     });

    //     this.buttons.FILTER_YEAR.addEventListener('click', () => {
    //         this.updateButtonClass('FILTER_YEAR');
    //         this.clearTableWithOperations(); // Очищаем пердыдущий запрос
    //         this.getOperations('year');
    //     });
    // }
    bntFilterOperations() {
        // объект для хранения соответствия между идентификаторами кнопок и периодами
        const periodHandlers = {
            'FILTER_ALL': 'all',
            'FILTER_DAY': 'day',
            'FILTER_WEEK': 'week',
            'FILTER_MONTH': 'month',
            'FILTER_YEAR': 'year'
        };
    
        // обработчики событий клика кнопкам в соответствии с периодами
        for (const buttonId in periodHandlers) {
            //  обработчик события клика для каждой кнопки
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
}
