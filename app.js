/*
    SETUP
*/
// Express
var express = require('express');   // We are using the express library for the web server
var app = express();            // We need to instantiate an express object to interact with the server in our code

// app.js - SETUP section

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static(__dirname + '/public'));

PORT = 19434;                 // Set a port number at the top so it's easy to change in the future

// Database
var db = require('./database/db-connector')

// app.js

const { engine } = require('express-handlebars');
var exphbs = require('express-handlebars');     // Import express-handlebars
app.engine('.hbs', engine({ extname: ".hbs" }));  // Create an instance of the handlebars engine to process templates
app.set('view engine', '.hbs');                 // Tell express to use the handlebars engine whenever it encounters a *.hbs file.

// handlebars helper function for dates 
const hbs = exphbs.create({
    extname: ".hbs",
    helpers: {
        formatDate: function (date) {
            let dateObj = new Date(date)
            let month = dateObj.getMonth();
            month += 1; //because Jan = 0
            if (month < 10) month = '0' + month;
            let day = dateObj.getDate();
            if (day < 10) day = '0' + day;
            let year = dateObj.getFullYear();
            let newDate = month + '-' + day + '-' + year;
            return newDate;
        }
    }
});
app.engine('.hbs', hbs.engine);


/*
    ROUTES
*/

// app.js

app.get('/', function (req, res) {
    res.render('index');
});


///////////////////////////////////////////////////////////////////////////////////////
// Heroes routes
///////////////////////////////////////////////////////////////////////////////////////


app.get('/heroes', function (req, res) {
    let query1;                 // Define our query
    let query2 = "SELECT * FROM States";

    console.log(req.query)
    if (req.query.hero_name === undefined) {
        query1 = "SELECT * FROM Heroes;";
    }

    else {
        query1 = `SELECT * FROM Heroes WHERE hero_name LIKE "${req.query.hero_name}%"`
    }

    db.pool.query(query1, function (error, rows, fields) {        // Execute query
        let heroes = rows;

        db.pool.query(query2, function (error, rows, fields) {
            let states = rows;
            console.log(states)
            let statesmap = {}
            states.map(state => {
                let id = parseInt(state.state_id, 10);
                statesmap[id] = state['state_name']
            })

            heroes = heroes.map(hero => {
                return Object.assign(hero, { hero_state_id: statesmap[hero.hero_state_id] })
            })

            return res.render('heroes', { data: heroes, states: states });
        })
    })
});


app.post('/add-hero-ajax', function (req, res) {
    let data = req.body;

    console.log('add-hero-ajax')
    console.log(req.body);

    let hourly_rate = parseInt(data.hero_hourly_rate);
    if (isNaN(hourly_rate)) {
        hourly_rate = 'NULL'
    }

    //create the query
    query1 = `INSERT INTO Heroes (hero_name, hero_superpower, hero_hourly_rate, hero_state_id) 
    VALUES ('${data.hero_name}', '${data.hero_superpower}', ${hourly_rate}, '${data.hero_state}')`;

    db.pool.query(query1, function (error, rows, fields) {

        // Check to see if there was an error
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }
        else {
            query2 = "SELECT * FROM Heroes;";
            db.pool.query(query2, function (error, rows, fields) {
                if (error) {
                    console.log(error)
                    res.sendStatus(400);
                }
                else {
                    res.send(rows);
                }
            })
        }
    })
});


app.post('/add-hero-form', function (req, res) {
    let data = req.body;

    console.log(req.body);

    let hourly_rate = parseInt(data.hero_hourly_rate);
    if (isNaN(hourly_rate)) {
        hourly_rate = 'NULL'
    }

    //create the query
    query1 = `INSERT INTO Heroes (hero_name, hero_superpower, hero_hourly_rate, hero_state_id) 
    VALUES ('${data.hero_name}', '${data.hero_superpower}', ${hourly_rate}, '${data.hero_state}')`;

    db.pool.query(query1, function (error, rows, fields) {
        if (error) {
            console.log(error)
            res.sendStatus(400);
        }
        else {
            res.redirect('/heroes');
        }
    })
});

app.delete('/delete-hero', function (req, res, next) {
    let data = req.body;
    let heroId = parseInt(data.heroId);
    let deleteHero = `DELETE FROM Heroes WHERE hero_id = ?`;

    db.pool.query(deleteHero, [heroId], function (error, rows, fields) {
        if (error) {
            console.log(error);
            res.sendStatus(400);
        } else {
            res.sendStatus(204);
        }
    })
});

