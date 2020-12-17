var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'demo'
})

db.connect();

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index');
});

router.get('/get-data', function (req, res, next) {
  db.query("SELECT * FROM posts", function (error, result, fields) {
    if (error) throw error
    console.log(result);
  })
  res.render('index')
});

router.post('/insert', function (req, res, next) {
  var item = {
    title: req.body.title,
    content: req.body.content,
    author: req.body.author
  };

  db.query(`INSERT INTO posts (title, content, author) VALUES ('${req.body.title}', '${req.body.content}', '${req.body.author}')`, function (error, result) {
    if (error) throw error
    console.log(result);
  })

  res.redirect('/');
});

router.post('/update', function (req, res, next) {
  var id = req.body.id;

  db.query(`UPDATE posts WHERE id=${req.body.id} SET title='${req.body.title}',content='${req.body.content}',author='${req.body.author}'`, function (error, result) {
    if (error) throw error
    console.log(result); F
  })
  res.redirect('/');
});

router.post('/delete', function (req, res, next) {
  var id = req.body.id;
  db.query(`DELETE FROM posts WHERE id=${id}`)
  res.redirect('/');
});


module.exports = router;
