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

var util = require('../util.js');


emitter.on("req", function (file, tofile, w, h, func) {

    try {
        if (!fs.existsSync(tofile)) {
            util.debug("gm rezie " + file + " tofile" + tofile);
            gm(file)
                .resize(w, h)
                .write(tofile, function (err) {
                    if (!err) {
                        if (func)
                            func.call(func, false);

                        util.debug("gm rezie " + file + " tofile" + tofile + " error " + err.toString());
                    } else {
                        if (func)
                            func.call(func, true);

                        util.debug("gm rezie " + file + " tofile" + tofile + " success");
                    }
                });
        }
    } catch (error) {
        if (func)
            func.call(func, false);

        util.debug("gm rezie " + file + " tofile" + tofile + " catch error");
    }

    util.debug("gm rezie " + file + " tofile" + tofile + " finish");
});

/**
 * 请求parse
 * @param file
 */
function req_rezie(file, tofile, w, h, func) {

    util.debug("gm rezie " + file + " tofile" + tofile + " req_rezie");
    emitter.emit('req', file, tofile, w, h, func);

}

exports.req_rezie = req_rezie;
