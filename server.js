/* ============================================
    Import Node Modules
 ==============================================*/
const express = require('express');
const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const router = express.Router();
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const config = require('./config/database');
const path = require('path');
const bodyParser = require('body-parser');
const logger = require('morgan');
const cookieparser = require('cookie-parser');

/*==================================================================
    database connection
 ===================================================================*/
mongoose.Promise = global.Promise;
mongoose.connect(config.uri, (err) =>{
    if (err) {
        console.log('Could not connect to the database: ', err);
    }else {
        console.log('Connected to database: ', config.db);
}
});
/*==================================================================
 middle ware
 ===================================================================*/
app.use(cors({
    origin: 'http://localhost:4200',
    credentials: true
}));
app.use(logger('env'));
app.use(bodyParser.urlencoded({ extended: false}));
app.use(bodyParser.json());
app.use(cookieparser());
app.use(require('express-session')({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(__dirname + '/public/dist/'));
/*==================================================================
 connect server to angular
 ===================================================================*/
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname + '/client/dist/index.html'));
});
/*==================================================================
 Connect to local server
 ===================================================================*/
app.listen(8080, ()=> {
    console.log('Listening on port 8080');
});

