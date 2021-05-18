const graphql = require('graphql');
const dbconnection = require('../config/conn');
const bcrypt = require('bcryptjs');
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
        console.log(err);
        reject({
          status: 401,
          message: 'Email already exists!!Please Login or use a different email ID',
        });
      } else {
        dbconnection.query(
          'INSERT INTO users(usersname,email,password) VALUES (?,?,?) ',
          [username, email, password],
          (err, output, fields) => {
            if (err) {
              console.log(err);
              reject({ status: 400, message: err.message });
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

module.exports = signup;
