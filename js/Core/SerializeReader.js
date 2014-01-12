
flyingon.class("SerializeReader", function (Class, flyingon) {



    var registryList = flyingon["x:registryList"];




    this.deserialize = function (data, context) {

        if (data)
        {
            data.constructor == String && (data = data[0] == "<" ? flyingon.parseXml : this.parse(data));

            var result = this[Array.isArray(data) ? "array" : "object"](null, null, data);

            this["y:complete"](this, context || result);
            return result;
        }

        return null;
    };


    //序列化完毕后执行方法(内部方法)
    this["y:complete"] = function (reader, context) {

        //缓存的资源
        var references = reader.references,
            items = reader["x:bindings"],
            binding,
            source;

        if (items)
        {
            for (var i = 0, length = items.length; i < length; i++)
            {
                var item = items[i],
                    bindings = item[1];

                for (var name in bindings)
                {
                    if (binding = bindings[name])
                    {
                        if (binding.constructor == String)
                        {
                            binding = new flyingon.DataBinding(context, binding);
                        }
                        else
                        {
                            if (source = binding.source)
                            {
                                source.constructor == String && (binding.source = (references && references[source]) || context);
                            }
                            else
                            {
                                binding.source = context;
                            }

                            !(binding instanceof flyingon.DataBinding) && (binding = new flyingon.DataBinding(binding));
                        }

                        binding["y:initialize"](item[0], name);
                        binding.pull();
                    }
                }
            }
        }
    };




    this.parse = flyingon.parseJson;


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
                target && (target[name] = result);
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
                        item = value[name];

                    if (item != null)
                    {
                        switch (typeof item)
                        {
                            case "object":
                                item = this[Array.isArray(item) ? "array" : "object"](null, null, item);
                                break;

                            case "function":
                                item = item ? new Function("" + item) : null;
                                break;
                        }
                    }

                    result[name] = item;
                }
            }

            return result;
        }
        else if (value !== undefined && target)
        {
            target[name] = null;
        }

        return null;
    };


    this.array = function (target, name, value) {

        if (value != null)
        {
            var result;

            if (target)
            {
                !(result = target[name]) && (result = target[name] = []);
            }
            else
            {
                result = [];
            }


            for (var i = 0, length = value.length; i < length; i++)
            {
                var item = value[i];

                if (item != null)
                {
                    switch (typeof item)
                    {
                        case "object":
                            item = this[Array.isArray(item) ? "array" : "object"](null, null, item);
                            break;

                        case "function":
                            item = item ? new Function("" + item) : null;
                            break;
                    }
                }

                result.push(item);
            }

            return result;
        }
        else if (value !== undefined && target)
        {
            target[name] = null;
        }

        return null;
    };

    this.function = function (target, name, value) {

        if (value !== undefined)
        {
            return target[name] = value ? new Function("" + value) : null;
        }
    };

    this.reference = function (target, name, value) {

        if (value != null)
        {
            var fn = value.constructor;

            if (fn != String)
            {
                value = this[fn == Array ? "array" : "object"](target, name, value);
            }
            else
            {
                target[name] = value;
            }

            return value;
        }
    };

    this.bindings = function (target, data) {

        target && (data = data["bindings"]) && (this["x:bindings"] || (this["x:bindings"] = [])).push([target, data]);
    };

});





flyingon.class("XmlSerializeReader", flyingon.SerializeReader, function (Class, flyingon) {


    this.parse = flyingon.parseXml;

});

