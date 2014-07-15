#!/usr/bin/env nodejs

var http = require('http');
var url = require('url');
var route = new require('./dispath.js').route;
var util = require('./util.js');


var webroot = process.argv[2];

if (webroot == undefined) {
    console.error("not setting webroot ,please set !");
    process.exit(1);
} else {
    console.log("webroot:" + webroot);
}


/**
 * 创建服务
 */
http.createServer(function (req, res) {

    console.info(util.format_time() + 'url:' + req.url);
    var params = url.parse(req.url, true).query;

    if (params != undefined && params.action != undefined && params.value != undefined) {
        route[params.action].call(route,req, res, params);
    } else {
        req_p.error = "check request params!";
        util.result_client(req, res, req_p);
    }

}).listen(3000, '127.0.0.1');
console.log('Server running at http://127.0.0.1:3000/');


