/**
 * Created by Feng OuYang on 2014-08-14.
 */
var mysql = require('mysql');
var conn;

var util = require('./util.js');

function connect_mysql() {

    util.warn("connect_mysql");
    conn = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'fcloud',
        database: 'fcloud'
    });

    conn.connect(function (err) {

        if (err) {
            util.error("mysql connect error");
            util.warn("reconnet ...");
            setTimeout(connect_mysql, 2000);//2s以后重新连接
        }

    });

    conn.on('error', function (err) {

        util.warn('db error' + err);
        // 如果是连接断开，自动重新连接
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
            util.warn("reconnet ...");
            setTimeout(connect_mysql, 1000);//1s以后重新连接
        } else {
            throw err;
        }

    });
}

connect_mysql();


process.on('exit', function (code) {

    conn.end();

    util.debug('About to exit with code:', code);

});

exports.mysql = conn;

