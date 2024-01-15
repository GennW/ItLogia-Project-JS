import { Router } from "./router.js";

class App {
    constructor() {
        this.router = new Router();
        window.addEventListener('DOMContentLoaded', () => {
            this.router.openRoute();
        });
        window.addEventListener('popstate', () => {
            this.router.openRoute();
        });
    }
}

(new App());