/**
 * Created by Vittorio on 31/03/2017.
 */
let demonstrativos = require('../controllers/demonstrativos.server.controller');

module.exports = function(app) {

    app.route('/api/demonstrativos')
        .get(demonstrativos.list)
        .post(demonstrativos.create);

    app.route('/api/demonstrativos/:demonstrativoId')
        .get(demonstrativos.read)
        .put(demonstrativos.update)
        .delete(demonstrativos.delete);

    app.param('demonstrativoId', demonstrativos.findById);

    app.route('/api/demonstrativos/query/:params')
        .get(demonstrativos.findCustom)
        .post(demonstrativos.findCustom);

    app.param('params', demonstrativos.findCustom);

};