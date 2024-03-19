import { CustomHttp } from "../src/components/services/custom-http.js";
import config from "./config.js";


export class GetOperationsForPeriod {
    constructor() {
        this.wrapperContent = null;
        this.operations = [];
    }
    static async getOperations(period) {

        try {
            const result = await CustomHttp.request(config.host + `/operations?period=${period}`);
            if (result && !result.error) {
                this.operations = result;
                console.log('все операции в том числе с удаленными категориями', result);
            }
        } catch (error) {
            console.error('Ошибка:', error);
        }
    }
}   