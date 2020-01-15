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

router.get('/', function(req, res){
    console.log("main get 방식");
    coch.cookiecheck(req,res);
    const student_id = req.cookies.student_id.student_id;
    db.query(`SELECT name FROM user_information WHERE student_code = ${student_id}`, function(err, docs){
      console.log("docs : ", docs);
        console.log(student_id + "님 로그인 성공!");
        // 쿠키 할곳
        console.log(docs[0]);
        const username = docs[0].name
        const student_id_cookie = {"student_id" : student_id};
        res.cookie("student_id", student_id_cookie);
        console.log("쿠키 생성:" , student_id_cookie);
        console.log(username);
        res.status(401).render('main',{
          "name" : username
        });
    }); 
  });
  
  router.post('/', function(req, res){
    console.log("/main 들어갔어요");
    var student_id = req.body.student_id;
    var password = req.body.password;
    var crytopassword = crypto.createHash('sha512').update(password).digest('base64');
    console.log(student_id);
    console.log(password);
    console.log(crytopassword);
    if(student_id != "" &&  password != ""){
      db.query(`SELECT * FROM user_information WHERE student_code = ${student_id}`, function(err, docs){
        console.log("docs : ", docs);
        if(err){
          throw err;
        }
        if(JSON.stringify(docs) == '[]'){
          res.status(401).send("<script>alert('회원 정보를 찾을 수 없습니다. ');window.location = '/'</script>")
        }
        else if(docs[0].password == crytopassword){
          console.log(student_id + "님 로그인 성공!");
          // 쿠키 할곳
          console.log(docs[0]);
          const username = docs[0].name
          const student_id_cookie = {"student_id" : student_id};
          res.cookie("student_id", student_id_cookie);
          console.log("쿠키 생성:" , student_id_cookie);
          console.log(username);
          res.status(401).render('main',{
            "name" : username
          });
        }
        else{
          res.status(401).send("<script>alert('잘못된 정보입력입니다. ');window.location = '/'</script>")
        }
      }); 
    }else{
      res.status(401).send("<script>alert('값을 모두 입력해주세요! ');window.location = '/'</script>")
    }
  })
  
  module.exports = router;
