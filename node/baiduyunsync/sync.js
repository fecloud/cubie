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

var syncdb = require('./syncdb.js');

var Const = (function () {


    var APP_ID = 3125236;

    var APP_KEY = 'riDL6RfoGHR7j1SrHtZmEqsj';

    var SECRET_KEY = 'WC0h9QvmyoyZyKSw2DDkDLEKeoca8Z43';

//    var

});

//同步文件记录
var sync_record = new events.EventEmitter();

sync_record.on('dir',function(pcsfile){



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

    var url = node_util.format("https://pcs.baidu.com/rest/2.0/pcs/quota?method=info&access_token=%s",param.access_token);
    util.https_get(url,function(d){
        var obj = JSON.parse(d.toString());
        console.log(obj.quota);
        syncdb.insert_or_update_quota(param.username,obj,function(){
            //操作数据库完成
            console.log(util.format_time() + "task_quota finish!");
            sync_record.emit();
        });
    });

}

//function




task_users();