app.put('/put-hero-ajax', function (req, res, next) {
    let data = req.body;

    //UPDATE Heroes SET hero_name = hero_nameInput, hero_superpower = hero_superpowerInput, hero_hourly_rate = hero_hourly_rateInput, hero_state_id = hero_state_id_from_dropdown_Input;
    console.log('update hero route')
    console.log(data)

    let state = parseInt(data.hero_state);
    let hero_superpower = data.hero_superpower;
    let hero_hourly_rate = data.hero_hourly_rate;
    let hero_id = parseInt(data.hero_id);

    let queryUpdateState = `UPDATE Heroes SET hero_superpower = ?, hero_hourly_rate = ?, hero_state_id = ? WHERE Heroes.hero_id = ?`;
    let selectState = `SELECT * FROM States WHERE States.state_id = ?`

    // Run the 1st query
    db.pool.query(queryUpdateState, [hero_superpower, hero_hourly_rate, state, hero_id], function (error, rows, fields) {
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error);
            res.sendStatus(400);
        }

        // If there was no error, we run our second query and return that data so we can use it to update the people's
        // table on the front-end
        else {
            // Run the second query
            db.pool.query(selectState, [state], function (error, rows, fields) {

                if (error) {
                    console.log(error);
                    res.sendStatus(400);
                } else {
                    res.send(rows);
                }
            })
        }
    })
});



///////////////////////////////////////////////////////////////////////////////////////
// Customers routes
///////////////////////////////////////////////////////////////////////////////////////


app.get('/customers', function (req, res) {
    let query1 = "SELECT * FROM Customers;";               // Define our query
    let query2 = "SELECT * FROM States";
    let query3 = "SELECT * FROM Missions";

    db.pool.query(query1, function (error, rows, fields) {    // Execute the query
        let customers = rows;

        db.pool.query(query2, function (error, rows, fields) {
            let states = rows;

            console.log(states)
            let statesmap = {}
            states.map(state => {
                let id = parseInt(state.state_id, 10);
                statesmap[id] = state['state_name']
            })

            customers = customers.map(customer => {
                return Object.assign(customer, { customer_state_id: statesmap[customer.customer_state_id] })
            })

            return res.render('customers', { data: customers, states: states });
        })
    })
});

app.post('/add-customer-ajax', function (req, res) {
    let data = req.body;

    console.log('add-customer-ajax')
    console.log(req.body);

    //create the query
    query1 = `INSERT INTO Customers (customer_name, customer_phone_number, customer_email, customer_state_id)
    VALUES ('${data.customer_name}', '${data.customer_phone_number}', '${data.customer_email}', '${data.customer_state}')`;

    db.pool.query(query1, function (error, rows, fields) {

        // Check to see if there was an error
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }
        else {
            query2 = "SELECT * FROM Customers;";
            db.pool.query(query2, function (error, rows, fields) {
                if (error) {
                    console.log(error)
                    res.sendStatus(400);
                }
                else {
                    res.send(rows);
                }
            })
        }
    })
});

app.post('/add-customer-form', function (req, res) {
    let data = req.body;

    console.log(req.body);

    //create the query
    query1 = `INSERT INTO Customers (customer_name, customer_phone_number, customer_email, customer_state_id) 
    VALUES ('${data.customer_name}', '${data.customer_phone_number}', '${data.customer_email}', '${data.customer_state}')`;

    db.pool.query(query1, function (error, rows, fields) {
        if (error) {
            console.log(error)
            res.sendStatus(400);
        }
        else {
            res.redirect('/customers');
        }
    })
})

app.delete('/delete-customer', function (req, res, next) {
    let data = req.body;
    let customerID = parseInt(data.customer_id);
    let deleteCustomer = `DELETE FROM Customers WHERE customer_id = ?`;

    // Run the 1st query
    db.pool.query(deleteCustomer, [customerID], function (error, rows, fields) {
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error);
            res.sendStatus(400);
        }

        else {
            res.sendStatus(204);
        }

    })
});

app.put('/put-customer-ajax', function (req, res, next) {
    let data = req.body;

    //Update Customers SET customer_name = customer_nameInput, customer_phone_number = customer_phone_numberInput, customer_email = customer_emailInput, customer_state =customer_state_id_from_dropdown_Input;
    console.log('update customer route')
    console.log(data)

    let customer_state = parseInt(data.customer_state);
    let customer_phone_number = data.customer_phone_number;
    let customer_email = data.customer_email;
    let customer_id = parseInt(data.customer_id);

    let queryUpdateState = `UPDATE Customers SET customer_phone_number = ?, customer_email = ?, customer_state_id = ? WHERE Customers.customer_id = ?`;
    let selectState = `SELECT * FROM States WHERE States.state_id = ?`

    // Run the 1st query
    db.pool.query(queryUpdateState, [customer_phone_number, customer_email, customer_state, customer_id], function (error, rows, fields) {
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error);
            res.sendStatus(400);
        }

        // If there was no error, we run our second query and return that data so we can use it to update the people's
        // table on the front-end
        else {
            // Run the second query
            db.pool.query(selectState, [customer_state], function (error, rows, fields) {

                if (error) {
                    console.log(error);
                    res.sendStatus(400);
                } else {
                    res.send(rows);
                }
            })
        }
    })
});



