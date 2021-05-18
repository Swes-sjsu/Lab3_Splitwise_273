const dbconnection = require('../config/conn');

const userdetailsQuery = (req) => {
  return new Promise(async (resolve, reject) => {
    console.log('Inside  getuserprofile');
    const userid = req.user_id;
    console.log(userid);
    dbconnection.query(
      'SELECT usersname,idusers,email,profphoto,usersphone,currencydef,timezone,language FROM users where idusers = ? ',
      [userid],
       (err, output, fields) => {
        if (err) {
          //console.log(err);
          reject({ status: 400, message: err.message });
        } else {
          resolve({
            status: 200,
            username: output[0].usersname,
            user_id: output[0].idusers,
            email: output[0].email,
            profilepic: output[0].profphoto,
            phonenumber: output[0].usersphone,
            currencydef: output[0].currencydef,
            timezone: output[0].timezone,
            language: output[0].language,
            message: 'User Details Succesful',
          });
        }
      }
    );
  });
};

const useroptionsQuery = (req) => {
  return new Promise(async (resolve, reject) => {
    console.log('Inside  getuseroptions');
    const userid = req.user_id;
    const options = [];
    console.log(userid);
    let username, email, user_id;
    dbconnection.query(
      'SELECT idusers,usersname,email FROM users where idusers != ? ',
      [userid],
      async (err, output, fields) => {
        if (err) {
          console.log(err);
          reject({ status: 400, message: err.message });
        } else {
          // console.log(output);
          for (let i = 0; i < output.length; i++) {
            username = output[i].usersname;
            email = output[i].email;
            user_id = output[i].idusers;
            let userdetails = { username, email, user_id };
            options.push(userdetails);
          }
          resolve(options, (status = 200), (message = 'User Options Succesful'));
        }
      }
    );
  });
};

const getuserpgroupsQuery = (req) => {
  return new Promise(async (resolve, reject) => {
    console.log('Inside  getusergroups');
    const userid = req.user_id;
    let groupnames;
    const groups = [];
    sqlquery =
      'SELECT gp.gpname FROM usersgroups as ug JOIN spgroups as gp JOIN users as u ON ug.groupid=gp.groupid and ug.userid=u.idusers where ug.invitedaccepted=1 and ug.userid=' +
      userid;
    dbconnection.query(sqlquery, async (err, output, fields) => {
      if (err) {
        //console.log(err);
        reject({ status: 400, message: err.message });
      } else {
        for (let i = 0; i < output.length; i++) {
          groupnames = output[i].gpname;
          let groupnameslist = { groupname: groupnames };
          groups.push(groupnameslist);
        }
        // console.log(groups);
        resolve(groups, (status = 200), (message = 'User groups Succesful'));
      }
    });
  });
};

const getpgroupinvitesQuery = (req) => {
  return new Promise(async (resolve, reject) => {
    console.log('Inside  getpgroupinvites');
    const userid = req.user_id;
    let groupnames;
    const groupsinvites = [];
    sqlquery =
      'SELECT gp.gpname FROM usersgroups as ug JOIN spgroups as gp JOIN users as u ON ug.groupid=gp.groupid and ug.userid=u.idusers where ug.invitedaccepted=0 and ug.userid=' +
      userid;
    dbconnection.query(sqlquery, async (err, output, fields) => {
      if (err) {
        //console.log(err);
        reject({ status: 400, message: err.message });
      } else {
        for (let i = 0; i < output.length; i++) {
          groupnames = output[i].gpname;
          let groupnameslist = { groupname: groupnames };
          groupsinvites.push(groupnameslist);
        }
        // console.log(groups);
        resolve(groupsinvites, (status = 200), (message = 'User groups invites Succesful'));
      }
    });
  });
};


const getgrpexpensesQuery = (req) => {
  return new Promise(async (resolve, reject) => {
    console.log('Inside getgrpexpenses');
    console.log(req.groupname); 
    const gpname = req.groupname;
    let tid, tdate, tdescription, payedBy, tamount;
    let outputlist = [];
    sqlquery =
      "SELECT t.id,t.tdate,t.tdescription,u.usersname,tamount FROM transaction t JOIN spgroups as gp JOIN users as u ON t.groupid=gp.groupid and t.payed_by=u.email WHERE gp.gpname ='" +
      gpname +
      "' ORDER BY t.tdate desc";
    dbconnection.query(sqlquery, async (err, output, fields) => {
      if (err) {
        console.log(err);
        reject({ status: 400, message: err.message });
      } else {
        for (let i = 0; i < output.length; i++) {
          tid = output[i].id;
          tdate = output[i].tdate;
          tdescription = output[i].tdescription;
          payedBy = output[i].usersname;
          tamount = output[i].tamount;
          let details = {
            tid: tid,
            tdate: tdate,
            tdescription: tdescription,
            payedBy: payedBy,
            tamount: tamount,
          };
          outputlist.push(details);
        }
        resolve(outputlist, (status = 200), (message = 'get group expenses Succesful'));
      }
    });
  });
};

