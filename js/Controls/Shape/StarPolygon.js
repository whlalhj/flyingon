/*
椭圆

*/
flyingon.class("StarPolygon", flyingon.Shape, function (Class, flyingon) {



    this.defineProperty("vertexes", 5);

    this.defineProperty("radius1", 20);

    this.defineProperty("radius2", 10);

    this.defineProperty("angle", 0);



    this.draw = function (context, x, y, width, height) {

        context.starPolygon(this.vertexes, x + width / 2, y + height / 2, this.radius1, this.radius2, this.angle, this.anticlockwise);
    };


});

