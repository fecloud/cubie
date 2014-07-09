/**
 * Created with JetBrains WebStorm.
 * User: ouyangfeng
 * Date: 7/8/14
 * Time: 20:33
 * To change this template use File | Settings | File Templates.
 */

var common = require('./common.js');
var util = require('./util.js');

function save_temperature(){

    var result = new common.web_result();
    result.action = "save_temperature";
    return result;

}

exports.save_temperature = save_temperature;