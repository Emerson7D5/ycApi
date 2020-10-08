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
// app.use('/services', require('./routes/services'));
// app.use('/account', require('./routes/account'));
// app.use('/manage_store_tokens', require('./routes/manage_store_tokens'));
// app.use('/new_order', require('./routes/orders/new_order'));
// app.use('/users', require('./routes/users'));

//Public


//Starting the server
app.listen(app.get('port'), ()=>{
    console.log('Server on port ', app.get('port'));
});