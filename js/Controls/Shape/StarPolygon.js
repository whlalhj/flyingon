/*
椭圆

*/
flyingon.class("StarPolygon", flyingon.Shape, function (Class, flyingon) {



    this.defineProperty("vertexes", 5);

    this.defineProperty("radius1", 20);

    this.defineProperty("radius2", 10);

    this.defineProperty("angle", 0);



    this.buildPath = function (context, x, y, width, height) {

        var storage = this["x:storage"];
        context.starPolygon(storage.vertexes, x + width / 2, y + height / 2, storage.radius1, storage.radius2, storage.angle, storage.anticlockwise);
    };


});

