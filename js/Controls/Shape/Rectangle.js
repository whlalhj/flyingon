/*
矩形

*/
flyingon.class("Rectangle", flyingon.Shape, function (Class, flyingon) {



    this.draw = function (context, x, y, width, height) {

        context.rect(x, y, width, height, this.anticlockwise);
    };


});

