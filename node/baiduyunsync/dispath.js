/**
 * Created with JetBrains WebStorm.
 * User: ouyangfeng
 * Date: 7/15/14
 * Time: 22:37
 * To change this template use File | Settings | File Templates.
 */
var common = require('./../common.js');
var util = require('./../util.js');
var sync = require('./sync.js');

var route = {};


route.default = function (req, res, params) {

    var result = new common.web_result();
    result.error = 'action not found!';
    console.error("action not found!");
    util.result_client(req, res, result);
}

exports.route = route;

