/**
 * Created by Vittorio on 09/04/2017.
 */

exports.intervalo = function(data_inicial, data_final) {
    return {$match: {"data_caixa": {"$gte": new Date(data_inicial), "$lte": new Date(data_final)}}}
};