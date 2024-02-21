import { UrlManager } from "../utils/url-manager.js";


export class IncomeCreate {
    constructor() {
        this.routeParams = UrlManager.getQueryParams();
    }
}