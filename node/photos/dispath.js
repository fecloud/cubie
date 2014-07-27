/**
 * Created with JetBrains WebStorm.
 * User: ouyangfeng
 * Date: 7/15/14
 * Time: 22:37
 * To change this template use File | Settings | File Templates.
 */
var common = require('./../common.js');
var util = require('../util.js');
var fm = require('./photos.js');

var route = {};

route.list_photos = function (req, res, params) {

    util.result_client(req, res, fm.list_dir(params));

};

route.delete_phots = function (req, res, params) {

    util.result_client(req, res, fm.delete_file(params));

};

route.new_photos = function (req, res, params) {

    fm.new_dir(req, res, params);
};

route.upload_photos = function (req, res, params) {
    fm.save_file(req, res, params);

};

route.rename_photos = function (req, res, params) {

    fm.rename(req, res, params);
};

route.search_photos = function (req, res, params) {

    fm.search(req, res, params);
};


route.default = function (req, res, params) {

    var result = new common.web_result();
    result.error = 'action not found!';
    util.error(util.format_time() + "action not found!");
    util.result_client(req, res, result);
};

exports.route = route;

var base_photos = process.argv[3];

if (base_photos) {

    util.debug("base_photos:" + base_photos);

} else {

    util.error("not setting base_photos ,please set !");
    process.exit(1);

}