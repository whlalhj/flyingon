/*

*/
$.class("HandWirte", $.HtmlFrame, function (Class, $) {

    var html = "<html><head><body style='margin:0px;padding:0px;width:100%;height:100%;'>";

    if (navigator.userAgent.match(/MSIE/))
    {
        html += '<object id="hwflash" width="304" height="239" align="middle" codebase="http://fpdownload.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=6,0,0,0" classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000"><param name="wmode" value="Opaque"><param name="allowscriptaccess" value="always"><param name="movie" value="http://www.baidu.com/hw/main.swf"></object>';
    }
    else
    {
        var wmode = /Chrome/i.test(navigator.userAgent) ? ' wmode="window" ' : ' wmode="Opaque" ';
        html += '<embed name="hwflash" width="304" height="239" align="middle" pluginspage="http://www.macromedia.com/go/getflashplayer" type="application/x-shockwave-flash" src="http://www.baidu.com/hw/main.swf" ' + wmode + ' allowscriptaccess="always" ver="9.0.0"/>';
    };

    html += "</body></html>";

    this.render = function () {
        var frame = this.loadHtml.call(this, html);

        frame.width = 304;
        frame.height = 239;
        return frame;
    };

    this.inputed = function (value, flag) {

        var input = this.input;
        if (input)
        {
            if (document.selection)
            {
                input.focus();
                var rang = document.selection.createRange();
                rang.text = value;
                rang.collapse();
                rang.select();
            }
            else if (input.selectionStart || input.selectionStart > -1)
            {
                var start = input.selectionStart;
                var end = input.selectionEnd;

                input.value = input.value.substring(0, start) + value + input.value.substring(end, input.value.length);
                input.selectionStart = start + value.length;
                input.selectionEnd = input.selectionStart;

                if (isFirefox)
                {
                    input.focus();
                }
                else
                {
                    input.blur();
                }
            }
            else
            {
                input.focus();
                input.value += value;
            };
        };
    };

    this.closed = function () {
        //先移除falsh控件 否则会出现异常
        var doc = this[0].contentWindow.document;
        doc.body.removeChild(doc.hwflash);
        this.remove();
    };

    this.loaded = function (frame) {
        var self = this;
        var hw = frame.contentWindow.hw = {};

        hw.ready = function () {
        };

        hw.charSelect = function (value, flag) {
            self.inputed.call(self, value, flag);
        };

        hw.close = function () {
            self.closed.call(self);
        };
    };

});
