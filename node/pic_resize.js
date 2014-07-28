/**
 * Created with JetBrains WebStorm.
 * User: ouyangfeng
 * Date: 7/28/14
 * Time: 21:06
 * To change this template use File | Settings | File Templates.
 */

var events = require("events");
var emitter = new events.EventEmitter();

var fs = require('fs')
    , gm = require('gm');


emitter.on("req", function (file, tofile, w, h, func) {

    try {
        gm(file)
            .resize(w, h)
            .write(tofile, function (err) {
                if (!err) {
                    if (func)
                        func.call(func, false);
                }
                if (func)
                    func.call(func, true);
            });
    } catch (error) {
        if (func)
            func.call(func, false);
    }

});

/**
 * 请求parse
 * @param file
 */
function req_rezie(file, tofile, w, h, func) {

    emitter.emit('req', file, tofile, w, h, func);

}

exports.req_rezie = req_rezie;
