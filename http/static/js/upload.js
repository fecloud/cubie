/**
 * Created with JetBrains WebStorm.
 * User: ouyangfeng
 * Date: 7/4/14
 * Time: 21:21
 * To change this template use File | Settings | File Templates.
 */
function fileSelected() {

    var count = document.getElementById('upload').files.length;

    document.getElementById('details').innerHTML = "";

    for (var index = 0; index < count; index++) {

        var file = document.getElementById('upload').files[index];

        var fileSize = 0;

        if (file.size > 1024 * 1024)

            fileSize = (Math.round(file.size * 100 / (1024 * 1024)) / 100).toString() + 'MB';

        else

            fileSize = (Math.round(file.size * 100 / 1024) / 100).toString() + 'KB';

        document.getElementById('details').innerHTML += 'Name: ' + file.name + '<br>Size: ' + fileSize + '<br>Type: ' + file.type;

        document.getElementById('details').innerHTML += '<p>';

    }

    uploadFile();

}

function uploadFile() {

//            var fd = new FormData(document.forms.namedItem('form1'));

    var fd = new FormData();
    var count = document.getElementById('upload').files.length;

    var files = [];
    for (var index = 0; index < count; index++) {

        var file = document.getElementById('upload').files[index];
        var filename = '';
        if (file.name == "image.jpg") {
            filename = new Date().format("yyyy-MM-dd hh:mm:ss-") + index + '.jpg'
        } else {
            filename = file.name;
        }
        fd.append(filename, file);
        files.push(filename);
    }

    var xhr = new XMLHttpRequest();

    xhr.upload.addEventListener("progress", uploadProgress, false);

    xhr.addEventListener("load", uploadComplete, false);

    xhr.addEventListener("error", uploadFailed, false);

    xhr.addEventListener("abort", uploadCanceled, false);

    xhr.open("POST", "a.php?action=upload&value=/&files=" + JSON.stringify(files));
    xhr.send(fd);
    $('.progress-bar b').width(0);
}

function uploadProgress(evt) {

    if (evt.lengthComputable) {

        var percentComplete = Math.round(evt.loaded * 100 / evt.total);

        document.getElementById('progress').innerHTML = percentComplete.toString() + '%';

        var h = $('.progress-bar').width();
        h = h / 100;
        $('.progress-bar b').width(h * parseFloat(percentComplete.toString()) - 2);
    }


    else {

        document.getElementById('progress').innerHTML = 'unable to compute';

    }

}

function uploadComplete(evt) {

    /* This event is raised when the server send back a response */
    var h = $('.progress-bar').width();
    console.log(h);
    $('.progress-bar b').width(h - 2);
    alert(evt.target.responseText);

}

function uploadFailed(evt) {

    alert("There was an error attempting to upload the file.");
    $('.progress-bar b').css({background: "red"});
}

function uploadCanceled(evt) {

    alert("The upload has been canceled by the user or the browser dropped the connection.");

}
