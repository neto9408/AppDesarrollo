var mongoose = require("mongoose");
var bycrypt = require("bcrypt-nodejs");
var userSchemea = mongooseSchema(
    {
        local:{
        email: String,
        password :String

    },
    facebook:{
        id: String,
        toke: String,
        email: String,
        name: String
    }
    }
);
userSchemea.methods.validPassword = function(password){
return bcrypt.compareSync(password, this.local.password);
};
userSchemea.methods.hashPassword = function(password){
var user = this;
bycrypt.hash(password,null,null,function(err, hash){
if(err)
return next(err);
user.local.password = hash;
});
};
module.exports = mongoose.model('User',userSchemea);