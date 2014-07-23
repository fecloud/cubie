/**
 * Created with JetBrains WebStorm.
 * User: ouyangfeng
 * Date: 7/15/14
 * Time: 23:19
 * To change this template use File | Settings | File Templates.
 */
var node_util = require('util');
var events = require('events');


var util = require('../util.js');
var common = require('../common.js');
var syncdb = require('./syncdb.js');

//var Const = (function () {


var APP_ID = 3125236;

var APP_KEY = 'riDL6RfoGHR7j1SrHtZmEqsj';

var SECRET_KEY = 'WC0h9QvmyoyZyKSw2DDkDLEKeoca8Z43';

var OAUTH_URL = "https://openapi.baidu.com/oauth/2.0/authorize";

var TOKEN_URL = "https://openapi.baidu.com/oauth/2.0/token";

var USERINFO_URL = "https://openapi.baidu.com/rest/2.0/passport/users/getLoggedInUser";

var PCS_URL = "https://c.pcs.baidu.com/rest/2.0/pcs/";

//});

//同步文件记录
var sync_record = new events.EventEmitter();

sync_record.on('dir', function (pcsfile) {


});


//function task_users() {
//
//    syncdb.get_users(function (rows) {
//
//            if (rows != undefined) {
//                uitl.debug(util.format_time() + "select " + rows.length + " user");
//                rows.forEach(function (row) {
//
//                    //进入主流程
//                    task_quota(row);
//
//                });
//            }
//
//        }
//    )
//    ;
//
//}


/**
 * 查看同步帐户
 */
function list_user(req, res, params) {

    var result = new common.web_result();
    result.action = 'list_user';
    syncdb.get_user("", function (rows) {
        result.data = rows;
        util.result_client(req, res, result);
    });

}

exports.list_user = list_user;

/**
 * 查看同步帐户
 */
function view_user(req, res, params) {

    var result = new common.web_result();
    result.action = 'view_user';
    syncdb.get_user(params.value, function (rows) {
        if (rows instanceof Array && rows.length > 0) {
            result.data = rows[0];
            util.result_client(req, res, result);
        }
    });

}

exports.view_user = view_user;

/**
 * 查询用的配额
 * @param req
 * @param res
 * @param params
 */
function view_quota(req, res, params) {

    var result = new common.web_result();
    result.action = 'view_quota';
    syncdb.get_user(params.value, function (rows) {
        if (rows instanceof Array && rows.length > 0) {
            var user_info = data = rows[0];
            //http
            var url = node_util.format("%squota?method=info&access_token=%s", PCS_URL, user_info.access_token);

            util.https_get(url, function (data) {
                result.data = data.toString();
                result.time = new Date().format("yyyy-MM-dd hh:mm:ss");
                uitl.debug(util.format_time() + "baidu get quota:" + data.toString());
                util.result_client(req, res, result);

            }, function () {
                result.error = "fail";
                util.result_client(req, res, result);

            });


        } else {
            result.error = "fail";
            util.result_client(req, res, result);
        }
    });

}

exports.view_quota = view_quota;

/**
 * 返回百度网盘授权地址
 * @param req
 * @param res
 * @param params
 */
function get_authorization_url(req, res, params) {

    var str = node_util.format("%s?response_type=code&client_id=%s&redirect_uri=oob&&scope=basic%20netdisk", OAUTH_URL, APP_KEY);

    var result = new common.web_result();
    result.action = 'get_authorization_url';
    result.data = str;
    util.result_client(req, res, result);

}

exports.get_authorization_url = get_authorization_url;

/**
 * 返回百度网盘token
 * @param req
 * @param res
 * @param params
 */
function get_user_access_token(req, res, params) {

    var result = new common.web_result();
    result.action = 'get_user_access_token';

    var url = node_util.format("%s?grant_type=authorization_code&code=%s&client_id=%s&client_secret=%s&redirect_uri=oob", TOKEN_URL, params.value, APP_KEY, SECRET_KEY);
    util.https_get(url, function (data) {
        result.data = data.toString();
        uitl.debug(util.format_time() + "baidu get token:" + data.toString());
        util.result_client(req, res, result);

    }, function () {
        result.error = "fail";
        util.result_client(req, res, result);

    });

}

exports.get_user_access_token = get_user_access_token;


/**
 * 添加用户
 */
function add_user(req, res, params) {

    var result = new common.web_result();
    result.action = 'add_user';

    var baiduvalidate = JSON.parse(params.value);//token
    if (baiduvalidate != undefined) {

        var url = node_util.format("%s?access_token=%s", USERINFO_URL, baiduvalidate.access_token);
        util.https_get(url, function (data) {
            result.data = data.toString();
            uitl.debug(util.format_time() + "baidu get userinfo:" + data.toString());
            var baidu_user = JSON.parse(data.toString());
            var user = new syncdb.user();
            user.uid = baidu_user.uid;
            user.uname = baidu_user.uname;
            user.portrait = baidu_user.portrait;
            user.expires_in = baiduvalidate.expires_in;
            user.refresh_token = baiduvalidate.refresh_token;
            user.access_token = baiduvalidate.access_token;
            user.session_secret = baiduvalidate.session_secret;
            user.session_key = baiduvalidate.session_key;
            syncdb.insert_user(user);
            util.result_client(req, res, result);

        }, function () {
            result.error = "fail";
            util.result_client(req, res, result);

        });

    }


}

exports.add_user = add_user;

/**
 *  删除帐户
 * @param req
 * @param res
 * @param params
 */
function del_user(req, res, params) {

    var result = new common.web_result();
    result.action = 'del_user';
    syncdb.del_user(params.value, function (rows) {

        //成功删除
        result.data = "OK";
        util.result_client(req, res, result);

    }, function () {

        result.error = "Fail";
        util.result_client(req, res, result);

    });

}

exports.del_user = del_user;

//task_users();