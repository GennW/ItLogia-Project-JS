import { UrlManager } from "../utils/url-manager.js";


export class CostsCreate {
    constructor() {
        this.routeParams = UrlManager.getQueryParams();
        UrlManager.checkUserData(this.routeParams);
    }
}