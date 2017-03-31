/**
 * Created by Vittorio on 30/03/2017.
 */
angular.module('lancamentos').config(['$stateProvider', function ($stateProvider) {
    $stateProvider
        .state('lancamento_create', {
            url: '/lancamentos/create',
            templateUrl: 'app/lancamentos/views/create-lancamento.client.view.html',
            controller: 'LancamentosController'
        })
        .state('lancamento_list', {
            url: '/lancamentos',
            templateUrl: 'app/lancamentos/views/list-lancamentos.client.view.html',
            controller: 'LancamentosController'
        })
        .state('lancamento_view', {
            url: '/lancamentos/:lancamentoId',
            templateUrl: 'app/lancamentos/views/view-lancamento.client.view.html',
            controller: 'LancamentosController'
        })
        .state('lancamento_edit', {
            url: '/lancamentos/:lancamentoId',
            templateUrl: 'app/lancamentos/views/edit-lancamento.client.view.html',
            controller: 'LancamentosController'
        });
}]);