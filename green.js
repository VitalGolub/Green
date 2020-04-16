var express = require('express');
let app = express();
let bodyParser = require('body-parser');
let session = require('express-session');
let uuid = require('uuid/v1');
let sqlite3 = require('sqlite3').verbose();
let bcrypt = require('bcrypt-nodejs');

//node js middleware
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// pug
app.set('views', __dirname + '/views');
app.set('view engine', 'pug');

// session tracking
app.use(session({
    genid: (request) => { return uuid(); },
    resave: false,
    saveUninitialized: false,
    // cookie: { secure: true},
    secret: 'apollo slackware prepositional expectations',
}));

//sets up database for green
let db = new sqlite3.Database('./data/green.db', (error) => {
    if (error) {
        console.log("Error connecting to database");
        return;
    }

    console.log('Connected to the SQLite database');
});

//Setup database tables
db.serialize(() => {

    //Create a users table that keeps track of basic user information
    db.run(`CREATE TABLE IF NOT EXISTS users(
        username TEXT PRIMARY KEY,
        firstname TEXT,
        lastname TEXT,
        email TEXT,
        dateOfBirth DATE,
        password VARCHAR(255),
        phoneNumber TEXT,
        country TEXT,
        address TEXT
    )`);

    //Create a table that store the budget values for different categories
    db.run(`CREATE TABLE IF NOT EXISTS budgets(
        username TEXT PRIMARY KEY,
        entertainment REAL DEFAULT 0,
        education REAL DEFAULT 0,
        health REAL DEFAULT 0,
        groceries REAL DEFAULT 0,
        restaurants REAL DEFAULT 0,
        utilities REAL DEFAULT 0,
        auto REAL DEFAULT 0,
        gifts REAL DEFAULT 0,
        investments REAL DEFAULT 0
    )`);

    //Keeps track of user expenses
    db.run(`CREATE TABLE IF NOT EXISTS expenses(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL,
        date DATE,
        amount REAL,
        category TEXT,
        description TEXT
    )`);
    
    //Create a table for users current goal progress
    db.run(`CREATE TABLE IF NOT EXISTS goalProgress(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL,
        amount REAL,
        category TEXT
    )`);


    //Create a table to show current goal values for a user
    db.run(`CREATE TABLE IF NOT EXISTS goals(
        username TEXT PRIMARY KEY,
        travel REAL DEFAULT 0,
        car REAL DEFAULT 0,
        education REAL DEFAULT 0,
        home REAL DEFAULT 0,
        homeImprovement REAL DEFAULT 0,
        retirement REAL DEFAULT 0,
        creditcard REAL DEFAULT 0,
        loans REAL DEFAULT 0,
        emergency REAL DEFAULT 0
    )`);
});

//when no endpoint is entered the screen will default to the login page
app.get('/' , (request,response) => {
	response.render('login');
});

//When login is the endpoint
app.get('/login' , (request,response) => {

    //If you are already logged on, redirect to home page
    if(isActiveSession(request)){
        response.redirect('home');
        return;
    }

    response.render('login');
});

//When login post process is called
app.post('/login', (request, response) => {
    //Grab the username and password that the user entered
    let username = request.body.username;
    let password = request.body.password;   

    //Get the row from users given a username
    db.get(`SELECT * FROM users WHERE username = "${username}"`, (err, row) => {
        if (err) {
            return;
        }
        if(row != null){
            //Check the password using the bcrpt hashing
            if (bcrypt.compareSync(password, row.password)) {

                //If the passwords match, set the session user and redirect them to home
                request.session.user = username;
                console.log(`Successful login: ${username}`);
                response.redirect('home');
            }
            else {
                // login failed, hashed passwords don't match
                console.log(`Login failed: ${username}`);
                response.render('login', {
                    result: 'error',
                    
                });
            }
        } else {
            // login failed, user does not exist in the database
            console.log(`Login failed: ${username}`);
            //response.redirect('login');
			response.render('login', {
				result: 'error',
				
			});
        }
    });
});

