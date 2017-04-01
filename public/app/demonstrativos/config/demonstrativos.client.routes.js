/**
 * Created by Vittorio on 31/03/2017.
 */
angular.module('demonstrativos').config(['$stateProvider', function ($stateProvider) {
    $stateProvider
        .state('demonstrativo_create', {
            url: '/demonstrativos/create',
            templateUrl: 'app/demonstrativos/views/create-demonstrativo.client.view.html',
            controller: 'DemonstrativosController'
        })
        .state('demonstrativo_list', {
            url: '/demonstrativos',
            templateUrl: 'app/demonstrativos/views/list-demonstrativos.client.view.html',
            controller: 'DemonstrativosController'
        })
        .state('demonstrativo_view', {
            url: '/demonstrativos/:demonstrativoId',
            templateUrl: 'app/demonstrativos/views/view-demonstrativo.client.view.html',
            controller: 'DemonstrativosController'
        })
        .state('demonstrativo_edit', {
            url: '/demonstrativos/:demonstrativoId/edit',
            templateUrl: 'app/demonstrativos/views/edit-demonstrativo.client.view.html',
            controller: 'DemonstrativosController'
        })
}]);