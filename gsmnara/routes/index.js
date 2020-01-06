var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  console.log("유저 접속");
  res.render('login');
});

module.exports = router;
