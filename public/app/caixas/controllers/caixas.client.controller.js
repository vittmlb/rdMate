/**
 * Created by Vittorio on 22/03/2017.
 */
// let parametros = require('../../../../app/data/fornecedores.json');
angular.module('caixas').controller('CaixasController', ['$scope', '$stateParams', '$location', 'Caixas', 'CompCaixa', 'toaster', 'SweetAlert', '$http',
    function($scope, $stateParams, $location, Caixas, CompCaixa, toaster, SweetAlert, $http) {
        let SweetAlertOptions = {
            removerCaixa: {
                title: "Deseja remover este Caixa?",
                text: "Você não poderá mais recuperá-lo!",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",confirmButtonText: "Sim, remover!",
                cancelButtonText: "Não, cancelar!",
                closeOnConfirm: false,
                closeOnCancel: false }
        };

        $scope.turnos = ['manhã', 'tarde'];

        $scope.despesas = {
            manha: [],
            tarde: []
        };
        $scope.objDespesaManha = {};
        $scope.objDespesaTarde = {};

        $scope.movimentacao = {
            geral: [],
            cofre: []
        };
        $scope.objMovimentacaoGeral = {};
        $scope.objMovimentacaoCofre = {};


        $scope.create = function() {
            this.lancamentos.despesas = $scope.despesas;
            this.movimentacao = $scope.movimentacao;
            let caixa = new Caixas({
                data_caixa: this.data_caixa,
                abertura: this.abertura,
                vendas: this.vendas,
                lancamentos: this.lancamentos,
                movimentacao: this.movimentacao,
                acompanhamentos: this.acompanhamentos
            });
            caixa.$save(function (response) {
                $location.path('/caixas/' + response._id);
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
            Caixas.query().$promise.then(function (data) {
                $scope.caixas = data;
            });
        };
        $scope.findOne = function() {
            Caixas.get({
                caixaId: $stateParams.caixaId
            }).$promise.then(function (data) {
                $scope.caixa = data;
                // $scope.caixa.data = new Date(data.data);
                $scope.caixa.conferencias = CompCaixa.teste($scope.caixa);
            });
        };
        $scope.update = function() {
            $scope.caixa.$update(function (response) {
                $location.path('/caixas/' + response._id);
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

        $scope.delete = function(caixa) {
            if(caixa) {
                caixa.$remove(function () {
                    for(let i in $scope.caixas) {
                        if($scope.caixas[i] === caixa) {
                            $scope.caixas.splice(i, 1);
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
                $scope.caixa.$remove(function () {
                    $location.path('/caixas');
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

        $scope.deleteAlert = function(caixa) {
            SweetAlert.swal(SweetAlertOptions.removerCaixa,
                function(isConfirm){
                    if (isConfirm) {
                        $scope.delete(caixa);
                        SweetAlert.swal("Removido!", "O Caixa foi removido.", "success");
                    } else {
                        SweetAlert.swal("Cancelado", "O Caixa não foi removido :)", "error");
                    }
                });
        };

        $scope.addDespesaManha = function() {
            if($scope.caixa) {
                $scope.caixa.lancamentos.despesas.manha.push($scope.objDespesaManha);
            } else {
                $scope.despesas.manha.push($scope.objDespesaManha);
            }
            $scope.objDespesaManha = {};
        };
        $scope.removeDespesaManha = function(despesa) {
            if($scope.caixa) {
                let index = $scope.caixa.lancamentos.despesas.manha.indexOf(despesa);
                $scope.caixa.despesas.manha.splice(index, 1);
            } else {
                let index = $scope.despesas.manha.indexOf(despesa);
                $scope.despesas.manha.splice(index, 1);
            }
        };

        $scope.addDespesaTarde = function() {
            if($scope.caixa) {
                $scope.caixa.lancamentos.despesas.tarde.push($scope.objDespesaTarde);
            } else {
                $scope.despesas.tarde.push($scope.objDespesaTarde);
            }
            $scope.objDespesaTarde = {};
        };
        $scope.removeDespesaTarde = function(despesa) {
            if($scope.caixa) {
                let index = $scope.caixa.despesas.tarde.indexOf(despesa);
                $scope.caixa.lancamentos.despesas.tarde.splice(index, 1);
            } else {
                let index = $scope.despesas.tarde.indexOf(despesa);
                $scope.despesas.tarde.splice(index, 1);
            }
        };

        $scope.addMovimentacaoCofre = function() {
            if($scope.caixa) {
                $scope.caixa.movimentacao.cofre.push($scope.objMovimentacaoCofre);
            } else {
                $scope.movimentacao.cofre.push($scope.objMovimentacaoCofre);
            }
            $scope.objMovimentacaoCofre = {};
        };
        $scope.removeMovimentacaoCofre = function(movimentacao) {
            if($scope.caixa) {
                let index = $scope.caixa.movimentacao.cofre.indexOf(movimentacao);
                $scope.caixa.movimentacao.cofre.splice(index, 1);
            } else {
                let index = $scope.movimentacao.cofre.indexOf(movimentacao);
                $scope.movimentacao.cofre.splice(index, 1);
            }
        };

        $scope.addMovimentacaoGeral = function() {
            if($scope.caixa) {
                $scope.caixa.movimentacao.geral.push($scope.objMovimentacaoGeral);
            } else {
                $scope.movimentacao.geral.push($scope.objMovimentacaoGeral);
            }
            $scope.objMovimentacaoGeral = {};
        };
        $scope.removeMovimentacaoGeral = function(movimentacao) {
            if($scope.caixa) {
                let index = $scope.caixa.movimentacao.geral.indexOf(movimentacao);
                $scope.caixa.movimentacao.geral.splice(index, 1);
            } else {
                let index = $scope.movimentacao.geral.indexOf(movimentacao);
                $scope.movimentacao.geral.splice(index, 1);
            }
        };


    }
]);