///////////////////////////////////////////////////////////////////////////////////////
//States routes
///////////////////////////////////////////////////////////////////////////////////////


app.get('/states', function (req, res) {
    let query1 = "SELECT * FROM States;"

    db.pool.query(query1, function (error, rows, fields) {    // Execute the query
        let states = rows;

        return res.render('states', { data: states });
    })
});

app.post('/add-state-form', function (req, res) {
    let data = req.body;

    console.log(req.body);

    //create the query
    query1 = `INSERT INTO States (state_name)  
    VALUES ('${data.state_name}')`;

    db.pool.query(query1, function (error, rows, fields) {
        if (error) {
            console.log(error)
            res.sendStatus(400);
        }
        else {
            res.redirect('/states');
        }
    })
});

app.delete('/delete-state', function (req, res, next) {
    let data = req.body;
    let stateID = parseInt(data.state_id);
    let deleteState = `DELETE FROM States WHERE state_id = ?`;

    // Run the 1st query
    db.pool.query(deleteState, [stateID], function (error, rows, fields) {
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error);
            res.sendStatus(400);
        }

        else {
            res.sendStatus(204);
        }

    })
});


///////////////////////////////////////////////////////////////////////////////////////
// Missions routes
//////////////////////////////////////////////////////////////////////////////////////


app.get('/missions', function (req, res) {
    let query1;                 // Define our query
    let query2 = "SELECT * FROM Missions";

    console.log(req.query)
    if (req.query.hero_name === undefined) {
        query1 = "SELECT * FROM Missions;";
    }

    else {
        query1 = `SELECT * FROM Missions WHERE mission_type LIKE "${req.query.mission_type}%"`
    }

    db.pool.query(query1, function (error, rows, fields) {        // Execute query
        let missions = rows;

        return res.render('missions', { data: missions });
    })
});


app.post('/add-mission-ajax', function (req, res) {
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;

    console.log('add-mission-ajax')
    console.log(req.body);

    // Capture NULL values
    // no NULL values to capture 

    // Create the query and run it on the database
    query1 = `INSERT INTO Missions (mission_type, mission_description, mission_base_cost) VALUES ('${data.mission_type}', '${data.mission_description}', '${data.mission_base_cost}')`;
    db.pool.query(query1, function (error, rows, fields) {

        // Check to see if there was an error
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }
        else {
            // If there was no error, perform a SELECT * on bsg_people
            query2 = `SELECT * FROM Missions;`;
            db.pool.query(query2, function (error, rows, fields) {

                // If there was an error on the second query, send a 400
                if (error) {

                    // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                    console.log(error);
                    res.sendStatus(400);
                }
                // If all went well, send the results of the query back.
                else {
                    res.send(rows);
                }
            })
        }
    })
});

app.delete('/delete-mission', function (req, res, next) {
    let data = req.body;
    let missionID = parseInt(data.mission_id);
    let deleteMission = `DELETE FROM Missions WHERE mission_id = ?`;

    // Run the 1st query
    db.pool.query(deleteMission, [missionID], function (error, rows, fields) {
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error);
            res.sendStatus(400);
        }

        else {
            res.sendStatus(204);
        }

    })
});

app.put('/put-mission-ajax', function (req, res, next) {
    let data = req.body;

    console.log('update missions route')
    console.log(data)

    let mission_id = parseInt(data.mission_id);
    let mission_type = data.mission_type;
    let mission_description = data.mission_description;
    let mission_base_cost = data.mission_base_cost;

    let queryUpdateMission = `UPDATE Missions SET mission_type = ?, mission_description = ?, mission_base_cost = ? WHERE Missions.mission_id = ?`;

    // Run the 1st query
    db.pool.query(queryUpdateMission, [mission_type, mission_description, mission_base_cost, mission_id], function (error, rows, fields) {
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error);
            res.sendStatus(400);
        }

        // If there was no error, we run our second query and return that data so we can use it to update the people's
        // table on the front-end
        else {
            res.send(rows);
        }
    })
});

