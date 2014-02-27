/*
椭圆

*/
flyingon.class("Ellipse", flyingon.Shape, function (Class, flyingon) {





    this.draw = function (context, x, y, width, height) {

        context.ellipse(x + width / 2, y + height / 2, width, height, this.anticlockwise);
    };


});

