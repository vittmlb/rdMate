/**
 * Created by Vittorio on 22/03/2017.
 */
angular.module('caixas').controller('CaixasController', ['$scope', '$stateParams', '$location', 'Caixas', 'CompCaixa', 'toaster', '$http', '$timeout', 'MySweetAlert', 'MyDefineClass',
    function($scope, $stateParams, $location, Caixas, CompCaixa, toaster, $http, $timeout, MySweetAlert, MyDefineClass) {
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

        $scope.DefC = MyDefineClass;

        $scope.enums = {
            turnos: {
                manha: 'Manhã',
                tarde: 'Tarde'
            },
            tipos: {
                desp: 'Despesa',
                mov:  'Movimentação',
            },
            origens: {
                cofre: 'Cofre',
                geral: 'Geral'
            }
        };

        MySweetAlert.set.text = `Tem certeza de que deseja remover este Caixa?`;

        function popToaster(errorResponse) {
            console.log(errorResponse);
            let msgObj = {
                type: 'error',
                title: 'Erro',
                body: errorResponse.data,
                timeout: 4000
            };
            if(typeof errorResponse === 'string') {
                msgObj.body = errorResponse;
            }
            toaster.pop(msgObj);
        }

        $scope.listaTiposRegistros = {};
        $scope.listaTiposRegistro = {};
        $scope.listaBandeiras = {};

        $http.get('/app/caixas/data/enum_caixas.json').success(function (data) {
            $scope.listaTiposRegistro = data.listaTiposRegistro;
            $scope.listaTurnos = data.listaTurnos;
            $scope.listaOrigens = data.listaOrigens;
            $scope.listaBandeiras = data.listaBandeiras;
        });

        $scope.entradas = {};
        $scope.saidas = {
            despesas: [],
            cartoes: []
        };
        $scope.movimentacoes = [];

        $scope.objRegistro = {
            descricao: '',
            valor: 0,
            turno: '',
            tipo: '',
            tag: '',
            fornecedor: '',
            obs: '',
            obj: {}
        };
        $scope.objCartao = {
            bandeira: '',
            valor: 0,
            turno: '',
            tipo: '', // usado apenas para passar pelo switch da função
            obs: '',
        };


        $scope.create = function() {
            let caixa = new Caixas({
                data_caixa: this.data_caixa,
                entradas: this.entradas,
                saidas: this.saidas,
                movimentacoes: this.movimentacoes,
                controles: this.controles
            });
            caixa.$save(function (response) {
                $location.path('/caixas/' + response._id);
            }, function(errorResponse) {
                popToaster(errorResponse);
            });
        };
        $scope.find = function() {
            let p = Caixas.query().$promise;

            p.then(function (data) {
                $scope.caixas = data;
                $timeout(function () {
                    $('.table').trigger('footable_redraw');
                }, 100);
            });

            p.catch(function (errorResponse) {
                popToaster(errorResponse);
            });

        };
        $scope.findOne = function() {
            let p = Caixas.get({ caixaId: $stateParams.caixaId}).$promise;

            p.then(function (data) {
                $scope.caixa = data;
                $scope.caixa.data_caixa = new Date(data.data_caixa);
                $scope.caixa.conferencias = CompCaixa.teste($scope.caixa);
            });

            p.catch(function (errorResponse) {
                popToaster(errorResponse);
            });
        };
        $scope.update = function() {
            $scope.caixa.$update(function (response) {
                $location.path('/caixas/' + response._id);
            }, function(errorResponse) {
                popToaster(errorResponse);
            });
        };

        $scope.delete = function(caixa) {
            if(caixa) {
                return caixa.$remove(function () {
                    for(let i in $scope.caixas) {
                        if($scope.caixas[i] === caixa) {
                            $scope.caixas.splice(i, 1);
                        }
                    }
                }, function(errorResponse) {
                    return errorResponse;
                });
            } else {
                return $scope.caixa.$remove(function () {
                    $location.path('/caixas');
                }, function(errorResponse) {
                    return errorResponse;
                });
            }
        };

        $scope.deleteAlert = function(caixa) {
            let p = MySweetAlert.deleteAlert();
            p.then(function () {
                let pp = $scope.delete(caixa);
                pp.then(function(data) {
                    swal("Removido!", "O Caixa foi removido.", "success"); // todo: Melhorar essa resposta.
                });
                pp.catch(function(errorResponse) {
                    popToaster(errorResponse);
                });

            }).catch(swal.noop);
        };


        $scope.defineClass = function(item) {
            if(item >= 0) {
                if(item === 0) return 'text-success';
                return 'text-warning';
            } else {
                return 'text-danger';
            }
        };

        $scope.defClass = {
            diferenca: function(item) {
                if(item >= 0) {
                    if(item === 0) return 'text-success';
                    return 'text-warning';
                } else {
                    return 'text-danger';
                }
            }
        };

        $scope.addRegistro = function(registro) {
            let parent = $scope.caixa ? $scope.caixa: $scope;

            // if(!validateObjRegistro()) {
            //     $scope.objRegistro = {};
            //     return;
            // }

            switch (registro.tipo) {
                case $scope.enums.tipos.desp:
                    parent.saidas.despesas.push(registro);
                    break;
                case $scope.enums.tipos.mov:
                    parent.movimentacoes.push(registro);
                    break;
                case $scope.enums.tipos.cartao:
                    parent.saidas.cartoes.push(registro);
                    break;
            }

            $scope.objRegistro = {};
        };


        /**
         * Remove o registro do array/tabela correspondente.
         * @param item: elemento que deverá ser removido do array - contém as propriedades descricao e valor - obj Registro
         * @param tipo: tipo do elemento: Despesa ou Movimentação
         * @param param: parâmetro que representa turno (no caso de uma despesa) ou origem (cofre ou geral - caso da movimentação
         */
        $scope.removeRegistro = function(item) {
            let parent = $scope.caixa ? $scope.caixa: $scope;
            switch (item.tipo) {
                case $scope.enums.tipos.desp: // enum: "Despesas"
                    parent.saidas.despesas.filter(function (elem, item) { return elem !== item; });
                    break;
                case $scope.enums.tipos.mov:
                    parent.movimentacoes.filter(function (elem, item) { return elem !== item; });
                    break;
            }
        };


        $scope.addCartao = function(registro) {
            let parent = $scope.caixa ? $scope.caixa: $scope;

            parent.saidas.cartoes.push(registro);

            $scope.objCartao = {};

        };

        function validateObjRegistro() {

            let reg = $scope.objRegistro;

            if(!Object.keys(reg).length) {
                popToaster(`O objeto objRegistro está vazio`);
                return false;
            }

            if(typeof reg.tipo === 'undefined') {
                popToaster(`O campo 'Tipo' do objRegistro não foi definido`);
                return false;
            }

            if(typeof reg.descricao === 'undefined' || reg.descricao === '') {
                popToaster(`O campo 'descrição é obrigatório`);
                return false;
            }

            if(typeof reg.valor !== 'number' ||  reg.valor === 0) {
                popToaster(`O campo 'valor' não foi preenchido ou é igual a 0`);
                return false;
            }

            //todo: Melhorar esses critérios depois.
            // if(!(reg.tipo === $scope.enums.tipos.desp && (reg.turno === $scope.enums.turnos.manha || reg.turno === $scope.enums.turnos.tarde))) {
            //     popToaster(`Erro com o campo de 'Turno'`);
            //     return false;
            // }
            //
            // if(!(reg.tipo === $scope.enums.tipos.mov && (reg.mov === $scope.enums.origens.manha || reg.mov === $scope.enums.origens.tarde))) {
            //     popToaster(`Erro com o campo de 'Movimentação'`);
            //     return false;
            // }

            return true;
        }

        $scope.showTab = {
            valor: 'Despesas',
            set: function(value) {
                this.valor = value;
            }
        }

    }
]);