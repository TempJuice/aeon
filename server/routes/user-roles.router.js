var express = require('express');
var router = express.Router();
var passport = require('passport');
var path = require('path');
var pool = require('../modules/pool.js');

router.get('/properties/:year', function (req, res) {
    // console.log('/properties/' + req.params.year);

    if (req.isAuthenticated()) {

        pool.connect(function (err, client, done) {

            if (err) {
                console.log('error connecting to db', err);
                res.sendStatus(500);
            } else {
                //query
                client.query('SELECT DISTINCT property FROM occupancy WHERE year=' + req.params.year + ' ORDER BY property;',
                    function (err, data) {
                        done();
                        if (err) {
                            console.log('query error', err);
                            res.sendStatus(500);
                        } else {
                            res.send(data.rows);
                        }
                    });
            }
        })
    } else {
        //not authorized
        res.sendStatus(403);
    }
});

router.put('/properties/deauth', function (req, res) {
    if (req.isAuthenticated()) {
        pool.connect(function(err,client,done){
            if(err){
                console.log('error connecting to db', err);
                res.sendStatus(500);
            } else {
                // query like DELETE FROM occupancy_users WHERE occupancy_property='chicago' AND user_id=2; 
                client.query('DELETE FROM occupancy_users WHERE occupancy_property=$1 AND user_id=$2;', [req.body.property, req.body.id], function(err,data){
                    done();
                    if(err){
                        console.log('query error', err);
                        res.sendStatus(500);
                    } else {
                        res.sendStatus(200);
                    }
                });
            }
        });
    } else {
        // not authorized
        res.sendStatus(403);
    }
});

router.put('/properties/auth', function (req, res) {
    console.log('/properties/auth', req.body.property, req.body.id);
    
    if (req.isAuthenticated()) {
        pool.connect(function(err,client,done){
            if(err){
                console.log('error connecting to db', err);
                res.sendStatus(500);
            } else {
                // query like INSERT INTO occupancy_users (occupancy_property, user_id) VALUES ('columbus', 2); 
                client.query('INSERT INTO occupancy_users (occupancy_property, user_id) VALUES ($1, $2);', [req.body.property, req.body.id], function(err,data){
                    done();
                    if(err){
                        console.log('query error', err);
                        res.sendStatus(500);
                    } else {
                        res.sendStatus(201);
                    }
                });
            }
        });
    } else {
        // not authorized
        res.sendStatus(403);
    }
});

router.get('/', function (req, res) {
    if (req.isAuthenticated()) {
        pool.connect(function (err, client, done) {
            if (err) {
                console.log('error connecting to db', err);
                res.sendStatus(500);
            } else {
                //query
                client.query('SELECT id, username, active, role FROM users ORDER BY username', function (err, data) {
                    done();
                    if (err) {
                        console.log('query error', err);
                    } else {
                        // now we need to get the users' authorized properties
                        var userData = data.rows;
                        client.query('SELECT * FROM occupancy_users', function (err, data) {
                            done();
                            if (err) {
                                console.log('query error', err);
                                res.sendStatus(500);
                            } else {
                                // data is the occupancy_users junction table
                                // loop through that whole table, pushing authorized properties into user objects

                                for (var i = 0; i < data.rows.length; i++) {

                                    var authorization = data.rows[i];

                                    // loop through user data, assign the property as a string when user_id is found
                                    for (var j = 0; j < userData.length; j++) {

                                        if (authorization.user_id == userData[j].id) {

                                            if (userData[j].properties == undefined) {
                                                userData[j].properties = [];
                                            }

                                            userData[j].properties.push(authorization.occupancy_property);
                                            continue;
                                        }

                                    }

                                    // var userDataIndex = userData.indexOf(authorization.user_id);
                                    // console.log('userDataIndex', userDataIndex);

                                    // if(userDataIndex != -1){
                                    //     if (userData[userDataIndex].properties == undefined){
                                    //         userData[userDataIndex].properties = [];                                            
                                    //     } else {
                                    //         userData[userDataIndex].properties.push(authorization.occupancy_property);
                                    //     }
                                    //     console.log('[userDataIndex].properties',                                             userData[userDataIndex].properties);

                                } // loop done, userData should now have all authorized property data
                                res.send(userData);
                            }
                        })
                    }
                });
            }
        });

    } else {
        // not authenticated
        res.sendStatus(403);
    }

}); // end GET route

// Update user active status
router.put('/active', function (req, res) {

    if (req.isAuthenticated()) {
        pool.connect(function (errDatabase, client, done) {
            if (errDatabase) {
                console.log('Error connecting to database', errDatabase);
                res.sendStatus(500);
            } else {
                client.query('UPDATE users SET active=$1 WHERE username=$2;', [
                        req.body.active,
                        req.body.username
                    ],
                    function (errQuery, data) {
                        done();
                        if (errQuery) {
                            console.log('Error making database query', errQuery);
                            res.sendStatus(500);
                        } else {
                            res.sendStatus(201);
                        }
                    });
            }
        });
    }
});

// Update user role
router.put('/role', function (req, res) {

    if (req.isAuthenticated()) {
        pool.connect(function (errDatabase, client, done) {
            if (errDatabase) {
                console.log('Error connecting to database', errDatabase);
                res.sendStatus(500);
            } else {
                client.query('UPDATE users SET role=$1 WHERE username=$2;', [
                        req.body.role,
                        req.body.user.username
                    ],
                    function (errQuery, data) {
                        done();
                        if (errQuery) {
                            console.log('Error making database query', errQuery);
                            res.sendStatus(500);
                        } else {
                            res.sendStatus(201);
                        }
                    });
            }
        });
    }
});

module.exports = router;