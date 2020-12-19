var express = require('express');
var router = express.Router();


var _ = require('lodash');
var multer = require('multer');
var Storage = require('../helpers/storage');

// setup a new instance of the Storage engine 
var storage = Storage({
	square: false,
	responsive: true,
	greyscale: false,
	quality: 90
});

var limits = {
	files: 1, // allow only 1 file per request
};

var fileFilter = function(req, file, cb) {
	// supported image file mimetypes
	var allowedMimes = ['image/jpeg', 'image/pjpeg', 'image/png', 'image/gif'];

	if (_.includes(allowedMimes, file.mimetype)) {
		// allow supported image files
		cb(null, true);
	} else {
		// throw error for invalid files
		cb(new Error('Invalid file type. Only jpg, png and gif image files are allowed.'));
	}
};

// setup multer
var upload = multer({
	storage: storage,
	limits: limits,
	fileFilter: fileFilter
});



var postController = require('../controllers/PostController');

router.get('/posts', postController.index);
router.get('/posts/create', postController.create);
router.post('/posts', upload.single('image'), postController.validate('create'), postController.store);
router.get('/posts/:postId/edit', postController.edit);
router.post('/posts/:postId', upload.single('image'), postController.validate('edit'), postController.update);

// router.post('/insert', function (req, res, next) {
//   var item = {
//     title: req.body.title,
//     content: req.body.content,
//     author: req.body.author
//   };

//   db.query(`INSERT INTO posts (title, content, author) VALUES ('${req.body.title}', '${req.body.content}', '${req.body.author}')`, function (error, result) {
//     if (error) throw error
//     console.log(result);
//   })

//   res.redirect('/');
// });

// router.post('/update', function (req, res, next) {
//   var id = req.body.id;

//   db.query(`UPDATE posts WHERE id=${req.body.id} SET title='${req.body.title}',content='${req.body.content}',author='${req.body.author}'`, function (error, result) {
//     if (error) throw error
//     console.log(result); F
//   })
//   res.redirect('/');
// });

// router.post('/delete', function (req, res, next) {
//   var id = req.body.id;
//   db.query(`DELETE FROM posts WHERE id=${id}`)
//   res.redirect('/');
// });


module.exports = router;
