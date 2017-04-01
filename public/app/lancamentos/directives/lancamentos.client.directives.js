/**
 * Created by Vittorio on 01/04/2017.
 */
angular.module('lancamentos').directive('iboxLancamentoCadastro', function () {
    return {
        restrict: 'AE',
        replace: true,
        templateUrl: 'app/lancamentos/views/partials/ibox-cadastro-lancamento.partials.view.html'
    }
});
angular.module('lancamentos').directive('iboxLancamentoCadastroEdit', function () {
    return {
        restrict: 'AE',
        replace: true,
        templateUrl: 'app/lancamentos/views/partials/ibox-cadastro-edit-lancamento.partials.view.html'
    }
});