/* ============================================
    Import Node Modules
 ==============================================*/
const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const router = express.Router();
const cors = require('cors');
const mongoose = require('mongoose');
const config = require('./config/config');
const path = require('path');
const account = require('./routes/account')(router);
/*==================================================================
    database connection
 ===================================================================*/

mongoose.Promise = global.Promise;
if(process.env.NODE_ENV === 'test'){
    mongoose.connect(config.test_uri, (err) => {
        if (err) {
            console.log('Could not connect to the database: ', err);
        }else {
            console.log('Connected to database: ', config.test_db);
        }
    });
}else{
    mongoose.connect(config.db_uri, (err) =>{
        if (err) {
            console.log('Could not connect to the database: ', err);
        }else {
            console.log('Connected to database: ', config.db);
        }
    });
}

/*==================================================================
 middle ware
 ===================================================================*/
app.use(cors({
    origin: 'http://localhost:4200',
    credentials: true
}));
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: false}));
app.use(bodyParser.json());
app.use(express.static(__dirname + '/public/dist/'));
app.use('/account', account);
/*==================================================================
 connect server to angular
 ===================================================================*/
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname + '/client/dist/index.html'));
});
/*==================================================================
 Connect to local server
 ===================================================================*/
app.listen(config.port, ()=> {
    console.log('Listening on port 8080');
});

