/**
 * Created by Feng OuYang on 2014-07-08.
 */
var http = require('http');
var https = require('https');
var log4js = require('log4js');

log4js.replaceConsole(true);
//log4js.loadAppender('file');
//log4js.addAppender(log4js.appenders.util());
//log4js.addAppender(log4js.appenders.file('/var/log/httpd.' + process.argv[2] + ".log"));

var logger = log4js.getLogger();
logger.setLevel('TRACE');


Date.prototype.format = function (format) {
    var o = {
        "M+": this.getMonth() + 1, //month
        "d+": this.getDate(),    //day
        "h+": this.getHours(),   //hour
        "m+": this.getMinutes(), //minute
        "s+": this.getSeconds(), //second
        "q+": Math.floor((this.getMonth() + 3) / 3),  //quarter
        "S": this.getMilliseconds() //millisecond
    }
    if (/(y+)/.test(format)) format = format.replace(RegExp.$1,
        (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)if (new RegExp("(" + k + ")").test(format))
        format = format.replace(RegExp.$1,
            RegExp.$1.length == 1 ? o[k] :
                ("00" + o[k]).substr(("" + o[k]).length));
    return format;
};

/**
 * 格式化时间
 * @returns {*}
 */
function format_time() {
    return new Date().format("yyyy-MM-dd hh:mm:ss.S ");
}

exports.format_time = format_time;

/**
 * 向客户端回复json
 * @param req
 * @param res
 * @param result
 */
function resultClient(req, res, result) {
    res.setHeader('Content-Type', 'application/json;charset=UTF-8');
    res.write(JSON.stringify(result));
    res.end();
}

exports.result_client = resultClient;

/**
 * https get
 * @param url
 * @param sucess
 * @param error
 */
function https_get(url, sucess, error) {
    https.get(url,function (res) {
        debug(format_time() + "url:" + url + " statusCode: ", res.statusCode);
//       util.debug("headers: ", res.headers);

        res.on('data', function (d) {
            if (sucess != undefined) {
                sucess.call(sucess, d);
            }
        });

    }).on('error', function (e) {
            if (error != undefined) {
                error.call(error, e);
            }
            error(e);
        });

}

exports.https_get = https_get;

/**
 * http get
 * @param url
 * @param sucess
 * @param error
 */
function http_get(url, sucess, error) {
    http.get(url,function (res) {
        debug(format_time() + "url:" + url + " statusCode: ", res.statusCode);
        debug("headers: ", res.headers);

        res.on('data', function (d) {
            if (sucess != undefined) {
                sucess.call(sucess, d);
            }
        });

    }).on('error', function (e) {
            if (error != undefined) {
                error.call(error, e);
            }
            error(e);
        });

}

exports.http_get = http_get;

function trace(message) {

    logger.trace(message);

}

exports.trace = trace;


function debug(message) {

    logger.debug(message);

}

exports.debug = debug;

function info(message) {

    logger.info(message);

}

exports.info = info;

function warn(message) {

    logger.warn(message);

}

exports.warn = warn;

function error(message) {

    logger.error(message);

}

exports.error = error;

function fatal(message) {

    logger.fatal(message);

}

exports.fatal = fatal;

