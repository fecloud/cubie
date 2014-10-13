/**
 * Created by Feng OuYang on 2014-07-08.
 */
/**
 * JSON 返回数据
 * @constructor
 */
var WebResult = function () {
    this.error;
    this.data;
    this.more;
};

exports.web_result = WebResult;


/**
 * 返回数据
 * @constructor
 */
var File = function () {
    this.isFile = false;
    this.isDir = false
    this.name;
    this.size;
    this.mtime;
    this.path = "";
};



exports.file = File;

