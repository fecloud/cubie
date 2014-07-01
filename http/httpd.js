#!/usr/bin/env nodejs

var http = require('http');
var fs = require("fs");
var url = require('url');
var webroot = process.argv[2];
console.log("webroot:" + webroot);
function list_dir(path){
    var files = fs.readdirSync(path);
    var file_array=[];
    files.forEach(function(name){
        //console.log(name);
        // 查看文件状态
        var st  = fs.statSync( path + name);
        if(st.isFile())
        {
           var f = new SFile();
            f.name = name;
            f.size = st.size;
            file_array.push(f);
        }

    });
    return file_array;
}
/**
 * 对象封装
 * @constructor
 */
var SFile= function (){
    this.name;
    this.size;
}

http.createServer(function (req, res) {
    console.info('url:' + req.url);
    var params = url.parse(req.url, true).query;
    console.info(params);

    if(params){
        if(params.action && params.value){
            //console.log(params.action);
            var files = list_dir( webroot + params.value);
            var str_files = JSON.stringify(files);
            console.info(str_files);
            res.setHeader('Content-Type','application/json;charset=UTF-8');
            res.write(str_files);
        }else {
            console.error("action not found!");
        }
    }
    res.end();

}).listen(3000, '127.0.0.1');
console.log('Server running at http://127.0.0.1:3000/');
