"use strict";
///以上代码启用严格模式

//注意页面渲染模式设置, 否则IE启用了兼容模式时可能无法执行脚本
//<!--以IE的当前版本渲染,如果安装了ChromeFrame则优先使用-->
//<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />

/*

*/




//根命名空间
var flyingon = this.flyingon = this.flyingon || {};




//全局变量
(function ($) {


    //版本
    $.version = "0.0.0.1";

    //语言
    $.language = "zh-CHS";

    //全局变量
    $.global = {};

    //系统设置 记录当前用户样式语言等信息
    $.setting = $.setting || {};


})(flyingon);





//扩展函数
(function ($) {


    //增加字符串格式化支持
    String.prototype.format = function () {

        return arguments.length == 0 ? this : this.replace(/\{\d+\}/g, function (value) {

            return arguments[value.substring(1, value.length - 1)] || "";
        });
    };



    var p = Array.prototype;


    //移除指定项
    p.remove = function (item) {

        var index = this.indexOf(item);

        if (index >= 0)
        {
            this.splice(index, 1);
        }
    };


    //移除指定索引
    p.removeAt = function (index) {

        this.splice(index, 1);
    };


    //二分法搜索数据段
    p.binaryBetween = function (value, start, end) {

        if (start == null || start < 0)
        {
            start = 0;
        }

        if (end == null || end >= this.length)
        {
            end = this.length - 1;
        }


        if (this[start] >= value)
        {
            return start;
        }

        if (this[end] <= value)
        {
            return end;
        }


        var center, result;

        while (start < end)
        {
            center = Math.floor((start + end) / 2);
            result = this[center];


            if (result == value)
            {
                return center;
            }

            if (result > value)
            {
                end = center;
            }
            else
            {
                if (center >= end)
                {
                    return end;
                }

                if (this[center + 1] > value)
                {
                    return center;
                }

                start = center + 1;
            }
        }


        return start;
    };


    //二分法查找子项位置
    p.binaryIndexOf = function (value, start, end) {

        if (start == null || start < 0)
        {
            start = 0;
        }

        if (end == null || end >= this.length)
        {
            end = this.length - 1;
        }

        if (this[start] > value || this[end] < value)
        {
            return -1;
        }


        var center, result;

        while (start <= end)
        {
            center = Math.floor((start + end) / 2);
            result = this[center];

            if (result < value)
            {
                start = center + 1;
            }
            else if (result > value)
            {
                end = center - 1;
            }

            return center;
        }

        return -1;
    };


    //二分法搜索
    p.binarySearch = function (callbackfn, start, end) {

        if (start == null || start < 0)
        {
            start = 0;
        }

        if (end == null || end >= this.length)
        {
            end = this.length - 1;
        }


        var center, result;

        while (start <= end)
        {
            center = Math.floor((start + end) / 2);
            result = callbackfn.call(this, start, center, end);

            if (result < 0)
            {
                start = center + 1;
            }
            else if (result > 0)
            {
                end = center - 1;
            }

            return center;
        }

        return -1;
    };



    Image.prototype.toDataUrl = function () {

        var canvas = document.createElement("canvas");

        canvas.width = this.width;
        canvas.height = this.height;
        canvas.getContext("2d").drawImage(this, 0, 0);

        return canvas.toDataURL("image/png");
    };



})(flyingon);





//特性支持判断
(function ($) {


    var support = $.support = {};



    //是否支持canvas
    support.canvas = document && (function () {

        var dom = document.createElement("canvas");

        if (!dom.getContext)
        {
            alert("对不起,需要支持Html5特性的浏览器才可以运行本系统!");
            return false;
        }

        return true;

    })();


    //是否支持get或set封装属性
    support.defineProperty = (function () {

        var obj = {};
        Object.defineProperty(obj, "fn", { get: function () { return true; } });
        return obj.fn;

    })();


    //是否支持flash
    support.flash = window && (function () {

        var navigator = window.navigator;

        if (navigator.plugins && navigator.mimeTypes.length)
        {
            var flash = navigator.plugins["Shockwave Flash"];

            if (flash && flash.description)
            {
                return flash.description.replace(/([a-zA-Z]|\s)+/, "").replace(/(\s)+r/, ".") + "#0"
            }
        }
        else if (window.ActiveXObject && !window.opera)
        {
            for (var i = 10; i >= 2; i--)
            {
                try
                {
                    var activeX = new ActiveXObject("ShockwaveFlash.ShockwaveFlash." + i);
                    if (activeX)
                    {
                        var version = activeX.GetVariable("\x24version");
                        return version.replace(/WIN/g, "").replace(/,/g, ".")
                    }
                }
                catch (e)
                {
                }
            }
        }

    })();


})(flyingon);




//通用函数
(function ($) {



    $.defineVariable = function (target, name, value, configurable, enumerable) {

        //target[name] = value;
        Object.defineProperty(target, name, {

            value: value,
            writable: false,
            configurable: configurable === undefined ? false : configurable,
            enumerable: enumerable === undefined ? true : enumerable
        });
    };



    $.defineProperty = $.support.defineProperty ? function (target, name, getter, setter) {

        var attributes = {

            configurable: true,
            enumerable: true
        };

        if (getter)
        {
            attributes.get = getter;
        }

        if (setter)
        {
            attributes.set = setter;
        }

        Object.defineProperty(target, name, attributes);

    } : function (target, name, getter, setter) {

        if (getter)
        {
            target.__defineGetter__(name, getter);
        }

        if (setter)
        {
            target.__defineSetter__(name, setter);
        }
    };






    //增加模板函数支持 以当前函数为模板动态创建新函数
    $["fn:template:to"] = function (fn, values) {

        var body = fn.toString().replace(/"\{\w+\}"/g, function (value) {

            value = values[value.substring(2, value.length - 2)] || "";

            if (typeof value == "function")
            {
                value = value.toString();

                var index = value.indexOf("{");
                if (index++ > 0)
                {
                    var lastIndexOf = value.lastIndexOf("}");
                    if (lastIndexOf > 0)
                    {
                        value = value.substring(index, lastIndexOf);
                    }
                }
            }

            return value;
        });

        return new Function("return (" + body + ")")()
    };


    //浅复制源对象属性至目标属性(对象直接复制引用)
    //ignoreExists: 是否忽略已存在的属性
    $["fn:simple:copy"] = function (source, target, ignoreExists) {


        var names = Object.getOwnPropertyNames(source),
            i = 0,
            length = names.length;


        while (i < length)
        {
            var name = names[i++],
                value = source[name];

            if (value != null && typeof value == "object")
            {
                var cache = target[name];

                if (cache != null && typeof cache == "object")
                {
                    $["fn:simple:copy"](value, cache, ignoreExists);
                    continue;
                }
            }

            if (!ignoreExists || !target.hasOwnProperty(name))
            {
                target[name] = value;
            }
        }

        return target;
    };


    //深度复制源对象属性至目标属性(创建新对象)
    //ignoreExists: 是否忽略已存在的属性
    $["fn:deep:copy"] = function (source, target, ignoreExists) {


        var names = Object.getOwnPropertyNames(source),
            i = 0,
            length = names.length;


        while (i < length)
        {
            var name = names[i++],
                value = source[name];

            if (value != null && typeof value == "object")
            {
                var cache = target[name];

                if ((cache === undefined && (cache = target[name] = {})) ||
                    (cache !== null && typeof cache == "object"))
                {
                    $["fn:deep:copy"](value, cache, ignoreExists);
                }
            }
            else if (!ignoreExists || !target.hasOwnProperty(name))
            {
                target[name] = value instanceof Array ? value.slice(0) : value;
            }
        }

        return target;
    };



    $.parseJson = (window.JSON && window.JSON.parse) || function (data) {

        return (new Function("return " + data))();
    };



    //正向绑定(绑定数据源至目标控件)
    $.bindingTo = function (source, sourceName, id) {

        var bindings = source["x:bindings:source"],
            source_binding;

        if (bindings && (source_binding = bindings[sourceName]))
        {
            var names = id ? [id] : Object.getOwnPropertyNames(source_binding),
                i = 0,
                length = names.length;

            if (length == 0)
            {
                delete bindings[sourceName];
                return;
            }

            var objects = $["x:objects"],
                control;

            while (i < length)
            {
                id = names[i++];

                if (control = objects[id])
                {
                    var name = source_binding[id],
                        control_binding = control["x:bindings"][name],
                        expression = control_binding.expression;

                    control_binding["x:binding"] = true;
                    control[name] = typeof expression == "function" ? expression.call(source) : source[sourceName];
                    control_binding["x:binding"] = false;
                }
                else
                {
                    delete source_binding[id];
                }
            }
        }
    };


})(flyingon);




//名字空间
(function (global, $) {


    //缓存命名空间
    var cache = { "flyingon": $ };


    //名字空间类
    function Namespace(name) {

        this.namespaceName = name;
        cache[name] = this;
    };



    //创建或切换名字空间方法
    $.namespace = function (name, fn) {

        var result = cache[name];

        if (!result && name)
        {
            var values = name.split("."),
                i = 0,
                length = value.length;

            result = global;

            while (i < length)
            {
                var value = values[i++];

                if (value)
                {
                    name = i == 0 ? value : (name + "." + value);

                    if (!result[value])
                    {
                        result[value] = new Namespace(name);
                    };

                    result = result[value];
                }
            }
        }

        $.namespace.current = result || $; //切换当前命名空间

        if (fn)
        {
            fn($, result);
        }

        return result;
    };


    //切换当前命名空间为默认命名空间
    $.namespace.current = $;


})(this, flyingon);




//基类及继承实现
(function ($) {



    $.RootObject = function () {

    };


    var p = $.RootObject.prototype;



    //类名
    p.className = $.RootObject.className = "RootObject";


    p.toString = p.toLocaleString = function () {

        return "[object " + this.className + "]";
    };


    ////定义默认值
    //$.RootObject["x:defaults"] = {};

    //定义构造链
    $.RootObject["x:constructorChain"] = [];





    $["x:registryList"] = { "flyingon.RootObject": $.RootObject };


    $.registryClass = function (Class, classFullName) {

        var name = classFullName || Class.classFullName;
        $["x:registryList"][name] = Class;
    };

    $.unregistryClass = function (classFullName) {

        delete $["x:registryList"][classFullName];
    };

    $.getRegistryClass = function (classFullName) {

        return $["x:registryList"][classFullName];
    };



    var errorMsg = "define class error!";



    //定义类方法
    $.class = function (className, superClass, extension) {


        //处理参数
        if (!className)
        {
            throw new Error(errorMsg);
        }

        if (extension == null)
        {
            extension = superClass;
            superClass = $.RootObject;
        }
        else if (!superClass || !superClass["x:constructorChain"]) //限制继承:没有构造链不能作为基类
        {
            throw new Error(errorMsg);
        }

        if (!extension)
        {
            extension = function () { };
        }




        var namespace = $.namespace.current, //当前名字空间
            classFullName = (namespace.namespaceName ? namespace.namespaceName + "." : "") + className;  //类全名




        //定义类模板 create为构造函数
        function Class() {

            var values = Class["x:constructorChain"];

            for (var i = 0; i < values.length; i++)
            {
                values[i].apply(this, arguments);
            }
        };




        Class["superClass"] = superClass;                      //父类
        Class["super"] = superClass.prototype;                 //父类原型
        Class["className"] = className;                        //类名
        Class["classFullName"] = classFullName;                //类全名


        //初始化默认值管理器
        Class["x:defaults"] = Object.create(superClass["x:defaults"] || Object.prototype);



        $.registryClass(Class); //注册类

        namespace[className] = Class; //输出类




        //创建类原型
        var p = Class.prototype = Object.create(superClass.prototype);



        //定义类属性
        $.defineVariable(p, "constructor", Class, false, true);                  //构造函数
        $.defineVariable(p, "className", className, false, true);                //类名
        $.defineVariable(p, "classFullName", classFullName, false, true);        //类全名
        $.defineVariable(p, "superClass", superClass, false, true);              //父类

        p["x:class"] = Class;
        p["x:global"] = $.global; //全局变量



        //扩展
        if (typeof extension === "function")
        {
            extension.call(p, $);
        }
        else if (extension) //兼容json写法扩展 不建议使用 性能较差且无法使用高级功能
        {
            for (var name in extension)
            {
                p[name] = extension[name];
            }
        }




        //构造链
        Class["x:constructorChain"] = superClass["x:constructorChain"].slice(0);

        if (p.hasOwnProperty("create"))
        {
            Class["x:constructorChain"].push(p.create);
        }


        return Class;
    };



})(flyingon);





