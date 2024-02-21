import { UrlManager } from "../utils/url-manager.js";


export class CostsEdit {
    constructor() {
        this.routeParams = UrlManager.getQueryParams();
    }
}