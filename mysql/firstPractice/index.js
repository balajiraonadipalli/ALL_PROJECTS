const express  = require("express");
const bodyParser = require("body-parser");
const AuthRouters = require("./authRoutes");

const app = express();
app.use(bodyParser.json());


app.use("/auth",AuthRouters);


app.listen(3000, console.log("Server Created a the port 3000"));