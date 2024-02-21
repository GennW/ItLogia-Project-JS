import { Auth } from "./auth.js";

export class CustomHttp {
    static async request(url, method = "GET", body = null) {


        // Создаем объект params с методом запроса и заголовками
        const params = {
            method: method,
            headers: {
                'Content-type': 'application/json',
                'Accept': 'application/json',
            }
        };
        // Получаем токен доступа из локального хранилища
        let token = localStorage.getItem(Auth.accessTokenKey);
        // console.log('tokens =', token);
        if (token) {
            params.headers['x-auth-token'] = token; //присваивание добавляем токен в заголовки запроса под ключем 'x-auth-token'.
        }

        if (body) {
            params.body = JSON.stringify(body);
        }
        // Отправка запроса на сервер для регистрации
        const response = await fetch(url, params);

        // Обработка результата запроса
        // const result = await response.json();
        // проверяем статус сервера
        if (response.status < 200 || response.status >= 300) { // 43 и 48 min Проект Quiz: часть 4
            if (response.status === 401) { // 1:11:40 Проект Quiz: часть 4
                const result = await response.json();
                if (result.error && result.message === "Invalid email or password") {
                    throw new Error("Неверный email или пароль");
                } else {
                    const result = await Auth.processUnautorizedResponse();

                    if (result) { // 1:18:50 если в auth.js приходит false
                        return await this.request(url, method, body); // рекурсия 1:20 Проект Quiz: часть 4
                    } else {
                        return null; // не будет парсинга json если на странице не найден токен в init() где передается для уатентификации CustomHttp.request 1:19
                    }
                }

            }


            alert('Пользователь с такими данными не зарегистрирован');
            throw new Error(response.message);
        }
        // console.log(response)
        return await response.json();
    }
}