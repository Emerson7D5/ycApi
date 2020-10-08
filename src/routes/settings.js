const express = require('express');
//const dateFormat = require('dateformat');
const router = express.Router();

const pool = require('../database');
const { json } = require('express');



//select id, s.key, value from settings s where s.key = 'storeColor';

router.get('/', async(req, res) => {
    
    await pool.query('call fetchDataSettings()', function(err, data){
        if (err){
            res.status(400).send(err);
        }
        else {
            let colorStore = '';
            let loginTitle = '';
            let loginEmailLabel = '';
            let loginPasswordLabel = '';
            let emailPassDoNotMatch = '';

            data[0].forEach(element => {
                if (element.key === 'storeColor'){
                    colorStore = element.value;
                }
                else if (element.key === 'loginLoginTitle'){
                    loginTitle = element.value;
                }
                else if (element.key === 'loginLoginEmailLabel'){
                    loginEmailLabel = element.value;
                }
                else if (element.key === 'loginLoginPasswordLabel'){
                    loginPasswordLabel = element.value;
                }
                else if(element.key === 'emailPassDonotMatch'){
                    emailPassDoNotMatch = element.value;
                }
            });

            send = {
                storeColor: colorStore, 
                lblTitle: loginTitle, 
                lblEmail: loginEmailLabel, 
                lblPassword: loginPasswordLabel, 
                errorEmailPass: emailPassDoNotMatch
            }
            
            res.status(200).send(send);
        }
    });

    
});


module.exports = router;