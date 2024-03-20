﻿import config from "../../config/config.js";
import { UrlManager } from "../utils/url-manager.js";
import { CustomHttp } from "./services/custom-http.js";



export class Diagram {
    // Конструктор класса, принимает идентификатор  и текст заголовка
    constructor(canvasId, titleText) {
        this.operations = [];
        // Получаем контекст рисования 
        this.canvas = document.getElementById(canvasId).getContext('2d');
        this.titleText = titleText; // Устанавливаем текст заголовка    
        // this.getOperations('all');


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
        console.log('alloperations-in-Income',operations)

        // Фильтруем операции по типу "income"
        const incomeOperations = operations.filter(operation => operation.type === "income" && operation.category);
        console.log('operations.category',operations.category)

        // Если нет операций типа "income", вернуть пустой объект
        if (incomeOperations.length === 0) {
            document.getElementById('no-income').innerText = 'Нет операций по доходам'
            console.log('Нет операций по доходам');
            return {};
        }


        // Извлекаем данные для меток и значения из операций
        const categoryOperations = incomeOperations.map(operation => operation.category); // проверка на категорию в случае если она удалена то не будет выведена
        console.log('categoryOperations', categoryOperations)

        // Получаем уникальные категории
        const categories = [...new Set(incomeOperations.map(operation => operation.category))].filter(Boolean); // Исключаем undefined если удалена категория со всеми операциями;
        console.log('unik-categories-incomeOperations', categories)

        // Вычисляем суммы для каждой уникальной категории
        const sumsByCategory = categories.map(category => incomeOperations.reduce((sum, operation) => {
            return operation.category === category ? sum + operation.amount : sum;
        }, 0));

        return {
            labels: categories, // Метки секторов диаграммы
            datasets: [{
                data: sumsByCategory,  // Суммы для каждой категории
                backgroundColor: ['#FFC107', '#20C997','#FD7E14',  '#DC3545', '#0D6EFD'], // Цвета секторов
                hoverBackgroundColor: ['#FFC107', '#20C997', '#FD7E14', '#DC3545', '#0D6EFD'] // Цвета при наведении
                
            }]
        };
    }

    // Статический метод для создания данных для второй диаграммы
    static createDataCanvasCosts(operations) {
        console.log('alloperations-in-Costs',operations)
        // Фильтруем операции по типу "expense"
        const costsOperationsWithCategory = operations.filter(operation => operation.type === "expense" && operation.category);

        console.log('costsOperationsWithCategory',costsOperationsWithCategory)

        // Если нет операций типа "expense", вернуть пустой объект
        if (costsOperationsWithCategory.length === 0) {
            document.getElementById('no-costs').innerText = 'Нет операций по расходам'
            console.log('Нет операций по расходам');
            return {};
        }


        // Получаем уникальные категории
        const categories = [...new Set(costsOperationsWithCategory.map(operation => operation.category))].filter(Boolean); // Исключаем undefined;
        console.log(categories)
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
                        text: this.titleText, // текст заголовка
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
    async createChartWithCanvasCosts() {
        return this.getOperations('all').then(() => {
            const dataCanvasCosts = Diagram.createDataCanvasCosts(this.operations); // Создание данных для второй диаграммы
            return this.createChart(dataCanvasCosts); // Создание и отображение диаграммы
        });
    }
}
