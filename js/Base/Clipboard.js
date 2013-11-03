/*

*/
(function ($) {



    var data = { text: null };


 
    $.enableClipboard = function (enable) {

        if (enable)
        {
            if (window.clipboardData)
            {
                $.getClipboardText = function () {

                    return window.clipboardData.getData("text");
                };

                $.setClipboardText = function (value) {

                    window.clipboardData.setData("text", value);
                };

                $.clearClipboardText = function () {

                    window.clipboardData.clearData("text");
                };

                return;
            }
        }


        $.getClipboardText = function () {

            return data["text"];
        };

        $.setClipboardText = function (value) {

            data["text"] = value;
        };

        $.clearClipboardText = function () {

            data["text"] = null;
        };
    };



    $.enableClipboard(true);


})(flyingon);