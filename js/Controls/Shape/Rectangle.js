/*
矩形

*/
flyingon.class("Rectangle", flyingon.Shape, function (Class, flyingon) {



    this.buildPath = function (context, x, y, width, height) {

        context.rect(x, y, width, height, this["x:storage"].anticlockwise);
    };


});

