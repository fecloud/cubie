/**
 * Created by Feng OuYang on 2014-07-08.
 */
var http = require('http');
var https = require('https');
var crypto = require('crypto');
var log4js = require('log4js');

var err_const = require('./error.js');
var com = require('./com.js');

var start_module = process.argv[2];

//log4js.configure({
//    appenders: [
//        { type: 'file', filename: '/var/log/http/' + start_module + '.log', category: 'default' },
//        { type: 'file', filename: '/var/log/http/' + 'access.' + start_module + '.log', category: 'access' }
//    ]
//});
log4js.configure({
    appenders: [
        { type: 'console', category: 'default' },
        { type: 'console', category: 'access' }
    ]
});

//普通日志
var logger = log4js.getLogger('default');
logger.setLevel('TRACE');

//访问日志
var access_logger = log4js.getLogger('access');
access_logger.setLevel('DEBUG');


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

    return new Date().format("yyyy-MM-dd hh:mm:ss.S");
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
        debug("https_get url:" + url + " statusCode: ", res.statusCode);
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
        debug("http_get url:" + url + " statusCode:", res.statusCode);
//        debug("headers: ", res.headers);

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

/**
 * 根据后缀判断是否是图片
 * @param file
 * @returns {boolean}
 */
function is_pic(file) {

    if (file) {

        var last = file.lastIndexOf('.');
        var fix = file.substring(last + 1);
        fix = fix.toLowerCase();
        if (fix == 'jpg' || fix == 'png' || fix == 'bmp' || fix == 'jpeg') {
            return true;
        }
    }

    return false;

}

exports.is_pic = is_pic;

/**
 * 字符串md5
 * @param string
 * @returns {*}
 */
function md5String(string) {

    var md5 = crypto.createHash('md5');
    md5.update(string);
    return md5.digest('hex');

}

exports.md5_string = md5String;

/**
 * 常规数据库回调
 * @param res
 * @param fail
 * @param err
 * @param rows
 */
function db_query(sucess, fail, err, rows) {

    if (err) {
        error(err);
        if (fail != undefined) {
            fail.call(fail);
        }
    } else if (sucess != undefined) {
        sucess.call(sucess, rows);
    }

}


exports.db_query = db_query;

/**
 * 业务失败
 * @param req
 * @param res
 * @param web_result
 */
function bs_notfound(req, res) {
    var web_result = new com.web_result();
    web_result.error = err_const.err_404;
    resultClient(req, res, web_result);

}

exports.bs_notfound = bs_notfound;

/**
 * 业务失败
 * @param req
 * @param res
 * @param web_result
 */
function bs_fail(req, res) {
    var web_result = new com.web_result();
    web_result.error = err_const.err_500;
    resultClient(req, res, web_result);

}

exports.bs_fail = bs_fail;


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

function access(url) {

    access_logger.debug(url);

}

exports.access = access;

