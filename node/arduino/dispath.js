/**
 * Created with JetBrains WebStorm.
 * User: ouyangfeng
 * Date: 7/15/14
 * Time: 22:37
 * To change this template use File | Settings | File Templates.
 */
var common = require('./../common.js');
var util = require('./../util.js');
var arduino = require('./../arduino/arduino.js');

var route = {};


route.save_temperature = function (req, res, params) {

    util.result_client(req, res, arduino.save_temperature(params));
}

route.list_temperature = function (req, res, params) {
    arduino.list_temperature(req, res, params);
}

route.default = function (req, res, params) {

    var result = new common.web_result();
    result.error = 'action not found!';
    console.error(util.format_time() + "action not found!");
    util.result_client(req, res, result);
}

exports.route = route;

