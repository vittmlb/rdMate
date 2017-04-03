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

        $scope.listaTiposRegistros = {};
        $scope.listaTiposRegistro = {};
        $scope.listaOrigens = ['Cofre', 'Geral'];

        $http.get('/app/caixas/data/enum_caixas.json').success(function (data) {
            $scope.listaTiposRegistro = data.listaTiposRegistro;
            $scope.listaTurnos = data.listaTurnos;
        });

        $scope.entradas = {};
        $scope.saidas = {
            despesas: []
        };
        $scope.movimentacao = {
            cofre: [],
            geral: []
        };

        $scope.objRegistro = {
            descricao: '',
            valor: 0,
            turno: '',
            tag: '',
            fornecedor: '',
            obs: '',
            obj: {}
        };


        $scope.create = function() {
            let caixa = new Caixas({
                data_caixa: this.data_caixa,
                entradas: this.entradas,
                saidas: this.saidas,
                movimentacao: this.movimentacao,
                controles: this.controles
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
                $scope.caixa.data_caixa = new Date(data.data_caixa);
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


        $scope.addRegistro = function(item) {
            let parent = $scope.caixa ? $scope.caixa: $scope;
            switch ($scope.objRegistro.obj.valor) {
                case 'despesa':
                    if(item.turno.valor === 'manha') {
                        parent.saidas.despesas.manha.push(item);
                    } else if(item.turno.valor === 'tarde') {
                        parent.saidas.despesas.tarde.push(item);
                    }
                    break;
                case 'mov_cofre':
                    parent.movimentacao.cofre.push(item);
                    break;
                case 'mov_geral':
                    parent.movimentacao.geral.push(item);
            }
            $scope.objRegistro = {};
        };

        /**
         * Remove o registro do array/tabela correspondente.
         * @param item: elemento que deverá ser removido do array - contém as propriedades descricao e valor - obj Registro
         * @param tipo: tipo do elemento: Despesa ou Movimentação
         * @param param: parâmetro que representa turno (no caso de uma despesa) ou origem (cofre ou geral - caso da movimentação
         */
        $scope.removeRegistro = function(item, tipo, param) {
            let parent = $scope.caixa ? $scope.caixa: $scope;
            switch (tipo) {
                case 'despesa':
                    if(param === 'manha') {
                        let index = parent.saidas.despesas.manha.indexOf(item);
                        parent.saidas.despesas.manha.splice(index, 1);
                    } else if(param === 'tarde') {
                        let index = parent.saidas.despesas.tarde.indexOf(item);
                        parent.lancamentos.saidas.tarde.splice(index, 1);
                    }
                    break;
                case 'mov_cofre':
                    let idx_cofre = parent.movimentacao.cofre.indexOf(item);
                    parent.movimentacao.cofre.splice(idx_cofre);
                    break;
                case 'mov_geral':
                    let idx_geral = parent.movimentacao.geral.indexOf(item);
                    parent.movimentacao.geral.splice(idx_geral);
            }
        };

    }
]);