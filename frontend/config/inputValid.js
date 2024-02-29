/*
Класс InputValidation обеспечивает валидацию содержимого поля ввода, 
препятствуя превышению длины введенных символов, а также форматирует 
введенные данные в соответствии с заданными правилами.*/

export class InputValidation {
    constructor(inputId) {
        // Проверяем наличие идентификатора перед созданием объекта InputValidation
        if (!inputId) {
            console.error('Отсутствует идентификатор элемента ввода.');
            return;
        }
        // Получаем ссылку на элемент ввода по его идентификатору
        this.inputElement = document.getElementById(inputId);
        if (!this.inputElement) {
            console.error('Элемент ввода с указанным идентификатором не найден.');
            return;
        }
        // Добавляем слушатель события 'input' для обработки ввода
        this.addInputEventListener();
    }

    // Функция для показа всплывающей подсказки о превышении длины
    showLengthExceedPopover() {
        const popover = new bootstrap.Popover(this.inputElement, {
            trigger: 'manual',
            content: 'Длина должна быть не более 15 символов',
        });
        // Показываем всплывающую подсказку
        popover.show();
        // Скрываем всплывающую подсказку через 2 секунды
        setTimeout(() => {
            popover.hide();
        }, 2000);
    }

    // Функция для обработки ввода
    handleInput() {
        // Получаем значение из поля ввода
        let inputValue = this.inputElement.value;
        // Проверяем, если значение превышает 17 символов
        if (inputValue.length > 15) {
            // Если количество символов больше 17, обрезаем строку
            inputValue = inputValue.slice(0, 15);
            // Вызываем функцию для показа подсказки
            this.showLengthExceedPopover();
        }
        // Приводим первую букву в заглавный регистр и все остальные буквы в строчный регистр
        inputValue = inputValue.charAt(0).toUpperCase() + inputValue.slice(1).toLowerCase();
        // Присваиваем полученное значение обратно в поле ввода
        this.inputElement.value = inputValue;
    }

    // Добавляем слушатель события 'input' для поля ввода
    addInputEventListener() {
        // Привязываем метод handleInput к контексту класса, чтобы использовать this внутри метода
        this.inputElement.addEventListener('input', this.handleInput.bind(this));
    }
}
