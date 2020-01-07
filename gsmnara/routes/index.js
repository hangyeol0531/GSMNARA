var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended : true}));

/* GET home page. */
router.get('/', function(req, res) {
  console.log("유저 접속");
  res.render('login');
});

router.get('/register', function(req, res){
  console.log("회원가입 창 접속");
  res.render('register')

})

router.get('/main', function(req, res){
  console.log("메인 창 접속");
  res.render('main')
})

router.post('/getinformation', function(req, res){
  console.log("회원가입 정보삽입을 할게요.");
  var student_id = req.body.student_id;
  console.log(student_id);
  console.log(student_id);
  res.render('main');
});

module.exports = router;
