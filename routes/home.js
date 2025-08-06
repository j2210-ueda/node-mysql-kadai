const express = require('express');
const router = express.Router();

//existingcode
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated && req.isAuthenticated()) {
    return next();
  }
  res.redirect('/signin');
}

router.get('/', ensureAuthenticated, (req, res) => {
  res.render('home', {
    title: 'ホーム',
    isAuth: true,
    user: req.user
  });
});
//existingcode
module.exports = router;