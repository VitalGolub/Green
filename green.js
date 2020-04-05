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

    db.run(`CREATE TABLE userPersonalInformation(
        userName TEXT PRIMARY KEY, 
        firstName TEXT, 
        lastName TEXT, 
        email TEXT
        birthDay DATE 
        password VARCHAR(255)
    )`);

});

//when no endpoint is entered the screen will defualt to the login page
app.get('/' , (request,response) => {
    response.sendFile(__dirname + '/public/login.html')
});

//when login is endpoint 
app.get('/login' , (request,response) => {
    response.sendFile(__dirname + '/public/login.html')
});





app.set('port', 3000); 

app.listen(app.get('port'), () => {
    console.log('Node.js/Express is listening on port' + app.get('port'));
})