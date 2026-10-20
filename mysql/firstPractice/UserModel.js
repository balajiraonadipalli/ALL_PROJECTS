const db = require("./db");

const User = {
    create:(username,password,callback)=>{
        db.query(
            "Insert into users (username,password) values(?,?)",
            [username,password],
            callback     
        )
    },
    findByUsername:(username,callback)=>{
        db.query("select * from users where username = ?",
            [username],
            callback
        )
    },
    findById:(id,callback) =>{
        db.query("select * from users where id = ?",
            [id],
            callback
        )
    }
}

module.exports = User;