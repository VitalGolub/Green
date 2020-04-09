var express = require('express'); 
let app = express();
let bodyParser = require('body-parser');
let session = require('express-session');
let uuid = require('uuid/v1');
let sqlite3 = require('sqlite3').verbose();

//node js middleware
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


app.set('views', __dirname + '/views');
app.set('view engine', 'pug');


//sets up database for green
let db = new sqlite3.Database('./data/green.db', (error) => {
    if (error) {
        console.log("Error connecting to database"); 
        return;
    }

    console.log('Connected to the SQLite database');
});

//create user table inside green.db
db.serialize(() => {

    db.run(`CREATE TABLE IF NOT EXISTS users(
        username TEXT PRIMARY KEY, 
        firstname TEXT, 
        lastname TEXT, 
        email TEXT,
        birthDay DATE, 
        password VARCHAR(255)
    )`);


    db.run(`CREATE TABLE IF NOT EXISTS expenses(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL,
        date DATE,
        amount REAL,
        category TEXT,
        description TEXT
    )`);

});

//when no endpoint is entered the screen will default to the login page
app.get('/' , (request,response) => {
    //response.sendFile(__dirname + '/public/login.html')
	response.render('login');
});

//when login is endpoint 
app.get('/login' , (request,response) => {
    //response.sendFile(__dirname + '/public/login.html')
	
});

app.get('/signup' , (request,response) => {
    //response.sendFile(__dirname + '/public/login.html')
	response.render('signup');
	
});

app.get('/goals' , (request,response) => {

	response.render('goals');
	
});

app.get('/news' , (request,response) => {
    response.sendFile(__dirname + '/public/news.html')
	
});

app.post('/api/getUserExpenses', (req,res) => {
    let data = JSON.parse(JSON.stringify(req.body));

    db.all(`SELECT username, date, amount, category, description FROM expenses WHERE username = "${data.username}" AND date >= "${data.from}" AND date <= "${data.to}"`, (err, rows) => {
        if (err) {
            throw err;
        }

        res.send(rows);
    });
});


app.get('/api/getExpenses', (req,res) => {

    db.all(`SELECT username, date, amount, category, description FROM expenses`, (err, rows) => {
        if (err) {
            throw err;
        }

        res.send(rows);
    });
});

app.get('/api/getUsers', (req,res) => {

    db.all(`SELECT * FROM users`, (err, rows) => {
        if (err) {
            throw err;
        }

        res.send(rows);
    });
});


app.post('/api/addExpense', (req,res) => {
    let data = JSON.parse(JSON.stringify(req.body));
    console.log(data);

    let user = data.username;
    let category = data.category;
    let amount = data.amount;
    let description = data.description;
    let date = data.date;

    // Do something, like query a database or save data

    db.run('INSERT INTO expenses (username, date, amount, category, description) VALUES (?, ?, ?, ?, ?)', 
                    [user, date, amount, category, description], function(error) {
        if (error) {
            console.error(error.message);
            return;
        }
    });
});


app.get('/test', (request,response) => {
    response.sendFile(__dirname + '/public/test.html');
});


app.set('port', 3000); 

app.listen(app.get('port'), () => {
    console.log('Node.js/Express is listening on port ' + app.get('port'));
})