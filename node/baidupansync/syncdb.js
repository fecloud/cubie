/**
 * Created by Feng OuYang on 2014-07-16.
 */
var node_util = require('util');

var mysql = require('../mysql.js').mysql;
var util = require('../util.js');


/**======================表名===========================
 *
 */
var table_baidupansync_files = "baidupansync_files";
var table_baidupansync_user = "baidupansync_user";
/**====================================================
 *
 */


/**
 * 用户信息表
 * @constructor
 */
var User = function () {
    this.uid;
    this.uname;
    this.portrait;//头像small image: http://tb.himg.baidu.com/sys/portraitn/item/{$portrait} large image: http://tb.himg.baidu.com/sys/portrait/item/{$portrait}
    this.expisuccess_in;
    this.refsuccessh_token;
    this.access_token;
    this.session_secret;
    this.session_key;
    this.sync_path;
    this.sync_start;
    this.sync_end;
    this.time;
};

exports.user = User;

/**
 * 取用户信息
 * @param uid
 * @param sucess
 * @param fail
 */
function local_get_users(uid, sucess, fail) {

    var sql = "SELECT * FROM " + table_baidupansync_user;
    if (uid != '') {
        sql += " WHERE uid=" + uid;
    }
    util.debug(sql);
    mysql.query(sql, function (err, rows) {
        util.db_query(sucess, fail, err, rows);

    });

}
/**
 * 取数据库的用户信息
 * @param username
 * @param success
 */
function get_user(username, success) {

    local_get_users(username, success);

}

exports.get_user = get_user;


function get_users(success) {

    local_get_users('', success);
}

exports.get_users = get_users;


/**
 * 插入新用户
 * @param user
 * @param success
 */
function insert_user(user, success, fail) {

    var sql = node_util.format("REPLACE INTO %s (uid,uname,portrait,expires_in,refresh_token,access_token,session_secret,session_key,time) VALUES (?,?,?,?,?,?,?,?,NOW())", table_baidupansync_user);
    util.debug(sql);
    mysql.query(sql, [user.uid, user.uname, user.portrait, user.expires_in, user.refresh_token, user.access_token, user.session_secret, user.session_key], function (err, rows) {

            util.db_query(success, fail, err, rows);

        }
    );
}

exports.insert_user = insert_user;

/**
 * 删除帐户
 * @param req
 * @param success
 * @param params
 */
function del_user(uid, success, fail) {

    var sql = "DELETE FROM user WHERE uid=?";
    util.debug(sql);
    mysql.query(sql, [uid], function (err, rows) {

            util.db_query(success, fail, err, rows);

        }
    )

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

    var sql = node_util.format("REPLACE INTO %s (fs_id,path,ctime,mtime,md5,size,isdir,username) VALUES (?,?,?,?,?,?,?,?)", table_baidupansync_files);
    mysql.query(sql, [pcsfile.fs_id, pcsfile.path, pcsfile.ctime, pcsfile.mtime, pcsfile.md5, pcsfile.size, pcsfile.isdir, pcsfile.username], function (err, rows) {

        if (err) {
            util.debug(err);
        }

    });
}

exports.pcsfile_replace = pcsfile_replace;

