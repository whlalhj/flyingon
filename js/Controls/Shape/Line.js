/*
线条

*/
$.class("Line", $.Shape, function ($) {


    this.buildPath = function (context, x, y, width, height) {

        context.moveTo(x, y);
        context.lineTo(x + width, y + height);
    };


});

