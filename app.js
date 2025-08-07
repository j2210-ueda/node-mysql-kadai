const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const homeRouter = require('./routes/home');

const app = express();


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


// authorization
require("./config/passport")(app);

// router
app.use('/', require('./routes'));
app.use('/todo', require('./routes/todo'));
app.use('/home', homeRouter);


// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // エラー内容をコンソールに出力
  console.error(err);

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
