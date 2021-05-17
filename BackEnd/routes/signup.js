const graphql = require('graphql');
const dbconnection = require('../config/conn');
const bcrypt = require('bcryptjs');
var multer = require('multer');
var cookieParser = require('cookie-parser');
const mysql = require('mysql');
const queryForLogin = require('../routes/login');
const saltRounds = 10;

const signup = (req) => {
    return new Promise(async (resolve, reject) => {
      console.log('Inside Signup');
      console.log(req);
      const username = req.username;
      const email = req.email;
      const password = await bcrypt.hash(req.password, saltRounds);
      var idusers1;
  
      dbconnection.query('SELECT * FROM users WHERE email = ?', [email], (err, output, fields) => {
        if (err) {
          if (err.code === 'ER_DUP_ENTRY') {
            resolve({
              status: 401,
              message: 'Email already exists!!Please Login or use a different email ID',
            });
            // res.status(401).send('Email already exists!!Please Login or use a different email ID');
          } else {
            console.log(err);
            resolve({ status: 400, message: err.message });
            //res.status(400).send('Error!');
          }
        } else {
          dbconnection.query(
            'INSERT INTO users(usersname,email,password) VALUES (?,?,?) ',
            [username, email, password],
            (err, output, fields) => {
              if (err) {
                console.log(err);
                resolve({ status: 400, message: err.message });
                //res.status(400).send('Error!');
              } else {
                 idusers1 = output.insertId;
                resolve({
                  status: 200,
                  message: 'Signup Succesful',
                  username: username,
                  user_id: idusers1,
                  email: email,
                  currencydef: 'USD ($)',
                  profilepic: '',
                });
              }
            }
          );
        }
      });
    });
  };

  module.exports=signup; 