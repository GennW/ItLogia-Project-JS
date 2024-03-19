import config from "../../config/config.js";
import { UrlManager } from "../utils/url-manager.js";
import { CustomHttp } from "./services/custom-http.js";



export class Diagram {
    // Конструктор класса, принимает идентификатор  и текст заголовка
    constructor(canvasId, titleText) {
        this.operations = [];
        // Получаем контекст рисования 
        this.canvas = document.getElementById(canvasId).getContext('2d');
        this.titleText = titleText; // Устанавливаем текст заголовка    
        this.getOperations('all');


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

    static createDataCanvasIncome(operations) {

        // Фильтруем операции по типу "income"
        const incomeOperations = operations.filter(operation => operation.type === "income");

        // Если нет операций типа "income", вернуть пустой объект
        if (incomeOperations.length === 0) {
            document.getElementById('no-income').innerText = 'Нет операций по доходам'
            console.log('Нет операций по доходам');
            return {};
        }


        // Извлекаем данные для меток и значения из операций
        const allOperations = incomeOperations.map(operation => operation.category);
        console.log('allOperations', allOperations)

        // Получаем уникальные категории
        const categories = [...new Set(incomeOperations.map(operation => operation.category))];

        // Вычисляем суммы для каждой уникальной категории
        const sumsByCategory = categories.map(category => incomeOperations.reduce((sum, operation) => {
            return operation.category === category ? sum + operation.amount : sum;
        }, 0));

        return {
            labels: categories, // Метки секторов диаграммы
            datasets: [{
                data: sumsByCategory,  // Суммы для каждой категории
                backgroundColor: ['#DC3545', '#FD7E14', '#FFC107', '#20C997', '#0D6EFD'], // Цвета секторов
                hoverBackgroundColor: ['#DC3545', '#FD7E14', '#FFC107', '#20C997', '#0D6EFD'] // Цвета при наведении
            }]
        };
    }

    // Статический метод для создания данных для второй диаграммы
    static createDataCanvasCosts() {
        return {
            labels: ['Red', 'Orange', 'Yellow', 'Green', 'Blue'], // Метки секторов диаграммы
            datasets: [{
                data: [5, 20, 40, 40, 30], // Данные для каждого сектора
                backgroundColor: ['#DC3545', '#FD7E14', '#FFC107', '#20C997', '#0D6EFD'], // Цвета секторов
                hoverBackgroundColor: ['#DC3545', '#FD7E14', '#FFC107', '#20C997', '#0D6EFD'] // Цвета при наведении
            }]
        };
    }

    // Метод для создания диаграммы с переданными данными
    createChart(data) {
        return new Chart(this.canvas, {
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
                        text: this.titleText, // Сам текст заголовка
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
    }

    // Метод для создания диаграммы с данными из createDataCanvasIncome
    async createChartWithCanvasIncome() {
        return this.getOperations('all').then(() => {
            const dataCanvasIncome = Diagram.createDataCanvasIncome(this.operations); // Создание данных для первой диаграммы
            return this.createChart(dataCanvasIncome); // Создание и отображение диаграммы
        });
    }


    // Метод для создания диаграммы с данными из createDataCanvasCosts
    createChartWithCanvasCosts() {
        const dataCanvasCosts = Diagram.createDataCanvasCosts(); // Создание данных для второй диаграммы
        return this.createChart(dataCanvasCosts); // Создание и отображение диаграммы
    }
}
