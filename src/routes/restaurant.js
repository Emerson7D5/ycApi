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


module.exports = router;
