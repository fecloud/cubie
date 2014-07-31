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


var resize_queue = [];
/**
 * 缩略图
 * @constructor
 */
var PicResize = function () {

    this.file;
    this.tofile;
    this.w;
    this.h;
    this.callbak;

}


emitter.on("req", function (pic_resize) {


    try {
        if (!fs.existsSync(pic_resize.tofile)) {
            //需要resize
            util.debug("gm rezie " + pic_resize.file + " tofile" + pic_resize.tofile);
            gm(pic_resize.file)
                .resize(pic_resize.w, pic_resize.h)
                .write(pic_resize.tofile, function (err) {
                    if (err) {
                        if (pic_resize.callbak)
                            pic_resize.callbak.call(pic_resize.callbak, false);

                        util.debug("gm rezie " + pic_resize.file + " tofile" + pic_resize.tofile + " error " + err.toString());
                    } else {
                        if (pic_resize.callbak)
                            pic_resize.callbak.call(pic_resize.callbak, true);

                        util.debug("gm rezie " + pic_resize.file + " tofile" + pic_resize.tofile + " success");
                    }
                });
        } else {
            //已经在在
            if (pic_resize.callbak)
                pic_resize.callbak.call(pic_resize.callbak, true);

            util.debug("gm rezie " + pic_resize.file + " tofile" + pic_resize.tofile + " not need resize");
        }
    } catch (error) {
        if (pic_resize.callbak)
            pic_resize.callbak.call(pic_resize.callbak, false);

        util.debug("gm rezie " + pic_resize.file + " tofile" + pic_resize.tofile + " catch error");
    }


});

/**
 * 请求parse
 * @param file
 */
function req_rezie(file, tofile, w, h, func) {

    util.debug("gm rezie " + file + " tofile" + tofile + " req_rezie");
    var need_emitter = false;
    if (resize_queue.length == 0) {
        need_emitter = true;
    }

    var req_resize = new PicResize();
    req_resize.file = file;
    req_resize.tofile = tofile;
    req_resize.w = w;
    req_resize.h = h;
    req_resize.callbak = function () {

        util.debug("emitter work one req next");
        var re = resize_queue.shift();
        util.debug("get next re " + re);
        if (re) {
            emitter.emit('req', re);
        }

    };
    resize_queue.push(req_resize);

    if (need_emitter) {
        util.debug("emitter not work emit");
        emitter.emit('req', resize_queue.shift());

    }

}

exports.req_rezie = req_rezie;
