var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
const mysql = require('mysql');
const crypto = require('crypto'); 

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended : true}));

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


/* GET home page. */
router.get('/', function(req, res) {
  console.log("유저 접속");
  res.render('login');
});

router.get('/register', function(req, res){
  console.log("회원가입 창 접속");
  res.render('register')

})

router.post('/main', function(req, res){
  console.log("/main 들어갔어요");
  var student_id = req.body.student_id;
  var password = req.body.password;
  var crytopassword = crypto.createHash('sha512').update(password).digest('base64');
  console.log(student_id);
  console.log(password);
  console.log(crytopassword);
  if(student_id != "" &&  password != ""){
    db.query(`SELECT password FROM user_information WHERE student_code = ${student_id}`, function(err, docs){
      if(err){
        throw err;
      }
      if(docs[0].password == crytopassword){
        console.log(student_id + "님 로그인 성공!");
        res.status(401).render('main')
      }else{
        res.status(401).send("<script>alert('입력한 정보가 올바르지 않습니다. ');window.location = '/'</script>")
      }
    }); 
  }else{
    res.status(401).send("<script>alert('값을 모두 입력해주세요! ');window.location = '/'</script>")
  }
})

router.post('/getinformation', function(req, res){
  console.log("회원가입 정보삽입을 할게요.");
  var student_id = req.body.student_id;
  var name = req.body.name;
  var discrodid = req.body.discordid;
  var password = req.body.password;
  var repassword = req.body.RePassWord;

  console.log(student_id);
  console.log(name);
  console.log(discrodid);
  console.log(password);
  console.log(repassword);
  if(student_id != "" && name != "" && discrodid != "" && password != "" && repassword != ""){
      if(password == repassword){
          if(password.length >= 3){ //회원 가입 번호 길이
              if(Number(student_id) >= 1101 && Number(student_id) < 3422){
                var crytopassword = crypto.createHash('sha512').update(password).digest('base64');
                db.query(`SELECT name FROM user_information WHERE student_code = ${student_id}`, function(err, docs){
                  if(err){
                    throw err;
                  }
                  console.log("docs :", docs);
                  if(JSON.stringify(docs) == '[]'){
                    db.query(`INSERT INTO user_information (student_code, name, discord_id, password) VALUES(${student_id}, "${name}", "${discrodid}", "${crytopassword}")`, function(err, result, fields){
                      if(err){
                         throw err;
                      }
                      res.status(401).send("<script>alert('회원가입이 성공적으로 되었습니다.!!');window.location = '/'</script>")
                      console.log("삽입");
                    });
                  }else{
                    res.status(401).send("<script>alert('이미 가입된 학생입니다.');window.location = '/register'</script>")
                  }
                });
              }else{
                  res.status(401).send("<script>alert('학번을 제대로 입력해주세요.');window.location = '/register'</script>")
              }
          }else{
              res.send("<script>alert('비밀번호가 8글자 이내입니다.')</script>");
              res.status(401).send("<script>alert('비밀번호가 8글자 이내입니다.');window.location = '/register'</script>")
          }
      }else{
        res.status(401).send("<script>alert('비밀번호가 일치하지 않습니다.');window.location = '/register'</script>")
      }
  }else{
    res.status(401).send("<script>alert('값을 모두 입력해주세요!');window.location = '/register'</script>")
  }         
});

module.exports = router;
