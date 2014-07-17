/**
 * Created with JetBrains WebStorm.
 * User: ouyangfeng
 * Date: 7/15/14
 * Time: 22:37
 * To change this template use File | Settings | File Templates.
 */
var common = require('./../common.js');
var util = require('./../util.js');

var status = require('./status.js');

var route = {};


route.status = function (req, res, params) {

    status.status(req,res,params);

}

route.uptime = function(req, res, params){
    status.uptime(req,res,params);
}

route.df = function(req, res, params){

    status.df(req, res, params);

}


route.default = function (req, res, params) {

    var result = new common.web_result();
    result.error = 'action not found!';
    console.error(util.format_time() + "action not found!");
    util.result_client(req, res, result);
}

exports.route = route;

