import { CustomHttp } from "./services/custom-http.js";
import config from "../../config/config.js";


export class Sidebar {
    constructor() {
        this.init();
    }
    async init() {
        const balanceElement = document.getElementById('common-balance');
        try {
            // Выполняем запрос на получение баланса
            const getBalance = await CustomHttp.request(config.host + '/balance');
            console.log(getBalance)
            if (getBalance) {
                if (getBalance.error) {
                    console.error('Ошибка при удалении категории:', getBalance.error);
                } else {
                    const formattedBalance = getBalance.balance.toLocaleString();  // Применение форматирования разделителя разрядов
                    balanceElement.innerText = formattedBalance + '$';
                }
            }
        } catch (error) {
            console.error('Ошибка при получении баланса:', error);
        }

    }
}