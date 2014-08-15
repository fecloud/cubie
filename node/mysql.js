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

conn.connect();

process.on('exit', function (code) {

    conn.end();

    util.debug('About to exit with code:', code);

});

exports.mysql = conn;

