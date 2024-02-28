// доработать сделать универсальным для вызова на страницах редактирования категорий
export class PutTitleInInput {

    constructor() {
        this.routeParams = UrlManager.getQueryParams();
    }

     // Дополнительный метод для подстановки значения из routeParams.title в input
     static populateInputWithRouteParamsTitle() {
        const editCategoryInputElement = document.getElementById('edit-category-input');
        editCategoryInputElement.value = this.routeParams.title; // Подстановка значения из routeParams.title в input
    }
}