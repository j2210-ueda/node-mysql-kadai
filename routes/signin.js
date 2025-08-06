const express = require('express');
const router = express.Router();
const passport = require("passport");

router.get('/', function (req, res, next) {
  const userId = req.session.userid;
  const isAuth = Boolean(userId);
  res.render("signin", {
    title: "Sign in",
    isAuth: isAuth,
  });
});

router.post('/', passport.authenticate('local', {
    successRedirect: '/todo', // ← ここを変更
    failureRedirect: '/signin',
    failureFlash: true,
  }
));

module.exports = router;
