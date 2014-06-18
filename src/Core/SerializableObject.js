
//可序列化类
flyingon.defineClass("SerializableObject", function (Class, base, flyingon) {



    //客户端唯一Id
    flyingon.__uniqueId = 0;

    //自动名称
    flyingon.__auto_name = 0;




    Class.create = function () {


        //变量管理器
        this.__fields = Object.create(this.__defaults);

    };




    //唯一Id
    flyingon.newId = function () {

        return ++flyingon.__uniqueId;
    };



    flyingon.defineProperty(this, "uniqueId", function () {

        return this.__uniqueId || (this.__uniqueId = ++flyingon.__uniqueId);
    });


    this.__define_getter = function (name, attributes) {

        return new Function("return this.__fields." + name + ";");
    };

    this.__define_initializing = function (name, attributes) {

        return "if (flyingon.__initializing)\n"
            + "{\n"
            + (attributes.changing || "")

            + "fields." + name + " = value;\n\n"

            + "if (cache = this.__bindings)\n"
            + "{\n"
            + "this.__fn_bindings(\"" + name + "\", cache);\n"
            + "}\n\n"

            + (attributes.complete || "")
            + "\nreturn;\n"
            + "}\n\n\n";
    };

    this.__define_change = function (name) {

        return "if ((cache = this.__events) && (cache = cache['change']) && cache.length > 0)\n"
            + "{\n"
                + "var event = new flyingon.PropertyChangeEvent(this, \"" + name + "\", value, oldValue);\n"
                + "if (this.dispatchEvent(event) === false)\n"
                + "{\n"
                + "return false;\n"
                + "}\n\n"
                + "value = event.value;\n"
            + "}\n\n";
    };

    this.__define_setter = function (name, defaultValue, attributes, fields) {

        var body = [];

        switch (typeof defaultValue)
        {
            case "boolean":
                body.push("value = !!value;\n");
                break;

            case "number":
                body.push(("" + defaultValue).indexOf(".") >= 0 ? "value = parseInt(value);\n" : "value = +value || 0;\n");
                break;

            case "string":
                body.push("value = value ? \"\"+ value : \"\";\n");
                break;
        }


        body.push(fields || "var fields = this.__fields, cache;\n\n");

        body.push(this.__define_initializing(name, attributes));

        body.push("var oldValue = fields." + name + ";\n\n");

        if (attributes.changing) //自定义值变更代码
        {
            body.push(attributes.changing);
            body.push("\n\n");
        }

        body.push("if (oldValue !== value)\n");
        body.push("{\n\n");

        body.push(this.__define_change(name));

        body.push("fields." + name + " = value;\n\n");


        if (attributes.changed) //自定义值变更代码
        {
            body.push(attributes.changed);
            body.push("\n\n");
        }

        if (attributes.complete) //自定义值变更结束代码
        {
            body.push(attributes.complete);
            body.push("\n\n");
        }


        body.push("if (cache = this.__bindings)\n");
        body.push("{\n");
        body.push("this.__fn_bindings(\"" + name + "\", cache);\n");
        body.push("}\n\n");


        //此块与控件有关
        if (attributes.relayout) //需要重新布局
        {
            body.push("(this.__parent || this).invalidate(true);\n");
        }
        else if (attributes.rearrange) //是否需要重新排列
        {
            body.push("this.invalidate(true);\n");
        }
        else if (attributes.invalidate)  //需要重新绘制
        {
            body.push("this.invalidate(false);\n");
        }


        body.push("}\n");


        return new Function("value", body.join(""));
    };



    this.__define_attributes = function (attributes) {

        if (attributes)
        {
            var values;

            if (attributes.constructor === String)
            {
                values = attributes.split("|");
                attributes = {};
            }
            else if (attributes.attributes)
            {
                values = attributes.attributes.split("|");
                delete attributes.attributes;
            }

            if (values)
            {
                for (var i = 0, _ = values.length; i < _; i++)
                {
                    attributes[values[i]] = true;
                }
            }

            return attributes;
        }

        return {};
    };


    //定义属性及set_XXX方法
    this.defineProperty = function (name, defaultValue, attributes) {

        if (typeof defaultValue === "function" && (attributes == null || typeof attributes === "function"))
        {
            flyingon.defineProperty(this, name, defaultValue, attributes);
        }
        else
        {
            attributes = this.__define_attributes(attributes);

            if (defaultValue !== undefined)
            {
                this.__defaults[name] = defaultValue;
            }

            var getter = attributes.getter || this.__define_getter(name, attributes),
                setter = !attributes.readOnly ? (attributes.setter || this.__define_setter(name, defaultValue, attributes)) : null;

            flyingon.defineProperty(this, name, getter, setter);

            //扩展至选择器
            if (attributes.query)
            {
                flyingon.query[name] = function (value) {

                    return this.property(name, value);
                };
            }
        }
    };

    //定义多个属性
    this.defineProperties = function (names, defaultValue, attributes) {

        for (var i = 0; i < names.length; i++)
        {
            this.defineProperty(names[i], defaultValue, attributes);
        }
    };



    //定义事件 name为不带on的事件名
    this.defineEvent = function (type) {

        var name = "__on" + type;

        flyingon.defineProperty(this, "on" + type,

            function () {

                return this[name] || null;
            },

            function (value) {

                (this.__events || (this.__events = {}))[type] = [this[name] = value];

                //清除事件缓存
                if (this.__events_cache)
                {
                    delete this.__events_cache[type];
                }
            });
    };

    //定义多个事件 names为不带on的事件名数组
    this.defineEvents = function (names) {

        for (var i = 0; i < names.length; i++)
        {
            this.defineEvent(names[i]);
        }
    };


    //绑定事件处理 注:type不带on
    this.addEventListener = function (type, listener, useCapture) {

        if (listener)
        {
            var events = (this.__events || (this.__events = {}));

            listener.useCapture = useCapture;
            (events[type] || (events[type] = [])).push(listener);

            //清除事件缓存
            if (this.__events_cache)
            {
                delete this.__events_cache[type];
            }
        }
    };

    //移除事件处理
    this.removeEventListener = function (type, listener) {

        var events = this.__events;

        if (events && (events = events[type]))
        {
            if (listener == null)
            {
                events.length = 0;
            }
            else if (events.indexOf(listener) >= 0)
            {
                events.splice(listener, 1);
            }

            //清除事件缓存
            if (this.__events_cache)
            {
                delete this.__events_cache[type];
            }
        }
    };

    //分发事件
    //event     要分发的事件
    //bubble    是否冒泡模式 是则按事件链逐步分发 否则只分发至当前控件
    this.dispatchEvent = function (event, bubble) {

        var key = bubble !== false ? event.type : event.type + "_this",
            events = this.__events_cache && this.__events_cache[key] || cache_events(this, event.type, key, bubble),
            length = events.length;

        //获取相关事件
        if (length > 0)
        {
            //循环处理相关事件
            for (var i = 0; i < length; i++)
            {
                var target = events[i++];

                if (events[i].call(target, event) === false)
                {
                    event.preventDefault();
                }

                if (event.cancelBubble)
                {
                    break;
                }
            }

            return !event.defaultPrevented;
        }

        return true;
    };


    //是否绑定了指定名称(不带on)的事件
    this.hasEvent = function (type, bubbleEvent) {

        var events = this.__events;

        if (events && (events = events[type]) && events.length > 0)
        {
            return true;
        }

        return bubbleEvent ? parent.hasEvent(type, true) : false;
    };


    //缓存事件
    function cache_events(target, type, key, bubble) {

        var result = (target.__events_cache || (target.__events_cache = {}))[key] = [],
            events,
            listener,
            name;

        do
        {
            //插入默认捕获事件
            if ((name = "__event_capture_" + type) in target)
            {
                result.unshift(target, target[name]);
            }

            //添加默认冒泡事件
            if ((name = "__event_bubble_" + type) in target)
            {
                result.push(target, target[name]);
            }

            //循环处理注册的事件
            if ((events = target.__events) && (events = events[type]))
            {
                for (var i = 0, _ = events.length; i < _; i++)
                {
                    if ((listener = events[i]).useCapture) //插入捕获事件
                    {
                        result.unshift(target, listener);
                    }
                    else //添加冒泡事件
                    {
                        result.push(target, listener);
                    }
                }
            }

        } while (bubble && (target = target.__parent))

        return result;
    };



    //定义值变更事件
    this.defineEvent("change");





    //引用序列化标记(为true时只序列化名称不序列化内容)
    this.serialize_reference = false;


    //名称
    this.defineProperty("name", null);



    //获取或设置属性默认值
    this.defaultValue = function (name, value) {

        var defaults = this.__defaults;

        if (value === undefined)
        {
            return defaults[name];
        }

        defaults[name] = value;
        delete defaults["__x_" + name];

        return this;
    };


    //获取或设置存储属性值
    this.propertyValue = function (name, value) {

        if (value === undefined)
        {
            return this.__fields[name];
        }

        this.__fields[name] = value;
        return this;
    };





    this.setBinding = function (name, source, expression, setter) {

        if (name && source)
        {
            var binding = new flyingon.DataBinding(source, expression || name, setter);

            binding.__fn_initialize(this, name);
            binding.pull();
            return binding;
        }
    };

    this.clearBinding = function (name, dispose) {

        if (name)
        {
            var bindings = this.__bindings;
            if (bindings && (bindings = bindings[name]))
            {
                bindings.clear(dispose);
            }
        }
    };

    //执行绑定
    this.__fn_bindings = function (name, fields) {

        var bindings = fields.push;

        if (bindings && bindings.hasOwnProperty(name))
        {
            flyingon.bindingTo(this, name);
        }

        if ((bindings = fields.pull) && (bindings = bindings[name]) && !bindings.__binding)
        {
            bindings.push();
        }
    };





    //获取或设置对象JSON值
    flyingon.defineProperty(this, "JSON",

        function () {

            return new flyingon.SerializeWriter().serialize(this);
        },

        function (value) {

            if (Object.keys(this.__fields).length > 0)
            {
                this.__fields = Object.create(this.__defaults);
            }

            new flyingon.SerializeReader().deserialize(value, this);
        });




    //自定义序列化
    this.serialize = function (writer) {

        writer.properties(this.__fields);
        writer.bindings(this);
    };

    //自定义反序列化
    this.deserialize = function (reader, data, excludes) {

        if (data.bindings)
        {
            excludes.bindings = true;
        }

        reader.properties(this.__fields, data, excludes);
        reader.bindings(this, data);
    };




    //销毁
    this.dispose = function () {

        flyingon.clearBindings(this, true);
    };


});



