/**
 * Created with JetBrains WebStorm.
 * User: ouyangfeng
 * Date: 7/27/14
 * Time: 21:29
 * To change this template use File | Settings | File Templates.
 */
var fs = require("fs");
var formidable = require("formidable");
var crypto = require('crypto');
var node_util = require('util');

var gm = require('gm');

var common = require('./../common.js');
var util = require('./../util.js');
var pic_rezie = require('../pic_resize.js');

var File = common.file;

var base_photos = process.argv[3];
var img_cache = process.argv[4];


function list_dir_files(dir, base, con_dir, con_file) {
    if (fs.existsSync(dir)) {
        var files = fs.readdirSync(dir);
        var file_array = [];

        if (con_dir == undefined || con_dir) {
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
        }
        if (con_file == undefined || con_file) {
            files.forEach(function (name) {
                // 查看文件状态
                var st = fs.statSync(dir + "/" + name);
                var f = new File();
                if (st.isFile() && name.indexOf('.') != 0) {
                    f.isFile = true;
                    f.name = name;
                    f.size = st.size;
                    f.mtime = st.mtime.getTime();
                    f.path = base + name;
                    file_array.push(f);
                }

            });
        }

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

        var array_files = list_dir_files(dir, params.value, true, false);

        array_files.forEach(function (album) {

            album.num = list_dir_files(base_photos + album.path, album.path, false, true).length;
            album.first = get_max_date(base_photos + album.path, album.path);

        });

        //有按页加载
        if (params.skip != undefined) {

            if (array_files.length >= params.skip) {
                var page_array = [];
                var album;
                for (var i = params.skip; i < array_files.length; i++) {
                    album = array_files[i];

                    page_array.push(album);

                    if (params.num != undefined && (i - params.skip == (params.num - 1) )) {

                        result.data = page_array;
                        if (i < array_files.length - 1) {
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

exports.list_photos = list_photos;

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

                    if (params.num != undefined && (i - params.skip == (params.num - 1) )) {

                        result.data = page_array;
                        if (i < array_files.length - 1) {
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


function get_max_date(dir, base) {
    if (fs.existsSync(dir)) {
        var files = fs.readdirSync(dir);

        var max_date;

        files.forEach(function (name) {
            // 查看文件状态
            var st = fs.statSync(dir + "/" + name);
            var f = new File();
            if (st.isFile() && name.indexOf('.') != 0) {
                f.isFile = true;
                f.name = name;
                f.size = st.size;
                f.mtime = st.mtime.getTime();
                f.path = base + "/" + name;
                if (max_date == undefined) {
                    max_date = f;
                } else if (max_date.mtime < f.mtime) {
                    max_date = f;
                }
            }

        });


        return max_date;
    }
}


function get_pic(req, res, param) {

    var file = param.file;
    var w = param.w;
    var h = param.h;
    var md5 = crypto.createHash('md5');
    md5.update(node_util.format("%s_%s_%s", file, w, h));
    var tofile = img_cache + "/" + md5.digest('hex') + ".jpg";
    util.debug("tofile:" + tofile);
    if (!fs.existsSync(tofile)) {

        try {
            gm(base_photos + file)
                .resize(w, h)
                .write(tofile, function (err) {
                    if (err) {
                        res.writeHead(500, {
                            'Content-Type': 'text/plain'
                        });
                        res.end(err);
                    }

                });
        } catch (error) {
            res.writeHead(500, {
                'Content-Type': 'text/plain'
            });
            res.end(err.toString());
        }
    }

    util.debug("get pic " + fs.existsSync(tofile));

    fs.readFile(tofile, "binary", function (err, file) {
        if (err) {
            res.writeHead(500, {
                'Content-Type': 'text/plain'
            });
            res.end(err.toString());
        } else {
            res.writeHead(200, {
                'Content-Type': 'image/jpeg'
            });
            res.write(file, "binary");
            res.end();
        }
    });

}

exports.get_pic = get_pic;


