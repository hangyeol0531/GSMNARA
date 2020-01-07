var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  console.log("유저 접속");
  res.render('login');
});

router.get('/register', function(req, res){
  console.log("회원가입 창 접속");
  res.render('register')
})
module.exports = router;
