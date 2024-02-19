import { UrlManager } from "../utils/url-manager.js";


export class Costs {
    constructor() {
        this.routeParams = UrlManager.getQueryParams();
        // UrlManager.checkUserData(this.routeParams);
        console.log(this.routeParams);
        console.log(this.routeParams.name);

    }
}