///////////////////////////////////////////////////////////////////////////////////////
// Hero Ratings routes
///////////////////////////////////////////////////////////////////////////////////////
app.get('/hero_ratings', function (req, res) {
    let query1 = "SELECT * FROM Hero_Ratings";
    let query2 = "SELECT * FROM Customers";               // Define our query
    let query3 = "SELECT * FROM Heroes";

    db.pool.query(query1, function (error, rows, fields) {    // Execute the query
        let hero_ratings = rows;

        db.pool.query(query2, function (error, rows, fields) {
            let customers = rows;

            console.log(customers)
            let customersmap = {}
            customers.map(customer => {
                let id = parseInt(customer.customer_id, 10);
                customersmap[id] = customer['customer_name']
            })

            hero_ratings = hero_ratings.map(hero_rating => {
                return Object.assign(hero_rating, { hero_rating_customer_id: customersmap[hero_rating.hero_rating_customer_id] })
            })

            db.pool.query(query3, function (error, rows, fields) {
                let heroes = rows;

                let heroesmap = {}
                heroes.map(hero => {
                    let id = parseInt(hero.hero_id, 10);
                    heroesmap[id] = hero['hero_name']
                })

                hero_ratings = hero_ratings.map(hero_rating => {
                    return Object.assign(hero_rating, { hero_rating_hero_id: heroesmap[hero_rating.hero_rating_hero_id] })
                })

                return res.render('hero_ratings', { data: hero_ratings, customers: customers, heroes: heroes });
            })

        })
    })
});


app.post('/add-hero-rating-ajax', function (req, res) {
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;

    console.log('add-hero-rating-ajax')
    console.log(req.body);

    // Capture NULL values
    // no NULL values to capture 

    // Create the query and run it on the database
    query1 = `INSERT INTO Hero_Ratings (hero_rating_date, hero_rating_stars, hero_rating_header, hero_rating_comments, hero_rating_customer_id, hero_rating_hero_id)
    VALUES ('${data.hero_rating_date}', '${data.hero_rating_stars}', '${data.hero_rating_header}', '${data.hero_rating_comments}', '${data.hero_rating_customer_name}', '${data.hero_rating_hero_name}')`;
    db.pool.query(query1, function (error, rows, fields) {

        // Check to see if there was an errord
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }
        else {
            // If there was no error, perform a SELECT * on bsg_people
            query2 = `SELECT * FROM Hero_Ratings;`;
            db.pool.query(query2, function (error, rows, fields) {

                // If there was an error on the second query, send a 400
                if (error) {

                    // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                    console.log(error);
                    res.sendStatus(400);
                }
                // If all went well, send the results of the query back.
                else {
                    res.send(rows);
                }
            })
        }
    })
});

app.delete('/delete-hero-rating', function (req, res, next) {
    let data = req.body;
    let heroRatingID = parseInt(data.hero_rating_id);
    let deleteHeroRating = `DELETE FROM Hero_Ratings WHERE hero_rating_id = ?`;

    // Run the 1st query
    db.pool.query(deleteHeroRating, [heroRatingID], function (error, rows, fields) {
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error);
            res.sendStatus(400);
        }

        else {
            res.sendStatus(204);
        }

    })
});


app.put('/put-hero-rating-ajax', function (req, res, next) {
    let data = req.body;

    console.log('update hero ratings route')
    console.log(data)

    let hero_rating_id = parseInt(data.hero_rating_id);
    let hero_rating_customer_id = parseInt(data.hero_rating_customer_id);
    let hero_rating_hero_id = parseInt(data.hero_rating_hero_id);
    let hero_rating_date = data.hero_rating_date;
    let hero_rating_stars = parseInt(data.hero_rating_stars);
    let hero_rating_header = data.hero_rating_header;
    let hero_rating_comments = data.hero_rating_comments;

    let queryUpdateHeroRatings = `UPDATE Hero_Ratings SET hero_rating_customer_id = ?, hero_rating_hero_id = ?, hero_rating_stars = ?, hero_rating_date = ?,
        hero_rating_header = ?, hero_rating_comments = ? WHERE Hero_Ratings.hero_rating_id = ?`;
    //let selectState = `SELECT * FROM States WHERE States.state_id = ?`

    // Run the 1st query
    db.pool.query(queryUpdateHeroRatings, [hero_rating_customer_id, hero_rating_hero_id, hero_rating_stars, hero_rating_date, hero_rating_header, hero_rating_comments, hero_rating_id], function (error, rows, fields) {
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error);
            res.sendStatus(400);
        }

        // If there was no error, we run our second query and return that data so we can use it to update the people's
        // table on the front-end
        else {
            res.send(rows);
        }
    })
});

/*
    LISTENER
*/
app.listen(PORT, function () {            // This is the basic syntax for what is called the 'listener' which receives incoming requests on the specified PORT.
    console.log('Express started on http://localhost:' + PORT + '; press Ctrl-C to terminate.')
});
