/*
矩形

*/
flyingon.class("RoundRectangle", flyingon.Shape, function (Class, flyingon) {



    this.defineProperty("radius", 5);



    this.buildPath = function (context, x, y, width, height) {

        context.roundRect(x, y, width, height, this.radius, this.anticlockwise);
    };


});

