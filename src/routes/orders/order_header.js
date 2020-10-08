const express = require('express');
//const dateFormat = require('dateformat');
const router = express.Router();

const pool = require('../../database');
const { json } = require('express');

//Este metodo es el nuevo que recibira react native para mostrar los pedidos nuevos o en proceso...
router.get('/headers/:id', async(req, res) => {
    const { id } = req.params;

    await pool.query('call new_order_header_by_store(?)', [id], function(err, data){
        if (err){
            res.status(400).send(err);
        }
        else {
            
            let cuenta = 0;

            data[0].forEach(element => {

                cuenta++;
            });

            let suma = 0;
            let elements = [];

            for (let i=1; i <= cuenta; i++) {
                
                let creationDate = data[0][suma].order_creation_date;
                let aceptationDate = data[0][suma].order_aceptation_date;


                elements[suma] = {
                    _id: data[0][suma].order_id,
                    order_code: data[0][suma].order_code,
                    order_user_detail: {
                        order_customer_id: data[0][suma].order_customer_id,
                        user_fullname: data[0][suma].user_fullname,
                    },

                    order_creation_date: creationDate,
                    order_aceptation_date: aceptationDate,
                    order_current_status: data[0][suma].order_status_name,
                
                };


                suma++;
            }

            res.status(200).send(elements);
        }
    });
});



// order_header_by_store_record
//Este metodo es el nuevo que recibira react native para mostrar los pedidos de historial...
router.get('/headers_record/:id', async(req, res) => {
    const { id } = req.params;
    await pool.query('call order_header_by_store_record(?)', [id], function(err, data){
        if (err){
            res.status(400).send(err);
        }
        else {
            
            let cuenta = 0;

            data[0].forEach(element => {

                cuenta++;
            });

            let suma = 0;
            let elements = [];

            for (let i=1; i <= cuenta; i++) {
                
                let creationDate = data[0][suma].order_creation_date;
                let aceptationDate = data[0][suma].order_aceptation_date;
                let doneDate = data[0][suma].order_done_date;
                let checkoutDate = data[0][suma].order_checkout_date ;
                let deliveryDate = data[0][suma].order_delivery_date;


                elements[suma] = {
                    _id: data[0][suma].order_id,
                    order_code: data[0][suma].order_code,
                    order_user_detail: {
                        order_customer_id: data[0][suma].order_customer_id,
                        user_fullname: data[0][suma].user_fullname,
                    },

                    order_creation_date: creationDate,
                    order_aceptation_date: aceptationDate,
                    order_done_date: doneDate,
                    order_checkout_date: checkoutDate,
                    order_delivery_date: deliveryDate,
                    order_current_status: data[0][suma].order_status_name,
                
                };



                suma++;
            }

            res.status(200).send(elements);
        }
    });

    
});


module.exports = router;