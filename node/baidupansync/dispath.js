/**
 * Created with JetBrains WebStorm.
 * User: ouyangfeng
 * Date: 7/15/14
 * Time: 22:37
 * To change this template use File | Settings | File Templates.
 */
var com = require('../com.js');
var err_const = require('../error.js');
var util = require('../util.js');
var sync = require('./sync.js');

var route = {};

route.list_user = function (req, res, params) {

    sync.list_user(req, res, params);

};

route.view_user = function (req, res, params) {

    sync.view_user(req, res, params);

};

route.view_quota = function (req, res, params) {

    sync.view_quota(req, res, params);

};

route.get_authorization_url = function (req, res, params) {

    sync.get_authorization_url(req, res, params);

};

route.get_user_access_token = function (req, res, params) {

    sync.get_user_access_token(req, res, params);

};


route.add_user = function (req, res, params) {

    sync.add_user(req, res, params);

};


route.del_user = function (req, res, params) {

    sync.del_user(req, res, params);

};


route.default = function (req, res, params) {

    var result = new com.web_result();
    result.error = err_const.err_404;
    util.error(err_const.err_404);
    util.result_client(req, res, result);
};

exports.route = route;

