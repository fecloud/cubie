$(document).ready(function () {

    var path = getArgs(path);
    if (path == '')
        path = "/";
    $.ajax({url: '/' + parseInt(Math.random() * 10000000) + '.php?action=list&value=' + path,
        success: function (data) {
            load_list(data);
        }
    });

    $('.back_btn').bind('click',function (e){
        history.go(-1);
        e.stopPropagation();
    });

});

function getArgs(strParame) {
    var query = location.search.substring(1); // Get query string
    var pairs = query.split("&"); // Break at ampersand
    for (var i = 0; i < pairs.length; i++) {
        var pos = pairs[i].indexOf('='); // Look for "name=value"
        if (pos == -1)
            continue; // If not found, skip

        var argname = pairs[i].substring(0, pos); // Extract the name
        var value = pairs[i].substring(pos + 1); // Extract the value
        value = decodeURIComponent(value); // Decode it, if needed
        return  value; // Store as a property
    }

    return ""; // Return the object
}

function load_list(data) {
    if (data && data.error == '' && data.data) {
        var arr = data.data;
        for (var i = 0, len = arr.length; i < len; i++) {
            var file = arr[i];
//            console.log(arr[i]);
            var item;
            if (file.isDir) {
                item = "<li ><a href=\"file.html?path=" + file.path
                    + "/\" class=\"list-item\"><i class=\"file-icon folder\"></i><div class=\"content\"><h3> " + file.name
                    + "</h3><div class=\"list-content\">" + new Date(file.mtime).format("yyyy-MM-dd hh:mm:ss")
                    + "</div><div class=\"file-operate\"><div class=\"file-rename\" > <i class=\"iedit\"></i>重命名</div><div class=\"file-delete\" data-ac=\"active\"><i class=\"iremove\"></i>删除</div></div></div><div class=\"show-operate\"><i class=\"idown\"></i></div></a></li>";
            } else {
                item = "<li ><a href=\"src" + file.path
                    + "\" class=\"list-item\"><i class=\"file-icon file\"></i><div class=\"content\"><h3> " + file.name
                    + "</h3><div class=\"list-content\">" + new Date(file.mtime).format("yyyy-MM-dd hh:mm:ss")
                    + "<span>" + renderSize(file.size)
                    + "</span></div><div class=\"file-operate\"><div class=\"file-rename\" ><i class=\"iedit\"></i>重命名</div><div class=\"file-delete\" data-ac=\"active\"><i class=\"iremove\"></i>删除</div></div></div><div class=\"show-operate\"><i class=\"idown\"></i></div></a></li>";
            }
            $('#content').append(item);
            $(".list-item").bind('click',idown);
        }
    }
}
Date.prototype.format = function (format) {
    var o = {
        "M+": this.getMonth() + 1, //month
        "d+": this.getDate(),    //day
        "h+": this.getHours(),   //hour
        "m+": this.getMinutes(), //minute
        "s+": this.getSeconds(), //second
        "q+": Math.floor((this.getMonth() + 3) / 3),  //quarter
        "S": this.getMilliseconds() //millisecond
    }
    if (/(y+)/.test(format)) format = format.replace(RegExp.$1,
        (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)if (new RegExp("(" + k + ")").test(format))
        format = format.replace(RegExp.$1,
                RegExp.$1.length == 1 ? o[k] :
                ("00" + o[k]).substr(("" + o[k]).length));
    return format;
}


function idown(b){
    console.log(b.target).closest(".show-operate");
    b.preventDefault();
    b.stopPropagation();
    console.log("idown");
}

/**
 * 文件大小格式
 * @param value
 * @param p
 * @param record
 * @returns {*}
 */
function renderSize(value) {
    if (null == value || value == '') {
        return "0b";
    }
    var unitArr = new Array("B", "K", "M", "G", "T", "P", "E", "Z", "Y");
    var index = 0;


    var srcsize = parseFloat(value);
    var size = roundFun(srcsize / Math.pow(1024, (index = Math.floor(Math.log(srcsize) / Math.log(1024)))), 2);
    return size + unitArr[index];
}

/*
 四舍五入保留小数位数
 numberRound 被处理的数
 roundDigit  保留几位小数位
 */
function roundFun(numberRound, roundDigit)
{
    if (numberRound >= 0) {
        var tempNumber = parseInt((numberRound * Math.pow(10, roundDigit) + 0.5)) / Math.pow(10, roundDigit);
        return   tempNumber;
    } else {
        numberRound1 = -numberRound
        var tempNumber = parseInt((numberRound1 * Math.pow(10, roundDigit) + 0.5)) / Math.pow(10, roundDigit);
        return   -tempNumber;
    }
}