/// <reference path="../../../js/flyingon.js" />



flyingon.__text_line_type = {

    lr: {

        layout: function () {

        },

        hitTest: function (x, y) {

        },

        paint: function () {

        }
    }


};





//文本行
(function () {



    flyingon.__fn_text_line = function (type) {


    };


    this.x = this.y = this.width = this.height = 0;


    this.layout = function (target, clientRect, start, end) {

        this.text = target.text;
        this.clientRect = clientRect;
        this.start = start;
        this.end = end;
    };


    this.hitTest = function (x, y) {

    };


    this.paint = function (context) {


    };



}).call((flyingon.TextLine = function () { }).prototype);

