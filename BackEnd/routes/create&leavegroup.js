const dbconnection = require('../config/conn');

const creategroupQuery = (req) => {
  return new Promise(async (resolve, reject) => {
    console.log('Inside creategroup');
    const userid = req.user_id;
    const grpname = req.groupname;
    const groupcreatedbyemail = req.groupcreatedbyemail;
    // const gpmememails = req.groupmemebers;
    // const grpmemadded = { type: 'gpemails', gpemails: req.groupmemebers };
    var stringgpmemadded = JSON.stringify(req.groupmemebers);
    var replacebraces = stringgpmemadded.replace(/[\[\]\'\"]/g, '');
    var gpmems = replacebraces.split(',');
    const groupphoto = req.grouppic;

    insertgrpsqlquery =
      "INSERT INTO spgroups(gpname,photo) VALUES ('" + grpname + "', '" + groupphoto + "')";
    console.log(insertgrpsqlquery);
    dbconnection.query(insertgrpsqlquery, async (err, output) => {
      if (err) {
        if (err.code === 'ER_DUP_ENTRY') {
          console.log('groupname is not unique');
          reject({ status: 401, message: 'Groupname is not unique!' });
        } else {
          console.log(err);
          reject({ status: 401, message: err.message });
        }
      } else {
        console.log(output);
        const groupid1 = output.insertId;
        console.log(groupid1);
        const insertusergroups =
          'INSERT INTO usersgroups(userid,groupid,invitedaccepted,invitedby) values (?,?,?,?)';

        dbconnection.query(
          insertusergroups,
          [userid, groupid1, 1, groupcreatedbyemail],
          (err, output1) => {
            console.log(insertusergroups);
            if (err) {
              console.log('Error');
              reject({ status: 400, message: err.message });
            } else {
              var gpmemsarray = Object.keys(gpmems);
              gpmemsarray.forEach((gpmember) => {
                var gpemail = gpmems[gpmember];
                //const gpemail=gpmember;
                console.log(gpemail);
                insertgpmembers =
                  "INSERT INTO usersgroups(userid,groupid,invitedaccepted,invitedby) VALUES ((SELECT idusers FROM users where email='" +
                  gpemail +
                  "'), '" +
                  groupid1 +
                  "', 0 ,'" +
                  groupcreatedbyemail +
                  "')";
                console.log(insertgpmembers);
                dbconnection.query(insertgpmembers, (err, output1) => {
                  if (err) {
                    console.log('Error');
                    reject({ status: 400, message: err.message });
                  } else {
                    console.log(output1);
                  }
                });
              });
            }
            gpmems.unshift(groupcreatedbyemail);
            console.log(gpmems);
            for (let i = 0; i < gpmems.length; i++) {
              for (let j = 0; j < gpmems.length; j++) {
                if (gpmems[i] !== gpmems[j]) {
                  insertgpmembers =
                    "INSERT INTO balancetbl(payer,payee,balance,groupid,payee_invite,settled) VALUES ('" +
                    gpmems[i] +
                    "', '" +
                    gpmems[j] +
                    "', 0 ,'" +
                    groupid1 +
                    "',0,0)";
                  dbconnection.query(insertgpmembers, (err, output2) => {
                    if (err) {
                      console.log('Error');
                      reject({ status: 400, message: err.message });
                    } else {
                      console.log(output2);
                    }
                  });
                }
              }
            }
            updateinviteforowner =
              "UPDATE balancetbl JOIN balancetbl as sb JOIN balancetbl as sb1 SET sb.payer_invite=1, sb1.payee_invite=1 where sb.payer = '" +
              groupcreatedbyemail +
              "' and sb.groupid =" +
              groupid1 +
              " and sb1.payee = '" +
              groupcreatedbyemail +
              "' and sb1.groupid =" +
              groupid1;
            dbconnection.query(updateinviteforowner, (err, output2) => {
              if (err) {
                console.log('Error');
                reject({ status: 400, message: err.message });
              } else {
                console.log(output2);
                resolve({ status: 200, message: 'Create Group Succesfully', groupname: grpname });
              }
            });
          }
        );
      }
    });
  });
};

const leavegroupQuery = (req) => {
  return new Promise(async (resolve, reject) => {
    console.log('Inside  leavegroup');
    //console.log(req.body);
    const userid = req.user_id;
    const useremail = req.email;
    const grpname = req.groupname;
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
        reject({ status: 400, message: err.message });
      } else {
        //console.log(output)
        resolve({ status: 200, message: 'Left Group Succesfully!!' });
      }
    });
  });
};

module.exports = { creategroupQuery, leavegroupQuery };
