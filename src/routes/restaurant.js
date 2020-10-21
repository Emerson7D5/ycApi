const express = require('express');
//const dateFormat = require('dateformat');
const router = express.Router();

const pool = require('../database');
const { json } = require('express');



router.get('/:id', async(req, res) => {
    const { id } = req.params;
    await pool.query('select is_active as restaurant_status, name as restaurant_name, image as restaurant_img from restaurants where id = ?', [id], function(err, data){
        if (err){
            res.status(400).send(err);
        }
        else {
            res.status(200).send(data);
        }
    });


});

// fetching_information_store
router.get('/information/:id', async(req, res) => {
    const { id } = req.params;
    await pool.query('call fetching_information_store(?)', [id], function(err, data){
        if (err){
            res.status(400).send(err);
        }
        else {
            res.status(200).send(data);
        }
    });
});

// Getting all the stores from an specific user...
router.get('/all_stores_by_user/:id', async(req, res) => {
    const { id } = req.params;
    let detail = [];
    await pool.query('call all_stores_by_user(?)', [id], function(err, data){
        if (err){
            res.status(400).send(err);
        }
        else {
            res.status(200).send(data);
        }
    });
});


// Getting all the items by restaurant...
router.get('/items_by_restaurant/:id', async(req, res) => {
    const { id } = req.params;
    await pool.query('call items_by_restaurant(?)', [id], function(err, data){
        if (err){
            res.status(400).send(err);
        }
        else {
            res.status(200).send(data);
        }
    });
});



// Getting all the item categories...
router.get('/item_categories/:id', async(req, res) => {
    const { } = req.params;
    await pool.query('call item_categories()', function(err, data){
        if (err){
            res.status(400).send(err);
        }
        else {
            res.status(200).send(data);
        }
    });
});


// Changing the item status...
router.post('/change_item_status', async (req, res) => {
    const { id_item, status } = req.body;


    await pool.query('update items set is_active = ? where id = ?', [status, id_item], function(err, data){
        if (err){
            res.status(400).send(err);
        }
        else {
            res.status(200).send("Updated");
        }
    });
});


module.exports = router;
