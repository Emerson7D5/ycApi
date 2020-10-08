const express = require('express');
//const dateFormat = require('dateformat');
const router = express.Router();

const pool = require('../database');
const { json } = require('express');



//select id, s.key, value from settings s where s.key = 'storeColor';

router.get('/', async(req, res) => {
    
    await pool.query('select id, s.key, value from settings s where s.key = "storeColor";', function(err, data){
        if (err){
            res.status(400).send(err);
        }
        else {
            
            res.status(200).send(data);
        }
    });

    
});


module.exports = router;