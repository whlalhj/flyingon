/*

字体: 类css font格式

注1: 但不支持继承父元素的的属性
注2: font-size只支持"数字+单位"的形式
注3: font-size可使用单位px, em, in, mm, cm, pt, pc(1in = 2.54cm = 25.4mm = 72pt = 6pc = 96px) 其中em是12的倍数
注4: 不支持lineHeight


*/
(function (flyingon) {


    var regex_size = /(\d+(px|in|cm|mm|pt|pc|%)|x*-*small|medium|x*-*large)\/?/g,

        regex_split = /\s+/,

        regex_unit = /\d+|\w+|%/g,

        //单位换算
        unit_scale = {

            "in": 96,
            cm: 96 / 2.54,
            mm: 96 / 25.4,
            pt: 4 / 3,
            pc: 96 / 6,
            em: 12
        },

        //字体大小关键字
        size_keys = {

            "xx-small": 9,
            "x-small": 9,
            "small": 9,
            "medium": 12,
            "large": 24,
            "x-large": 36,
            "xx-large": 48
        },

        //解析关键字
        parse_keys = {

            italic: "__style__",
            oblique: "__style__",
            "small-caps": "__variant__",
            bold: "__weight__",
            bolder: "__weight__",
            lighter: "__weight__"
        };


    for (var i = 100; i <= 900; i += 100)
    {
        parse_keys["" + i] = "__weight__";
    }


    var parse_data = {};

    function compute_size(target, value, unit) {

        if (unit)
        {
            target.__size__ = value + unit;
            target.__height__ = Math.round(value * unit_scale[unit]);
        }
        else
        {
            target.__size__ = value;
            target.__height__ = size_keys[value] || +value;
        }
    };

    function parse_size(all, value, unit, index) {

        var data = parse_data;

        if (!data.lineHeight) //不解析lineHeight
        {
            compute_size(data.target, value, unit);
            data.style = index - 1;
            data.lineHeight = true;
        }

        data.family = index + all.length + 1;
    };

    var prototype = (flyingon.Font = function (text) {

        if (text)
        {
            var data = parse_data,
                values,
                name,
                value;

            data.target = this;
            data.lineHeight = false;

            //parse size
            text.replace(regex_size, parse_size);

            //parse style || variant || weight
            if (data.style > 0)
            {
                values = text.substring(0, data.style).split(regex_split);

                for (var i = 0, length = values.length; i <= length; i++)
                {
                    if (name = parse_keys[value = values[i++]])
                    {
                        this[name] = value;
                    }
                }
            }

            //family
            if (data.family + 1 < text.length)
            {
                this.__family__ = text.substring(data.family);
            }
        }

        //初始化
        this.__initialize__();

    }).prototype;




    var storage_list = {}; //测量缓存


    //初始化
    prototype.__initialize__ = function () {

        //计算值
        var value = this.__value__ = [this.__style__, this.__variant__, this.__weight__, this.__size__, this.__family__].join(" ");

        //缓存文字测量结果
        if (!(this.__storage__ = storage_list[value]))
        {
            var context = document.createElement("canvas").getContext("2d");

            context.font = value;

            this.__storage__ = storage_list[value] = {

                //缓存上下文
                context: context,

                //缓存汉字宽度
                chinese: context.measureText("汉").width
            };
        }
    };





    var defineProperty = function (name, defaultValue) {

        var key = "__" + name + "__";

        prototype[key] = defaultValue;

        flyingon.defineProperty(prototype, name,

            new Function("return this.__" + name + "__;"),

            function (value) {

                if (value && value !== this[key])
                {
                    this[key] = value;
                    this.__initialize__();
                }
            });
    };



    //字体样式 normal italic oblique
    defineProperty("style", "normal");

    //字体变体 normal small-caps
    defineProperty("variant", "normal");

    //字体粗细 normal bold bolder lighter 100 200 300 400 500 600 700 800 900
    defineProperty("weight", "normal");

    //字体系列
    defineProperty("family", "微软雅黑,宋体,Times New Roman");


    prototype.__size__ = "9pt";

    //字体大小 xx-small x - small small medium large x-large xx-large
    flyingon.defineProperty(prototype, "size",

        function () {

            return this.__size__;
        },

        function (value) {

            if (value && value !== this.__size__)
            {
                var unit;

                if (value.constructor == String)
                {
                    value = value.match(regex_unit);
                    unit = value[1];
                    value = value[0];
                }

                compute_size(this, value, unit);
                this.__initialize__();
            }
        });

    //字体高度
    prototype.__height__ = 12;

    //字体高度
    flyingon.defineProperty(prototype, "height", function () {

        return this.__height__;
    });



    //测量文字宽度
    prototype.measureText = function (text) {

        var storage = this.__storage__;
        return storage[text] || (storage[text] = storage.context.measureText(text).width);
    };


    prototype.toString = prototype.toLocaleString = function () {

        return this.__value__;
    };


    //默认字体
    flyingon.Font.__default__ = new flyingon.Font();



})(flyingon);
