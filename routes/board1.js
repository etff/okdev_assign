var express = require('express');
var router = express.Router();
 
//   MySQL 로드
var mysql = require('mysql');
var pool = mysql.createPool({
    connectionLimit: 5,
    host     : 'localhost',
    user     : 'devuser',
    password : 'devpass',
    database : 'devdb'   
});
 
router.get('/', function(req, res, next) {
    res.redirect('/board1/list');
});
 
router.get('/list', function(req,res,next){
    pool.getConnection(function (err, connection) {
        var sql = "SELECT BRDNO, filename, originalname, DATE_FORMAT(BRDDATE,'%Y-%m-%d') BRDDATE" +
                   " FROM TBL_BOARD";
        connection.query(sql, function (err, rows) {
            if (err) console.error("err : " + err);
//            console.log("rows : " + JSON.stringify(rows));
 
            res.render('board1/list', {rows: rows?rows:{}});
            connection.release();
        });
    }); 
});
 
router.get('/read', function(req,res,next){
    pool.getConnection(function (err, connection) {
        var sql = "SELECT BRDNO, filename, originalname, DATE_FORMAT(BRDDATE,'%Y-%m-%d') BRDDATE"+
                   " FROM TBL_BOARD" +
                  " WHERE BRDNO=" + req.query.brdno;
            console.log("rows : " + sql);
        connection.query(sql, function (err, rows) {
            if (err) console.error("err : " + err);
            console.log("rows : " + JSON.stringify(rows));
 
            res.render('board1/read', {row: rows[0]});
            connection.release();
        });
    }); 
});
 
router.get('/form', function(req,res,next){
    if (!req.query.brdno) {
        res.render('board1/form', {row: ""});
        return;
    }
    pool.getConnection(function (err, connection) {
        var sql = "SELECT BRDNO, BRDTITLE, BRDMEMO, BRDWRITER, DATE_FORMAT(BRDDATE,'%Y-%m-%d') BRDDATE" + 
                   " FROM TBL_BOARD" +
                  " WHERE BRDNO=" + req.query.brdno;
        connection.query(sql, function (err, rows) {
            if (err) console.error("err : " + err);
 
            res.render('board1/form', {row: rows[0]});
            connection.release();
        });
    }); 
});
 
 
router.get('/delete', function(req,res,next){
    pool.getConnection(function (err, connection) {
        var sql = "DELETE FROM TBL_BOARD" +
                  " WHERE BRDNO=" + req.query.brdno;
        connection.query(sql, function (err, rows) {
            if (err) console.error("err : " + err);
 
            res.redirect('/board1/list');
            connection.release();
        });
    }); 
});
 
module.exports = router;
