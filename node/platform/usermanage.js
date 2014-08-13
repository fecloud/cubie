/**
 * Created by Feng OuYang on 2014-08-13.
 */


var com = require('../com.js');
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
    result.action = 'login';

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
                result.error = "check uanme or passwd!";
                util.result_client(req, res, result);
            }

        }, function (err) {

            result.error = "check uanme or passwd!";
            util.result_client(req, res, result);

        });


    } else {
        result.error = "check request params!";
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
    result.action = 'logout';
    if (params.token) {
        oauth.del_oauth_token(params.token, function (rows) {

            result.data = params.token;
            util.result_client(req, res, result);

        }, function (err) {

            result.error = "check uanme or passwd!";
            util.result_client(req, res, result);

        });


    } else {
        result.error = "check request params!";
        util.result_client(req, res, result);
    }

}

exports.logout = logout;