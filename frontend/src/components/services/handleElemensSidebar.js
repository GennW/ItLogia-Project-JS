export class HandleElementsSidebar {
    constructor() {
        // Инициализация предыдущего активного элемента
        this.previousActiveElement = null;
        // Массив объектов для хранения данных о элементах
        this.sidebarElements = [
            { element: document.getElementById('main-sidebar'), isActive: true },
            { element: document.getElementById('income-costs-sidebar'), isActive: false },
            { element: document.getElementById('income-sidebar'), isActive: false },
            { element: document.getElementById('costs-sidebar'), isActive: false }
        ];

        // Добавление обработчика кликов для каждого элемента
        this.sidebarElements.forEach((sidebarItem) => {
            sidebarItem.element.addEventListener('click', this.handleElementClick.bind(this, sidebarItem));
        });
    }

    // Обработчик кликов
    handleElementClick(clickedItem, event) {
        const clickedElement = event.target;

        // Обновление состояния всех элементов и предыдущего активного элемента
        this.sidebarElements.forEach((sidebarItem) => {
            if (sidebarItem !== clickedItem && sidebarItem.isActive) {
                sidebarItem.element.classList.add('link-dark');
                sidebarItem.element.classList.remove('active');
                sidebarItem.isActive = false;
            }
        });

        // Обновление состояния кликнутого элемента
        if (!clickedItem.isActive) {
            clickedItem.element.classList.remove('link-dark');
            clickedItem.element.classList.add('active');
            clickedItem.isActive = true;
            this.previousActiveElement = clickedItem.element;
        }

        // Установка активного состояния для кликнутого элемента
        clickedElement.classList.remove('link-dark');
        clickedElement.classList.add('active');
    }

    // Обработчик клика по логотипу
    handleLogoClick() {
        this.handleElementClick({ element: this.sidebarElements[0].element, isActive: true });
    }

    // Метод для сворачивания боковой панели
    toggleSidebarCollapsed() {
        const currentURL = location.hash;
        const categorySidebar = document.getElementById('category-sidebar');
        if (currentURL !== '#/income' && currentURL !== '#/costs') {
            categorySidebar.classList.add('collapsed');
            categorySidebar.classList.add('active');
            categorySidebar.setAttribute('aria-expanded', 'false');
        }
    }
}

