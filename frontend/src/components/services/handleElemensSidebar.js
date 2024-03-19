export class HandleElementsSidebar {
    constructor() {
        this.previousElement = null;
        this.children = null;

        this.incomeCostsSidebar = document.getElementById('income-costs-sidebar');
        this.mainSidebar = document.getElementById('main-sidebar');
        this.costsSidebar = document.getElementById('costs-sidebar');

        const fillElementsInMainSidebar = this.mainSidebar.querySelectorAll('[fill="#052C65"]');
        if (this.mainSidebar && fillElementsInMainSidebar.length > 0) {
            fillElementsInMainSidebar.forEach(element => {
                this.mainSidebar.addEventListener('click', () => {
                    element.setAttribute('fill', 'white');
                });
            });
        }

        const fillElementsInIncomeCostsSidebar = this.incomeCostsSidebar.querySelectorAll('[fill="#052C65"]');
        if (this.incomeCostsSidebar && fillElementsInIncomeCostsSidebar.length > 0) {
            fillElementsInIncomeCostsSidebar.forEach(element => {
                this.incomeCostsSidebar.addEventListener('click', () => {
                    element.setAttribute('fill', 'white');
                });
            });
        }

        const incomeSidebar = document.getElementById('income-sidebar')
        const logoElement = document.getElementById('logo');

        logoElement.addEventListener('click', this.handleLogoClick.bind(this));
        this.mainSidebar.addEventListener('click', this.handleButtonClicks.bind(this));
        this.costsSidebar.addEventListener('click', this.handleButtonClicks.bind(this));
        this.incomeCostsSidebar.addEventListener('click', this.handleButtonClicks.bind(this));
        incomeSidebar.addEventListener('click', this.handleButtonClicks.bind(this));
    }
    handleLogoClick() {
        // Вызвать ту же логику, что и в методе handleButtonClicks для mainSidebar
        this.handleButtonClicks({ target: this.mainSidebar });
        const fillElementsInMainSidebar = this.mainSidebar.querySelectorAll('[fill="#052C65"]');
        fillElementsInMainSidebar.forEach(element => {
            element.setAttribute('fill', 'white');
        });


    }
    handleButtonClicks(event) {
        const clickedElement = event.target;

        if (this.previousElement && this.previousElement !== clickedElement) {
            const paths = this.previousElement.querySelectorAll('path');

            paths.forEach(path => {
                path.setAttribute('fill', '#052C65');
            });

            this.previousElement.classList.add('link-dark');
            this.previousElement.classList.remove('active');
        }

        // clickedElement.setAttribute('fill', 'white');
        clickedElement.classList.remove('link-dark');
        clickedElement.classList.add('active');

        this.previousElement = clickedElement;
    }

    togleCollapsed() {
        const currentURL = location.hash;
        const categorySidebar = document.getElementById('category-sidebar');
        if (currentURL !== '#/income' && currentURL !== '#/costs') {
            categorySidebar.classList.add('collapsed');
            categorySidebar.classList.add('active');
            categorySidebar.setAttribute('aria-expanded', 'false');
        }
    }
}
