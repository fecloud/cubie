/**
 * Created by Feng OuYang on 2014-07-08.
 */
var http = require('http');
var https = require('https');


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
    https.get(url, function (res) {
        console.log(format_time() + "url:" + url + " statusCode: ", res.statusCode);
//       console.log("headers: ", res.headers);

        res.on('data', function (d) {
            if (sucess != undefined) {
                sucess.call(sucess, d);
            }
        });

    }).on('error', function (e) {
        if (error != undefined) {
            error.call(error, e);
        }
        console.error(e);
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
    http.get(url, function (res) {
        console.log(format_time() + "url:" + url + " statusCode: ", res.statusCode);
        console.log("headers: ", res.headers);

        res.on('data', function (d) {
            if (sucess != undefined) {
                sucess.call(sucess, d);
            }
        });

    }).on('error', function (e) {
        if (error != undefined) {
            error.call(error, e);
        }
        console.error(e);
    });

}

exports.http_get = http_get;