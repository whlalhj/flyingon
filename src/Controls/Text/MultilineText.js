/// <reference path="../../../js/flyingon.js" />

(function (flyingon) {


    flyingon.multiline_text_extender = function () {



        //文本行缩进
        this.defineProperty("textIndent", 0, attributes);


        //是否自动换行
        this.defineProperty("textWrap", false, false, "this.__rows__.clear();\n");


    };


})(flyingon);