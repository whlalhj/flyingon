/*

字体对象 注:字体的属性一旦创建就不能够更改 只能根据当前字体衍生(derive)出新字体


*/
(function (flyingon) {



    var prototype = (flyingon.Font = function (style, variant, weight, size, family) {

        if (arguments.length > 0)
        {
            this["x:storage"] = [style, variant, weight, size, family];
            initialize.call(this);
        }

    }).prototype;



    function initialize() {

        var storage = this["x:storage"];

        if (typeof storage[3] == "number")
        {
            this.height = storage[3];
            storage[3] += "px";
        }
        else
        {
            this.height = parseInt(storage[3]);
        }

        var cache = this["x:cache"] = {},
            context = this["x:context"] = document.createElement("canvas").getContext("2d"),
            text = "a b";

        context.font = storage[5] = storage.join(" ");

        cache["汉"] = context.measureText("汉").width;
        cache[" "] = context.measureText(" ").width;
    };




    var defineProperty = function (name, index) {

        flyingon.defineProperty(prototype, name, function () {

            return this["x:storage"][index];
        });
    };



    //字体样式 normal italic oblique
    defineProperty("style", 0);

    //字体变体 normal small-caps
    defineProperty("variant", 1);

    //字体粗细 normal bold bolder lighter 100 200 300 400 500 600 700 800 900
    defineProperty("weight", 2);

    //字号
    defineProperty("size", 3);

    //字体系列
    defineProperty("family", 4);

    //字体值
    defineProperty("value", 5);

    //字体高度
    prototype.height = 12;


    ////start     文本在指定的位置开始
    ////end       文本在指定的位置结束
    ////center    文本的中心被放置在指定的位置
    ////left      文本左对齐
    ////right     文本右对齐
    //prototype.align = "start";

    ////alphabetic    文本基线是普通的字母基线
    ////top           文本基线是 em 方框的顶端
    ////hanging       文本基线是悬挂基线
    ////middle        文本基线是 em 方框的正中
    ////ideographic   文本基线是表意基线
    ////bottom        文本基线是 em 方框的底端
    //prototype.baseline = "alphabetic";




    //以当前字体为原型衍生出新字体  properties : { style:XXX, variant:XXX, weight:XXX, size:XXX, family:XXX }
    prototype.derive = function (properties) {

        var result = new flyingon.Font(),
            data = result["x:storage"] = this["x:storage"].slice(0, 4);

        data[0] = properties.style || data[0];
        data[1] = properties.variant || data[1];
        data[2] = properties.weight || data[2];
        data[3] = properties.size || data[3];
        data[4] = properties.family || data[4];

        initialize.call(result);

        return result;
    };


    //根据当前字体衍生出粗体
    prototype.deriveBold = function () {

        return this["bold"] = this.derive({ weight: "bold" });
    };

    //根据当前字体衍生出斜体
    prototype.deriveItalic = function () {

        return this["italic"] = this.derive({ style: "italic" });
    };

    //根据当前字体衍生出粗斜体
    prototype.deriveBoldItalic = function () {

        var result = this.derive({ weight: "bold", style: "italic" }),
            cache;

        if (cache = this["bold"])
        {
            cache["italic"] = result;
        }

        if (cache = this["italic"])
        {
            cache["bold"] = result;
        }

        return this["bold-italic"] = result;
    };



})(flyingon);
