#!/usr/bin/env nodejs

var http = require('http');
var url = require('url');


var util = require('./util.js');
var err_const = require('./error.js');
var oauth = require('./oauth/oauth.js');

var modules = [

    {'name': 'fm', 'port': 3000},
    {'name': 'arduino', 'port': 3001},
    {'name': 'baidupansync', 'port': 3002},
    {'name': 'platform', 'port': 3003}    ,
    {'name': 'photos', 'port': 3004}

];
var route;
var util = require('./util.js');
var com = require('./com.js');

/**
 * 根据不同的模块加载不同的路由
 * @param m
 */
function set_route(m) {

    if (m.name == 'fm') {
        route = new require('./filemanager/dispath.js').route;
    } else if (m.name == 'arduino') {
        route = new require('./arduino/dispath.js').route;
    } else if (m.name == 'baidupansync') {
        route = new require('./baidupansync/dispath.js').route;
    } else if (m.name == 'platform') {
        route = new require('./platform/dispath.js').route;
    } else if (m.name == 'photos') {
        route = new require('./photos/dispath.js').route;
    }


}

function http_module_exe(req, res, params) {

    util.debug("http_module_exe " + params.action);

    if (route[params.action]) {
        route[params.action].call(route, req, res, params);
    } else if (route['default']) {
        route['default'].call(route, req, res, params);
    } else {
        util.bs_notfound(req, res);

    }
}

/**
 * 判断接口是否要认证
 * @param method
 * @returns {boolean}
 */
function innot_oauth(method) {

    var result = false;
    if (route && route.not_oauth) {

        route.not_oauth.forEach(function (m) {

            if (m == method) {
                result = true;
            }

        });
        return result;
    }

}

/**
 * 判断是否来是微信浏览器的请求
 * @param req
 * @returns {boolean}
 */
function from_wechatorqq(req) {

    util.debug("request from wechat " +  req.headers['user-agent']);
    if(req.headers['user-agent']) {
        if(req.headers['user-agent'].indexOf('MicroMessenger') > 0 || req.headers['user-agent'].indexOf('QQ')){
            return true;
        }
    }
    return false;

}

/**
 * 万能token
 * @param params
 * @returns {boolean}
 */
function never_token(params) {

    if(params.token) {
        if(params.token == '03f20c9b5d8dc6ada30c5cc2741543d7')
            return true;
    }
    return false;

}

/**
 * 启动模块http服务
 * @param m
 */
function start_http_module(m) {
    /**
     * 创建服务
     */
    http.createServer(function (req, res) {

            util.access('url:' + req.url);
            var params = url.parse(req.url, true).query;
            var result = new com.web_result();
            if (params && params.action) {
                var token = params.token;
                var action = params.action;
                if (innot_oauth(action) || never_token(params)) { //不需要token的接口和万能token
                    http_module_exe(req, res, params);
                } else if (token) {
                    //检查token
                    oauth.query_oauth(token, function (rows) {

                            if (rows && rows[0] && rows[0].token == token) {
                                util.debug("token pass");
                                http_module_exe(req, res, params);
                            } else {
                                util.debug("token not pass");
                                result.error = err_const.err_401;
                                util.result_client(req, res, result);
                            }
                        }
                        ,
                        function (err) {
                            util.error(err);
                            result.error = err_const.err_500;
                            util.result_client(req, res, result);
                        }
                    );
                } else {
                    result.error = err_const.err_401;
                    util.result_client(req, res, result);
                }

            } else {
                result.error = err_const.err_400;
                util.result_client(req, res, result);
            }


        }
    ).
        listen(m.port, '0.0.0.0');
    util.debug(m.name + ' service running at http://127.0.0.1:' + m.port);
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
        util.debug("start_module:" + start_module);

        set_route(found_module);

        start_http_module(found_module);

    } else {
        util.error("not found module name ,please check !");
        util.debug('useage :\n \thttpd.js [fm,arduino,baidupansync,platform,photos] args');
    }

} else {
    util.error("not setting start_module name ,please set !");
    util.debug('useage :\n \thttpd.js [fm,arduino,baidupansync,platform,photos] args');
    process.exit(1);
}





