/**
* Created with JetBrains WebStorm.
* User: ouyangfeng
* Date: 7/8/14
* Time: 20:33
* To change this template use File | Settings | File Templates.
*/
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('/data/app/data/arduino.db');

var com = require('../com.js');
var util = require('../util.js');

var table_name = "temperature";

process.on('exit', function (code) {

    db.close();

    setTimeout(function () {
        util.debug('This will not run');
    }, 0);
    util.debug('About to exit with code:', code);
});

/**
* 保存温度
* @param parsms
* @returns {exports.web_result}
*/
function save_temperature(parsms) {

    var result = new com.web_result();
    result.action = "save_temperature";

    insert(parsms.value)
    return result;

}

exports.save_temperature = save_temperature;

function list_temperature(req, res, params) {

    var result = new com.web_result();
    result.action = "list_temperature";

    var limt = params.value;
    var sql = "SELECT * FROM " + table_name;
    if (-1 != limt) {
        sql += "LIMT " + limt + "," + length;
    }

    db.all(sql, function (err, rows) {
        var temp_array = [];
        rows.forEach(function (row) {
            temp_array.push(row);
        });
        result.data = temp_array;

        util.result_client(req, res, result);

    });


}


exports.list_temperature = list_temperature;


/**
* 插入温度
* @param temperature
*/
function insert(temperature) {

    util.debug(util.format_time() + " insert:" + temperature);

    var stmt = db.prepare("INSERT INTO " + table_name + " (temperature) VALUES (?) ");

    stmt.run(temperature);

}
/**
* 建表
*/
function create_table() {

    var create_sql = "CREATE TABLE IF NOT EXISTS ";
    create_sql += table_name;
    create_sql += " (" + "id INTEGER PRIMARY KEY ,";
    create_sql += " temperature DOUBLE NOT NULL, ";
    create_sql += "time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ) ;";
    util.debug("sql:" + create_sql);
    db.run(create_sql);
}

create_table();