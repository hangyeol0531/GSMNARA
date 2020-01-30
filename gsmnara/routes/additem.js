var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
const mysql = require('mysql');
const crypto = require('crypto'); 
var multer = require("multer");
var cookieParser = require("cookie-parser");
var coch = require('./index');
var querystring = require('querystring');

const upload = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'public/itemimage/');
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

router.get("/", function(req, res){
    console.log("additem접속");
    coch.cookiecheck(req,res);
    res.render('additem');
  });


  router.post('/check', upload.single('itemfile'), function(req, res){
    console.log("아이템 등록 들어왔습니다.");
    coch.cookiecheck(req, res);

    let user_name = req.cookies.student_id.student_id;
    let item_name = req.body.item_name;
    let item_kategorie = req.body.item_kategorie;
    let item_price = req.body.item_price;
    let simple_talk = req.body.simple_talk;
    
    console.log(user_name);
    console.log(item_name);
    console.log(item_kategorie);
    console.log(item_price);
    console.log(simple_talk);

  });

  module.exports = router;
