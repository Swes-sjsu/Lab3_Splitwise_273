const dbconnection = require('../config/conn');

const updateprofile = (req) => {
  return new Promise(async (resolve, reject) => {
    console.log('Inside  updateprofile');
    const userid = req.user_id;
    const username = req.username;
    const email = req.email;
    const phonenumber = req.phonenumber;
    const defaultcurrency = req.currencydef;
    const timezone = req.timezone;
    const language = req.language;
    const profilephoto = req.profilepic;

    sqlquery =
      "UPDATE users SET usersname = '" +
      username +
      "' , email = '" +
      email +
      "' , usersphone = '" +
      phonenumber +
      "' , currencydef = '" +
      defaultcurrency +
      "' , timezone = '" +
      timezone +
      "', profphoto = '" +
      profilephoto +
      "' , language = '" +
      language +
      "' WHERE idusers = " +
      userid;

    //sqlquery = "UPDATE users SET usersname = '"+username +"' , email = '"+email+"' , usersphone = '"+phonenumber+"' , currencydef = '"+defaultcurrency+"' , timezone = '"+timezone+
    //"', profphoto = '"+profilephoto+"' , language = '"+language+"' WHERE idusers = "+userid;

    //console.log(sqlquery)
    dbconnection.query(sqlquery, (err, output, fields) => {
      if (err) {
        // console.log(err);
        resolve({ status: 400, message: err.message });
      } else {
        resolve({
          status: 200,
          username: username,
          email: email,
          profilepic: profilephoto,
          currencydef: defaultcurrency,
          phonenumber: phonenumber,
          timezone: timezone,
          language: language,
          message: 'Update Profile Successful',
        });
      }
    });
  });
};

module.exports = updateprofile;
