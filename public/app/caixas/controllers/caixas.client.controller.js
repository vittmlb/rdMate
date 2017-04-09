/**
 * Created by Vittorio on 22/03/2017.
 */
angular.module('caixas').controller('CaixasController', ['$scope', '$stateParams', '$location', 'Caixas', 'CompCaixa', 'toaster',
                                    '$http', '$timeout', 'MySweetAlert', 'MyDefineClass', 'ngAudio', 'MyAudio', '$modal', 'AppConfig', 'moment',
    function($scope, $stateParams, $location, Caixas, CompCaixa, toaster, $http, $timeout, MySweetAlert, MyDefineClass, ngAudio, MyAudio, $modal, AppConfig, moment) {
        $scope.toggleViews = {
            toggle: function(page, view) {
                switch (page) {
                    case 'edit_caixa_page':
                        switch (view) {
                            case 'edit':
                                this.edit_caixa_page.edit_view = true;
                                this.edit_caixa_page.check_view = false;
                                break;
                            case 'check':
                                this.edit_caixa_page.check_view = true;
                                this.edit_caixa_page.edit_view = false;
                                break;
                        }
                }
            },
            edit_caixa_page: {
                check_view: true,
                edit_view: false,
            }
        };


        $scope.modalEditCaixas = function(obj, tipo) {
            $scope.currentObj = obj;
            $scope.currentObj.tipoAux = tipo;
            let modalInstance = $modal.open({
                templateUrl: 'app/caixas/views/modals/_modal_edit_lancamentos.html',
                controller: ModalInstanceCtrl,
                scope: $scope,
                windowClass: 'animated flipInY'
            });
        }; // todo Mudar o nome da função

        $scope.sounds = MyAudio;

        $scope.defC = MyDefineClass;

        $scope.enums = AppConfig.enums.controller('CaixasController');
        $scope.lista = AppConfig.lista.controller('CaixasController');

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

        $scope.caixa = {
            data_caixa : {
            valor: ''
        },
            entradas : {},
            saidas : {
            despesas: [],
            cartoes: []
        },
            controles : {
            produtos: [],
            consumo: [],
            fiscal: {}
        },
            movimentacoes : []
        };


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

        $scope.obj = {
            produto: {
                nome: '',
                venda: {
                    valor: ''
                },
                perda: {
                    valor: ''
                },
                uso: {
                    valor: ''
                },
                tipoAux: $scope.enums.tiposAux.prod
            },
            consumo: {
                nome: '',
                inicial: {
                    valor: ''
                },
                final: {
                    valor: ''
                },
                tipoAux: $scope.enums.tiposAux.consumo
            },
            cartao: {
                bandeira: '',
                valor: '',
                turno: '',
                tipo: '', // usado apenas para passar pelo switch da função
                obs: '',
                tipoAux: $scope.enums.tiposAux.cartao
            },
            despesa: {
                descricao: '',
                valor: '',
                turno: '',
                tags: [],
                fornecedor: '',
                categoria: '',
                obs: '',
                tipoAux: $scope.enums.tiposAux.desp
            },
            movimentacao: {
                descricao: '',
                valor: '',
                tag: '',
                obs: '',
                tipoAux: $scope.enums.tiposAux.mov
            },
            unset: function(tipo) {
                let tp = $scope.enums.tiposAux;
                switch (tipo) {
                    case tp.prod:
                        this.produto = {};
                        this.produto = {
                            nome: '',
                            venda: {
                                valor: ''
                            },
                            perda: {
                                valor: ''
                            },
                            uso: {
                                valor: ''
                            },
                            tipoAux: $scope.enums.tiposAux.prod
                        };
                        break;
                    case tp.consumo:
                        this.consumo = {};
                        this.consumo = {
                            nome: '',
                            inicial: {
                                valor: ''
                            },
                            final: {
                                valor: ''
                            },
                            tipoAux: $scope.enums.tiposAux.consumo
                        };
                        break;
                    case tp.cartao:
                        this.cartao = {};
                        this.cartao = {
                            bandeira: '',
                            valor: '',
                            turno: '',
                            tipo: '', // usado apenas para passar pelo switch da função
                            obs: '',
                            tipoAux: $scope.enums.tiposAux.cartao
                        };
                        break;
                    case tp.desp:
                        this.despesa = {};
                        this.despesa = {
                            descricao: '',
                            valor: '',
                            turno: '',
                            tags: [],
                            fornecedor: '',
                            categoria: '',
                            obs: '',
                            tipoAux: $scope.enums.tiposAux.desp
                        };
                        break;
                    case tp.mov:
                        this.movimentacao = {};
                        this.movimentacao = {
                            descricao: '',
                            valor: '',
                            tag: '',
                            obs: '',
                            tipoAux: $scope.enums.tiposAux.mov
                    };
                        break;
                }
            },
        };

        /**
         * cria um array com objetos do caixa para que possam ser ordenados ou 'buscados" na página edit-caixa (view check caixa).
         */
        $scope.criaArrayGeral = function() {
            let array = [];
            array.push({"label": "Abertura", "turno": "Manhã", "obj": $scope.caixa.entradas.abertura.manha});
            array.push({"label": "Abertura", "turno": "Tarde",  "obj": $scope.caixa.entradas.abertura.tarde});
            array.push({"label": "Venda", "turno": "Manhã",  "obj": $scope.caixa.entradas.vendas.manha});
            array.push({"label": "Venda", "turno": "Tarde",  "obj": $scope.caixa.entradas.vendas.tarde});
            array.push({"label": "Transferência", "turno": "Manhã",  "obj": $scope.caixa.saidas.transferencia.manha});
            array.push({"label": "Transferência", "turno": "Tarde",  "obj": $scope.caixa.saidas.transferencia.tarde});
            array.push({"label": "Dinheiro", "turno": "Manhã",  "obj": $scope.caixa.saidas.dinheiro.manha});
            array.push({"label": "Dinheiro", "turno": "Tarde",  "obj": $scope.caixa.saidas.dinheiro.tarde});
            $scope.caixa.v.geral = array;
        };

        $scope.create = function() {
            let caixa = new Caixas({
                data_caixa: $scope.caixa.data_caixa,
                entradas: $scope.caixa.entradas,
                saidas: $scope.caixa.saidas,
                movimentacoes: $scope.caixa.movimentacoes,
                controles: $scope.caixa.controles
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
                // $scope.caixa.data_caixa = new Date(data.data_caixa);
                console.log(moment.locale());
                // moment.locale('pt-br');
                console.log(moment.locale());
                let teste = moment($scope.caixa.data_caixa).format('DD-MM-YYYY');
                $scope.caixa.data_caixa = teste;
                $scope.criaArrayGeral();
                $timeout(function () {
                    $('.table').trigger('footable_redraw');
                }, 100);
                // $scope.caixa.conferencias = CompCaixa.teste($scope.caixa);
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

        $scope.addReg = function(registro) {
            let parent = $scope.caixa;
            switch (registro.tipoAux) {
                case $scope.enums.tiposAux.prod:
                    parent.controles.produtos.push(registro);
                    break;
                case $scope.enums.tiposAux.cartao:
                    parent.saidas.cartoes.push(registro);
                    break;
                case $scope.enums.tiposAux.consumo:
                    parent.controles.consumo.push(registro);
                    break;
                case $scope.enums.tiposAux.desp:
                    parent.saidas.despesas.push(registro);
                    break;
                case $scope.enums.tiposAux.mov:
                    parent.movimentacoes.push(registro);
                    break;
            }
            $scope.obj.unset(registro.tipoAux);
        };

        $scope.removeReg = function(registro, tipo) {
            let tp = $scope.enums.tiposAux;
            let parent = $scope.caixa;

            if(tipo) registro.tipoAux = tipo;


            switch (registro.tipoAux) {
                case tp.prod:
                    parent.controles.produtos = parent.controles.produtos.filter(function (elem) { return elem !== registro; });
                    break;
                case tp.cartao:
                    parent.saidas.cartoes = parent.saidas.cartoes.filter(function (elem) { return elem !== registro; });
                    break;
                case tp.consumo:
                    parent.controles.consumo = parent.controles.consumo.filter(function (elem) {return elem !== registro;});
                    break;
                case tp.desp:
                    parent.saidas.despesas = parent.saidas.despesas.filter(function (elem) { return elem !== registro; });
                    break;
                case tp.mov:
                    parent.movimentacoes = parent.movimentacoes.filter(function (elem) { return elem !== registro; });
                    break;
            }
        };

        $scope.addRegistro = function(registro) {
            let parent = $scope;

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
            }

            $scope.objRegistro = {};
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