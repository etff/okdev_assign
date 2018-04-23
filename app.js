var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var multer = require('multer');
var mysql = require('mysql');

var app = express();
var connection = mysql.createConnection({
  host: 'localhost',
  user: 'devuser',
  password: 'devpass',
  database: 'devdb'
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/board1', require('./routes/board1'));

app.use(multer({
  dest: './public/uploads/',
  rename: function (fieldname, filename) {
    return Date.now();
  },
  onFileUploadStart: function (file) {
    console.log(file.originalname + ' is starting ...')
  },
  onFileUploadComplete: function (file) {
    console.log(file.fieldname + ' uploaded to  ' + file.path)
  }
}).any());


app.post('/api/photo', function (req, res) {
  var file = req.files[0];
  var filename = file.filename;
  var original = file.originalname;

  connection.connect();

  connection.query(`INSERT INTO tbl_board (brdno, filename, originalname, BRDDATE)
  VALUES (null, ?, ?, now());`,
    [filename, original]
    , function (error, results, fields) {
      if (error) throw error;
      console.log('The solution is: ', results[0]);
    });
  connection.end();
  res.redirect('/board1/list');
  //  res.end(JSON.stringify(req.files));
});




// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});



module.exports = app;
