#!/usr/bin/env nodejs

var http = require('http');
var url = require('url');
var common = require('./common.js');
var util = require('./util.js');
var fm = require('./fm.js');
var arduino = require('./arduino.js');

var webroot = process.argv[2];

if (webroot == undefined) {
    console.error("not setting webroot ,please set !");
    process.exit(1);
} else {
    console.log("webroot:" + webroot);
}


/**
 * 对象封装
 * @constructor
 */


function dispath(req, res, params) {
    if (params.action) {
        if (params.action == 'list') {


            util.result_client(req, res, fm.list_dir(params));

        } else if (params.action == 'delete') {

            util.result_client(req, res, fm.delete_file(params));

        } else if (params.action == 'newfolder') {

            fm.new_dir(req, res, params);

        } else if (params.action == 'upload') {

            fm.save_file(req, res, params);

        } else if(params.action == 'rename'){

            fm.rename(req,res,params);

        } else if(params.action == 'search'){

            fm.search(req,res,params);

        } else if (params.action == 'save_temperature') {

            util.result_client(req, res,arduino.save_temperature(params));

        } else if(params.action == 'list_temperature'){

             arduino.list_temperature(req,res,params);

        }else {

            var result = new common.web_result();
            result.error = 'action not found!';
            console.error("action not found!");
            util.result_client(req, res, result);

        }

    }
    console.log(util.format_time() + "dispath finish");
}


/**
 * 创建服务
 */
http.createServer(function (req, res) {

    console.info(util.format_time() + 'url:' + req.url);
    var params = url.parse(req.url, true).query;
    var req_p = new common.req_param();

    if (params != undefined && params.action != undefined && params.value != undefined) {
        req_p.action = params.action;
        req_p.value = params.value;
        req_p.files = params.files;
        req_p.target = params.target;
        req_p.query = params.query;
        req_p.skip = params.skip;
        req_p.num = params.num;
        dispath(req, res, req_p);
    } else {
        req_p.error = "check request params!";
        util.result_client(req, res, req_p);
    }

}).listen(3000, '127.0.0.1');
console.log('Server running at http://127.0.0.1:3000/');


