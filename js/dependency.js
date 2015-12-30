
//FingerPrint dep

var service_url = 'http://insight-kiosk.azurewebsites.net';

//Fingerprint
var flagFingerID_get = 0;
var device_fingerID = '';
var Error_count = 0;

function InitFingerPrint(Port) {
    FingerprintService.InitFingerPrint(Port);
}

function getFingerIdOnMessage(arg) {
    if (arg.Message.trim() == '-1' || arg.Message.trim() == '-3') {
        fpcb(false);
    }

    if (flagFingerID_get == 1) {
        device_fingerID = arg.Message.trim();
        
        if (fpcb != null) {
            fpcb(device_fingerID == user.FingerID);
        }

        flagFingerID_get = 0;
    }

    if (arg.Message.trim() == "OK") {
        flagFingerID_get = 1;
    }
}

if (hasService('FingerprintService')) {
    addHandler(EVENTS.FingerprintOnMessage, getFingerIdOnMessage);
    console.log("指紋機已連接！");
} else {
    console.log("指紋機未連接！");
}

var fpcb = null;
var user = null;
function CheckFingerPrint(id, cb) {
    fpcb = cb;
    getUserData(id, function (result) {
        user = result;
        if (user != null) {
            FingerprintService.getFingerId();
        } else {
            alert("查無此人");
        }
    });
}

function getUserData(id, callback) {
    //取得人員的資料(json)
    var http = new XMLHttpRequest();
    var url = service_url + '/api/getUser?IDNumber=' + id;

    http.open("GET", url, true);
    http.onreadystatechange = function () {

        if (http.readyState == 4 && http.status == 200) {
            //辨識結果的處理
            callback(JSON.parse(http.response));
        }
    }
    http.send();
}


//FaceCheck dep

var service_url = 'http://insight-kiosk.azurewebsites.net';



function TakePicture(id) {
    var canvas = document.createElement("canvas");
    var context = canvas.getContext('2d');

    var video = document.getElementById(id);
    canvas.width = video.getAttribute('width');
    canvas.height = video.getAttribute('height');
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL('image/png');
}

function CheckFace(id, pic, cb) {
    var http = new XMLHttpRequest();
    var url = service_url + '/api/checkFace';

    http.open("POST", url, true);
    http.setRequestHeader('Content-type', 'application/json');
    http.onreadystatechange = function () {
        if (http.readyState == 4 && http.status == 200) {
            //辨識結果的處理
            cb(JSON.parse(http.response) == "True");
        } else if(http.readyState == 4) {
            //api呼叫失敗的處理！
            cb(false);
        }
    };

    //要傳入的參數
    var body = {
        "IDNumber": id,
        "Url": pic
    };
    http.send(JSON.stringify(body));
}


//IcCard dep

var inserted_cb = null;
function ICCardInserted(cb) {
    console.log(cb);
    inserted_cb = cb;
}

function _ICCardInserted(data) {
    if (inserted_cb != null) {
        inserted_cb(data);
    }
}

var ejected_cb = null;
function ICCardEjected(cb) {
    ejected_cb = cb;
}

function _ICCardEjected() {
    if (ejected_cb != null) {
        ejected_cb();
    }
}

if (hasService('ICCardReaderService')) {
    addHandler(EVENTS.IC_CARD_INSERTED, _ICCardInserted);
    addHandler(EVENTS.IC_CARD_EJECTED, _ICCardEjected);
    console.log("ICCardReaderService 載入!");
} else {
    console.log("ICCardReaderService 未載入!");
}