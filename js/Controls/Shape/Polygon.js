/*
椭圆

*/
flyingon.class("Polygon", flyingon.Shape, function (Class, flyingon) {



    this.defineProperty("sides", 6);

    this.defineProperty("radius", 20);

    this.defineProperty("angle", 0);



    this.buildPath = function (context, x, y, width, height) {

        var storage = this["x:storage"];
        context.polygon(storage.sides, x + width / 2, y + height / 2, storage.radius, storage.angle, storage.anticlockwise);
    };


});

