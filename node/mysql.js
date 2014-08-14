/**
 * Created by Feng OuYang on 2014-08-14.
 */
var mysql = require('mysql');
var conn = mysql.createConnection({
    host: 'www.fcloud.tk',
    user: 'root',
    password: 'root',
    database: 'fcloud'
});

conn.connect();

process.on('exit', function (code) {

    conn.end();

    util.debug('About to exit with code:', code);

});

exports.mysql = conn;

