const dbconnection = require('../config/conn');

const userdetailsQuery = (req) => {
  return new Promise(async (resolve, reject) => {
    console.log('Inside  getuserprofile');
    //console.log(req.body);
    const userid = req.user_id;
    console.log(userid);
    dbconnection.query(
      'SELECT * FROM users where idusers = ? ',
      [userid],
      async (err, output, fields) => {
        if (err) {
          //console.log(err);
          reject({ status: 400, message: err.message });
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
    console.log('Inside  getgrpexpenses');

    const gpname = req.groupname;
    let bid, payer, payee, payer_name, payee_name, balance, settled;
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
              payer_name = output1[i].payer_name;
              payee_name = output1[i].payee_name;
              payer = output1[i].payer;
              payee = output1[i].payee;
              balance = output1[i].balance;
              settled = output1[i].settled;
              let details = {
                bid: bid,
                payer_name: payer_name,
                payee_name: payee_name,
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

module.exports = {
  userdetailsQuery,
  useroptionsQuery,
  getuserpgroupsQuery,
  getpgroupinvitesQuery,
  getgrpexpensesQuery,
  getsummaryexpensesQuery,
};
