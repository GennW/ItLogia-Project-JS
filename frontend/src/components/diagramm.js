import { FilterDate } from "./filterDate.js";



export class Diagram extends FilterDate {

    // Конструктор класса, принимает идентификатор  и текст заголовка
    constructor() {
        super();
        this.operations = [];
        // Получаем контекст рисования 
        this.canvasIncome = document.getElementById('myPieChartIncome').getContext('2d');
        this.canvasCosts = document.getElementById('myPieChartCosts').getContext('2d');
    }



    async getOperationsWithInterval(period, dateFrom, dateTo) {
        await super.getOperationsWithInterval(period, dateFrom, dateTo);
        this.removeExistingCharts(); // Удалить существующие диаграммы
        if (this.chartIncome) {
            this.chartIncome.destroy();
            // await this.updateChartsByPeriod();
            await this.createChartWithCanvasIncome();
        }
        if (this.chartCosts) {
            this.chartCosts.destroy();
            // await this.updateChartsByPeriod();
            await this.createChartWithCanvasCosts();
        }
        
        
    }

    async getOperations(period) {
        await super.getOperations(period);
        this.createChartWithCanvasCosts();
        this.createChartWithCanvasIncome();
    }


    static createDataCanvasIncome(operations) {

        // Фильтруем операции по типу "income"
        const incomeOperations = operations.filter(operation => operation.type === "income" && operation.category);
        // console.log('operations.category',operations.category)

        // Если нет операций типа "income", вернуть пустой объект
        if (incomeOperations.length === 0) {
            
            document.getElementById('no-income').innerText = 'Нет операций по доходам'
            console.log('Нет операций по доходам');
            return {};
        } else {
            document.getElementById('no-income').innerText = ''
        }


        // Извлекаем данные для меток и значения из операций
        const categoryOperations = incomeOperations.map(operation => operation.category); // проверка на категорию в случае если она удалена то не будет выведена
        // console.log('categoryOperations', categoryOperations)

        // Получаем уникальные категории
        const categories = [...new Set(incomeOperations.map(operation => operation.category))].filter(Boolean); // Исключаем undefined если удалена категория со всеми операциями;
        // console.log('unik-categories-incomeOperations', categories)

        // Вычисляем суммы для каждой уникальной категории
        const sumsByCategory = categories.map(category => incomeOperations.reduce((sum, operation) => {
            return operation.category === category ? sum + operation.amount : sum;
        }, 0));

        return {
            labels: categories, // Метки секторов диаграммы
            datasets: [{
                data: sumsByCategory,  // Суммы для каждой категории
                backgroundColor: ['#FFC107', '#20C997', '#FD7E14', '#DC3545', '#0D6EFD'], // Цвета секторов
                hoverBackgroundColor: ['#FFC107', '#20C997', '#FD7E14', '#DC3545', '#0D6EFD'] // Цвета при наведении

            }]
        };
    }

    // Статический метод для создания данных для второй диаграммы
    static createDataCanvasCosts(operations) {

        // Фильтруем операции по типу "expense"
        const costsOperationsWithCategory = operations.filter(operation => operation.type === "expense" && operation.category);


        // Если нет операций типа "expense", вернуть пустой объект
        if (costsOperationsWithCategory.length === 0) {
            document.getElementById('no-costs').innerText = 'Нет операций по расходам'
            console.log('Нет операций по расходам');
            return {};
        } else {
            document.getElementById('no-costs').innerText = ''
        }


        // Получаем уникальные категории
        const categories = [...new Set(costsOperationsWithCategory.map(operation => operation.category))].filter(Boolean); // Исключаем undefined;
        // console.log(categories)
        // Вычисляем суммы для каждой уникальной категории
        const sumsByCategory = categories.map(category => costsOperationsWithCategory.reduce((sum, operation) => {
            return operation.category === category ? sum + operation.amount : sum;
        }, 0));

        return {
            labels: categories, // Метки секторов диаграммы
            datasets: [{
                data: sumsByCategory, // Данные для каждого сектора
                backgroundColor: ['#DC3545', '#FD7E14', '#FFC107', '#20C997', '#0D6EFD'], // Цвета секторов
                hoverBackgroundColor: ['#DC3545', '#FD7E14', '#FFC107', '#20C997', '#0D6EFD'] // Цвета при наведении
            }]
        };
    }

