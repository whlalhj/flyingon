/*
线条

*/
flyingon.class("DashLine", flyingon.Shape, function (Class, flyingon) {


    //虚线规则
    this.defineProperty("dashArray", [3, 3]);



    this.buildPath = function (context, x, y, width, height) {

        context.dashLine(x, y, x + width, y + height, this.dashArray);
    };


});

