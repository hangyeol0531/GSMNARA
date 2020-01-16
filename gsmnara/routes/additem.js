var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
const mysql = require('mysql');
const crypto = require('crypto'); 
var multer = require("multer");
var cookieParser = require("cookie-parser");
var coch = require('./index');

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
  password: "0000"
})

db.connect((error) =>{
  if(error){
      throw(error);
  }
  else{
      console.log("database connected");
  }
});

router.get("/", function(req, res){
    console.log("additem접속");
    coch.cookiecheck(req,res);
    res.render('additem');
  });

  module.exports = router;