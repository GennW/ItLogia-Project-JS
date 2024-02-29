
export class PutTitleInInput {

     // статический метод для подстановки значения из routeParams.title в input
     static populateInputWithRouteParamsTitle(routeParams) {
        const editCategoryInputElement = document.getElementById('edit-category-input');
        editCategoryInputElement.value = routeParams.title; // Подстановка значения из routeParams.title в input
    }
}