/*
椭圆

*/
$.class("Ellipse", $.Shape, function (Class, $) {





    this.buildPath = function (context, x, y, width, height) {

        context.ellipse(x + width / 2, y + height / 2, width, height, this["x:storage"].anticlockwise);
    };


});

