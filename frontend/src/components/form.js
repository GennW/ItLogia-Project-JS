
export class Form {

    constructor(page) {

        this.rememberMeElement = null;
        this.processElement = null;
        this.page = page;

        this.fields = [
            {
                email: 'email',
                id: 'email',
                element: null,
                regex: /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/,
                valid: false,
            },
            {
                password: 'password',
                id: 'inputPassword',
                element: null,
                regex: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,}$/,
                valid: false,
            },
        ];

       if (this.page === 'signup') {
    this.fields.unshift(
        {
            name: 'fullName',
            id: 'full-name',
            element: null,
            //только кириллические символы в имени, фамилии и отчестве, а также допускает использование дефисов для двойных фамилий.
            regex: /^[\u0410-\u044F]+([\s-][\u0410-\u044F]+)*$/i,
            valid: false,
        }
    );
    this.fields.push(
        {
            name: 'confirmPassword',
            id: 'confirm-password',
            element: null,
            regex: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,}$/,
            valid: false,
        }
    );
}


        const that = this;
        this.fields.forEach(item => {

            item.element = document.getElementById(item.id);

            if (item.element) {
                item.element.onchange = function () {
                    that.validateField.call(that, item, this);
                };
            }

        });


        this.processElement = document.getElementById('process');
        this.processElement.onclick = function () {
            that.processForm();
        }
        if (this.page === 'signup') {
            this.rememberMeElement = document.getElementById('flexCheckDefault');
            this.rememberMeElement.onchange = function () {
                that.validateForm();
            }
        }

    }


    validateField(field, element) {
        if (element) {
            const parent = element.closest('.input-group');
            const errorMessageId = 'error-message-' + field.id; // Генерируем уникальный ID для сообщения об ошибке
            let errorMessage = document.getElementById(errorMessageId); // Проверяем существование элемента сообщения об ошибке
            if (!errorMessage) {
                errorMessage = document.createElement('span'); // Создаем элемент для сообщения об ошибке, если его нет
                errorMessage.id = errorMessageId; // Устанавливаем уникальный ID
                parent.parentNode.insertBefore(errorMessage, parent.nextSibling); // Вставляем сообщение после родительского блока
            }
            if (!element.value || !element.value.match(field.regex)) {
                parent.style.border = '2px solid red'; // Устанавливаем стиль рамки
                errorMessage.textContent = 'Некорректное значение'; // Выводим сообщение об ошибке
                errorMessage.style.color = 'red'; // Выводим сообщение об ошибке
                field.valid = false;
            } else {
                parent.removeAttribute('style'); // Удаляем стиль рамки
                errorMessage.textContent = ''; // Очищаем сообщение об ошибке, если значение корректное
                field.valid = true;
            }
            this.validateForm();
        }

    }

    validateForm() {
        const validForm = this.fields.every(item => item.valid);
        
        // rememberMeElement работает не верно
        const isValid = this.rememberMeElement ? this.rememberMeElement.checked && validForm : validForm;
        if (isValid) {
            this.processElement.removeAttribute('disabled')
        } else {
            this.processElement.setAttribute('disabled', 'disabled')
        }
        return isValid;
    }

    processForm() {
        if (this.validateForm()) {
            location.href = '#/'
        }
    }


}
