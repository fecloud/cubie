/**
 * Created with JetBrains WebStorm.
 * User: ouyangfeng
 * Date: 7/15/14
 * Time: 22:37
 * To change this template use File | Settings | File Templates.
 */
var common = require('./common.js');
var util = require('./util.js');
var fm = require('./fm.js');
var arduino = require('./arduino.js');

var route = {};

route.list = function (req, res, params) {

    util.result_client(req, res, fm.list_dir(params));

}

route.delete = function (req, res, params) {

    util.result_client(req, res, fm.delete_file(params));

}

route.newfolder = function (req, res, params) {

    fm.new_dir(req, res, params);
}

route.upload = function (req, res, params) {
    fm.save_file(req, res, params);

}

route.rename = function (req, res, params) {

    fm.rename(req, res, params);
}

route.search = function (req, res, params) {

    fm.search(req, res, params);
}

route.save_temperature = function (req, res, params) {

    util.result_client(req, res, arduino.save_temperature(params));
}

route.list_temperature = function (req, res, params) {
    arduino.list_temperature(req, res, params);
}

route.default = function (req, res, params) {

    var result = new common.web_result();
    result.error = 'action not found!';
    console.error("action not found!");
    util.result_client(req, res, result);
}

exports.route = route;