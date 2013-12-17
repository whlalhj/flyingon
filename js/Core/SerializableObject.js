﻿//可序列化类
(function ($) {


    $.class("SerializableObject", function (Class, $) {



        //客户端唯一Id
        var id = 0;

        //对象管理器
        $["x:objects"] = {};


        Class.create = function () {


            //客户端唯一id
            $.defineVariable(this, "id", ++id, false, true);
            $["x:objects"][id] = this;

            //变量管理器
            this["x:storage"] = Object.create(this["x:class"]["x:defaults"]);

            //事件管理器
            this["x:events"] = {};
        };




        //唯一Id
        $.uniqueId = function () {

            return ++id;
        };




        this["y:define:getter"] = function (name, attributes) {

            var body = "return this['x:storage']['" + name + "'];";
            return new Function(body);
        };

        this["y:define:setter:initialize"] = "if (flyingon['x:initializing'])\n"
            + "{\n"
            + "storage[name] = value;\n"
            + "return this;\n"
            + "}\n";

        this["y:define:setter:change"] = "if ((cache = this['x:events'][name]) && cache.length > 0)\n"
            + "{\n"
            + "var event = new flyingon.ChangeEvent('change', name, value, oldValue);\n"
            + "if (!this.dispatchEvent(event))\n"
            + "{\n"
            + "return this;\n"
            + "}\n"
            + "value = event.value;\n"
            + "}\n";

        this["y:define:setter:bindingTo"] = "if ((cache = this['x:bindings:source']) && cache.hasOwnProperty(name))\n" //处理绑定源
            + "{\n"
            + "flyingon.bindingTo(this, name);\n"
            + "}\n";

        this["y:define:setter"] = function (name, attributes) {

            var body = "var storage = this['x:storage'], cache, name = '" + name + "';\n"

                + this["y:define:setter:initialize"]
                + "var oldValue = storage[name];\n"

                + (attributes.valueChangingCode ? attributes.valueChangingCode + "\n" : "") //自定义值变更代码

                + "if (oldValue !== value)\n"
                + "{\n"

                + this["y:define:setter:change"]

                + "storage[name] = value;\n"

                + (attributes.valueChangedCode ? attributes.valueChangedCode + "\n" : "")  //自定义值变更代码

                + this["y:define:setter:bindingTo"]

                + "}\n"

                + "return this;\n";

            return new Function("value", body);
        };


        this["y:parse:attributes"] = function (attributes) {

            if (attributes)
            {
                if (attributes.constructor == String)
                {
                    attributes = { attributes: attributes };
                }

                if (attributes.attributes)
                {
                    var values = attributes.attributes.split("|"),
                        i = 0,
                        length = values.length;

                    while (i < length)
                    {
                        attributes[values[i++]] = true;
                    }

                    attributes.attributes = null;
                }

                return attributes;
            }

            return {};
        };


        //定义属性及set_XXX方法
        this.defineProperty = function (name, defaultValue, attributes, readOnly) {

            if (defaultValue !== undefined)
            {
                this["x:class"]["x:defaults"][name] = defaultValue;
            }

            attributes = this["y:parse:attributes"](attributes);

            $.defineProperty(this, name,
                attributes.getter || this["y:define:getter"](name, attributes),
                !readOnly ? (attributes.setter || this["y:define:setter"](name, attributes)) : null);
        };

        //定义多个属性及set_XXX方法
        this.defineProperties = function (names, defaultValue, attributes, readOnly) {

            for (var i = 0; i < names.length; i++)
            {
                this.defineProperty(names[i], defaultValue, attributes, readOnly);
            }
        };



        //定义事件 name为不带on的事件名
        this.defineEvent = function (name) {

            $.defineProperty(this, "on" + name, null, function (listener) {

                var events = this["x:events"][name];

                if (events)
                {
                    if (events.length > 0)
                    {
                        events.length = 0;
                    }
                }
                else
                {
                    events = this["x:events"][name] = [];
                }

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
                var events = this["x:events"];
                (events[type] || (events[type] = [])).push(listener);
            }

            return this;
        };

        //移除事件处理
        this.removeListener = function (type, listener) {

            var events = this["x:events"][type],
                index;

            if (events)
            {
                if (listener == null)
                {
                    events.length = 0;
                }
                else if ((index = events.indexOf(listener)) >= 0)
                {
                    events.splice(index, 1);
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
                event = new $.Event(type, this);
            }

            while (target)
            {
                if (events = target["x:events"][type])
                {
                    if ((length = events.length) > 0)
                    {
                        for (var i = 0; i < length; i++)
                        {
                            if (events[i].call(target, event) === false)
                            {
                                result = false;
                            }
                        }
                    }

                    if (event.cancelBubble)
                    {
                        break;
                    }
                }

                target = target["x:parent"];
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

        //分发值变更事件
        this.dispatchChangeEvent = function (name, value, oldValue) {

            this.dispatchEvent(new $.ChangeEvent('change', this, name, value, oldValue));
        };

        //是否绑定了指定名称(不带on)的事件
        this.hasEvent = function (type, bubbleEvent) {

            var events = this["x:events"][type];

            if (events && events.length > 0)
            {
                return true;
            }

            return bubbleEvent ? parent.hasEvent(type, true) : false;
        };




        //设计时资源 由设计时环境维护 请勿手动修改
        this["x:resources"] = null;



        //对象名称
        this.defineProperty("name", null);

        //值变更事件
        this.defineEvent("change");



        //获取默认值
        this.getDefaultValue = function (name) {

            return this["x:class"]["x:defaults"][name];
        };

        //修改默认值
        this.setDefaultValue = function (name, defaultValue) {

            if (defaultValue !== undefined)
            {
                this["x:class"]["x:defaults"][name] = defaultValue;
            }
            else
            {
                delete this["x:class"]["x:defaults"][name];
            }
        };

        //获取值
        this.getValue = function (name) {

            return this["x:storage"][name];
        };

        //设置值
        this.setValue = function (name, value) {

            this["x:storage"][name] = value;
        };



        //自定义序列化
        this.serialize = function (writer) {

            writer.object("storage", this["x:storage"]);
            writer.object("bindings", this["x:bindings"]);
        };

        //自定义反序列化
        this.deserialize = function (reader, data) {

            reader.object(this, "x:storage", data["storage"]);
            reader.object(this, "x:bindings", data["bindings"]);
        };




        //销毁
        this.dispose = function () {

            var id = this.id;

            delete $["x:bindings"][id];
            delete $["x:objects"][id];

            $.clearBindings(this);
        };


    });



})(flyingon);

