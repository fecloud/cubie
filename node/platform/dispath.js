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

var status = require('./status.js');
var um = require('./usermanage.js');

var route = {};


route.status = function (req, res, params) {

    status.status(req, res, params);

};

route.uptime = function (req, res, params) {
    status.uptime(req, res, params);
};

route.df = function (req, res, params) {

    status.df(req, res, params);

};

route.start_service = function (req, res, params) {

    status.start_service(req, res, params);

};

route.stop_service = function (req, res, params) {

    status.stop_service(req, res, params);

};

route.login = function(req, res, params){

    um.login(req,res,params);

};

route.logout = function(req, res, params){

    um.logout(req,res,params);

};

/**
 * 不需要认证的接口
 */
route.not_oauth = ['login'];


exports.route = route;

