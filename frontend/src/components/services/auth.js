import config from "../../../config/config.js";

export class Auth {
    static accessTokenKey = 'tokens.accessToken';
    static refreshTokenKey = 'tokens.refreshToken';

    static async processUnautorizedResponse() {     // 1:12:30 Проект Quiz: часть 4
        const refreshToken = localStorage.getItem(this.refreshTokenKey);
        if (refreshToken) {
            const response = await fetch(config.host + '/refresh', {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify( {refreshToken: refreshToken} )
            });

            // проверяем ответ от сервера
            if (response && response.status === 200) { // 1:17  Проект Quiz: часть 4
                const result = await response.json(); // берем ответ от сервера
                if (result && !result.error) { // если нет ошибки
                    this.setTokens(result.tokens.accessToken, result.tokens.refreshToken); // устанавливаем новые токены
                    return true; // если все успешно обновилось то возвращаем true в custom-http в if(result)
                } 
            }
        }

        // если запрос пришел с ошибкой, то удаляем токены и переводим пользователя на страницу
        this.removeTokens();
        console.log('запрос пришел с ошибкой, токены удалены');
        location.href = '#/signup';

        return false; // 1:18 Проект Quiz: часть 4
    } 


    static setTokens(accessToken, refreshToken) {
        localStorage.setItem(this.accessTokenKey, accessToken);
        localStorage.setItem(this.refreshTokenKey, refreshToken);
    }

    static removeTokens() {
        localStorage.removeItem(this.accessTokenKey);
        localStorage.removeItem(this.refreshTokenKey);
    }

    static checkAuth() {
        const accessToken = localStorage.getItem(this.accessTokenKey);
        const refreshToken = localStorage.getItem(this.refreshTokenKey);
    
        return accessToken && refreshToken; // возвращает true, если оба токена существуют в localStorage, иначе возвращает false
    }
}
