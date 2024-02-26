import { UrlManager } from "../utils/url-manager.js";
import { Logout } from "./services/logout.js";


export class IncomeAndCosts {
    constructor() {
        this.routeParams = UrlManager.getQueryParams();
    }
}