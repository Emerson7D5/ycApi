const express = require('express');
//const dateFormat = require('dateformat');
const router = express.Router();

const pool = require('../database');
const { json } = require('express');


router.post('/verifying_user', async (req, res) => {
    const { email } = req.body;


    await pool.query('call verifying_user(?)', [email], function(err, data){
        if (err){
            res.status(400).send(err);
        }
        else {
            res.status(200).send(data);
        }
    });
});

// select restaurant_id from restaurant_user ru where user_id = 10 limit 1;
router.post('/fetch_unique_restaurant', async (req, res) => {
    const { user_id } = req.body;


    await pool.query('select restaurant_id from restaurant_user ru where user_id = ? limit 1', [user_id], function(err, data){
        if (err){
            res.status(400).send(err);
        }
        else {
            res.status(200).send(data);
        }
    });
});


module.exports = router;
