/*
线条

*/
flyingon.class("Line", flyingon.Shape, function (Class, flyingon) {


    this.buildPath = function (context, x, y, width, height) {

        context.moveTo(x, y);
        context.lineTo(x + width, y + height);
    };


});

