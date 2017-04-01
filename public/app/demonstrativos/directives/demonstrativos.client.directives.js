/**
 * Created by Vittorio on 01/04/2017.
 */
angular.module('demonstrativos').directive('iboxDemonstrativoCadastro', function () {
    return {
        restrict: 'AE',
        replace: true,
        templateUrl: 'app/demonstrativos/views/partials/ibox-cadastro-demonstrativos.partials.view.html'
    }
});
angular.module('demonstrativos').directive('iboxDemonstrativoList', function () {
    return {
        restrict: 'AE',
        replate: true,
        templateUrl: 'app/demonstrativos/views/partials/ibox-list-demonstrativos.partials.view.html'
    }
});