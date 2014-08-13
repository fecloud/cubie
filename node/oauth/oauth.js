/**
 * Created by Feng OuYang on 2014-08-13.
 */
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('/data/app/data/oauth.db');

var com = require('../com.js');
var util = require('../util.js');

var table_user = "user";
var table_oauth = "oauth";

process.on('exit', function (code) {

    db.close();

    setTimeout(function () {
        util.debug('This will not run');
    }, 0);
    util.debug('About to exit with code:', code);
});

/**
 * 建表
 */
function create_table() {

    var create_sql = "CREATE TABLE IF NOT EXISTS ";
    create_sql += table_user;
    create_sql += " (" + "uname TEXT PRIMARY KEY ,";
    create_sql += " passwd TEXT,";
    create_sql += " isAdmin TEXT,";
    create_sql += " last DATETIME ) ;";
    util.debug("sql:" + create_sql);
    db.run(create_sql);

    create_sql = "CREATE TABLE IF NOT EXISTS ";
    create_sql += table_oauth;
    create_sql += " (" + "id INTEGER PRIMARY KEY ,";
    create_sql += "uname TEXT,";
    create_sql += " token TEXT ) ;";
    util.debug("sql:" + create_sql);
    db.run(create_sql);

}


/**
 * 用户密码
 * @constructor
 */
var User = function () {

    this.uname;
    this.passwd;
    this.isAdmin;
    this.last;

};

exports.user = User;

/**
 * token
 * @constructor
 */
var Oauth = function () {

    this.uname;
    this.token;

};

exports.oauth = Oauth;

/**
 * 查询用户
 * @param uname
 * @param res
 * @param error
 */
function query_user(uname, res, error) {

    var sql = "SELECT * FROM " + table_user;
    if (uname != '') {
        sql += " WHERE uname=?";
    }
    util.debug(sql);
    db.all(sql, uname, function (err, rows) {
        if (err) {
            util.error(err);
            if (error != undefined) {
                error.call(err);
            }
        } else if (res != undefined) {
            res.call(res, rows);
        }

    });

}

exports.query_user = query_user;

/**
 * 删除用户
 * @param uname
 * @param res
 * @param error
 */
function del_user(uname, res, error) {

    var sql = "DELETE FROM user WHERE uname =?";
    util.debug(sql);
    db.all(sql, uname,
        function (err, rows) {

            if (err) {
                util.error(err);
                if (error != undefined) {
                    error.call(err);
                }
            } else if (res != undefined) {
                res.call(res, rows);
            }

        }
    )

}

/**
 * 插入新用户
 * @param user
 * @param res
 */
function insert_user(user, res, error) {
    var sql = "REPLACE INTO " + table_user + "(uname,passwd,isAdmin,last) VALUES (?,?,?,datetime('now'))";
    util.debug(sql);
    db.all(sql, user.uname, user.passwd, user.isAdmin,
        function (err, rows) {

            if (err) {
                util.debug(util.format_time() + err);
                if (error != undefined) {
                    error.call(err);
                }
            } else if (res != undefined) {
                res.call(res, rows);
            }

        }
    );
}

exports.insert_user = insert_user;


/**
 * 查询用户
 * @param uname
 * @param res
 * @param error
 */
function query_oauth(token, res, error) {

    var sql = "SELECT * FROM " + table_user;
    if (token != '') {
        sql += " WHERE token=?";
    }
    util.debug(sql);
    db.all(sql, token, function (err, rows) {
        if (err) {
            util.error(err);
            if (error != undefined) {
                error.call(err);
            }
        } else if (res != undefined) {
            res.call(res, rows);
        }

    });

}

exports.query_oauth = query_oauth;

/**
 * 删除token
 * @param uname
 * @param res
 * @param error
 */
function del_oauth(uname, res, error) {

    var sql = "DELETE FROM oauth WHERE uname =?";
    util.debug(sql);
    db.all(sql, uname,
        function (err, rows) {

            if (err) {
                util.error(err);
                if (error != undefined) {
                    error.call(err);
                }
            } else if (res != undefined) {
                res.call(res, rows);
            }

        }
    )

}

exports.del_oauth = del_oauth;

/**
 * 删除token
 * @param uname
 * @param res
 * @param error
 */
function del_oauth_token(token, res, error) {

    var sql = "DELETE FROM oauth WHERE token =?";
    util.debug(sql);
    db.all(sql, token,
        function (err, rows) {

            if (err) {
                util.error(err);
                if (error != undefined) {
                    error.call(err);
                }
            } else if (res != undefined) {
                res.call(res, rows);
            }

        }
    )

}

exports.del_oauth_token = del_oauth_token;

/**
 * 插入新token
 * @param user
 * @param res
 */
function insert_oauth(oauth, res, error) {
    var sql = "INSERT INTO " + table_oauth + "(uname,token) VALUES (?,?)";
    util.debug(sql);
    db.all(sql, oauth.uname, oauth.token,
        function (err, rows) {

            if (err) {
                util.error(err);
                if (error != undefined) {
                    error.call(err);
                }
            } else if (res != undefined) {
                res.call(res, rows);
            }

        }
    );
}

exports.insert_oauth = insert_oauth;


/**
 * 测试数据
 */
function test_data() {

    var test_user = new User();
    test_user.uname = "admin";
    test_user.passwd = "admin";
    test_user.isAdmin = true;
    insert_user(test_user);

}

create_table();
test_data();