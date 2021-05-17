//import the require dependencies
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var cors = require('cors');
app.set('view engine', 'ejs');
const mysql = require('mysql');
const bcrypt = require('bcryptjs');
var multer = require('multer');
const { graphqlHTTP } = require('express-graphql');
const schema = require('./schema/schema');
const saltRounds = 10;

//use express session to maintain session data
app.use(
  session({
    secret: 'cmpe273_lab1',
    resave: false, // Forces the session to be saved back to the session store, even if the session was never modified during the request
    saveUninitialized: false, // Force to save uninitialized session to db. A session is uninitialized when it is new but not modified.
    duration: 60 * 60 * 1000, // Overall duration of Session : 30 minutes : 1800 seconds
    activeDuration: 5 * 60 * 1000,
  })
);

app.use(bodyParser.json());
//use cors to allow cross origin resource sharing
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
//Allow Access Control
app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT,DELETE');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers'
  );
  res.setHeader('Cache-Control', 'no-cache');
  next();
});

app.use('/graphql', (req, res) => {
  return graphqlHTTP({
    schema,
    graphiql: true,
    context: { req, res },
  })(req, res);
});

var filestorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, '../frontend/public/Profile_photos/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + file.originalname);
  },
});

const filetypes = (req, file, cb) => {
  if (
    file.mimetype === 'image/jpeg' ||
    file.mimetype === 'image/jpg' ||
    file.mimetype === 'image/png'
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};
var updatepic = multer({
  storage: filestorage,
  fileFilter: filetypes,
});

var grpfilestorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, '../frontend/public/Profile_photos/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + file.originalname);
  },
});
var grpupdatepic = multer({
  storage: grpfilestorage,
  fileFilter: filetypes,
});

/*
app.get('/getrecentacitvities/:userid', function (req, res) {
  console.log('Inside  getrecentacitvities');
  console.log(req.body);
  const userid = req.params.userid;
  console.log(userid);
  sqlquery =
    'Select t.payed_by, u1.usersname, t.groupid,gp.gpname,  t.tamount, t.tdate, t.tdescription from transaction t INNER JOIN spgroups gp  INNER JOIN users u   INNER JOIN users u1  INNER JOIN usersgroups ug ON t.groupid= ug.groupid and ug.groupid= gp.groupid and ug.invitedaccepted=1 and u.idusers=ug.userid and u1.email=t.payed_by where u.idusers=' +
    userid +
    " ORDER BY tdate desc; Select t.payed_by, u.usersname, t.groupid,'$$$$'as gpname,  t.tamount, t.tdate, t.tdescription from transaction t INNER JOIN users u  ON t.payed_by=u.email where u.idusers= " +
    userid +
    ' and t.groupid = -1 ORDER BY tdate desc;';

  dbconnection.query(sqlquery, async (err, output, fields) => {
    if (err) {
      console.log(err);
      res.status(400).send('Error!');
    } else {
      console.log(output);
      res.status(200).send(output);
    }
  });
});
*/

//start your server on port 3001
app.listen(3001);
console.log('Server Listening on port 3001');

module.exports = app;
