const express = require('express');
const morgan = require('morgan');

//initializations
const app = express();

//settings
app.set('port', process.env.PORT || 4000);

//Middlewares
app.use(morgan('dev'));
app.use(express.urlencoded({extended: false}));
app.use(express.json());

//Global Variables
app.use((req, res, next) => {
    next();
});

//Routes
app.use('/order_header', require('./routes/orders/order_header'));
app.use('/settings', require('./routes/settings'));
app.use('/restaurant', require('./routes/restaurant'));
app.use('/users', require('./routes/users'));
app.use('/tokens', require('./routes/tokens'));

//Public


//Starting the server
app.listen(app.get('port'), ()=>{
    console.log('Server on port ', app.get('port'));
});
