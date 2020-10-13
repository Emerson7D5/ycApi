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

    let returning = [];

    returning = {
      _id: new_order[0][0]._id,
      order_code: new_order[0][0].order_code,
      user_fullname: new_order[0][0].user_fullname,
      address_name: new_order[0][0].address_name,
      order_creation_date: new_order[0][0].order_creation_date,
      items_detail: items_detail_new_order[0]
    }

    res.send(returning);

});

module.exports = router;
