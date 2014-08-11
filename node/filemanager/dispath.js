/**
 * Created with JetBrains WebStorm.
 * User: ouyangfeng
 * Date: 7/15/14
 * Time: 22:37
 * To change this template use File | Settings | File Templates.
 */
var com = require('../com.js');
var util = require('../util.js');
var fm = require('./fm.js');

var route = {};

route.list = function (req, res, params) {

    util.result_client(req, res, fm.list_dir(params));

};

route.delete = function (req, res, params) {

    util.result_client(req, res, fm.delete_file(params));

};

route.newfolder = function (req, res, params) {

    fm.new_dir(req, res, params);
};

route.upload = function (req, res, params) {
    fm.save_file(req, res, params);

};

route.rename = function (req, res, params) {

    fm.rename(req, res, params);
};

route.search = function (req, res, params) {

    fm.search(req, res, params);
};


route.default = function (req, res, params) {

    var result = new com.web_result();
    result.error = 'action not found!';
    util.error(util.format_time() + "action not found!");
    util.result_client(req, res, result);
};

exports.route = route;

var webroot = process.argv[3];

if (webroot) {

    util.debug("webroot:" + webroot);

} else {

    util.error("not setting webroot ,please set !");
    process.exit(1);

}