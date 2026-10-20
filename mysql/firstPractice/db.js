const mysql = require("mysql2");

const db = mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"Balaji@628544",
    database:"balu"
});

db.connect((err)=>{
    if(err){
        console.log("Database connection failed",err.stack);
    }else{
        console.log("Database connected succcessfully");
    }
});



module.exports = db;
