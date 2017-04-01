/**
 * Created by Vittorio on 30/03/2017.
 */
let lancamento = require('../controllers/lancamentos.server.controller');

module.exports = function(app) {

    app.route('/api/lancamentos')
        .get(lancamento.list)
        .post(lancamento.create);

    app.route('/api/lancamentos/:lancamentoId')
        .get(lancamento.read)
        .put(lancamento.update)
        .delete(lancamento.delete);

    app.param('lancamentoId', lancamento.findById);

    app.route('/api/lancamentos/query/:parametros')
        .get(lancamento.results);

    app.param('parametros', lancamento.findCustoms);

};