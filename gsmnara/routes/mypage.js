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
    coch.cookiecheck(req,res);
    console.log("mypage접속");
    console.log(req.cookies.student_id.student_id);
    const student_id = req.cookies.student_id.student_id;
    db.query(`SELECT * FROM user_information WHERE student_code = ${student_id}`, function(err, docs){
      console.log("docs : ", docs);
        console.log(student_id + "님 로그인 성공!");
        // 쿠키 할곳
        console.log(docs[0]);
        const username = docs[0].name
        const student_id_cookie = {"student_id" : student_id};
        res.cookie("student_id", student_id_cookie);
        console.log("쿠키 생성:" , student_id_cookie);
        console.log(username);
        res.status(401).render('mypage',{
          "name" : username,
          "student_id" : student_id,
          "discord_id" : docs[0].discord_id,
          "picture_url" : docs[0].picture_url
        });
    }); 
});

router.post('/changeinformation',  upload.single('userfile'), function(req, res){
  console.log("changeinformation접속");
  let student_id = req.cookies.student_id.student_id;
  let student_name = req.body.name;
  let discord_id = req.body.discordid;
  let newpassword = req.body.newpassword;
  let newrepassword = req.body.newrePassWord;
  let originalpassword = req.body.originalPassWord;
  
  db.query(`SELECT * FROM user_information WHERE student_code = ${student_id}`, function(err, docs){
    console.log("docs : ", docs);
    var crytopassword = crypto.createHash('sha512').update(originalpassword).digest('base64');
    if(docs[0].password == crytopassword){
        db.query(`UPDATE user_information SET name = '${student_name}', discord_id = '${discord_id}' WHERE student_code = ${student_id}`, function(err, docs){
          if(err){
              throw err;
          }
          console.log("이름 아이디 수정");  
          console.log(req.file);
          if(req.file){
            db.query(`UPDATE user_information SET picture_url = '${req.file.filename}' WHERE student_code = ${student_id}`, function(err, docs){
              if(err){
                  throw err;
              }
              console.log("사진 경로 변경");  
          });
          }
          if(newpassword && newrepassword){
            if(newpassword == newrepassword){
              if(newpassword.length < 3){ //비밀번호 경로
                res.status(401).send("<script>alert('비밀번호가 8글자 이내입니다.'); window.location = '/mypage'</script>")  
              }
              var newcrytopassword = crypto.createHash('sha512').update(newpassword).digest('base64');
                db.query(`UPDATE user_information SET password = '${newcrytopassword}' WHERE student_code = ${student_id}`, function(err, docs){
                  if(err){
                      throw err;
                  }
                  console.log("비밀번호 변경");  
                  res.status(401).send("<script>alert('정상적으로 수정되었습니다.');window.location = '/mypage'</script>")
              });
            }else{
              res.status(401).send("<script>alert('새로운 비밀번호 정보가 올바르지 않습니다.'); window.location = '/mypage'</script>")  
            }
          }
          else{
            res.status(401).send("<script>alert('정상적으로 수정되었습니다.');window.location = '/mypage'</script>")
          }
      });
    }else{
      res.status(401).send("<script>alert('비밀번호가 올바르지 않습니다.');window.location = '/mypage'</script>")
    }
  });     
});
module.exports = router;  