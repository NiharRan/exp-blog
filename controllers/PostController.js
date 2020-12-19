var _ = require("lodash");
var path = require("path");
var fs = require("fs");
var Post = require("../models/Post");
const { check, validationResult } = require("express-validator");

module.exports = {
  validate: function (method) {
    switch (method) {
      case "create": {
        return [check("title", "Post title is required").not().isEmpty()];
      }
      case "edit": {
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
        var image = req.file ? req.file.filename : "default.jpg";
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
  edit: async function (req, res) {
    await Post.find(req.params.postId, function (data) {
      res.render("posts/edit", {
        title: `Edit ${data.title}'s Info`,
        post: data[0],
      });
    });
  },
  update: async function (req, res) {
    var postId = req.params.postId;
    try {
      var errors = validationResult(req);
      if (!errors.isEmpty()) {
        req.session.errors = errors.mapped();
        req.session.success = "";
        res.redirect(`/posts/${postId}/edit`);
      } else {
        var image = req.body.old_image;
        if (req.file) {
          if (fs.existsSync(`${__dirname}/posts/responsive/lg/${image}`))
            fs.unlinkSync(
              `${DIR}/posts/responsive/lg/${image}`,
              function (err) {
                if (err) {
                  console.log(err);
                  return;
                }
              }
            );
          if (fs.existsSync(`${__dirname}/posts/responsive/md/${image}`))
            fs.unlinkSync(
              `${DIR}/posts/responsive/md/${image}`,
              function (err) {
                if (err) {
                  console.log(err);
                  return;
                }
              }
            );
          if (fs.existsSync(`${__dirname}/posts/responsive/sm/${image}`))
            fs.unlinkSync(
              `${DIR}/posts/responsive/sm/${image}`,
              function (err) {
                if (err) {
                  console.log(err);
                  return;
                }
              }
            );
          image = req.file.filename;
        }
        var { title, content, author } = req.body;
        await Post.update(
          postId,
          {
            title: title.replace("'", "\\'"),
            content: content.replace("'", "\\'"),
            author: author,
            image: image,
          },
          function (data) {
            if (data) req.session.success = "Post Updated Successfully";
            res.redirect("/posts");
          }
        );
      }
    } catch (error) {
      throw error;
    }
  },
};
