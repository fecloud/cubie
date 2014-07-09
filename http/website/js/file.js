var current_path = '/';

$(document).ready(function () {

    var path = getArgs('path');
    if (path == '')
        path = "/";
    current_path = path;

    load_data();
    back_bind();

    $('.upload').bind('change', function (b) {
        b.preventDefault();
        b.stopPropagation();
        fileSelected();
    });
    $('.newfolder').bind('click', newfolder);

    $('#header h1').bind('click', function () {
        window.location.replace('/file');
    });

    $('#search_btn').bind('click', function () {
        var query = $('#search_input').val();
        if (query != '') {
            $('#loading').css({display: 'block'});
            $.ajax({url: '/' + parseInt(Math.random() * 10000000) + '.php?action=search&value=' + current_path + '&query=' + query,
                success: function (data) {
                    if (data.error == '') {
                        load_list(data);
                    }
                        $('#loading').css({display: 'none'});
                    }
            });
        }
    });
});


function load_data() {
    $('#loading').css({display: 'block'});
    $.ajax({url: '/' + parseInt(Math.random() * 10000000) + '.php?action=list&value=' + current_path,
        success: function (data) {
            load_list(data);
            $('#loading').css({display: 'none'});
        }
    });
}


function load_list(data) {
    if (data && data.error == '' && data.data) {
        var arr = data.data;
        $('#content').html('');
        for (var i = 0, len = arr.length; i < len; i++) {
            var file = arr[i];
            var item;
            if (file.isDir) {
                item = "<li ><a href=\"index.html?path=" + file.path
                    + "/\" class=\"list-item\"><i class=\"file-icon folder\"></i><div class=\"content\"><h3> " + file.name
                    + "</h3><div class=\"list-content\">" + new Date(file.mtime).format("yyyy-MM-dd hh:mm:ss")
                    + "</div><div class=\"file-operate\" src=\"" + file.path + "\" file=\"" + file.isFile + "\" name=\"" + file.name
                    + "\"><div class=\"file-rename\" ><i class=\"iedit\"></i>重命名</div><div class=\"file-delete\" data-ac=\"active\"><i class=\"iremove\"></i>删除</div></div></div><div class=\"show-operate\"><i class=\"idown\"></i></div></a></li>";
            } else {
                item = "<li ><a href=\"../src" + file.path
                    + "\" class=\"list-item\"><i class=\"file-icon " + getFileTypeCss(file.name) + "\"></i><div class=\"content\"><h3> " + file.name
                    + "</h3><div class=\"list-content\">" + new Date(file.mtime).format("yyyy-MM-dd hh:mm:ss")
                    + "<span>" + renderSize(file.size)
                    + "</span></div><div class=\"file-operate\" src=\"" + file.path + "\" file=\"" + file.isFile + "\" name=\"" + file.name
                    + "\"><div class=\"file-rename\" ><i class=\"iedit\"></i>重命名</div><div class=\"file-delete\" data-ac=\"active\"><i class=\"iremove\"></i>删除</div></div></div><div class=\"show-operate\"><i class=\"idown\"></i></div></a></li>";
            }
            $('#content').append(item);

        }

        $(".show-operate").bind('click', idown);
        $('.file-delete').bind('click', iremove);
        $('.file-rename').bind('click', irename);

    }
}


function newfolder() {
    window.location = '/file/add_folder.html?path=' + current_path;
}

function idown(b) {
    // console.log(b.target).closest(".content");

    b.preventDefault();
    b.stopPropagation();
    $(b.target).closest('a').toggleClass(function () {
        return 'list-item-show';
    });
    console.log("idown");
}

function iremove(b) {
    b.preventDefault();
    b.stopPropagation();
    var src = $(b.target).closest('.file-operate')[0].getAttribute('src');
    $.ajax({url: '/' + parseInt(Math.random() * 10000000) + '.php?action=delete&value=' + src,
        success: function (data) {
            load_data();
        }
    });
}

function irename(b) {
    b.preventDefault();
    b.stopPropagation();
    var src = $(b.target).closest('.file-operate')[0];
    window.location = '/file/rename.html?path=' + src.getAttribute('src') + "&isFile=" + src.getAttribute('file') + "&name=" + src.getAttribute('name');
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
function roundFun(numberRound, roundDigit) {
    if (numberRound >= 0) {
        var tempNumber = parseInt((numberRound * Math.pow(10, roundDigit) + 0.5)) / Math.pow(10, roundDigit);
        return   tempNumber;
    } else {
        numberRound1 = -numberRound
        var tempNumber = parseInt((numberRound1 * Math.pow(10, roundDigit) + 0.5)) / Math.pow(10, roundDigit);
        return   -tempNumber;
    }
}