//Process a singup request
app.post('/processSignup', (request, response) => {

    //Save the username we will need to use it in other locations
    var username = request.body.username;

    //Find row given a username
    db.get(`SELECT * FROM users WHERE username = "${username}"`, (err, row) => {
        if (err) {
            return;
        }
        //If the row exists redirect them back to signup because the username already exists
        if(row != null){
            response.redirect('signup');
            console.log(`${username} already exists`);
            return;
        }
        //If there is no user with that name registered start the registration 
        else {
            
            //If the passwords don't match redirect them to signup again
            if(request.body.pass != request.body.cpass){
                response.redirect('signup');
                console.log(`Passwords do not match`);
                return;
            }

            //Create a bunch of variables for the information we get from the signup pug
            var firstname = request.body.firstName;
            var lastname = request.body.lastName;
            var email = request.body.email;
            var dob = request.body.dateOfBirth;
            //hash the passwords
            var pass = bcrypt.hashSync(request.body.pass);
            var phoneNumber = request.body.phoneNumber;
            var country = request.body.country;
            var address = request.body.address;
            
            //Add all of the information into the users table
            db.run('INSERT OR IGNORE INTO users (username, firstname, lastname, email, dateOfBirth, password, phoneNumber, country, address) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
                [username, firstname, lastname, email, dob, pass, phoneNumber, country, address], function(error) {

                if (error) {
                    console.error(error.message);
                    return;
                }
            });


            //Save all of the budget values making sure that is is a number
            var entertainment = isNaN(request.body.entertainment) ? 0 : request.body.entertainment;
            var education = isNaN(request.body.education) ? 0 : request.body.education;
            var health = isNaN(request.body.health) ? 0 : request.body.health;
            var groceries = isNaN(request.body.groceries) ? 0 : request.body.groceries;
            var restaurants = isNaN(request.body.restaurants) ? 0 : request.body.restaurants;
            var utilities = isNaN(request.body.utilities) ? 0 : request.body.utilities;
            var auto = isNaN(request.body.auto) ? 0 : request.body.auto;
            var gifts = isNaN(request.body.gifts) ? 0 : request.body.gifts;
            var investments = isNaN(request.body.investments) ? 0 : request.body.investments;

            //Add the budget values into the budgets table
            db.run('INSERT OR IGNORE INTO budgets (username, entertainment, education, health, groceries, restaurants, utilities, auto, gifts, investments) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
                [username, entertainment, education, health, groceries, restaurants, utilities, auto, gifts, investments], function(error) {

                if (error) {
                    console.error(error.message);
                    return;
                }
            });

            //Create a goals entry for the user with default values
            db.run('INSERT OR IGNORE INTO goals (username) VALUES (?)',
                [username], function(error) {

                if (error) {
                    console.error(error.message);
                    return;
                }

             });

            //If everything was successful redirect them to login
            response.redirect('login');
            console.log(`${username} successfully registered`);
        }
    });
});

//Render the signup pug
app.get('/signup' , (request,response) => {
	response.render('signup');
});

//Render the transactions pug
app.get('/transactions' , (request,response) => {

    //If you're not logged in redirect them to the login page
    if(!isActiveSession(request)){
        response.redirect('login');
        return;
    }

	response.sendFile(__dirname + '/public/transactions.html')
});

//Render the goals pug
app.get('/goals' , (request,response) => {
    //If you're not logged in redirect them to the login page
    if(!isActiveSession(request)){
        response.redirect('login');
        return;
    }

	response.render('goals');
});

//Render the new html
app.get('/news' , (request,response) => {
    //If you're not logged in redirect them to the login page
    if(!isActiveSession(request)){
        response.redirect('login');
        return;
    }

    response.sendFile(__dirname + '/public/news.html')

});

//Render the aboutUs.html
app.get('/aboutUs' , (request,response) => {
    //If you're not logged in redirect them to the login page
    if(!isActiveSession(request)){
        response.redirect('login');
        return;
    }

	response.sendFile(__dirname + '/public/aboutUs.html')
});

//Render the homepage.html
app.get('/home' , (request,response) => {
    //If you're not logged in redirect them to the login page
    if(!isActiveSession(request)){
        response.redirect('login');
        return;
    }

    response.sendFile(__dirname + '/public/homepage.html')

});

//Logout and clear the session user and redirect them to login
app.get('/logout' , (request,response) => {
    request.session.user = '';
    response.redirect("login");
});

//API call to grab all of the user expenses from the expenses table
//Provides an array of json objects
app.post('/api/getUserExpenses', (req,res) => {
    let data = JSON.parse(JSON.stringify(req.body));

    db.all(`SELECT username, date, amount, category, description FROM expenses WHERE username = "${data.username}" AND date >= "${data.from}" AND date <= "${data.to}" ORDER BY date DESC`, (err, rows) => {
        if (err) {
            throw err;
        }

        console.log(rows);
        res.send(rows);
    });
});

//API call to get all expenses in the table
//Provides an array of json objects
app.get('/api/getExpenses', (req,res) => {

    db.all(`SELECT username, date, amount, category, description FROM expenses`, (err, rows) => {
        if (err) {
            throw err;
        }

        res.send(rows);
    });
});

//API call to get all of the users from the database, return an array of json objects
app.get('/api/getUsers', (req,res) => {

    db.all(`SELECT * FROM users`, (err, rows) => {
        if (err) {
            throw err;
        }

        res.send(rows);
    });
});


