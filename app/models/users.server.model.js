/**
 * Created by Vittorio on 27/03/2017.
 */
let mongoose = require('mongoose');
let crypto = require('crypto');
let Schema = mongoose.Schema;


let UsersSchema = new Schema({
    nome: {
        type: String,
        trim: true,
        required: `O campo 'nome' é obrigatório`
    },
    email: {
        type: String,
        trim: true,
        unique: true,
        match: [/.+\@.+\..+/, "Please fill a valid e-mail address"],
        required: `O campo 'email' é obrigatório`
    },
    senha: {
        type: String,
        trim: true,
        required: `O campo 'senha' é obrigatório`,
    },
    salt: {
        type: String
    },
    provider: {
        type: String,
        required: `O campo 'provider' é obrigatório`,
        default: 'local'
    },
    providerId: String,
    providerData: {},
    created: {
        type: Date,
        default: Date.now
    }
});

UsersSchema.pre('save', function(next) {
    if (this.senha) {
        this.salt = new
            Buffer(crypto.randomBytes(16).toString('base64'), 'base64');
        this.senha = this.hashPassword(this.senha);
    }
    next();
});

UsersSchema.methods.hashPassword = function(password) {
    return crypto.pbkdf2Sync(password, this.salt, 10000,
        64).toString('base64');
};

UsersSchema.methods.authenticate = function(senha) {
    return this.senha === this.hashPassword(senha);
};

UsersSchema.statics.findUniqueUsername = function(email, suffix, callback) {
    let _this = this;
    let possibleUsername = email + (suffix || '');
    _this.findOne({
        senha: possibleUsername
    }, function(err, user) {
        if (!err) {
            if (!user) {
                callback(possibleUsername);
            } else {
                return _this.findUniqueUsername(email, (suffix || 0) +
                    1, callback);
            }
        } else {
            callback(null);
        }
    });
};
UsersSchema.set('toJSON', {
    getters: true,
    virtuals: true
});

mongoose.model('User', UsersSchema);