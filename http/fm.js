/**
 * Created by Feng OuYang on 2014-07-08.
 */
var fs = require("fs");
var formidable = require("formidable");

var common = require('./common.js');
var util = require('./util.js');


var webroot = process.argv[2];
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
}

exports.file = File;

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
        var dir = webroot + params.value;

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
                    f.path = params.value + name;
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
                    f.path = params.value + name;
                    file_array.push(f);
                }

            });

            result.data = file_array;
        }else {
            result.error = 'path not exists!';
        }
    }
    return result;
}

exports.list_dir = list_dir;

/**
 * 删除文件夹
 * @param path
 */
function delete_folder(path) {

    var files = [];

    if (fs.existsSync(path)) {

        files = fs.readdirSync(path);

        files.forEach(function (file, index) {

            var curPath = path + "/" + file;

            if (fs.statSync(curPath).isDirectory()) { // recurse

                delete_folder(curPath);

            } else { // delete file

                fs.unlinkSync(curPath);

            }

        });

        fs.rmdirSync(path);

    }

};

/**
 * 删除文件
 */
function delete_file(params) {
    var result = new common.web_result();
    result.action = "delete";

    var path = webroot + params.value;
    //&& fs.existsSync(params.value)
    if (params && params.value && fs.existsSync(path)) {
        var st = fs.lstatSync(path);
        //删除文件
        if (st.isFile()) {
            console.log(util.format_time() + 'delete file ' + path);
            result.data = fs.unlinkSync(path);
        } else {
            console.log(util.format_time() + 'delete folder ' + path);
            result.data = delete_folder(path);
        }

    } else {
        result.error = "check path!";
    }
    return result;
}

exports.delete_file = delete_file;

/**
 * 保存文件
 * @param req
 * @param res
 * @returns {Result}
 */
function save_file(req, res, params) {
    var result = new common.web_result();
    result.action = "upload";
    if (!params.value) {
        result.error = 'require save path!';
    } else {
        var save_dir = webroot + params.value;
        if (save_dir.substring(save_dir.length - 1) != '/') {
            save_dir.value = save_dir + '/';
        }
        // parse a file upload
        var form = new formidable.IncomingForm();
        form.encoding = 'utf-8';
        form.uploadDir = save_dir;

        form.parse(req, function (err, fields, files) {

            // console.log(files);
            if (params.files) {
                var renamefiles = JSON.parse(params.files);
                renamefiles.forEach(function (name) {
                    fs.rename(files[name].path, save_dir + name);
                    console.log(util.format_time() + "rename " + files[name].path + " to " + save_dir + name);
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

exports.save_file = save_file;

/**
 * 新建文件夹
 * @param params
 * @returns {exports.web_result}
 */
function new_dir(req, res, params) {

    var result = new common.web_result();
    result.action = "newfolder";
    var path = webroot + params.value;
    result.data = fs.mkdir(path, function () {
        console.log(util.format_time() + 'new folder:' + path);
        util.result_client(req, res, result);
    });

}

exports.new_dir = new_dir;


/**
 * 重命名
 * @param req
 * @param res
 * @param params
 */
function rename(req, res, params) {

    var result = new common.web_result();
    result.action = 'rename';
    var path = webroot + params.value;
    var target = webroot + params.target;

    console.log(util.format_time() + 'path:' + path + " target:" + target);

    fs.rename(path, target, function (err) {
        if (err) {
            result.error = err;
        } else {
            result.data = 'true';
        }
        util.result_client(req, res, result);
    });

}

exports.rename = rename;


/**
 *
 * @param req
 * @param res
 * @param params
 */
function search_dir(req, res, params) {

    var result = new common.web_result();
    result.action = 'search_dir';
    if (params.query != undefined) {
        var file_list = list_dir(params);
        if (file_list.error == '') {
            var file_array = [];
            file_list.data.forEach(function (name) {

                if (name.name.toLowerCase().indexOf(params.query.toLowerCase()) > -1) {
                    file_array.push(name)
                }

            });
            result.data = file_array;
        }
    } else {
        result.error = 'require query!';
    }

    util.result_client(req, res, result);
}

exports.search = search_dir;