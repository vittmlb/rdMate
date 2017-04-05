/**
 * Created by Vittorio on 05/04/2017.
 */
angular.module('caixas').directive('iboxConferenciaEntradas', function() {
    return {
        restrict: 'AE',
        replace: true,
        templateUrl: 'app/caixas/views/edit/_ibox-conferencia-entradas.html'
    }
});
angular.module('caixas').directive('iboxConferenciaDespesas', function() {
    return {
        restrict: 'AE',
        replace: true,
        templateUrl: 'app/caixas/views/edit/_ibox-conferencia-despesas.html'
    }
});