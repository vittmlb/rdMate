/**
 * Created by Vittorio on 30/03/2017.
 */
angular.module('lancamentos').controller('LancamentosController', ['$scope', '$stateParams', '$location', 'Lancamentos', 'toaster', '$http',
    function($scope, $stateParams, $location, Lancamentos, toaster, $http) {
        let SweetAlertOptions = {
            removerLancamento: {
                title: "Deseja remover este Lançamento?",
                text: "Você não poderá mais recuperá-lo!",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",confirmButtonText: "Sim, remover!",
                cancelButtonText: "Não, cancelar!",
                closeOnConfirm: false,
                closeOnCancel: false }
        };
        $scope.enums = {};
        $scope.enums.teste = ['a', 'b'];

        $scope.states = {
            edit: false,
        };

        $scope.objLancamento = {};

        $http.get('/app/data/enum_data.json').success(function (data) {
            $scope.enums.fornecedores = data.fornecedores;
            $scope.enums.categorias = data.categorias;
            $scope.enums.subcategorias = data.subcategorias;
            $scope.enums.nomes = data.nomes;
            $scope.enums.imovel = data.imovel;
            $scope.enums.consumo = data.consumo;
            $scope.enums.taxa = data.taxa;
            $scope.enums.pessoal = data.pessoal;
            $scope.enums.operacional = data.operacional;
            $scope.enums.operador = data.operador;
            $scope.enums.financeiro = data.financeiro;
            $scope.enums.venda = data.venda;
            $scope.enums.outras_receitas = data.outras_receitas;
        });

        $scope.create = function() {
            let lancamento = new Lancamentos({
                data: $scope.objLancamento.data,
                categoria: $scope.objLancamento.categoria,
                subcategoria: $scope.objLancamento.subcategoria,
                nome: $scope.objLancamento.nome,
                descricao: $scope.objLancamento.descricao,
                observacao: $scope.objLancamento.observacao,
                valor: $scope.objLancamento.valor
            });
            lancamento.$save(function (response) {
                $scope.lancamentos = Lancamentos.query();
                $scope.objLancamento = {};
            }, function(errorResponse) {
                console.log(errorResponse);
                toaster.pop({
                    type: 'error',
                    title: 'Erro',
                    body: errorResponse.data,
                    timeout: 4000
                });
            });
        };
        $scope.find = function() {
            Lancamentos.query().$promise.then(function(data) {
                $scope.lancamentos = data;
            });
        };
        $scope.findOne = function() {
            Lancamentos.get({
                lancamentoId: $stateParams.lancamentoId
            }).$promise.then(function (data) {
                $scope.lancamento = data;
            });
        };
        $scope.update = function(objlancamento) {
            if(objlancamento) {
                objlancamento.$update(function (response) {
                    console.log(`O update do lancamento de id: ${response._id} foi realizado com sucesso`);
                    console.log(response);
                    $scope.lancamentos = Lancamentos.query();
                    $scope.objLancamento = {};
                    $scope.states.edit = false;
                });
            } else {
                $scope.lancamento.$update(function (response) {
                    $location.path('/lancamentos/' + response._id);
                });
            }
        };
        $scope.delete = function(lancamento) {
            if(lancamento) {
                lancamento.$remove(function () {
                    for(let i in $scope.lancamentos) {
                        if($scope.lancamentos[i] === lancamento) {
                            $scope.lancamentos.splice(i, 1);
                        }
                    }
                }, function(errorResponse) {
                    console.log(errorResponse);
                    toaster.pop({
                        type: 'error',
                        title: 'Erro',
                        body: errorResponse.data,
                        timeout: 4000
                    });
                });
            } else {
                $scope.lancamento.$remove(function () {
                    $location.path('/lancamentos');
                }, function(errorResponse) {
                    console.log(errorResponse);
                    toaster.pop({
                        type: 'error',
                        title: 'Erro',
                        body: errorResponse.data,
                        timeout: 4000
                    });
                });
            }
        };
        $scope.deleteAlert = function(lancamento) {
            SweetAlert.swal(SweetAlertOptions.removerCaixa,
                function(isConfirm){
                    if (isConfirm) {
                        $scope.delete(lancamento);
                        SweetAlert.swal("Removido!", "O Lancamento foi removido.", "success");
                    } else {
                        SweetAlert.swal("Cancelado", "O Lancamento não foi removido :)", "error");
                    }
                });
        };

        $scope.edit = function(lancamento) {
            $scope.states.edit = true;
            $scope.objLancamento = lancamento;
            $scope.objLancamento.data = new Date(lancamento.data);
        };

    }
]);