const getsummaryexpensesQuery = (req) => {
  return new Promise(async (resolve, reject) => {
    console.log('Inside  getsummaryexpenses');

    const gpname = req.groupname;
    let bid, payer, payee, payer_username, payee_username, balance, settled;
    let outputlist = [];
    sqlquery =
      "SELECT count(*) FROM usersgroups ug INNER JOIN spgroups as gp INNER JOIN users as u ON ug.groupid=gp.groupid and ug.userid=u.idusers WHERE gp.gpname ='" +
      gpname +
      "' and ug.invitedaccepted=1";
    dbconnection.query(sqlquery, async (err, output, fields) => {
      if (err) {
        console.log(err);
        reject({ status: 400, message: err.message });
      } else {
        const noofmem = output;
        console.log(noofmem);
        getsummary =
          "SELECT sb.id,u.usersname as payer_name, u1.usersname as payee_name,sb.payer, sb.payee, sb.balance, sb.settled from balancetbl sb INNER JOIN spgroups as gp INNER JOIN users as u INNER JOIN users as u1 ON sb.groupid = gp.groupid and sb.payer=u.email and sb.payee=u1.email where gp.gpname = '" +
          gpname +
          "' and payee_invite=1 and payer_invite=1";
        dbconnection.query(getsummary, (err, output1) => {
          if (err) {
            reject({ status: 400, message: err.message });
          } else {
            for (let i = 0; i < output1.length; i++) {
              bid = output1[i].id;
              payer_username = output1[i].payer_name;
              payee_username = output1[i].payee_name;
              payer = output1[i].payer;
              payee = output1[i].payee;
              balance = output1[i].balance;
              settled = output1[i].settled;
              let details = {
                bid: bid,
                payer_username: payer_username,
                payee_username: payee_username,
                payer: payer,
                payee: payee,
                balance: balance,
                settled: settled,
              };
              outputlist.push(details);
            }
            resolve(outputlist, (status = 200), (message = 'get group summary expenses Succesful'));
          }
        });
      }
    });
  });
};

const gettotalbalancesQuery = (req) => {
  return new Promise(async (resolve, reject) => {
    console.log('Inside gettotalbalancesQuery');
    const userid = req.user_id;
    console.log(userid)
    let Total_balance,
      You_owe,
      You_are_owed,
      payer,
      payer_username,
      payee,
      payee_username,
      balance,
      gpname;
    let outputlist = [];
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
        reject({ status: 400, message: err.message });
      } else {
        // console.log(output);
        for (let i = 0; i < output.length - 1; i++) {
          if (output[i].You_owe !== 'undefined' || '') {
            for (let j = 0; j < output[i].length; j++) {
              payer_username = output[i][j].payer_username;
              payee_username = output[i][j].payee_username;
              payer = output[i][j].payer;
              payee = output[i][j].payee;
              balance = output[i][j].balance;
              gpname = output[i][j].gpname;
              let details = {
                payer_username: payer_username,
                payee_username: payee_username,
                payer: payer,
                payee: payee,
                balance: balance,
                gpname: gpname,
              };
              outputlist.push(details);
            }
          }
        }
        let len = output.length;
        if (output[len - 1]) {
          for (let j = 0; j < output[len - 1].length; j++) {
            console.log('swes', output[j]);
            Total_balance = output[len - 1][j].Total_balance;
            You_owe = output[len - 1][j].You_owe;
            You_are_owed = output[len - 1][j].You_are_owed;
            let details = {
              Total_balance: Total_balance,
              You_owe: You_owe,
              You_are_owed: You_are_owed,
            };
            outputlist.push(details);
          }
        }
        resolve(outputlist, (status = 200), (message = 'get total baalnce Succesful'));
      }
    });
  });
};

module.exports = {
  userdetailsQuery,
  useroptionsQuery,
  getuserpgroupsQuery,
  getpgroupinvitesQuery,
  getgrpexpensesQuery,
  getsummaryexpensesQuery,
  gettotalbalancesQuery,
};
