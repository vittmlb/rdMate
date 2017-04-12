/**
 * Created by Vittorio on 10/04/2017.
 */

exports.comparacao = function(caixasPromise) {
    let b = caixasPromise;
    let z = [];
    let c = createSets(caixasPromise);
    return b;
};

function createSets(values) {
    let results = [];
    values.forEach(function (elem, index) {
        let z = auxElementId(elem);
        z.set = 'aloha' + index;
        results.push(z);
        caralho = {};
    });
    return results;
}

let caralho = {};
function auxElementId(values) {
    if(Array.isArray(values)) {
        values.forEach(function (elem) {
            if(Array.isArray(elem)) {
                auxElementId(elem);
            } else {
                caralho[elem._controle] = (elem);
            }
        });
    }
    return caralho;
}