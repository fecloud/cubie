#!/usr/bin/env nodejs

var http = require('http');
var url = require('url');

var modules = [

    {'name': 'fm', 'port': 3000},
    {'name': 'arduino', 'port': 3001},
    {'name': 'baidupansync', 'port': 3002},
    {'name': 'status', 'port': 3003}

];
var route;
var util = require('./util.js');
var common = require('./common.js');

function set_route(m) {

    if(m.name == 'fm'){
        route = new require('./filemanager/dispath.js').route;
    }else if(m.name == 'arduino'){
        route = new require('./arduino/dispath.js').route;
    }else if(m.name == 'baidupansync'){
        route = new require('./baidupansync/dispath.js').route;
    }else if(m.name == 'status'){
        route = new require('./status/dispath.js').route;
    }

}

function start_http_module(m) {
    /**
     * 创建服务
     */
    http.createServer(function (req, res) {

        console.info(util.format_time() + 'url:' + req.url);
        var params = url.parse(req.url, true).query;

        if (params && params.action && params.value) {
            if(route[params.action]){
                route[params.action].call(route, req, res, params);
            }else {
                route['default'].call(route, req, res, params);
            }

        } else {
            var result = new common.web_result();
            result.error = "check request params!";
            util.result_client(req, res, result);
        }

    }).listen(m.port, '127.0.0.1');
    console.log(m.name + ' service running at http://127.0.0.1:' + m.port);
}


var start_module = process.argv[2];

if (start_module) {
    var found_module;
    modules.forEach(function (m) {

        if (m.name == start_module) {
            found_module = m;
        }

    });
    if (found_module) {
        console.log("start_module:" + start_module);

        set_route(found_module);

        start_http_module(found_module);

    } else {
        console.error("not found module name ,please check !");
        console.log('useage :\n \thttpd.js [fm,arduino,baidupansync,status] args');
    }

} else {
    console.error("not setting start_module name ,please set !");
    console.log('useage :\n \thttpd.js [fm,arduino,baidupansync,status] args');
    process.exit(1);
}





