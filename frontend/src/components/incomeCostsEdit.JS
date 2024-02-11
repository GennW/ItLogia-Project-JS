import { UrlManager } from "../utils/url-manager.js";


export class IncomeCostsEdit {
    constructor() {
        this.routeParams = UrlManager.getQueryParams();
        UrlManager.checkUserData(this.routeParams);
    }
}