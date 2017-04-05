/**
 * Created by Vittorio on 22/03/2017.
 */
angular.module('caixas').config(['$stateProvider', function ($stateProvider) {
    $stateProvider
        .state('caixa_create', {
            url: '/caixas/create',
            templateUrl: 'app/caixas/views/create/create-caixa.client.view.html',
            controller: 'CaixasController'
        })
        .state('caixa_list', {
            url: '/caixas',
            templateUrl: 'app/caixas/views/list/list-caixas.client.view.html',
            controller: 'CaixasController'
        })
        .state('caixa_view', {
            url: '/caixas/:caixaId',
            templateUrl: 'app/caixas/views/view/view-caixa.client.view.html',
            controller: 'CaixasController'
        })
        .state('caixa_edit', {
            url: '/caixas/:caixaId/edit',
            templateUrl: 'app/caixas/views/edit/edit-caixa.client.view.html',
            controller: 'CaixasController'
        })
}]);