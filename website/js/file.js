var current_path = '/';
var count = 0;
var page_num = 30;
var loading = false; //是否ajax在加载中
var more = true;

$(document).ready(function () {

    changeFileUpload();

    var path = getArgs('path');
    if (path == '')
        path = "/";
    current_path = path;


    //每一次加载
    load_data(function () {
        $('#loading').css({display: 'block'});
    }, function () {
        $('#loading').css({display: 'none'});
        $(window).scroll(function () {
            if ($(window).height() + $(window).scrollTop() >= $(document.body).height() - 5) {
                //滚动到最底部了
                if (!loading && more) {
                    load_data(function () {
                        $('#bottom_loading').css({display: 'block'});
                        $(window).scrollTop($(window).scrollTop() + 44);
                    }, function () {
                        $('#bottom_loading').css({display: 'none'});
                    });
                }
            }

        });
    });
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

    $('#search_btn').bind('click', search);

    $('#search_input').bind('keypress', function (event) {
        if (event.keyCode == "13") {
            search();
        }
    });


});


function search() {
    var query = $('#search_input').val();
    if (query != '') {
        $('#loading').css({display: 'block'});
        $(window).scroll(function () {
            //console.log('search');
        });
        $('#content').html('');
        $.ajax({url: fm_service + parseInt(Math.random() * 10000000) + '.php?action=search&value=' + current_path + '&query=' + query,
            success: function (data) {
                if (data.error == '') {
                    load_list(data);
                }
                $('#loading').css({display: 'none'});
            }
        });
    }
}

/**
 * 当是pc时加上multiple='multiple'
 */
function changeFileUpload() {
    var user_agent = window.navigator.userAgent;
    if ((user_agent.indexOf('iPhone') > -1) || (user_agent.indexOf('Android') > -1) || (user_agent.indexOf('Ipad') > -1)) {
        //ios android
    } else {
        var input = $('#upload')[0];
        input.setAttribute('multiple', 'multiple');
    }
}

/**
 * 加载数据
 * @param count
 * @param pagenum
 */
function load_data(befor, end) {
    if (befor != undefined) {
        befor.call();
    }

    loading = true;
    var address = fm_service + parseInt(Math.random() * 10000000) + '.php?action=list&value=' + current_path + '&skip=' + count + "&num=" + page_num;
    $.ajax({url: address,
        success: function (data) {
            loading = false;
            more = data.more;
            load_list(data);
            if (end != undefined) {
                end.call();
            }
        },
        error: function () {
            loading = false;
        }
    });
}


function load_list(data) {
    if (data && data.error == '' && data.data) {
        var arr = data.data;
        count += arr.length;
        for (var i = 0, len = arr.length; i < len; i++) {
            var file = arr[i];
            var item = '<li class="list-item"><a href="index.html?path={0}" class="file-desc clean_right"><i class="file-icon {1}"></i><div class="content"><h3>{2}</h3><div class="list-content">{3}<span>{4}</span></div></div><div class="show-operate"><i class="idown"></i></div></a><div class="file-operate" src="{5}" file="{6}" name="{7}"><div class="file-rename"><i class="iedit"></i>重命名</div><div class="file-delete" ><i class="iremove"></i>删除</div></div></li>';
            ;
            if (file.isDir) {
                item = item.format(file.path, "folder", file.name, new Date(file.mtime).format("yyyy-MM-dd hh:mm:ss"), "", file.path, file.isFile, file.name);
            } else {
                item = item.format(file.path, getFileTypeCss(file.name), file.name, new Date(file.mtime).format("yyyy-MM-dd hh:mm:ss"), renderSize(file.size), file.path, file.isFile, file.name);
            }
            $('#content').append(item);

        }

        $(".show-operate").unbind('click');
        $('.file-delete').unbind('click');
        $('.file-rename').unbind('click');

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
    $(b.target).closest('li').toggleClass(function () {
        return 'list-item-show';
    });
    console.log("idown");
}

function iremove(b) {
    b.preventDefault();
    b.stopPropagation();
    var src = $(b.target).closest('.file-operate')[0].getAttribute('src');
    $.ajax({url: fm_service + parseInt(Math.random() * 10000000) + '.php?action=delete&value=' + src,
        success: function (data) {
            load_data(function () {
                $('#loading').css({display: 'block'});
                page_num = count
                count = 0;
                $('#content').html('');
            }, function () {
                $('#loading').css({display: 'none'});
                page_num = 30;
            });
        }
    });
}

function irename(b) {
    b.preventDefault();
    b.stopPropagation();
    var src = $(b.target).closest('.file-operate')[0];
    window.location = '/file/rename.html?path=' + src.getAttribute('src') + "&isFile=" + src.getAttribute('file') + "&name=" + src.getAttribute('name');
}


