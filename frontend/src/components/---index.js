﻿document.addEventListener('DOMContentLoaded', function () {


    // диаграммы
    let canvas1 = document.getElementById('myPieChart1').getContext('2d');
    let canvas2 = document.getElementById('myPieChart2').getContext('2d');
    // Создаем данные для диаграммы (значения и метки)
    const dataCanvas1 = {
        labels: ['Red', 'Orange', 'Yellow', 'Green', 'Blue'],
        datasets: [{
            data: [30, 40, 20, 15, 10],
            backgroundColor: ['#DC3545', '#FD7E14', '#FFC107', '#20C997', '#0D6EFD'],
            hoverBackgroundColor: ['#DC3545', '#FD7E14', '#FFC107', '#20C997', '#0D6EFD']
        }]

    };
    const dataCanvas2 = {
        labels: ['Red', 'Orange', 'Yellow', 'Green', 'Blue'],
        datasets: [{
            data: [5, 20, 40, 40, 30],
            backgroundColor: ['#DC3545', '#FD7E14', '#FFC107', '#20C997', '#0D6EFD'],
            hoverBackgroundColor: ['#DC3545', '#FD7E14', '#FFC107', '#20C997', '#0D6EFD']
        }]

    };

    // Создаем объект, определяющий отступ для легенды
    const legendMargin = {
        id: 'legendMargin',
        beforeInit(chart) {
            // Сохраняем текущее значение параметра fit legend
            const fitValue = chart.legend.fit;

            // Переопределяем функцию fit в объекте legend
            chart.legend.fit = function fit() {
                // Вызываем оригинальную функцию fit
                fitValue.bind(chart.legend)();
                // Увеличиваем высоту легенды на 40 единиц
                return this.height += 42;
            }
        }
    };
    Chart.register(legendMargin);

    // Создаем круговую диаграмму
    if (canvas1 || canvas2) {
        const diagrammIncome = new Chart(canvas1, {
            type: 'pie',
            data: dataCanvas1,
            options: {
                aspectRatio: 1, // Определяем соотношение сторон
                cutout: 0, // Устанавливаем вырез
                layout: {
                    padding: {
                        top: 0 // Устанавливаем отступ сверху
                    }
                },
                plugins: {
                    legendMargin, // Добавляем объект с отступом для легенды
                    title: {
                        display: true, // Включаем отображение заголовка
                        padding: 10, // Устанавливаем отступ заголовка
                        text: 'Доходы', // Устанавливаем текст заголовка
                        font: {
                            family: 'Roboto', // Устанавливаем шрифт заголовка
                            size: 28 // Устанавливаем размер шрифта заголовка
                        },
                    },
                    legend: {
                        position: 'top', // Устанавливаем позицию легенды
                        align: 'center', // Устанавливаем выравнивание легенды
                        labels: {
                            padding: 15, // Устанавливаем отступ меток в легенде
                            boxWidth: 35, // Устанавливаем ширину маркеров в легенде
                            boxHeight: 10, // Устанавливаем высоту маркеров в легенде
                            font: {
                                family: 'Roboto', // Устанавливаем шрифт меток в легенде
                                size: 12 // Устанавливаем размер шрифта меток в легенде
                            },
                        },
                        // rotation: 170, // Указывает угол поворота в радианах, по умолчанию 0
                    }
                },
            },
            // plugins: [legendMargin], // Добавляем плагин с отступом для легенды
        });
        const diagrammExpenses = new Chart(canvas2, {
            type: 'pie',
            data: dataCanvas2,
            options: {
                aspectRatio: 1, // Определяем соотношение сторон
                cutout: 0, // Устанавливаем вырез
                layout: {
                    padding: {
                        top: 0 // Устанавливаем отступ сверху
                    }
                },
                plugins: {
                    legendMargin, // Добавляем объект с отступом для легенды
                    title: {
                        display: true, // Включаем отображение заголовка
                        padding: 10, // Устанавливаем отступ заголовка
                        text: 'Расходы', // Устанавливаем текст заголовка
                        font: {
                            family: 'Roboto', // Устанавливаем шрифт заголовка
                            size: 28 // Устанавливаем размер шрифта заголовка
                        },
                    },
                    legend: {
                        position: 'top', // Устанавливаем позицию легенды
                        align: 'center', // Устанавливаем выравнивание легенды
                        labels: {
                            padding: 15, // Устанавливаем отступ меток в легенде
                            boxWidth: 35, // Устанавливаем ширину маркеров в легенде
                            boxHeight: 10, // Устанавливаем высоту маркеров в легенде
                            font: {
                                family: 'Roboto', // Устанавливаем шрифт меток в легенде
                                size: 12 // Устанавливаем размер шрифта меток в легенде
                            },
                        },
                        // rotation: 170, // Указывает угол поворота в радианах, по умолчанию 0
                    }
                },
            },
            // plugins: [legendMargin], // Добавляем плагин с отступом для легенды
        });
    }

});

