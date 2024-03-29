const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

//To remove ORDERS from RESTAPI, simply delete const(ORDerS) and app.use(ORDERS)
const contactRoutes = require('./api/routes/contacts');
const orderRoutes = require('./api/routes/orders');

mongoose.connect('mongodb+srv://mateusceasar:agendatelpassword@agendatel-xtbii.azure.mongodb.net/test?retryWrites=true&w=majority', 
{
     useNewUrlParser: true
});

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use((req,res,next) =>{
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
    "Acess-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    if (req.method === 'OPTIONS') {
        res.header('Access=Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({});    
    }
    next();
});

//Routes handling requests
app.use('/contacts', contactRoutes);
app.use('/orders', orderRoutes);

app.use ((req, res, next) => {
    const error = new Error('not found');
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) =>{
    res.status(error.status ||500);
    res.json({
        error: {
            message: error.message
        }
    });
});

module.exports = app
