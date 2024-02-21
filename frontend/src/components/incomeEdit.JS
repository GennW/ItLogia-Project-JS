import { UrlManager } from "../utils/url-manager.js";


export class IncomeEdit {
    constructor() {
        this.routeParams = UrlManager.getQueryParams();
    }
}