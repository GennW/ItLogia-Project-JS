import config from "../../config/config.js";
import { CustomHttp } from "./services/custom-http.js";


export class FilterDate {
    constructor() {
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
        // чтобы в массив попали  данные операции перед вызовом getCommonBalance()
        this.getOperations('all')
            .then(() => {
                this.setDefaultActiveButton();
                this.bntFilterOperations();
                this.handleIntervalFilter();
            })
            .catch(error => {
                console.error('Ошибка при загрузке операций:', error);
            });
    }

    async getOperations(period) {
        try {
            const result = await CustomHttp.request(config.host + `/operations?period=${period}`);
            if (result && !result.error) {
                this.operations = result;

            }
        } catch (error) {
            console.error('Ошибка:', error);
        }
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
                // this.clearTableWithOperations();
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
                console.log('Пожалуйста заполните оба поля дат.');
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
                // this.clearTableWithOperations();
                // this.createTable();
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