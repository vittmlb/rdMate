/**
 * Created by Vittorio on 01/04/2017.
 */
let auxData = {
    set: {
        date_interval_demonstrativos: function(data) { // esta data é um objeto momentjs
            return {
                ini: new Date(data),
                fim: new Date(data.endOf('month'))
            };
        }
    }
};

let BuildAux = function () {
    let self = this;
    this.params = {
        categoria: function (datas) {
            let aux = {
                intervalo: {
                    ini: datas.ini,
                    fim: datas.fim
                },
                criterios: ['categoria', 'subcategoria', 'nome']
            };
            return JSON.stringify(aux);
        }
    };
};

angular.module('demonstrativos').factory('CompDemonstrativos', ['Demonstrativos', 'LancamentosQueries',
    function (Demonstrativos, LancamentosQueries) {
        let build = new BuildAux();
        function onChange(params) {
            let datas = auxData.set.date_interval_demonstrativos(params);
            return LancamentosQueries.geral({
                parametros: build.params.categoria(datas)
            });
        }

        return {
            filter: function (params) {
                return onChange(params);
            }
        };

    }
]);