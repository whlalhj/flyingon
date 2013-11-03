
(function ($) {


    $.XmlSerializeWriter = function () {

        this["x:data"] = [];
        this["x:objects"] = [];
    };


    var p = $.XmlSerializeWriter.prototype;


    p.beginObject = function (value) {

        var name = value.className || "object";

        this["x:objects"].push(name);
        this["x:data"].push("<" + name + ">");
    };

    p.endObject = function () {

        this["x:data"].push("</" + this["x:objects"].pop() + ">");
    };

    p.beginArray = function (values) {

        this["x:data"].push("<items>");
    };

    p.endArray = function () {

        this["x:data"].push("</items>");
    };

    p.write = function (name, value) {

        this["x:data"].push("<" + name + ">" + value + "</" + name + ">");
    };

    p.toString = function () {

        return this.data.join();
    };


})(flyingon);





(function ($) {


    $.JsonSerializeWriter = function () {

        this["x:data"] = [];
    };


    var p = $.JsonSerializeWriter.prototype;



    p.serialize = function (target) {

        this.writeValue(target);
        return writer.toString();
    };

    p.write = function (name, target) {

        var data = this["x:data"];

        if (data[data.length - 1] != "{")
        {
            data.push(",");
        }

        data.push("\"" + name + "\":");
        this.writeValue(target);
    };


    p.writeValue = function (value) {


        var data = this["x:data"],
            length,
            names,
            name;


        if (value == null)
        {
            data.push("null");
        }
        else if (typeof value != "object") //普通数据类型
        {
            data.push(value.constructor == String ? "\"" + value + "\"" : value);
        }
        else if (!value.hasOwnProperty("length") || !(value instanceof Array)) //对象
        {
            data.push("{");

            if (name = value.className)
            {
                data.push("\"className\":\"" + name + "\"");
            }

            var target = value["x:storage"] || value;

            names = Object.getOwnPropertyNames(target);
            length = names.length;

            for (var i = 0; i < length; i++)
            {
                if (i > 0 || name)
                {
                    data.push(",");
                }

                data.push("\"" + (name = names[i]) + "\":");
                this.writeValue(target[name]);
            }

            if (value.serialize)
            {
                value.serialize(this);
            }

            data.push("}");
        }
        else //数组
        {
            data.push("[");

            length = value.length;

            for (var i = 0; i < length; i++)
            {
                if (i > 0)
                {
                    data.push(",");
                }

                this.writeValue(value[i]);
            }

            data.push("]");
        }
    };


    p.toString = p.toLocaleString = function () {

        return this["x:data"].join("");
    };


})(flyingon);