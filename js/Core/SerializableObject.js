
//可序列化类
flyingon.class("SerializableObject", function (Class, flyingon) {



    //客户端唯一Id
    var id = 0;

    //自动名称
    var auto_name = 0;


    Class.create = function () {


        //变量管理器
        this.__storage__ = Object.create(this.__defaults__);

    };




    //唯一Id
    flyingon.newId = function () {

        return "id" + (++id);
    };



    flyingon.defineProperty(this, "id", function () {

        return this.__id__ || (this.__id__ = "id" + (++id));
    });


    flyingon.__define_getter__ = function (name, attributes) {

        var body = "return this.__storage__['" + name + "'];";
        return new Function(body);
    };

    flyingon.__define_binding__ = "(cache = this.__bindings__) && this.__fn_bindings__(name, cache);\n"; //处理绑定源

    flyingon.__define_initialize__ = "if (flyingon.__initializing__)\n"
        + "{\n"
        + "storage[name] = value;\n"
        + flyingon.__define_binding__
        + "return this;\n"
        + "}\n";

    flyingon.__define_change__ = "if ((cache = this.__events__) && (cache = cache['change']) && cache.length > 0)\n"
        + "{\n"
        + "var event = new flyingon.ChangeEvent(this, name, value, oldValue);\n"
        + "if (this.dispatchEvent(event) === false) return this;\n"
        + "value = event.value;\n"
        + "}\n";

    flyingon.__define_setter__ = function (name, attributes) {

        var body = "var storage = this.__storage__, cache, name = '" + name + "';\n"

            + flyingon.__define_initialize__
            + "var oldValue = storage[name];\n"

            + (attributes.valueChangingCode ? attributes.valueChangingCode + "\n" : "") //自定义值变更代码

            + "if (oldValue !== value)\n"
            + "{\n"

            + flyingon.__define_change__

            + "storage[name] = value;\n"

            + (attributes.valueChangedCode ? attributes.valueChangedCode + "\n" : "")  //自定义值变更代码

            + flyingon.__define_binding__

            + "}\n"

            + "return this;\n";

        return new Function("value", body);
    };


    flyingon.__define_attributes__ = function (attributes) {

        if (attributes)
        {
            if (attributes.constructor == String)
            {
                attributes = { attributes: attributes };
            }

            if (attributes.attributes)
            {
                var values = attributes.attributes.split("|");

                for (var i = 0, length = values.length; i < length; i++)
                {
                    attributes[values[i]] = true;
                }

                attributes.attributes = null;
            }

            return attributes;
        }

        return {};
    };


    //定义属性及set_XXX方法
    this.defineProperty = function (name, defaultValue, attributes) {

        if (typeof defaultValue == "function" && (attributes === undefined || typeof attributes == "function"))
        {
            flyingon.defineProperty(this, name, defaultValue, attributes);
        }
        else
        {
            if (defaultValue !== undefined)
            {
                this.__defaults__[name] = defaultValue;
            }

            attributes = flyingon.__define_attributes__(attributes);

            var getter = attributes.getter || flyingon.__define_getter__(name, attributes),
                setter = !attributes.readOnly ? (attributes.setter || flyingon.__define_setter__(name, attributes)) : null;

            flyingon.defineProperty(this, name, getter, setter);

            if (setter && attributes.autoset !== false)
            {
                this["set_" + name] = setter;
            }
        }
    };

    //定义多个属性及set_XXX方法
    this.defineProperties = function (names, defaultValue, attributes) {

        for (var i = 0; i < names.length; i++)
        {
            this.defineProperty(names[i], defaultValue, attributes);
        }
    };



    //定义事件 name为不带on的事件名
    this.defineEvent = function (name) {

        flyingon.defineProperty(this, "on" + name, null,

            function (listener) {

                var events = (this.__events__ || (this.__events__ = {}))[name];

                events ? (events.length > 0 && (events.length = 0)) : (events = this.__events__[name] = []);
                events.push(listener);

                return this;
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
    this.addEventListener = function (type, listener) {

        if (listener)
        {
            var events = (this.__events__ || (this.__events__ = {}));
            (events[type] || (events[type] = [])).push(listener);
        }

        return this;
    };

    //移除事件处理
    this.removeListener = function (type, listener) {

        var events = this.__events__;

        if (events && (events = events[type]))
        {
            if (listener == null)
            {
                events.length = 0;
            }
            else
            {
                var index = events.indexOf(listener);
                if (index >= 0)
                {
                    events.splice(index, 1);
                }
            }
        }

        return this;
    };

    //分发事件
    this.dispatchEvent = function (event) {

        var target = this,
            type = event.type,
            result = true,
            events,
            length;

        if (!type)
        {
            type = event;
            event = new flyingon.Event(type, this);
        }

        while (target)
        {
            //处理默认事件 默认事件方法规定: "__event_" + type + "__"
            if ((events = target["__event_" + type + "__"]))
            {
                if (events.call(target, event) === false)
                {
                    result = false;
                    break;
                }

                if (event.cancelBubble)
                {
                    break;
                }
            }

            //处理冒泡事件
            if ((events = target.__events__) && (events = events[type]) && (length = events.length) > 0)
            {
                for (var i = 0; i < length; i++)
                {
                    if (events[i].call(target, event) === false)
                    {
                        result = false;
                        break;
                    }
                }

                if (event.cancelBubble)
                {
                    break;
                }
            }

            target = target.__parent__;
        }

        if (event.originalEvent)
        {
            if (event.defaultPrevented)
            {
                event.originalEvent.preventDefault();
            }

            if (event.cancelBubble)
            {
                event.originalEvent.stopPropagation();
            }
        }

        return result;
    };


    //是否绑定了指定名称(不带on)的事件
    this.hasEvent = function (type, bubbleEvent) {

        var events = this.__events__;

        if (events && (events = events[type]) && events.length > 0)
        {
            return true;
        }

        return bubbleEvent ? parent.hasEvent(type, true) : false;
    };




    //引用序列化标记(为true时只序列化名称不序列化内容)
    this.__reference__ = false;

    //对象名称
    this.defineProperty("name", null);



    //获取或设置属性默认值
    this.defaultValue = function (name, value) {

        var defaults = this.__defaults__;

        if (value === undefined)
        {
            return defaults[name];
        }

        defaults[name] = value;
        return this;
    };


    //获取或设置存储值
    this.storageValue = function (name, value) {

        if (value === undefined)
        {
            return this.__storage__[name];
        }

        this.__storage__[name] = value;
        return this;
    };





    this.setBinding = function (name, source, expression, setter) {

        if (name && source)
        {
            if (!source.name)
            {
                source.name = "auto_name_" + (++auto_name);
            }

            var binding = new flyingon.DataBinding(source, expression || name, setter);

            binding.__fn_initialize__(this, name);
            binding.pull();
            return binding;
        }
    };

    this.clearBinding = function (name, dispose) {

        if (name)
        {
            var bindings = this.__bindings__;
            if (bindings && (bindings = bindings[name]))
            {
                bindings.clear(dispose);
            }
        }
    };

    //执行绑定
    this.__fn_bindings__ = function (name, storage) {

        var bindings = storage.push;

        if (bindings && bindings.hasOwnProperty(name))
        {
            flyingon.bindingTo(this, name);
        }

        if ((bindings = storage.pull) && (bindings = bindings[name]) && !bindings.__binding__)
        {
            bindings.push();
        }
    };




    //自定义序列化
    this.serialize = function (writer) {

        writer.object("storage", this.__storage__);
        writer.bindings(this);
    };

    //自定义反序列化
    this.deserialize = function (reader, data) {

        var storage = reader.object(this, "__storage__", data["storage"]);

        reader.bindings(this, data);
        if (storage && storage.name)
        {
            (reader.references || (reader.references = {}))[storage.name] = this;
        }
    };




    //销毁
    this.dispose = function () {

        flyingon.clearBindings(this, true);
    };


});



