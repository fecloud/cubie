/**
 * Created by Feng OuYang on 2014-08-14.
 */
var mysql = require('mysql');

var util = require('./util.js');

var pool = mysql.createPool({
        connectionLimit: 2,
        host: 'localhost',
        user: 'root',
        password: 'fcloud',
        database: 'fcloud'
    }
);

exports.mysql = pool;//conn;

