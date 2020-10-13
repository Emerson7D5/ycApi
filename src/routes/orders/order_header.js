const express = require('express');
//const dateFormat = require('dateformat');
const router = express.Router();

const pool = require('../../database');
const { json } = require('express');

//Este metodo es el nuevo que recibira react native para mostrar los pedidos nuevos o en proceso...
router.get('/open_orders/:id', async(req, res) => {
    const { id } = req.params;
    await pool.query('call open_orders(?)', [id], function(err, data){
        if (err){
            res.status(400).send(err);
        }
        else {
            res.status(200).send(data);
        }
    });


});


//Este metodo es el nuevo que recibira react native para mostrar los pedidos de historial...
router.get('/record_orders/:id', async(req, res) => {
    const { id } = req.params;
    await pool.query('call record_orders(?)', [id], function(err, data){
        if (err){
            res.status(400).send(err);
        }
        else {
            res.status(200).send(data);
        }
    });
});


router.get('/detail_new_order/:id', async(req, res) => {
    const { id } = req.params;
    const new_order = await pool.query('call detail_new_order(?)', [id]);
    const items_detail_new_order = await pool.query('call items_detail_new_order(?)', [id]);
    const delivery_data = await pool.query('call fetching_delivery_data(?)', [new_order[0][0].restaurant_id]);

    let returning = [];

    returning = {
      _id: new_order[0][0]._id,
      order_code: new_order[0][0].order_code,
      user_fullname: new_order[0][0].user_fullname,
      address_name: new_order[0][0].address_name,
      order_creation_date: new_order[0][0].order_creation_date,
      items_detail: items_detail_new_order[0],
      delivery_data: delivery_data[0]
    }

    res.send(returning);

});


router.post('/change_to_accepted', async (req, res) => {
    const { id_order } = req.body;


    await pool.query('call change_to_accepted(?)', [id_order], function(err){
        if (err){
            res.status(400).send(err);
        }
        else {
            res.status(200).send('Status updated.');
        }
    });
});




router.post('/change_to_delivery_assigned', async (req, res) => {
    const { id_order, id_delivery } = req.body;


    await pool.query('call change_to_delivery_assigned(?, ?)', [id_order, id_delivery], function(err){
        if (err){
            res.status(400).send(err);
        }
        else {
            res.status(200).send('Status updated.');
        }
    });
});



router.post('/change_to_canceled', async (req, res) => {
    const { id_order } = req.body;


    await pool.query('call change_to_canceled(?)', [id_order], function(err){
        if (err){
            res.status(400).send(err);
        }
        else {
            res.status(200).send('The order was canceled.');
        }
    });
});


module.exports = router;
