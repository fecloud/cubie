/**
 * Created by Feng OuYang on 2014-08-14.
 */
var mysql = require('mysql');
var conn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'fcloud',
    database: 'fcloud'
});

var util = require('./util.js');

conn.connect(function(err){

    util.error("mysql connect error");
    con = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'fcloud',
        database: 'fcloud'
    });
    util.debug("reconnet ...");

});

process.on('exit', function (code) {

    conn.end();

    util.debug('About to exit with code:', code);

});

exports.mysql = conn;

