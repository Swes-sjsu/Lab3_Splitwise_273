const dbconnection = require('../config/conn');
const bcrypt = require('bcryptjs');

const login = (req) => {
    return new Promise(async (resolve, reject) => {
      console.log('Inside  Login');
      //console.log(req.body);
      const email = req.email;
      const password = req.password;
      dbconnection.query(
        'SELECT * FROM users WHERE email = ? ',
        [email],
        async (err, output, fields) => {
          if (err) {
            //console.log(err);
            reject({ status: 400, message: err.message });
          } else {
            if (output.length > 0) {
              const passwordcompare = await bcrypt.compare(password, output[0].password);
              //console.log(passwordcompare)
              //console.log(output)
              if (passwordcompare) {
                resolve({
                  status: 200,
                  message: 'Login Succesful',
                  username: output[0].usersname,
                  user_id: output[0].idusers,
                  email: output[0].email,
                  profilepic: output[0].profphoto,
                  currencydef: output[0].currencydef,
                });
                
              } else {
                reject({ status: 401, message: 'Please enter valid password!' });
              }
            } else {
              reject({ status: 400, message: 'Email ID not found! Please Signup!' });
            }
          }
        }
      );
    });
  };

  module.exports=login; 