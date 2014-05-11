(function (flyingon) {


    var regex = /\s*,\s*/g;


    var Thickness = flyingon.Thickness = (function (value) {

        if (value)
        {
            switch (typeof value)
            {
                case "number":
                    this.left = this.top = this.right = this.bottom = value;
                    return;

                case "string":
                    var values = value.split(regex);
                    break;

                case "object":
                    values = value.constructor === Array ? value : ("" + value).split(regex);
                    break;
            }

            switch (values.length) //上右下左 与html保持一致
            {
                case 1:
                    if (value = values[0] - 0)
                    {
                        this.left = this.top = this.right = this.bottom = value;
                    }
                    break;

                case 2:
                case 3:
                case 4:
                    if (value = values[0])
                    {
                        this.top = value - 0;
                    }

                    if (value = values[1])
                    {
                        this.right = value - 0;
                    }

                    this.bottom = (value = values[2]) ? value - 0 : this.top;
                    this.left = (value = values[3]) ? value - 0 : this.right;
                    break;
            }
        }

    }).extend(function () {


        //上部空间
        this.top = 0;

        //右空间
        this.right = 0;

        //底部空间
        this.bottom = 0;

        //左空间
        this.left = 0;



        //左右空间和
        flyingon.defineProperty(this, "spaceX", function () {

            return this.left + this.right;
        });

        //上下空间和
        flyingon.defineProperty(this, "spaceY", function () {

            return this.top + this.bottom;
        });


    });




    //子样式属性名称集合
    Thickness.names = ["top", "right", "bottom", "left"];


    //注册样式转换
    ["margin", "padding"].forEach(function (name) {


        flyingon.__fn_style_convert(name, function (style, value) {

            return value instanceof Thickness ? value : (this[name] = new Thickness(value));
        });


        for (var i = 0, length = Thickness.names; i < length; i++)
        {
            var key = Thickness.names[i];

            flyingon.__fn_style_convert(name + key[0].toUpperCase() + key.substring(1), function (style, value) {

                var result = style[name] || (style[name] = new Thickness());
                result[key] = value;
                return result;

            }, name);
        };


    }, this);




})(flyingon);