import config from "../../config/config.js";
import { Auth } from "./services/auth.js";
import { CustomHttp } from "./services/custom-http.js";

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
                // regex: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,}$/,
                regex: /^(?=.*\d)(?=.*[A-Z]).{10,}$/,
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
                    regex: /^(?=.*\d)(?=.*[A-Z]).{10,}$/,
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

    // validateForm() {
    //     const validForm = this.fields.every(item => item.valid);

    //     // Проверка на существование полей "inputPassword" и "confirm-password"
    //     const passwordField = this.fields.find(item => item.id === 'inputPassword');
    //     const confirmPasswordField = this.fields.find(item => item.id === 'confirm-password');

    //     // Получение значений пароля и подтверждения пароля
    //     const passwordValue = passwordField ? passwordField.element.value : '';
    //     const confirmPasswordValue = confirmPasswordField ? confirmPasswordField.element.value : '';

    //     // rememberMeElement работает не верно
    //     const isValid = this.rememberMeElement ? this.rememberMeElement.checked && validForm : validForm;
    //     if (isValid && passwordValue === confirmPasswordValue) {
    //         this.processElement.removeAttribute('disabled');
    //     } else {
    //         this.processElement.setAttribute('disabled', 'disabled');
    //     }
    //     return isValid;
    // }

    validateForm() {
        // Проверка всех полей на валидность
        const validForm = this.fields.every(item => item.valid);

        // Поиск поля "inputPassword"
        const passwordField = this.fields.find(item => item.id === 'inputPassword');
        // Поиск поля "confirm-password"
        const confirmPasswordField = this.fields.find(item => item.id === 'confirm-password');

        // Получение значений пароля и подтверждения пароля
        const passwordValue = passwordField ? passwordField.element.value : '';
        const confirmPasswordValue = confirmPasswordField ? confirmPasswordField.element.value : '';

        // Проверка rememberMeElement, если он существует
        const isRemembered = !this.rememberMeElement || this.rememberMeElement.checked;

        // Проверка валидности формы, совпадения паролей и rememberMeElement
        const isValid = validForm && (!confirmPasswordField || passwordValue === confirmPasswordValue);

        // Если все условия верны, активировать кнопку
        if (isValid) {
            this.processElement.removeAttribute('disabled');
        } else {
            this.processElement.setAttribute('disabled', 'disabled');
        }

        return isValid; // Возвращаем результат валидации формы
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

                    const result = await CustomHttp.request(config.host + '/signup', 'POST', {
                        name: name, // использование разделенного имени
                        lastName: lastName, // использование разделенной фамилии
                        password: this.fields.find(item => item.password === 'password').element.value,
                        passwordRepeat: this.fields.find(item => item.name === 'confirmPassword').element.value,
                        email: this.fields.find(item => item.email === 'email').element.value,
                    });

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

                if (this.page === 'signin') {

                    try {

                        // Отправка запроса на сервер для регистрации
                        const result = await CustomHttp.request(config.host + '/login', 'POST', {
                            password: this.fields.find(item => item.password === 'password').element.value,
                            rememberMe: this.rememberMeElement.checked, // Получение состояния rememberMeElement
                            email: this.fields.find(item => item.email === 'email').element.value,
                        });

                        if (result) {
                            // console.log('result =', result.tokens.accessToken)
                            // Проверка наличия токенов и пользователя
                            if (!result.user || !result.tokens || !result.tokens.accessToken || !result.tokens.refreshToken) {
                                throw new Error("Токены не были получены");
                            }

                            //сохраняем токены через класс Auth 1:02 Проект Quiz: часть 4
                            Auth.setTokens(result.tokens.accessToken, result.tokens.refreshToken);

                            // Перенаправление на главную страницу в случае успеха
                            location.href = '#/'
                        }

                    } catch (error) {
                        console.log(error);
                    }

                }

            }
            //////////////////////////////////////////////////////////////////
            /////////////////////////////////////////////////////

        }
    }
}

// переписаный
// if (this.page === 'signin') {

//     try {

//         // Отправка запроса на сервер для регистрации
//         const result = await CustomHttp.request('http://localhost:3000/api/login', 'POST', {
//             password: this.fields.find(item => item.password === 'password').element.value,
//             rememberMe: this.rememberMeElement.checked, // Получение состояния rememberMeElement
//             email: this.fields.find(item => item.email === 'email').element.value,
//         });

//         if (result) {
//             console.log(result)
//             // Проверка наличия токенов и пользователя
//             if (!result.user || !result.tokens || !result.tokens.accessToken || !result.tokens.refreshToken) {
//                 throw new Error("Токены не были получены");
//             }

//             //сохраняем токены через класс Auth 1:02 Проект Quiz: часть 4
//             Auth.setTokens(result.tokens.accessToken, tokens.refreshToken);

//             // Перенаправление на главную страницу в случае успеха
//             location.href = '#/'
//         }

//     } catch (error) {
//         console.log(error);
//     }

// }