﻿//可序列化类
(function ($) {


    $.class("SerializableObject", function ($) {



        //客户端唯一Id
        var id = 0;

        //对象管理器
        $["x:objects"] = {};


        this.create = function () {


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




        this["fn:define:getter"] = function (name, attributes) {

            var body = "return this['x:storage']['" + name + "'];";
            return new Function(body);
        };

        this["fn:define:setter:initialize"] = "if (this['x:global'].initializing)\n"
            + "{\n"
            + "storage[name] = value;\n"
            + "return this;\n"
            + "}\n";

        this["fn:define:setter:change"] = "if ((cache = this['x:events'][name]) && cache.length > 0)\n"
            + "{\n"
            + "var event = { type: 'change', name: name, value: value, oldValue: oldValue };\n"
            + "if (!this.dispatchEvent(event))\n"
            + "{\n"
            + "return this;\n"
            + "}\n"
            + "value = event.value;\n"
            + "}\n";

        this["fn:define:setter:bindingTo"] = "if ((cache = this['x:bindings:source']) && cache.hasOwnProperty(name))\n" //处理绑定源
            + "{\n"
            + "flyingon.bindingTo(this, name);\n"
            + "}\n";

        this["fn:define:setter"] = function (name, attributes) {

            var body = "var storage = this['x:storage'], cache, name = '" + name + "';\n"

                + this["fn:define:setter:initialize"]
                + "var oldValue = storage[name];\n"

                + (attributes.valueChangingCode ? attributes.valueChangingCode + "\n" : "") //自定义值变更代码

                + "if (oldValue !== value)\n"
                + "{\n"

                + this["fn:define:setter:change"]

                + "storage[name] = value;\n"

                + (attributes.valueChangedCode ? attributes.valueChangedCode + "\n" : "")  //自定义值变更代码

                + this["fn:define:setter:bindingTo"]

                + "}\n"

                + "return this;\n";

            return new Function("value", body);
        };


        this["fn:parse:attributes"] = function (attributes) {

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
        this.defineProperty = function (name, defaultValue, attributes) {

            if (defaultValue !== undefined)
            {
                this["x:class"]["x:defaults"][name] = defaultValue;
            }

            attributes = this["fn:parse:attributes"](attributes);

            $.defineProperty(this, name,
                attributes.getter || this["fn:define:getter"](name, attributes),
                !attributes.readOnly ? (attributes.setter || this["fn:define:setter"](name, attributes)) : null);
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

        //获取存储值
        this.getStoreValue = function (name) {

            return this["x:storage"][name];
        };

        //设置存储值
        this.setStoreValue = function (name, value) {

            this["x:storage"][name] = value;
        };




        //销毁
        this.dispose = function () {

            delete $["x:objects"][this.id];
        };


    });



})(flyingon);





﻿
(function ($) {


    $.XmlSerializeReader = function () {

    };


    var p = $.XmlSerializeReader.prototype;




})(flyingon);




(function ($) {


    $.JsonSerializeReader = function () {

    };


    var p = $.JsonSerializeReader.prototype,
        registryList = $["x:registryList"];



    p.deserialize = function (data) {

        if (data)
        {
            var value = $.parseJson(data);
            return this[value.constructor == Array ? "readArray" : "readObject"](value);
        }

        return null;
    };


    p.readObject = function (data) {

        var result,
            names = Object.getOwnPropertyNames(data),
            length = names.length;


        if (data.className && (result = registryList[data.className]))
        {
            result = new result();
        }
        else
        {
            result = {};
        }

        for (var i = 0; i < length; i++)
        {
            var name = names[i],
                value = data[name];

            if (value == null)
            {
                result[name] = null;
            }
            else if (typeof value != "object") //普通数据
            {
                result[name] = value;
            }
            else if (name.length > 0 && name[0] != "d" && name[1] != ":") //数组或对象
            {
                result[name] = this[value.constructor == Array ? "readArray" : "readObject"](value);
            }
        }


        if (result.deserialize)
        {
            result.deserialize(data);
        }

        return result;
    };


    p.readArray = function (data) {

        var result = [],
            length = data.length;


        for (var i = 0; i < length; i++)
        {
            var value = data[i];

            if (value == null)
            {
                result[i] = null;
            }
            else if (typeof value != "object") //普通数据
            {
                result[i] = value;
            }
            else
            {
                result[i] = this[value.constructor == Array ? "readArray" : "readObject"](value);
            }
        }

        return result;
    };


})(flyingon);



﻿
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



﻿//表达式
(function ($) {


    $.Expression = function () {

    };



    var p = $.Expression.prototype;


    var parse = $.Expression.parse = function (data, variables) {


        if (!variables)
        {
            variables = [];
        }

        if (!data)
        {
            return null;
        }


        var values = data.match(/['"\\]|@\w+|[^'"\\@]+/g),
            i = 0,
            length = values.length,
            value,
            quote,  //引号
            escape, //转义
            body = "";

        while (i < length)
        {
            switch (value = values[i])
            {
                case "'":
                case "\"":
                    if (!escape)
                    {
                        if (quote)
                        {
                            if (quote == value)
                            {
                                quote = null;
                            }
                        }
                        else
                        {
                            quote = value;
                        }
                    }
                    else
                    {
                        escape = false;
                    }
                    break;

                case "\\":
                    escape = quote ? !escape : false;
                    break;

                default:
                    if (value[0] == "@" && !quote)
                    {
                        value = values[i] = value.substring(1);

                        if (!values[value])
                        {
                            values[value] = true;
                            variables.push(value);
                        }
                    }

                    escape = false;
                    break;
            }

            i++;
        }


        i = 0;
        length = variables.length;

        while (i < length)
        {
            body += "var " + (value = variables[i++]) + " = this[\"" + value + "\"];\n";
        }

        body += "return " + values.join("") + ";";
        return new Function(body);
    };



    //表达式内容
    $.defineProperty(p, "data",

        function () {

            return this["x:data"];
        },

        function (value) {

            this["x:data"] = "" + value;
            this.variables = [];
            this.fn = parse(this["x:data"], this.variables);
        });


    //函数 由表达式自动生成(请勿修改)
    p.fn = null;



})(flyingon);



﻿/// <reference path="Core.js" />
/// <reference path="SerializableObject.js" />


(function ($) {


    $.class("DataBinding", $.SerializableObject, function () {


        this.defineProperty("source", null, "resource");

        this.defineProperty("name", null);

        this.defineProperty("getter", null);

        this.defineProperty("setter", null);

        this.defineProperty("formatter", null);



        //绑定源
        this["x:source"] = null;

        //绑定目标
        this["x:target"] = null;

        //是否正在处理绑定
        this["x:binding"] = false;

        //获取值变量列表
        this["x:getter:variables"] = null;

        //设置值变量列表
        this["x:setter:variables"] = null;

        //获取值函数
        this["fn:getter"] = null;

        //设置值函数
        this["fn:setter"] = null;



        this.initialize = function (source, target) {

            if (source && target)
            {

            }
        };

        this.getValue = function (source) {

            var storage = this["x:storage"],
                cache,
                result;

            if (storage.getter)
            {
                if (!(cache = this["fn:getter"]))
                {
                    cache = this["x:getter:variables"] = [];
                    cache = this["fn:getter"] = $.Expression.parse(storage.getter, cache);
                }

                result = cache.call(source);
            }
            else
            {
                result = source[storage.name];
            }

            return (cache = storage.formatter) ? cache.format(result) : result;
        };

        this.setValue = function (value) {

        };


        this.dispose = function () {

            this["x:source"] = null;
            this["x:target"] = null;
            this["fn:getter"] = null;
            this["fn:setter"] = null;
        };

    });



})(flyingon);



﻿/// <reference path="../Base/Core.js" />


/*

数据对象


*/
(function ($) {


    //
    $.class("DataObject", $.SerializableObject, function ($) {


        function getter(name, attributes) {

            var body = "var name = \"" + name + "\";\n"

                + "return this['x:storage']['data'][name] || this.getDefaultValue(name);";

            return this["get_" + name] = new Function(body);
        };

        function setter(name, attributes) {

            var body = "var storage = this['x:storage']['data'], cache, name = '" + name + "';\n"

                + this["fn:define:setter:initialize"]
                + "var oldValue = storage[name];\n"

                + (attributes.valueChangingCode ? attributes.valueChangingCode + "\n" : "") //自定义值变更代码

                + "if (oldValue !== value)\n"
                + "{\n"

                + this["fn:define:setter:change"]

                + "var original = storage['x:original'] || (storage['x:original'] = {});\n"
                + "if (!original.hasOwnProperty(name))\n"
                + "{\n"
                + "original[name] = oldValue;\n"
                + "}\n"

                + "storage[name] = value;\n"

                + (attributes.valueChangedCode ? attributes.valueChangedCode + "\n" : "")  //自定义值变更代码

                + this["fn:define:setter:bindingTo"]

                + "}\n"

                + "return this;\n";


            return this["set_" + name] = new Function("value", body);
        };


        this.defineDataProperty = function (name, defaultValue, attributes) {

            if (defaultValue !== undefined)
            {
                this["x:class"]["x:defaults"][name] = defaultValue;
            }

            var storage = this["x:storage"];

            attributes = (storage.schema || (storage.schema = {}))[name] = this["fn:parse:attributes"](attributes);
            attributes.defaultValue = defaultValue;

            $.defineProperty(this, name, getter.call(this, name, attributes), setter.call(this, name, attributes));
            return this;
        };

        this.removeDataProperty = function (name) {

            delete this[name];
            delete this["x:storage"].schema[name];
        };



        //数据结构
        this.defineProperty("schema", null);

        //数据
        this.defineProperty("data", null);

        //获取数据
        this.getData = function (name) {

            return (this["get_" + name] || this.defineDataProperty(name)["get_" + name]).call(this);
        };

        //修改数据
        this.setData = function (name, value) {

            return (this["set_" + name] || this.defineDataProperty(name)["set_" + name]).call(this, value);
        };

        //获取原始数据
        this.getOriginalData = function (name) {

            var data = this["x:storage"]["data"],
                original = data["x:original"];

            return (original && original.hasOwnProperty(name) ? original[name] : data[name]) || null;
        };

        this.hasChanged = function (name) {

            var data = this["x:storage"]["data"]["x:original"];
            return data && (!name || data.hasOwnProperty(name));
        };

        this.acceptChanges = function () {

            this["x:storage"]["data"]["x:original"] = null;
        };

        this.rejectChanges = function () {

            var storage = this["x:storage"],
                data = storage["data"],
                original = data["x:original"];

            if (original)
            {
                data["x:original"] = null;
                storage["data"] = original;
            }
        };

    });





    //
    $.class("DataArray", $.DataObject, function ($) {



        this.ondataadd = null;

        this.ondataremove = null;




        //当前位置
        this.defineProperty("position", 0, {

            valueChangingCode: "if (value < 0) { value = 0; } else if (value >= storage.length) { value = storage.length - 1; }",
        });


        this.append = function (item) {


        };

        this.insert = function (index, item) {

        };

        this.remove = function (item) {

        };

        this.removeAt = function (index) {

        };

    });



})(flyingon);



﻿/// <reference path="Core.js" />


/*

Xml解析实现



XHTML中的js操作dom原属差不多,不过没有getElementById,只有getElementsByTagName

xmlDoc.documentElement.childNodes(0).nodeName,可以得到这个节点的名称
xmlDoc.documentElement.childNodes(0).nodeValue,可以得到这个节点的值
xmlDoc.documentElement.childNodes(0).hasChild,可以判断是否有子节点

可通过使用getElementsByTagName(xPath)的方法对节点进行访问

*/
(function ($) {




    $.Xml = function (xml) {

        if (xml)
        {
            this.parse(xml);
        }
    };




    var p = $.Xml.prototype;




    //如果支持W3C DOM 则使用此方式创建
    if (document.implementation && document.implementation.createDocument)
    {
        p.parse = function (xml) {

            this.dom = new DOMParser().parseFromString(xml, "text/xml");
            this.root = this.dom.documentElement;

            return this;
        };

        p.load = function (file) {

            this.dom = document.implementation.createDocument('', '', null);
            this.dom.load(file);
            this.root = this.dom.documentElement;

            return this;
        };

        p.serialize = function () {

            return new XMLSerializer().serializeToString(this.dom);
        };
    }
        //else if (window.ActiveXObject) //IE使用ActiveX方式创建
        //{
        //    p.parse = function (xml) {

        //        this.dom = new ActiveXObject("Microsoft.XMLDOM");
        //        this.dom.async = "false";
        //        this.dom.loadXML(xml);
        //        this.root = this.dom.documentElement;

        //        return this.dom;
        //    };

        //    p.load = function (file) {

        //        this.dom = new ActiveXObject('Microsoft.XMLDOM');
        //        this.dom.async = false;
        //        this.dom.load(file);
        //        this.root = this.dom.documentElement;

        //        return this.dom;
        //    };

        //    p.serialize = function () {

        //        return this.dom.xml;
        //    };
        //}
    else
    {
        throw "you browse does not support w3c xml api!";
    }





    /*********************以上内置的Xml解析方法性能太差,以下扩展正则表达式自定义解析支持****************************/


    var regex_split = /[^<>]+|\<\/?[^<>]+\/?>/g,    //分隔标签
        regex_tag1 = /\<\s+\/\s+|\<\/\s+/g,         //替换标签空格如"< / " || "</ "
        regex_tag2 = /\<\s+/g,                      //替换标签空格如"< "
        regex_tag3 = /\s+\/\s+\>|\/\s+\>/g,         //替换标签空格如" / >" || "/ >"
        regex_tag4 = /\s+\>/g,                      //替换标签空格如" >" 
        regex_attr = /\"[^\"]*\"|[\w-_.:\u0370-\uffff]+|\'[^\']*\'/g,   //分隔属性 \u4e00-\u9fa5:汉字 参考unicode表 不返回引号的表达式(性能偏差不使用):/[\w-.:\u0370-\uffff]+|(?=\")[^\"]+(?=\")|\"\"|(?=\')[^\']+(?=\')|\'\'/g
        regex_escape = /&lt;|&gt;|&quot;|&apos;|&nbsp;|&amp;/;          //解码


    //编码
    $.Xml.encode = function (value) {

        return value.replace("<", "&lt;")
            .replace(">", "&gt;")
            .replace("\"", "&quot;")
            .replace("'", "&apos;")
            .replace(" ", "&nbsp;")
            .replace("&", "&amp;");
    };

    //解码
    $.Xml.decode = function (value) {

        return value.replace("&lt;", "<")
            .replace("&gt;", ">")
            .replace("&quot;", "\"")
            .replace("&apos;", "'")
            .replace("&nbsp;", " ")
            .replace("&amp;", "&");
    };


    $.Xml.parse = function (xml) {

        var data = { tagName: "text", childNodes: [] };

        if (!xml)
        {
            return data;
        }


        //处理不规范的格式
        xml = xml.replace(regex_tag1, "</")
           .replace(regex_tag2, "<")
           .replace(regex_tag3, "/>")
           .replace(regex_tag4, ">");



        var escape = xml.match(regex_escape),   //是否存在需解码的字符
            decode = $.Xml.decode,              //解码方法
            segments = xml.match(regex_split),

            i = 0,
            length = segments.length;  //截取


        while (i < length)
        {
            var segment = segments[i++];

            if (segment[0] == "<") //如果是标签
            {
                if (segment[1] == "/") //结束标签
                {
                    var tagName = segment.substring(2, segment.length - 1);

                    if (tagName != data.tagName)
                    {
                        throw "xml data is not correct! the tag \"" + data.tagName + "\" is not closed!";;
                    }

                    data = data.parent || data;
                }
                else //开始标签
                {
                    var tokens = segment.match(regex_attr),
                        attributes = {},
                        node = { tagName: tokens[0], parentNode: data, childNodes: [], nodeType: 1, attributes: attributes },

                        j = 0,
                        count = tokens.length;

                    while (j < count)
                    {
                        var name = tokens[j++],
                            value = tokens[j++];

                        value = value.substring(1, value.length - 1);
                        attributes[name] = escape && value.charAt("&") >= 0 ? decode(value) : value;
                    }

                    data.childNodes.push(node);

                    if (segment[segment.length - 2] != "/") //不是直接结束
                    {
                        data = node;
                    }
                }
            }
            else //否则是文本内容
            {
                data.childNodes.push({ tagName: "#text", nodeType: 3, nodeValue: escape && segment.charAt("&") >= 0 ? decode(segment) : segment });
            }
        }


        return data;
    };




})(flyingon);



﻿
///Ajax实现
(function (global, $) {


    var ajax_fn = null, //ajax创建函数

        defaults = {

            type: "GET",

            dataType: "text/plain",

            contentType: "application/x-www-form-urlencoded",

            error: function (request) {

                alert(request.status + ":" + request.statusText);
            }
        };




    function ajax() {


        if (!ajax_fn)
        {
            items = [

                function () { return new XMLHttpRequest(); },
                function () { return new ActiveXObject("Microsoft.XMLHTTP"); },
                function () { return new ActiveXObject("MSXML2.XMLHTTP.3.0"); },
                function () { return new ActiveXObject("MSXML2.XMLHTTP"); }
            ];

            for (var i = 0, length = items.length; i < length; i++)
            {
                try
                {
                    var result = (ajax_fn = items[i])();
                    if (result)
                    {
                        return result;
                    }
                }
                catch (e)
                {
                }
            }
        }


        return ajax_fn();
    };


    $.encodeURL = function (url, json) {

        if (url && json)
        {
            var values = [];

            for (var name in json)
            {
                values.push(encodeURIComponent(name).replace(/%20/g, "+"));
                values.push("=");
                values.push(encodeURIComponent((json[name].toString()).replace(/%20/g, "+")));
            }

            return url + "?" + values.join("&");
        }

        return url;
    };



    function response(event) {

        var fn,
            target = event.target,
            options = target.options;

        if (target.readyState == 4)
        {
            if (options.timer)
            {
                clearTimeout(options.timer);
                delete options.timer;
            }

            if (target.status < 300)
            {
                switch (options.dataType || defaults.dataType)
                {
                    case "json":
                        options.response = $.parseJson(response.responseText);
                        break;

                    case "script":
                        options.response = eval(response.responseText);
                        break;

                    case "xml":
                        options.response = response.responseXML;
                        break;

                    default:
                        options.response = response.responseText;
                        break;
                }

                if (fn = options.success)
                {
                    fn(target, options.response);
                }
            }
            else
            {
                (options["error"] || defaults["error"])(target);
            }

            if (fn = options.complete)
            {
                fn(target, options.response);
            }
        }
        else if (fn = options.progress)
        {
            fn(++(options.progressValue || (options.progressValue = 0)));
        }
    };

    /*
    {

        url: "http://www.xxx.com"

        type: "GET",

        dataType: "text/plain" || "json" || "script" || "xml"

        contentType: "application/x-www-form-urlencoded",

        async: true,

        user: undefined,

        password: undefined,

        timeout: 0,

        data: null,

        success: function(request, response) {

        },

        error: function (request) {

            alert(request.status + ":" + request.statusText);
        },

        abort: function(request) {

        },

        complete: function(request) {

        }

    }
    */
    $.ajax = function (options) {

        var type = options.type || defaults.type,
            result = ajax_fn ? ajax_fn() : ajax(),
            async = options.async !== false;


        if (options.timeout > 0)
        {
            options.timer = setTimeout(function () {

                result.abort();

                if (options.abort)
                {
                    options.abort(result);
                }

            }, options.timeout);
        }

        result.options = options;
        result.onreadystatechange = response;
        result.open(type, options.url, async, options.user, options.password);

        if (type == "POST" || type == "PUT")
        {
            result.setRequestHeader("Content-Type", options["contentType"] || defaults["contentType"]);
        }

        if (options.headers)
        {
            for (var name in options.headers)
            {
                result.setRequestHeader(name, options.headers[name]);
            }
        }

        result.send(options.data);
        return async ? result : options.response;
    };


    $.get = function (url, options) {

        (options || (options = {})).url = url;
        options.type = "GET";

        return $.ajax(options);
    };

    $.post = function (url, options) {

        (options || (options = {})).url = url;
        options.type = "POST";

        return $.ajax(options);
    };

    $.require = function (url) {

        if (url)
        {
            var options = {

                url: url,
                type: "GET",
                dataType: "script",
                async: false
            };

            $.ajax(options);
            return options.response;
        };
    };




})(this, flyingon);









﻿
/*
延时执行器

*/
flyingon.DelayExecutor = function (interval, handler, thisArg) {


    var timer = 0, data;


    //时间间隔
    this.interval = interval;



    this.registry = function (args) {

        if (timer)
        {
            clearTimeout(timer);
        };

        data = args;
        timer = setTimeout(this.execute, this.interval);
    };

    this.execute = function () {

        if (timer)
        {
            clearTimeout(timer);
            handler.apply(thisArg, data);

            timer = 0;
            data = null;
        };

        return thisArg;
    };

};





﻿/*

*/
(function ($) {


    $.Point = function (x, y) {

        this.x = x || 0;
        this.y = y || 0;
    };


    var p = $.Point.prototype;

    p.toString = p.toLocaleString = function () {

        return "{ x:" + this.x + ", y:" + this.y + " }";
    };


})(flyingon);




(function ($) {


    $.Size = function (width, height) {

        this.width = width || 0;
        this.height = height || 0;
    };


    var p = $.Size.prototype;

    p.toString = p.toLocaleString = function () {

        return "{ width:" + this.width + ", height:" + this.height + " }";
    };


})(flyingon);




(function ($) {


    $.Rect = function (x, y, width, height) {

        if (arguments.length > 0)
        {
            this.x = x || 0;
            this.y = y || 0;
            this.width = width || 0;
            this.height = height || 0;
        }
    };

    var p = $.Rect.prototype;

    p.x = 0;

    p.y = 0;

    p.width = 0;

    p.height = 0;

    $.defineProperty(p, "right", function () {

        return this.x + this.width;
    });

    $.defineProperty(p, "bottom", function () {

        return this.y + this.height;
    });

    p.copy = function () {

        return new $.Rect(this.x, this.y, this.width, this.height);
    };

    p.toString = p.toLocaleString = function () {

        return "{ x:" + this.x + ", y:" + this.y + ", width:" + this.width + ", height:" + this.height + " }";
    };


})(flyingon);




(function ($) {


    //角度转弧度系数
    var radian = Math.PI / 180;


    //2D仿射变换矩阵
    //a	水平旋转绘图
    //b	水平倾斜绘图
    //c	垂直倾斜绘图
    //d	垂直缩放绘图
    //e	水平移动绘图
    //f	垂直移动绘图
    $.Matrix = function () {

        this.a = 1;

        this.b = 0;

        this.c = 0;

        this.d = 1;

        this.e = 0;

        this.f = 0;
    };


    var p = $.Matrix.prototype;

    p.fromArray = function (array) {

        this.a = array[0];
        this.b = array[1];
        this.c = array[2];
        this.d = array[3];
        this.e = array[4];
        this.f = array[5];

        return this;
    };

    p.toArray = function () {

        return [this.a, this.b, this.c, this.d, this.e, this.f];
    };

    p.translate = function (x, y) {

        this.append(1, 0, 0, 1, x, y);
        return this;
    };

    p.scale = function (scaleX, scaleY) {

        this.append(scaleX, 0, 0, scaleY, 0, 0);
        return this;
    };

    p.rotate = function (angle) {

        angle *= radian;

        var cos = Math.cos(angle);
        var sin = Math.sin(angle);

        this.append(-sin, cos, cos, sin, 0, 0);
        return this;
    };

    p.skew = function (skewX, skewY) {

        var x = Math.Tan(skewX * n);
        var y = Math.Tan(skewY * n);

        this.append(1, x, y, 1, 0, 0);
        return this;
    };

    p.append = function (a, b, c, d, e, f) {

        var a1 = this.a;
        var b1 = this.b;
        var c1 = this.c;
        var d1 = this.d;

        this.a = a * a1 + b * c1;
        this.b = a * b1 + b * d1;
        this.c = c * a1 + d * c1;
        this.d = c * b1 + d * d1;
        this.e = e * a1 + f * c1 + this.e;
        this.f = e * b1 + f * d1 + this.f;

        return this;
    };


    p.transform = function (x, y) {

        return {
            x: Math.round(x * this.a + y * this.b + this.e, 0),
            y: Math.round(x * this.c + y * this.d + this.f, 0)
        };
    };

    p.reverse = function (x, y) {

        return {
            x: Math.round((this.b * y - this.d * x + this.d * this.e - this.b * this.f) / (this.c * this.b - this.a * this.d)),
            y: Math.round((this.c * x - this.a * y - this.c * this.e + this.a * this.f) / (this.c * this.b - this.a * this.d))
        };
    };


})(flyingon);




﻿/*
枚举定义
*/
(function ($) {



    //显示方式
    $.Visibility = {

        //显示
        visible: "visible",

        //不显示但保留占位
        hidden: "hidden",

        //不显示也不占位
        collapsed: "collapsed"

    };



    //停靠方式
    $.Dock = {

        //左
        left: "left",

        //顶
        top: "top",

        //右
        right: "right",

        //底
        bottom: "bottom",

        //充满
        fill: "fill"

    };



    //拉伸方式
    $.Stretch = {

        //不拉伸
        none: "n",

        //水平拉伸
        horizontal: "x",

        //垂直拉伸
        vertical: "y",

        //全部拉伸
        all: "xy"

    };



    //水平对齐方式
    $.HorizontalAlign = {

        //左对齐
        left: "left",

        //居中对齐
        center: "center",

        //右对齐
        right: "right"

    };



    //垂直对齐方式
    $.VerticalAlign = {

        //顶部对齐
        top: "top",

        //居中对齐
        center: "center",

        //底部对齐
        bottom: "bottom"

    };




    //布局方式
    $.Layout = {

        //单行排列
        row: "row",

        //单列排列
        column: "column",

        //多行排列
        rows: "rows",

        //多列排列
        columns: "columns",

        //停靠
        dock: "dock",

        //单页显示
        page: "page",

        //风格排列
        grid: "grid",

        //表格排列
        table: "table",

        //绝对定义
        absolute: "absolute",

        //自定义
        custom: "custom"

    };



    //滚动条显示方式
    $.ScrollBarVisibility = {

        //自动显示或隐藏
        auto: "auto",

        //总是显示
        always: "always",

        //从不显示
        never: "never"

    };

    


})(flyingon);




﻿
//文字片段
(function ($) {



    $.TextSnippet = function (font, text) {

        this.font = font;
        this.text = text;
    };



    var p = $.TextSnippet.prototype = [];


    //字体
    p.font = null;

    //文本内容
    p.text = null;

    //文本内容
    p.text = null;

    //文字段宽度
    p.width = 0;


    //测量单词中每一个字符占用的宽度
    function measureText(font, text) {

        if (!text)
        {
            return [];
        }


        var result = [],
            cache = font["x:cache"],
            context = font["x:context"],

            i = 0,
            length = text.length;


        while (i < length)
        {
            var char = text[i++];
            result.push(cache[char] || (cache[char] = context.measureText(char).width));
        }

        return result;
    };


    function initialize() {

        var value = 0,
            chars = this.chars = measureText(this.font, this.text),
            cache = this.cache = [0],

            i = 0,
            length = chars.length;


        while (i < length)
        {
            cache.push(value += chars[i++]);
        }

        return cache;
    };




    //获取指定位置的字符索引
    p.charAt = function (x) {

        if (this.unit) //等宽字体
        {
            return Math.round(x / this.unit);
        }

        return (this.cache || initialize.call(this)).binaryBetween(x);
    };


    //获取指定字符索引的相对位置
    p.position = function (charIndex) {

        if (this.unit) //等宽字体
        {
            return charIndex * this.unit;
        }

        return (this.cache || initialize.call(this))[charIndex];
    };



})(flyingon);






﻿//文本行
(function ($) {


    $.TextPiece = function (font, text) {

        this.font = font;
        this.text = text;
        this.height = font.lineHeight;
    };


    var p = $.TextPiece.prototype = [];


    //字体
    p.font = null;

    //文本内容
    p.text = null;

    //文本行总宽度
    p.width = 0;

    //文本行总高度
    p.height = 0;



    function initialize() {

        var value1 = 0,
            value2 = 0,
            cache1 = this.cache1 = [0],
            cache2 = this.cache2 = [0],

            i = 0,
            length = this.length - 1;


        while (i < length)
        {
            var snippet = this[i++];

            cache1.push(value1 += snippet.text.length);     //文本索引
            cache2.push(value2 += snippet.width);           //位置
        }

        return this;
    };





    //unicode码: \u2e80-\uffffn:东方字符 \u00c0-\u00ff 拉丁字母1  \u0400-\u04ff 西里尔字母
    //[\u2e80-\uffff]+                      汉字类 按等宽字符 注:可能对其它字符处理不好
    //[\w\u00c0-\u00ff\u0400-\u04ff]+       类英文单词类 按英文单词的方式处理
    //[^\w\u00c0-\u00ff\u0400-\u04ff]       其它符号类 按单个字符的方式处理
    var regex_measure = /[\u2e80-\uffff]+|[^\w\r\u00c0-\u00ff\u0400-\u04ff]|[\w\u00c0-\u00ff\u0400-\u04ff]+/g;


    //测量文字 以提升canvas的measureText方法性能较差的问题
    //请尽量使用相同的字体对象以获得较好的性能
    //需注意此方法对内存占用有一定的影响 在IE下可能存在一定的误差(IE的字体渲染有问题:分段测量值的和<>直接测量值???)
    p.measureText = function () {

        var font = this.font,
            cache = font["x:cache"],
            context = font["x:context"],
            chinese = cache["汉"],
            values = this.text.match(regex_measure) || [""],
            x = 0,

            i = 0,
            length = values.length;


        while (i < length)
        {
            var text = values[i++],
                snippet = new $.TextSnippet(font, text);


            if (text[0] > "\u2e80") //东方字符类
            {
                snippet.width = text.length * chinese;
                snippet.unit = chinese; //每个字符的宽度(汉字)
            }
            else //类英文单词及其它符号类
            {
                snippet.width = cache[text] || (cache[text] = context.measureText(text).width); //总宽
            }


            this.push(snippet);

            x += snippet.width;
        }


        this.width = x;
    };




    //获取指定索引的测量信息
    p.locate = function (columnIndex) {

        if (columnIndex >= this.text.length)
        {
            return {
                snippetIndex: this.length - 1,
                charIndex: this[this.length - 1].text.length,
                columnIndex: this.text.length,
                x: this.width
            };
        }


        if (columnIndex < 0)
        {
            columnIndex = 0;
        }

        var index = (this.cache1 || initialize.call(this).cache1).binaryBetween(columnIndex),
            snippet = this[index],
            charIndex = columnIndex - this.cache1[index];


        return {
            snippetIndex: index,
            charIndex: charIndex,
            columnIndex: columnIndex,
            x: this.cache2[index] + snippet.position(charIndex)
        };
    };


    //查找指定位置的测量信息
    p.locateAt = function (x) {

        var index = (this.cache2 || initialize.call(this).cache2).binaryBetween(x),
            snippet = this[index],
            charIndex,
            x;


        if (x >= this.width) //末尾
        {
            charIndex = snippet.text.length;
            x = this.width;
        }
        else
        {
            charIndex = snippet.charAt(x - this.cache2[index]);
            x = this.cache2[index] + snippet.position(charIndex);
        }


        return {
            snippetIndex: index,
            charIndex: charIndex,
            columnIndex: this.cache1[index] + charIndex,
            x: x
        };
    };



})(flyingon);





﻿

//文本测量
(function ($) {



    $.TextMetrics = function (ownerControl) {

        this.ownerControl = ownerControl;
    };




    var p = $.TextMetrics.prototype = [];


    //字体
    p.font = null;

    //文本
    p.text = null;

    //最大宽度
    p.width = 0;

    //最大高度
    p.height = 0;

    //是否多行
    p.multiline = false;


    //开始选中位置
    p.selectionStart = 0;

    //结束选中位置
    p.selectionEnd = 0;

    //选中文本
    p.selectedText = "";






    function initialize() {

        var value1 = 0,
            value2 = 0,
            cache1 = this.cache1 = [0],
            cache2 = this.cache2 = [0],
            length = this.length - 1;


        for (var i = 0; i < length; i++)
        {
            var line = this[i];

            cache1.push(value1 += line.text.length);     //文本索引
            cache2.push(value2 += line.height);          //位置
        }

        return this;
    };




    p.measureText = function (font, text, multiline) {

        this.font = font;
        this.text = text;
        this.multiline = multiline;


        if (this.length > 0)
        {
            this.length = 0;
            this.width = 0;
            this.height = 0;
        }


        if (text)
        {
            var values = multiline ? text.split(/\r?\n/g) : [text.replace(/[\r\n]?/g, "")],

                i = 0,
                length = values.length;


            while (i < length)
            {
                var piece = new $.TextPiece(font, values[i++]);
                piece.measureText();
                this.push(piece);

                if (this.width < piece.width) //最大宽度
                {
                    this.width = piece.width;
                }

                this.height += piece.height;
            }
        }
    };







    //获取指定索引的字符信息
    p.locate = function (textIndex) {

        if (textIndex < 0)
        {
            textIndex = 0;
        }


        var index = (this.cache1 || initialize.call(this).cache1).binaryBetween(textIndex),
            start = this.cache1[index],
            result = this[index].locate(textIndex - start);

        result.pieceIndex = index;
        result.textIndex = start + result.columnIndex;

        return result;
    };


    //查找指定位置的字符信息
    p.locateAt = function (x, y) {

        var index = (this.cache2 || initialize.call(this).cache2).binaryBetween(y),
            result = this[index].locateAt(x);

        result.pieceIndex = index;
        result.textIndex = this.cache1[index] + result.columnIndex;

        return result;
    };



    function selectionEnd() {

        this.selectionStart = this.caretStart.textIndex;
        this.selectionEnd = this.caretEnd.textIndex;

        if (this.selectionEnd < this.selectionStart)
        {
            this.selectionStart = (this.caretMin = this.caretEnd).textIndex;
            this.selectionEnd = (this.caretMax = this.caretStart).textIndex;
        }
        else
        {
            this.caretMin = this.caretStart;
        }

        this.selectedText = this.text.substring(this.selectionStart, this.selectionEnd);
    };



    //移动至指定坐标
    p.moveAt = function (x, y) {

        this.caretStart = this.caretEnd = this.caretMin = this.caretMax = this.locateAt(x, y);
        this.selectionStart = this.selectionEnd = this.caretStart.textIndex;
        this.selectedText = "";
    };


    //选择至指定坐标
    p.selectionAt = function (x, y) {

        this.caretEnd = this.caretMax = this.locateAt(x, y);
        selectionEnd.call(this);
    };


    p.moveTo = function (textIndex) {

        this.caretStart = this.caretEnd = this.caretMin = this.caretMax = this.locate(textIndex);
        this.selectionStart = this.selectionEnd = this.caretStart.textIndex;
        this.selectedText = "";
    };


    p.selectionTo = function (textIndex) {

        this.caretEnd = this.caretMax = this.locate(textIndex);
        selectionEnd.call(this);
    };


    p.replace = function (text) {

        var ownerControl = this.ownerControl;

        if (ownerControl.dispatchEvent("textchanging"))
        {
            var start = this.caretMin,
                end = this.caretMax,
                textIndex = start.textIndex + text.length,
                index1 = start.pieceIndex,
                index2 = end.pieceIndex;


            text = this[index1].text.substring(0, start.columnIndex) + (text || "") + this[index2].text.substring(end.columnIndex);

            start = index1 > 0 ? this[index1 - 1].text : "";
            end = index2 + 1 < this.length ? this[index2 + 1].text : "";


            var piece = new $.TextPiece(this.font, text);
            piece.measureText();

            this.splice(index1, index2 - index1 + 1, piece);

            this.text = start + text + end;

            this.moveTo(textIndex);


            ownerControl.dispatchEvent("textchanged");
            return true;
        }

        return false;
    };


    p.remove = function (length) {

        if (!this.selectedText) //未选择
        {
            this.selectionTo(this.selectionEnd + length);
        }

        return this.replace("");
    };



})(flyingon);






﻿/*

*/
(function ($) {




    $.Text = function () {


    };




    var p = $.Text.prototype;




})(flyingon);




﻿/*

字体对象 注:字体的属性一旦创建就不能够更改 只能根据当前字体衍生(derive)出新字体


*/
(function ($) {



    $.Font = function (style, variant, weight, size, family) {

        if (arguments.length > 0)
        {
            this["x:storage"] = [style, variant, weight, size, family];
            initialize.call(this);
        }
    };



    function initialize() {

        var storage = this["x:storage"];

        if (typeof storage[3] == "number")
        {
            this.lineHeight = storage[3];
            storage[3] += "px";
        }
        else
        {
            this.lineHeight = parseInt(storage[3]);
        }

        var cache = this["x:cache"] = {},
            context = this["x:context"] = document.createElement("canvas").getContext("2d"),
            text = "a b";

        context.font = storage[5] = storage.join(" ");

        cache["汉"] = context.measureText("汉").width;
        cache[" "] = context.measureText(" ").width;
    };




    var p = $.Font.prototype,

        defineProperty = function (name, index) {

            $.defineProperty(p, name, function () {

                return this["x:storage"][index];
            });
        };



    //字体样式 normal italic oblique
    defineProperty("style", 0);

    //字体变体 normal small-caps
    defineProperty("variant", 1);

    //字体粗细 normal bold bolder lighter 100 200 300 400 500 600 700 800 900
    defineProperty("weight", 2);

    //字号
    defineProperty("size", 3);

    //字体系列
    defineProperty("family", 4);

    //字体值
    defineProperty("value", 5);

    //行高
    p.lineHeight = 12;


    ////start     文本在指定的位置开始
    ////end       文本在指定的位置结束
    ////center    文本的中心被放置在指定的位置
    ////left      文本左对齐
    ////right     文本右对齐
    //p.align = "start";

    ////alphabetic    文本基线是普通的字母基线
    ////top           文本基线是 em 方框的顶端
    ////hanging       文本基线是悬挂基线
    ////middle        文本基线是 em 方框的正中
    ////ideographic   文本基线是表意基线
    ////bottom        文本基线是 em 方框的底端
    //p.baseline = "alphabetic";




    //以当前字体为原型衍生出新字体  properties : { style:XXX, variant:XXX, weight:XXX, size:XXX, family:XXX }
    p.derive = function (properties) {

        var result = new $.Font(),
            data = result["x:storage"] = this["x:storage"].slice(0, 4);

        data[0] = properties.style || data[0];
        data[1] = properties.variant || data[1];
        data[2] = properties.weight || data[2];
        data[3] = properties.size || data[3];
        data[4] = properties.family || data[4];

        initialize.call(result);

        return result;
    };


    //根据当前字体衍生出粗体
    p.deriveBold = function () {

        return this["bold"] = this.derive({ weight: "bold" });
    };

    //根据当前字体衍生出斜体
    p.deriveItalic = function () {

        return this["italic"] = this.derive({ style: "italic" });
    };

    //根据当前字体衍生出粗斜体
    p.deriveBoldItalic = function () {

        var result = this.derive({ weight: "bold", style: "italic" });

        if (this["bold"])
        {
            this["bold"]["italic"] = result;
        }

        if (this["italic"])
        {
            this["italic"]["bold"] = result;
        }

        return this["bold-italic"] = result;
    };



})(flyingon);




﻿/*

Canvas2D绘图扩展


参考:http://www.w3school.com.cn/html5/html5_ref_canvas.asp

*/

(function ($) {




    /*
    转成RGB颜色

    */
    $.toRGBString = function (r, g, b, alpha) {

        if (arguments.length <= 2)
        {
            alpha = g;
            b = r & 0xFF;
            g = r >> 8 & 0xFF;
            r = r >> 16 & 0xFF;
        }

        if (alpha == null)
        {
            return "rgb(" + r + "," + g + "," + b + ")";
        }

        return "rgba(" + r + "," + g + "," + b + "," + alpha + ")";
    };

    /*
    转成HSL颜色

    */
    $.toHSLString = function (hue, saturation, lightness, alpha) {

        if (alpha == null)
        {
            return "hsl(" + (hue % 360) + "," + saturation + "%," + lightness + "%)";
        }

        return "hsla(" + (hue % 360) + "," + saturation + "%," + lightness + "%," + alpha + ")";
    };




    /*
    线性渐变

    */
    $.LinearGradient = function (x0, y0, x1, y1, colorStops) {

        this.x0 = x0;
        this.y0 = y0;
        this.x1 = x1;
        this.y1 = y1;
        this.colorStops = colorStops;
    };

    $.LinearGradient.prototype.createBrush = function (context) {

        var rect = context.boxModel.innerRect,

            x = rect.windowX,
            y = rect.windowY,
            width = rect.width,
            height = rect.height,

            g = context.createLinearGradient(x + this.x0 * width, y + this.y0 * height, x + this.x1 * width, y + this.y1 * height),

            colorStops = this.colorStops;


        for (var i = 0; i < colorStops.length; i++)
        {
            g.addColorStop(colorStops[i][0], colorStops[i][1]);
        }

        return g;
    };



    /*
    径向渐变

    */
    $.RadialGradient = function (x0, y0, r0, x1, y1, r1, colorStops) {

        this.x0 = x0;
        this.y0 = y0;
        this.r0 = r0;
        this.x1 = x1;
        this.y1 = y1;
        this.r1 = r1;
        this.colorStops = colorStops;
    };

    $.RadialGradient.prototype.createBrush = function (context) {

        var rect = context.boxModel.innerRect,

            x = rect.windowX,
            y = rect.windowY,
            width = rect.width,
            height = rect.height,

            g = context.createRadialGradient(x + this.x0 * width, y + this.y0 * height, this.r0, x + this.x1 * width, y + this.y1 * height, this.r1),

            colorStops = this.colorStops;


        for (var i = 0; i < colorStops.length; i++)
        {
            g.addColorStop(colorStops[i][0], colorStops[i][1]);
        }

        return g;
    };


    /*
    图像填充模式

    */
    $.ImagePattern = function (image, repetition) {

        this.image = image;
        this.repetition = repetition;
    };

    $.ImagePattern.prototype.createBrush = function (context) {

        return context.createPattern(this.image, this.repetition);
    };




    /*
    加载主题

    */
    $.loadTheme = function (themeName) {

        $.require("/themes/" + (themeName || $.setting.themeName || "default") + ".js");
        ($.styles["Control"] || ($.styles["Control"] = {}))["x:cache"] = true; //缓存标记
    };

    $.loadTheme();





    var colors = $.colors, //系统颜色

        fonts = $.fonts, //系统字体

        radian = Math.PI / 180, //角度转弧度系数

        p = CanvasRenderingContext2D.prototype;



    /****************************以下为属性方法扩展********************************/


    /*    
    set_fillStyle(color) = "#000000"	设置填充色
    set_strokeStyle(color) = "#000000"	设置边框色
    */
    ["fillStyle", "strokeStyle"].forEach(function (name) {

        this["set_" + name] = function (value) {

            var color = value && (colors[value] || value);

            this[name] = color && color.createBrush ? color.createBrush(this) : color;
            return this;
        };

    }, p);



    /*    
    set_shadowColor(color) = "#000000"	设置或返回用于阴影的颜色 
    */
    p.set_shadowColor = function (color) {

        this.shadowColor = color;
        return this;
    };

    /* 
    set_shadowBlur(number) = 0	    设置或返回用于阴影的模糊级别 
    */
    p.set_shadowBlur = function (value) {

        this.shadowBlur = value;
        return this;
    };

    /* 
    set_shadowOffsetX(number) = 0	设置或返回阴影距形状的水平距离 
    */
    p.set_shadowOffsetX = function (value) {

        this.shadowOffsetX = value;
        return this;
    };

    /* 
    set_shadowOffsetY(number) = 0	设置或返回阴影距形状的垂直距离 
    */
    p.set_shadowOffsetY = function (value) {

        this.shadowOffsetY = value;
        return this;
    };

    /* 
    set_lineCap("butt|round|square") = "butt"	    设置或返回线条的结束端点样式 
    */
    p.set_lineCap = function (value) {

        this.lineCap = value;
        return this;
    };

    /* 
    set_lineJoin("bevel|round|miter") = "miter"	    设置或返回两条线相交时 所创建的拐角类型 
    */
    p.set_lineJoin = function (value) {

        this.lineJoin = value;
        return this;
    };

    /* 
    set_lineWidth(number) = 1	    设置或返回当前的线条宽度 
    */
    p.set_lineWidth = function (value) {

        this.lineWidth = value;
        return this;
    };

    /* 
    set_miterLimit(number) = 10	    设置或返回最大斜接长度 
    */
    p.set_miterLimit = function (value) {

        this.miterLimit = value;
        return this;
    };

    /* 
    set_font("italic small-caps bold 12px arial") = "10px sans-serif"	设置或返回文本内容的当前字体属性 
    */
    p.set_font = function (value) {

        var font = fonts[value] || value;

        this.font = font && (font.value || font);
        return this;
    };

    /* 
    set_textAlign("center|end|left|right|start") = "start"	设置或返回文本内容的当前对齐方式 
    */
    p.set_textAlign = function (value) {

        this.textAlign = value;
        return this;
    };

    /* 
    set_textBaseline("alphabetic|top|hanging|middle|ideographic|bottom") = "alphabetic"	设置或返回在绘制文本时使用的当前文本基线
    */
    p.set_textBaseline = function (value) {

        this.textBaseline = value;
        return this;
    };

    /* 
    set_globalAlpha(number)	透明值 必须介于0.0(完全透明)与1.0(不透明)之间
    */
    p.set_globalAlpha = function (value) {

        this.globalAlpha = value;
        return this;
    };

    /* 
    set_globalCompositeOperation("source-over|source-atop|source-in|source-out|destination-over|destination-atop|destination-in|destination-out|lighter|copy|source-over") = "source-over"	设置或返回新图像如何绘制到已有的图像上

    source-over	默认 在目标图像上显示源图像 
    source-atop	在目标图像顶部显示源图像 源图像位于目标图像之外的部分是不可见的 
    source-in	在目标图像中显示源图像 只有目标图像内的源图像部分会显示 目标图像是透明的 
    source-out	在目标图像之外显示源图像 只会显示目标图像之外源图像部分 目标图像是透明的 
    destination-over	在源图像上方显示目标图像 
    destination-atop	在源图像顶部显示目标图像 源图像之外的目标图像部分不会被显示 
    destination-in	在源图像中显示目标图像 只有源图像内的目标图像部分会被显示 源图像是透明的 
    destination-out	在源图像外显示目标图像 只有源图像外的目标图像部分会被显示 源图像是透明的 
    lighter	显示源图像 + 目标图像 
    copy	显示源图像 忽略目标图像 
    source-over	使用异或操作对源图像与目标图像进行组合 
    */
    p.set_globalCompositeOperation = function (value) {

        this.globalCompositeOperation = value;
        return this;
    };


    /*****************************************************************************/






    /****************************以下为标准方法说明********************************/

    /*
    rect()	        创建矩形
    fillRect()	    绘制“被填充”的矩形
    strokeRect()	绘制矩形(无填充)
    clearRect()	    在给定的矩形内清除指定的像素

    fill()	    填充当前绘图(路径)
    stroke()	绘制已定义的路径
    beginPath()	起始一条路径 或重置当前路径
    closePath()	创建从当前点回到起始点的路径
    clip()	    从原始画布剪切任意形状和尺寸的区域
    save()	    保存当前环境的状态
    restore()	返回之前保存过的路径状态和属性

    moveTo(x, y)	把路径移动到画布中的指定点 不创建线条
    lineTo(x, y)	添加一个新点 然后在画布中创建从该点到最后指定点的线条
    translate(x, y)	重新映射画布上的 (0,0) 位置
    scale(x, y)	    缩放当前绘图至更大或更小
    isPointInPath(x, y)	如果指定的点位于当前路径中 则返回 true 否则返回 false

    quadraticCurveTo(cpx, cpy, x, y)	创建二次贝塞尔曲线
    cpx	贝塞尔控制点的 x 坐标
    cpy	贝塞尔控制点的 y 坐标
    x	结束点的 x 坐标
    y	结束点的 y 坐标

    bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x, y)	创建三次方贝塞尔曲线
    cp1x	第一个贝塞尔控制点的 x 坐标
    cp1y	第一个贝塞尔控制点的 y 坐标
    cp2x	第二个贝塞尔控制点的 x 坐标
    cp2y	第二个贝塞尔控制点的 y 坐标
    x	结束点的 x 坐标
    y	结束点的 y 坐标

    arc(x,y,r,sAngle,eAngle,counterclockwise)	创建弧/曲线(用于创建圆形或部分圆)
    x	圆的中心的 x 坐标 
    y	圆的中心的 y 坐标 
    r	圆的半径 
    sAngle	起始角 以弧度计 (弧的圆形的三点钟位置是 0 度) 
    eAngle	结束角 以弧度计 
    counterclockwise	可选 规定应该逆时针还是顺时针绘图 False = 顺时针 true = 逆时针 

    arcTo(x1, y1, x2, y2, radius)	创建两切线之间的弧/曲线
    x1  
    y1  
    x2  
    y2      
    radius  半径

    rotate(angle)	旋转当前绘图

    transform(a, b, c, d, e, f)	    替换绘图的当前转换矩阵
    setTransform(a, b, c, d, e, f)	将当前转换重置为单位矩阵 然后运行 transform()
    a	水平缩放绘图
    b	水平倾斜绘图
    c	垂直倾斜绘图
    d	垂直缩放绘图
    e	水平移动绘图
    f	垂直移动绘图

    fillText(text, x, y, maxWidth)	在画布上绘制“被填充的”文本
    strokeText(text, x, y, maxWidth)	在画布上绘制文本(无填充)

    text	    规定在画布上输出的文本
    x	        开始绘制文本的x坐标位置(相对于画布)
    y	        开始绘制文本的y坐标位置(相对于画布)
    maxWidth	可选 允许的最大文本宽度,以像素计
 
    measureText(text)	返回包含指定文本宽度

    drawImage(img, sx, sy, swidth, sheight, x, y, width, height)	向画布上绘制图像、画布或视频

    img	    规定要使用的图像、画布或视频
    sx	    可选 开始剪切的x坐标位置
    sy	    可选 开始剪切的y坐标位置
    swidth	可选 被剪切图像的宽度
    sheight	可选 被剪切图像的高度
    x	    可选 在画布上放置图像的x坐标位置
    y	    可选 在画布上放置图像的y坐标位置
    width	可选 要使用的图像的宽度(伸展或缩小图像)
    height	可选 要使用的图像的高度(伸展或缩小图像)
    */


    /*****************************************************************************/




    /****************************以下为方法扩展********************************/


    p.drawBorder = function (x, y, width, height, border) {

        this.beginPath();

        this.rect(x, y, width - border[1], border[0]);
        this.rect(x + width - border[1], y, border[1], height - border[2]);
        this.rect(x + border[3], y + height - border[2], width - border[3], border[2]);
        this.rect(x, y + border[0], border[3], height - border[0]);

        this.fill();
    };



    p.rectTo = function (x, y, width, height, anticlockwise) {

        var right = x + width,
            bottom = y + height;

        if (anticlockwise)
        {
            this.moveTo(x, y);
            this.lineTo(x, bottom);
            this.lineTo(right, bottom);
            this.lineTo(right, y);
            this.lineTo(x, y);
        }
        else
        {
            this.moveTo(x, y);
            this.lineTo(right, y);
            this.lineTo(right, bottom);
            this.lineTo(x, bottom);
            this.lineTo(x, y);
        }
    };


    /*
    * 绘制圆角矩形路径
    * @param {Number} x The top left x coordinate
    * @param {Number} y The top left y coordinate 
    * @param {Number} width The width of the rectangle 
    * @param {Number} height The height of the rectangle
    * @param {Number} radius The corner radius. Defaults to 5;
    */
    p.roundRect = function (x, y, width, height, radius, anticlockwise) {

        var right = x + width,
            bottom = y + height;

        if (anticlockwise)
        {
            this.moveTo(x, y + radius);

            this.lineTo(x, bottom - radius);
            this.quadraticCurveTo(x, bottom, x + radius, bottom);

            this.lineTo(right - radius, bottom);
            this.quadraticCurveTo(right, bottom, right, bottom - radius);

            this.lineTo(right, y + radius);
            this.quadraticCurveTo(right, y, right - radius, y);

            this.lineTo(x + radius, y);
            this.quadraticCurveTo(x, y, x, y + radius);
        }
        else
        {
            this.moveTo(x + radius, y);

            this.lineTo(right - radius, y);
            this.quadraticCurveTo(right, y, right, y + radius);

            this.lineTo(right, bottom - radius);
            this.quadraticCurveTo(right, bottom, right - radius, bottom);

            this.lineTo(x + radius, bottom);
            this.quadraticCurveTo(x, bottom, x, bottom - radius);

            this.lineTo(x, y + radius);
            this.quadraticCurveTo(x, y, x + radius, y);
        }
    };

    /*
    * 填充圆角矩形
    * @param {Number} x The top left x coordinate
    * @param {Number} y The top left y coordinate 
    * @param {Number} width The width of the rectangle 
    * @param {Number} height The height of the rectangle
    * @param {Number} radius The corner radius. Defaults to 5;
    */
    p.fillRoundRect = function (x, y, width, height, radius) {

        this.beginPath();
        this.roundRect(x, y, width, height, radius);
        this.fill();
    };

    /*
    * 描边圆角矩形
    * @param {Number} x The top left x coordinate
    * @param {Number} y The top left y coordinate 
    * @param {Number} width The width of the rectangle 
    * @param {Number} height The height of the rectangle
    * @param {Number} radius The corner radius. Defaults to 5;
    */
    p.strokeRoundRect = function (x, y, width, height, radius) {

        this.beginPath();
        this.roundRect(x, y, width, height, radius);
        this.stroke();
    };


    //多边形
    p.polygon = function (sides, x, y, radius, angle, anticlockwise) {

        var delta = (anticlockwise ? -2 : 2) * Math.PI / sides;

        angle = angle ? angle * radian : 0;

        this.moveTo(x + radius * Math.sin(angle), y - radius * Math.cos(angle));

        for (var i = 1; i <= sides; i++)
        {
            angle += delta;
            this.lineTo(x + radius * Math.sin(angle), y - radius * Math.cos(angle));
        }
    };

    p.fillPolygon = function (sides, x, y, radius, angle, anticlockwise) {

        this.beginPath();
        this.polygon(sides, x, y, radius, angle, anticlockwise);
        this.fill();
    };

    p.strokePolygon = function (sides, x, y, radius, angle, anticlockwise) {

        this.beginPath();
        this.polygon(sides, x, y, radius, angle, anticlockwise);
        this.stroke();
    };



    p.starPolygon = function (vertexes, x, y, radius1, radius2, angle, anticlockwise) {

        var delta = (anticlockwise ? -1 : 1) * Math.PI / vertexes;

        angle = angle ? angle * radian : 0;

        this.moveTo(x + radius1 * Math.sin(angle), y - radius1 * Math.cos(angle));

        for (var i = 1; i <= vertexes; i++)
        {
            angle += delta;
            this.lineTo(x + radius2 * Math.sin(angle), y - radius2 * Math.cos(angle));

            angle += delta;
            this.lineTo(x + radius1 * Math.sin(angle), y - radius1 * Math.cos(angle));
        }
    };

    p.fillStarPolygon = function (vertexes, x, y, radius1, radius2, angle, anticlockwise) {

        this.beginPath();
        this.starPolygon(vertexes, x, y, radius1, radius2, angle, anticlockwise);
        this.fill();
    };

    p.strokeStarPolygon = function (vertexes, x, y, radius1, radius2, angle, anticlockwise) {

        this.beginPath();
        this.starPolygon(vertexes, x, y, radius1, radius2, angle, anticlockwise);
        this.stroke();
    };



    p.ellipse = function (x, y, width, height, anticlockwise) {

        var controlX = width / 1.5,  //控制点x(width / 0.75) / 2
            controlY = height / 2;   //控制点y

        if (anticlockwise)
        {
            this.moveTo(x, y + controlY);
            this.bezierCurveTo(x + controlX, y + controlY, x + controlX, y - controlY, x, y - controlY);
            this.bezierCurveTo(x - controlX, y - controlY, x - controlX, y + controlY, x, y + controlY);
        }
        else
        {
            this.moveTo(x, y - controlY);
            this.bezierCurveTo(x + controlX, y - controlY, x + controlX, y + controlY, x, y + controlY);
            this.bezierCurveTo(x - controlX, y + controlY, x - controlX, y - controlY, x, y - controlY);
        }
    };

    p.fillEllipse = function (x, y, width, height) {

        this.beginPath();
        this.ellipse(x, y, width, height);
        this.fill();
    };

    p.strokeEllipse = function (x, y, width, height) {

        this.beginPath();
        this.ellipse(x, y, width, height);
        this.stroke();
    };



    //画虚线
    p.dashLine = function (x1, y1, x2, y2, dashArray) {

        if (!dashArray)
        {
            dashArray = [10, 5];
        }


        this.moveTo(x1, y1);

        var length = dashArray.length,
            width = (x2 - x1),
            height = (y2 - y1),
            slope = height / width,
            distRemaining = Math.sqrt(width * width + height * height),
            index = 0,
            draw = false;


        while (distRemaining >= 0.1)
        {
            var dashLength = dashArray[index++ % length];

            if (dashLength > distRemaining)
            {
                dashLength = distRemaining;
            }

            var step = Math.sqrt(dashLength * dashLength / (1 + slope * slope));

            if (width < 0)
            {
                step = -step;
            }

            x1 += step;
            y1 += slope * step;

            this[(draw = !draw) ? "lineTo" : "moveTo"](x1, y1);

            distRemaining -= dashLength;
        }
    };



    /*****************************************************************************/




    var cache = document.createElement("canvas");

    //缓冲绘图
    p.cache = function (width, height) {

        cache.width = width;
        cache.height = height;

        return cache.getContext("2d");
    };

    //复制至指定目标
    p.copyTo = function (target, x, y) {

        var data = this.getImageData(0, 0, this.canvas.width, this.canvas.height);
        target.putImageData(data, x, y);
    };



})(flyingon);




﻿/*

*/
(function ($) {


    //事件类型基类
    $.class("Event", function ($) {


        this.create = function (type, target) {

            this.type = type;
            this.target = target;
        };




        //是否取消冒泡
        this.cancelBubble = false;

        //是否阻止默认动作
        this.defaultPrevented = false;



        this.stopPropagation = function () {

            this.cancelBubble = true;
        };

        this.preventDefault = function () {

            this.defaultPrevented = true;
        };


    });




    //鼠标事件类型
    $.class("MouseEvent", $.Event, function ($) {


        this.create = function (type, target, originalEvent) {

            this.originalEvent = originalEvent;
        };


        var target = this,

            defineProperty = function (name) {

                $.defineProperty(target, name, function () {

                    return this.originalEvent[name];
                });
            };


        //是否按下ctrl键
        defineProperty("ctrlKey");

        //是否按下shift键
        defineProperty("shiftKey");

        //是否按下alt键
        defineProperty("altKey");

        //是否按下meta键
        defineProperty("metaKey");

        //事件触发时间
        defineProperty("timeStamp");

        //鼠标按键 左:0 中:1 右:2 IE9以上与W3C相同
        defineProperty("button");

        //相对屏幕的x坐标
        defineProperty("screenX");

        //相对屏幕的y坐标
        defineProperty("screenY");

        //相对窗口客户区的x坐标
        defineProperty("clientX");

        //相对窗口客户区的y坐标
        defineProperty("clientY");





        function offsetToTarget() {

            var event = this.originalEvent;

            if (!event["x:targetX"])
            {
                var p = this.target["x:boxModel"].offsetToTarget(event["x:offsetX"], event["x:offsetY"]);

                event["x:targetX"] = p.x;
                event["x:targetY"] = p.y;
            }

            return event;
        };


        function offsetToWindow() {

            var event = this.originalEvent;

            if (!event["x:windowX"])
            {
                var p = this.target["x:boxModel"].offsetToWindow(event["x:offsetX"], event["x:offsetY"]);

                event["x:windowX"] = p.x;
                event["x:windowY"] = p.y;
            }

            return event;
        };


        function offsetToControl() {

            var event = this.originalEvent;

            if (!event["x:controlX"])
            {
                var p = this.target["x:boxModel"].offsetToControl(event["x:offsetX"], event["x:offsetY"]);

                event["x:controlX"] = p.x;
                event["x:controlY"] = p.y;
            }

            return event;
        };




        //x偏移坐标
        $.defineProperty(this, "offsetX", function () {

            return this.originalEvent["x:offsetX"];
        });

        //y偏移坐标
        $.defineProperty(this, "offsetY", function () {

            return this.originalEvent["x:offsetY"];
        });


        //x目标坐标
        $.defineProperty(this, "targetX", function () {

            return this.originalEvent["x:targetX"] || offsetToTarget.call(this)["x:targetX"];
        });

        //y目标坐标
        $.defineProperty(this, "targetY", function () {

            return this.originalEvent["x:targetY"] || offsetToTarget.call(this)["x:targetY"];
        });


        //x窗口坐标
        $.defineProperty(this, "windowX", function () {

            return this.originalEvent["x:windowX"] || offsetToWindow.call(this)["x:windowX"];
        });

        //y窗口坐标
        $.defineProperty(this, "windowY", function () {

            return this.originalEvent["x:windowY"] || offsetToWindow.call(this)["x:windowY"];
        });

        //x相对坐标
        $.defineProperty(this, "controlX", function () {

            return this.originalEvent["x:controlX"] || offsetToControl.call(this)["x:controlX"];
        });

        //y相对坐标
        $.defineProperty(this, "controlY", function () {

            return this.originalEvent["x:controlY"] || offsetToControl.call(this)["x:controlY"];
        });




        //鼠标滚轮数据
        $.defineProperty(this, "wheelDelta", function () {

            return this.originalEvent.wheelDelta || (-this.originalEvent.detail * 40);
        });


    });





    //拖拉事件类型
    $.class("DragEvent", $.MouseEvent, function ($) {


        this.create = function (type, target, originalEvent) {

            //拖动目标
            this.dragTargets = [target];

            //接收目标
            this.dropTarget = null;

        };

    });





    //键盘事件类型
    $.class("KeyEvent", $.Event, function ($) {


        this.create = function (type, target, originalEvent) {

            this.originalEvent = originalEvent || {};
        };



        //是否按下ctrl键
        $.defineProperty(this, "ctrlKey", function () {

            return this.originalEvent["ctrlKey"];
        });

        //是否按下shift键
        $.defineProperty(this, "shiftKey", function () {

            return this.originalEvent["shiftKey"];
        });

        //是否按下alt键
        $.defineProperty(this, "altKey", function () {

            return this.originalEvent["altKey"];
        });

        //是否按下meta键
        $.defineProperty(this, "metaKey", function () {

            return this.originalEvent["metaKey"];
        });

        //事件触发时间
        $.defineProperty(this, "timeStamp", function () {

            return this.originalEvent["timeStamp"];
        });

        //键码
        $.defineProperty(this, "keyCode", function () {

            return this.originalEvent.which || this.originalEvent.keyCode;
        });

    });






    //属性值变更事件类型
    $.class("PropertyChangedEvent", $.Event, function ($) {

        this.create = function (type, target, name, value, oldValue) {

            this.name = name;
            this.value = value;
            this.oldValue = oldValue;
        };

    });



})(flyingon);




﻿/*

*/
(function ($) {



    //拖拉管理
    var Dragdrop = $.Dragdrop = {};





    //局部变量
    var dragger,            //拖拉者
        timer,              //定时器

        ownerWindow,        //所属窗口
        ownerLayer,         //拖拉层
        ownerControl,       //目标控件

        startEvent,         //原始事件
        dragTargets,        //拖动目标
        dropTarget,         //接收目标

        allowdropCursor,    //允许拖放时的光标
        nodropCursor,       //禁止拖放时的光标

        dragging,   //是否正在拖动
        lastEvent,  //记录最后的mousemove事件参数, 用于记录停止拖拉时的最后位置, mouseup为鼠标按下时的坐标,与需求不符
        offsetX,    //X方向因移动造成的修正距离
        offsetY;    //Y方向因移动造成的修正距离




    //新建事件
    function newevent(type, originalEvent) {

        var result = new $.DragEvent(type, ownerControl, originalEvent);

        result.dragTargets = dragTargets;
        result.dropTarget = dropTarget;

        return result;
    };

    //创建拖拉层
    function createLayer() {

        ownerLayer = new $.Layer();
        ownerLayer.disableGetControlAt = true;
        ownerLayer["x:storage"].clipToBounds = false;

        var style = ownerLayer.domLayer.style;

        style.overflow = "visible";
        style.cursor = dragger.allowdropCursor;
        style.opacity = dragger.opacity || 0.5;

        ownerWindow.appendLayer(ownerLayer, 9999);
    };




    //默认拖拉者
    Dragdrop.dragger = {

        //允许拖放地显示光标
        allowdropCursor: $.cursors["allow-drop"],

        //不允许拖放时显示光标
        nodropCursor: $.cursors["no-drop"],

        //透明度
        opacity: 0.5,

        //默认开始行为
        start: function (event) {

            //发送事件
            ownerControl.dispatchEvent(event);
        },

        //默认绘制行为
        paint: function (dragTargets) {

            for (var i = 0; i < dragTargets.length; i++)
            {
                var box = dragTargets[i]["x:boxModel"];

                if (box)
                {
                    box.render(layer.context);
                }
            }
        },

        //默认移动行为
        move: function (domMouseEvent, offsetX, offsetY) {

            //需修正div移动偏差
            var target = ownerWindow.getControlAt(domMouseEvent.offsetX + offsetX, domMouseEvent.offsetY + offsetY),
                event;


            if (target == ownerControl)
            {
                target = ownerControl["x:parent"];
            }


            if (dropTarget != target)
            {
                ownerLayer.domLayer.style.cursor = target == null ? nodropCursor : allowdropCursor;

                if (dropTarget)
                {
                    event = newevent("dragleave", domMouseEvent);
                    dropTarget.dispatchEvent(event);
                }


                if (target && target["x:storage"].droppable)
                {
                    dropTarget = target;

                    event = newevent("dragenter", domMouseEvent);
                    target.dispatchEvent(event);
                }
                else
                {
                    dropTarget = target = null;
                }
            }


            event = newevent("drag", domMouseEvent);
            ownerControl.dispatchEvent(event);


            if (target)
            {
                event = newevent("dragover", domMouseEvent);
                target.dispatchEvent(event);
            }
        },

        //默认停止行为
        stop: function (domMouseEvent, offsetX, offsetY) {

            if (dropTarget)
            {
                dropTarget.dispatchEvent(newevent("drop", domMouseEvent));
            }

            ownerControl.dispatchEvent(newevent("dragend", domMouseEvent));
        }

    };







    //执行拖动
    function start() {

        if (timer)
        {
            clearTimeout(timer);
            timer = null;
        }


        //拖动者
        dragger = ownerControl.dragger || Dragdrop.dragger;

        allowdropCursor = dragger.allowdropCursor || Dragdrop.dragger.allowdropCursor;
        nodropCursor = dragger.nodropCursor || Dragdrop.dragger.nodropCursor;


        //拖动目标
        dragTargets = [ownerControl];


        //开始拖拉事件
        var event = newevent("dragstart", startEvent);

        //是否取消
        event.canceled = false;


        //开始
        if (dragger.start)
        {
            dragger.start(event);
        }

        if (!event.canceled)
        {
            if (event.dragTargets)
            {
                dragTargets = event.dragTargets;
            }

            createLayer();
            dragger.paint.call(ownerControl, ownerLayer, dragTargets);
        }
        else
        {
            dragging = false;
        }
    };

    //开始拖动(200毫秒内保持按下鼠标则执行拖动)
    Dragdrop.start = function (window, target, domMouseEvent) {

        if (timer)
        {
            clearTimeout(timer);
        }

        dragging = true;

        ownerWindow = window;
        ownerControl = target;
        startEvent = domMouseEvent;

        offsetX = 0;
        offsetY = 0;

        timer = setTimeout(start, 200);
    };


    //移动
    Dragdrop.move = function (domMouseEvent) {

        if (!dragging)
        {
            return;
        }

        if (timer)
        {
            clearTimeout(timer);
            timer = null;

            start();
        }

        if (ownerLayer)
        {
            var event = lastEvent = domMouseEvent;

            //div移动距离
            offsetX = event.clientX - startEvent.clientX;
            offsetY = event.clientY - startEvent.clientY;

            var p = dragger.move.call(target, event, offsetX, offsetY);

            if (p)
            {
                offsetX = p.x || 0;
                offsetY = p.y || 0;
            };

            ownerLayer.domLayer.style.left = offsetX + "px";
            ownerLayer.domLayer.style.top = offsetY + "px";

            return true;
        };

        return false;
    };



    //停止拖动, 成功取消则返回true
    Dragdrop.stop = function () {

        if (timer)
        {
            clearTimeout(timer);
            timer = null;
        };

        var result = !ownerLayer;

        //如果未执行则补上mousedown事件
        if (ownerLayer)
        {
            //如果按下且移动过且可接受拖放时才触发停止方法
            if (lastEvent && ownerLayer.domLayer.style.cursor != nodropCursor)
            {
                dragger.stop.call(target, lastEvent, offsetX, offsetY);
            };

            ownerWindow.removeLayer(ownerLayer);
            ownerLayer = null;

            //处理捕获控件
            ownerWindow["x:captureDelay"].registry([lastEvent]);
        }
        else
        {
            target.dispatchEvent(new $.MouseEvent("mousedown", target, startEvent));
        };

        ownerWindow = ownerLayer = ownerControl = null;
        startEvent = lastEvent = null;
        dragger = dragTargets = dropTarget = dragging = null;

        return result;
    };



})(flyingon);




﻿/*

*/
(function ($) {



    //变量管理器
    $.BoxModel = function (ownerControl) {


        //所属控件
        this.ownerControl = ownerControl;


        //外框范围
        this.outerRect = new $.Rect();

        //绘制边框范围
        this.borderRect = new $.Rect();

        //内框范围
        this.innerRect = new $.Rect();
    };




    var p = $.BoxModel.prototype;


    //上级盒模型
    p.parent = null;

    //相对偏移所属父模型
    p.offsetParent = null;

    //子盒模型
    p.children = null;

    //附加项
    p.addition = null;

    //可渲染的子项集
    p.renderItems = null;

    //是否需要渲染
    p.visible = true;




    //是否需要重绘
    p["x:update"] = false;

    //子模型是否需要重绘
    p["x:update:children"] = false;

    //重绘模式 0:重绘自身  1:重绘父级  2:重绘图层
    p["x:update:mode"] = 0;


    //是否影响测量
    p["x:measure"] = true;

    //是否图层
    p["x:layer"] = false;



    //相对x坐标
    p.x = 0;

    //相对y坐标
    p.y = 0;

    //相对x偏移
    p.offsetX = 0;

    //相对y偏移
    p.offsetY = 0;

    //绝对x坐标
    p.windowX = 0;

    //绝对y坐标
    p.windowY = 0;


    //x滚动偏移
    p.scrollLeft = 0;

    //y滚动偏移
    p.scrollTop = 0;

    //滚动宽度
    p.scrollWidth = 0;

    //滚动高度
    p.scrollHeight = 0;


    //渲染宽度
    p.width = 0;

    //渲染高度
    p.height = 0;

    //右边x坐标
    p.right = 0;

    //底部y坐标
    p.bottom = 0;


    //外边距
    p.margin = [0, 0, 0, 0];

    //边框
    p.border = [0, 0, 0, 0];

    //内边距
    p.padding = [0, 0, 0, 0];







    //设置可用范围 注:传入的范围为最大可用范围 系统会自动根据此范围计算出实际占用空间
    p.setUsableRect = function (parent, x, y, width, height, addition) {


        var storage = this.ownerControl["x:storage"];


        //先测量大小
        switch (storage.stretch)
        {
            case "x":
                this.width = width;
                this.height = storage.height;
                break;

            case "y":
                this.width = storage.width;
                this.height = height;
                break;

            case "xy":
                this.width = width;
                this.height = height;
                break;

            default:
                this.width = storage.width;
                this.height = storage.height;
                break
        }

        if (storage.maxWidth > 0 && this.width > storage.maxWidth)
        {
            this.width = storage.maxWidth;
        }

        if (storage.minWidth > 0 && this.width < storage.minWidth)
        {
            this.width = storage.minWidth;
        }


        if (storage.maxHeight > 0 && this.height > storage.maxHeight)
        {
            this.height = storage.maxHeight;
        }

        if (storage.minHeight > 0 && this.height < storage.minHeight)
        {
            this.height = storage.minHeight;
        }



        //再计算位置
        switch (storage.horizontalAlign)
        {
            case "center":
                x += Math.round((width - this.width) / 2);
                break;

            case "right":
                x += width - this.width;
                break;
        }

        switch (storage.verticalAlign)
        {
            case "center":
                y += Math.round((height - this.height) / 2);
                break;

            case "bottom":
                y += height - this.height;
                break;
        }



        this.x = x;
        this.y = y;

        this.offsetX = storage.offsetX;
        this.offsetY = storage.offsetY;

        this.right = x + this.width;
        this.bottom = y + this.height;



        //处理父模型
        this.parent = parent;

        if (parent)
        {
            if (addition !== true)
            {
                this.offsetParent = parent;
                (parent.children || (parent.children = [])).push(this);
            }
            else
            {
                this.offsetParent = parent && parent.parent;
                (parent.addition || (parent.addition = [])).push(this);
            }
        }
        else
        {
            this.offsetParent = null;
        }


        this["x:measure"] = true;
        this["x:update"] = true;

        return this;
    };




    //获取滚动偏移
    function scroll() {

        var target = this,
            parent,
            x = 0,
            y = 0;

        while (parent = target.offsetParent)
        {
            x += parent.scrollLeft;
            y += parent.scrollTop;

            target = parent;
        }

        return { x: x, y: y }
    };

    //偏移坐标转目标坐标
    p.offsetToTarget = function (x, y) {

        var result = scroll.call(this);

        result.x += x - this.windowX;
        result.y += y - this.windowY;

        return result;
    };

    //偏移坐标转窗口坐标
    p.offsetToWindow = function (x, y) {

        var result = scroll.call(this);

        result.x += x;
        result.y += y;


        //如果控件自身有滚动动条且落在客户区内则加上滚动偏移
        if (this.scrollLeft && result.x < this.windowX + this.innerRect.right)
        {
            result.x += this.scrollLeft;
        }

        if (this.scrollTop && result.y < this.windowY + this.innerRect.bottom)
        {
            result.y += this.scrollTop;
        }


        return result;
    };

    //偏移坐标转控件坐标
    p.offsetToControl = function (x, y) {

        var result = scroll.call(this);

        result.x += x - this.windowX;
        result.y += y - this.windowY;


        //如果控件自身有滚动动条且落在客户区内则加上滚动偏移
        if (this.scrollLeft && result.x < this.innerRect.right)
        {
            result.x += this.scrollLeft;
        }

        if (this.scrollTop && result.y < this.innerRect.bottom)
        {
            result.y += this.scrollTop;
        }


        return result;
    };


    //目标坐标转偏移坐标
    p.targetToOffset = function (x, y) {

        var result = scroll.call(this);

        result.x = this.windowX + x - result.x;
        result.y = this.windowY + y - result.y;

        return result;
    };

    //窗口坐标转偏移坐标
    p.windowToOffset = function (x, y) {

        var result = scroll.call(this);

        result.x = x - result.x;
        result.y = y - result.y;


        //如果控件自身有滚动动条且落在客户区内则加上滚动偏移
        if (this.scrollLeft && result.x <= this.windowX + this.scrollLeft + this.innerRect.right)
        {
            result.x -= this.scrollLeft;
        }

        if (this.scrollTop && result.y <= this.windowY + this.scrollTop + this.innerRect.bottom)
        {
            result.y -= this.scrollTop;
        }


        return result;
    };

    //控件坐标转偏移坐标
    p.controlToOffset = function (x, y) {

        var result = scroll.call(this);

        result.x = this.windowX + x - result.x;
        result.y = this.windowY + y - result.y;


        //如果控件自身有滚动动条且落在客户区内则加上滚动偏移
        if (this.scrollLeft && result.x <= this.windowX + this.scrollLeft + this.innerRect.right)
        {
            result.x -= this.scrollLeft;
        }

        if (this.scrollTop && result.y <= this.windowY + this.scrollTop + this.innerRect.bottom)
        {
            result.y -= this.scrollTop;
        }


        return result;
    };




    //测量
    p.measure = function () {


        var ownerControl = this.ownerControl,

            rect = this.offsetParent && this.offsetParent.innerRect,
            windowX = rect ? rect.windowX : 0,
            windowY = rect ? rect.windowY : 0,

            x = this.x + this.offsetX,
            y = this.y + this.offsetY,
            width = this.width,
            height = this.height,


            border = this.border = ownerControl.getStyleValue("border"), //计算出数据绘制时用
            padding = this.padding = ownerControl.getStyleValue("padding"),

            outerRect = this.outerRect,
            borderRect = this.borderRect,
            innerRect = this.innerRect;


        border.border = (border[0] + border[1] + border[2] + border[3]) > 0; //是否有边框线

        outerRect.windowX = this.windowX = (outerRect.x = x) + windowX;
        outerRect.windowY = this.windowY = (outerRect.y = y) + windowY;
        outerRect.width = width;
        outerRect.height = height;

        borderRect.windowX = (borderRect.x = x + border[3]) + windowX;
        borderRect.windowY = (borderRect.y = y + border[0]) + windowY;
        borderRect.width = width - (border[3] + border[1]);
        borderRect.height = height - (border[0] + border[2]);

        innerRect.windowX = (innerRect.x = x + (innerRect.spaceX = border[3] + padding[3])) + windowX;
        innerRect.windowY = (innerRect.y = y + (innerRect.spaceY = border[0] + padding[0])) + windowY;
        innerRect.width = borderRect.width - (padding[3] + padding[1]);
        innerRect.height = borderRect.height - (padding[0] + padding[2]);


        this.borderRadius = border[0] > 0 && ownerControl.getStyleValue("borderRadius"); //圆角边框不能隐藏边线及不支持粗细不同的边线

        this.renderItems = null;
        this["x:measure"] = false;
        this["x:update:mode"] = 0;

        return this;
    };



    //使当前盒模型无效
    p.invalidate = function () {

        if (!this["x:update"])
        {
            this["x:update"] = true;

            var parent = this.parent,
                update = this["x:update:mode"];


            while (parent)
            {
                if (!parent["x:update"])
                {
                    if (update == 0) //如果重绘模式为重绘自身
                    {
                        parent["x:update:children"] = true;
                    }
                    else
                    {
                        parent["x:update"] = true;

                        if (update == 1)
                        {
                            update = 0;
                        }
                    }
                }

                parent = !parent["x:layer"] && parent.parent;
            }
        }

        return this;
    };



    //获取当前可渲染的子项
    function getRenderItems(clipToBounds) {

        var result = this.renderItems;

        if (!result)
        {
            result = this.renderItems = [];


            var ownerControl = this.ownerControl,
                clipToBounds = ownerControl["x:storage"].clipToBounds,

                rect = this.innerRect,

                x = this.scrollLeft,
                y = this.scrollTop,
                right = x + rect.width,
                bottom = y + rect.height,

                i = 0,
                length = this.children.length;


            while (i < length)
            {
                var box = this.children[i++];

                if (box.visible &&
                    box.right >= x &&
                    box.bottom >= y &&
                    box.ownerControl["x:storage"].visibility == "visible" &&
                    (!clipToBounds || (box.x < right && box.y < bottom)))
                {
                    result.push(box);
                }
            }
        }

        return result;
    };


    //更新
    p.update = function (context) {

        if (this["x:update"]) //如果需要更新
        {
            this.render(context);
        }
        else if (this["x:update:children"]) //如果子控件需要更新
        {
            this["fn:render:children"](context, "update");
            this["x:update:children"] = false;
        }

        return this;
    };


    //渲染
    p.render = function (context) {


        var ownerControl = this.ownerControl;



        //文字测量
        if (ownerControl["x:storage"].text != null)
        {
            ownerControl["fn:measure:text"]();
        }


        //测量
        if (this["x:measure"])
        {
            if (ownerControl["fn:before:measure"])
            {
                ownerControl["fn:before:measure"](this);
            }

            this.measure();

            //调用控件的测量方法
            if (ownerControl.measure)
            {
                ownerControl.measure(this);
            }
        }


        //设置渲染环境
        context.boxModel = this;

        //绘制背景
        if (!ownerControl.paintBackground(context) || context.globalAlpha < 1)
        {
            this["x:update:mode"] = 1;
        }

        //绘制子项
        if (this.children)
        {
            this["fn:render:children"](context, "render");
        }

        //设置渲染环境
        context.boxModel = this;

        //绘制内框
        ownerControl.paint(context);

        //绘制外框
        ownerControl.paintBorder(context);

        //绘制装饰
        this["x:decorates"] = false;

        var decorates = ownerControl.getStyleValue("decorates");
        if (decorates && decorates.length > 0)
        {
            this["fn:paint:decorates"](context, decorates);
            this["x:decorates"] = true;
        }


        //修改状态
        this["x:update"] = false;

        return this;
    };


    //渲染或更新子项
    p["fn:render:children"] = function (context, fn) {

        var ownerControl = this.ownerControl,

            items = getRenderItems.call(this),
            i = 0,
            length = items.length;


        context.save();

        if (this.scrollLeft || this.scrollTop)
        {
            context.translate(-this.scrollLeft, -this.scrollTop);
        }

        if (ownerControl["x:storage"].clipToBounds)
        {
            var rect = this.innerRect;

            context.beginPath();
            context.rect(rect.x + this.scrollLeft, rect.y + this.scrollTop, rect.width, rect.height);
            context.clip();
        }

        while (i < length)
        {
            items[i++][fn](context);
        }

        context.restore();


        //绘制附加内容
        if (this.addition)
        {
            i = 0;
            length = this.addition.length;

            while (i < length)
            {
                this.addition[i++][fn](context);
            }
        }
    };

    //绘制装饰
    p["fn:paint:decorates"] = function (context, decorates) {

        var i = 0,
            length = decorates.length;

        while (i < length)
        {
            var item = decorates[i];

            //未处理
            if (!(item instanceof $.Shape))
            {
                item = decorates[i] = new $.JsonSerializeReader().readObject(item);
            }

            //重绘模式
            if (item.updateMode > this["x:update:mode"])
            {
                this["x:update:mode"] = item.updateMode;
            }

            item.paint(context);
            i++;
        }
    };



})(flyingon);



(function ($) {



﻿/*
形状基类

*/
$.class("Shape", $.SerializableObject, function ($) {



    //填充色
    this.defineProperty("fillStyle", null);

    //边框色
    this.defineProperty("strokeStyle", $.colors["control-border"]);

    //线宽
    this.defineProperty("lineWidth", 1);



    //固定宽度
    this.defineProperty("width", 0);

    //固定高度
    this.defineProperty("height", 0);

    //x轴缩放比例
    this.defineProperty("scaleX", 1);

    //y轴缩放比例
    this.defineProperty("scaleY", 1);

    //偏移距离 上->右->底->左
    this.defineProperty("offset", [0, 0, 0, 0]);

    //是否逆时针绘制
    this.defineProperty("anticlockwise", false);

    //重绘模式 0:重绘自身  1:重绘父级  2:重绘图层
    this.defineProperty("updateMode", 0);

    //子形状
    this.defineProperty("children", null);




    function children(context, storage, borderRect) {

        var i = 0,
            children = storage.children,
            length = children.length,
            offset;

        while (i < length)
        {
            var item = children[i++];

            storage = item["x:storage"];
            offset = storage.offset;

            item.buildPath(context,
                borderRect.windowX + offset[3],
                borderRect.windowY + offset[0],
                storage.width <= 0 ? borderRect.width * storage.scaleX - offset[3] - offset[1] : storage.width,
                storage.height <= 0 ? borderRect.height * storage.scaleY - offset[0] - offset[2] : storage.height);

            if (storage.children)
            {
                children(context, storage, borderRect);
            }
        }
    };


    this.paint = function (context) {


        var borderRect = context.boxModel.borderRect,
            storage = this["x:storage"],
            offset = storage.offset;


        context.beginPath();

        this.buildPath(context,
            borderRect.windowX + offset[3],
            borderRect.windowY + offset[0],
            storage.width <= 0 ? borderRect.width * storage.scaleX - offset[3] - offset[1] : storage.width,
            storage.height <= 0 ? borderRect.height * storage.scaleY - offset[0] - offset[2] : storage.height);


        if (storage.children)
        {
            children(context, storage, borderRect);
        }


        if (storage.fillStyle)
        {
            context.set_fillStyle(storage.fillStyle);
            context.fill();
        }

        if (storage.strokeStyle)
        {
            context.lineWidth = storage.lineWidth;
            context.set_strokeStyle(storage.strokeStyle);
            context.stroke();
        }
    };

    this.buildPath = function (context, x, y, width, height) {

    };


});





﻿/*
线条

*/
$.class("Line", $.Shape, function ($) {


    this.buildPath = function (context, x, y, width, height) {

        context.moveTo(x, y);
        context.lineTo(x + width, y + height);
    };


});





﻿/*
线条

*/
$.class("DashLine", $.Shape, function ($) {


    //虚线规则
    this.defineProperty("dashArray", [3, 3]);



    this.buildPath = function (context, x, y, width, height) {

        context.dashLine(x, y, x + width, y + height, this.dashArray);
    };


});





﻿/*
矩形

*/
$.class("Rectangle", $.Shape, function ($) {



    this.buildPath = function (context, x, y, width, height) {

        context.rect(x, y, width, height, this["x:storage"].anticlockwise);
    };


});





﻿/*
矩形

*/
$.class("RoundRectangle", $.Shape, function ($) {



    this.defineProperty("radius", 5);



    this.buildPath = function (context, x, y, width, height) {

        var storage = this["x:storage"];
        context.roundRect(x, y, width, height, storage.radius, storage.anticlockwise);
    };


});





﻿/*
椭圆

*/
$.class("Ellipse", $.Shape, function ($) {





    this.buildPath = function (context, x, y, width, height) {

        context.ellipse(x + width / 2, y + height / 2, width, height, this["x:storage"].anticlockwise);
    };


});





﻿/*
椭圆

*/
$.class("Polygon", $.Shape, function ($) {



    this.defineProperty("sides", 6);

    this.defineProperty("radius", 20);

    this.defineProperty("angle", 0);



    this.buildPath = function (context, x, y, width, height) {

        var storage = this["x:storage"];
        context.polygon(storage.sides, x + width / 2, y + height / 2, storage.radius, storage.angle, storage.anticlockwise);
    };


});





﻿/*
椭圆

*/
$.class("StarPolygon", $.Shape, function ($) {



    this.defineProperty("vertexes", 5);

    this.defineProperty("radius1", 20);

    this.defineProperty("radius2", 10);

    this.defineProperty("angle", 0);



    this.buildPath = function (context, x, y, width, height) {

        var storage = this["x:storage"];
        context.starPolygon(storage.vertexes, x + width / 2, y + height / 2, storage.radius1, storage.radius2, storage.angle, storage.anticlockwise);
    };


});





﻿/// <reference path="../Base/Core.js" />


//控件基类
$.class("Control", $.SerializableObject, function ($) {




    this.create = function () {


        //盒模型
        this["x:boxModel"] = new $.BoxModel(this);

    };






    //父控件
    this.defineProperty("parent", null, {

        getter: function () {

            return this["x:parent"];
        },

        setter: function (value) {

            var oldValue = this["x:parent"];

            if (value != oldValue)
            {
                if (oldValue)
                {
                    oldValue["x:children"].remove(this);
                }

                if (value)
                {
                    value["x:children"].append(this);
                }
            }
        }
    });


    //触发父控件变更
    this["fn:parent"] = function (parent) {

        var box = this["x:boxModel"];

        if (box.parent)
        {
            box.parent["x:measure"] = true;
        }
        else
        {
            box["x:measure"] = true;
        }

        if (parent)
        {
            parent["x:boxModel"]["x:measure"] = true;
        }


        var oldValue = this["x:parent"];

        this["x:parent"] = parent;

        this.dispatchEvent({

            type: "change",
            name: "parent",
            value: parent,
            oldValue: this["x:parent"]
        });
    };






    //主窗口
    this.defineProperty("mainWindow", undefined, {

        readOnly: true,
        getter: function () {

            var result = this.ownerWindow;
            return result && (result.mainWindow || result);
        }
    });

    //所属窗口
    this.defineProperty("ownerWindow", undefined, {

        readOnly: true,
        getter: function () {

            var parent = this["x:parent"];
            return parent && (parent["x:ownerWindow"] || (parent["x:ownerWindow"] = parent.ownerWindow));
        }
    });

    //所属图层
    this.defineProperty("ownerLayer", undefined, {

        readOnly: true,
        getter: function () {

            var parent = this["x:parent"];
            return parent && (parent["x:ownerLayer"] || (parent["x:ownerLayer"] = parent.ownerLayer));
        }
    });


    //当前控件是否指定控件的父控件
    this.isParent = function (control) {

        if (!control || control == this)
        {
            return false;
        }

        var target = control["x:parent"];

        while (target)
        {
            if (target == this)
            {
                return true;
            }

            target = target["x:parent"];
        }

        return false;
    };

    //指定控件是否当前控件的父控件
    this.isParentTo = function (control) {

        return control ? control.isParent(this) : false;
    };

    //获取当前控件的上级控件列表(按从上到下的顺序显示)
    this.getParentList = function () {

        var result = [],
            parent = this["x:parent"];

        while (parent)
        {
            result.unshift(parent);
            parent = parent["x:parent"];
        }

        return result;
    };

    //从父控件中移除自身
    this.remove = function () {

        var parent = this["x:parent"];

        if (parent)
        {
            parent["x:children"].remove(this);
        }

        return this;
    };








    this["fn:define:getter"] = function (name, options) {

        var body;

        if (options.style) // 样式属性
        {
            body = "return this.getStyleValue('" + name + "');";
        }
        else
        {
            body = "return this['x:storage']['" + name + "'];"
        }

        return new Function(body);
    };

    this["fn:define:setter"] = function (name, attributes) {


        var body = "var storage = this['x:storage'], cache, name = '" + name + "';\n"

            + this["fn:define:setter:initialize"]


            + (attributes.style ? "var oldValue = this.getStyleValue(name);" : "var oldValue = storage[name];")

            + (attributes.valueChangingCode ? attributes.valueChangingCode + "\n" : "") //自定义值变更代码


            + "if (oldValue !== value)\n"
            + "{\n"

            + this["fn:define:setter:change"]

            + "storage[name] = value;\n";


        //布局 可能会影响父控件布局
        if (attributes.layout)
        {
            body += "if (cache = this['x:boxModel'].parent)\n"
                + "{\n"
                + "cache['x:measure'] = true;\n"
                + "cache.ownerControl.invalidate();\n"
                + "}\n"
                + "else\n"
                + "{\n"
                + "this.invalidate();\n"
                + "}\n";

            attributes.invalidate = false;
        }


        //测量 可能会影响空间占用及子控件排列
        if (attributes.measure)
        {
            body += "this['x:boxModel']['x:measure'] = true;\nthis.invalidate();\n";
        }
        else if (attributes.invalidate) //标记区域无效 需要重新绘制
        {
            body += "this.invalidate();\n";
        }


        if (attributes.valueChangedCode) //自定义值变更代码
        {
            body += attributes.valueChangedCode + "\n";
        }


        body += this["fn:define:setter:bindingTo"] //处理绑定源

            //处理绑定目标
            + "if ((cache = this['x:bindings']) && (cache = cache[name]) && cache.setter !== null && cache['x:binding'] != true)\n"
            + "{\n"
            + "if (cache.setter === undefined)\n"
            + "{\n"
            + "cache.source[cache.expression] = this[name]\n"
            + "}\n"
            + "else\n"
            + "{\n"
            + "cache.setter.call(cache.source, this[name]);\n"
            + "}\n"
            + "}\n"


            + "}\n"

            + "return this;\n";


        return new Function("value", body);
    };




    //自定义样式
    this.defineProperty("styleKey", null, "invalidate");

    /*
    预定义状态组:
    common-states:  普通状态组(enter-animate disabled pressed)
    check-states:   选中状态组(checked unchecked unkown)
    focus-states:   焦点状态组(focused leaver-animate)
    hover-states:   鼠标悬停状态组(hover leaver-animate)
    */
    this["x:states"] = ["common-states", "focus-states", "hover-states"];

    //自定义状态组
    this.defineStates = function (states) {

        this["x:states"] = ["common-states"].concat(states).concat(["focus-states", "hover-states"]);
    };

    this.setDefaultValue("common-states", null);

    this.setDefaultValue("focus-states", null);

    this.setDefaultValue("hover-states", null);

    //切换状态
    this.switchState = function (statesName, stateName) {

        if (statesName && stateName)
        {
            this["x:storage"][statesName] = (stateName == "enter-animate" || stateName == "leave-animate") ? null : stateName;

            //记录最后变更的状态组以作为状态变更动画依据
            this["x:statesName"] = statesName;
            this["x:stateName"] = stateName;

            this.invalidate();
        }
    };


    //复制样式(复制基类的样式至子类以便加速访问)
    function copyStyle(styles, style, superClass) {

        var className = superClass.className,
            parent = styles[className] || (styles[className] = {});

        if (!parent["x:cache"])
        {
            copyStyle(styles, parent, superClass.superClass);
        }

        $["fn:simple:copy"](parent, style, true);


        style["x:cache"] = true;
    };

    function getStyleValue(style, name) {

        var storage = this["x:storage"],
            states = this["x:states"],
            i = states.length - 1,
            statesName,
            stateName,
            result;

        while (i >= 0)
        {
            if ((statesName = states[i--]) && (stateName = storage[statesName]))
            {
                if ((result = (style.states && style.states[statesName])) &&
                    (result = (result[stateName])) &&
                    (result = result[name]) !== undefined)
                {
                    return result;
                }
            }
        }


        return style[name];
    };

    //获取样式值
    this.getStyleValue = function (name) {


        var storage = this["x:storage"],
            result;


        if ((result = (storage.hasOwnProperty(name) && storage[name])) != false)
        {
            return result;
        }


        var styles = $.styles,
            styleKey,
            style;

        if ((styleKey = storage.styleKey) &&
            (style = (styles[styleKey])) &&
            (result = getStyleValue.call(this, style, name)) != undefined)
        {
            return result;
        }


        styleKey = this["x:class"].className;
        style = (styles[styleKey] || (styles[styleKey] = {}));

        if (!style["x:cache"])
        {
            copyStyle(styles, style, this["x:class"].superClass);
        }


        if ((result = getStyleValue.call(this, style, name)) != undefined)
        {
            return result;
        }

        return storage[name] || null;
    };




    /***************BoxModel相关属性***************/

    //盒式模型
    this.defineProperty("boxModel", undefined, {

        readOnly: true,
        getter: function () {

            return this["x:boxModel"];
        }
    });



    //
    this.defineProperties(["offsetX", "offsetY"], 0, "measure|layout");


    //
    this.defineProperties(["left", "top"], 0, "measure|layout", "this.dispatchEvent(new flyingon.PropertyChangedEvent('locationchanged', this, name, value, oldValue));");


    //
    this.defineProperties(["width", "height"], 0, "measure|layout", "this.dispatchEvent(new flyingon.PropertyChangedEvent('resize', this, name, value, oldValue));");




    //是否显示 visible:显示 hidden:不显示但保留占位 collapsed:不显示也不占位 见枚举flyingon.Visibility对象
    this.defineProperty("visibility", "visible", "layout");

    //
    this.defineProperties(["minWidth", "maxWidth", "minHeight", "maxHeight"], 0, "measure|layout");



    //拉伸方式 n:不拉伸 x:横向拉伸 y:纵向拉伸 xy:全部拉伸 见枚举flyingon.Stretch对象
    this.defineProperty("stretch", "xy", "measure|layout");

    //水平对齐 left center right 见枚举flyingon.HorizontalAlign对象
    this.defineProperty("horizontalAlign", "left", "measure|layout");

    //垂直对齐 top center bottom 见枚举flyingon.VerticalAlign对象
    this.defineProperty("verticalAlign", "top", "measure|layout");

    //停靠方式 left top right bottom fill 见枚举flyingon.Dock对象
    this.defineProperty("dock", "left", "measure|layout");

    //表格布局时行及列索引 
    this.defineProperties(["rowIndex", "columnIndex"], null, "measure|layout");



    //
    this.defineProperty("outerRect", undefined, {

        readOnly: true,
        getter: function () {

            return this["x:boxModel"]["outerRect"];
        }
    });

    //
    this.defineProperty("innerRect", undefined, {

        readOnly: true,
        getter: function () {

            return this["x:boxModel"]["innerRect"];
        }
    });



    /*********************************************/


    /***************BoxModel及样式相关属性***************/

    this.defineProperty("margin", [0, 0, 0, 0], "measure|style");

    this.defineProperty("border", [0, 0, 0, 0], "measure|style");

    this.defineProperty("padding", [0, 0, 0, 0], "measure|style");

    this.defineProperty("borderRadius", 0, "measure|style");

    /*********************************************/


    /***************样式相关属性***************/

    //
    this.defineProperty("background", null, "style");

    //
    this.defineProperty("foreground", "black", "style");

    //
    this.defineProperty("borderColor", "rgb(100,100,100)", "style");

    //透明度
    this.defineProperty("opacity", 1, "style");

    //变换器
    this.defineProperty("transform", null, "measure|style");

    //字体
    this.defineProperty("font", "normal", {

        attributes: "style",

        getter: function () {

            return $.fonts[this.getStyleValue("font") || "normal"] || $.fonts["normal"];
        }

    }, "this['x:textMetrics'] = null;");




    //装饰
    this.defineProperty("decorates", null, "style");




    this.defineProperty("text", null, {

        attributes: "measure",
        valueChangingCode: "value += '';",
        valueChangedCode: "this['x:textMetrics'] = null;"
    });

    this.defineProperty("textHorizontalAlign", "left", "measure");

    this.defineProperty("textVerticalAlign", "center", "measure");




    this.defineProperty("cursor", null);

    this["fn:cursor"] = function (event) {

        var cursor = this.getStyleValue("cursor") || "default";
        return $.cursors[cursor] || cursor;
    };



    /*********************************************/



    //是否只绘制有效范围
    this.defineProperty("clipToBounds", true, "measure");



    //快捷键(按下alt+accesskey)
    this.defineProperty("accesskey", null);


    //是否可用
    this.defineProperty("enabled", true, {

        valueChangedCode: "this.switchState('common-states', value ? 'disabled' : 'enter-animate');"
    });


    //是否可具有焦点
    this.defineProperty("focusable", true);


    //是否为焦点控件
    this.defineProperty("focused", undefined, {

        readOnly: true,
        getter: function () {

            return this.ownerWindow && this.ownerWindow["x:focusControl"] == this;
        }
    });

    //是否为焦点控件或包含焦点控件
    this.defineProperty("containsFocused", undefined, {

        readOnly: true,
        getter: function () {

            var focusControl = this.ownerWindow && this.ownerWindow["x:focusControl"];
            return focusControl && (focusControl == this || this.isParent(focusControl));
        }
    });




    //执行验证
    this.validate = function () {

        return this.dispatchEvent("validate");
    };

    this["fn:focus"] = function (event) {

        return this.focus();
    };

    this["fn:blur"] = function () {

        return this.blur();
    };


    //设置当前控件为焦点控件
    //注:需此控件focusable为true时才可设为焦点控件
    this.focus = function () {

        if (this["x:storage"].focusable)
        {
            var ownerWindow = this.ownerWindow;

            if (ownerWindow && ownerWindow["x:focusControl"] != this)
            {
                ownerWindow["x:focusControl"] = this;

                this.dispatchEvent("focus");
                this.switchState("focus-states", "focused");
            }

            return true;
        }

        return false;
    };

    //此控件失去焦点
    this.blur = function () {

        var ownerWindow = this.ownerWindow;

        if (ownerWindow && ownerWindow["x:focusControl"] == this)
        {
            ownerWindow["x:focusControl"] = null;

            this.dispatchEvent("blur");
            this.switchState("focus-states", "leave-animate");

            return true;
        }

        return false;
    };






    ////数据绑定主体
    //this.dataContext = null;

    //binding = { source: object, expression: "name" || function () {}, formatter: function () {}, setter: function() {} }
    this.setBinding = function (propertyName, binding) {

        if (propertyName && binding)
        {
            var source = binding.source,
                expression = binding.expression;

            if (source && expression)
            {
                var bindings = source["x:bindings:source"] || (source["x:bindings:source"] = {}),
                    id = this.id;


                //执行绑定
                binding["x:binding"] = true;
                this[propertyName] = typeof expression == "function" ? expression.call(source) : source[expression];
                binding["x:binding"] = false;


                //设置绑定
                if (typeof expression == "function")
                {
                    var properties = binding.properties = expression.toString().match(/this\.[\w\$]+/g);

                    for (var i = 0; i < properties.length; i++)
                    {
                        expression = properties[i] = properties[i++].substring(5);
                        (bindings[expression] || (bindings[expression] = {}))[id] = propertyName;
                    }

                    if (binding.setter === undefined)
                    {
                        binding.setter = null;
                    }
                }
                else //字段
                {
                    (bindings[expression] || (bindings[expression] = {}))[id] = propertyName;
                }

                (this["x:bindings"] || (this["x:bindings"] = {}))[propertyName] = binding;
            }
        }
    };

    this.removeBinding = function (propertyName) {

        var bindings = this["x:bindings"];

        if (bindings && bindings.hasOwnProperty(propertyName))
        {
            var target_binding = bindings[propertyName],
                source_binding = target_binding.source["x:bindings:source"],
                properties = target_binding.properties,
                id = this.id;

            if (properties)
            {
                for (var i = 0; i < properties.length; i++)
                {
                    delete source_binding[properties[i]][id];
                }
            }
            else
            {
                delete source_binding[target_binding.expression][id];
            }

            delete bindings[propertyName];
        }
    };



    //显示弹出控件
    this.showPopup = function (x, y) {

        var ownerWindow = this.ownerWindow;

        if (ownerWindow)
        {
            var layer = ownerWindow["x:popupLayer"];

            if (!layer)
            {
                layer = ownerWindow["x:popupLayer"] = ownerWindow.appendLayer(null, 9997);
                layer.layout = "absolute";
                layer.paintBackground = function () { };
            }


            if (x != null)
            {
                this["x:storage"].left = x;
            }

            if (y != null)
            {
                this["x:storage"].top = y;
            }


            layer["x:children"].append(this);
            layer.invalidate();
        }
    };

    //关闭弹出控件
    this.closePopup = function () {

        var ownerWindow = this.ownerWindow;
        if (ownerWindow)
        {
            ownerWindow.removeLayer(ownerWindow["x:popupLayer"]);
        }
    };






    //是否可以拖动
    this.defineProperty("draggable", false);

    //是否可以接受拖放
    this.defineProperty("droppable", false);




    //定义鼠标事件
    this.defineEvents(["mousedown", "mousemove", "click", "dblclick", "mouseup", "mouseover", "mouseout", "mousewheel"]);

    //定义拖拉事件
    this.defineEvents(["dragstart", "drag", "dragend", "dragenter", "dragover", "dragleave", "drop"]);

    //定义键盘事件
    this.defineEvents(["keydown", "keypress", "keyup"]);

    //定义其它事件
    this.defineEvents(["parentchanged", "focus", "blur", "locationchanged", "resize", "validate"]);



    //捕获鼠标
    this.setCapture = function () {

        var ownerWindow = this.ownerWindow;
        if (ownerWindow)
        {
            ownerWindow["x:captureControl"] = this;
        }
    };

    //释放鼠标
    this.releaseCapture = function () {

        var ownerWindow = this.ownerWindow;
        if (ownerWindow)
        {
            ownerWindow["x:captureControl"] = null;
        }
    };




    /**********************************坐标说明**********************************/

    //offsetX, offsetY:  偏移坐标 相对目标窗口左上角的显示偏移距离(不受滚动条影响)
    //targetX, targetY:  目标坐标 相对目标控件左上角的物理偏移距离(不受滚动条影响)
    //windowX, windowY:  窗口坐标 相对目标窗口左上角的渲染偏移距离(受滚动条影响)
    //targetX, targetY:控件坐标 相对目标控件左上角的渲染偏移距离(受滚动条影响)

    /****************************************************************************/


    //偏移坐标转窗口坐标
    this.offsetToWindow = function (x, y) {

        return this["x:boxModel"].offsetToWindow(x, y);
    };

    //偏移坐标转目标坐标
    this.offsetToTarget = function (x, y) {

        return this["x:boxModel"].offsetToTarget(x, y);
    };

    //偏移坐标转控件坐标
    this.offsetToControl = function (x, y) {

        return this["x:boxModel"].offsetToControl(x, y);
    };


    //目标坐标转偏移坐标
    this.targetToOffset = function (x, y) {

        return this["x:boxModel"].targetToOffset(x, y);
    };

    //窗口坐标转偏移坐标
    this.windowToOffset = function (x, y) {

        return this["x:boxModel"].windowToOffset(x, y);
    };

    //控件坐标转偏移坐标
    this.controlToOffset = function (x, y) {

        return this["x:boxModel"].controlToOffset(x, y);
    };




    this.hitTest = function (x, y) {

        var rect = this["x:boxModel"].outerRect;
        return x >= rect.x && y >= rect.y && x <= rect.right && y <= rect.bottom;
    };







    //使区域无效
    this.invalidate = function () {

        var layer = this.ownerLayer;

        this["x:boxModel"].invalidate();

        if (layer)
        {
            layer.registryUpdate();
        }
    };


    //更新绘制控件
    this.update = function () {

        var layer = this.ownerLayer;

        this["x:boxModel"].invalidate();

        if (layer)
        {
            layer.unregistryUpdate();
            layer["x:boxModel"].render(layer.context);
        }
    };





    //测量文字方法
    this["fn:measure:text"] = function () {

        if (!this["x:textMetrics"])
        {
            var storage = this["x:storage"];

            this["x:textMetrics"] = new $.TextMetrics(this);
            this["x:textMetrics"].measureText(this.font, storage.text, storage.multiline);
        }
    };




    //绘制边框
    this.paintBorder = function (context) {

        var boxModel = context.boxModel,
            border = boxModel.border;

        if (border && border.border)
        {
            var color = this.getStyleValue("borderColor");

            if (boxModel.borderRadius > 0)
            {
                var rect = boxModel.borderRect,
                    lineWidth = border[0],
                    offset = lineWidth / 2;

                context.lineWidth = lineWidth;
                context.set_strokeStyle(color);
                context.strokeRoundRect(rect.windowX + offset, rect.windowY + offset, rect.width - lineWidth, rect.height - lineWidth, boxModel.borderRadius);
            }
            else
            {
                var rect = boxModel.outerRect;

                context.set_fillStyle(color);
                context.drawBorder(rect.windowX, rect.windowY, rect.width, rect.height, border);
            }
        }

    };


    //绘制背景
    this.paintBackground = function (context) {

        var boxModel = context.boxModel,
            background = this.background;

        if (background)
        {
            var rect = boxModel.borderRect;

            context.beginPath();
            context.set_fillStyle(background);

            if (boxModel.borderRadius > 0) //圆角矩形
            {
                context.roundRect(rect.windowX, rect.windowY, rect.width, rect.height, boxModel.borderRadius);
            }
            else
            {
                context.rect(rect.windowX, rect.windowY, rect.width, rect.height);
            }

            context.fill();

            return true;
        }
    };


    //绘制内框
    this.paint = function (context) {

        this.paintText(context);
    };


    //绘制文字
    this.paintText = function (context) {

        var textMetrics = this["x:textMetrics"];

        if (textMetrics)
        {
            var boxModel = context.boxModel,
                rect = boxModel.innerRect,
                font = textMetrics.font;


            context.save();


            //区域剪切
            var cliped = this["x:storage"].clipToBounds;
            if (cliped)
            {
                context.beginPath();
                context.rect(rect.windowX, rect.windowY, rect.width, rect.height);
                context.clip();
            }


            if (this.paintTextBackground)
            {
                this.paintTextBackground(context);
            }


            context.set_fillStyle(this.foreground);
            context.set_font(font);


            var x = rect.windowX - boxModel.scrollLeft,
                y = rect.windowY + textMetrics[0].height,

                i = 0,
                length = textMetrics.length;


            while (i < length)
            {
                var line = textMetrics[i++],
                    j = 0,
                    count = line.length;

                while (j < count)
                {
                    var snippet = line[j++];
                    context.fillText(snippet.text, x, y);

                    x += snippet.width;
                }
            }


            context.restore();
            return true;
        }
    };




    this.serialize = function (writer) {

        var bindings = this["x:bindings"];

        if (bindings && bindings["x:serialize"])
        {
            writer.write("d:bindings", bindings);
        }
    };


});




﻿$.class("ScrollEvent", $.Event, function ($) {


});


//滚动条控件
$.class("ScrollBase", $.Control, function ($) {



    
    var timer,      //定时变更定时器
        dragger;    //拖拉者



    this.create = function () {

        this.addEventListener("mousedown", this.handleMouseDown);
        this.addEventListener("mousemove", this.handleMouseMove);
        this.addEventListener("mouseup", this.handleMouseUp);
    };



    //是否竖直滚动条
    this.defineProperty("isVertical", false, {

        attributes: "measure|layout",
        valueChangedCode: "var width = storage.width;\nstorage.width = storage.height;\nstorage.height = width;"
    });



    this.setDefaultValue("focusable", false);

    this.setDefaultValue("width", 200);

    this.setDefaultValue("height", 16);



    //当前值
    this.defineProperty("value", 0, "measure");

    //最大值
    this.defineProperty("maxValue", 100, "measure");

    //最小值
    this.defineProperty("minValue", 0, "measure");

    //显示值大小
    this.defineProperty("viewportSize", 10, "measure");

    //最大步进
    this.defineProperty("maxStep", 10);

    //最小步进
    this.defineProperty("minStep", 1);



    //滑块背景
    this.defineProperty("sliderBackground", undefined, "style");

    //滑块图片
    this.defineProperty("slider", undefined, "style");



    this.defineEvent("scroll");



    this.supportPartialUpdate = function () {

        return true;
    };



    this.handleMouseDown = function (event) {


        if (timer)
        {
            clearTimeout(timer);
        }

        var storage = this["x:storage"],
            step,
            limit,
            type = this.getScrollTypeAt(event.windowX, event.windowY);


        switch (type)
        {
            case "decreaseMin":
                step = -storage.minStep;
                break;

            case "increaseMin":
                step = storage.minStep;
                break;

            case "decreaseMax":
                step = -storage.maxStep;
                limit = this.getValueAt(event.controlX, event.controlY, false);
                break;

            case "increaseMax":
                step = storage.maxStep;
                limit = this.getValueAt(event.controlX, event.controlY, true);
                break;

            default: //slider
                this.ownerWindow["x:captureControl"] = this;
                dragger = { x: event.offsetX, y: event.offsetY, value: storage.value };
                return;
        }


        if (this.changeValue(step, limit))
        {
            this.changeValueTime(step, limit);
        }
    };


    this.handleMouseMove = function (event) {

        if (dragger)
        {
            var storage = this["x:storage"],
                offset = storage.isVertical ? (event.offsetY - dragger.y) : (event.offsetX - dragger.x),
                value = Math.round(offset * (storage.maxValue - storage.minValue) / this["x:boxModel"].length);

            if (value)
            {
                this.changeValue(0, dragger.value + value);
            }
        }
    };

    this.handleMouseUp = function (event) {

        if (timer)
        {
            clearTimeout(timer);
            timer = null;
        }

        this.ownerWindow["x:captureControl"] = null;
        dragger = null;
    };


    //变更值
    this.changeValue = function (step, limit) {

        var storage = this["x:storage"],
            value = storage.value + step,
            maxValue = storage.maxValue - storage.viewportSize;


        if (limit == null)
        {
            limit = step < 0 ? storage.minValue : maxValue;
        }
        else if (limit < storage.minValue)
        {
            limit = storage.minValue;
        }
        else if (limit > maxValue)
        {
            limit = maxValue;
        }


        if (!step || (step > 0 && value > limit) || (step < 0 && value < limit))
        {
            value = limit;
        }


        step = value - storage.value;

        if (step == 0)
        {
            return false;
        }


        storage.value = value;


        var event = new $.ScrollEvent("scroll", this);

        if (storage.isVertical)
        {
            event.verticalScrollBar = this;
            event.changedX = 0;
            event.changedY = step;
        }
        else
        {
            event.horizontalScrollBar = this;
            event.changedX = step;
            event.changedY = 0;
        }

        this.dispatchEvent(event);


        this["x:boxModel"]["x:measure"] = true;
        this.invalidate();

        return value != limit;
    };


    //定时变更值
    this.changeValueTime = function (step, limit) {

        var self = this;

        timer = setTimeout(function () {

            clearTimeout(timer);

            if (timer && self.changeValue(step, limit))
            {
                timer = setTimeout(fn, 200);
            }

        }, 200);
    };


    //根据位置获取当前值
    this.getValueAt = function (x, y, exclueSlider) {


        var storage = this["x:storage"],
            boxModel = this["x:boxModel"],

            value = storage.isVertical ? y : x;


        if (exclueSlider)
        {
            value -= boxModel.slider;
        }

        if (boxModel.thickness)
        {
            value -= boxModel.thickness;
        }

        return storage.minValue + Math.round(value * storage.maxValue / boxModel.length);
    };


});








﻿
//滚动条控件
$.class("ScrollBar", $.ScrollBase, function ($) {


    this.setDefaultValue("maxStep", 200);

    this.setDefaultValue("minStep", 20);


    //箭头背景
    this.defineProperty("arrowBackground", "black", "style");

    //向左箭头图片
    this.defineProperty("arrowLeft", null, "style");

    //向上箭头图片
    this.defineProperty("arrowUp", null, "style");

    //向右箭头图片
    this.defineProperty("arrowRight", null, "style");

    //向下箭头图片
    this.defineProperty("arrowDown", null, "style");





    this.defineEvent("scroll");





    //根据坐标获取当前滚动类型
    this.getScrollTypeAt = function (x, y) {

        var segments = this["x:boxModel"].segments,
            value = this["x:storage"].isVertical ? y : x;
    

        if (value <= segments[0])
        {
            return "decreaseMin";
        }

        if (value >= segments[3])
        {
            return "increaseMin";
        }

        if (value < segments[1])
        {
            return "decreaseMax";
        }

        if (value > segments[2])
        {
            return "increaseMax";
        }

        return "slider";
    };


    function computeSliderLenth(storage, length) {

        if (length <= 8)
        {
            return 0;
        }

        var result = Math.round(length * storage.viewportSize / (storage.maxValue - storage.minValue));
        return result <= 8 ? 8 : result;
    };

    function computeSliderStart(storage, length, slider) {

        if (length <= 0)
        {
            return 0;
        }

        if (storage.value >= storage.maxValue - storage.viewportSize)
        {
            return length - slider;
        }

        return Math.round((storage.value - storage.minValue) * length / storage.maxValue, 0);
    };



    this.measure = function (boxModel) {

        var storage = this["x:storage"],
            x = boxModel.x,
            y = boxModel.y,
            width = boxModel.width,
            height = boxModel.height;


        if (storage.isVertical)
        {
            var thickness = boxModel.thickness = width;
            var length = boxModel.length = height - (thickness << 1);
            var slider = boxModel.slider = computeSliderLenth(storage, length);

            var rect1 = boxModel.arrow1Rect = [x, y, thickness, thickness];
            var rect2 = boxModel.sliderRect = [x, y + thickness + computeSliderStart(storage, length, slider), thickness, slider];
            var rect3 = boxModel.arrow2Rect = [x, y + Math.max(height - thickness, 0), thickness, thickness];

            boxModel.segments = [rect1[1] + thickness, rect2[1], rect2[1] + slider, rect3[1]]; //位置段坐标
        }
        else
        {
            var thickness = boxModel.thickness = height;
            var length = boxModel.length = width - (thickness << 1);
            var slider = boxModel.slider = computeSliderLenth(storage, length);

            var rect1 = boxModel.arrow1Rect = [x, y, thickness, thickness];
            var rect2 = boxModel.sliderRect = [x + thickness + computeSliderStart(storage, length, slider), y, slider, thickness];
            var rect3 = boxModel.arrow2Rect = [x + Math.max(width - thickness, 0), y, thickness, thickness];

            boxModel.segments = [rect1[0] + thickness, rect2[0], rect2[0] + slider, rect3[0]]; //位置段坐标
        }
    };



    this.paint = function (context) {


        var boxModel = context.boxModel;


        context.save();


        context.fillStyle = "blue";
        context.fillRect.apply(context, boxModel.sliderRect);


        context.fillStyle = "red";

        context.fillRect.apply(context, boxModel.arrow1Rect);
        context.fillRect.apply(context, boxModel.arrow2Rect);


        context.restore();
    };



});



$.class("ScrollCorner", $.Control, function ($) {



});




﻿//可滚动控件
$.class("ScrollableControl", $.Control, function ($) {



    this.create = function () {

        this.addEventListener("scroll", this.handleScroll);
        this.addEventListener("mousewheel", this.handleMouseWheel);
    };



    this.defineProperty("horizontalScrollBar", undefined, {

        readOnly: true,
        getter: function () {

            return this["x:hScrollBar"];
        }
    });


    this.defineProperty("verticalScrollBar", undefined, {

        readOnly: true,
        getter: function () {

            return this["x:vScrollBar"];
        }
    });




    //定义水平及竖直滚动条显示方式 auto always never  见枚举flyingon.ScrollBarVisibility对象
    this.defineProperties(["horizontalScroll", "verticalScroll"], "auto", "measure|layout");




    function defineProperty(name) {

        this.defineProperty("name", 0, {

            attributes: "validate",
            valueChangedCode: "var boxModel = this['x:boxModel'];\nboxModel[name] = value;\nboxModel.renderItems = null;"
        });
    };

    //
    defineProperty.call(this, "scrollLeft");

    //
    defineProperty.call(this, "scrollTop");

    //
    defineProperty.call(this, "scrollWidth");

    //
    defineProperty.call(this, "scrollHeight");




    this.getControlAt = function (x, y) {

        var hScrollBar = this["x:hScrollBar"];
        if (hScrollBar && hScrollBar.hitTest(x, y))
        {
            return hScrollBar;
        }

        var vScrollBar = this["x:vScrollBar"];
        if (vScrollBar && vScrollBar.hitTest(x, y))
        {
            return vScrollBar;
        }

        return null;
    };



    this.defineEvent("scrollchanged");


    this.handleScroll = function (event) {

        var box = this["x:boxModel"];

        if (event.changedX)
        {
            box.scrollLeft += event.changedX;
        }

        if (event.changedY)
        {
            box.scrollTop += event.changedY;
        }


        box.renderItems = null;


        //修正因滚动造成的输入符位置变更问题
        var ownerWindow = this.ownerWindow;
        if (ownerWindow && this.isParent(ownerWindow["x:focusControl"]))
        {
            ownerWindow["fn:caret"](event.changedX, event.changedY);
        }


        this.invalidate();

        event.stopPropagation();
    };

    this.handleMouseWheel = function (event) {

        var vScrollBar = this["x:vScrollBar"];

        if (vScrollBar)
        {
            var storage = vScrollBar["x:storage"],
                step = event.wheelDelta < 0 ? storage.minStep : -storage.minStep;

            vScrollBar.changeValue(step);
            event.stopPropagation();
        }

    };








    //测量
    this.measure = function (boxModel) {


        var innerRect = boxModel.innerRect;


        boxModel.scrollWidth = 0;
        boxModel.scrollHeight = 0;


        //自动滚动条时先按无滚动条进行排列
        var _hScrollBar = getHorizontalBar.call(this, innerRect.width),
            _vScrollBar = getVerticalBar.call(this, innerRect.height);


        this.adjustBoxModel(boxModel, _hScrollBar, _vScrollBar);
        this.arrange(boxModel);


        //如果滚动条有变则重新计算及排列
        var hScrollBar = getHorizontalBar.call(this, innerRect.width),
            vScrollBar = getVerticalBar.call(this, innerRect.height);

        if (_hScrollBar != hScrollBar || _vScrollBar != vScrollBar)
        {
            var measure = this.measure; //防止循环调用
            this.measure = null;

            boxModel.measure(); //退回重新测量

            this.measure = measure;

            this.adjustBoxModel(boxModel, hScrollBar, vScrollBar);
            this.arrange(boxModel);


            //重新设置滚动条
            if (hScrollBar)
            {
                hScrollBar.maxValue = boxModel.scrollWidth;
            }

            if (vScrollBar)
            {
                vScrollBar.maxValue = boxModel.scrollHeight;
            }
        }


        var scrollCorner = getScrollCorner.call(this, hScrollBar, vScrollBar);
        if (scrollCorner)
        {
            scrollCorner["x:boxModel"].setUsableRect(boxModel);
        }
    };

    //修正盒模型
    this.adjustBoxModel = function (boxModel, hScrollBar, vScrollBar) {

        if (hScrollBar || vScrollBar)
        {
            if (hScrollBar)
            {
                boxModel.innerRect.height -= hScrollBar["x:storage"].height;
            }

            if (vScrollBar)
            {
                boxModel.innerRect.width -= vScrollBar["x:storage"].width;
            }

            this.setScrollBarRect(boxModel, hScrollBar, vScrollBar);
        }
    };



    //排列子控件
    this.arrange = function (boxModel) {

    };




    function getHorizontalBar(viewportSize) {

        var storage = this["x:storage"],
            box = this["x:boxModel"],
            result = this["x:hScrollBar"];


        if (storage.horizontalScroll == "always" || (storage.horizontalScroll == "auto" && box.scrollWidth > viewportSize))
        {
            if (!result)
            {
                result = this["x:hScrollBar"] = this["x:hScrollBar:cache"] || this.createHorizontalScrollBar();
            }

            result["x:parent"] = this;

            storage = result["x:storage"];

            storage.value = box.scrollLeft;
            storage.maxValue = box.scrollWidth;
            storage.viewportSize = viewportSize;

            return result;
        }
        else if (result)
        {
            this["x:hScrollBar:cache"] = result;
            this["x:hScrollBar"] = null;
        }
    };

    function getVerticalBar(viewportSize) {

        var storage = this["x:storage"],
            box = this["x:boxModel"],
            result = this["x:vScrollBar"];


        if (storage.verticalScroll == "always" || (storage.verticalScroll == "auto" && box.scrollHeight > viewportSize))
        {
            if (!result)
            {
                result = this["x:vScrollBar"] = this["x:vScrollBar:cache"] || this.createVerticalScrollBar();
            }

            result["x:parent"] = this;

            storage = result["x:storage"];

            storage.value = box.scrollTop;
            storage.maxValue = box.scrollHeight;
            storage.viewportSize = viewportSize;

            return result;
        }
        else if (result)
        {
            this["x:vScrollBar:cache"] = result;
            this["x:vScrollBar"] = null;
        }
    };

    function getScrollCorner(hScrollBar, vScrollBar) {

        var result = this["x:scrollCorner"];


        if (hScrollBar && vScrollBar)
        {
            if (!result)
            {
                result = this["x:scrollCorner"] = this["x:scrollCorner:cache"] || this.createScrollCorner();
            }

            return result;
        }
        else if (result)
        {
            this["x:scrollCorner:cache"] = result;
            this["x:scrollCorner"] = null;
        }
    };



    //创建水平滚动条
    this.createHorizontalScrollBar = function () {

        return new $.ScrollBar();
    };

    //创建竖直滚动条
    this.createVerticalScrollBar = function () {

        var result = new $.ScrollBar();
        result.isVertical = true;
        return result;
    };

    //创建滚动条拐角
    this.createScrollCorner = function () {

        return new $.ScrollCorner();
    };



    //设置滚动条显示范围
    this.setScrollBarRect = function (boxModel, hScrollBar, vScrollBar) {

        var storage_1 = hScrollBar && hScrollBar["x:storage"],
            storage_2 = vScrollBar && vScrollBar["x:storage"],
            rect = boxModel.borderRect;


        if (storage_1 && storage_2) //如果出现两个滚动条
        {
            storage_1.width = rect.width - storage_2.width;
            storage_2.height = rect.height - storage_1.height;

            hScrollBar["x:boxModel"].setUsableRect(boxModel, rect.x, rect.bottom - storage_1.height, hScrollBar.width, storage_1.height, true);
            vScrollBar["x:boxModel"].setUsableRect(boxModel, rect.right - storage_2.width, rect.y, storage_2.width, vScrollBar.height, true);
        }
        else if (storage_1) //只出现水平滚动条
        {
            storage_1.width = rect.width;
            hScrollBar["x:boxModel"].setUsableRect(boxModel, rect.x, rect.bottom - storage_1.height, rect.width, storage_1.height, true);
        }
        else //只出现竖直滚动条
        {
            storage_2.height = rect.height;
            vScrollBar["x:boxModel"].setUsableRect(boxModel, rect.right - storage_2.width, rect.y, storage_2.width, rect.height, true);
        }
    };


});





﻿//内容控件
$.class("ContentControl", $.Control, function ($) {



    //内容控件
    this.defineProperty("content", null, {

        getter: function () {

            return this["x:content"];
        },

        setter: function (value) {

            var oldValue = this["x:content"];

            if (oldValue != value)
            {
                if (this["x:global"].initializing)
                {
                    this["x:content"] = value;
                }
                else
                {
                    if (oldValue)
                    {
                        oldValue["fn:parent"](null);
                    }

                    if (value)
                    {
                        value["fn:parent"](this);
                    }

                    this["x:content"] = value;

                    this.dispatchEvent({

                        type: "change",
                        name: "content",
                        value: parent,
                        oldValue: oldValue
                    });
                }
            }
        }


    });




});





﻿//Html控件基类
$.class("HtmlControl", $.Control, function ($) {


    this.create = function () {

        this.dom = $(this.render.apply(this, arguments));
    };


    this.render = function (layer) {

    };

});



$.class("HtmlFrame", $.HtmlControl, function ($) {

    var fn;
    //if ($.Browser.IE) {
    //
    //    fn = function (frame, html) {
    //        frame.contentWindow.contentHtml = html;
    //        frame.src = "javascript:window['contentHtml']";
    //    }
    //}
    //else {
    fn = function (frame, html) {

        var doc = frame.contentWindow.document;
        doc.open();
        doc.write(html);
        doc.close();
    };
    //};

    this.loadHtml = function (html) {

        var self = this;
        var frame = document.createElement("iframe");

        frame.setAttribute("border", "0");
        frame.setAttribute("marginwidth", "0");
        frame.setAttribute("marginheight", "0");
        frame.setAttribute("frameborder", "no");
        frame.setAttribute("scrolling", "no");
        frame.setAttribute("allowtransparency", "yes");

        frame.onload = function () {

            frame.onload = null;

            if (html)
            {
                fn(frame, html);
            }

            if (self.loaded)
            {
                self.loaded(frame);
            }
        };

        frame.src = "about:blank";
        return frame;
    };

});





﻿/*

*/
(function ($) {


    //控件集合
    $.ControlCollection = function (ownerControl) {

        this.ownerControl = ownerControl;
    };



    var p = $.ControlCollection.prototype = [],
        push = p.push,
        splice = p.splice,
        global = $.global;


    //隐藏标准属性
    ["push", "concat", "pop", "shift", "splice", "unshift"].forEach(function (item) {

        $.defineVariable(this, item, undefined, true, false);
    }, p);




    p.append = function (item) {

        if (global.initializing)
        {
            item["x:parent"] = this.ownerControl;
        }
        else
        {
            item["fn:parent"](this.ownerControl);
        }

        push.call(this, item);
        return this;
    };

    p.appendRange = function (items) {

        var i = 0,
            length = items.length,
            initializing = global.initializing;

        while (i < length)
        {
            var item = items[i++];

            if (initializing)
            {
                item["x:parent"] = this.ownerControl;
            }
            else
            {
                item["fn:parent"](this.ownerControl);
            }

            push.call(this, item);
        }

        return this;
    };

    p.insert = function (index, item) {

        if (global.initializing)
        {
            item["x:parent"] = this.ownerControl;
        }
        else
        {
            item["fn:parent"](this.ownerControl);
        }

        splice.call(this, index, 0, item);
        return this;
    };

    p.insertRange = function (index, items) {

        var i = 0,
            length = items.length,
            initializing = global.initializing;

        while (i < length)
        {
            var item = items[i++];

            if (initializing)
            {
                item["x:parent"] = this.ownerControl;
            }
            else
            {
                item["fn:parent"](this.ownerControl);
            }

            splice.call(this, index, 0, item);
        }

        return this;
    };




    p.remove = function (item) {

        var index = this.indexOf(item);

        if (index >= 0)
        {
            item["fn:parent"](null);
            splice.call(this, index, 1);
        }

        return this;
    };

    p.removeAt = function (index) {

        if (this.length > index)
        {
            this[index]["fn:parent"](null);
            splice.call(this, index, 1);
        }

        return this;
    };

    p.clear = function () {

        var i = 0,
            length = this.length;

        while (i < length)
        {
            this[index]["fn:parent"](null);
        }

        this.length = 0;
        return this;
    };



})(flyingon);




﻿/*

*/
(function ($) {



    //布局格
    function Cell(table, row) {

        this.table = table;
        this.row = row;
    };


    var p = Cell.prototype;

    p.subtable = null;

    p.x = 0;

    p.width = 0;

    p.widthSet = "*";

    p.widthWeight = 100;

    p.widthAuto = false;

    //设置列宽
    p.setWidth = function (value) {

        if (this.widthAuto)
        {
            this.row.widthWeights -= this.widthWeight;
            this.widthAuto = false;
        }
        else if (this.width)
        {
            this.row.widthFixed -= this.width;
        }

        this.widthSet = value = value || "*";

        var length = value.length - 1;

        if (value[length] == "*")
        {
            this.widthWeight = length ? value.substring(0, length) : 100;
            this.widthAuto = true;
            this.width = 0;
            this.row.widthWeights += this.widthWeight;
        }
        else
        {
            this.width = parseInt(value);
            this.row.widthFixed += this.width;
        }
    };





    //布局行
    function Row(table) {

        this.table = table;
        this.cells = [];
    };


    var p = Row.prototype;

    p.y = 0;

    p.height = 0;

    p.heightSet = "*";

    p.heightWeight = 100;

    p.heightAuto = false;

    //所属单元格所有固定宽度的总和
    p.widthFixed = 0;

    //自动宽度的表格数
    p.widthWeights = 0;

    //设置行高
    p.setHeight = function (value) {

        if (this.heightAuto)
        {
            this.table.heightWeights -= this.heightWeight;
            this.heightAuto = false;
        }
        else if (this.height)
        {
            this.table.heightFixed -= this.height;
        }

        this.heightSet = value = value || "*";
        var length = value.length - 1;

        if (value[length] == "*")
        {
            this.heightWeight = length == 0 ? 100 : value.substring(0, length);
            this.heightAuto = true;
            this.height = 0;
            this.table.heightWeights += this.heightWeight;
        }
        else
        {
            this.height = parseInt(value);
            this.table.heightFixed += this.height;
        }
    };





    //布局表
    $.LayoutTable = function () {

        this.rows = [];

    };


    var p = $.LayoutTable.prototype;

    //列留空
    p.spaceX = 0;

    //行留空
    p.spaceY = 0;

    //所属行中所有固定高度的总和
    p.heightFixed = 0;

    //自动高度的权重总数
    p.heightWeights = 0;


    p.compute = function (width, height) {

        this.width = width || 0;
        this.height = height || 0;

        var spaceX = this.spaceX || 0,
            spaceY = this.spaceY || 0,

            rows = this.rows,

            y = this.y || 0,
            height = Math.max(this.height - this.heightFixed - (rows - 1) * spaceY, 0),
            heightWeights = this.heightWeights,

            i = 0;
        length = row.length;



        while (i < length)
        {
            var row = rows[i++];

            row.y = y;

            if (row.heightAuto)
            {
                row.height = Math.round(height * row.heightWeight / heightWeights);
                heightWeights -= row.heightWeight;
                height -= row.height;
            }


            var cells = row.cells,

                x = this.x || 0,
                width = Math.max(this.width - row.widthFixed - (cells - 1) * spaceX, 0),
                widthWeights = row.widthWeights,

                j = 0,
                count = cells.length;

            while (j < count)
            {
                var cell = cells[j++];

                cell.x = x;

                if (cell.widthAuto)
                {
                    cell.width = Math.round(width * cell.widthWeight / widthWeights);
                    widthWeights -= cell.widthWeight;
                    width -= cell.width;
                }

                if (cell.subtable)
                {
                    var t = cell.subtable;

                    t.x = x;
                    t.y = y;
                    t.spaceX = spaceX;
                    t.spaceY = spaceY;
                    t.compute(cell.width, row.height);
                }

                x += cell.width + spaceX;
            }

            y += row.height + spaceY;
        }
    };


    p.appendRow = function (height) {

    };


    p.insertRow = function (index, height) {

    };

    p.appendColumn = function (width) {

    };

    p.insertColumn = function (index, width) {

    };



    p.create = function (rows, columns) {

        var rows = Math.max(rows, 0) || 3,
            columns = Math.max(columns, 0) || 3;


        for (var i = 0; i < rows; i++)
        {
            var row = new Row(this);

            row.heightAuto = true;
            this.heightWeights += row.heightWeight;

            for (var j = 0; j < columns; j++)
            {
                var cell = new Cell(this, row);

                cell.widthAuto = true;
                row.widthWeights += cell.widthWeight;

                row.cells.push(cell);
            }

            this.rows.push(row);
        }
    };

    p.load = function (value) {

        value = value || "T R* C* C* C* R* C* C* C* R* C* C* C* END";

        var tables = [],
            rows = [],
            table = this,
            row,
            cell,
            tokens = value.split(/\s/g),

            i = 0,
            length = tokens.length;


        while (i < length)
        {
            var token = tokens[i++],
                value = token.substring(1);

            if (token == "END")
            {
                table = tables.pop();
                row = rows.pop();
            }
            else
            {
                switch (token[0])
                {
                    case "T":
                        if (cell != null)
                        {
                            tables.push(table);
                            rows.push(row);

                            table = cell.subtable = new $.LayoutTable();
                            row = null;
                        }
                        break;

                    case "R":
                        row = new Row(table);
                        row.setHeight(value);
                        table.rows.push(row);

                        cell = null;
                        break;

                    case "C":
                        if (row)
                        {
                            cell = new Cell(table, row);
                            cell.setWidth(value);
                            row.cells.push(cell);
                        }
                        break;
                }
            }
        }
    };


    p.serialize = function () {

    };

    p.deserialize = function (value) {


    };

    p.getAllCells = function () {

        var result = [],
            rows = this.rows,
            i = 0,
            length = rows.length;


        while (i < length)
        {
            var row = rows[i++],
                cells = row.cells,
                j = 0,
                count = row.cells.length;


            while (j < count)
            {
                var cell = cells[j++];

                if (cell.subtable)
                {
                    result = result.concat(cell.subtable.getAllCells());
                }
                else
                {
                    result.push(cell);
                }
            }
        }

        return result;
    };



    //顺序排列子控件
    p.sequenceLayout = function (children, boxModel) {

        var index = 0,
            cells = this.getAllCells(),
            length = children.length;


        for (var i = 0; i < length; i++)
        {
            var item = children[i],
                box = item["x:boxModel"];


            if (box.visible = (item["x:storage"].visibility != "collapsed"))
            {
                if (index >= cells.length)
                {
                    box.visible = false;
                }
                else
                {
                    var cell = cells[index++],
                        margin = box.margin = item.getStyleValue("margin");

                    box.setUsableRect(
                        boxModel,
                        cell.x + margin[3],
                        cell.row.y + margin[0],
                        cell.width - margin[3] - margin[1],
                        cell.row.height - margin[0] - margin[2]);
                }
            }
        }
    };


})(flyingon);




﻿//面板控件
$.class("Panel", $.ScrollableControl, function ($) {




    this.create = function () {


        //子控件集合
        this["x:children"] = new $.ControlCollection(this);

    };





    //修改默认修值接受拖放
    this.setDefaultValue("droppable", true);



    this.setDefaultValue("width", 400);

    this.setDefaultValue("height", 400);



    //子控件集合
    this.defineProperty("children", undefined, {

        readOnly: true,
        getter: function () {

            return this["x:children"];
        }
    });



    //当前布局 见枚举flyingon.Layout对象
    this.defineProperty("layout", "rows", {

        attributes: "measure|layout",
        valueChangedCode: "var boxModel = this['x:boxModel'];\nboxModel.scrollLeft = 0;\nboxModel.scrollTop = 0;\nboxModel.renderItems = null;"
    });

    //布局x轴间隔 0-1之间表示间隔值为总宽度百分比
    this.defineProperty("layoutSpaceX", 0, "measure|layout");

    //布局y轴间隔 0-1之间表示间隔值为总高度的百分比
    this.defineProperty("layoutSpaceY", 0, "measure|layout");

    //布局行高
    this.defineProperty("layoutRowHeight", 0, "measure|layout");

    //布局列宽
    this.defineProperty("layoutColumnWidth", 0, "measure|layout");

    //当前布局页索引
    this.defineProperty("layoutPageIndex", 0, "measure|layout");

    //布局列数
    this.defineProperty("layoutColumns", 3, "measure|layout");

    //布局行数
    this.defineProperty("layoutRows", 3, "measure|layout");

    //布局表
    this.defineProperty("layoutTable", "T R* C* C* C* R* C* C* C* R* C* C* C* END", "measure|layout");




    //布局集
    var layouts = {};

    function getLayoutSpace(value, total) {

        return value > 0 ? (value > 1 ? value : Math.round(total * value)) : 0;
    };


    //单行排列 layoutSpaceX verticalAlign
    layouts.row = function (children, boxModel, usableRect, spaceX, spaceY) {

        var x = 0,
            height = usableRect.height,

            i = 0,
            length = children.length;


        while (i < length)
        {
            var item = children[i++],
                storage = item["x:storage"],
                box = item["x:boxModel"];


            if (box.visible = (storage.visibility != "collapsed"))
            {
                var margin = box.margin = item.getStyleValue("margin");

                x += margin[3];

                box.setUsableRect(
                    boxModel,
                    x,
                    margin[0],
                    storage.width,
                    height - margin[0] - margin[2]);

                x += storage.width + margin[3] + spaceX;
            }
        }


        boxModel.scrollWidth = children[children.length - 1]["x:boxModel"].right;
    };


    //单列排列 layoutSpaceY horizontalAlign
    layouts.column = function (children, boxModel, usableRect, spaceX, spaceY) {

        var y = 0,
            width = usableRect.width,

            i = 0,
            length = children.length;


        while (i < length)
        {
            var item = children[i++],
                storage = item["x:storage"],
                box = item["x:boxModel"];


            if (box.visible = (storage.visibility != "collapsed"))
            {
                var margin = box.margin = item.getStyleValue("margin");

                y += margin[0];

                box.setUsableRect(
                    boxModel,
                    margin[3],
                    y,
                    width - margin[3] - margin[1],
                    storage.height);

                y += storage.height + margin[2] + spaceY;
            }
        }


        boxModel.scrollHeight = children[children.length - 1]["x:boxModel"].bottom;
    };


    //多行排列 layoutSpaceX layoutSpaceY layoutRowHeight verticalAlign
    layouts.rows = function (children, boxModel, usableRect, spaceX, spaceY) {

        var storage = this["x:storage"],

            rowHeight = storage.layoutRowHeight > 0 ? storage.layoutRowHeight : 0,
            maxHeight = rowHeight,

            x = 0,
            y = 0,
            right = usableRect.width,

            i = 0,
            length = children.length;


        while (i < length)
        {
            var item = children[i++],
                storage = item["x:storage"],
                box = item["x:boxModel"];


            if (box.visible = (storage.visibility != "collapsed"))
            {
                var margin = box.margin = item.getStyleValue("margin");


                if (x > 0 && x + margin[3] + storage.width + margin[1] > right) //如果超出宽度则折行
                {
                    x = 0;
                    y += maxHeight + spaceY;

                    maxHeight = rowHeight;
                }



                x += margin[3];

                box.setUsableRect(
                  boxModel,
                  x,
                  y + margin[0],
                  storage.width,
                  Math.max(rowHeight && (rowHeight - margin[0] - margin[2]), storage.height));


                x += storage.width + margin[1] + spaceX;


                var height = storage.height + margin[0] + margin[2];
                if (height > maxHeight)
                {
                    maxHeight = height;
                }
            }
        }


        boxModel.scrollHeight = children[children.length - 1]["x:boxModel"].bottom;
    };


    //多列排列 layoutSpaceX layoutSpaceY layoutColumnWidth  horizontalAlign
    layouts.columns = function (children, boxModel, usableRect, spaceX, spaceY) {

        var storage = this["x:storage"],

            colWidth = storage.layoutColumnWidth > 0 ? storage.layoutColumnWidth : 0,
            maxWidth = colWidth,

            x = 0,
            y = 0,
            bottom = usableRect.height,

            i = 0,
            length = children.length;


        while (i < length)
        {
            var item = children[i++],
                storage = item["x:storage"],
                box = item["x:boxModel"];


            if (box.visible = (storage.visibility != "collapsed"))
            {
                var margin = box.margin = item.getStyleValue("margin");


                if (y > 0 && y + margin[0] + storage.height + margin[2] > bottom) //如果超出高度则折行
                {
                    x += maxWidth + spaceX;
                    y = 0;

                    maxWidth = colWidth;
                }



                y += margin[0];

                box.setUsableRect(
                    boxModel,
                    x + margin[3],
                    y,
                    Math.max(colWidth && (colWidth - margin[3] - margin[1]), storage.width),
                    storage.height);

                y += storage.height + margin[2] + spaceY;


                var width = storage.width + margin[3] + margin[1];
                if (width > maxWidth)
                {
                    maxWidth = width;
                }
            }
        }


        boxModel.scrollWidth = children[children.length - 1]["x:boxModel"].right;
    };


    //停靠 layoutSpaceX layoutSpaceY dock  horizontalAlign verticalAlign
    layouts.dock = function (children, boxModel, usableRect, spaceX, spaceY) {

        var storage = this["x:storage"],

            x = 0,
            y = 0,
            width = usableRect.width,
            height = usableRect.height,

            right = width,
            bottom = height,

            fills = [],

            i = 0,
            length = children.length;


        while (i < length)
        {
            var item = children[i++],
                storage = item["x:storage"],
                box = item["x:boxModel"];


            if (box.visible = (storage.visibility != "collapsed"))
            {
                if (width < 0 || height < 0)
                {
                    box.visible = false;
                }
                else
                {
                    var margin = box.margin = item.getStyleValue("margin");

                    switch (storage.dock)
                    {
                        case "left":
                            x += margin[3];

                            box.setUsableRect(
                                boxModel,
                                x,
                                y + margin[0],
                                storage.width,
                                height - margin[0] - margin[2]);

                            x += storage.width + margin[1] + spaceX;
                            width = right - x;
                            break;

                        case "top":
                            y += margin[0];

                            box.setUsableRect(
                                boxModel,
                                x + margin[3],
                                y,
                                width - margin[3] - margin[1],
                                storage.height);

                            y += storage.height + margin[2] + spaceY;
                            height = bottom - y;
                            break;

                        case "right":
                            right -= margin[1] + storage.width;

                            box.setUsableRect(
                                boxModel,
                                right,
                                y + margin[0],
                                storage.width,
                                height - margin[0] - margin[2]);

                            right -= margin[3] + spaceX;
                            width = right - x;
                            break;

                        case "bottom":
                            bottom -= margin[2] + storage.height;

                            box.setUsableRect(
                                boxModel,
                                x + margin[3],
                                bottom,
                                width - margin[3] - margin[1],
                                storage.height);

                            bottom -= margin[0] + spaceY;
                            height = bottom - y;
                            break;

                        default:
                            fills.push(box);
                            break;
                    }
                }
            }
        }


        for (var i = 0; i < fills.length; i++)
        {
            fills[i].setUsableRect(boxModel, x, y, width, height);
        }

    };


    //单页显示 layoutPage  horizontalAlign verticalAlign
    layouts.page = function (children, boxModel, usableRect, spaceX, spaceY) {

        var index = this["x:storage"].layoutPageIndex || 0,

            i = 0,
            length = children.length;


        while (i < length)
        {
            var item = children[i++],
                box = item["x:boxModel"];

            if (box.visible = (i == index))
            {
                var margin = box.margin = item.getStyleValue("margin");

                box.setUsableRect(
                    boxModel,
                    margin[3],
                    margin[0],
                    usableRect.width - margin[3] - margin[1],
                    usableRect.height - margin[0] - margin[2]);
            }
        }
    };


    //网格排列 layoutColumns layoutRows gridLineColor layoutSpaceX layoutSpaceY  horizontalAlign verticalAlign
    layouts.grid = function (children, boxModel, usableRect, spaceX, spaceY) {

        var storage = this["x:storage"],
            table = new $.LayoutTable();


        table.create(storage.layoutRows, storage.layoutColumns);


        table.spaceX = spaceX;
        table.spaceY = spaceY;

        table.compute(usableRect.width, usableRect.height);
        table.sequenceLayout(children, boxModel);
    };


    //表格排列 layoutTable layoutSpaceX layoutSpaceY  horizontalAlign verticalAlign
    //示例: "T R* C* C* C* R* C* C* C* R* C* C* C* END"
    layouts.table = function (children, boxModel, usableRect, spaceX, spaceY) {

        var storage = this["x:storage"],
            table = storage.layoutTable;


        if (!(table instanceof $.LayoutTable))
        {
            table = new $.LayoutTable();
            table.load(storage.layoutTable);
        }

        table.spaceX = spaceX;
        table.spaceY = spaceY;

        table.compute(usableRect.width, usableRect.height);
        table.sequenceLayout(children, boxModel);
    };


    //绝对定位 left top
    layouts.absolute = function (children, boxModel, usableRect, spaceX, spaceY) {


        var i = 0,
            length = children.length;


        while (i < length)
        {
            var item = children[i++],
                storage = item["x:storage"],
                box = item["x:boxModel"];


            if (box.visible = (storage.visibility != "collapsed"))
            {
                box.setUsableRect(
                    boxModel,
                    storage.left,
                    storage.top,
                    storage.width,
                    storage.height);


                if (box.right > boxModel.scrollWidth)
                {
                    boxModel.scrollWidth = box.right;
                }

                if (box.bottom > boxModel.scrollHeight)
                {
                    boxModel.scrollHeight = box.bottom;
                }
            }
        }
    };



    //自定义获取布局的方法
    this.getLayout = null;

    //排列子控件
    this.arrange = function (boxModel) {


        var storage = this["x:storage"],
            children = this["x:children"],
            fn = children.length > 0 && ((this.getLayout && this.getLayout(storage.layout)) || layouts[storage.layout]);


        boxModel.children = null;

        if (fn)
        {
            var usableRect = boxModel.innerRect,
                spaceX = storage.layoutSpaceX,
                spaceY = storage.layoutSpaceY;

            spaceX = spaceX > 0 ? (spaceX > 1 ? spaceX : Math.round(usableRect.width * spaceX)) : 0;
            spaceY = spaceY > 0 ? (spaceY > 1 ? spaceY : Math.round(usableRect.height * spaceY)) : 0;

            fn.call(this, children, boxModel, usableRect, spaceX, spaceY);
        }

        return this;
    };





    //获取指定位置的控件
    this.getControlAt = function (x, y) {

        //判断滚动条
        var result = $.Panel.super.getControlAt.call(this, x, y);

        if (result)
        {
            return result;
        }



        var box = this["x:boxModel"],
            rect = box.innerRect;


        x += box.scrollLeft - rect.x;
        y += box.scrollTop - rect.y;

        //if (storage.transform)
        //{

        //}


        var items = box.renderItems;

        if (items && items.length > 0)
        {
            for (var i = items.length - 1; i >= 0 ; i--)
            {
                var item = items[i].ownerControl;

                if (item.hitTest(x, y))
                {
                    return item.getControlAt ? item.getControlAt(x, y) : item;
                }
            }
        }


        return this;
    };




    //注册自定义布局 注意回调函数规范及处理scrollWidth及scrollHeight
    $.Panel.registryLayout = function (name, layoutfn) {

        layouts[name] = layoutfn;
    };



    this.focus = function () {

        if (this.containsFocused)
        {
            return true;
        }


        var children = this["x:children"],
            i = 0,
            length = children.length;


        while (i < length)
        {
            if (children[i++].focus(event))
            {
                return true;
            }
        }

        return $.Panel.super.focus.call(this, event);
    };

    this.blur = function () {

        return this.containsFocused ? $.Panel.super.blur.call(this, event) : false;
    };




    this.serialize = function (writer) {

        $.Panel.super.serialize.call(this, writer);
        
        var children = this["x:children"];

        if (children && (length = children.length) > 0)
        {
            writer.write("d:children", children);
        }
    };


});




﻿//分隔条控件
$.class("Splitter", $.ContentControl, function ($) {



    function handleMouseDown(e) {


    };

    function handleMouseMove(e) {

    };

    function handleMouseUp(e) {


    };



    this.create = function () {

        var storage = this["x:storage"];

        storage.cursor = $.cursors["col-resize"];
        storage.dock = "left";
        storage.draggable = true;


        this.addEventListener("mousedown", handleMouseDown);
        this.addEventListener("mousemove", handleMouseMove);
        this.addEventListener("mouseup", handleMouseUp);
    };



    this.setDefaultValue("draggable", true);




    this.dragger = {

        allowdropCursor: $.cursors["col-Resize"],

        nodropCursor: $.cursors["no-drop"],

        paint: function (dragTargets) {

            var context = layer.context,
                boxModel = this["x:boxModel"],
                rect = boxModel.innerRect;

            context.fillStyle = this.getStyleValue("dragColor") || "rgba(255,0,0,0.5)";
            context.fillRect(rect.x, rect.y, rect.width, rect.height);

            this.paint(context);
            this.paintBorder(context);
        },

        move: function (event, offsetX, offsetY) {

            switch (this["x:storage"].dock)
            {
                case "left":
                case "right":
                    return { x: offsetX, y: 0 };

                case "top":
                case "bottom":
                    return { x: 0, y: offsetY };
            }
        },

        stop: function (event, offsetX, offsetY) {

        }

    };


});





﻿/*

*/
$.class("Layer", $.Panel, function ($) {



    function DelayUpdater(layer) {


        var timer;


        function execute() {

            layer["x:boxModel"].update(layer.context);
        };

        layer.registryUpdate = function () {

            if (timer)
            {
                //clearTimeout(timer);
            };

            timer = setTimeout(execute, 5);
        };

        layer.unregistryUpdate = function () {

            if (timer)
            {
                //clearTimeout(timer);
                timer = 0;
            };
        };
    };




    this.create = function () {

        var div = this.domLayer = document.createElement("div"),
            canvas = this.domCanvas = document.createElement("canvas");


        div.setAttribute("flyingon", "layer");
        div.setAttribute("style", "position:absolute;width:100%;height:100%;overflow:hidden;outline:none;");

        canvas.setAttribute("flyingon", "canvas");
        canvas.setAttribute("style", "position:absolute;outline:none;");

        div.appendChild(canvas);

        this.context = canvas.getContext("2d");
        this.context.layer = this;

        this["x:boxModel"]["x:layer"] = true;

        //注册延时更新
        new DelayUpdater(this);
    };



    this.defineProperty("opacity", 1, {

        valueChangedCode: "this.domLayer.style.opacity = value;"
    });


    this.defineProperty("width", undefined, {

        readOnly: true,
        getter: function () {

            return this.domCanvas.width;
        }
    });

    this.defineProperty("height", undefined, {

        readOnly: true,
        getter: function () {

            return this.domCanvas.height;
        }
    });



    this.defineProperty("ownerLayer", undefined, {

        readOnly: true,
        getter: function () {

            return this;
        }
    });





    this.update = function () {

        this.unregistryUpdate();

        this["x:boxModel"].invalidate();
        this["x:boxModel"].update(this.context);
    };



});






﻿//窗口基类
$.class("WindowBase", $.Layer, function ($) {



    var host,                       //主容器
        dragging = false,           //是否处理拖动
        mouseDown = false,          //鼠标是否按下
        global = $.global;          //全局对象



    this.create = function () {


        //默认设置为初始化状态,在第一次渲染窗口后终止
        global.initializing = true;



        var style = "position:absolute;z-index:9990;width:100%;height:100%;overflow:hidden;-moz-user-select:none;-webkit-user-select:none;outline:none;cursor:default;";


        var domMask = this.domMask = document.createElement("div");
        domMask.setAttribute("flyingon", "window.mask");
        domMask.setAttribute("style", style + "background-color:white;opacity:0.1;");


        var domWindow = this.domWindow = document.createElement("div");

        domWindow["x:ownerWindow"] = this.domLayer["x:ownerWindow"] = this.domCanvas["x:ownerWindow"] = this; //缓存当前对象

        domWindow.setAttribute("flyingon", "window");
        domWindow.setAttribute("style", style);
        domWindow.setAttribute("tabindex", "0");

        //IE禁止选中文本 其它浏览器使用样式控件 -moz-user-select:none;-webkit-user-select:none;
        domWindow.onselectstart = domMask.onselectstart = function (event) {

            return false;
        };

        //设置图层
        domWindow.appendChild(this.domLayer);
        this.layers = [this];



        domWindow.addEventListener("mousedown", mousedown, true);

        //宿主
        if (!host)
        {
            host = document.documentElement;

            //样式说明: 禁止选中文本: -moz-user-select:none;-webkit-user-select:none;
            host.setAttribute("style", "-moz-user-select:none;-webkit-user-select:none;");

            host.addEventListener("mousemove", mousemove, false);   //注册顶级dom以便捕获鼠标
            host.addEventListener("mouseup", mouseup, false);       //注册顶级dom以便捕获鼠标
        }


        domWindow.addEventListener("click", click, true);
        domWindow.addEventListener("dblclick", dblclick, true);

        domWindow.addEventListener("mousewheel", mousewheel, true);
        domWindow.addEventListener("DOMMouseScroll", mousewheel, true); //firefox

        domWindow.addEventListener("keydown", keydown, true);
        domWindow.addEventListener("keypress", keypress, true);
        domWindow.addEventListener("keyup", keyup, true);


        //初始化插入符
        caret.call(this, domWindow);


        //子窗口集合
        this["x:windows"] = [];

        //创建控件捕获延迟执行器
        this["x:captureDelay"] = new $.DelayExecutor(10, captureControl, this);
    };





    //所属窗口
    this.defineProperty("ownerWindow", undefined, {

        readOnly: true,
        getter: function () {

            return this;
        }
    });

    //图层
    this.defineProperty("ownerLayer", undefined, {

        readOnly: true,
        getter: function () {

            return this;
        }
    });




    //窗口切换为活动窗口事件
    this.defineEvent("activate");

    //窗口切换为非活动窗口事件
    this.defineEvent("deactivate");




    //开始初始化
    this.beginInit = function () {

        global.initializing = true;
        return this;
    };

    //结束初始化
    this.endInit = function () {

        global.initializing = false;
        return this;
    };




    //设置当前窗口为活动窗口
    this.activate = function (deactivate) {

        var parentWindow = this.parentWindow,
            activateWindow;


        if (parentWindow)
        {
            if (deactivate !== false && (activateWindow = parentWindow["x:activateWindow"]))
            {
                activateWindow["fn:deactivate"]();
            }

            parentWindow["x:activateWindow"] = this;
            this["fn:activate"]();
        }
    };


    //获取活动窗口
    this.getActivateWindow = function () {

        var result = this,
            activateWindow;


        while (activateWindow = result["x:activateWindow"])
        {
            result = activateWindow;
        }

        return result == this ? null : result;
    };


    this["fn:activate"] = function () {

        this.domWindow.style.zIndex = 9991;
        this.dispatchEvent("activate");
    };

    this["fn:deactivate"] = function () {

        this.domWindow.style.zIndex = 9990;
        this.dispatchEvent("deactivate");
    };



    /*

    关于层的顺序 本系统最高层使用9999,默认层为0
    
    拖拉层:     9999
    插入符:     9998
    弹出层:     9997
    活动窗口:   9991
    非活动窗口: 9990
    


    //最大z-index 
    //IE FireFox Safari的z-index最大值是2147483647 。 
    //Opera的最大值是2147483584.。 
    //IE Safari Opera在超过其最大值时按最大值处理。 
    //FireFox 在超过最大值时会数据溢出正负不定,但有一点可以肯定绝对不会高于2147483647层
    //IE FireFox Safari的z-index最小值是-2147483648 
    //Opera的z-index最小值-2147483584 
    //FireFox在-2147483648<=z-index<0时层不显示 在z-index<-2147483648时溢出实际数字正负不定 
    //IE Safari Opera在z-index<0时显示,在小于其最小值时都按其最小值处理

    */

    this.appendLayer = function (zIndex) {

        var storage = this["x:storage"],
            result = layer || new $.Layer();


        if (zIndex)
        {
            result.domLayer.style.zIndex = zIndex;
        }

        result.domCanvas.width = storage.width;
        result.domCanvas.height = storage.height;

        result["x:boxModel"].setUsableRect(null, 0, 0, storage.width, storage.height);
        result["x:parent"] = this;

        result.domLayer["x:ownerWindow"] = result.domCanvas["x:ownerWindow"] = this;

        this.domWindow.appendChild(result.domLayer);
        this.layers.push(result);

        return result;
    };


    this.removeLayer = function (layer) {

        if (layer)
        {
            layer["x:parent"] = layer.domLayer["x:ownerWindow"] = layer.domCanvas["x:ownerWindow"] = null;

            this.domWindow.removeChild(layer.domLayer);
            this.layers.remove(layer);
        }
    };




    this.getControlAt = function (x, y) {

        for (var i = this.layers.length - 1; i >= 0; i--)
        {
            var layer = this.layers[i];

            if (!layer.disableGetControlAt && layer.context.getImageData(x, y, 1, 1).data[3] != 0)
            {
                return $.WindowBase.super.getControlAt.call(layer, x, y);
            }
        }

        return this;
    };





    //计算偏移,处理firefox没有offsetX及offsetY的问题
    function offset(event) {

        if (!event["x:offsetX"])
        {
            var x = 0,
                y = 0,
                target = this.domWindow || event.target;

            while (target)
            {
                x += target.offsetLeft;
                y += target.offsetTop;

                target = target.offsetParent;
            }

            //不能使用offsetX 在IE下无法重赋值
            event["x:offsetX"] = event.clientX - x;
            event["x:offsetY"] = event.clientY - y;
        }
    };


    //触发带mouseDown的鼠标事件
    function dispatchEvent(type, target, domMouseEvent) {

        var event = new $.MouseEvent(type, target, domMouseEvent);
        event.mouseDown = mouseDown;

        target.dispatchEvent(event);
    };


    //控件捕获
    function captureControl(domMouseEvent) {


        var source = global.mouseControl,
            target = this.getControlAt(domMouseEvent["x:offsetX"], domMouseEvent["x:offsetY"]) || this;

        if (target != source)
        {
            global.mouseControl = target;

            if (source)
            {
                source.switchState("hover-states", "leave-animate");
                dispatchEvent("mouseout", source, domMouseEvent);
            }

            if (target && target["x:storage"].enabled)
            {
                this.domWindow.style.cursor = target["fn:cursor"](domMouseEvent);

                target.switchState("hover-states", "hover");

                dispatchEvent("mouseover", target, domMouseEvent);
                dispatchEvent("mousemove", target, domMouseEvent);
            }
        }
    };


    function mousedown(domMouseEvent) {


        var ownerWindow = this["x:ownerWindow"]["x:captureDelay"].execute();


        //设置鼠标按下
        mouseDown = true;



        //处理弹出窗口
        if (ownerWindow != ownerWindow.mainWindow.getActivateWindow()) //活动窗口不是当前点击窗口
        {
            ownerWindow.activate(true);
        }



        //处理鼠标按下事件
        var target = ownerWindow["x:captureControl"] || global.mouseControl;

        if (target && target["x:storage"].enabled)
        {
            offset.call(ownerWindow, domMouseEvent);

            //如果可拖动
            if (dragging = target["x:storage"].draggable || ownerWindow["x:storage"].designMode)
            {
                $.Dragdrop.start(ownerWindow, target, domMouseEvent, true);
            }
            else
            {
                //分发事件
                var event = new $.MouseEvent("mousedown", target, domMouseEvent);
                target.dispatchEvent(event);


                //处理焦点
                var focusControl = ownerWindow["x:focusControl"];

                if (target["x:storage"].focusable)
                {
                    var validate = true;

                    if (focusControl && focusControl != target && (validate = focusControl.validate()))
                    {
                        focusControl["fn:blur"]();
                    }

                    if (validate)
                    {
                        target["fn:focus"](event);
                    }
                }
            }


            //设置捕获(注:setCapture及releaseCapture仅IE支持,不能使用)
            host["x:ownerWindow"] = ownerWindow;

            domMouseEvent.stopPropagation();
        }
    };


    function mousemove(domMouseEvent) {


        var ownerWindow = host["x:ownerWindow"] || domMouseEvent.target["x:ownerWindow"],
            target;


        if (ownerWindow)
        {
            offset.call(ownerWindow, domMouseEvent);

            if (dragging) //处理拖动
            {
                $.Dragdrop.move(domMouseEvent);
            }
            else if (target = ownerWindow["x:captureControl"]) //启用捕获
            {
                if (target["x:storage"].enabled)
                {
                    dispatchEvent("mousemove", target, domMouseEvent);
                }
            }
            else
            {
                ownerWindow["x:captureDelay"].registry([domMouseEvent]); //启用延迟捕获
            }
        }
        else if (target = global.mouseControl)
        {
            global.mouseControl = null;
            target.switchState("hover-states", "leave-animate");

            dispatchEvent("mouseout", target, domMouseEvent);
        }
    };


    function mouseup(domMouseEvent) {


        var ownerWindow = host["x:ownerWindow"];

        if (ownerWindow)
        {
            var target = ownerWindow["x:captureControl"] || global.mouseControl;

            if (target && target["x:storage"].enabled)
            {
                offset.call(ownerWindow, domMouseEvent);

                if (dragging)
                {
                    dragging = false;

                    if (!$.Dragdrop.stop())
                    {
                        return;
                    }
                }

                target.dispatchEvent(new $.MouseEvent("mouseup", target, domMouseEvent));
            }


            //取消捕获
            host["x:ownerWindow"] = null;

            //设置鼠标弹起
            mouseDown = false;
        }
    };



    //鼠标事件翻译方法
    function translateMouseEvent(type, domMouseEvent) {


        var ownerWindow = this["x:ownerWindow"]["x:captureDelay"].execute(),
            target = ownerWindow["x:captureControl"] || global.mouseControl;


        if (target && target["x:storage"].enabled)
        {
            offset.call(ownerWindow, domMouseEvent);
            target.dispatchEvent(new $.MouseEvent(type, target, domMouseEvent));
        }

        domMouseEvent.stopPropagation();
    };

    function click(domMouseEvent) {

        translateMouseEvent.call(this, "click", domMouseEvent);
    };

    function dblclick(domMouseEvent) {

        translateMouseEvent.call(this, "dblclick", domMouseEvent);
    };

    function mousewheel(domMouseEvent) {

        translateMouseEvent.call(this, "mousewheel", domMouseEvent);
    };



    function keydown(domMouseEvent) {

        var ownerWindow = this["x:ownerWindow"],
            focuseControl = ownerWindow["x:focuseControl"];

        //如果有输入焦点控件则发送事件至输入焦点控件
        if (focuseControl && focuseControl["x:storage"].enabled)
        {
            target.dispatchEvent(new $.KeyEvent(domMouseEvent.type, target, domMouseEvent));
        }
        else //否则处理accessKey
        {

        }

    };

    var keypress = keydown, keyup = keydown;





    this["fn:fill"] = function (storage) {

        global.initializing = false;

        var domHost = this.domWindow.parentNode;

        if (domHost)
        {
            var rect = domHost.getBoundingClientRect();

            if (storage)
            {
                this["x:storage"].width = rect.width;
                this["x:storage"].height = rect.height;
            }

            return rect;
        }

        return { width: 0, height: 0 };
    };


    //使区域无效
    this.invalidate = function () {

        this["x:boxModel"].invalidate();

        //绘制窗口内容
        var layers = this.layers,
            i = 0,
            length = layers.length;

        while (i < length)
        {
            layers[i++].registryUpdate();
        }
    };







    ///插入符
    function caret(parentNode) {


        var timer,

            target,
            boxModel,
            textMetrics,
            point,

            div = document.createElement("div"),
            input = document.createElement("input"), //输入助手

            ime = 0; //对中文输入时有输入预览的浏览器进行特殊处理 chrome safari Opera


        div.setAttribute("flyingon", "caret");

        input.type = "text";
        input.setAttribute("flyingon", "input");
        input.setAttribute("style", "position:absolute;z-index:-1;padding:0;border:0;width:1px;height:1px;top:100px;");


        if (navigator.userAgent.match(/MSIE/))
        {
            input.style.width = 0;
        }


        input.onselectstart = function (event) {

            event.stopPropagation();
            return true;
        };


        parentNode.appendChild(div);
        parentNode.appendChild(input);






        function toggle() {

            div.style.visibility = div.style.visibility == "visible" ? "hidden" : "visible";
        };


        function show() {

            var box = boxModel.parent,
                x = point.x,
                y = point.y,
                height = textMetrics.font.lineHeight + 2;


            //处理不完全显示
            if (box)
            {
                var rect = box.innerRect,
                    value;

                if ((value = rect.windowY - y) > 0)
                {
                    y += value;
                    height -= value
                }

                if ((value = y + height - rect.windowY - rect.height) > 0)
                {
                    height -= value;
                }

                if (height < 0)
                {
                    height = 0;
                }
            }

            div.setAttribute("style", "visibility:visible;position:absolute;background-color:black;z-Index:9998;width:1px;left:" + x + "px;top:" + y + "px;height:" + height + "px;");
        };


        //更新控件
        function update() {


            if (timer)
            {
                clearInterval(timer);
            }


            var rect = boxModel.innerRect,
                x = textMetrics.caretEnd.x;


            //自动滚动调整
            if (x < boxModel.scrollLeft)
            {
                boxModel.scrollLeft = x;
            }
            else
            {
                var right = boxModel.scrollLeft + rect.width;

                if (x > right)
                {
                    boxModel.scrollLeft = x - rect.width;
                    x = right;
                }
                else if (right <= rect.width)
                {
                    boxModel.scrollLeft = 0;
                }
            }


            //显示插入符
            point = boxModel.targetToOffset(rect.spaceX + x - boxModel.scrollLeft, rect.spaceY);
            if (x > 0)
            {
                point.x -= 1;
            }


            input.style.left = point.x + "px";
            input.style.top = point.y + "px";


            show();
            timer = setInterval(toggle, 500);


            //更新控件
            target.invalidate();
        };


        //输入字符
        function oninput(text) {

            if (ime >= 0) //输入法
            {
                var value = text.charAt(ime);

                if (value >= "A" && value <= "z")
                {
                    return;
                }

                if (++ime >= text.length)
                {
                    ime = 0;
                    input.value = "";
                }

                text = value;
            }
            else
            {
                ime = 0;
                input.value = "";
            }


            textMetrics.replace(text);
            update.call(this);
        };

        //移动
        function move(selectionTo, textIndex, selected) {

            if (selectionTo)
            {
                textMetrics.selectionTo(textIndex);
                reset();
            }
            else
            {
                textMetrics.moveTo(selected && textMetrics.selectedText ? textMetrics.caretEnd.textIndex : textIndex);
                update.call(this);
            }
        };


        input.onkeypress = function (event) {

            ime = -1; //开启输入法时不会触发
            event.stopPropagation();
        };

        input.onkeyup = function (event) {

            event.stopPropagation();


            var keyCode = event.keyCode;

            switch (keyCode)
            {
                case 8: //BackSpace
                    textMetrics.remove(-1);
                    update.call(this);
                    return;

                case 33: //Prior:
                case 37: //Left:
                    move.call(this, event.shiftKey, textMetrics.caretEnd.textIndex - 1, true);
                    return;

                case 34: //Next:
                case 39: //Right:
                    move.call(this, event.shiftKey, textMetrics.caretEnd.textIndex + 1, true);
                    return;

                case 35: //End:
                    move.call(this, event.shiftKey, textMetrics.text.length);
                    return;

                case 36: //Home:
                    move.call(this, event.shiftKey, 0);
                    return;

                case 38: //Up:
                    return;

                case 40: //Down:
                    return;

                case 46: //Delete
                    textMetrics.remove(1);
                    update.call(this);
                    return;
            }


            if (event.ctrlKey)
            {
                switch (keyCode)
                {

                    case 65: //a A
                        textMetrics.moveTo(0);
                        textMetrics.selectionTo(textMetrics.text.length);
                        reset();
                        return;

                    case 67: //c C
                        return;

                    case 86: //v V
                        textMetrics.replace(input.value);
                        input.value = "";
                        update.call(this);
                        return;

                    case 88: //x X
                        textMetrics.remove(0);
                        update.call(this);
                        return;

                        //case 90: //z Z //undo redo 暂未实现
                        //    return;
                }
            }


            if (keyCode != 17 && !input.readOnly && input.value) //不处理ctrl键
            {
                oninput.call(this, input.value);
            }
        };




        //变更插入符位置
        this["fn:caret"] = function (changedX, changedY) {

            if (boxModel)
            {
                point.x -= changedX;
                point.y -= changedY;

                show();
            }
        };


        //打开输入助手
        this["fn:open:input"] = function (ownerControl, readOnly) {

            target = ownerControl;
            boxModel = ownerControl["x:boxModel"];
            textMetrics = ownerControl["x:textMetrics"];

            input.readOnly = readOnly;
            reset();
        };

        //重置输入助手
        var reset = this["fn:input"] = function () {

            input.focus();
            input.value = textMetrics.selectedText;
            input.select();

            update.call(this);
        };

        //关闭输入助手
        this["fn:close:input"] = function () {

            if (timer)
            {
                clearInterval(timer);
                timer = null;
            }

            div.style.visibility = "hidden";
            input.blur();
        };


    };



});





﻿//主窗口
$.class("Window", $.WindowBase, function ($) {



    this.create = function (parentNode) {


        var domHost = this.domHost = document.createElement("div");

        domHost.setAttribute("flyingon", "window.host");
        domHost.setAttribute("style", "position:relative;width:100%;height:100%;overflow:hidden;");

        //添加窗口
        domHost.appendChild(this.domWindow);

        //添加至指定dom
        (parentNode || document.body).appendChild(domHost);



        //定义主窗口变更
        $.defineVariable(this, "mainWindow", this, false, true);

        //设为活动窗口
        this.activate();


        //绑定resize事件
        var self = this;
        window.addEventListener("resize", function (e) { self.update(); }, true);
    };





    //重新绘制
    this.update = function () {


        this["fn:fill"](true);


        var storage = this["x:storage"],
            width = storage.width,
            height = storage.height,

            layers = this.layers,
            i = 0,
            length = layers.length;


        while (i < length)
        {
            var layer = layers[i++],
                box = layer["x:boxModel"];

            layer.unregistryUpdate();
            layer.domCanvas.width = width; //清空画布
            layer.domCanvas.height = height;

            box.setUsableRect(null, 0, 0, width, height);
            box.render(layer.context);
        }

    };



});





﻿

//窗口标题栏
$.class("WindowTitleBar", $.Panel, function ($) {


    this.create = function () {


        this["button:icon"] = button.call(this, "left", "window-icon");

        this["button:close"] = button.call(this, "right", "window-close", function (event) {

            this.ownerWindow.close();
        });

        this["button:maximize"] = button.call(this, "right", "window-maximize", function (event) {

            this.ownerWindow.close();
        });

        this["button:minimize"] = button.call(this, "right", "window-minimize", function (event) {

            this.ownerWindow.close();
        });


        this.addEventListener("mousedown", mousedown);
        this.addEventListener("mousemove", mousemove);
        this.addEventListener("mouseup", mouseup);
    };



    this.setDefaultValue("focusable", false);

    this.setDefaultValue("height", 25);

    this.setDefaultValue("layout", "dock");




    function button(dock, styleKey, click) {

        var result = new $.PictureBox();

        result.dock = dock;
        result.width = 20;
        result.styleKey = styleKey;

        if (click)
        {
            result.onclick = click;
        }

        this["x:children"].append(result);
        return result;
    };


    var offsetX, offsetY;

    function translate(mainWindow, left, top) {

        if (left < 0)
        {
            left = 0;
        }
        else if (left > mainWindow["x:storage"].width)
        {
            left = mainWindow["x:storage"].width - 4;
        }

        if (top < 0)
        {
            top = 0;
        }
        else if (top > mainWindow["x:storage"].height)
        {
            top = mainWindow["x:storage"].height - 4;
        }

        return { left: left, top: top };
    };

    function mousedown(event) {

        var ownerWindow = this.ownerWindow,
            storage = ownerWindow["x:storage"],
            p = translate(ownerWindow.mainWindow, storage.left, storage.top);


        offsetX = p.left - event.clientX;
        offsetY = p.top - event.clientY;

        ownerWindow["x:captureControl"] = this; //捕获鼠标
    };

    function mousemove(event) {

        if (event.mouseDown)
        {
            var ownerWindow = this.ownerWindow,
                storage = ownerWindow["x:storage"],
                style = ownerWindow.domWindow.style;


            storage.left = event.clientX + offsetX,
            storage.top = event.clientY + offsetY;

            var p = translate(ownerWindow.mainWindow, storage.left, storage.top);

            style.left = p.left + "px";
            style.top = p.top + "px";
        }
    };

    function mouseup(event) {

        this.ownerWindow["x:captureControl"] = null;
    };


});




//子窗口
$.class("ChildWindow", $.WindowBase, function ($) {




    this.create = function () {


        this.onlocationchange = function (event) {

            this.domWindow.style[event.name] = event.value + "px";
        };


        this.titleBar = this.createTitleBar() || new $.WindowTitleBar();
        this.titleBar["x:parent"] = this;
    };


    //创建标题栏
    this.createTitleBar = function () {

        return null;
    };




    this.defineProperty("width", 640);

    this.defineProperty("height", 480);

    this.defineProperty("fullMode", false, "this['x:resize'] = true");

    //窗口起始位置 center:居中  manual:自定义
    this.defineProperty("startPosition", "center");




    this.defineEvent("closing");

    this.defineEvent("closed");




    this.getControlAt = function (x, y) {

        //判断滚动条
        if (this.titleBar.hitTest(x, y))
        {
            return this.titleBar.getControlAt(x, y);
        }

        return $.ChildWindow.super.getControlAt.call(this, x, y);
    };



    var center;

    function show(parentWindow, modalWindow) {


        if (!parentWindow)
        {
            throw new Error("parentWindow not allow null!");
        }


        var children = parentWindow["x:windows"];
        if (!children)
        {
            throw new Error("parentWindow is not a flyingon.WindowBase object!");
        }


        children.push(this);

        $.defineVariable(this, "parentWindow", parentWindow, true, true);
        $.defineVariable(this, "mainWindow", parentWindow.mainWindow, true, true);


        var domHost = this.mainWindow.domHost;

        //如果是模式窗口则添加遮罩层
        if (modalWindow)
        {
            domHost.appendChild(this.domMask);
        }

        domHost.appendChild(this.domWindow);


        center = this["x:storage"].startPosition == "center";

        this.activate(true);
        this.update();
    };

    this.show = function (parentWindow) {

        show.call(this, parentWindow, false);
    };

    this.showDialog = function (parentWindow) {

        show.call(this, parentWindow, true);
    };




    this["fn:activate"] = function () {

        this.titleBar["x:boxModel"].render(this.context);

        $.ChildWindow.super["fn:activate"].call(this);
    };

    this["fn:deactivate"] = function () {

        this.titleBar["x:boxModel"].render(this.context);

        $.ChildWindow.super["fn:deactivate"].call(this);
    };



    this.close = function () {

        var parentWindow = this.parentWindow;

        if (parentWindow)
        {
            var index = parentWindow["x:windows"].indexOf(this);

            if (index >= 0 && this.dispatchEvent("closing"))
            {
                var domHost = this.mainWindow.domHost;

                domHost.removeChild(this.domWindow);

                if (this.domMask.parentNode)
                {
                    domHost.removeChild(this.domMask);
                }

                parentWindow["x:windows"].splice(index, 1);

                $.defineVariable(this, "parentWindow", null, true, true);
                $.defineVariable(this, "mainWindow", null, true, true);

                this.dispatchEvent("closed");


                parentWindow.activate(false);
            }
        }

        this.dispose();
    };




    this["fn:before:measure"] = function (boxModel) {


        var storage = this["x:storage"],
            titleBar = this.titleBar,

            y = titleBar["x:storage"].height,

            width = storage.width,
            height = storage.height,

            style = this.domWindow.style;


        if (center)
        {
            var rect = this["fn:fill"](storage.fullMode);

            storage.left = Math.round((rect.width - width) / 2);
            storage.top = Math.round((rect.height - height) / 2);

            center = false;
        }


        style.left = storage.left + "px";
        style.top = storage.top + "px";
        style.width = width + "px";
        style.height = height + "px";


        //处理标题栏
        boxModel.children = null;
        titleBar["x:boxModel"].setUsableRect(boxModel, 0, 0, width, y, true);


        //绘制窗口内容
        var layers = this.layers,
            i = 0,
            length = layers.length;

        while (i < length)
        {
            var layer = layers[i++];

            layer["x:boxModel"].setUsableRect(null, 0, y, width, height - y);

            layer.domCanvas.width = width; //清空画布
            layer.domCanvas.height = height;
        }
    };



    //绘制内框
    this.paint = function (context) {

        //绘制窗口内容
        var layers = this.layers,
            i = 1,
            length = layers.length;


        while (i < length)
        {
            var layer = layers[i++];

            layer.unregistryUpdate();
            layer["x:boxModel"].render(layer.context);
        }

        $.ChildWindow.super.paint.call(this, context);
    };



});





﻿



﻿



﻿/// <reference path="../Base/Core.js" />
/// <reference path="Control.js" />



//文本框代码实现
var TextBase = function (multiline) {



    this.setDefaultValue("text", "");


    this.defineProperty("readOnly", false);




    this.defineProperty("selectionStart", 0, {

        getter: function () {

            return (this["x:textMetrics"] && this["x:textMetrics"].selectionStart) || 0;
        },

        setter: function (value) {

            if (this.ownerWindow && this.ownerWindow["x:focusControl"] == this)
            {
                this["x:textMetrics"].moveTo(value);
            }
        }
    });


    this.defineProperty("selectionLength", 0, {

        getter: function () {

            var textMetrics = this["x:textMetrics"];
            return textMetrics ? textMetrics.selectionEnd - textMetrics.selectionStart : 0;
        },

        setter: function (value) {

            if (this.ownerWindow && this.ownerWindow["x:focusControl"] == this)
            {
                if (value < 0)
                {
                    value = 0;
                }

                var textMetrics = this["x:textMetrics"];
                textMetrics.selectionTo(textMetrics.selectionStart + value);
            }
        }
    });


    this.defineProperty("selectedText", undefined, {

        readOnly: true,
        getter: function () {

            return this["x:textMetrics"].selectedText;
        }
    });







    this["fn:focus"] = function (event) {

        if (this.focus())
        {
            var ownerWindow = this.ownerWindow,
                textMetrics = this["x:textMetrics"];

            if (event || !this.containsFocused || !textMetrics.caretEnd)
            {
                var x = event ? event.controlX : 0,
                    y = event ? event.controlY : 0;

                textMetrics.moveAt(x, y);
            }


            //开启输入助手
            ownerWindow["fn:open:input"](this, this["x:storage"].readOnly);
        }
    };

    this["fn:blur"] = function () {

        if (this.blur())
        {
            this.ownerWindow["fn:close:input"]();
        }
    };




    this.handleMouseDown = function (event) {

        this.ownerWindow["x:captureControl"] = this; //捕获鼠标
    };

    this.handleMouseMove = function (event) {

        if (event.mouseDown && this.ownerWindow["x:focusControl"] == this)
        {
            var textMetrics = this["x:textMetrics"],
                x = event.targetX;


            if (x >= this["x:boxModel"].innerRect.right)
            {
                textMetrics.selectionTo(textMetrics.selectionEnd + 1, true);
            }
            else if (x <= 0)
            {
                textMetrics.selectionTo(textMetrics.selectionStart - 1, true);
            }
            else
            {
                textMetrics.selectionAt(event.controlX, event.controlY, true);
            }


            this.ownerWindow["fn:input"]();
        }
    };

    this.handleMouseUp = function (event) {

        var ownerWindow = this.ownerWindow;

        if (ownerWindow)
        {
            if (ownerWindow["x:focusControl"] == this)
            {
                ownerWindow["fn:input"]();
            }

            //释放鼠标
            ownerWindow["x:captureControl"] = null;
        }
    };




    this.defineEvent("textchanging");

    this.defineEvent("textchanged");





    this.paintTextBackground = function (context) {

        var textMetrics = this["x:textMetrics"];

        if (textMetrics.selectionEnd > textMetrics.selectionStart)
        {
            var boxModel = context.boxModel,
                rect = boxModel.innerRect,
                start = textMetrics.caretMin,
                end = textMetrics.caretMax;

            context.fillStyle = "#A9E2F3";// "#E6E6E6";
            context.fillRect(rect.windowX + start.x - boxModel.scrollLeft, rect.windowY, end.x - start.x, 16);
        }
    };

};








﻿/// <reference path="../Base/Core.js" />
/// <reference path="Control.js" />


/*

*/
$.class("TextBoxBase", $.Control, function ($) {




    this.create = function () {

        this.addEventListener("mousedown", this.handleMouseDown);
        this.addEventListener("mousemove", this.handleMouseMove);
        this.addEventListener("mouseup", this.handleMouseUp);
    };



    this.setDefaultValue("width", 100);

    this.setDefaultValue("height", 21);

    this.setDefaultValue("multiline", false);



    TextBase.call(this, false);


});









﻿/// <reference path="../Base/Core.js" />
/// <reference path="Control.js" />


/*

*/
$.class("TextButtonBase", $.TextBoxBase, function ($) {



    this.defineProperty("items", []);


    this.defineProperty("showButton", true, "measure");



    this.measure = function (boxModel) {

        var innerRect = boxModel.innerRect,
            imageRect = boxModel.imageRect;

        if (!imageRect)
        {
            imageRect = boxModel.imageRect = new $.Rect();
        }

        imageRect.x = innerRect.x;
        imageRect.y = innerRect.y;


        if (this["x:storage"].showButton)
        {
            innerRect.width -= 16;

            imageRect.canvasX = innerRect.canvasX + innerRect.width;
            imageRect.canvasY = innerRect.canvasY;

            imageRect.width = 16;
            imageRect.height = innerRect.height;
        }
        else
        {
            imageRect.width = 0;
            imageRect.height = 0;
        }
    };



    //绘制内框
    this.paint = function (context) {

        this.paintText(context);
        this.paintImage(context);
    };

    this.paintImage = function (context) {

        var imageRect = context.boxModel.imageRect;

        if (imageRect.width > 0)
        {
            context.fillStyle = "blue";
            context.fillRect(imageRect.canvasX, imageRect.canvasY, imageRect.width, imageRect.height);
        }
    };


});





﻿/// <reference path="../Base/Core.js" />
/// <reference path="Control.js" />


/*

*/
$.class("TextBox", $.TextBoxBase, function ($) {







});





﻿



﻿



﻿



﻿



﻿



﻿



﻿



﻿



﻿



﻿



﻿/// <reference path="../Base/Core.js" />
/// <reference path="Control.js" />


/*

*/
$.class("PictureBox", $.Control, function ($) {



    this.defineProperty("image", null, "invalidate|style");


    //绘制内框
    this.paint = function (context) {

        this.paintImage(context);
        this.paintText(context);
    };

    this.paintImage = function (context) {

        var image = this.image;

        if (image)
        {
            if (image.constructor == String && (image = $.images[image]) == null)
            {
                return;
            }

            var rect = context.boxModel.innerRect;
            context.drawImage(image, rect.windowX, rect.windowY);
        }
    };


});



﻿



﻿/// <reference path="../Base/Core.js" />
/// <reference path="Control.js" />


/*

*/
$.class("ComboBox", $.TextButtonBase, function ($) {



    this.defineProperty("items", []);



});





﻿/// <reference path="../Base/Core.js" />
/// <reference path="Control.js" />


/*

*/
$.class("Memo", $.ScrollableControl, function ($) {



    this.create = function () {

        this.addEventListener("mousedown", this.handleMouseDown);
        this.addEventListener("mousemove", this.handleMouseMove);
        this.addEventListener("mouseup", this.handleMouseUp);
    };




    this.setDefaultValue("width", 200);

    this.setDefaultValue("height", 40);

    this.setDefaultValue("multiline", true);



    this.defineProperty("textWrap", false, "measure");




    TextBase.call(this, true);




});





﻿/*

*/
$.class("Button", $.Control, function ($) {



    this.setDefaultValue("width", 100);

    this.setDefaultValue("height", 21);


});





﻿/*

*/
$.class("TextBlock", $.Control, function ($) {



});









})(flyingon);