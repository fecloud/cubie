/**
 * Created with JetBrains WebStorm.
 * User: ouyangfeng
 * Date: 7/27/14
 * Time: 21:29
 * To change this template use File | Settings | File Templates.
 */
var fs = require("fs");
var formidable = require("formidable");

var common = require('./../common.js');
var util = require('./../util.js');

var File = common.file;

var base_photos = process.argv[3];



function list_dir_files(dir, base) {
    if (fs.existsSync(dir)) {
        var files = fs.readdirSync(dir);
        var file_array = [];

        files.forEach(function (name) {
            // 查看文件状态
            var st = fs.statSync(dir + name);
            var f = new File();
            if (st.isDirectory()) {
                f.isDir = true;
                f.name = name;
                f.size = st.size;
                f.mtime = st.mtime.toLocaleString();
                f.path = base + name;
                file_array.push(f);
            }


        });

        files.forEach(function (name) {
            // 查看文件状态
            var st = fs.statSync(dir + "/" + name);
            var f = new File();
            if (st.isFile()) {
                f.isFile = true;
                f.name = name;
                f.size = st.size;
                f.mtime = st.mtime.getTime();
                f.path = base + name;
                file_array.push(f);
            }

        });

        return file_array;
    } else {
        return [];
    }
}


function list_photos(params) {
    var result = new common.web_result();
    result.action = "list_photos";
    if (params.value) {
        //如果客户端传来的数据没有加/,自动加上
        if (params.value.substring(params.value.length - 1) != '/') {
            params.value = params.value + '/';
        }
        var dir = base_photos + params.value;

        var array_files = list_dir_files(dir, params.value);

        //有按页加载
        if (params.skip != undefined) {

            if (array_files.length >= params.skip) {
                var page_array = [];
                for (var i = params.skip; i < array_files.length; i++) {

                    page_array.push(array_files[i]);

                    if (params.num != undefined && (i - params.skip == (params.num -1) )) {

                        result.data = page_array;
                        if (i < array_files.length -1 ) {
                            result.more = true;
                        }
                        return result;
                    }

                }
                result.data = page_array;
                result.more = false;

            } else {
                result.data = [];
                result.more = false;
            }

        } else {
            result.data = array_files;
        }

    }
    return result;
}

exports.list_dir = list_dir;

/**
 * 返回当前目录的子目录以及文件
 */
function list_dir(params) {
    var result = new common.web_result();
    result.action = "list";
    if (params.value) {
        //如果客户端传来的数据没有加/,自动加上
        if (params.value.substring(params.value.length - 1) != '/') {
            params.value = params.value + '/';
        }
        var dir = base_photos + params.value;

        var array_files = list_dir_files(dir, params.value);

        //有按页加载
        if (params.skip != undefined) {

            if (array_files.length >= params.skip) {
                var page_array = [];
                for (var i = params.skip; i < array_files.length; i++) {

                    page_array.push(array_files[i]);

                    if (params.num != undefined && (i - params.skip == (params.num -1) )) {

                        result.data = page_array;
                        if (i < array_files.length -1 ) {
                            result.more = true;
                        }
                        return result;
                    }

                }
                result.data = page_array;
                result.more = false;

            } else {
                result.data = [];
                result.more = false;
            }

        } else {
            result.data = array_files;
        }

    }
    return result;
}

exports.list_dir = list_dir;

/**
 * 保存文件
 * @param req
 * @param res
 * @returns {Result}
 */
function save_photos(req, res, params) {
    var result = new common.web_result();
    result.action = "upload_photos";
    if (!params.value) {
        result.error = 'require save path!';
    } else {
        var save_dir = base_photos + params.value;
        if (save_dir.substring(save_dir.length - 1) != '/') {
            save_dir.value = save_dir + '/';
        }
        // parse a file upload
        var form = new formidable.IncomingForm();
        form.encoding = 'utf-8';
        form.uploadDir = save_dir;

        form.parse(req, function (err, fields, files) {

            // util.debug(files);
            if (params.files) {
                var renamefiles = JSON.parse(params.files);
                renamefiles.forEach(function (name) {
                    fs.rename(files[name].path, save_dir + name);
                    util.debug(util.format_time() + "rename " + files[name].path + " to " + save_dir + name);
                });
                result.data = renamefiles;
            } else {
                result.error = "not found files!";
            }
            util.result_client(req, res, result);

        });
    }

    return result;
}

exports.save_photos = save_photos;





/**
 * 新建文件夹
 * @param params
 * @returns {exports.web_result}
 */
function new_photos(req, res, params) {

    var result = new common.web_result();
    result.action = "new_photos";
    var path = base_photos + params.value;
    result.data = fs.mkdir(path, function () {
        util.debug(util.format_time() + 'new photos:' + path);
        util.result_client(req, res, result);
    });

}

exports.new_dir = new_photos;
