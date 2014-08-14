/**
 * Created by Feng OuYang on 2014-08-13.
 */

var mysql = require('../mysql.js').mysql;
var com = require('../com.js');
var util = require('../util.js');

/**======================表名===========================
 *
 */
var table_user = "user";
var table_oauth = "oauth";
/**====================================================
 *
 */

var start_module = process.argv[2];





/**
 * 用户密码
 * @constructor
 */
var User = function () {

    this.uname;
    this.passwd;
    this.isadmin;
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
    this.intime;

};

exports.oauth = Oauth;

/**
 * 查询用户
 * @param uname
 * @param sucess
 * @param fail
 */
function query_user(uname, sucess, fail) {

    var sql = "SELECT * FROM " + table_user;
    if (uname != '') {
        sql += " WHERE uname=?";
    }
    util.debug(sql);
    mysql.query(sql, [uname], function (err, rows) {
        util.db_query(sucess, fail, err, rows);
    });


}

exports.query_user = query_user;

/**
 * 删除用户
 * @param uname
 * @param sucess
 * @param fail
 */
function del_user(uname, sucess, fail) {

    var sql = "DELETE FROM user WHERE uname=?";
    util.debug(sql);
    mysql.query(sql, [uname], function (err, rows) {

            util.db_query(sucess, fail, err, rows);

        }
    )


}

/**
 * 插入新用户
 * @param user
 * @param sucess
 */
function insert_user(user, sucess, fail) {

    var sql = "REPLACE INTO " + table_user + "(uname,passwd,isadmin,last) VALUES (?,?,?,NOW())";
    util.debug(sql);
    mysql.query(sql, [user.uname, user.passwd, user.isadmin], function (err, rows) {

            util.db_query(sucess, fail, err, rows);

        }
    );
}

exports.insert_user = insert_user;


/**
 * 查询用户
 * @param uname
 * @param sucess
 * @param fail
 */
function query_oauth(token, sucess, fail) {

    var sql = "SELECT * FROM " + table_oauth;
    if (token != '') {
        sql += " WHERE token=?";
    }
    util.debug(sql);
    mysql.query(sql, [token], function (err, rows) {

        util.db_query(sucess, fail, err, rows);

    });

}

exports.query_oauth = query_oauth;

/**
 * 删除token
 * @param uname
 * @param sucess
 * @param fail
 */
function del_oauth(uname, sucess, fail) {

    var sql = "DELETE FROM " + table_oauth + " WHERE uname =?";
    util.debug(sql);
    mysql.query(sql, [uname], function (err, rows) {

            util.db_query(sucess, fail, err, rows);

        }
    )

}

exports.del_oauth = del_oauth;

/**
 * 删除token
 * @param uname
 * @param sucess
 * @param fail
 */
function del_oauth_token(token, sucess, fail) {

    var sql = "DELETE FROM " + table_oauth + " WHERE token=?";
    util.debug(sql);
    mysql.query(sql, [token], function (err, rows) {

            util.db_query(sucess, fail, err, rows);

        }
    )

}

exports.del_oauth_token = del_oauth_token;

/**
 * 插入新token
 * @param user
 * @param sucess
 */
function insert_oauth(oauth, sucess, fail) {

    var sql = "INSERT INTO " + table_oauth + "(token,uname,intime) VALUES (?,?,NOW())";
    util.debug(sql);
    mysql.query(sql, [oauth.token, oauth.uname], function (err, rows) {

            util.db_query(sucess, fail, err, rows);

        }
    );
}

exports.insert_oauth = insert_oauth;
