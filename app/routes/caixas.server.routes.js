/**
 * Created by Vittorio on 22/03/2017.
 */
let caixas = require('../controllers/caixas.server.controller');

module.exports = function(app) {

    app.route('/api/caixas')
        .get(caixas.list)
        .post(caixas.create);

    app.route('/api/caixas/:caixaId')
        .get(caixas.read)
        .put(caixas.update)
        .delete(caixas.delete);

    app.param('caixaId', caixas.findById);

    app.route('/api/caixas/query')
        .get();

    app.route('/api/caixas/:parametros')
        .get(caixas.results);

    app.param('parametros', caixas.customConferenciaCaixa);

};