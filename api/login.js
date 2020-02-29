const express = require('express');
const router = express.Router();

var db;
require('./db').connection.then(connector => db = connector.db);

var jwt = require('jsonwebtoken');
const secret = process.env.SECRET || 'devtest';

router.post('/', (req, res) => {

    // console.log("Authenticating '"+req.body.username+"'");

    var username = req.body.username;
    var password = req.body.password;

    //Find the user in the DB
    db.collection('users').findOne(
        {
            username: username
        }
    ).then(doc =>{

        //When we find him, check if the password in the request, and the password in the DB match
        if(doc && doc.password == password){
            console.log("Authorized "+username+" with level "+doc.rights);

            //If they do, send the token
            jwt.sign(
                { rights: doc.rights, username: username }
                , secret, (err, token) => {
                    if(err){
                        console.log(err);
                        res.sendStatus(500);
                    } else {
                        res.send({
                            userData: {
                                username: doc.username,
                                email: doc.email,
                                name: doc.name,
                                rights: doc.rights
                            },
                            token
                        });
                    }
            });

        } else {
            console.log("Unauthorized access by "+username);
            res.sendStatus(403);
        }

    }).catch(err => {
        console.log(err);
        return false;
    });
});



module.exports = router;
