(function ($) {


    $.class("SerializeReader", function (Class, $) {



        var registryList = $["x:registryList"];




        this.deserialize = function (data) {

            if (data)
            {
                if (data.constructor == String)
                {
                    data = this.parse(data);
                }

                return this[data.constructor == Array ? "array" : "object"](null, null, data);
            }

            return null;
        };


        this.parse = $.parseJson;


        this.boolean = function (target, name, value) {

            if (value !== undefined)
            {
                return target[name] = !!value;
            }
        };

        this.number = function (target, name, value) {

            if (value !== undefined)
            {
                return target[name] = parseFloat("" + value);
            }
        };

        this.string = function (target, name, value) {

            if (value !== undefined)
            {
                return target[name] = value == null ? null : "" + value;
            }
        };


        this.object = function (target, name, value) {

            if (value != null)
            {
                var result;

                if (!target || !(result = target[name]))
                {
                    result = value.className && (result = registryList[value.className]) ? new result() : {};

                    if (target)
                    {
                        target[name] = result;
                    }
                }


                if (result.deserialize)
                {
                    result.deserialize(this, value);
                }
                else
                {
                    var names = Object.getOwnPropertyNames(value);

                    for (var i = 0, length = names.length; i < length; i++)
                    {
                        var name = names[i],
                            value = value[name];

                        if (value != null)
                        {
                            switch (typeof value)
                            {
                                case "object":
                                    value = this[value.constructor == Array ? "array" : "object"](value);
                                    break;

                                case "function":
                                    value = value ? new Function("" + value) : null;
                                    break;
                            }
                        }

                        result[name] = value;
                    }
                }

                return result;
            }

            return null;
        };


        this.array = function (target, name, value) {

            if (value != null)
            {
                var result;

                if (target)
                {
                    if (result = target[name])
                    {
                        result = target[name] = [];
                    }
                }
                else
                {
                    result = [];
                }


                for (var i = 0, length = value.length; i < length; i++)
                {
                    var value = value[i];

                    if (value != null)
                    {
                        switch (typeof value)
                        {
                            case "object":
                                value = this[value.constructor == Array ? "array" : "object"](value);
                                break;

                            case "function":
                                value = value ? new Function("" + value) : null;
                                break;
                        }
                    }

                    result.push(value);
                }

                return result;
            }

            return null;
        };

        this.function = function (target, name, value) {

            if (value !== undefined)
            {
                return target[name] = value ? new Function("" + value) : null;
            }
        };

    });





    $.class("XmlSerializeReader", $.SerializeReader, function (Class, $) {


        this.parse = $.parseXml;

    });




})(flyingon);