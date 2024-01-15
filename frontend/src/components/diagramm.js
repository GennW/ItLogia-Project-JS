export class Diagram {
    constructor(canvasId, data, titleText) {
        this.canvas = document.getElementById(canvasId).getContext('2d');
        this.data = data;
        this.titleText = titleText;
    }

    createChart() {
        return new Chart(this.canvas, {
            type: 'pie',
            data: this.data,
            options: {
                aspectRatio: 1,
                cutout: 0,
                layout: {
                    padding: { top: 0 }
                },
                plugins: {
                    title: {
                        display: true,
                        padding: 10,
                        text: this.titleText,
                        font: { family: 'Roboto', size: 28 }
                    },
                    legend: {
                        position: 'top',
                        align: 'center',
                        labels: {
                            padding: 15,
                            boxWidth: 35,
                            boxHeight: 10,
                            font: { family: 'Roboto', size: 12 }
                        }
                    }
                }
            }
        });
    }
}

document.addEventListener('DOMContentLoaded', function () {
    if (window.location.pathname === '/index.html') {
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

        const diagrammIncome = new Diagram('myPieChart1', dataCanvas1, 'Доходы').createChart();
        const diagrammExpenses = new Diagram('myPieChart2', dataCanvas2, 'Расходы').createChart();
    }
});