//API add an expense into the expenses table
//Takes a json array with a username, category, amount, description and date in a json object
app.post('/api/addExpense', (req,res) => {
    let data = JSON.parse(JSON.stringify(req.body));

    //Grab the data and store it in variables
    let user = data.username;
    let category = data.category;
    let amount = data.amount;
    let description = data.description;
    let date = data.date;

    //Insert the values into the database
    db.run('INSERT INTO expenses (username, date, amount, category, description) VALUES (?, ?, ?, ?, ?)',
                    [user, date, amount, category, description], function(error) {
        if (error) {
            console.error(error.message);
            return;
        }
    });
});


//API call to get the currently connected session username
app.get('/api/getSessionUser', function(req, res) {
    //Check if the session exists
    if (req.session && req.session.user) {
        let user = req.session.user;
        res.send(user);
    } else {
        res.send("Invalid-User");
    }
});


//API call to get all of the buedgets for a user
//Returns a json object with a format of category:amount
app.post('/api/getUserBudgets', function(req, res) {
    let data = JSON.parse(JSON.stringify(req.body));

    db.all(`SELECT * FROM budgets WHERE username = "${data.username}"`, (err, rows) => {
        if (err) {
            throw err;
        }

        res.send(rows);
    });
});


//API call to set a budget in a specific category for a user
//Takes a json with a username, category and amount
app.post('/api/setUserBudget', function(req, res) {
    let data = JSON.parse(JSON.stringify(req.body));

    let user = data.username;
    let category = data.category;
    let amount = data.amount;

    db.run(`UPDATE budgets SET ${category}=? WHERE username=?`,[amount, user], function(error) {
        if (error) {
            console.error(error.message);
            return;
        }
    });
});


//API call to set the goal values for a user
//Takes a json object containing username, category and amount
app.post('/api/setGoal', function(req, res) {
    let data = JSON.parse(JSON.stringify(req.body));

    let user = data.username;
    let category = data.category;
    let amount = data.amount;

    db.run(`UPDATE goals SET ${category}=? WHERE username=?`,[amount, user], function(error) {
        if (error) {
            console.error(error.message);
            return;
        }
    });
});


//API call to add to a users goal progress
//Take a json object that contains a username, category and amount
app.post('/api/addGoalProgress', function(req, res) {
    let data = JSON.parse(JSON.stringify(req.body));

    let user = data.username;
    let category = data.category;
    let amount = data.amount;

    db.run('INSERT INTO goalProgress (username, amount, category) VALUES (?, ?, ?)',
                    [user, amount, category], function(error) {
        if (error) {
            console.error(error.message);
            return;
        }
    });
});


//API call to set a users goal
//Takes a json object that has a username
app.post('/api/getUserGoals', function(req, res) {
    let data = JSON.parse(JSON.stringify(req.body));

    db.all(`SELECT * FROM goals WHERE username = "${data.username}"`, (err, rows) => {
        if (err) {
            throw err;
        }

        res.send(rows);
    });
});


//API call to get all goal progress
//Takes a json object that has a username
app.post('/api/getGoalProgress', (req,res) => {
    let data = JSON.parse(JSON.stringify(req.body));

    db.all(`SELECT * FROM goalProgress WHERE username = "${data.username}"`, (err, rows) => {
        if (err) {
            throw err;
        }

        res.send(rows);
    });
});

//Render the test.html
app.get('/test', (request,response) => {
    response.sendFile(__dirname + '/public/test.html');
});

//Set the port to 3000
app.set('port', 3000);

var server = app.listen(app.get('port'), () => {
    console.log('Node.js/Express is listening on port ' + app.get('port'));
})

let registerHistory = [];

let soio = require('socket.io')(server);							//Creates a socket that connects to our server

soio.on('connection', function(socket) {							//When a user connects to the socket
	console.log('User has connected.');
	if(registerHistory.length > 0){									//If a user connects and missed another user register, display the missed registrations
		for (var i=0; i<registerHistory.length; i++){
			socket.emit('old register logs', registerHistory[i]);
		}
	}
	
	
	socket.on('Leave', function(){									//When the user disconnects
		console.log('User has left.');
	});

	socket.on('Send', function(data){								//If a user registers
		console.log(data.date + data.username + ": " + data.message);
		registerHistory.push(data);									//Store the registration information in registerHistory
		soio.emit('admin notification', data);						//If a connected user is online (an admin), send them the registration details
	});
})

function isActiveSession(request) {
    if (!(request.session && request.session.user && request.session.user != '')) { // Check if session exists
        return false;
    }

    return true;
}
