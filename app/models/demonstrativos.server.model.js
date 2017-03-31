/**
 * Created by Vittorio on 31/03/2017.
 */
let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let DemonstrativosSchema = new Schema({
    created: {
        type: Date,
        default: Date.now
    }
});