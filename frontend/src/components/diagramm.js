import config from "../../config/config.js";
import { UrlManager } from "../utils/url-manager.js";
import { CustomHttp } from "./services/custom-http.js";

CustomHttp

export class Diagram {
    // Конструктор класса, принимает идентификатор  и текст заголовка
    constructor(canvasId, titleText) {

        // Получаем контекст рисования 
        this.canvas = document.getElementById(canvasId).getContext('2d');
        this.titleText = titleText; // Устанавливаем текст заголовка

       
    }




    // async init() {
    //     try {

    //         const result = await CustomHttp.request(config.host + '');

    //         if (result) {
    //             if (!result.user) {
    //                 throw new Error(result.message);
    //             }
    //             // что то делаем 57 минута Проект Quiz: часть 4

    //         }

    //     } catch (error) {
    //         console.log(error);
    //     }
    // }

    // Статический метод для создания данных для первой диаграммы
    static createDataCanvas1() {
        return {
            labels: ['Red', 'Orange', 'Yellow', 'Green', 'Blue'], // Метки секторов диаграммы
            datasets: [{
                data: [30, 40, 20, 15, 10], // Данные для каждого сектора
                backgroundColor: ['#DC3545', '#FD7E14', '#FFC107', '#20C997', '#0D6EFD'], // Цвета секторов
                hoverBackgroundColor: ['#DC3545', '#FD7E14', '#FFC107', '#20C997', '#0D6EFD'] // Цвета при наведении
            }]
        };
    }

    // Статический метод для создания данных для второй диаграммы
    static createDataCanvas2() {
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

    // Метод для создания диаграммы с данными из createDataCanvas1
    createChartWithCanvas1() {
        const dataCanvas1 = Diagram.createDataCanvas1(); // Создание данных для первой диаграммы
        return this.createChart(dataCanvas1); // Создание и отображение диаграммы
    }

    // Метод для создания диаграммы с данными из createDataCanvas2
    createChartWithCanvas2() {
        const dataCanvas2 = Diagram.createDataCanvas2(); // Создание данных для второй диаграммы
        return this.createChart(dataCanvas2); // Создание и отображение диаграммы
    }
}
