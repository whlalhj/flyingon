/*

字体: 类css font格式

注1: 但不支持继承父元素的的属性
注2: font-size只支持"数字+单位"的形式
注3: font-size可使用单位px, em, in, mm, cm, pt, pc(1in = 2.54cm = 25.4mm = 72pt = 6pc = 96px) 其中em是12的倍数
注4: 不支持lineHeight


*/
(function (flyingon) {


    var storage_list = {}, //测量缓存

        parse_data = {}, //解析数据

        regex_size = /(\d+(px|in|cm|mm|pt|pc|%)|x*-*small|medium|x*-*large)\/?/g,

        regex_split = /\s+/,

        regex_unit = /\d+|\w+|%/g,

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




    function parse_size(all, value, unit, index) {

        var data = parse_data;

        if (data.lineHeight)
        {
            data.target.__lineHeight__ = all;
        }
        else
        {
            data.target.__size__ = all;

            data.style = index - 1;
            data.lineHeight = true;
        }

        data.family = index + all.length + 1;
    };




    var Font = flyingon.Font = (function (text) {

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


    }).extend(function (flyingon) {


        var self = this,

            round = Math.round,

            defineProperty = function (name, defaultValue) {

                var key = "__" + name + "__";

                self[key] = defaultValue;

                flyingon.defineProperty(self, name,

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


        //字体大小 xx-small x - small small medium large x-large xx-large
        defineProperty("size", "9pt");


        //行高
        defineProperty("lineHeight", 1.2);


        //字体系列
        defineProperty("family", "微软雅黑,宋体,Times New Roman");



        //字体高度
        this.__font_height__ = 12;

        //行高
        this.__line_height__ = 14;



        //计算绝对大小
        function compute(value) {

            if (value.constructor === String)
            {
                var values = value.split(regex_unit);

                value = values[0];
                return values.length > 1 ? this.compute(value, values[1]) : size_keys[value] || +value;
            }

            return value;
        };


        //初始化
        this.__initialize__ = function () {

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

                    //缓存空格
                    space: context.measureText(" ").width,

                    //缓存x
                    x: context.measureText("x").width,
                };
            }


            this.__font_height__ = compute.call(this, this.__size__);
            this.__line_height__ = compute.call(this, this.__lineHeight__);
        };



        //计算实际大小
        this.compute = function (value, unit) {

            if (unit)
            {
                switch (unit)
                {
                    case "px":
                        return value;

                    case "in":
                        return round(value * 96);

                    case "cm":
                        return round(value * 96 / 2.54);

                    case "mm":
                        return round(value * 96 / 25.4);

                    case "pt":
                        return round(value * 4 / 3);

                    case "pc":
                        return round(value * 16); //96 / 6

                    case "em":
                        return round(value * this.__font_height__);

                    case "ex":
                        return round(value * this.__storage__.x);

                    case "%":
                        return round(value * this.__font_height__ / 100);
                }
            }

            return value;
        };


        //测量文字总宽度
        this.measureText = function (text, letterSpacing, wordSpacing) {

            if (text)
            {
                var result = 0,
                    storage = this.__storage__,
                    length = text.length;

                storage[" "] = storage.space + this.wordSpacing;

                for (var i = 0; i < length; i++)
                {
                    result += storage[text] || (storage[text] = storage.context.measureText(text).width);
                }

                if (letterSpacing)
                {
                    result += length * letterSpacing;
                }

                return result;
            }

            return 0;
        };


        this.toString = this.toLocaleString = function () {

            return this.__value__;
        };

    });




    //默认字体
    Font.__default__ = new Font();

    //子样式属性名称集合
    Font.names = ["style", "variant", "weight", "size", "family"];


    //注册样式转换 因字体子样式属性支持继承所以不支持合并
    flyingon.__fn_style_convert__("font", function (style, value) {

        return value instanceof Font ? value : new Font(value);
    });



})(flyingon);
