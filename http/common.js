/**
 * Created by Feng OuYang on 2014-07-08.
 */
/**
 * JSON 返回数据
 * @constructor
 */
var WebResult = function () {
    this.action;
    this.error = '';
    this.data;
}

exports.web_result = WebResult;

/**
 * 请求参数
 * @constructor
 */
var ReqParam = function (){

    this.action;
    this.value ;
    this.files;

}

exports.req_param = ReqParam;
