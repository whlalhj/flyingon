(function (flyingon) {


    var regex = /\s*,\s*/g;


    var Class = (function (value) {



    }).extend(function () {


        this.style = "none";

        this.color = "black";

        this.width = 0;

        this.radius = 0;



        this.copy = function () {

            var result = new Border();

            result.style = this.style;
            result.color = this.color;
            result.width = this.width;
            result.radius = this.radius;

            return result;
        };


        //转换为字符串
        this.toString = this.toLocaleString = this.serializeTo = function () {

            return this.width + "px " + this.style + " " + this.color + " " + this.radius + "px";
        };

    });



    var Border = flyingon.Border = (function (value) {

        this.border_all = new Border(value);

    }).extend(function () {


        //所有边框
        this.border_all = null;

        //上边框宽度
        this.border_top = null;

        //右边框宽度
        this.border_right = null;

        //下边框宽度
        this.border_bottom = null;

        //左边框
        this.border_left = null;



        var split_regex = /\s+/g;

        function defineProperty(target, name) {

            flyingon.defineProperty(target, name,

                new Function("return this.__" + name + "__;"),

                function (value) {

                    var all = this.border_all,
                        values = value.split(split_regex);

                    if (values.length === 1 && all)
                    {
                        all[name] = value;
                    }
                    else
                    {
                        if (all)
                        {
                            this.border_all = null;
                            this.border_top = all.copy();
                            this.border_right = all.copy();
                            this.border_bottom = all.copy();
                            this.border_left = all.copy();
                        }

                        this.border_top[name] = values[0];
                        this.border_right[name] = values[1];
                        this.border_bottom[name] = values[2] || values[0];
                        this.border_left[name] = values[3] || values[1];
                    }
                });
        };



        /*
        边框样式 注:未完全实现

        none	定义无边框 
        dotted	定义点状边框 在大多数浏览器中呈现为实线 
        dashed	定义虚线 在大多数浏览器中呈现为实线 
        solid	定义实线 
        double	定义双线 双线的宽度等于border-width的值 
        //groove	定义3D凹槽边框 其效果取决于border-color的值 
        //ridge	    定义3D垄状边框 其效果取决于border-color的值 
        //inset	    定义3Dinset边框 其效果取决于border-color的值 
        //outset	定义3Doutset边框 其效果取决于border-color的值 
        //inherit	规定应该从父元素继承边框样式 
        */
        defineProperty(this, "style", "none");

        //边框颜色
        defineProperty(this, "color", "black");

        //边框宽度
        defineProperty(this, "width", 0);

        /*
        圆角大小 注:只支持整数 与css不一样
        */
        defineProperty(this, "radius", 0);

        ///*
        //边框图像 不支持

        //border-image-source	用在边框的图片的路径
        //border-image-slice	图片边框向内偏移
        //border-image-width	图片边框的宽度
        //border-image-outset	边框图像区域超出边框的量
        //border-image-repeat	图像边框是否应平铺(repeated)、铺满(rounded)或拉伸(stretched)
        //*/

        ///*
        //边框阴影 shadow 不支持
        //语法:h-shadow v-shadow blur spread color inset

        //h-shadow	必需 水平阴影的位置 允许负值
        //v-shadow	必需 垂直阴影的位置 允许负值
        //blur	可选 模糊距离
        //spread	可选 阴影的尺寸
        //color	可选 阴影的颜色
        //inset	可选 将外部阴影(outset)改为内部阴影
        //*/



        //创建属性
        ["left", "top", "right", "bottom"].forEach(function (name) {

            var key = "border" + name;

            flyingon.defineProperty(this, name,

                function () {

                    return this[key];
                },

                function (value) {

                    if (value != this[key])
                    {
                        this[key] = value instanceof Border ? value : new Border("" + value);
                    }
                });




        }, this);




        //左右空间和
        flyingon.defineProperty(this, "spaceX", function () {

            return this.left.width + this.right.width;
        });

        //上下空间和
        flyingon.defineProperty(this, "spaceY", function () {

            return this.top.width + this.bottom.width;
        });


    });





    //边线名称集合
    Thickness.sides = ["top", "right", "bottom", "left"];

    //子样式属性名称集合
    Thickness.names = ["top", "right", "bottom", "left"];



    //注册样式转换
    ["margin", "padding"].forEach(function (name) {


        flyingon.__fn_style_convert__(name, function (style, value) {

            return value instanceof Thickness ? value : (this[name] = new Thickness(value));
        });


        for (var i = 0, length = Thickness.names; i < length; i++)
        {
            var key = Thickness.names[i];

            flyingon.__fn_style_convert__(name + key[0].toUpperCase() + key.substring(1), function (style, value) {

                var result = style[name] || (style[name] = new Thickness());
                result[key] = value;
                return result;

            }, name);
        };


    }, this);




})(flyingon);