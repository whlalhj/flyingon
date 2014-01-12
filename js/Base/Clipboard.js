/*

*/
(function (flyingon) {



    var data = { text: null };


 
    flyingon.enableClipboard = function (enable) {

        if (enable)
        {
            if (window.clipboardData)
            {
                flyingon.getClipboardText = function () {

                    return window.clipboardData.getData("text");
                };

                flyingon.setClipboardText = function (value) {

                    window.clipboardData.setData("text", value);
                };

                flyingon.clearClipboardText = function () {

                    window.clipboardData.clearData("text");
                };

                return;
            }
        }


        flyingon.getClipboardText = function () {

            return data["text"];
        };

        flyingon.setClipboardText = function (value) {

            data["text"] = value;
        };

        flyingon.clearClipboardText = function () {

            data["text"] = null;
        };
    };



    flyingon.enableClipboard(true);


})(flyingon);