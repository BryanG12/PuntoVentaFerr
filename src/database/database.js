

// import mysql from 'promise-mysql';
// import config from './../config';

// const connection = mysql.createConnection({
//   host: config.host,
//   database:config.database,
//   user:config.user,
//   password:config.password
// });

// const getConnection = ()=>{
//   return connection;
// }

// module.exports = {
//   getConnection
// }


import  { createPool } from 'mysql2/promise';
import config from './../config';

export const pool = createPool({
  host: config.host,
  user: config.user,
  password: config.password,
  database: config.database
})