/**
 * Created with JetBrains WebStorm.
 * User: ouyangfeng
 * Date: 7/15/14
 * Time: 22:37
 * To change this template use File | Settings | File Templates.
 */
var com = require('../com.js');
var util = require('../util.js');
var photos = require('./photos.js');

var route = {};

route.list_photos = function (req, res, params) {

    util.result_client(req, res, photos.list_photos(params));

};

route.delete_phots = function (req, res, params) {

    util.result_client(req, res, fm.delete_file(params));

};

route.new_photos = function (req, res, params) {

    photos.new_photos(req,res,params);

};

route.save_photos = function (req, res, params) {
    photos.save_photos(req, res, params);

};

route.rename_photos = function (req, res, params) {

    fm.rename(req, res, params);
};


route.get_pic_albume = function(req, res, params){

    photos.get_pic_albume(req, res, params);

}

route.get_album_pics = function(req, res, params){

    photos.get_album_pics(req, res, params);

}

route.default = function (req, res, params) {

    var result = new com.web_result();
    result.error = 'action not found!';
    util.error(util.format_time() + "action not found!");
    util.result_client(req, res, result);
};

exports.route = route;

var base_photos = process.argv[3];
var img_cache =  process.argv[4];

if (base_photos && img_cache) {

    util.debug("base_photos:" + base_photos);
    util.debug("img_cache:" + img_cache);

} else {
    util.error("not setting base_photos or img_cache ,please set !");
    process.exit(1);

}