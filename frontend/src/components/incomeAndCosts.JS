import { UrlManager } from "../utils/url-manager.js";


export class IncomeAndCosts {
    constructor() {
        this.routeParams = UrlManager.getQueryParams();
    }
}