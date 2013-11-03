/*
矩形

*/
$.class("RoundRectangle", $.Shape, function ($) {



    this.defineProperty("radius", 5);



    this.buildPath = function (context, x, y, width, height) {

        var storage = this["x:storage"];
        context.roundRect(x, y, width, height, storage.radius, storage.anticlockwise);
    };


});

