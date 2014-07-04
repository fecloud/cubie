#!/usr/bin/env nodejs

var http = require('http');
var fs = require("fs");
var url = require('url');
var formidable = require("formidable");
var webroot = process.argv[2];

if (webroot == undefined) {
    console.error("not setting webroot ,please set !");
    process.exit(1);
} else {
    console.log("webroot:" + webroot);
}


/**
 * 返回数据
 * @constructor
 */
var SFile = function () {
    this.isFile = false;
    this.isDir = false
    this.name;
    this.size;
    this.mtime;
    this.path = "";
}

/**
 * JSON 返回数据
 * @constructor
 */
var Result = function () {
    this.action;
    this.error = '';
    this.data;
}


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
}

/**
 * 格式化时间
 * @returns {*}
 */
function format_time() {
    return new Date().format("yyyy-MM-dd hh:mm:ss.S ");
}

/**
 * 返回当前目录的子目录以及文件
 */
function list_dir(params) {
    var result = new Result();
    result.action = "list";
    if (params.value) {
        //如果客户端传来的数据没有加/,自动加上
        if (params.value.substring(params.value.length - 1) != '/') {
            params.value = params.value + '/';
        }
        var dir = webroot + params.value;
        var files = fs.readdirSync(dir);
        var file_array = [];

        files.forEach(function (name) {
            // 查看文件状态
            var st = fs.statSync(dir + name);
            var f = new SFile();
            if (st.isDirectory()) {
                f.isDir = true;
                f.name = name;
                f.size = st.size;
                f.mtime = st.mtime.toLocaleString();
                f.path = params.value + name;
                file_array.push(f);
            }


        });

        files.forEach(function (name) {
            // 查看文件状态
            var st = fs.statSync(dir + "/" + name);
            var f = new SFile();
            if (st.isFile()) {
                f.isFile = true;
                f.name = name;
                f.size = st.size;
                f.mtime = st.mtime.getTime();
                f.path = params.value + name;
                file_array.push(f);
            }

        });

        result.data = file_array;
    }
    return result;
}

/**
 * 删除文件
 */
function delete_file(params) {
    var result = new Result();
    result.action = "delete";

    var path = webroot + params.value;
    //&& fs.existsSync(params.value)
    if (params && params.value && fs.existsSync(path)) {
        console.log('delete file ' + path);
        result.data = fs.unlinkSync(path);
    } else {
        result.error = "check path!";
    }
    return result;
}
/**
 * 对象封装
 * @constructor
 */


function dispath(req, res, params) {
    if (params.action) {
        if (params.action == 'list') {

            resultClient(req, res, list_dir(params));

        } else if (params.action == 'delete') {

            resultClient(req, res, delete_file(params));

        } else if (params.action == 'upload') {

            save_file(req, res, params);

        } else {

            var result = new Result;
            result.error = 'action not found!';
            console.error("action not found!");
            resultClient(req, res, result);

        }

    }
    console.log(format_time() + "dispath finish");
}

/**
 * 保存文件
 * @param req
 * @param res
 * @returns {Result}
 */
function save_file(req, res, params) {
    var result = new Result();
    result.action = "upload";
    if (!params.value) {
        result.error = 'require save path!';
    } else {
        var save_dir = webroot + params.value;
        if (save_dir.substring(save_dir.length - 1) != '/') {
            save_dir.value = save_dir + '/';
        }
        // parse a file upload
        var form = new formidable.IncomingForm();
        form.encoding = 'utf-8';
        form.uploadDir = save_dir;

        form.parse(req, function (err, fields, files) {
//            console.log(fields);
//            console.log(files);
            if (params.files != undefined) {
                var renamefiles = JSON.parse(params.files);
                renamefiles.forEach(function (name) {
                    fs.rename(files[name].path, save_dir + name);
                    console.log(format_time() + "rename " + files[name].path + " to " + save_dir + name);
                });
                result.data = renamefiles;
            } else {
                result.error = "not found files!";
            }
            resultClient(req, res, result);
        });
    }

    return result;
}

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

/**
 * 创建服务
 */
http.createServer(function (req, res) {

    console.info(format_time() + 'url:' + req.url);
    var params = url.parse(req.url, true).query;
    if (params != undefined) {
        dispath(req, res, params);
    } else {
        params = new Result();
        params.error = "check request params!";
        resultClient(req, res, params);
    }

}).listen(3000, '127.0.0.1');
console.log('Server running at http://127.0.0.1:3000/');


