var exec = require('child_process').exec,
    child;


var common = require('./../common.js');
var util = require('./../util.js');

var service_status = function () {

    this.fm = true;
    this.arduino = false;
    this.baiduyunsync = false;
    this.status = false;
    this.version;
    this.platform;
    this.uptime;
    this.arch;
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
                if (out.indexOf('fm')) {
                    service_s.fm = true;
                }

                if (out.indexOf('arduino')) {
                    service_s.arduino = true;
                }

                if (out.indexOf('baiduyunsync')) {
                    service_s.baiduyunsync = true;
                }

                if (out.indexOf('status')) {
                    service_s.status = true;
                }

            }
            service_s.arch = process.arch;
            service_s.platform = process.platform;
            service_s.version = process.version;
            service_s.uptime = process.uptime();
            result.data = service_s;
            util.result_client(req,res,result);

        });

}

exports.status = status;