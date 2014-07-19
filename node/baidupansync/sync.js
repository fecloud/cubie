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

var Const = (function () {


    var APP_ID = 3125236;

    var APP_KEY = 'riDL6RfoGHR7j1SrHtZmEqsj';

    var SECRET_KEY = 'WC0h9QvmyoyZyKSw2DDkDLEKeoca8Z43';

//    var

});

//同步文件记录
var sync_record = new events.EventEmitter();

sync_record.on('dir', function (pcsfile) {


});


function task_users() {

    syncdb.get_users(function (rows) {

            if (rows != undefined) {
                console.log(util.format_time() + "select " + rows.length + " user");
                rows.forEach(function (row) {

                    //进入主流程
                    task_quota(row);

                });
            }

        }
    )
    ;

}

/**
 * 取用户的容量入库
 * @param param
 */
function task_quota(param) {

    var url = node_util.format("https://c.pcs.baidu.com/rest/2.0/pcs/quota?method=info&access_token=%s", param.access_token);
    util.https_get(url, function (d) {
        var obj = JSON.parse(d.toString());
        console.log(param.username + ":" + obj.quota);
        syncdb.insert_or_update_quota(param.username, obj, function () {
            //操作数据库完成
            console.log(util.format_time() + "task_quota finish!");
            sync_record.emit();
        });
    });

}

//function


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
//                    console.log(rows instanceof Array);
        if (rows instanceof Array && rows.length > 0) {
            result.data = rows[0];
//            console.log(result.data);
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
    syncdb.view_quota(params.value, function (rows) {
        console.log(rows instanceof Array);
        console.log(rows.length);
        if (rows instanceof Array && rows.length > 0) {
            result.data = rows[0];
            console.log(result.data);
            util.result_client(req, res, result);
        }
    });

}

exports.view_quota = view_quota;


task_users();