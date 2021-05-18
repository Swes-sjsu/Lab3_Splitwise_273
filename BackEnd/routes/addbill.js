const dbconnection = require('../config/conn');

const addbillQuery = (req) => {
  return new Promise(async (resolve, reject) => {
    console.log('Inside  addbill');
    const useremail = req.email;
    const grpname = req.groupname;
    const descript = req.descript;
    const amt = req.amountvalue;
    console.log(useremail, grpname, descript, amt);
    sqlquery =
      "INSERT INTO transaction (payed_by,groupid,tamount,tdescription) values ('" +
      useremail +
      "' , (SELECT groupid FROM spgroups where gpname='" +
      grpname +
      "'), " +
      amt +
      ", '" +
      descript +
      "')";
    console.log(sqlquery);
    dbconnection.query(sqlquery, async (err, output, fields) => {
      if (err) {
        console.log(err);
        reject({ status: 400, message: err.message });
      } else {
        console.log(output);
        //res.status(200).send(output);
        sqlquery1 =
          'UPDATE balancetbl sb JOIN usersgroups as ug JOIN spgroups as gp JOIN users as u ON sb.groupid=gp.groupid and sb.payee=u.email SET balance=balance+(' +
          amt +
          "/(SELECT count(*) FROM usersgroups ug INNER JOIN spgroups as gp INNER JOIN users as u ON ug.groupid=gp.groupid and ug.userid=u.idusers WHERE gp.gpname ='" +
          grpname +
          "' and ug.invitedaccepted=1)), settled=1  where sb.payer = '" +
          useremail +
          "' and gp.gpname= '" +
          grpname +
          "' and payee_invite=1 and payer_invite=1";
        console.log(sqlquery1);
        dbconnection.query(sqlquery1, async (err, output, fields) => {
          if (err) {
            console.log(err);
            reject({ status: 400, message: err.message });
          } else {
            console.log(output);
            resolve({ status: 200, message: 'Bill added Succesfully' });
          }
        });
      }
    });
  });
};

const settleupQuery = (req) => {
  return new Promise(async (resolve, reject) => {
    console.log('Inside  settleup');
    const userid = req.user_id;
    const settledupemail = req.settleupwith;
    const currentuseremail = req.email;

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
        reject({ status: 400, message: err.message });
      } else {
        console.log(output);
        resolve({ status: 200, message: 'settled up succesfully!' });
      }
    });
  });
};

module.exports = { addbillQuery, settleupQuery };
