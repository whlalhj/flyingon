(function (flyingon) {


    var regex = /\s*,\s*/g,

        prototype = (flyingon.Thickness = function (value) {


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
                        values = value.constructor == Array ? value : ("" + value).split(regex);
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

        }).prototype;



    //左空间
    prototype.left = 0;

    //上部空间
    prototype.top = 0;

    //右空间
    prototype.right = 0;

    //底部空间
    prototype.bottom = 0;

    //转换为字符串
    prototype.toString = prototype.toLocaleString = function () {

        return this.top + "," + this.left + "," + this.right + "," + this.bottom;
    };


    //左右空间和
    flyingon.defineProperty(prototype, "spaceX", function () {

        return this.left + this.right;
    });

    //上下空间和
    flyingon.defineProperty(prototype, "spaceY", function () {

        return this.top + this.bottom;
    });



})(flyingon);