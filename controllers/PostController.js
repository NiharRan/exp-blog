var _ = require('lodash');
var path = require('path');
var Post = require("../models/Post");
const { check, validationResult } = require("express-validator");

module.exports = {
  validate: function (method) {
    switch (method) {
      case "create": {
        return [check("title", "Post title is required").not().isEmpty()];
      }
    }
  },
  index: function (req, res) {
    Post.all(function (data) {
      res.render("posts/index", {
        posts: data,
        title: "Post List",
        success: req.session.success,
      });
    });
    req.session.success = "";
  },
  create: function (req, res) {
    res.render("posts/create", {
      title: "Create New Post",
      success: req.session.success,
      errors: req.session.errors,
    });
    req.session.success = "";
    req.session.errors = {};
  },
  store: async function (req, res) {
    try {
      var errors = validationResult(req);
      if (!errors.isEmpty()) {
        req.session.errors = errors.mapped();
        req.session.success = "";
        res.redirect("/posts/create");
      } else {
        var image = req.file ? req.file.filename : 'default.jpg';
        var { title, content, author } = req.body;
        await Post.store(
          {
            title: title.replace("'", "\\'"),
            content: content.replace("'", "\\'"),
            author: author,
            image: image,
          },
          function (data) {
            if (data) req.session.success = "Post Created Successfully";
            res.redirect("/posts");
          }
        );
      }
    } catch (error) {
      throw error;
    }
  },
};
