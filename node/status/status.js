var os = require('os')
var exec = require('child_process').exec,
    child;


var common = require('./../common.js');
var util = require('./../util.js');

var service_status = function () {

    this.fm = false;
    this.arduino = false;
    this.baiduyunsync = false;
    this.status = false;
    this.version;
    this.platform;
    this.uptime;
    this.arch;
    this.core;
    this.network;
}

/**
 * 所有服务的运行状态
 */
function status(req, res, params) {

    var result = new common.web_result();
    result.action = 'status';
    var service_s = new service_status();

    child = exec("ps -ef | grep 'httpd.js'",
        function (error, stdout, stderr) {
            var out = stdout;
            if (out && out != '') {

                //查询所有服务的状态
                if (out.indexOf('fm') > 0) {
                    service_s.fm = true;
                }

                if (out.indexOf('arduino') > 0) {
                    service_s.arduino = true;
                }

                if (out.indexOf('baiduyunsync') > 0) {
                    service_s.baiduyunsync = true;
                }

                if (out.indexOf('status') > 0) {
                    service_s.status = true;
                }

            }
            service_s.arch = process.arch;
            service_s.platform = process.platform;
            service_s.version = process.version;
            service_s.uptime = process.uptime();
            service_s.core = os.cpus().length;
            service_s.network = os.networkInterfaces();
            result.data = service_s;
            util.result_client(req, res, result);

        });

}

exports.status = status;

/**
 * 服务器负载
 */
function uptime(req, res, params) {

    var result = new common.web_result();
    result.action = 'uptime';

    child = exec("uptime",
        function (error, stdout, stderr) {
            var out = stdout;
            if (out && out != '') {
                var arr = out.match(/\d+\.+\d+/g);
                console.log(arr);
                if (arr != null) {
                    result.data = arr.join(" ");
                }
            }
            util.result_client(req, res, result);

        });

}

exports.uptime = uptime;


/**
 * 查看磁盘空间
 * @param req
 * @param res
 * @param params
 */
function df(req, res, params) {

    var result = new common.web_result();
    result.action = 'df';

    child = exec("df -h |grep " + params.value +" | head -n 1",
        function (error, stdout, stderr) {
            var out = stdout;
            if (out && out != '') {
                var arr = out.split(" ");
                var re_arr = [];
                console.log(arr);
                if (null != arr) {
                    arr.forEach(function (a) {
                        if (a != '') {
                            re_arr.push(a);
                        }
                    });
                    result.data = re_arr;
                }
            }
            util.result_client(req, res, result);

        });

}

exports.df = df;