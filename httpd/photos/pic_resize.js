/**
 * Created with JetBrains WebStorm.
 * User: ouyangfeng
 * Date: 7/28/14
 * Time: 21:06
 * To change this template use File | Settings | File Templates.
 */

var events = require("events");
var emitter = new events.EventEmitter();

var fs = require('fs')
    , gm = require('gm');

var util = require('../util.js');


var queue = [];
var worker_size = 10;
var workers = new Array(worker_size);

/**
 * 任务
 * @constructor
 */
var Task = function () {

    this.file;
    this.tofile;
    this.w;
    this.h;

}

/**
 * 工作者
 * @constructor
 */
var Worker = function () {

    this.id;
    this.working;
    this.task;

}


/**
 * 初化工作者
 */
function init_workers() {

    util.debug('init_workers ' + worker_size);

    for (var i = 0; i < workers.length; i++) {

        var worker = new Worker();
        worker.id = i;
        worker.working = false;
        workers[i] = worker;
    }

}


emitter.on("req", function (worker) {

    //标记工作者在工作
    worker.working = true;

    fs.exists(worker.task.tofile, function (exists) {

        if (exists) {
            util.debug("gm rezie " + worker.task.file + " tofile" + worker.task.tofile + " not need resize");
            worker.working = false;
            util.debug('worker ' + worker.id + ' finish task req next');
            req_worker();
        } else {
            //需要resize
            util.debug("gm rezie " + worker.task.file + " tofile" + worker.task.tofile);
            gm(worker.task.file)
                .resize(worker.task.w, worker.task.h)
                .write(worker.task.tofile, function (err) {

                    //gm 出现错误
                    if (err) {
                        util.debug("gm rezie " + worker.task.file + " tofile" + worker.task.tofile + " error " + err.toString());
                    } else {
                        util.debug("gm rezie " + worker.task.file + " tofile" + worker.task.tofile + " success");
                    }
                    worker.working = false;
                    util.debug('worker ' + worker.id + ' finish task req next');
                    req_worker();

                });
        }

    });


});


/**
 * 检查空闲的工作者
 * @returns {*}
 */
function check_free_worker() {

    util.debug('check_free_worker');

    for (var i = 0; i < workers.length; i++) {

        var worker = workers[i];

        if (worker && !worker.working) {
            return worker;
        }

    }

}

/**
 * 请工作者 工作
 */
function req_worker() {

    util.debug('req_worker');

    var free_worker = check_free_worker();
    if (free_worker) {
        util.debug("find free worker id:" + free_worker.id);

        //取最后一个任务
        var task = queue.shift();
        if (task) {
            free_worker.task = task;
            //发送异步执行任务
            emitter.emit('req', free_worker);
        }else {
            util.debug('not task finish worker');
        }

    }
}

/**
 * 请求parse
 * @param file
 */
function req_rezie(file, tofile, w, h, func) {

    util.debug("req_rezie " + file + " tofile" + tofile + " req_rezie");

    var task = new Task();
    task.file = file;
    task.tofile = tofile;
    task.w = w;
    task.h = h;
    queue.push(task);

    req_worker();

}

exports.req_rezie = req_rezie;

init_workers();
