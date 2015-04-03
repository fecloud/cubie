/**
 * Created by Feng OuYang on 2014-08-14.
 */
var mysql = require('mysql');

var util = require('./util.js');

var pool = mysql.createPool({
        connectionLimit: 2,
        host: 'rds6v2uvvrennaa.mysql.rds.aliyuncs.com',
        user: 'db7k81jhgfilemanager13wla',
        password: 'ouyangfeng',
        database: 'db7k81jhgfilemanager13wla'
    }
);

exports.mysql = pool;//conn;

