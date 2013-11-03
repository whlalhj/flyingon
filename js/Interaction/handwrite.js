(function () {

    alert("load handwrite.js");
    var nav = navigator;
    var isIE = nastorage.userAgent.indexOf("MSIE") >= 0;
    var isFirefox = nastorage.userAgent.indexOf("Firefox") >= 0;


    hw = {};
    var dom = document.createElement('IFRAME');  //创建iframe 否则chrome无法访问baidu的数据
    dom.src = "about:blank";

    hw.dom = dom;

    //注意：ie必须要用javascript:window["contents"]的方式来让其执行js，否则会报init未找到方法
    if (isIE) {
        var content = '<object id="hwflash" width="304" height="239" align="middle" codebase="http://fpdownload.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=6,0,0,0" classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000"><param name="wmode" value="Opaque"><param name="allowscriptaccess" value="always"><param name="movie" value="http://www.baidu.com/hw/main.swf"></object><input type="button" value = "click" onclick="alert(hw.charSelect);" />';
        dom.onload = function () {
            dom.contentDocument.body.innerHTML = content;

            dom.contentWindow.hw = {};
            dom.contentWindow.hw.charSelect = function (value, flag) {
                alert(value);
            };

            //dom.contentWindow.document.open();
            //dom.contentWindow.document.write(content);
            //dom.contentWindow.document.close();
            //dom.contentWindow.document.body.innerHTML = content;
            alert("loaded");
        };
    }
    else {
        var wmode = /Chrome/i.test(navigator.userAgent) ? ' wmode="window" ' : ' wmode="Opaque" ';
        var content = '<html><head></head><body><embed name="hwflash" width="304" height="239" align="middle" pluginspage="http://www.macromedia.com/go/getflashplayer" type="application/x-shockwave-flash" src="http://www.baidu.com/hw/main.swf" ' + wmode + ' allowscriptaccess="always" ver="9.0.0"/></body></html>';
        dom.onload = function () {
            dom.onload = null;
            dom.contentWindow.document.open();
            dom.contentWindow.document.write(content);
            dom.contentWindow.document.close();
            dom.contentWindow.document.body.innerHTML = content;
            alert("loaded");
        };
    };


    //window.hw.ready = function () {
    //};

    //hw.charSelect = function (value, flag) {

    //    if (window.hw.input) {
    //        if (document.selection) {
    //            hw.input.focus();

    //            var rang = document.selection.createRange();
    //            rang.text = value;
    //            rang.collapse();
    //            rang.select()
    //        }
    //        else if (hw.input.selectionStart || hw.input.selectionStart > -1) {
    //            var start = hw.input.selectionStart;
    //            var end = hw.input.selectionEnd;

    //            hw.input.value = hw.input.value.substring(0, start) + value + hw.input.value.substring(end, hw.input.value.length);
    //            hw.input.selectionStart = start + value.length;
    //            hw.input.selectionEnd = hw.input.selectionStart;

    //            if (isFirefox) {
    //                hw.input.focus()
    //            }
    //            else {
    //                hw.input.blur()
    //            }
    //        }
    //        else {
    //            hw.input.focus();
    //            hw.input.value += value
    //        };
    //    };
    //};

    //window.hw.close = function () {
    //    if (hw.dom.parentNode) {
    //        hw.dom.parentNode.removeChild(hw.dom);
    //    };
    //};


})();

