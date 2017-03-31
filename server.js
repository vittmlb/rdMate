/**
 * Created by Vittorio on 30/05/2016.
 */
let mongoose = require('./config/mongoose');
let express = require('./config/express');
let passport = require('./config/passport');

let db = mongoose();
let app = express();
let passports = passport();

app.listen(3000);

module.exports = app;

app.set('port', (process.env.PORT || 5000));

app.listen(app.get('port'), function () {
    console.log(`Node app is running on port `, app.get('port'));
});