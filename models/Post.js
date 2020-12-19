var db = require("../helpers/db");

module.exports = {
  all: function (callback) {
    db.query("SELECT * FROM posts", function (err, result, fields) {
      if (err) throw err;
      return callback(result);
    });
  },
  store: function (data, callback) {
    db.query(
    `INSERT INTO posts (title, content, author, image) VALUES ('${data.title}', '${data.content}', '${data.author}', '${data.image}')`,
      function (err, result, fields) {
        if (err) throw err;
        return callback(result);
      }
    );
  },
};
