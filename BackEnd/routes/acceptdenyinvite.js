const dbconnection = require('../config/conn');

const acceptinvitationQuery = (req) => {
  return new Promise(async (resolve, reject) => {
    console.log('Inside  acceptinvitaion');
    console.log(req.body);
    const userid = req.user_id;
    const useremail = req.email;
    const grpname = req.currentgrp;
    //console.log(userid, grpname,useremail)
    sqlquery =
      'UPDATE usersgroups,balancetbl JOIN usersgroups as ug JOIN balancetbl as sb JOIN balancetbl as sb1 JOIN spgroups as gp JOIN spgroups as gp1 JOIN users as u ON ug.groupid=gp.groupid and ug.userid=u.idusers and sb.payee=u.email and sb.groupid=gp1.groupid set ug.invitedaccepted=1, sb.payee_invite=1, sb1.payer_invite=1 where ug.userid=' +
      userid +
      " and gp.gpname='" +
      grpname +
      "' and sb.payee='" +
      useremail +
      "' and gp1.gpname='" +
      grpname +
      "' and sb1.payer='" +
      useremail +
      "';";
    console.log(sqlquery);
    dbconnection.query(sqlquery, async (err, output, fields) => {
      if (err) {
        console.log(err);
        reject({ status: 400, message: err.message });
      } else {
        // console.log(output);
        resolve({ status: 200, message: 'User Accepted the invite to the group sucessfully' });
      }
    });
  });
};

const denyinvitationQuery = (req) => {
  return new Promise(async (resolve, reject) => {
    console.log('Inside  denyinvitation');
    const userid = req.user_id;
    const useremail = req.email;
    const grpname = req.currentgrp;
    sqlquery =
      'DELETE ug,sb FROM usersgroups as ug INNER JOIN balancetbl as sb INNER JOIN spgroups as gp INNER JOIN spgroups as gp1 INNER JOIN users as u ON ug.groupid=gp.groupid and ug.userid=u.idusers and sb.groupid=gp1.groupid where ug.userid= ' +
      userid +
      " and gp.gpname='" +
      grpname +
      "' and ug.invitedaccepted=0 and sb.payee_invite=0 and sb.payee='" +
      useremail +
      "'and gp1.gpname='" +
      grpname +
      "'";
    console.log(sqlquery);
    dbconnection.query(sqlquery, async (err, output, fields) => {
      if (err) {
        console.log(err);
        reject({ status: 400, message: err.message });
      } else {
        console.log(output);
        sqlquery1 =
          "DELETE sb FROM balancetbl as sb INNER JOIN spgroups as gp INNER JOIN users as u ON sb.groupid=gp.groupid and sb.payer=u.email where sb.payer='" +
          useremail +
          "' and gp.gpname='" +
          grpname +
          "';";
        dbconnection.query(sqlquery1, async (err, output, fields) => {
          if (err) {
            console.log(err);
            reject({ status: 400, message: err.message });
          } else {
            console.log(output);
            resolve({ status: 200, message: 'User denied the invite to the group' });
          }
        });
        // res.status(200).send('removed succesfully');
      }
    });
  });
};

module.exports = { acceptinvitationQuery, denyinvitationQuery };
