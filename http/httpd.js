#!/usr/bin/env nodejs

var http = require('http');
var fs = require("fs");
var url = require('url');
var webroot = process.argv[2];
console.log("webroot:" + webroot);

var SFile= function (){
    this.name;
    this.size;
    this.mtime;
}

var Result = function(){
    this.action;
    this.error = '';
    this.data;
}

/**
 * 返回当前目录的子目录以及文件
 */ 
function list_dir(params){
    var result = new Result();
    result.action = "list";
    if(params && params.value){
        var dir = webroot + "/" + params.value;
        var files = fs.readdirSync(dir);
        var file_array=[];
        files.forEach(function(name){
            // 查看文件状态
            var st  = fs.statSync(dir + "/" + name);
            if(st.isFile()) {
                var f = new SFile();
                f.name = name;
                f.size = st.size;
                f.mtime = st.mtime.toLocaleString();
                file_array.push(f);
            }

        });
        result.data = file_array;
    }else {
        result.error = 'path not found!';
    }
    return result;
}

/**
 * 删除文件
 */
function delete_file(params){
    var result = new Result();
    result.action = "delete";

    var path = webroot + "/" + params.value;
    //&& fs.existsSync(params.value)
    if(params && params.value && fs.existsSync(path)){
        console.log('delete file ' + path);
        result.data = fs.unlinkSync(path);
    }else {
        result.error = "check path!";
    }
    return result;
}
/**
 * 对象封装
 * @constructor
 */


function dispath(params){
    if(params && params.action){
        if(params.action == 'list'){
            return list_dir(params);
        }else if(params.action == 'delete'){
            return delete_file(params);
        }else {
            var result = new result;
            result.error = 'action not found!';
            console.error("action not found!");
            return result;
        }

    }else {
        var result = new Result;
        result.error = 'action require!';
        console.error("action require!");
        return result;
    }
}

/**
 * 创建服务
 */
http.createServer(function (req, res) {
    console.info('url:' + req.url);
    var params = url.parse(req.url, true).query;
    console.info(params);
    res.setHeader('Content-Type','application/json;charset=UTF-8');
    res.write(JSON.stringify(dispath(params)));
    res.end();

}).listen(3000, '127.0.0.1');
console.log('Server running at http://127.0.0.1:3000/');
