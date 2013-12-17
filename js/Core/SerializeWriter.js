(function ($) {


    $.class("SerializeWriter", function (Class, $) {



        Class.create = function () {

            this["x:data"] = [];
        };



        this.serialize = function (target) {

            this[target.constructor == Array ? "array" : "object"](null, target);
            return this.toString();
        };



        this["y:value"] = function (name, value) {

            switch (typeof value)
            {
                case "boolean":
                    this.boolean(name, value);
                    break;

                case "number":
                    this.number(name, value);
                    break;

                case "string":
                    this.string(name, value);
                    break;

                case "object":
                    if (value == null)
                    {
                        this.null(name);
                    }
                    else
                    {
                        var cache = value.constructor;

                        if (cache == String)
                        {
                            this.string(name, value);
                        }
                        else if (cache == Array) //数组
                        {
                            this.array(name, value);
                        }
                        else //对象
                        {
                            this.object(name, value);
                        }
                    }
                    break;

                case "function":
                    this.function(name, value);
                    break;
            }
        };






        var key = function (data, name) {

            if (data[data.length - 1] != "{")
            {
                data.push(",");
            }

            data.push("\"" + name + "\":");
        };




        this.null = function (name) {

            var data = this["x:data"];

            if (name)
            {
                key(data, name);
            }

            data.push("null");
        };

        this.boolean = function (name, value) {

            if (value !== undefined)
            {
                var data = this["x:data"];

                if (name)
                {
                    key(data, name);
                }

                data.push(!!value);
            }
        };

        this.number = function (name, value) {

            if (value !== undefined)
            {
                var data = this["x:data"];

                if (name)
                {
                    key(data, name);
                }

                data.push(value || 0);
            }
        };

        this.string = function (name, value) {

            if (value !== undefined)
            {
                var data = this["x:data"];

                if (name)
                {
                    key(data, name);
                }

                data.push(value != null ? "\"" + value.replace("\"", "\\\"") + "\"" : "null");
            }
        };

        this.object = function (name, value) {

            if (value != null)
            {
                var data = this["x:data"];

                if (name)
                {
                    key(data, name);
                }

                if (value != null)
                {
                    data.push("{");

                    if (name = value.className)
                    {
                        data.push("\"className\":\"" + name + "\"");
                    }


                    if ("serialize" in value)
                    {
                        value.serialize(this);
                    }
                    else
                    {
                        var names = Object.getOwnPropertyNames(value);

                        for (var i = 0, length = names.length; i < length; i++)
                        {
                            if (i > 0 || name)
                            {
                                data.push(",");
                            }

                            data.push("\"" + (name = names[i]) + "\":");
                            this["y:value"](null, value[name]);
                        }
                    }


                    data.push("}");
                }
                else
                {
                    data.push("null");
                }
            }
        };

        this.array = function (name, value) {

            if (value != null)
            {
                var data = this["x:data"];

                if (name)
                {
                    key(data, name);
                }

                if (value != null)
                {
                    data.push("[");

                    for (var i = 0, length = value.length; i < length; i++)
                    {
                        if (i > 0)
                        {
                            data.push(",");
                        }

                        this["y:value"](null, value[i]);
                    }

                    data.push("]");
                }
                else
                {
                    data.push("null");
                }
            }
        };

        this.function = function (name, value) {

            if (value !== undefined)
            {
                this.string(name, value ? value.toString() : null);
            }
        };


        this.toString = this.toLocaleString = function () {

            return this["x:data"].join("");
        };

    });








    //t 0:null 1:boolean 2:number 3:string 4:object 5:array 9:function
    $.class("XmlSerializeWriter", $.SerializeWriter, function (Class, $) {


        this.serialize = function (target) {

            this[target.constructor == Array ? "array" : "object"]("data", target);
            return this.toString();
        };


        this.null = function (name) {

            this["x:data"].push("<" + name + " type=\"null\"/>");
        };

        this.boolean = function (name, value) {

            if (value !== undefined)
            {
                this["x:data"].push("<" + name + " type=\"boolean\">" + (value ? "1" : "0") + "</" + name + ">");
            }
        };

        this.number = function (name, value) {

            if (value !== undefined)
            {
                this["x:data"].push("<" + name + " type=\"number\">" + (value || 0) + "</" + name + ">");
            }
        };

        this.string = function (name, value) {

            if (value !== undefined)
            {
                if (value != null)
                {
                    if (value.indexOf("&") >= 0)
                    {
                        value = $.decodeXml(value);
                    }

                    this["x:data"].push("<" + name + " type=\"string\">" + value + "</" + name + ">");
                }
                else
                {
                    data.push("<" + name + " type=\"null\"/>");
                }
            }
        };

        this.object = function (name, value) {

            if (value === undefined)
            {
                return;
            }


            var data = this["x:data"];

            if (data != null)
            {
                data.push("<" + name + " type=\"" + (value.className || "object") + "\">");

                if ("serialize" in value)
                {
                    value.serialize(this);
                }
                else
                {
                    var names = Object.getOwnPropertyNames(value);

                    for (var i = 0, length = names.length; i < length; i++)
                    {
                        var key = names[i];
                        this["y:value"](key, value[key]);
                    }
                }

                data.push("</" + name + ">");
            }
            else
            {
                data.push("<" + name + " type=\"null\"/>");
            }
        };

        this.array = function (name, value) {

            if (value === undefined)
            {
                return;
            }


            var data = this["x:data"];

            if (value != null)
            {
                data.push("<" + name + " type=\"array\"");

                for (var i = 0, length = value.length; i < length; i++)
                {
                    this["y:value"]("item", value[i]);
                }

                data.push("</" + name + ">");
            }
            else
            {
                data.push("<" + name + " type=\"null\"/>");
            }
        };

        this.function = function (name, value) {

            if (value !== undefined)
            {
                if (value)
                {
                    value = value.toString();

                    if (value.indexOf("&") >= 0)
                    {
                        value = $.decodeXml(value);
                    }
                }

                this.string(name, value);
            }
        };


    });


})(flyingon);