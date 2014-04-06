(function (flyingon) {


    var regex = /top|middle|bottom|left|center|right/g,

        keys = { left: 1, center: 1, right: 1 },

        prototype = (flyingon.Align = function (value) {

            if (value)
            {
                var values = ("" + value).toLowerCase().match(regex),
                    value;

                for (var i = 0, length = values.length; i < length; i++)
                {
                    if (keys[value = values[i]])
                    {
                        this.horizontal = value;
                    }
                    else
                    {
                        this.vertical = value;
                    }
                }
            }

        }).prototype;



    //水平对齐
    prototype.horizontal = "left";

    //垂直对齐
    prototype.vertical = "top";


    //转换为字符串
    prototype.toString = prototype.toLocaleString = prototype.serializeTo = function () {

        return this.horizontal + "," + this.vertical;
    };



})(flyingon);