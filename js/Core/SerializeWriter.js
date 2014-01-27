
flyingon.class("SerializeWriter", function (Class, flyingon) {



    Class.create = function () {

        this.__data__ = [];
    };



    this.__root__ = null;

    this.serialize = function (target) {

        this[Array.isArray(target) ? "array" : "object"](this.__root__, target);
        return this.toString();
    };



    this.value = function (name, value) {

        if (value == null)
        {
            this.null(name);
            return;
        }

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
                switch (value.constructor)
                {
                    case Boolean:
                        this.boolean(name, value);
                        break;
                        
                    case Number:
                        this.number(name, value);
                        break;

                    case String:
                        this.string(name, value);
                        break;

                    case Array:
                        this.array(name, value);
                        break;

                    default:
                        this.object(name, value);
                        break;
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

        var data = this.__data__;

        if (name)
        {
            key(data, name);
        }

        data.push("null");
    };

    this.boolean = function (name, value) {

        if (value !== undefined)
        {
            var data = this.__data__;

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
            var data = this.__data__;

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
            var data = this.__data__;

            if (name)
            {
                key(data, name);
            }

            data.push(value != null ? "\"" + value.replace(/\"/g, "\\\"") + "\"" : "null");
        }
    };

    this.object = function (name, value) {

        if (value !== undefined)
        {
            var data = this.__data__;

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
                    var keys = Object.keys(value);

                    for (var i = 0, length = keys.length; i < length; i++)
                    {
                        if (i > 0 || name)
                        {
                            data.push(",");
                        }

                        data.push("\"" + (name = keys[i]) + "\":");
                        this.value(null, value[name]);
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
            var data = this.__data__;

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

                    this.value(null, value[i]);
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


    this.reference = function (name, value) {

        if (value != null)
        {
            //未设置名称则直接序列化
            if (!value.__reference__)
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

        if (target && (target = target.__bindings__) && (target = target.pull))
        {
            this.object("bindings", target);
        }
    };


    this.toString = this.toLocaleString = function () {

        return this.__data__.join("");
    };

});




//t 0:null 1:boolean 2:number 3:string 4:object 5:array 9:function
flyingon.class("XmlSerializeWriter", flyingon.SerializeWriter, function (Class, flyingon) {


    this.__root__ = "xml";


    this.null = function (name) {

        this.__data__.push("<" + name + " type=\"null\"/>");
    };

    this.boolean = function (name, value) {

        if (value !== undefined)
        {
            this.__data__.push("<" + name + " type=\"boolean\">" + (value ? "1" : "0") + "</" + name + ">");
        }
    };

    this.number = function (name, value) {

        if (value !== undefined)
        {
            this.__data__.push("<" + name + " type=\"number\">" + (value || 0) + "</" + name + ">");
        }
    };

    this.string = function (name, value) {

        if (value !== undefined)
        {
            if (value != null)
            {
                value.indexOf("&") >= 0 && (value = flyingon.decodeXml(value));
                this.__data__.push("<" + name + " type=\"string\">" + value + "</" + name + ">");
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


        var data = this.__data__;

        if (data != null)
        {
            data.push("<" + name + " type=\"" + (value.className || "object") + "\">");

            if ("serialize" in value)
            {
                value.serialize(this);
            }
            else
            {
                var keys = Object.keys(value),
                    key;

                for (var i = 0, length = keys.length; i < length; i++)
                {
                    this.value(key = keys[i], value[key]);
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


        var data = this.__data__;

        if (value != null)
        {
            data.push("<" + name + " type=\"array\"");

            for (var i = 0, length = value.length; i < length; i++)
            {
                this.value("item", value[i]);
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
                    value = flyingon.decodeXml(value);
                }
            }

            this.string(name, value);
        }
    };


});