    // Метод для создания диаграммы с переданными данными
    createChartIncome(data) {
        if (this.chartIncome) {
            this.chartIncome.destroy();
        }
        this.chartIncome = new Chart(this.canvasIncome, {
            type: 'pie', // Тип диаграммы - круговая
            data: data, // Используемые данные
            options: {
                aspectRatio: 1, // Соотношение сторон
                cutout: 0, // Размер отсечения по центру
                layout: {
                    padding: { top: 0 } // Отступ сверху
                },
                plugins: {
                    title: {
                        display: true, // Показывать заголовок
                        padding: 10, // Отступ заголовка
                        text: 'Доходы', // текст заголовка
                        font: { family: 'Roboto', size: 28 } // Шрифт заголовка
                    },
                    legend: {
                        position: 'top', // Положение легенды
                        align: 'center', // Выравнивание легенды
                        labels: {
                            padding: 15, // Отступ меток
                            boxWidth: 35, // Ширина маркера
                            boxHeight: 10, // Высота маркера
                            font: { family: 'Roboto', size: 12 } // Шрифт меток
                        }
                    }
                }
            }
        });
        return this.chartIncome;
    }

    createChartCosts(data) {
        if (this.chartCosts) {
            this.chartCosts.destroy();
        }
        this.chartCosts = new Chart(this.canvasCosts, {
            type: 'pie', // Тип диаграммы - круговая
            data: data, // Используемые данные
            options: {
                aspectRatio: 1, // Соотношение сторон
                cutout: 0, // Размер отсечения по центру
                layout: {
                    padding: { top: 0 } // Отступ сверху
                },
                plugins: {
                    title: {
                        display: true, // Показывать заголовок
                        padding: 10, // Отступ заголовка
                        text: 'Расходы', // текст заголовка
                        font: { family: 'Roboto', size: 28 } // Шрифт заголовка
                    },
                    legend: {
                        position: 'top', // Положение легенды
                        align: 'center', // Выравнивание легенды
                        labels: {
                            padding: 15, // Отступ меток
                            boxWidth: 35, // Ширина маркера
                            boxHeight: 10, // Высота маркера
                            font: { family: 'Roboto', size: 12 } // Шрифт меток
                        }
                    }
                }
            }
        });
        return this.chartCosts;
    }

    // Метод для создания диаграммы с данными из createDataCanvasIncome
    async createChartWithCanvasIncome() {

            if (this.chartIncome) {
                this.chartIncome.destroy();  // Уничтожение существующей диаграммы расходов, если она существует
            }

            const dataCanvasIncome = Diagram.createDataCanvasIncome(this.operations); // Создание данных для первой диаграммы
            return this.createChartIncome(dataCanvasIncome); // Создание и отображение диаграммы
       
    }


    // Метод для создания диаграммы с данными из createDataCanvasCosts
    async createChartWithCanvasCosts() {
      
            if (this.chartCosts) {
                this.chartCosts.destroy();  // Уничтожение существующей диаграммы расходов, если она существует
            }
            const dataCanvasCosts = Diagram.createDataCanvasCosts(this.operations); // Создание данных для второй диаграммы
            return this.createChartCosts(dataCanvasCosts); // Создание и отображение диаграммы
       
    }

    async updateChartsByPeriod(period) {
        try {
            await this.getOperations(period); // Дождитесь получения операций для выбранного периода

            this.removeExistingCharts(); // Удалит существующие диаграммы


            const dataCanvasIncome = Diagram.createDataCanvasIncome(this.operations);
            const dataCanvasCosts = Diagram.createDataCanvasCosts(this.operations);

            this.createChartCosts(dataCanvasCosts);
            this.createChartIncome(dataCanvasIncome);


        } catch (error) {
            console.error('Ошибка при обновлении диаграмм:', error);
        }
    }

    removeExistingCharts() {
        if (this.chartIncome) {
            this.chartIncome.destroy(); // Удалит диаграмму доходов, если она существует
        }
        if (this.chartCosts) {
            this.chartCosts.destroy(); // Удалит диаграмму расходов, если она существует
        }
    }
}
