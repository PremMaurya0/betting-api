const mysql = require('mysql');
require("dotenv").config();
const con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "betting"
});

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
});
// con.end(function(err) {
//   if (err) throw err;
//   console.log("Disconnected!");
// });
module.exports = con;