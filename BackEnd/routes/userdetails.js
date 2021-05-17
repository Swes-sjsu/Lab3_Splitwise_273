const dbconnection = require('../config/conn');
const bcrypt = require('bcryptjs');

  const userdetails = (req) => {
    return new Promise(async (resolve, reject) => {
        console.log('Inside  getuserprofile');
        //console.log(req.body);
        const userid = req.id;
        console.log(userid);
        dbconnection.query(
          'SELECT * FROM users where idusers = ? ',
          [userid],
          async (err, output, fields) => {
            if (err) {
              //console.log(err);
              resolve({ status: 400, message: err.message });
            } else {
              //console.log(output)
              
              resolve({
                status: 200,
                username: output[0].usersname,
                user_id: output[0].idusers,
                email: output[0].email,
                profilepic: output[0].profphoto,
                currencydef: output[0].currencydef,
                timezone: output[0].timezone,
                language: output[0].language,
                message:'User Details Succesful'
              });
            }
          }
        );
    });
  };

  module.exports=userdetails; 