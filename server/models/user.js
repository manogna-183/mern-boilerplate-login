const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const saltRounds = 10;

const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
    firstname: {
        type: String,
        maxlength: 50
    },
    email: {
        type: String,
        unique: 1,
        trim: true
    },
    password: {
        type: String,
        minlength: 5
    },
    lastname: {
        type: String,
        maxlength: 50
    },
    role: {
        type: Number,
        default: 0
    },
    token: {
        type: String,
    },
    tokenExp: {
        type: Number
    }
});

userSchema.pre('save', function (next) {
    let user = this;

    if (this.isModified('password') || this.isNew) {
        bcrypt.genSalt(10, (err, salt) => {
            if (err) return next(err);

            bcrypt.hash(user.password, salt, (err, hash) => {
                if (err) return next(err);

                user.password = hash;
                next();
            });
        });
    } else {
        next();
    }
});


userSchema.methods.comparePassword = function(plainPassword, cb){
    bcrypt.compare(plainPassword, this.password, function(err, isMatch){
        if(err) return cb(err);
        cb(null, isMatch);
    });
};

userSchema.methods.generateToken = function(cb){
    var user = this;
    var token =jwt.sign(user._id.toHexString(), 'secret');

    user.token = token;
    user.save(function(err, user){
        if(err) return cb(err);
        cb(null, user);
    });
}

userSchema.statics.findByToken = function(token, cb){
    var user = this;

    jwt.verify(token, "secret", function(err, decode){
        user.findOne({"_id": decode, "token": token}, function(err, user){
            if(err) return cb(err);
            cb(null, user);
        });
    });
}

//Logout clear token
const User = mongoose.model("user", userSchema);

module.exports = {User};
