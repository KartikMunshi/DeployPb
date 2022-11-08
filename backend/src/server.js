import app from './app';

const express       = require('express')
const bodyParser    = require('body-parser');
var cors = require('cors')
const app           = express();
// const port          = 3000;

app.use(cors());
app.options('*', cors());

app.use(function (req, res, next) {
    //Enabling CORS
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, x-client-key, x-client-token, x-client-secret, Authorization");
      next();
    });


app.listen(3333);