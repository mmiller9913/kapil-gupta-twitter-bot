const express = require('express')
const bodyParser = require('body-parser');
const ejs = require('ejs');;

//added b/c of aws
// const dotenv = require("dotenv");
// const cors = require("cors");

//Init the app (create the express app);
const app = express();

//Template engine setup
app.set('view engine', 'html');
app.engine('html', ejs.renderFile);

//Public folder setup
app.use(express.static(__dirname + '/public'));

//Body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//index route
app.get('/', (req, res) => {
    res.render('index');
});

// //FOR AWS
// app.get("/", (req, res) => {
// 	return res.status(200).json({
// 		SECRET_1: process.env.SECRET_1,
// 		SECRET_2: process.env.SECRET_2,
// 	});
// });
// app.use(cors());

//to keep nodejs app running indefinitely on heroku
// var http = require("http");
// setInterval(function () {
//     http.get("http://kapil-gupta-twitter-bot.herokuapp.com");
// }, 600000); // runs every 10 minutes

module.exports = app;