/*import modules*/
const Account = require('../models/account');
const jwt = require('jsonwebtoken');
const config = require('../config/config');

module.exports = (router) => {

    /*create an account*/

    router.post('/register', (req, res) => {
        /*construct the new user account*/
        const user = new Account();
        user.fullName = req.body.fullName.toLowerCase();
        user.email = req.body.email.toLowerCase();
        user.password = req.body.password;
        user.save(err =>{
            if(err){
                res.json({success:false, message: err});
            }else{
                res.json({success: true, message: 'account created successfully'});
            }
        })
    });

    /*login in the account*/

    router.post('/login', (req, res) => {
        Account.findOne({email: req.body.email}, (err, account)=> {
            if(err){
                /*return the error*/
                res.json({success: false, message:err})
            }else if(!account){
                /*account not found invalid email*/
                res.json({success: false, message: 'account with that email is not found'})
            }else{ /*found user check if password is correct*/
                const isPasswordValid = account.comparePassword(req.body.password);
                if(!isPasswordValid){ /*if password is not valid*/
                    res.json({success:false, message: 'invalid password'})
                }else{ /*password is valid*/
                    const payload = {accountId: account._id};
                    const secret = config.secret;
                    const token = jwt.sign(payload, secret, {expiresIn: 60 * 168 });

                    /*return the account*/
                    res.json({
                        success: true,
                        message: 'logged in successfully',
                        token: token,
                        account: account
                    })
                }
            }
        });
    });

    /*reset account password*/

    router.put('/reset-password', (req, res) =>{
        Account.findOne({email: req.body.email}, (err, account) =>{
            if(err){
                throw err
            }else{
                if(!account){
                    res.json({success: false, message:'email not found!'})
                }else{
                    /*send a reset password token to user*/
                    account.resetPasswordToken = jwt.sign(
                        {accountID: account._id}, config.secret, {expiresIn: 60 * 60}
                    );
                    /*save modified user to database*/
                    /*send email to account*/
                }
            }
        })
    });

    router.put('/reset-password', (req, res) =>{

    });

    /*get all the account*/

    router.get('/get-accounts', (req, res) => {
        Account.find((err, accounts) => {
           if(err) throw err;
           res.json({success: true, results: accounts});
        });
    });

    /*get account by id*/
    router.get('/get-account/:id', (req, res) => {
        Account.findById(req.params.id, (err, account) => {
            if(err) throw err;
            if(!account){
                res.json({success: false, message: "account does not exist"});
            } else{
                res.json({success: true, account: account});
            }
        });
    });

    /*delete account by id*/
    router.delete('/delete-account/:id', (req, res) => {
       Account.findByIdAndRemove(req.params.id, (err, account) =>{
           if(err) throw err;
           if(!account){
               res.json({success: false, message: "account does not exist"});
           } else{
               res.json({success: true, message: 'account deleted!'})
           }
        });
    });

    return router;
};