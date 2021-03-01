//import the require dependencies
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var cors = require('cors');
app.set('view engine', 'ejs');
const mysql = require('mysql');
const bcrypt = require( 'bcryptjs');

const saltRounds = 10;

//use cors to allow cross origin resource sharing
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));

//use express session to maintain session data
app.use(session({
    secret              : 'cmpe273_lab1',
    resave              : false, // Forces the session to be saved back to the session store, even if the session was never modified during the request
    saveUninitialized   : false, // Force to save uninitialized session to db. A session is uninitialized when it is new but not modified.
    duration            : 60 * 60 * 1000,    // Overall duration of Session : 30 minutes : 1800 seconds
    activeDuration      :  5 * 60 * 1000
}));

// app.use(bodyParser.urlencoded({
//     extended: true
//   }));
app.use(bodyParser.json());

//Allow Access Control
app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT,DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers');
    res.setHeader('Cache-Control', 'no-cache');
    next();
  });

const dbconnection = mysql.createConnection({
    host:"swesmysql.co7pzwu1hwvu.us-east-1.rds.amazonaws.com",
    user:"admin",
    password:"Swetha1234",
    ssl: true,
    database: "splitwise"
})

app.post('/signup',function(req,res){
    console.log("Inside Signup");  
    console.log(req.body);
const username =req.body.username;
const email =req.body.email;
const password =req.body.encryptpassword;
dbconnection.query("SELECT * FROM users WHERE email = ?",[email],(err,output,fields)=> {
    if(err){
        console.log(err);
        res.status(400).send('Error!')
    }else {
        if(output.length > 0 ){
        res.status(401).send('Email already exists!!Please Login or use a different email ID');
        }else {
            dbconnection.query("INSERT INTO users(users_name,email,password) VALUES (?,?,?) ",[username,email,password],(err,ouput,fields)=>{
                    if(err){
                        console.log(err);
                        res.status(400).send('Error!')
                    }else {
                        res.status(200).send('Registration succesful!')
                    }
        });
    }
}
});
});

app.post('/login', function(req,res){

    console.log("Inside  Login");    
    console.log(req.body);
    const email =req.body.email;
    const password =req.body.password;
    dbconnection.query("SELECT * FROM users WHERE email = ? ",
    [email],async(err,output,fields)=> {
        if(err){
        console.log(err);
        res.status(400).send('Error!')
    }else {
        if(output.length > 0 ){
            const passwordcompare = await bcrypt.compare(password,output[0].password)
            console.log(passwordcompare)
            if(passwordcompare){
                res.status(200).send('Login Succesful!');
            }
            else{
                res.status(401).send('Please enter valid password!');
            }
        }
        else{
            res.status(400).send('Email ID not found! Please Signup!');
        }
    }
    })
        
})
//start your server on port 3001
app.listen(3001);
console.log("Server Listening on port 3001");