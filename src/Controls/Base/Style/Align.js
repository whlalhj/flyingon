(function (flyingon) {


    var regex = /top|middle|bottom|left|center|right/g;


    //对齐
    var Align = flyingon.Align = (function (value) {

        if (value)
        {
            var values = ("" + value).toLowerCase().match(regex);

            for (var i = 0, length = values.length; i < length; i++)
            {
                switch (value = values[i])
                {
                    case "left":
                    case "center":
                    case "right":
                        this.horizontal = value;
                        break;

                    default:
                        this.vertical = value;
                        break;
                }
            }
        }

    }).extend(function () {


        //水平对齐
        this.horizontal = "left";

        //垂直对齐
        this.vertical = "top";



        //计算位置
        this.position = function (target, clientRect) {

            target.x = 0;
            target.y = 0;

            switch (this.horizontal)
            {
                case "center":
                    target.x += (clientRect.width - target.width) >> 1;
                    break;

                case "right":
                    target.x += clientRect.width - target.width;
                    break;
            }

            switch (this.vertical)
            {
                case "middle":
                    target.y += (clientRect.height - target.height) >> 1;
                    break;

                case "bottom":
                    target.y += (clientRect.height - target.height);
                    break;
            }

            return target;
        };



        //转换为字符串
        this.toString = this.toLocaleString = this.serializeTo = function () {

            return this.horizontal + "," + this.vertical;
        };


    });




    //注册样式转换
    ["align", "textAlign"].forEach(function (name) {

        flyingon.__fn_style_convert(name, function (style, value) {

            return value instanceof Align ? value : new Align(value);
        });

    });



})(flyingon);