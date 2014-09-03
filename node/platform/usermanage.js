/**
 * Created by Feng OuYang on 2014-08-13.
 */


var com = require('../com.js');
var err_const = require('../error.js');
var util = require('../util.js');
var oauth = require('../oauth/oauth.js');

/**
 * 登录返回token
 * @param req
 * @param res
 * @param params
 */
function login(req, res, params) {

    var result = new com.web_result();

    if (params.uname && params.passwd) {
        var uname = params.uname;
        var passwd = params.passwd;
        oauth.query_user(uname, function (rows) {

            var user = rows[0];
            if (user && user.passwd == passwd) {
                oauth.insert_user(user);//插入最后登录时间
                var token = util.md5_string(util.format_time()); //随机生成token

                var oauth_user = new oauth.oauth();
                oauth_user.uname = uname;
                oauth_user.token = token;
                result.data = oauth_user;

                oauth.insert_oauth(oauth_user);//插入token
                util.result_client(req, res, result);
            } else {
                util.error("check uanme or passwd!");
                result.error = err_const.err_400;
                util.result_client(req, res, result);
            }

        }, function (err) {

            util.error(err);
            util.bs_fail(req,res);

        });


    } else {
        util.error("check request params!");
        result.error = err_const.err_400;
        util.result_client(req, res, result);
    }

}

exports.login = login;

/**
 * 注销
 * @param req
 * @param res
 * @param params
 */
function logout(req, res, params) {
    var result = new com.web_result();


    oauth.del_oauth_token(params.token, function (rows) {

        result.data = params.token;
        util.result_client(req, res, result);

    }, function (err) {

        util.bs_fail(req, res);

    });


}

exports.logout = logout;

/**
 * 检查token
 * @param req
 * @param res
 * @param params
 */
function check_token(req, res, params){

    var result = new com.web_result();
    result.data = params.token;
    util.result_client(req, res, result);
}

exports.check_token = check_token;
