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

//use cors to allow cross origin resource sharing
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));

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
    graphiql: true, // or whatever you want
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

app.post('/leavegroup', function (req, res) {
  console.log('Inside  leavegroup');
  //console.log(req.body);
  const userid = req.body.userid;
  const useremail = req.body.useremail;
  const grpname = req.body.grpname;
  //console.log(userid, grpname)
  sqlquery =
    'DELETE ug,sb,sb1 FROM usersgroups as ug INNER JOIN balancetbl as sb INNER JOIN balancetbl as sb1 INNER JOIN spgroups as gp INNER JOIN spgroups as gp1 INNER JOIN spgroups as gp2 INNER JOIN users as u ON ug.groupid=gp.groupid and ug.userid=u.idusers and sb.groupid=gp1.groupid  and sb1.groupid=gp2.groupid where ug.userid= ' +
    userid +
    " and gp.gpname='" +
    grpname +
    "' and ug.invitedaccepted=1 and sb.payee_invite=1 and sb1.payer_invite=1 and sb.payee='" +
    useremail +
    "' and sb1.payer='" +
    useremail +
    "' and gp1.gpname='" +
    grpname +
    "'; ";
  //console.log(sqlquery);
  dbconnection.query(sqlquery, async (err, output, fields) => {
    if (err) {
      //console.log(err);
      res.status(400).send('Error!');
    } else {
      //console.log(output)
      res.status(200).send('Left Group Succesfully!!');
    }
  });
});

app.get('/gettotalbalances/:userid', function (req, res) {
  console.log('Inside  getgrpexpenses');
  console.log(req.body);
  const userid = req.params.userid;
  console.log(userid);
  sqlquery =
    'SELECT sb.payer,  u.usersname as payer_username, sb.payee, u1.usersname as payee_username,sb.balance, sb.groupid, gp.gpname FROM balancetbl sb JOIN spgroups gp JOIN users u JOIN users u1 ON sb.groupid=gp.groupid and sb.payer=u.email and sb.payee= u1.email where payee_invite=1 and payer_invite=1 and u.idusers=' +
    userid +
    ' or u1.idusers=' +
    userid +
    ' ORDER BY sb.groupid ; SELECT @youareowed := (SELECT SUM(balance) as you_are_owed FROM splitwise.balancetbl sb JOIN users u JOIN spgroups gp ON sb.groupid=gp.groupid and u.email = sb.payer where payee_invite=1 and payer_invite=1 and u.idusers=' +
    userid +
    ')  AS You_are_owed, @youowe := (SELECT SUM(balance) as you_are_owed FROM splitwise.balancetbl sb JOIN users u JOIN spgroups gp ON sb.groupid=gp.groupid and u.email = sb.payee where payee_invite=1 and payer_invite=1 and u.idusers=' +
    userid +
    ')  AS You_owe,(@youareowed - @youowe)  AS Total_balance;';

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

app.post('/settleup', function (req, res) {
  console.log('Inside  settleup');
  console.log(req.body);
  const userid = req.body.userid;
  const settledupemail = req.body.settleupwith;
  const currentuseremail = req.body.useremail;
  console.log(userid);
  sqlquery =
    "UPDATE balancetbl SET balance=0, settled=2 where ((payer='" +
    currentuseremail +
    "' and payee='" +
    settledupemail +
    "') or (payer='" +
    settledupemail +
    "' and payee='" +
    currentuseremail +
    "')); INSERT INTO transaction ( payed_by, groupid, tamount, tdescription) VALUES ('" +
    settledupemail +
    "', -1, 0, (Select CONCAT('Settled up with',' ',usersname) from users where email = '" +
    currentuseremail +
    "')); INSERT INTO transaction ( payed_by, groupid, tamount, tdescription) VALUES ('" +
    currentuseremail +
    "', -1, 0, (Select CONCAT('Settled up with',' ',usersname) from users where email = '" +
    settledupemail +
    "'))";
  console.log(sqlquery);
  dbconnection.query(sqlquery, async (err, output, fields) => {
    if (err) {
      console.log(err);
      res.status(400).send('Error!');
    } else {
      console.log(output);
      res.status(200).send('settled up succesfully!');
    }
  });
});

//start your server on port 3001
app.listen(3001);
console.log('Server Listening on port 3001');

module.exports = app;
