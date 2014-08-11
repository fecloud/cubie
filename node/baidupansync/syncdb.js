/**
 * Created by Feng OuYang on 2014-07-16.
 */
var sqlite3 = require('sqlite3').verbose();


var db = new sqlite3.Database('baidupansync.db');
var util = require('../util.js');

process.on('exit', function (code) {

    db.close();

    setTimeout(function () {
        util.debug('This will not run');
    }, 0);
    util.debug('About to exit with code:', code);
});

exports.db = db;

/**
 * 建表
 */
function create_table() {

    //用户表
    var create_user_sql = "CREATE TABLE IF NOT EXISTS ";
    create_user_sql += "user";
    create_user_sql += " (" + " uid INTEGER PRIMARY KEY, ";
    create_user_sql += " uname TEXT, ";
    create_user_sql += " portrait TEXT, ";
    create_user_sql += " expires_in TEXT, ";
    create_user_sql += " refresh_token TEXT, ";
    create_user_sql += " access_token TEXT, ";
    create_user_sql += " session_secret TEXT, ";
    create_user_sql += " session_key TEXT, ";
    create_user_sql += " sync_path TEXT, ";
    create_user_sql += " sync_start INTEGER, ";
    create_user_sql += " sync_end INTEGER ,";
    create_user_sql += " time DATETIME";
    create_user_sql += " ) ;";
    util.debug("sql user:" + create_user_sql);
    db.run(create_user_sql);

    //用户配容量表
    var create_quota_sql = "CREATE TABLE IF NOT EXISTS ";
    create_quota_sql += "quota";
    create_quota_sql += " (" + "username TEXT PRIMARY KEY, ";
    create_quota_sql += " quota INTEGER, ";
    create_quota_sql += " used INTEGER ,";
    create_quota_sql += " time DATETIME";
    create_quota_sql += " ) ;";

    util.debug("sql quota:" + create_quota_sql);
    db.run(create_quota_sql);

    //用户同步的所有目录文件
    var create_pcsfile_sqll = "CREATE TABLE IF NOT EXISTS ";
    create_pcsfile_sqll += "files";
    create_pcsfile_sqll += " (" + " fs_id INTEGER PRIMARY KEY ,";
    create_pcsfile_sqll += " path TEXT ,";
    create_pcsfile_sqll += " ctime INTEGER ,";
    create_pcsfile_sqll += " mtime INTEGER ,";
    create_pcsfile_sqll += " md5 TEXT ,";
    create_pcsfile_sqll += " size INTEGER ,";
    create_pcsfile_sqll += " isdir INTEGER ,";
    create_pcsfile_sqll += " username TEXT ";
    create_pcsfile_sqll += " ) ;";

    util.debug("sql files:" + create_pcsfile_sqll);
    db.run(create_pcsfile_sqll);

}


create_table();

/**
 * 用户信息表
 * @constructor
 */
var User = function () {
    this.uid;
    this.uname;
    this.portrait;//头像small image: http://tb.himg.baidu.com/sys/portraitn/item/{$portrait} large image: http://tb.himg.baidu.com/sys/portrait/item/{$portrait}
    this.expires_in;
    this.refresh_token;
    this.access_token;
    this.session_secret;
    this.session_key;
    this.sync_path;
    this.sync_start;
    this.sync_end;
    this.time;
};

exports.user = User;

function local_get_users(uid, res, error) {

    var sql = "SELECT * FROM user ";
    if (uid != '') {
        sql += " WHERE uid=" + uid;
    }
    util.debug(util.format_time() + sql);
    db.all(sql, function (err, rows) {
        if (err) {
            util.debug(util.format_time() + err);
            if (error != undefined) {
                error.call(err);
            }
        }else if (res != undefined) {
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
 * 插入新用户
 * @param user
 * @param res
 */
function insert_user(user, res, error) {
    var sql = "REPLACE INTO user(uid,uname,portrait,expires_in,refresh_token,access_token,session_secret,session_key,time) VALUES (?,?,?,?,?,?,?,?,datetime('now'))";
    util.debug(util.format_time() + sql);
    db.all(sql, user.uid, user.uname, user.portrait, user.expires_in, user.refresh_token, user.access_token, user.session_secret, user.session_key,
        function (err, rows) {

            if (err) {
                util.debug(util.format_time() + err);
                if (error != undefined) {
                    error.call(err);
                }
            }else if (res != undefined) {
                res.call(res, rows);
            }

        }
    );
}

exports.insert_user = insert_user;

/**
 * 删除帐户
 * @param req
 * @param res
 * @param params
 */
function del_user(uid, res, error) {

    var sql = "DELETE FROM user WHERE uid=?";
    util.debug(util.format_time() + sql);
    db.all(sql, uid,
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
    )
    ;

}

exports.del_user = del_user;


/**
 * 文件信息
 * @constructor
 */
var PCSFile = function () {

    this.fs_id; //文件或目录在PCS的临时唯一标识id
    this.path; //文件或目录的绝对路径。
    this.ctime; //文件或目录的创建时间。
    this.mtime; //文件或目录的最后修改时间。
    this.md5; //文件的md5值。
    this.size; //文件大小（byte）。
    this.isdir; //“0”为文件“1”为目录
    this.username; //用户名

};

exports.pcsfile = PCSFile;

/**
 * 插入或者更新一条数据
 * @param pcsfile
 */
function pcsfile_replace(pcsfile) {
    var sql = "REPLACE INTO files(fs_id,path,ctime,mtime,md5,size,isdir,username) VALUES (?,?,?,?,?,?,?,?)";
    db.run(sql, pcsfile.fs_id, pcsfile.path, pcsfile.ctime, pcsfile.mtime, pcsfile.md5, pcsfile.size, pcsfile.isdir, pcsfile.username, function (err) {
        if (err) {

            util.debug(util.format_time() + err);
        }

    });
}

exports.pcsfile_replace = pcsfile_replace;

