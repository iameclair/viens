const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs');

//email validator
let validEmailChecker = (email) => {
    if(!email){
        return false;
    }else {
        //use regex
        const regexp = new
        RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
        return regexp.test(email);
    }
};
//password validator
let validPasswordChecker = (password) => {
    if(!password) return false;
    const regex = new RegExp(/^(?=.*?[a-z])(?=.*?[A-Z])(?=.*?[\d])(?=.*?[\W]).{8,100}$/);
    return regex.test(password);
};
const emailValidators = [
    {
        validator: validEmailChecker,
        message: 'The email you have entered is invalid'
    }
];
const passwordValidators = [
    {
        validator: validPasswordChecker,
        message: "Password must contain at least 1 upper case and 1 special character and a number"
    }
];

const accountSchema = new Schema({
   fullName : {type: String, require:true},
   email: {type: String, require: true, unique: true, validate: emailValidators},
   password: {type: String, require: true, validate: passwordValidators},
   resetPasswordToken: {type: String, require: false},
   accountPermission: { type: Array, required: true, default: 'user'},
});

/**Create Miiddleware for schema to encrypt the password**/
accountSchema.pre('save', function (next){
    if(!this.isModified('password')) return next();

    //run the encryption
    bcrypt.hash(this.password, null, null, (err, hash) => {
        if(err) return next(err);
        this.password = hash;
        next();
    })
});

//decrypt the password
accountSchema.methods.comparePassword = function(password){
    return bcrypt.compareSync(password, this.password);
};


module.exports = mongoose.model('Account', accountSchema);