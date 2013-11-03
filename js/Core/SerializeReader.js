
(function ($) {


    $.XmlSerializeReader = function () {

    };


    var p = $.XmlSerializeReader.prototype;




})(flyingon);




(function ($) {


    $.JsonSerializeReader = function () {

    };


    var p = $.JsonSerializeReader.prototype,
        registryList = $["x:registryList"];



    p.deserialize = function (data) {

        if (data)
        {
            var value = $.parseJson(data);
            return this[value.constructor == Array ? "readArray" : "readObject"](value);
        }

        return null;
    };


    p.readObject = function (data) {

        var result,
            names = Object.getOwnPropertyNames(data),
            length = names.length;


        if (data.className && (result = registryList[data.className]))
        {
            result = new result();
        }
        else
        {
            result = {};
        }

        for (var i = 0; i < length; i++)
        {
            var name = names[i],
                value = data[name];

            if (value == null)
            {
                result[name] = null;
            }
            else if (typeof value != "object") //普通数据
            {
                result[name] = value;
            }
            else if (name.length > 0 && name[0] != "d" && name[1] != ":") //数组或对象
            {
                result[name] = this[value.constructor == Array ? "readArray" : "readObject"](value);
            }
        }


        if (result.deserialize)
        {
            result.deserialize(data);
        }

        return result;
    };


    p.readArray = function (data) {

        var result = [],
            length = data.length;


        for (var i = 0; i < length; i++)
        {
            var value = data[i];

            if (value == null)
            {
                result[i] = null;
            }
            else if (typeof value != "object") //普通数据
            {
                result[i] = value;
            }
            else
            {
                result[i] = this[value.constructor == Array ? "readArray" : "readObject"](value);
            }
        }

        return result;
    };


})(flyingon);