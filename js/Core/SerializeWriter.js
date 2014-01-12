
flyingon.class("SerializeWriter", function (Class, flyingon) {



    Class.create = function () {

        this["x:data"] = [];
    };



    this["x:root"] = null;

    this.serialize = function (target) {

        this[Array.isArray(target) ? "array" : "object"](this["x:root"], target);
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

        data[data.length - 1] != "{" && data.push(",");
        data.push("\"" + name + "\":");
    };




    this.null = function (name) {

        var data = this["x:data"];

        name && key(data, name);
        data.push("null");
    };

    this.boolean = function (name, value) {

        if (value !== undefined)
        {
            var data = this["x:data"];

            name && key(data, name);
            data.push(!!value);
        }
    };

    this.number = function (name, value) {

        if (value !== undefined)
        {
            var data = this["x:data"];

            name && key(data, name);
            data.push(value || 0);
        }
    };

    this.string = function (name, value) {

        if (value !== undefined)
        {
            var data = this["x:data"];

            name && key(data, name);
            data.push(value != null ? "\"" + value.replace("\"", "\\\"") + "\"" : "null");
        }
    };

    this.object = function (name, value) {

        if (value !== undefined)
        {
            var data = this["x:data"];

            name && key(data, name);

            if (value != null)
            {
                data.push("{");

                (name = value.className) && data.push("\"className\":\"" + name + "\"");

                if ("serialize" in value)
                {
                    value.serialize(this);
                }
                else
                {
                    var names = Object.getOwnPropertyNames(value);

                    for (var i = 0, length = names.length; i < length; i++)
                    {
                        (i > 0 || name) && data.push(",");

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

        if (value !== undefined)
        {
            var data = this["x:data"];

            name && key(data, name);
 
            if (value != null)
            {
                data.push("[");

                for (var i = 0, length = value.length; i < length; i++)
                {
                    i > 0 && data.push(",");
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

        value !== undefined && this.string(name, value ? value.toString() : null);
    };


    this.reference = function (name, value) {

        if (value != null)
        {
            //未设置名称则直接序列化
            if (!value["x:reference"])
            {
                this[Array.isArray(value) ? "array" : "object"](name, value);
            }
            else if (value = value.name)
            {
                this.string(name, value);
            }
            else
            {
                throw new Error("serialize reference fail! no name!");
            }
        }
    };


    this.bindings = function (target) {

        target && (target = target["x:bindings"]) && (target = target.pull) && this.object("bindings", target);
    };


    this.toString = this.toLocaleString = function () {

        return this["x:data"].join("");
    };

});




//t 0:null 1:boolean 2:number 3:string 4:object 5:array 9:function
flyingon.class("XmlSerializeWriter", flyingon.SerializeWriter, function (Class, flyingon) {


    this["x:root"] = "xml";


    this.null = function (name) {

        this["x:data"].push("<" + name + " type=\"null\"/>");
    };

    this.boolean = function (name, value) {

        value !== undefined && this["x:data"].push("<" + name + " type=\"boolean\">" + (value ? "1" : "0") + "</" + name + ">");
    };

    this.number = function (name, value) {

        value !== undefined && this["x:data"].push("<" + name + " type=\"number\">" + (value || 0) + "</" + name + ">");
    };

    this.string = function (name, value) {

        if (value !== undefined)
        {
            if (value != null)
            {
                value.indexOf("&") >= 0 && (value = flyingon.decodeXml(value));
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
                value.indexOf("&") >= 0 && (value = flyingon.decodeXml(value));
            }

            this.string(name, value);
        }
    };


});
