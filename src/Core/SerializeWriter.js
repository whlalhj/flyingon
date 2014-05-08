
flyingon.defineClass("SerializeWriter", function (Class, base, flyingon) {



    this.__root__ = null;

    this.__push__ = Array.prototype.push;

    this.length = 0;



    this.serialize = function (target) {

        this[target.constructor === Array ? "array" : "object"](this.__root__, target);
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






    var key = function (name) {

        if (this[this.length - 1] !== "{")
        {
            this.__push__(",");
        }

        this.__push__("\"" + name + "\":");
    };




    this.null = function (name) {


        if (name)
        {
            key(name);
        }

        this.__push__("null");
    };

    this.boolean = function (name, value) {

        if (value !== undefined)
        {
            if (name)
            {
                key(name);
            }

            this.__push__(!!value);
        }
    };

    this.number = function (name, value) {

        if (value !== undefined)
        {
            if (name)
            {
                key(name);
            }

            this.__push__(value || 0);
        }
    };

    this.string = function (name, value) {

        if (value !== undefined)
        {
            if (name)
            {
                key(name);
            }

            this.__push__(value != null ? "\"" + value.replace(/\"/g, "\\\"") + "\"" : "null");
        }
    };

    this.object = function (name, value) {

        if (value !== undefined)
        {
            if (name)
            {
                key(name);
            }

            if (value != null)
            {
                if (value.serializeTo) //支持直接序列化为字符串
                {
                    this.__push__("\"" + value.serializeTo() + "\"");
                }
                else
                {
                    this.__push__("{");

                    if (name = value.__fullTypeName__)
                    {
                        this.__push__("\"type\":\"" + name + "\"");
                    }

                    if ("serialize" in value)
                    {
                        value.serialize(this);
                    }
                    else
                    {
                        this.properties(value);
                    }

                    this.__push__("}");
                }
            }
            else
            {
                this.__push__("null");
            }
        }
    };

    this.properties = function (value, keys) {

        var key = this[this.length - 1] !== "{";

        keys = keys || Object.keys(value);

        for (var i = 0, length = keys.length; i < length; i++)
        {
            if (i > 0 || key)
            {
                this.__push__(",");
            }

            this.__push__("\"" + (key = keys[i]) + "\":");
            this.value(null, value[key]);
        }
    };

    this.array = function (name, value) {

        if (value !== undefined)
        {
            if (name)
            {
                key(name);
            }

            if (value != null)
            {
                this.__push__("[");

                for (var i = 0, length = value.length; i < length; i++)
                {
                    if (i > 0)
                    {
                        this.__push__(",");
                    }

                    this.value(null, value[i]);
                }

                this.__push__("]");
            }
            else
            {
                this.__push__("null");
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
            if (!value.serialize_reference) //直接序列化
            {
                this[value.constructor === Array ? "array" : "object"](name, value);
            }
            else //序列化引用
            {
                if (!(value = value.name))
                {
                    value = value.name = "__name_" + (++flyingon.__auto_name__);
                }

                this.string(name, value);
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

        return this.join("");
    };

});




flyingon.defineClass("XmlSerializeWriter", flyingon.SerializeWriter, function (Class, base, flyingon) {


    this.__root__ = "xml";


    this.null = function (name) {

        this.__push__("<" + name + " type=\"null\"/>");
    };

    this.boolean = function (name, value) {

        if (value !== undefined)
        {
            this.__push__("<" + name + " type=\"boolean\">" + (value ? "1" : "0") + "</" + name + ">");
        }
    };

    this.number = function (name, value) {

        if (value !== undefined)
        {
            this.__push__("<" + name + " type=\"number\">" + (value || 0) + "</" + name + ">");
        }
    };

    this.string = function (name, value) {

        if (value !== undefined)
        {
            if (value != null)
            {
                value.indexOf("&") >= 0 && (value = flyingon.decodeXml(value));
                this.__push__("<" + name + " type=\"string\">" + value + "</" + name + ">");
            }
            else
            {
                this.__push__("<" + name + " type=\"null\"/>");
            }
        }
    };

    this.object = function (name, value) {

        if (value === undefined)
        {
            return;
        }

        if (value != null)
        {
            this.__push__("<" + name + " type=\"" + (value.__fullTypeName__ || "object") + "\">");

            if ("serialize" in value)
            {
                value.serialize(this);
            }
            else
            {
                this.properties(value);
            }

            this.__push__("</" + name + ">");
        }
        else
        {
            this.__push__("<" + name + " type=\"null\"/>");
        }
    };

    this.properties = function (value, keys) {

        var key;

        keys = keys || Object.keys(value);

        for (var i = 0, length = keys.length; i < length; i++)
        {
            this.value(key = keys[i], value[key]);
        }
    };

    this.array = function (name, value) {

        if (value === undefined)
        {
            return;
        }


        if (value != null)
        {
            this.__push__("<" + name + " type=\"array\"");

            for (var i = 0, length = value.length; i < length; i++)
            {
                this.value("item", value[i]);
            }

            this.__push__("</" + name + ">");
        }
        else
        {
            this.__push__("<" + name + " type=\"null\"/>");
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
