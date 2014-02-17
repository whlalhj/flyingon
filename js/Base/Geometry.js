/*

*/
(function (flyingon) {


    var prototype = (flyingon.Point = function (x, y) {

        this.x = x || 0;
        this.y = y || 0;

    }).prototype;



    prototype.toString = prototype.toLocaleString = function () {

        return "{ x:" + this.x + ", y:" + this.y + " }";
    };


})(flyingon);




(function (flyingon) {


    var prototype = (flyingon.Size = function (width, height) {

        this.width = width || 0;
        this.height = height || 0;

    }).prototype;



    prototype.toString = prototype.toLocaleString = function () {

        return "{ width:" + this.width + ", height:" + this.height + " }";
    };


})(flyingon);




(function (flyingon) {


    var prototype = (flyingon.Rect = function (x, y, width, height) {

        if (arguments.length > 0)
        {
            this.x = x || 0;
            this.y = y || 0;
            this.width = width || 0;
            this.height = height || 0;
        }

    }).prototype;



    prototype.x = 0;

    prototype.y = 0;

    prototype.width = 0;

    prototype.height = 0;



    flyingon.defineProperty(prototype, "right", function () {

        return this.x + this.width;
    });

    flyingon.defineProperty(prototype, "bottom", function () {

        return this.y + this.height;
    });



    prototype.copy = function (width_delta, height_delta) {

        return new flyingon.Rect(this.x, this.y, this.width + (width_delta || 0), this.height + (height_delta || 0));
    };

    prototype.toString = prototype.toLocaleString = function () {

        return "{ x:" + this.x + ", y:" + this.y + ", width:" + this.width + ", height:" + this.height + " }";
    };


})(flyingon);




(function (flyingon) {


    //角度转弧度系数
    var radian = Math.PI / 180;


    //2D仿射变换矩阵
    //a	水平旋转绘图
    //b	水平倾斜绘图
    //c	垂直倾斜绘图
    //d	垂直缩放绘图
    //e	水平移动绘图
    //f	垂直移动绘图
    var prototype = (flyingon.Matrix = function () {

        this.a = 1;

        this.b = 0;

        this.c = 0;

        this.d = 1;

        this.e = 0;

        this.f = 0;

    }).prototype;


    prototype.fromArray = function (array) {

        this.a = array[0];
        this.b = array[1];
        this.c = array[2];
        this.d = array[3];
        this.e = array[4];
        this.f = array[5];

        return this;
    };

    prototype.toArray = function () {

        return [this.a, this.b, this.c, this.d, this.e, this.f];
    };

    prototype.translate = function (x, y) {

        this.add(1, 0, 0, 1, x, y);
        return this;
    };

    prototype.scale = function (scaleX, scaleY) {

        this.add(scaleX, 0, 0, scaleY, 0, 0);
        return this;
    };

    prototype.rotate = function (angle) {

        angle *= radian;

        var cos = Math.cos(angle);
        var sin = Math.sin(angle);

        this.add(-sin, cos, cos, sin, 0, 0);
        return this;
    };

    prototype.skew = function (skewX, skewY) {

        var x = Math.Tan(skewX * n);
        var y = Math.Tan(skewY * n);

        this.add(1, x, y, 1, 0, 0);
        return this;
    };

    prototype.add = function (a, b, c, d, e, f) {

        var a1 = this.a;
        var b1 = this.b;
        var c1 = this.c;
        var d1 = this.d;

        this.a = a * a1 + b * c1;
        this.b = a * b1 + b * d1;
        this.c = c * a1 + d * c1;
        this.d = c * b1 + d * d1;
        this.e = e * a1 + f * c1 + this.e;
        this.f = e * b1 + f * d1 + this.f;

        return this;
    };


    prototype.transform = function (x, y) {

        return {
            x: Math.round(x * this.a + y * this.b + this.e, 0),
            y: Math.round(x * this.c + y * this.d + this.f, 0)
        };
    };

    prototype.reverse = function (x, y) {

        return {
            x: Math.round((this.b * y - this.d * x + this.d * this.e - this.b * this.f) / (this.c * this.b - this.a * this.d)),
            y: Math.round((this.c * x - this.a * y - this.c * this.e + this.a * this.f) / (this.c * this.b - this.a * this.d))
        };
    };


})(flyingon);
