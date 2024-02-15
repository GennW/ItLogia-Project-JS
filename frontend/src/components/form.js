
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
                    // Требуется ввод как минимум двух слов с большой буквы, разрешается использование дефиса для двойных фамилий
                    regex: /^([А-ЯЁ][а-ё]*([\s-])){1,}[А-ЯЁ][а-я]*$/i,
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
        if (this.page === 'signin') {
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

        // Проверка на существование полей "inputPassword" и "confirm-password"
        const passwordField = this.fields.find(item => item.id === 'inputPassword');
        const confirmPasswordField = this.fields.find(item => item.id === 'confirm-password');

        // Получение значений пароля и подтверждения пароля
        const passwordValue = passwordField ? passwordField.element.value : '';
        const confirmPasswordValue = confirmPasswordField ? confirmPasswordField.element.value : '';

        // rememberMeElement работает не верно
        const isValid = this.rememberMeElement ? this.rememberMeElement.checked && validForm : validForm;
        if (isValid && passwordValue === confirmPasswordValue) {
            this.processElement.removeAttribute('disabled');
        } else {
            this.processElement.setAttribute('disabled', 'disabled');
        }
        return isValid;
    }

    async processForm() {
        if (this.validateForm()) {

            if (this.page === 'signup') {

                try {

                    // Получение значения полного имени из элемента формы
                    const fullName = this.fields.find(item => item.name === 'fullName').element.value;

                    // Разделение полного имени на составляющие (фамилия и имя)
                    const fullNameParts = fullName.split(" ");
                    const lastName = fullNameParts[0];
                    const name = fullNameParts.slice(1).join(" ");

                    // Отправка запроса на сервер для регистрации
                    const response = await fetch('http://localhost:3000/api/signup', {
                        method: "POST",
                        headers: {
                            'Content-type': 'application/json',
                            'Accept': 'application/json',
                        },
                        body: JSON.stringify({
                            name: name, // использование разделенного имени
                            lastName: lastName, // использование разделенной фамилии
                            password: this.fields.find(item => item.password === 'password').element.value,
                            passwordRepeat: this.fields.find(item => item.name === 'confirmPassword').element.value,
                            email: this.fields.find(item => item.email === 'email').element.value,
                        }),
                    });
                    console.log(response)

                    // проверяем статус сервера
                    if (response.status < 200 || response.status >= 300) { // 43 и 48 min Проект Quiz: часть 4
                        throw new Error(response.message);
                    }

                    // Обработка результата запроса
                    const result = await response.json();
                    console.log(result)
                    if (result) {
                        if (!result.user) {
                            throw new Error(result.message);
                        }
                        // Перенаправление на главную страницу в случае успеха
                        location.href = '#/'
                    }

                } catch (error) {
                    console.log(error);
                }

            } else {

            }
        }
    }
}



/*
const fullName = this.fields.find(item => item.name === 'fullName').element.value;
                    // Разбиение строки fullName на фамилию и имя
                    const fullNameParts = fullName.split(" ");
                    const lastName = fullNameParts[0]; // Фамилия (первая часть строки)
                    const name = fullNameParts.slice(1).join(" "); // Имя (все, кроме первой части)

body: JSON.stringify({
                            name: name, // использование разделенного имени
                            lastName: lastName, // использование разделенной фамилии
                            password: this.fields.find(item => item.name === 'confirmPassword').element.value,
                            email: this.fields.find(item => item.name === 'email').element.value,
                        })

                    */