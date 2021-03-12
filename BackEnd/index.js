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
var multer  = require('multer');

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

var filestorage = multer.diskStorage({
    destination: function(req, file, results){
    results(null,'../frontend/public/Profile_photos/')},
    filename: function(req, file, results){
        results(null,Date.now()+file.originalname)}
})

const filetypes=(req, file, results)=>{
    if(file.mimetype ==='image/jpeg' || file.mimetype ==='image/jpg' || file.mimetype ==='image/png'){
        results(null,true);
    }else{
        results(null, false);
    }
 
   }

   var updatepic = multer({
       storage: filestorage,
       fileFilter: filetypes
   });

app.post('/signup',function(req,res){
    console.log("Inside Signup");  
    console.log(req.body);
const username =req.body.username;
const email =req.body.email;
const password =req.body.encryptpassword;
var idusers1;
dbconnection.query("SELECT * FROM users WHERE email = ?",[email], (err,output,fields)=> {
    if(err){
        console.log(err);
        res.status(400).send('Error!')
    }else {
        if(output.length > 0 ){
        res.status(401).send('Email already exists!!Please Login or use a different email ID');
        }else {
            dbconnection.query("INSERT INTO users(usersname,email,password) VALUES (?,?,?) ",[username,email,password], (err,output,fields)=>{
                    if(err){
                        console.log(err);
                        res.status(400).send('Error!')
                    }else {
                        res.cookie('cookie',email,{maxAge: 900000, httpOnly: false, path : '/'});
                        req.session.user = username;
                        req.session.email = email;
                        console.log(req.session.user)
                        console.log(req.session.email)
                            idusers1=output.insertId;
                        console.log(idusers1)
                        res.status(200).send({"username" : username, "user_id" : idusers1,"email" : email})
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
            console.log(output)
            if(passwordcompare){
                // res.cookie('cookie_username',output[0].usersname,{maxAge: 900000, httpOnly: false, path : '/'});
                res.cookie('cookie',email,{maxAge: 900000, httpOnly: false, path : '/'});
                // sessionStorage.setItem('username',output[0].usersname)
                console.log(output[0].usersname)
                req.session.cookie.username = output[0].usersname;
                req.session.cookie.email = email;
                console.log(req.session.cookie.username,req.session.cookie.email )
                res.status(200).send({"username" : output[0].usersname,"user_id" : output[0].idusers,"email" : output[0].email});
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

app.get('/getuserdetails/:id', function(req,res){

    console.log("Inside  getuserprofile");    
    console.log(req.body);
    const userid =req.params.id;
    console.log(userid)
    dbconnection.query("SELECT * FROM users where idusers = ? ",
    [userid],async(err,output,fields)=> {
        if(err){
        console.log(err);
        res.status(400).send('Error!')
    }else {
                console.log(output)
                res.status(200).send(output);
            }
    })
        
})

app.post('/updateprofile',updatepic.single('profile_avatar'), function(req,res){

    console.log("Inside  updateprofile");    
    console.log(req.body);
    const userid =(req.body.idusers);
    const username =req.body.username;
    const email =req.body.email;
    const phonenumber =req.body.phonenumber;
    const defaultcurrency =req.body.currencydef;
    const timezone =req.body.timezone;
    const profilephoto =req.file.originalname;
    const language =req.body.language;
    console.log(username,email,phonenumber,defaultcurrency,timezone,profilephoto,language,userid);
    sqlquery = "UPDATE users SET usersname = '"+username +"' , email = '"+email+"' , usersphone = '"+phonenumber+"' , currencydef = '"+defaultcurrency+"' , timezone = '"+timezone+"', profphoto = '"+profilephoto+
    "' , language = '"+language+"' WHERE idusers = "+userid;
    console.log(sqlquery)
    dbconnection.query(sqlquery,(err,output,fields)=> {
        if(err){
        console.log(err);
        res.status(400).send('Error!')
    }else {
                // console.log(output[0].usersname)
                req.session.cookie.username = username;
                req.session.cookie.email = email;
                res.status(200).send({"username" : username,"email" : email, "profilephoto":profilephoto});
            }
    })
        
})

app.post('/creategroup',function(req,res){
    console.log("Inside creategroup");  
    console.log(req.body);
});
//start your server on port 3001
app.listen(3001);
console.log("Server Listening on port 3001");