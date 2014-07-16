/**
 * Created by Feng OuYang on 2014-07-16.
 */
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('/baiduyunsync.db');

var util = require('../util.js');

process.on('exit', function (code) {

    db.close();

    setTimeout(function () {
        console.log('This will not run');
    }, 0);
    console.log('About to exit with code:', code);
});

exports.db = db;

/**
 * 建表
 */
function create_table() {

    var create_user_sql = "CREATE TABLE IF NOT EXISTS ";
    create_user_sql += "user";
    create_user_sql += " (" + "id INTEGER PRIMARY KEY ,";
    create_user_sql += " username TEXT, ";
    create_user_sql += " expires_in TEXT, ";
    create_user_sql += " refresh_token TEXT, ";
    create_user_sql += " access_token TEXT, ";
    create_user_sql += " session_secret TEXT, ";
    create_user_sql += " session_key TEXT, ";
    create_user_sql += " sync_path TEXT, ";
    create_user_sql += " sync_start INTEGER, ";
    create_user_sql += " sync_end INTEGER ";
    create_user_sql += " ) ;";
    console.log("sql user:" + create_user_sql);
    db.run(create_user_sql);

    var create_quota_sql = "CREATE TABLE IF NOT EXISTS ";
    create_quota_sql += "quota";
    create_quota_sql += " (" + "id INTEGER PRIMARY KEY ,";
    create_quota_sql += " username TEXT, ";
    create_quota_sql += " quota INTEGER, ";
    create_quota_sql += " used INTEGER ";
    create_quota_sql += " ) ;";

    console.log("sql quota:" + create_quota_sql);
    db.run(create_quota_sql);

}

function init_data() {
    db.get("select * from user where username=15019484367", function (err, row) {
        if (err || row == undefined) {
            var stmt = db.prepare("INSERT INTO user (username,expires_in,refresh_token,access_token,session_secret,session_key,sync_path,sync_start,sync_end) VALUES (?,?,?,?,?,?,?,?,?)");
            stmt.run('15019484367', '2592000', '22.10adb3693423889ab9112d2b589c3673.315360000.1720833538.2537358702-3125236', '21.27f321b0a952efe51f07ea8f119ab6a3.2592000.1408065538.2537358702-3125236',
                '0fc892cc35fcd7b928b3b24468938faf', "9mnRdvW1U8f9QQIWEtrncwf5O+gbaGYppe0KFZ05Tcn3VN\\/72+app2Ts8Y5vHydyHUiiz1YInLeuOiWFtq7g3HJYUEZvZRaLew==",
                '/', '0', '0');
            stmt.finalize();
        } else {
            console.log(row);
        }
    });

}

create_table();
init_data();

/**
 * 用户信息表
 * @constructor
 */
var User = function () {
    this.id;
    this.username;
    this.expires_in;
    this.refresh_token;
    this.access_token;
    this.session_secret;
    this.session_key;
    this.sync_path;
    this.sync_start;
    this.sync_end;
}

exports.user = User;

function local_get_users(username, res) {

    var sql = "SELECT * FROM user ";
    if (username != '') {
        sql += " WHRER usename=" + username;
    }
    db.all(sql, function (err, rows) {

        if (res != undefined) {
            res.call(res, rows);
        }

    });

}
/**
 * 取数据库的用户信息
 * @param username
 * @param res
 */
function get_user(username, res) {

    local_get_users(username, res);

}

exports.get_user = get_user;


function get_users(res) {

    local_get_users('', res);
}

exports.get_users = get_users;


/**
 * 用户使用空间情况
 * @constructor
 */
var Quota = function () {

    this.quota;
    this.used;

}

exports.quota = Quota;

function insert_or_update_quota(username, param, res) {

    if (username != '') {
        var sql = "SELECT * FROM  WHERE username=" + username;
        db.all(sql, function (err, rows) {
            if (err && rows) {
                //更新数据
                db.run('UPDATE quota SET quota=? used=? WHERE username=?', param.quota, param.used, username, function (err) {
                    if (err) {
                        console.log('update quota error');
                    } else {
                        res.call(res);
                    }
                });
            } else {
                //插入数据
                db.run('INSERT INTO quota (username,quota,used) VALUES(?,?,?)', param.quota, param.used, username, function (err) {
                    if (err) {
                        console.log('insert quota error');
                    } else {
                        res.call(res);
                    }
                });
            }
        });

    } else {
        console.log(util.format_time() + " insert quota error!");
    }

}

exports.insert_or_update_quota = insert_or_update_quota;

