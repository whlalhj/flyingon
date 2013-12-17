/*
矩形

*/
$.class("Rectangle", $.Shape, function (Class, $) {



    this.buildPath = function (context, x, y, width, height) {

        context.rect(x, y, width, height, this["x:storage"].anticlockwise);
    };


});

