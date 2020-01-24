var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
const mysql = require('mysql');
const crypto = require('crypto'); 
var multer = require("multer");
var cookieParser = require("cookie-parser");

const upload = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'public/userimage/');
    },
    filename: function (req, file, cb) {
      cb(null, new Date().valueOf()+file.originalname);
    }
  }),
});

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended : true}));
router.use(cookieParser());

var db = mysql.createConnection({
  host: "localhost",
  database: "magonara",
  user: "root",
  password: "password"
})

db.connect((error) =>{
  if(error){
      throw(error);
  }
  else{
      console.log("database connected");
  }
});

/* GET home page. */
router.get('/', function(req, res) {
  console.log("유저 접속");
  res.clearCookie(req.headers.cookie);
  res.render('login');
});

function cookiecheck(req, res){
  if(!(req.headers.cookie)){
  console.log('no cookie');
  res.render('./login');
  }
}

module.exports = router;
module.exports.cookiecheck  = cookiecheck;
