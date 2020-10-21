const express = require('express');
//const dateFormat = require('dateformat');
const router = express.Router();

const pool = require('../database');
const { json } = require('express');


router.post('/save_token', async (req, res) => {
    const { token, user_id } = req.body;


    await pool.query('update users set remember_token = ? where id = ?', [token, user_id], function(err, data){
        if (err){
            res.status(400).send(err);
        }
        else {
            res.status(200).send("Updated");
        }
    });
});

module.exports = router;
