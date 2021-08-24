const mysql = require('mysql');
const dbconnection = mysql.createConnection({
  host: 'splitwise-db.********.us-east-1.rds.amazonaws.com',
  user: 'admin',
  password: '',
  ssl: true,
  database: 'splitwise',
  multipleStatements: true,
});

dbconnection.connect(function(error){
  if(!!error){
    console.log(error);
  }else{
    console.log('MySQL is Connected!');
  }
});

module.exports=dbconnection; 
