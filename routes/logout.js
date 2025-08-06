const express = require('express');
const router = express.Router();

router.post('/', function (req, res, next) {
  req.session = null;
  res.redirect('/'); // Redirect to home after logout
});

module.exports = router;