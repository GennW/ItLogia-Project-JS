import icons from "../../config/icons.js";
import { UrlManager } from "../utils/url-manager.js";



export class IncomeAndCosts {
    constructor() {
        this.routeParams = UrlManager.getQueryParams();
        this.createTable();
        this.btnCreateRedirectWithId();
    }

    createTable() {
        const wrapperContent = document.getElementById('content-table');
        // Создание таблицы
        const table = document.createElement('table');
        table.classList.add('table', 'text-center', 'fs-6');

        // Создание заголовка таблиц
        const thead = document.createElement('thead');
        const headerRow = document.createElement('tr');
        const headers = ['№ операции', 'Тип', 'Категория', 'Сумма', 'Дата', 'Комментарий', ''];
        headers.forEach(headerText => {
            const th = document.createElement('th');
            th.textContent = headerText;
            th.classList.add('text-primary-emphasis');
            headerRow.appendChild(th);
        });
        thead.appendChild(headerRow);
        table.appendChild(thead);

        // Создание тела таблицы
        const tbody = document.createElement('tbody');

        // Создание строк и ячеек данных
        const rowData = [
            { type: 'доход', category: 'зарплата', amount: '500$', date: '11.09.2022' },
            { type: 'расход', category: 'жильё', amount: '2 500$', date: '12.09.2022' }
        ];

        rowData.forEach(data => {
            const row = document.createElement('tr');

            const cellData = ['1', data.type, data.category, data.amount, data.date, ''];
            
            cellData.forEach(cellText => {
                const td = document.createElement('td');
                td.textContent = cellText;
                row.appendChild(td);
            });

            // Добавление иконок в последний столбец
            const iconCell = document.createElement('td');
            const icoWrapper = document.createElement('div');
            icoWrapper.classList.add('ico-wrapper', 'text-end');

            const link1 = document.createElement('a');
            link1.classList.add('link-offset-2', 'link-', 'link-underline-opacity-0');
            link1.href = 'javascript:void(0)';
            link1.setAttribute('data-bs-toggle', 'modal');
            link1.setAttribute('data-bs-target', '#exampleModal');
            link1.innerHTML = icons.icoDelete;
            icoWrapper.appendChild(link1);

            const link2 = document.createElement('a');
            link2.classList.add('link-offset-2', 'link-underline', 'link-underline-opacity-0');
            link2.href = '#/incomeCostsEdit';
            link2.innerHTML = icons.icoEdit;
            icoWrapper.appendChild(link2);

            iconCell.appendChild(icoWrapper);
            row.appendChild(iconCell);

            tbody.appendChild(row);
        });

        table.appendChild(tbody);

        // Добавление таблицы на страницу
        wrapperContent.appendChild(table);
    }


    btnCreateRedirectWithId() {
        const btnIncome = document.getElementById('create-income-btn');
        const btnCost = document.getElementById('create-cost-btn');
        if (btnIncome) {
            btnIncome.addEventListener('click', function() {
                localStorage.setItem('incomeId', btnIncome.id); // Устанавливаем значение id в локальное хранилище
                location.href = '/#/incomeCostsCreate?idIncome=' + btnIncome.id;
            });
        } 
        if (btnCost) {
            btnCost.addEventListener('click', function() {
                localStorage.setItem('costId', btnCost.id); // Устанавливаем значение id в локальное хранилище
                location.href = '/#/incomeCostsCreate?idCost=' + btnCost.id;
            });
        } 
    }
}
