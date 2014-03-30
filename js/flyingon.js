"use strict";
///以上代码启用严格模式

//注意页面渲染模式设置, 否则IE启用了兼容模式时可能无法执行脚本
//<!--以IE的当前版本渲染,如果安装了ChromeFrame则优先使用-->
//<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />

/*

*/




//根命名空间
var flyingon = flyingon || {};


//全局设定
var flyingon_setting = flyingon_setting || {


    //版本
    version: "0.0.0.1",

    //语言
    language: "zh-CHS",

    //不支持html5提醒
    html5_not_surpport: "对不起,需要支持Html5特性的浏览器才可以运行本系统!",

    //定义类出错提醒
    define_class_error: "定义类{0}出错!"

};





//特性支持判断
(function (flyingon) {


    var support = flyingon.support = {};


    //是否ie ie不对"\v"作转义处理
    support.ie = !+"\v1";


    //是否支持canvas
    support.canvas = document && (function () {

        var dom = document.createElement("canvas");

        if (!dom.getContext)
        {
            alert(flyingon_setting.html5_not_surpport);
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




//扩展函数
(function (flyingon) {


    var prototype = String.prototype;


    //增加字符串顺序格式化支持
    prototype.format = function () {

        return arguments.length == 0 ? this : this.replace(/\{\d+\}/g, function (key) {

            return arguments[key.substring(1, key.length - 1)] || "";
        });
    };


    //增加字符串名字格式化支持
    prototype.format_name = function (value) {

        return !value ? this : this.replace(/\{\w+\}/g, function (key) {

            return value[key.substring(1, key.length - 1)] || "";
        });
    };

    //增加字符串顺序格式化支持
    prototype.trim = function () {

        return arguments.length == 0 ? this : this.replace(/^\s+|\s+$/g, "");
    };




    prototype = Array.prototype;

    //移除指定项
    prototype.remove = function (item) {

        var index = this.indexOf(item);
        if (index >= 0)
        {
            this.splice(index, 1);
        }
    };

    //移除指定索引
    prototype.removeAt = function (index) {

        this.splice(index, 1);
    };

    //清空
    prototype.clear = function () {

        if (this.length > 0)
        {
            this.splice(0, this.length);
        }
    };

    //二分法搜索
    prototype.binary_search = function (value, start, end) {

        var flag = typeof value != "function";

        start = start || 0;
        end = end || this.length - 1;

        while (start <= end)
        {
            var index = (start + end) >> 1,
                result = flag ? this[index] - value : value.call(this, index);

            if (result < 0)
            {
                start = index + 1;
            }
            else if (result > 0)
            {
                end = index - 1;
            }
            else
            {
                return index;
            }
        }

        return -1;
    };

    //二分法搜索区间
    prototype.binary_between = function (value, start, end) {

        var flag = typeof value != "function";

        start = start || 0;
        end = end || this.length - 1;

        while (start <= end)
        {
            var index = (start + end) >> 1,
                result = flag ? this[index] - value : value.call(this, index);

            if (result > 0)
            {
                end = index - 1;
            }
            else if (result < 0)
            {
                if (index >= end)
                {
                    return end;
                }

                if ((flag ? this[index + 1] - value : value.call(this, index + 1)) > 0)
                {
                    return index;
                }

                start = index + 1;
            }
            else
            {
                return index;
            }
        }

        return -1;
    };


    //生成伪数组对象
    //此方法主要作为某些仿数组对象的原型
    //注: 直接使用[]作为原型在ie6时会出错(无法更改length值), 用此方法原型链也会短一些, 但创建时性能会差一些
    flyingon.__pseudo_array__ = function () {

        var result = { length: 0 },
            prototype = Array.prototype;

        ["indexOf", "lastIndexOf", "push", "pop", "shift", "unshift", "splice", "join", "slice", "forEach", "sort", "concat", "toString", "toLocaleString", "remove", "removeAt", "clear", "binary_between", "binary_search"].forEach(function (name) {

            this[name] = prototype[name];

        }, result);

        return result;
    };



    var for_data = {};

    //循环执行指定函数
    for_data.for_execute = function (fn) {

        var result;

        for (var i = 0, length = this.length; i < length; i++)
        {
            if ((result = fn(this[i], i)) !== undefined)
            {
                return result;
            }
        }
    };

    //以apply的方式循环调用指定名称的方法
    for_data.for_apply = function (name, parameters) {

        var result,
            item,
            fn;

        for (var i = 0, length = this.length; i < length; i++)
        {
            if ((item = this[i]) && (fn = item[name]))
            {
                if ((result = fn.apply(item, parameters)) !== undefined)
                {
                    return result;
                }
            }
        }
    };

    //循环检查指定方法是否具有指定的返回值
    for_data.for_has = function (name, value, parameters) {

        var item,
            fn;

        for (var i = 0, length = this.length; i < length; i++)
        {
            if ((item = this[i]) && (fn = item[name]) && fn.apply(item, parameters) === value)
            {
                return true;
            }
        }

        return false;
    };

    //循环检查指定属性是否具有指定值
    for_data.for_exist = function (name, value) {

        var item;

        for (var i = 0, length = this.length; i < length; i++)
        {
            if ((item = this[i]) && (item[name] === value))
            {
                return true;
            }
        }

        return false;
    };

    //循环获取指定属性值或给指定属性赋值
    for_data.for_value = function (name, value) {

        var item;

        if (value === undefined)
        {
            for (var i = 0, length = this.length; i < length; i++)
            {
                if ((item = this[i]) && (item = item[name]) !== undefined)
                {
                    return item;
                }
            }

            return undefined;
        }

        for (var i = 0, length = this.length; i < length; i++)
        {
            if (item = this[i])
            {
                item[name] = value;
            }
        }
    };



    //给指定对象扩展for相关方法
    flyingon.for_extend = function (target) {

        if (target)
        {
            for (var name in for_data)
            {
                target[name] = for_data[name];
            }
        }

    };




    Image.prototype.toDataUrl = function () {

        var canvas = document.createElement("canvas");

        canvas.width = this.width;
        canvas.height = this.height;
        canvas.getContext("2d").drawImage(this, 0, 0);

        return canvas.toDataURL("image/png");
    };




    prototype = Function.prototype;

    //获取函数内容
    prototype.get_body = function () {

        var result = this.toString();
        return result.substring(result.indexOf("{") + 1, result.lastIndexOf("}"))
    };

    //获取函数参数
    prototype.get_parameters = function () {

        if (this.length > 0)
        {
            var result = this.toString();

            result = result.match(/\([^)]*\)/)[0];
            result = result.substring(1, result.length - 1).replace(/\s+/, "");;

            return result.split(",");
        }

        return [];
    };

    //合并函数内容生成新函数
    prototype.merge = function (body, insertBefore, parameters) {

        if (body)
        {
            body = typeof body == "function" ? body.get_body() : "" + body;
            body = insertBefore ? body + this.get_body() : this.get_body() + body;

            return new Function(parameters || this.get_parameters(), body);
        }

        return this;
    };

    //替换函数内容生成新函数
    prototype.replace = function (key, value, parameters) {

        if (key)
        {
            var body = this.get_body().replace(key, value);
            return new Function(parameters || this.get_parameters(), body);
        }

        return this;
    };



})(flyingon);




//通用函数区
(function (flyingon) {



    //转换字符串为整数 支持"%"
    flyingon.parseInt = function (value, total) {

        if ((value = "" + value) && value[value.length - 1] == "%")
        {
            return Math.floor(parseFloat(value) * total / 100);
        }

        return parseInt(value);
    };

    //转换字符串为浮点数 支持"%"
    flyingon.parseFloat = function (value, total) {

        if ((value = "" + value) && value[value.length - 1] == "%")
        {
            return parseFloat(value) * total / 100;
        }

        return parseFloat(value);
    };



    //编码对象
    flyingon.encode = function (data) {

        if (data)
        {
            var values = [],
                encode = encodeURIComponent;

            for (var name in data)
            {
                values.push(encode(name) + "=" + encode((data[name].toString())));
            }

            return values.length > 0 ? values.join("&") : data.toString();
        }

        return data;
    };

    //url编码
    flyingon.encodeURL = function (url, data) {

        if (url && data)
        {
            var values = [],
                encode = encodeURIComponent;

            for (var name in data)
            {
                values.push(encode(name) + "=" + encode((data[name].toString())));
            }

            return url + "?" + (values.length > 0 ? values.join("&") : data.toString());
        }

        return url;
    };

    //解析json数据
    flyingon.parseJson = (window.JSON && window.JSON.parse) || function (data) {

        return ("(" + data + ")");
    };



    //定义变量
    flyingon.defineVariable = function (target, name, value) {

        //target[name] = value;
        Object.defineProperty(target, name, {

            value: value,
            writable: false,
            configurable: true,
            enumerable: true
        });
    };

    //定义属性
    //注: 使用些方式定义属性时,以chrome中如果访问带特殊字符的变量(如:this.__name__)时性能很差
    flyingon.defineProperty = flyingon.support.defineProperty ? function (target, name, getter, setter) {

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



})(flyingon);




//名字空间及类实现
(function (flyingon) {


    var namespace_list = { "flyingon": flyingon }, //缓存命名空间

        class_list = flyingon.__registry_class_list__ = {}, //已注册类型集合

        RootObject = flyingon.RootObject = function () { }, //根类

        self = this; //记下根对象



    //注册类型
    flyingon.registry_class = function (Class, fullTypeName) {

        class_list[fullTypeName || Class.__fullTypeName__] = Class;
    };

    //注销类型
    flyingon.unregistry_class = function (fullTypeName) {

        delete class_list[fullTypeName];
    };

    //获取注册的类型
    flyingon.get_regsitry_class = function (fullTypeName) {

        return class_list[fullTypeName];
    };




    //名字空间类
    function namespace_fn(name) {

        //名字空间名
        this.name = name;

        //缓存
        namespace_list[name] = this;
    };


    //创建或切换名字空间方法
    flyingon.namespace = function (namespace, fn) {


        var result = namespace;


        if (result)
        {
            if (result.constructor == String && !(result = namespace_list[result]))
            {
                result = self;

                var names = namespace.split("."),
                    name,
                    value;

                for (var i = 0, length = names.length; i < length; i++)
                {
                    if (name = names[i])
                    {
                        value = (value && value + "." + name) || name;
                        result = result[name] || (result[name] = new namespace_fn(value));
                    }
                }
            }
        }
        else
        {
            result = flyingon;
        }


        if (fn)
        {
            fn.call(result, flyingon);
        }


        return result;
    };



    //初始化类型系统
    function initialize(namespace, Class, typeName) {


        var prototype = Class.prototype,
            fullTypeName = namespace.name ? namespace.name + "." + typeName : typeName;


        //绑定类型
        prototype.__type__ = Class;

        //获取当前类型
        prototype.getType = function () {

            return Class;
        };

        Class.namesapce = prototype.__namespace__ = namespace;
        Class.typeName = prototype.__typeName__ = typeName;
        Class.fullTypeName = prototype.__fullTypeName__ = fullTypeName;



        //输出及注册类
        namespace[typeName] = class_list[fullTypeName] = Class;


        prototype.toString = prototype.toLocaleString = function () {

            return "[object " + this.__fullTypeName__ + "]";
        };

    };



    //初始化根类
    initialize(flyingon, RootObject, "RootObject");




    //定义类方法
    //class_fn: 类型扩展函数 共有三个参数 Class:当前类型 base:父类 flyingon:系统对象 
    //constructor_merge: 是否合并构造函数 true:合并构造函数内容以提升性能 如果构造函数中有局部变量则不可设成true 默认为false
    flyingon.defineClass = namespace_fn.prototype.defineClass = function (typeName, superclass, class_fn, constructor_merge) {


        //处理参数
        if (!class_fn || typeof class_fn == "boolean")
        {
            class_fn = superclass;
            superclass = RootObject;
        }
        else if (!superclass) //没有指定基类
        {
            superclass = RootObject;
        }

        if (!typeName || typeof class_fn != "function")
        {
            throw new Error(flyingon_setting.define_class_error.format(typeName));
        }



        //定义类模板 Class.create为构造函数
        var Class = function () {

            var fn = Class.create;
            if (fn)
            {
                fn.apply(this, arguments);
            }
        };



        //创建类原型
        var prototype = Class.prototype = Object.create(superclass.prototype);

        //父类
        Class.superclass = superclass;

        //父类原型
        Class.base = superclass.prototype;

        //子类集合
        (superclass.subtypes || (superclass.subtypes = [])).push(Class);

        //构造函数/所属类型
        prototype.constructor = Class;
        //默认值
        prototype.__defaults__ = Class.__defaults__ = Object.create(superclass.__defaults__ || null);

        //初始化类型系统
        initialize(this, Class, typeName);


        //扩展
        class_fn.call(prototype, Class, Class.base, flyingon);



        //处理构造函数(自动调用父类的构造函数)
        var superclass_create = superclass.create;
        if (superclass_create)
        {
            var Class_create = Class.create,
                create_list = superclass.__create_list__;

            if (Class_create)
            {
                //合并构造函数以提升性能 注:已有构造链时不可以合并
                if (!create_list && constructor_merge)
                {
                    Class.create = Class_create.merge(superclass_create, true);
                }
                else //生成构造链
                {
                    create_list = Class.__create_list__ = create_list ? create_list.slice(0) : [superclass_create];
                    create_list.push(Class_create);

                    Class.create = function () {

                        var list = Class.__create_list__;
                        for (var i = 0, length = list.length; i < length; i++)
                        {
                            list[i].apply(this, arguments);
                        }
                    };
                }
            }
            else
            {
                if (create_list)
                {
                    Class.__create_list__ = create_list;
                }

                Class.create = superclass_create;
            }
        }


        return Class;
    };




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
(function (flyingon) {




    var prototype = (flyingon.Xml = function (data) {

        if (data)
        {
            this.parse(data);
        }

    }).prototype;




    //如果支持W3C DOM 则使用此方式创建
    if (document.implementation && document.implementation.createDocument)
    {
        prototype.parse = function (data) {

            this.dom = new DOMParser().parseFromString(data, "text/xml");
            this.root = this.dom.documentElement;

            return this;
        };

        prototype.load = function (file) {

            this.dom = document.implementation.createDocument('', '', null);
            this.dom.load(file);
            this.root = this.dom.documentElement;

            return this;
        };

        prototype.serialize = function () {

            return new XMLSerializer().serializeToString(this.dom);
        };
    }
    else if (window.ActiveXObject) //IE使用ActiveX方式创建
    {
        prototype.parse = function (data) {

            this.dom = new ActiveXObject("Microsoft.XMLDOM");
            this.dom.async = "false";
            this.dom.loadXML(data);
            this.root = this.dom.documentElement;

            return this.dom;
        };

        prototype.load = function (file) {

            this.dom = new ActiveXObject('Microsoft.XMLDOM');
            this.dom.async = false;
            this.dom.load(file);
            this.root = this.dom.documentElement;

            return this.dom;
        };

        prototype.serialize = function () {

            return this.dom.xml;
        };
    }
    else
    {
        throw "you browse does not support w3c xml api!";
    }





    /**************************扩展Xml解析方法****************************/


    var encode_keys = {

        "<": "&lt;",
        ">": "&gt;",
        "\"": "&quot;",
        "'": "&apos;",
        " ": "&nbsp;",
        "&": "&amp;"
    },

    decode_keys = {

        "&lt;": "<",
        "&gt;": ">",
        "&quot;": "\"",
        "&apos;": "'",
        "&nbsp;": " ",
        "&amp;": "&"
    };


    //编码
    flyingon.encodeXml = function (data) {

        return data.replace(/[\<\>\"\' \&]/g, function (key) {

            return encode_keys[key];
        });
    };

    //解码
    flyingon.decodeXml = function (data) {

        return data.replace(/&lt;|&gt;|&quot;|&apos;|&nbsp;|&amp;/g, function (key) {

            return decode_keys[key];
        });
    };






    //解析Xml数据为Json对象 根节点的名称忽略
    flyingon.parseXml = function (data) {


        if (!data)
        {
            return null;
        }


        //处理空格
        data = data.replace(/^[^\<]+|[^>]+$/, "").replace(/\>\s+\</g, "><");


        var decodeXml = flyingon.decodeXml,              //解码方法
            segments = data.match(/[^<>]+|\<\/?[^<>]+\/?>/g),
            escape = /&lt;|&gt;|&quot;|&apos;|&nbsp;|&amp;/.test(data),   //是否存在需解码的字符

            node,
            name,
            type,
            value,

            nodes = [],
            types = [];


        for (var i = 0, length = segments.length; i < length; i++)
        {
            var segment = segments[i];

            if (segment[0] == "<") //如果是标签
            {
                if (!(name = segment.match(/[\w\.\:_\-\u0370-\uffff]+/)))
                {
                    throw new Error("xml tag error!");
                }

                name = name[0];

                if (segment[1] != "/") //开始标签
                {
                    if (type = segment.match(/type\s*=\s*[\"\']/))
                    {
                        var index = type.index + type[0].length,
                            type = segment.substring(index, segment.indexOf(segment[index - 1], index));
                    }
                    else if (length > i + 1) //未指定类型时有子项则为对象否则为字符串
                    {
                        var text = segments[i + 1];
                        type = text[0] == "<" && text[1] != "/" ? "object" : "string";
                    }
                    else
                    {
                        type = "string";
                    }

                    switch (type)
                    {
                        case "null":
                        case "boolean":
                        case "number":
                        case "string":
                        case "function":
                            break;

                        case "array":
                            nodes.push(node = []);
                            break;

                        case "object":
                            nodes.push(node = {});
                            break;

                        default:
                            nodes.push(node = {});
                            node.type = type;
                            break;
                    }

                    types.push(type);
                }
                else //结束标签
                {
                    switch (types.pop())
                    {
                        case "null":
                            value = null;
                            break;

                        case "boolean":
                            value = !!value;
                            break;

                        case "number":
                            value = parseFloat(value);
                            break;

                        case "string":
                            break;

                        case "function":
                            value = new Function(value);
                            break;

                        default: //对象或数组
                            value = nodes.pop();

                            //根节点时返回(不处理根节点名称)
                            if (nodes.length == 0)
                            {
                                return value;
                            }

                            node = nodes[nodes.length - 1];
                            break;
                    }

                    if (node.constructor == Array)
                    {
                        node.push(value);
                    }
                    else
                    {
                        node[name] = value;
                    }
                }
            }
            else //否则是文本内容
            {
                value = escape && segment.charAt("&") >= 0 ? decodeXml(segment) : segment;
            }
        }


        return node;
    };




})(flyingon);



﻿
///使用表单提交数据
///在使用ajax进行post提交的时候 在IE6-8的浏览器中可能会出现问题, 使用表单的方式提交比较安全
///此方法不支持进度及同步
(function (flyingon) {


    var id = 0,
        items = []; //缓存池


    function form() {

        this.host = document.createElement("div");
        this.form = document.createElement("form");
        this.iframe = document.createElement("iframe");

        this.host.id = "__submit_host_" + (++id) + "__";
        //this.host.style.display = "none";

        this.iframe.name = "__submit_iframe__";
        this.iframe.src = "about:blank";

        this.form.name = "__submit_form__";
        this.form.target = "__submit_iframe__";

        this.host.appendChild(this.iframe);
        this.host.appendChild(this.form);

        document.documentElement.children[0].appendChild(this.host);

        this.iframe.contentWindow.name = "__submit_iframe__"; //解决IE6在新窗口打开的BUG
    };

    function get_form(options) {

        var result = items.length > 0 ? items.pop() : new form();

        result.iframe.onload = function fn(event) {

            if (result.iframe.attachEvent) //注销事件
            {
                result.iframe.detachEvent("onload", fn);
            }

            response(result.iframe, options);

            result.form.innerHTML = "";
            result.iframe.innerHTML = "";

            items.push(result);
        };

        if (result.iframe.attachEvent) //解决IE6不能触发onload事件的bug
        {
            result.iframe.attachEvent("onload", result.iframe.onload);
            result.iframe.onload = null;
        }

        return result.form;
    };


    function response(iframe, options) {


        var body = iframe.contentWindow.document.body,
            fn;


        try
        {
            options.responseText = body.innerHTML;

            switch (options.dataType)
            {
                case "json":
                case "text/json":
                    options.response = flyingon.parseJson(options.responseText);
                    break;

                case "script":
                case "javascript":
                case "text/script":
                case "text/javascript":
                    options.response = eval(options.responseText);
                    break;

                case "xml":
                case "text/xml":
                    options.response = body.children[0];
                    break;

                default:
                    options.response = options.responseText;
                    break;
            }

            if (fn = options.success)
            {
                fn.call(options, options.response);
            }
        }
        catch (error)
        {
            if (fn = (options.error || flyingon.show_error))
            {
                fn.call(options, options.responseText);
            }
            else
            {
                alert(error);
            }
        }


        if (fn = options.complete)
        {
            fn.call(options, options.response);
        }


        this.innerHTML = "";
    };

    /*
    {
    
        action: "http://www.xxx.com"
    
        method: "post",

        dataType: "text/plain",

        enctype: "application/x-www-form-urlencoded"
    
        success: function(response) {
    
        },
    
        error: function (responseText) {
    
            alert(responseText);
        },

        complete: function(response) {
    
        }
    }
    */
    flyingon.ajax_submit = function (options) {

        var form = get_form(options);

        form.action = options.action;
        form.method = options.method || "post";
        form.enctype = options.enctype || "application/x-www-form-urlencoded";

        var data = options.data;
        if (data)
        {
            for (var name in data)
            {
                var input = document.createElement("input");

                input.name = name;
                input.type = "hidden";
                input.value = data[name];

                form.appendChild(input);
            }
        }

        form.submit();
    };


})(flyingon);



﻿
///Ajax实现
(function (flyingon) {


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
            if (typeof XMLHttpRequest !== "undefined")
            {
                return (ajax_fn = function () { return new XMLHttpRequest(); })();
            }

            if (typeof ActiveXObject !== "undefined")
            {
                var items = [

                    "MSXML2.XMLHTTP.4.0",
                    "MSXML2.XMLHTTP",
                    "Microsoft.XMLHTTP"

                ], result;

                for (var i = 0; i < items.length; i++)
                {
                    try
                    {
                        if (result = (ajax_fn = function () { return new ActiveXObject(items[i]); })())
                        {
                            return result;
                        }
                    }
                    catch (error)
                    {
                    }
                }
            }

            if (window.createRequest)
            {
                return (ajax_fn = window.createRequest)();
            }

            throw new Error('XMLHttpRequest is not available!');
        }

        return ajax_fn();
    };



    function response(request, options) {

        var fn;

        if (request.readyState == 4)
        {
            if (options.timer)
            {
                clearTimeout(options.timer);
                delete options.timer;
            }


            options.responseText = request.responseText;

            if (request.status < 300)
            {
                try
                {
                    switch (options.dataType || defaults.dataType)
                    {
                        case "json":
                        case "text/json":
                            options.response = flyingon.parseJson(options.responseText);
                            break;

                        case "script":
                        case "javascript":
                        case "text/script":
                        case "text/javascript":
                            options.response = eval(options.responseText);
                            break;

                        case "xml":
                        case "text/xml":
                            options.response = request.responseXML;
                            break;

                        default:
                            options.response = options.responseText;
                            break;
                    }

                    if (fn = options.success)
                    {
                        fn.call(options, options.response);
                    }
                }
                catch (error)
                {
                    if (fn = (options.error || flyingon.show_error))
                    {
                        fn.call(options, options.responseText);
                    }
                    else
                    {
                        alert(error);
                    }
                }
            }
            else
            {
                options.status = request.status;
                options.statusText = request.statusText;

                if (fn = (options.error || flyingon.show_error))
                {
                    fn.call(options, options.responseText);
                }
                else
                {
                    alert(options.responseText);
                }
            }

            if (fn = options.complete)
            {
                fn.call(options, options.response);
            }
        }
        else if (fn = options.progress)
        {
            fn.call(options, options.progress_value ? ++options.progress_value : (options.progress_value = 1));
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

        progress: function(value){

        },
    
        success: function(response) {
    
        },
    
        error: function (responseText) {
    
            alert(options.status + ":" + options.statusText);
        },
    
        abort: function(responseText) {
    
        },
    
        complete: function(response) {
    
        }
    
    }
    */
    flyingon.ajax = function (options) {

        var url = options.url,
            type = options.type || defaults.type,
            data = options.data,
            request = ajax_fn ? ajax_fn() : ajax(),
            async = options.async !== false;


        if (options.timeout > 0)
        {
            options.timer = setTimeout(function () {

                request.abort();

                if (options.abort)
                {
                    options.abort(options, request);
                }

            }, options.timeout);
        }


        request.onreadystatechange = function (event) {

            response(request, options);
        };

        var post;

        switch (type)
        {
            case "POST":
            case "post":
            case "PUT":
            case "put":
                post = true;
                break;

            default:
                if (data)
                {
                    url = flyingon.encodeURL(url, data);
                    data = null;
                }
                break;
        }


        request.open(type, url, async, options.user, options.password);

        if (post)
        {
            request.setRequestHeader("Content-Type", options["contentType"] || defaults["contentType"]);

            if (data && typeof data == "object")
            {
                data = flyingon.encode(data);
                request.setRequestHeader("Content-Length", data.length);
            }
        }

        if (options.headers)
        {
            for (var name in options.headers)
            {
                request.setRequestHeader(name, options.headers[name]);
            }
        }

        request.send(data);
        return async ? request : options.response;
    };

    //get方式提交
    //注:未传入options则默认使用同步提交
    flyingon.ajax_get = function (url, dataType, options) {

        (options || (options = { async: false })).url = url;

        options.type = "GET";

        if (dataType)
        {
            options.dataType = dataType;
        }

        return flyingon.ajax(options);
    };

    //post提交 在IE6时会可能会出错 服务端可实现IHttpAsyncHandler接口解决些问题 
    //注:未传入options则默认使用同步提交
    flyingon.ajax_post = function (url, dataType, options) {

        (options || (options = { async: false })).url = url;

        options.type = "POST";

        if (dataType)
        {
            options.dataType = dataType;
        }

        return flyingon.ajax(options);
    };

    flyingon.require = function (url) {

        if (url)
        {
            var options = {

                url: url,
                type: "GET",
                dataType: "script",
                async: false
            };

            flyingon.ajax(options);
            return options.response;
        };
    };




})(flyingon);





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
        }

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





﻿//集合
//注: 此集合不是数组,不能像数组一样手动修改length的值,否则可能会出现无法预知的错误
flyingon.defineClass("Collection", function (Class, base, flyingon) {



    //引入数组的方法
    (function (target) {

        this.__indexOf__ = target.indexOf;
        this.__push__ = target.push;
        this.__splice__ = target.splice;

    }).call(this, Array.prototype);



    //子项数
    this.length = 0;



    //获取指定项的索引
    this.indexOf = function indexOf(item) {

        if (item && typeof item == "object") //缓存索引以加快检索速度
        {
            var cache = this.__index_cache__ || (this.__index_cache__ = {}),
                id = item.__uniqueId__ || (item.__uniqueId__ = ++flyingon.__uniqueId__);

            return cache[id] || (cache[id] = this.__indexOf__(item));
        }

        return this.__indexOf__(item);
    };

    //循环执行
    this.forEach = Array.prototype.forEach;


    //添加子项
    this.add = function (item) {

        var fn = this.__fn_validate__;

        if (!fn || (item = fn.call(this, this.length, item)) !== undefined)
        {
            this.__push__(item);
            return true;
        }
    };

    //添加多个子项
    this.addRange = function (items) {

        if (items && items.length > 0)
        {
            var fn = this.__fn_validate__;

            if (fn)
            {
                var item;

                for (var i = 0, length = items.length; i < length; i++)
                {
                    if ((item = fn.call(this, this.length, items[i])) !== undefined)
                    {
                        this.__push__(item);
                    }
                }
            }
            else
            {
                this.__push__.apply(this, items);
            }
        }
    };

    //在指定位置插入子项
    this.insert = function (index, item) {

        if (index >= 0)
        {
            var fn = this.__fn_validate__;

            if (!fn || (item = fn.call(this, index, item)) !== undefined)
            {
                this.__splice__(index, 0, item);
                return true;
            }
        }
    };

    //在指定位置插入多个子项
    this.insertRange = function (index, items) {

        if (index >= 0 && items && items.length > 0)
        {
            var fn = this.__fn_validate__,
                item;

            for (var i = 0, length = items.length; i < length; i++)
            {
                if (!fn || (item = fn.call(this, index, item)) !== undefined)
                {
                    this.__splice__(index++, 0, item);
                }
            }
        }
    };

    //替换指定位置的子项
    this.replace = function (index, item) {

        if (index >= 0)
        {
            var fn,
                length = this.length,
                cache = this[index];

            if (length > index && (cache = this[index]))
            {
                if ((fn = this.__fn_remove__) && fn.call(this, index, cache) === false)
                {
                    return;
                }

                if (cache = cache.__uniqueId__ && this.__index_cache__)
                {
                    delete this.__index_cache__[cache];
                }
            }

            if (!(fn = this.__fn_validate__) || (item = fn.call(this, index, item)) !== undefined)
            {
                this[index] = item;

                if (length <= index)
                {
                    this.length = index + 1;
                }

                this.__index_cache__ = null; //清空索引缓存
                return true;
            }
        }
    };

    //移除指定子项
    this.remove = function (item) {

        var index = this.indexOf(item),
            fn;

        if (index >= 0 && (!(fn = this.__fn_remove__) || fn.call(this, index, item) !== false))
        {
            this.__splice__(index, 1);

            if (item.__uniqueId__ && this.__index_cache__)
            {
                delete this.__index_cache__[item.__uniqueId__];
            }

            return true;
        }
    };

    //移除指定位置的子项
    this.removeAt = function (index) {

        var fn, item;

        if (this.length > index && (!(fn = this.__fn_remove__) || fn.call(this, index, item = this[index]) !== false))
        {
            this.__splice__(index, 1);

            if (item.__uniqueId__ && this.__index_cache__)
            {
                delete this.__index_cache__[item.__uniqueId__];
            }

            return true;
        }
    };

    //清除
    this.clear = function () {

        if (this.length > 0)
        {
            var fn = this.__fn_clear__;

            if (!fn || fn.call(this) !== false)
            {
                this.__splice__(0, this.length);
                this.__index_cache__ = null; //清空索引缓存

                return true;
            }
        }
    };



    //扩展循环执行(for_XXX)相关方法
    flyingon.for_extend(this);




    //自定义序列化
    this.serialize = function (writer) {

        for (var i = 0; i < this.length; i++)
        {
            writer.value("" + i, this[i]);
        }
    };

    //自定义反序列化
    this.deserialize = function (reader, data, excludes) {

        if (data)
        {
            reader.properties(this, data, excludes);
        }
    };


});



﻿
flyingon.defineClass("SerializeReader", function (Class, base, flyingon) {



    var class_list = flyingon.__registry_class_list__;




    this.deserialize = function (data, context) {

        if (data)
        {
            if (data.constructor == String)
            {
                data = data[0] == "<" ? flyingon.parseXml : this.parse(data);
            }

            var result = this[data.constructor == Array ? "array" : "object"](null, null, data);

            this.__fn_complete__(this, context || result);
            return result;
        }

        return null;
    };


    //序列化完毕后执行方法(内部方法)
    this.__fn_complete__ = function (reader, context) {

        //缓存的资源
        var references = reader.references,
            items = reader.__bindings__,
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
                                if (source.constructor == String)
                                {
                                    binding.source = (references && references[source]) || context;
                                }
                            }
                            else
                            {
                                binding.source = context;
                            }

                            if (!(binding instanceof flyingon.DataBinding))
                            {
                                binding = new flyingon.DataBinding(binding);
                            }
                        }

                        binding.__fn_initialize__(item[0], name);
                        binding.pull();
                    }
                }
            }
        }
    };



    var parse_value = function (value) {

        if (value == null)
        {
            return null;
        }

        switch (typeof value)
        {
            case "object":
                return this[value.constructor == Array ? "array" : "object"](null, null, value);

            case "function":
                return value ? new Function("" + value) : null;
        }

        return value;
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
            return target[name] = +value;
        }
    };

    this.string = function (target, name, value) {

        if (value !== undefined)
        {
            return target[name] = value == null ? null : "" + value;
        }
    };

    this.value = function (target, name, value) {

        if (value !== undefined)
        {
            return target[name] = value == null ? null : parse_value.call(this, value);
        }
    };

    this.object = function (target, name, value) {

        if (value != null)
        {
            var result;

            if (!target || !(result = target[name]))
            {
                result = ((result = value.type) && (result = class_list[result])) ? new result() : {};

                if (target)
                {
                    target[name] = result;
                }
            }


            if (result.deserialize)
            {
                result.deserialize(this, value, {});
            }
            else
            {
                this.properties(result, value);
            }

            return result;
        }
        else if (value !== undefined && target)
        {
            target[name] = null;
        }

        return null;
    };


    this.properties = function (target, value, excludes) {

        var keys = Object.keys(value),
            key;

        for (var i = 0, length = keys.length; i < length; i++)
        {
            key = keys[i];

            if (excludes && excludes[key])
            {
                continue;
            }

            target[key] = parse_value.call(this, value[key]);
        }
    };


    this.array = function (target, name, value) {

        if (value != null)
        {
            var result;

            if (target)
            {
                if (!(result = target[name]))
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
                result.push(parse_value.call(this, value[i]));
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

        if (target && (data = data.bindings))
        {
            this.__bindings__ || (this.__bindings__ = []).push([target, data]);
        }
    };

});





flyingon.defineClass("XmlSerializeReader", flyingon.SerializeReader, function (Class, base, flyingon) {


    this.parse = flyingon.parseXml;

});





﻿
flyingon.defineClass("SerializeWriter", function (Class, base, flyingon) {



    this.__root__ = null;

    this.__push__ = Array.prototype.push;

    this.length = 0;



    this.serialize = function (target) {

        this[target.constructor == Array ? "array" : "object"](this.__root__, target);
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

        if (this[this.length - 1] != "{")
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

        var key = this[this.length - 1] != "{";

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
                this[value.constructor == Array ? "array" : "object"](name, value);
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




﻿//表达式
(function (flyingon) {


    var prototype = (flyingon.Expression = function (expression) {

        if (expression)
        {
            this.expression = expression;
        }

    }).prototype;



    var parse = function (expression, parameters) {


        if (!expression)
        {
            return null;
        }


        if (!expression.match(/return[\s;]/))
        {
            expression = "return " + expression;
        }


        var values = expression.match(/['"\\]|@\w+|[^'"\\@]+/g),
            value,
            quote,  //引号
            escape, //转义
            body = "";

        for (var i = 0, length = values.length; i < length; i++)
        {
            switch (value = values[i])
            {
                case "'":
                case "\"":
                    if (!escape)
                    {
                        quote ? (quote == value && (quote = null)) : (quote = value);
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
                            parameters.push(value);
                        }
                    }

                    escape = false;
                    break;
            }
        }


        for (var i = 0, length = parameters.length; i < length; i++)
        {
            body += "var " + (value = parameters[i]) + " = this[\"" + value + "\"];\n";
        }


        body += values.join("");
        return new Function(body);
    };


    prototype.__expression__ = "";



    //表达式内容
    flyingon.defineProperty(prototype, "expression",

        function () {

            return this.__expression__;
        },

        function (value) {

            this.__expression__ = "" + value;
            this.parameters = [];
            this.__function__ = parse(this.__expression__, this.parameters);
        });


    //计算
    prototype.eval = function (thisArg) {

        var fn = this.__function__;

        if (fn)
        {
            return fn.call(thisArg);
        }
    };



    prototype.serialize = function (writer) {

        writer.string("expression", this.__expression__);
    };

    prototype.deserialize = function (reader, data, excludes) {

        reader.string(this, "__expression__", data.expression);
    };





})(flyingon);



﻿/// <reference path="Core.js" />
/// <reference path="SerializableObject.js" />


(function (flyingon) {




    //正向绑定(绑定数据源至目标控件)
    flyingon.bindingTo = function (source, name) {

        var bindings = source.__bindings__,
            binding;

        if (bindings && (bindings = bindings.push) && (binding = bindings[name]))
        {
            var keys = Object.keys(binding),
                length = keys.length;

            if (length == 0)
            {
                delete bindings[name];
            }
            else
            {
                for (var i = 0; i < length; i++)
                {
                    binding[keys[i]].pull();
                }
            }
        }
    };


    var clearBindings = function (fields, dispose) {

        var keys = Object.keys(fields),
            key,
            bindings;

        for (var i = 0, length = keys.length; i < length; i++)
        {
            if ((key = keys[i]) && (bindings = source[key]))
            {
                var keys2 = Object.keys(bindings);

                for (var j = 0, length2 = keys2.length; j < length2; j++)
                {
                    bindings[keys2[j]].clear(dispose);
                }
            }
        }
    };

    flyingon.clearBindings = function (source, dispose) {

        if (source && (source = source.__bindings__))
        {
            var fields = source.pull;

            if (fields)
            {
                clearBindings(fields, dispose);
            }

            if (fields = source.push)
            {
                clearBindings(fields, dispose);
            }
        }
    };




    var prototype = (flyingon.DataBinding = function (source, expression, setter) {

        if (source)
        {
            if (!expression && (expression = source.expression))
            {
                setter = source.setter;
                source = source.source;
            }

            this.__source__ = source;
            this.__expression__ = expression;
            this.__setter__ = setter;
        }

    }).prototype;


    var defineProperty = function (name) {

        flyingon.defineProperty(prototype, name, function () {

            return this["__" + name + "__"];
        });
    };



    //绑定目标
    defineProperty("target");

    //绑定目标属性名
    defineProperty("name");

    //绑定源
    defineProperty("source");

    //绑定表达式
    defineProperty("expression");

    //更新表达式
    defineProperty("setter");




    //是否正在处理绑定
    prototype.__binding__ = false;

    //获取值函数
    prototype.__fn_getter__ = null;

    //设置值函数
    prototype.__fn_setter__ = null;



    //初始化绑定关系
    prototype.__fn_initialize__ = function (target, name) {

        var source = this.__source__,
            expression = this.__expression__,
            bindings = target.__bindings__ || (target.__bindings__ = {}),
            id = target.id || (target.id = flyingon.newId()),
            cache;


        this.__target__ = target;
        this.__name__ = name;


        //缓存目标
        if (cache = bindings.pull)
        {
            //一个目标属性只能绑定一个
            if (cache[name])
            {
                cache[name].clear();
            }

            cache[name] = this;
        }
        else
        {
            (bindings.pull = {})[name] = this;
        }



        bindings = source.__bindings__ || (source.__bindings__ = { push: {} });
        bindings = bindings.push || (bindings.push = {});

        //如果表达式以数据开头或包含字母数字下划线外的字符则作表达式处理
        if (expression.match(/^\d|[^\w]/))
        {
            cache = (this.__fn_getter__ = new flyingon.Expression(expression)).parameters;

            for (var i = 0, length = cache.length; i < length; i++)
            {
                expression = cache[i];
                (bindings[expression] || (bindings[expression] = {}))[id] = this;
            }
        }
        else
        {
            this.__fn_getter__ = null;
            (bindings[expression] || (bindings[expression] = {}))[id] = this;
        }


        //处理更新
        if (cache = this.__setter__)
        {
            this.__fn_setter__ = new flyingon.Expression(cache);
        }
    };



    //从数据源同步数据至目标属性
    prototype.pull = function () {

        var source = this.__source__,
            result;

        if (result = this.__fn_getter__)
        {
            result = result.eval(source);
        }
        else
        {
            var name = this.__expression__;
            if ((result = source[name]) === undefined && source instanceof flyingon.DataObject)
            {
                 result = source.value(name);
            }
        }

        this.__binding__ = true;
        this.__target__[this.__name__] = result;
        this.__binding__ = false;
    };


    //从目标属性同步数据至源
    prototype.push = function () {

        var cache = this.__expression__;

        if (cache)
        {
            this.__binding__ = true;

            if (!this.__fn_getter__) //直接绑定字段
            {
                var target = this.__target__,
                    name = this.__name__;

                if ((result = target[name]) === undefined && target instanceof flyingon.DataObject)
                {
                    result = target.value(name);
                }

                this.__source__[cache] = result;
            }
            else if (cache = this.__fn_setter__) //表达式需要自定义setter方法
            {
                cache.call(this.__target__);
            }

            this.__binding__ = false;
        }
    };


    //清除绑定关系
    prototype.clear = function (dispose) {

        var source = this.__source__,
            target = this.__target__,
            bindings,
            cache;

        if (source && target && (bindings = source.__bindings_source__))
        {
            if (cache = this.__getter__)
            {
                var parameters = cache.parameters;

                for (var i = 0, length = parameters.length; i < length; i++)
                {
                    if (cache = bindings[parameters[i]])
                    {
                        delete cache[target.id];
                    }
                }
            }
            else if ((cache = this.__expression__) && (cache = bindings[cache]))
            {
                delete cache[target.id];
            }


            delete target.__bindings__[this.__name__];
        }


        if (dispose)
        {
            delete this.__source__;
            delete this.__target__;
            delete this.__fn_getter__;
            delete this.__fn_setter__;
        }
    };


    prototype.serialize = function (writer) {

        writer.reference("source", this.__source__);
        writer.string("expression", this.__expression__);
        writer.string("setter", this.__setter__);
    };

    prototype.deserialize = function (reader, data, excludes) {

        reader.reference(this, "__source__", data.source);
        reader.string(this, "__expression__", data.expression);
        reader.string(this, "__setter__", data.setter);
    };



})(flyingon);



﻿
//事件类型基类
flyingon.Event = function () { };


(function () {


    //事件类型
    this.type = null;

    //事件目标
    this.target = null;

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


}).call(flyingon.Event.prototype);




//鼠标事件类型
flyingon.MouseEvent = function (type, target, originalEvent) {

    this.type = type;
    this.target = target;
    this.originalEvent = originalEvent;
};


(function (flyingon) {

    var target = this,

        defineProperty = function (name) {

            flyingon.defineProperty(target, name, function () {

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

        if (!event.__targetX__)
        {
            var offset = this.target.__boxModel__.offsetToTarget(event.__offsetX__, event.__offsetY__);

            event.__targetX__ = offset.x;
            event.__targetY__ = offset.y;
        }

        return event;
    };


    function offsetToWindow() {

        var event = this.originalEvent;

        if (!event.__windowX__)
        {
            var offset = this.target.__boxModel__.offsetToWindow(event.__offsetX__, event.__offsetY__);

            event.__windowX__ = offset.x;
            event.__windowY__ = offset.y;
        }

        return event;
    };


    function offsetToControl() {

        var event = this.originalEvent;

        if (!event.__controlX__)
        {
            var offset = this.target.__boxModel__.offsetToControl(event.__offsetX__, event.__offsetY__);

            event.__controlX__ = offset.x;
            event.__controlY__ = offset.y;
        }

        return event;
    };



    //x偏移坐标
    flyingon.defineProperty(this, "offsetX", function () {

        return this.originalEvent.__offsetX__;
    });

    //y偏移坐标
    flyingon.defineProperty(this, "offsetY", function () {

        return this.originalEvent.__offsetY__;
    });


    //x目标坐标
    flyingon.defineProperty(this, "targetX", function () {

        return this.originalEvent.__targetX__ || offsetToTarget.call(this).__targetX__;
    });

    //y目标坐标
    flyingon.defineProperty(this, "targetY", function () {

        return this.originalEvent.__targetY__ || offsetToTarget.call(this).__targetY__;
    });


    //x窗口坐标
    flyingon.defineProperty(this, "windowX", function () {

        return this.originalEvent.__windowX__ || offsetToWindow.call(this).__windowX__;
    });

    //y窗口坐标
    flyingon.defineProperty(this, "windowY", function () {

        return this.originalEvent.__windowY__ || offsetToWindow.call(this).__windowY__;
    });

    //x相对坐标
    flyingon.defineProperty(this, "controlX", function () {

        return this.originalEvent.__controlX__ || offsetToControl.call(this).__controlX__;
    });

    //y相对坐标
    flyingon.defineProperty(this, "controlY", function () {

        return this.originalEvent.__controlY__ || offsetToControl.call(this).__controlY__;
    });


    //鼠标滚轮数据
    flyingon.defineProperty(this, "wheelDelta", function () {

        return this.originalEvent.wheelDelta || (-this.originalEvent.detail * 40);
    });


}).call(flyingon.MouseEvent.prototype = new flyingon.Event(), flyingon);



//拖拉事件类型
flyingon.DragEvent = function (type, target, originalEvent) {

    this.type = type;
    this.dragTargets = [target];
    this.target = target;
    this.originalEvent = originalEvent;
};


(function () {

    //拖动目标
    this.dragTargets = null;

    //接收目标
    this.dropTarget = null;


}).call(flyingon.DragEvent.prototype = new flyingon.MouseEvent());




//键盘事件类型
flyingon.KeyEvent = function (type, target, originalEvent) {

    this.type = type;
    this.target = target;
    this.originalEvent = originalEvent;
};


(function (flyingon) {

    //是否按下ctrl键
    flyingon.defineProperty(this, "ctrlKey", function () {

        return this.originalEvent.ctrlKey;
    });

    //是否按下shift键
    flyingon.defineProperty(this, "shiftKey", function () {

        return this.originalEvent.shiftKey;
    });

    //是否按下alt键
    flyingon.defineProperty(this, "altKey", function () {

        return this.originalEvent.altKey;
    });

    //是否按下meta键
    flyingon.defineProperty(this, "metaKey", function () {

        return this.originalEvent.metaKey;
    });

    //事件触发时间
    flyingon.defineProperty(this, "timeStamp", function () {

        return this.originalEvent.timeStamp;
    });

    //键码
    flyingon.defineProperty(this, "keyCode", function () {

        return this.originalEvent.which || this.originalEvent.keyCode;
    });


}).call(flyingon.KeyEvent.prototype = new flyingon.Event(), flyingon);





//值变更事件类型
flyingon.ChangeEvent = function (type, target, name, value, oldValue) {

    this.type = type;
    this.target = target;
    this.name = name;
    this.value = value;
    this.oldValue = oldValue;
};

flyingon.ChangeEvent.prototype = new flyingon.Event();



//属性值变更事件类型
flyingon.PropertyChangeEvent = function (target, name, value, oldValue) {

    this.target = target;
    this.name = name;
    this.value = value;
    this.oldValue = oldValue;
};

(flyingon.PropertyChangeEvent.prototype = new flyingon.Event()).type = "change";





﻿
//可序列化类
flyingon.defineClass("SerializableObject", function (Class, base, flyingon) {



    //客户端唯一Id
    flyingon.__uniqueId__ = 0;

    //自动名称
    flyingon.__auto_name__ = 0;




    Class.create = function () {


        //变量管理器
        this.__fields__ = Object.create(this.__defaults__);

    };




    //唯一Id
    flyingon.newId = function () {

        return ++flyingon.__uniqueId__;
    };



    flyingon.defineProperty(this, "uniqueId", function () {

        return this.__uniqueId__ || (this.__uniqueId__ = ++flyingon.__uniqueId__);
    });


    this.__define_getter__ = function (name, attributes) {

        var body = "return this.__fields__[\"" + name + "\"];";
        return new Function(body);
    };

    this.__define_initializing__ = function (name, attributes) {

        return "if (flyingon.__initializing__)\n"

            + "{\n"

            + (attributes.changing || "")
            + "\n"

            + "fields." + name + " = value;\n"

            + "if (cache = this.__bindings__)\n"
            + "{\n"
            + "this.__fn_bindings__(\"" + name + "\", cache);\n"
            + "}\n"

            + (attributes.complete || "")
            + "\n"

            + "return this;\n"

            + "}\n";
    };

    this.__define_change__ = function (name) {

        return "if ((cache = this.__events__) && (cache = cache['change']) && cache.length > 0)\n"
            + "{\n"
                + "var event = new flyingon.PropertyChangeEvent(this, \"" + name + "\", value, oldValue);\n"
                + "if (this.dispatchEvent(event) === false)\n"
                + "{\n"
                    + "return this;\n"
                + "}\n"
                + "value = event.value;\n"
            + "}\n";
    };

    this.__define_setter__ = function (name, attributes) {

        var body = [];

        body.push("var fields = this.__fields__, cache;\n");

        body.push(this.__define_initializing__(name, attributes));

        body.push("var oldValue = fields." + name + ";\n");

        if (attributes.changing) //自定义值变更代码
        {
            body.push(attributes.changing);
            body.push("\n");
        }

        body.push("if (oldValue !== value)\n");
        body.push("{\n");

        body.push(this.__define_change__(name));

        body.push("fields." + name + " = value;\n");


        if (attributes.changed) //自定义值变更代码
        {
            body.push(attributes.changed);
            body.push("\n");
        }

        if (attributes.complete) //自定义值变更结束代码
        {
            body.push(attributes.complete);
            body.push("\n");
        }


        body.push("if (cache = this.__bindings__)\n");
        body.push("{\n");
        body.push("this.__fn_bindings__(\"" + name + "\", cache);\n");
        body.push("}\n");


        body.push("}\n");

        body.push("return this;\n");

        return new Function("value", body.join(""));
    };


    this.__define_attributes__ = function (attributes) {

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

        if (typeof defaultValue == "function" && (attributes == null || typeof attributes == "function"))
        {
            flyingon.defineProperty(this, name, defaultValue, attributes);
        }
        else
        {
            if (defaultValue !== undefined)
            {
                this.__defaults__[name] = defaultValue;
            }

            attributes = this.__define_attributes__(attributes);

            var getter = attributes.getter || this.__define_getter__(name, attributes),
                setter = !attributes.readOnly ? (attributes.setter || this.__define_setter__(name, attributes)) : null;

            flyingon.defineProperty(this, name, getter, setter);


            //扩展至选择器(样式属性直接扩展)
            if (attributes.query || attributes.style)
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
    this.defineEvent = function (name) {

        flyingon.defineProperty(this, "on" + name, null, function (fn) {

            var events = (this.__events__ || (this.__events__ = {}))[name];

            events ? (events.length > 0 && (events.length = 0)) : (events = this.__events__[name] = []);
            events.push(fn);

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
    this.addEventListener = function (type, fn) {

        if (fn)
        {
            var events = (this.__events__ || (this.__events__ = {}));
            (events[type] || (events[type] = [])).push(fn);
        }

        return this;
    };

    //移除事件处理
    this.removeEventListener = function (type, fn) {

        var events = this.__events__;

        if (events && (events = events[type]))
        {
            if (fn == null)
            {
                events.length = 0;
            }
            else if (events.indexOf(fn) >= 0)
            {
                events.splice(fn, 1);
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
    this.serialize_reference = false;


    //id
    this.defineProperty("id", null, {

        attributes: "locate",
        changed: "this.__style_group__ = null;"
    });

    //名称
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


    //获取或设置存储属性值
    this.property = function (name, value) {

        if (value === undefined)
        {
            return this.__fields__[name];
        }

        this.__fields__[name] = value;
        return this;
    };





    this.setBinding = function (name, source, expression, setter) {

        if (name && source)
        {
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
    this.__fn_bindings__ = function (name, fields) {

        var bindings = fields.push;

        if (bindings && bindings.hasOwnProperty(name))
        {
            flyingon.bindingTo(this, name);
        }

        if ((bindings = fields.pull) && (bindings = bindings[name]) && !bindings.__binding__)
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

            if (Object.keys(this.__fields__).length > 0)
            {
                this.__fields__ = Object.create(this.__defaults__);
            }

            new flyingon.SerializeReader().deserialize(value, this);
        });




    //自定义序列化
    this.serialize = function (writer) {

        writer.properties(this.__fields__);
        writer.bindings(this);
    };

    //自定义反序列化
    this.deserialize = function (reader, data, excludes) {

        if (data.bindings)
        {
            excludes.bindings = true;
        }

        reader.properties(this.__fields__, data, excludes);
        reader.bindings(this, data);

        if (this.__fields__.name)
        {
            (reader.references || (reader.references = {}))[fields.name] = this;
        }
    };




    //销毁
    this.dispose = function () {

        flyingon.clearBindings(this, true);
    };


});







﻿(function (flyingon) {


    var regex = /top|middle|bottom|left|center|right/g,

        keys = { left: 1, center: 1, right: 1 },

        prototype = (flyingon.Align = function (value) {

            if (value)
            {
                var values = ("" + value).toLowerCase().match(regex),
                    value;

                for (var i = 0, length = values.length; i < length; i++)
                {
                    if (keys[value = values[i]])
                    {
                        this.horizontal = value;
                    }
                    else
                    {
                        this.vertical = value;
                    }
                }
            }

        }).prototype;



    //水平对齐
    prototype.horizontal = "left";

    //垂直对齐
    prototype.vertical = "top";


    //转换为字符串
    prototype.toString = prototype.toLocaleString = prototype.serializeTo = function () {

        return this.horizontal + "," + this.vertical;
    };



})(flyingon);



﻿(function (flyingon) {


    var regex = /\s*,\s*/g,

        prototype = (flyingon.Thickness = function (value) {


            if (value)
            {
                switch (typeof value)
                {
                    case "number":
                        this.left = this.top = this.right = this.bottom = value;
                        return;

                    case "string":
                        var values = value.split(regex);
                        break;

                    case "object":
                        values = value.constructor == Array ? value : ("" + value).split(regex);
                        break;
                }

                switch (values.length) //上右下左 与html保持一致
                {
                    case 1:
                        if (value = values[0] - 0)
                        {
                            this.left = this.top = this.right = this.bottom = value;
                        }
                        break;

                    case 2:
                    case 3:
                    case 4:
                        if (value = values[0])
                        {
                            this.top = value - 0;
                        }

                        if (value = values[1])
                        {
                            this.right = value - 0;
                        }

                        this.bottom = (value = values[2]) ? value - 0 : this.top;
                        this.left = (value = values[3]) ? value - 0 : this.right;
                        break;
                }
            }

        }).prototype;



    //左空间
    prototype.left = 0;

    //上部空间
    prototype.top = 0;

    //右空间
    prototype.right = 0;

    //底部空间
    prototype.bottom = 0;

    //转换为字符串
    prototype.toString = prototype.toLocaleString = prototype.serializeTo = function () {

        return this.top + "," + this.left + "," + this.right + "," + this.bottom;
    };


    //左右空间和
    flyingon.defineProperty(prototype, "spaceX", function () {

        return this.left + this.right;
    });

    //上下空间和
    flyingon.defineProperty(prototype, "spaceY", function () {

        return this.top + this.bottom;
    });



})(flyingon);



﻿/*

字体: 类css font格式

注1: 但不支持继承父元素的的属性
注2: font-size只支持"数字+单位"的形式
注3: font-size可使用单位px, em, in, mm, cm, pt, pc(1in = 2.54cm = 25.4mm = 72pt = 6pc = 96px) 其中em是12的倍数
注4: 不支持lineHeight


*/
(function (flyingon) {


    var regex_size = /(\d+(px|in|cm|mm|pt|pc|%)|x*-*small|medium|x*-*large)\/?/g,

        regex_split = /\s+/,

        regex_unit = /\d+|\w+|%/g,

        //单位换算
        unit_scale = {

            "in": 96,
            cm: 96 / 2.54,
            mm: 96 / 25.4,
            pt: 4 / 3,
            pc: 96 / 6,
            em: 12
        },

        //字体大小关键字
        size_keys = {

            "xx-small": 9,
            "x-small": 9,
            "small": 9,
            "medium": 12,
            "large": 24,
            "x-large": 36,
            "xx-large": 48
        },

        //解析关键字
        parse_keys = {

            italic: "__style__",
            oblique: "__style__",
            "small-caps": "__variant__",
            bold: "__weight__",
            bolder: "__weight__",
            lighter: "__weight__"
        };


    for (var i = 100; i <= 900; i += 100)
    {
        parse_keys["" + i] = "__weight__";
    }


    var parse_data = {};

    function compute_size(target, value, unit) {

        if (unit)
        {
            target.__size__ = value + unit;
            target.__height__ = Math.round(value * unit_scale[unit]);
        }
        else
        {
            target.__size__ = value;
            target.__height__ = size_keys[value] || +value;
        }
    };

    function parse_size(all, value, unit, index) {

        var data = parse_data;

        if (!data.lineHeight) //不解析lineHeight
        {
            compute_size(data.target, value, unit);
            data.style = index - 1;
            data.lineHeight = true;
        }

        data.family = index + all.length + 1;
    };

    var prototype = (flyingon.Font = function (text) {

        if (text)
        {
            var data = parse_data,
                values,
                name,
                value;

            data.target = this;
            data.lineHeight = false;

            //parse size
            text.replace(regex_size, parse_size);

            //parse style || variant || weight
            if (data.style > 0)
            {
                values = text.substring(0, data.style).split(regex_split);

                for (var i = 0, length = values.length; i <= length; i++)
                {
                    if (name = parse_keys[value = values[i++]])
                    {
                        this[name] = value;
                    }
                }
            }

            //family
            if (data.family + 1 < text.length)
            {
                this.__family__ = text.substring(data.family);
            }
        }

        //初始化
        this.__initialize__();

    }).prototype;




    var storage_list = {}; //测量缓存


    //初始化
    prototype.__initialize__ = function () {

        //计算值
        var value = this.__value__ = [this.__style__, this.__variant__, this.__weight__, this.__size__, this.__family__].join(" ");

        //缓存文字测量结果
        if (!(this.__storage__ = storage_list[value]))
        {
            var context = document.createElement("canvas").getContext("2d");

            context.font = value;

            this.__storage__ = storage_list[value] = {

                //缓存上下文
                context: context,

                //缓存汉字宽度
                chinese: context.measureText("汉").width
            };
        }
    };





    var defineProperty = function (name, defaultValue) {

        var key = "__" + name + "__";

        prototype[key] = defaultValue;

        flyingon.defineProperty(prototype, name,

            new Function("return this.__" + name + "__;"),

            function (value) {

                if (value && value !== this[key])
                {
                    this[key] = value;
                    this.__initialize__();
                }
            });
    };



    //字体样式 normal italic oblique
    defineProperty("style", "normal");

    //字体变体 normal small-caps
    defineProperty("variant", "normal");

    //字体粗细 normal bold bolder lighter 100 200 300 400 500 600 700 800 900
    defineProperty("weight", "normal");

    //字体系列
    defineProperty("family", "微软雅黑,宋体,Times New Roman");


    prototype.__size__ = "9pt";

    //字体大小 xx-small x - small small medium large x-large xx-large
    flyingon.defineProperty(prototype, "size",

        function () {

            return this.__size__;
        },

        function (value) {

            if (value && value !== this.__size__)
            {
                var unit;

                if (value.constructor == String)
                {
                    value = value.match(regex_unit);
                    unit = value[1];
                    value = value[0];
                }

                compute_size(this, value, unit);
                this.__initialize__();
            }
        });

    //字体高度
    prototype.__height__ = 12;

    //字体高度
    flyingon.defineProperty(prototype, "height", function () {

        return this.__height__;
    });



    //测量文字宽度
    prototype.measureText = function (text) {

        var storage = this.__storage__;
        return storage[text] || (storage[text] = storage.context.measureText(text).width);
    };


    prototype.toString = prototype.toLocaleString = function () {

        return this.__value__;
    };


    //默认字体
    flyingon.Font.__default__ = new flyingon.Font();



})(flyingon);




﻿//文字
(function (flyingon) {



    //选中文字背景色
    flyingon.selectionText_backgroundColor = "skyblue";

    //选中文字颜色
    flyingon.selectionText_color = "white";



    var Font = flyingon.Font,

        pseudo_array = flyingon.__pseudo_array__,

        prototype = (flyingon.Text = function (text, font) {

            this.__rows__ = new text_rows();
            this.__text__ = text || "";
            this.__font__ = font || Font.__default__;

        }).prototype,

        defineProperty = function (name, defaultValue, measure) {

            prototype["__" + name + "__"] = defaultValue;

            flyingon.defineProperty(prototype, name,

                new Function("return this.__" + name + "__;"),

                new Function("value", "var oldValue = this.__" + name + "__;\n"
                    + "if (oldValue == null) oldValue = flyingon.Text.prototype.__" + name + "__;"
                    + "if (oldValue !== value)\n"
                    + "{\n"
                    + "this.__" + name + "__ = value;\n"
                    + (measure ? "this.__lines__ = null;\n" : "")
                    + (name == "text" ? "if (!value) this.__rows__.clear();\n" : "")
                    + "this.__dirty__ = true;\n"
                    + "}"));
        };



    //需要重新排列
    prototype.__dirty__ = true;


    //文字内容
    defineProperty("text", "", true);

    //字体
    defineProperty("font", Font.__default__, true);

    //是否多行文本
    defineProperty("multiline", false, true);

    //行高
    defineProperty("lineHeight", 19);

    //文字对齐,仅在单行文本时有效
    defineProperty("textAlign", null);

    //是否自动换行
    defineProperty("wrap", false);



    //宽度
    defineProperty("width", 100);

    //高度
    defineProperty("height", 21);



    defineProperty = flyingon.defineProperty;



    //x偏移(单行时自动计算,多行时仅对第一行有效)
    prototype.offsetX = 0;

    //y偏移(单行时自动计算)
    prototype.offsetY = 0;

    //x滚动偏移
    prototype.scrollLeft = 0;

    //y滚动偏移
    prototype.scrollTop = 0;

    //滚动宽度
    defineProperty(prototype, "scrollWidth", function () {

        return this.__scrollWidth__ || 0;
    });

    //滚动高度
    defineProperty(prototype, "scrollHeight", function () {

        return this.__scrollHeight__ || 0;
    });


    prototype.__selectionStart__ = 0;

    prototype.__selectionEnd__ = 0;

    function define_setter(name) {

        var body = "if ((value = +value) < 0) value = 0;\n"
            + "else if (value >= this.__text__.length) value = this.__text__.length - 1;\n"
            + "if (value != this." + name + ")\n"
            + "{\n"
            + "this." + name + " = value;\n"
            + "}";

        return new Function("value", body);
    };

    //开始选中文字位置
    defineProperty(prototype, "selectionStart", function () {

        return this.__selectionStart__;

    }, define_setter("__selectionStart__"));

    //选中文字长度
    defineProperty(prototype, "selectionLength",

        function () {

            return Math.abs(this.__selectionEnd__ - this.__selectionStart);
        },

        function (value) {

            if (value && typeof value == "number")
            {
                var value = this.__selectionEnd__ = this.__selectionStart__ + value;

                if (value < 0)
                {
                    this.__selectionEnd__ = 0;
                }
                else if (value > this.__text__.length)
                {
                    value = this.__text__.length;
                }
            }
        });

    //结束选中文字位置(不包含当前字符)
    defineProperty(prototype, "selectionEnd", function () {

        return this.__selectionEnd__;

    }, define_setter("__selectionEnd__"));




    //物理行集合
    function measure_lines() { };

    //初始化物理行集合默认值
    (function () {

        this.measure_length = 0;    //已测量文字数
        this.measure_index = 0;     //测量过的索引
        this.measure_width = 0;     //已测量总宽

        this.maxWidth = 0;          //已测量的最大行宽
        this.dirty = true;          //需要测量

    }).call(measure_lines.prototype = pseudo_array());


    //物理行
    function measure_line(lines, start, end) {

        this.start = start;
        this.end = end;

        lines.push(this);
    };

    measure_line.prototype = new pseudo_array();


    /*
    注1: 缓存测量结果以提升canvas的measureText方法性能较差的问题
    注2: 需注意此方法对内存占用有一定的影响 在IE下可能存在一定的误差(IE的字体渲染有问题:分段测量值的和<>直接测量值???)
    */

    //unicode码: 
    //\u2e80-\uffff:东方字符 按单个等宽字符处理
    //\u00c0-\u00ff 拉丁字母1
    //\u0400-\u04ff 西里尔字母

    //拆分
    function split_text() {

        var lines = this.__lines__ = new measure_lines(),
            text = this.__text__,
            length = text.length;

        if (this.multiline) //多行时按行截断
        {
            var start = 0, end;

            while ((end = text.indexOf("\n", start)) > 0)
            {
                new measure_line(lines, start, end);
                start = end + 1;
            }

            if (start < length)
            {
                new measure_line(lines, start, length);
            }
        }
        else
        {
            new measure_line(lines, 0, length);
        }
    };

    //测量文字行(每调用一次只测量一行)
    function measure_text() {

        var lines = this.__lines__,
            line = lines[lines.measure_index++],
            storage = this.__font__.__storage__,
            chinese = storage.chinese,
            index = line.start, //文本索引号
            width = 0,          //行宽
            text = this.__text__.substring(index, line.end),
            length = text.length;

        //每次处理一个字符效率差一些,但处理简单且不会有测量误差
        //使用局部测量及绘制以提升效率
        for (var i = 0; i < length; i++)
        {
            line.push(width);

            var item = text[i];
            width += item >= "\u2e80" ? chinese : storage[item] || (storage[item] = storage.context.measureText(item).width);
        }

        line.push(line.width = width);  //行宽

        lines.measure_length += length;   //已测量文字数
        lines.measure_width += width;     //已测量总宽

        if (width > lines.maxWidth)
        {
            lines.maxWidth = width;     //记录最大行宽
        }

        if (lines.measure_index >= lines.length)
        {
            lines.dirty = false; //标记已测量完
        }

        return line;
    };



    //逻辑行集合
    function text_rows() { };

    (function () {

        this.offsetX = 0;    //x偏移 仅单行时有效
        this.offsetY = 0;    //y偏移 仅单行时有效

    }).call(text_rows.prototype = pseudo_array());


    //逻辑行
    function text_row(rows, line, lineHeight) {

        this.line = line;                //物理行
        this.item_end = line.length - 1; //结束子项索引

        rows.push(this);
    };

    (function () {

        this.item_start = 0;    //开始子项索引
        this.item_end = 0;      //结束子项索引

        this.width = 0;     //行宽

    }).call(text_row.prototype);


    //排列
    function layout() {

        var rows = this.__rows__;

        if (this.__dirty__)
        {
            if (rows.length > 0)
            {
                rows.clear();
            }

            if (!this.__lines__) //需要重新测量
            {
                split_text.call(this);
            }

            this.__dirty__ = false;
        }

        (this.multiline ? (this.wrap ? layout_wrap : layout_rows) : layout_row).call(this, rows); //排列
    };


    //排列单行文字 排列逻辑行
    function layout_row(rows) {

        var lines = this.__lines__,                 //物理行集合
            row = rows[0],                          //逻辑行
            lineHeight = this.__lineHeight__,
            align = this.textAlign;

        if (!row || lines.dirty)
        {
            row = new text_row(rows, measure_text.call(this), lineHeight);
            row.width = row.line.width;
        }

        this.offsetX = 0;
        this.offsetY = 0;

        if (align)
        {
            var cache = this.__width__ - row.width;

            if (cache)
            {
                switch (align.horizontal)
                {
                    case "center":
                        this.offsetX += cache >> 1;
                        break;

                    case "right":
                        this.offsetX += cache;
                        break;
                }
            }

            if (cache = this.__height__ - lineHeight)
            {
                switch (align.vertical)
                {
                    case "middle":
                        this.offsetY += cache >> 1;
                        break;

                    case "bottom":
                        this.offsetY += cache;
                        break;
                }
            }
        }

        this.__scrollWidth__ = Math.ceil(lines.width * this.__text__.length / lines.measure_length);
        this.__scrollHeight__ = lineHeight;
    };

    //排列多行文字
    function layout_rows(rows) {

        var lines = this.__lines__,     //物理行集合
            lineHeight = this.__lineHeight__, //行高
            count = Math.ceil((this.scrollTop + this.__height__) / lineHeight);

        while (lines.dirty && rows.length < count)
        {
            new text_row(rows, measure_text.call(this), lineHeight);
        }

        this.__scrollWidth__ = lines.maxWidth;
        this.__scrollHeight__ = lines.length * lineHeight;
    };

    var regex = /\w/;

    //排列自动换行
    function layout_wrap(rows) {

        var text = this.__text__,
            lines = this.__lines__,     //物理行集合
            lineHeight = this.__lineHeight__, //行高
            maxWidth = this.__width__,
            count = Math.ceil((this.scrollTop + this.__height__) / lineHeight);

        if (maxWidth < lineHeight)
        {
            maxWidth = lineHeight;
        }

        while (lines.dirty && rows.length < count)
        {
            var line = measure_text.call(this),                 //物理行
                row,                                            //逻辑行
                width = rows.length == 0 ? maxWidth - this.offsetX : maxWidth,
                start = 0,
                end = 0,
                length = line.length;

            while (start < length)
            {
                end = line.binary_between(line[start] + width);

                if (line[end] > width + line[start])
                {
                    end--;
                }

                //处理单词显示在同一行
                while (end > start && regex.test(text[line.start + end]))
                {
                    end--;
                }

                if (end == start)
                {
                    while (regex.test(text[line.start + end]))
                    {
                        end++;
                    }
                }

                row = new text_row(rows, line, lineHeight);    //逻辑行
                row.item_start = start;
                row.item_end = end;

                start = end + 1;
            }
        }

        this.__scrollWidth__ = maxWidth;
        this.__scrollHeight__ = Math.ceil(rows.length * lineHeight * lines.length / lines.measure_index);
    };


    //获取指定坐标的文字信息
    prototype.hitTest = function (x, y) {

        var lineHeight = this.__lineHeight__,
            rows = this.__rows__,
            row,
            index,
            line,
            item;

        x += this.scrollLeft;
        y += this.scrollTop + this.offsetY;

        switch (rows.length)
        {
            case 0:
                return null;

            case 1:
                index = 0;
                break;

            default:
                if ((index = Math.floor(y / lineHeight)) >= rows.length)
                {
                    index = rows.length - 1;
                }
                break;
        }

        if (index == 0 && (x -= this.offsetX) < 0)
        {
            x = 0;
        }

        row = rows[index];
        line = row.line;
        item = line.binary_between(x + line[row.item_start], row.item_start, row.item_end - 1);

        return {

            x: (index == 0 ? this.offsetX : 0) + line[item] - line[row.item_start],
            y: this.offsetY + index * lineHeight,
            index: line.start + item
        };
    };




    //重新测量
    prototype.invalidate = function (measure) {

        if (measure)
        {
            this.__lines__ = null;
        }

        this.__dirty__ = true;
    };


    //绘制文字(仅绘制可视范围以提升性能)
    prototype.paint = function (context, x, y, color) {

        var text = this.__text__;

        //无文字时不处理
        if (text)
        {
            if (this.__dirty__ || this.__lines__.dirty) //先测量未测量的文字
            {
                layout.call(this);
            }

            var lineHeight = this.__lineHeight__,
                rows = this.__rows__,       //逻辑行集合
                row_start = 0,              //起始可视行
                row_end = rows.length,      //终止可视行
                width = this.__width__,
                selectionStart = this.__selectionStart__,   //开始选中文字索引
                selectionEnd = this.__selectionEnd__,       //终止选中文字索引
                selection = selectionStart != selectionEnd, //是否有选中文字
                selection_start,
                selection_end,
                cache;

            if (selectionEnd < selectionStart)
            {
                cache = selectionStart;
                selectionStart = selectionEnd;
                selectionEnd = cache;
            }

            if (rows.length > 1) //如果有多行则计算出可视行范围
            {
                if ((cache = this.scrollTop) > 0)
                {
                    row_start = Math.floor(cache / lineHeight);
                    y -= cache;
                }

                if ((cache = Math.ceil((cache + this.__height__) / lineHeight)) < row_end)
                {
                    row_end = cache;
                }
            }

            context.fillStyle = color || "black";
            context.font = this.__font__.__value__;

            cache = this.scrollLeft;

            for (var i = row_start; i < row_end; i++)
            {
                var row = rows[i],   //逻辑行
                    line = row.line, //物理行
                    char_start = line.start, //开始字符索引
                    item_start = row.item_start,
                    item_end = row.item_end;

                if (cache > 0)
                {
                    item_start = line.binary_between(cache, item_start, item_end);
                }

                if (line[item_end] - line[item_start] > width)
                {
                    item_end = line.binary_between(cache + width, item_start, item_end);
                }

                //每次渲染一个字符以避免某些浏览器(如IE)测量多个字符不等于单个字符之和的误差
                var x1 = x - line[item_start],
                    y1 = y + i * lineHeight + this.offsetY;

                if (i == 0)
                {
                    x1 += this.offsetX;
                }

                if (selection && !(selectionStart > char_start + item_end || selectionEnd < char_start + item_start)) //绘制选中
                {
                    selection_start = Math.max(selectionStart - char_start, item_start);
                    selection_end = Math.min(selectionEnd - char_start, item_end);

                    //绘制前端未选中部分
                    if (selection_start > item_start)
                    {
                        for (var j = item_start; j < selection_start; j++)
                        {
                            context.fillText(text[char_start + j], line[j] + x1, y1);
                        }
                    }

                    //绘制选中背景
                    if (context.fillStyle = flyingon.selectionText_backgroundColor)
                    {
                        context.fillRect(line[selection_start] + x1, y1, line[selection_end] - line[selection_start], lineHeight);
                    }

                    //绘制选中文字
                    context.fillStyle = flyingon.selectionText_color;

                    for (var j = selection_start; j <= selection_end; j++)
                    {
                        context.fillText(text[char_start + j], line[j] + x1, y1);
                    }

                    //如果有后端未选中部分则继续绘制,否则跳过
                    if (selection_end < item_end)
                    {
                        context.fillStyle = color || "black";
                        item_start = selection_end;
                    }
                    else
                    {
                        continue;
                    }
                }

                for (var j = item_start; j <= item_end; j++)
                {
                    context.fillText(text[char_start + j], line[j] + x1, y1);
                }
            }
        }
    };


    prototype.replace = function (text) {

        if (text)
        {
            var start = this.__selectionStart__,
                end = this.__selectionEnd__;

            if (start != end)
            {
                if (start > end)
                {
                    start = end;
                    end = this.__selectionStart__;
                }

                var value = this.__text__;

            }
        }
    };


    prototype.remove = function (length) {

        if (!this.selectedText)
        {
            this.selectionTo(this.selectionEnd + length); //未选择
        }

        this.replace("");
    };



})(flyingon);





﻿
//文本单词
(function (flyingon) {



    var prototype = (flyingon.TextWord = function (font, text) {

        this.font = font;
        this.text = text;

    }).prototype = flyingon.__pseudo_array__();



    //字体
    prototype.font = null;

    //文本内容
    prototype.text = null;

    //文字段宽度
    prototype.width = 0;

    //起始文本索引
    prototype.index = 0;

    //起始x坐标
    prototype.x = 0;



    //测量单词中每一个字符占用的宽度
    function measureText(font, text) {

        if (!text)
        {
            return [];
        }


        var result = [],
            cache = font.__cache__,
            context = font.__context__;


        for (var i = 0, length = text.length; i < length; i++)
        {
            var char = text[i];
            result.push(cache[char] || (cache[char] = context.measureText(char).width));
        }

        return result;
    };


    function initialize() {

        var value = 0,
            chars = this.chars = measureText(this.font, this.text),
            cache = this.__cache__ = [0];


        for (var i = 0, length = chars.length; i < length; i++)
        {
            cache.push(value += chars[i]);
        }

        return cache;
    };




    //获取指定位置的字符索引
    prototype.charAt = function (x) {

        return this.unit ? Math.round(x / this.unit) : (this.__cache__ || initialize.call(this)).binary_between(x);
    };


    //获取指定字符索引的相对位置
    prototype.position = function (charIndex) {

        return this.unit ? charIndex * this.unit : (this.__cache__ || initialize.call(this))[charIndex];
    };



})(flyingon);






﻿//文本行
(function (flyingon) {


    var prototype = (flyingon.TextLine = function (font, text) {

        this.font = font;
        this.text = text;
        this.height = font.height;

    }).prototype = flyingon.__pseudo_array__();



    //字体
    prototype.font = null;

    //文本内容
    prototype.text = null;

    //起始文本索引
    prototype.index = 0;

    //起始y坐标
    prototype.y = 0;

    //文本行总宽度
    prototype.width = 0;

    //文本行总高度
    prototype.height = 0;



    function initialize() {

        var cache1 = this.__cache1__ = [0],
            cache2 = this.__cache2__ = [0];

        for (var i = 0, length = this.length - 1; i < length; i++)
        {
            var word0 = this[i],
                word1 = this[i + 1];

            cache1.push(word1.index = word0.index + word0.text.length); //文本索引
            cache2.push(word1.x = word0.x + word0.width);               //位置
        }

        return this;
    };





    //unicode码: \u2e80-\ufffy:东方字符 \u00c0-\u00ff 拉丁字母1  \u0400-\u04ff 西里尔字母
    //[\u2e80-\uffff]+                      汉字类 按等宽字符 注:可能对其它字符处理不好
    //[\w\u00c0-\u00ff\u0400-\u04ff]+       类英文单词类 按英文单词的方式处理
    //[^\w\u00c0-\u00ff\u0400-\u04ff]       其它符号类 按单个字符的方式处理
    var regex_measure = /[\u2e80-\uffff]+|[^\w\r\u00c0-\u00ff\u0400-\u04ff]|[\w\u00c0-\u00ff\u0400-\u04ff]+/g;


    //测量文字 以提升canvas的measureText方法性能较差的问题
    //请尽量使用相同的字体对象以获得较好的性能
    //需注意此方法对内存占用有一定的影响 在IE下可能存在一定的误差(IE的字体渲染有问题:分段测量值的和<>直接测量值???)
    prototype.measureText = function () {

        var font = this.font,
            cache = font.__cache__,
            context = font.__context__,
            chinese = cache["汉"],
            values = this.text.match(regex_measure) || [""],
            x = 0;


        for (var i = 0, length = values.length; i < length; i++)
        {
            var text = values[i],
                word = new flyingon.TextWord(font, text);


            if (text[0] > "\u2e80") //东方字符类
            {
                word.width = text.length * chinese;
                word.unit = chinese; //每个字符的宽度(汉字)
            }
            else //类英文单词及其它符号类
            {
                word.width = cache[text] || (cache[text] = context.measureText(text).width); //总宽
            }


            this.push(word);

            x += word.width;
        }


        this.width = x;
    };




    //获取指定索引的文字信息
    prototype.charBy = function (columnIndex) {

        if (columnIndex >= this.text.length)
        {
            return {

                wordIndex: this.length - 1,
                charIndex: this[this.length - 1].text.length,
                columnIndex: this.text.length,
                x: this.width,
                y: this.y
            };
        }


        if (columnIndex < 0)
        {
            columnIndex = 0;
        }


        var index = (this.__cache1__ || initialize.call(this).__cache1__).binary_between(columnIndex),
            word = this[index],
            charIndex = columnIndex - this.__cache1__[index];


        return {

            wordIndex: index,
            charIndex: charIndex,
            columnIndex: columnIndex,
            x: this.__cache2__[index] + word.position(charIndex),
            y: this.y
        };
    };


    //查找指定位置的文字信息
    prototype.charAt = function (x) {

        var index = (this.__cache2__ || initialize.call(this).__cache2__).binary_between(x),
            word = this[index],
            charIndex,
            x;


        if (x >= this.width) //末尾
        {
            charIndex = word.text.length;
            x = this.width;
        }
        else
        {
            charIndex = word.charAt(x - this.__cache2__[index]);
            x = this.__cache2__[index] + word.position(charIndex);
        }


        return {

            wordIndex: index,
            charIndex: charIndex,
            columnIndex: this.__cache1__[index] + charIndex,
            x: x,
            y: this.y
        };
    };



})(flyingon);





﻿

//文本测量
(function (flyingon) {



    var prototype = (flyingon.TextMetrics = function () {

    }).prototype = flyingon.__pseudo_array__();



    //字体
    prototype.font = null;

    //文本
    prototype.text = null;

    //初始x
    prototype.x = 0;

    //初始y
    prototype.y = 0;

    //最大宽度
    prototype.width = 0;

    //最大高度
    prototype.height = 0;

    //是否多行
    prototype.multiline = false;


    //开始选中位置
    prototype.selectionStart = 0;

    //结束选中位置
    prototype.selectionEnd = 0;

    //选中文本
    prototype.selectedText = "";






    function initialize() {

        var cache1 = this.__cache1__ = [0],
            cache2 = this.__cache2__ = [0];

        for (var i = 0, length = this.length - 1; i < length; i++)
        {
            var line0 = this[i],
                line1 = this[i + 1];

            cache1.push(line1.index = line0.index + line0.text.length); //文本索引
            cache2.push(line1.y = line0.y + line0.height);              //位置
        }

        return this;
    };




    prototype.measureText = function (font, text, multiline) {

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
            var values = multiline ? text.split(/\r?\n/g) : [text.replace(/[\r\n]?/g, "")];

            for (var i = 0, length = values.length; i < length; i++)
            {
                var line = new flyingon.TextLine(font, values[i]);

                line.measureText();
                this.push(line);

                if (this.width < line.width)
                {
                    this.width = line.width; //最大宽度
                }

                this.height += line.height;
            }
        }
    };



    //获取指定索引的行信息
    prototype.lineBy = function (textIndex) {

        if (textIndex < 0)
        {
            textIndex = 0;
        }

        return this[(this.__cache1__ || initialize.call(this).__cache1__).binary_between(textIndex)];
    };

    //查找指定位置的行信息
    prototype.lineAt = function (y) {

        return this[(this.__cache2__ || initialize.call(this).__cache2__).binary_between(y)];
    };

    //获取指定索引的字符信息
    prototype.charBy = function (textIndex) {

        if (textIndex < 0)
        {
            textIndex = 0;
        }

        var index = (this.__cache1__ || initialize.call(this).__cache1__).binary_between(textIndex),
            start = this.__cache1__[index],
            result = this[index].charBy(textIndex - start);

        result.lineIndex = index;
        result.textIndex = start + result.columnIndex;

        return result;
    };

    //查找指定位置的字符信息
    prototype.charAt = function (x, y) {

        var index = (this.__cache2__ || initialize.call(this).__cache2__).binary_between(y),
            result = this[index].charAt(x);

        result.lineIndex = index;
        result.textIndex = this.__cache1__[index] + result.columnIndex;

        return result;
    };



    function selectionEnd() {

        if ((this.selectionEnd = this.end.textIndex) < (this.selectionStart = (this.start = this.__start__).textIndex))
        {
            this.selectionStart = (this.start = this.end).textIndex;
            this.selectionEnd = (this.end = this.__start__).textIndex;
        }

        this.selectedText = this.text.substring(this.selectionStart, this.selectionEnd);
    };



    //移动至指定坐标
    prototype.moveAt = function (x, y) {

        this.start = this.end = this.caret = this.__start__ = this.charAt(x, y);
        this.selectionStart = this.selectionEnd = this.start.textIndex;
        this.selectedText = "";
    };


    //选择至指定坐标
    prototype.selectionAt = function (x, y) {

        this.end = this.caret = this.charAt(x, y);
        selectionEnd.call(this);
    };


    prototype.moveTo = function (textIndex) {

        this.start = this.end = this.caret = this.__start__ = this.charBy(textIndex);
        this.selectionStart = this.selectionEnd = this.start.textIndex;
        this.selectedText = "";
    };


    prototype.selectionTo = function (textIndex) {

        this.end = this.caret = this.charBy(textIndex);
        selectionEnd.call(this);
    };


    prototype.replace = function (text) {

        var start = this.start,
            end = this.end,
            textIndex = start.textIndex + text.length,
            index1 = start.lineIndex,
            index2 = end.lineIndex;


        text = this[index1].text.substring(0, start.columnIndex) + (text || "") + this[index2].text.substring(end.columnIndex);

        start = index1 > 0 ? this[index1 - 1].text : "";
        end = index2 + 1 < this.length ? this[index2 + 1].text : "";


        var line = new flyingon.TextLine(this.font, text);
        line.measureText();

        this.splice(index1, index2 - index1 + 1, line);

        this.text = start + text + end;

        this.moveTo(textIndex);
    };


    prototype.remove = function (length) {

        if (!this.selectedText)
        {
            this.selectionTo(this.selectionEnd + length); //未选择
        }

        this.replace("");
    };



})(flyingon);






﻿
/*


css1-css3选择器


1.基础的选择器

Y *               通用元素选择器，匹配任何元素
Y E               标签选择器，匹配所有使用E标签的元素
Y .               class选择器，匹配所有class属性中包含info的元素
Y #               id选择器，匹配所有id属性等于footer的元素


2.组合选择器

Y E,F             多元素选择器，同时匹配所有E元素或F元素，E和F之间用逗号分隔
Y E F             后代元素选择器，匹配所有属于E元素后代的F元素，E和F之间用空格分隔
Y E>F             子元素选择器，匹配所有E元素的子元素F
Y E+F             毗邻元素选择器，匹配所有紧随E元素之后的同级元素F


3.CSS 2.1 属性选择器

Y E[att]          匹配所有具有att属性的E元素，不考虑它的值。（注意：E在此处可以省略，比如“[cheacked]”。以下同。）
Y E[att=val]      匹配所有att属性等于“val”的E元素
Y E[att~=val]     匹配所有att属性具有多个空格分隔的值、其中一个值等于“val”的E元素
Y E[att|=val]     匹配所有att属性具有多个连字号分隔（hyphen-separated）的值、其中一个值以“val”开头的E元素，主要用于lang属性，比如“en”、“en-us”、“en-gb”等等


4.CSS 2.1 中的伪类

Y E:first-child   匹配父元素的第一个子元素
N E:link          匹配所有未被点击的链接
N E:visited       匹配所有已被点击的链接
Y E:active        匹配鼠标已经其上按下、还没有释放的E元素
Y E:hover         匹配鼠标悬停其上的E元素
Y E:focus         匹配获得当前焦点的E元素
N E:lang(c)       匹配lang属性等于c的E元素


5.CSS 2.1中的伪元素

N E:first-line    匹配E元素的第一行
N E:first-letter  匹配E元素的第一个字母
Y E:before        在E元素之前插入生成的内容
Y E:after         在E元素之后插入生成的内容


6.CSS 3的同级元素通用选择器

Y E~F             匹配任何在E元素之后的同级F元素


7．CSS 3 属性选择器

Y E[att^=”val”] 属性att的值以”val”开头的元素
Y E[att$=”val”] 属性att的值以”val”结尾的元素
Y E[att*=”val”] 属性att的值包含”val”字符串的元素


8. CSS 3中与用户界面有关的伪类

Y E:enabled       匹配表单中激活的元素
Y E:disabled      匹配表单中禁用的元素
Y E:checked       匹配表单中被选中的radio（单选框）或checkbox（复选框）元素
Y E:selection     匹配用户当前选中的元素


9. CSS 3中的结构性伪类

N E:root                  匹配文档的根元素，对于HTML文档，就是HTML元素
Y E:nth-child(n)          匹配其父元素的第n个子元素，第一个编号为1
Y E:nth-last-child(n)     匹配其父元素的倒数第n个子元素，第一个编号为1
Y E:nth-of-type(n)        与:nth-child()作用类似，但是仅匹配使用同种标签的元素
Y E:nth-last-of-type(n)   与:nth-last-child() 作用类似，但是仅匹配使用同种标签的元素
Y E:last-child            匹配父元素的最后一个子元素，等同于:nth-last-child(1)
Y E:first-of-type         匹配父元素下使用同种标签的第一个子元素，等同于:nth-of-type(1)
Y E:last-of-type          匹配父元素下使用同种标签的最后一个子元素，等同于:nth-last-of-type(1)
Y E:only-child            匹配父元素下仅有的一个子元素，等同于:first-child:last-child或 :nth-child(1):nth-last-child(1)
Y E:only-of-type          匹配父元素下使用同种标签的唯一一个子元素，等同于:first-of-type:last-of-type或 :nth-of-type(1):nth-last-of-type(1)
Y E:empty                 匹配一个不包含任何子元素的元素，注意，文本节点也被看作子元素


10.CSS 3的反选伪类

N E:not(s)        匹配不符合当前选择器的任何元素


11. CSS 3中的 :target 伪类

N E:target        匹配文档中特定”id”点击后的效果


*/




/*

支持的伪类如下:

E:active        匹配鼠标已经其上按下、还没有释放的E元素
E:hover         匹配鼠标悬停其上的E元素
E:focus         匹配获得当前焦点的E元素
E:enabled       匹配表单中激活的元素
E:disabled      匹配表单中禁用的元素
E:checked       匹配表单中被选中的radio（单选框）或checkbox（复选框）元素
E:selection     匹配用户当前选中的元素
E:empty         匹配一个不包含任何子元素的元素，注意，文本节点也被看作子元素

E:before        E之前元素
E:after         E之后元素

E:nth-child(n)          匹配其父元素的第n个子元素，第一个编号为1
E:nth-last-child(n)     匹配其父元素的倒数第n个子元素，第一个编号为1
E:nth-of-type(n)        与:nth-child()作用类似，但是仅匹配使用同种标签的元素
E:nth-last-of-type(n)   与:nth-last-child() 作用类似，但是仅匹配使用同种标签的元素
E:first-child           匹配父元素的第一个子元素
E:last-child            匹配父元素的最后一个子元素，等同于:nth-last-child(1)
E:first-of-type         匹配父元素下使用同种标签的第一个子元素，等同于:nth-of-type(1)
E:last-of-type          匹配父元素下使用同种标签的最后一个子元素，等同于:nth-last-of-type(1)
E:only-child            匹配父元素下仅有的一个子元素，等同于:first-child:last-child或 :nth-child(1):nth-last-child(1)
E:only-of-type          匹配父元素下使用同种标签的唯一一个子元素，等同于:first-of-type:last-of-type或 :nth-of-type(1):nth-last-of-type(1)

*/

//选择器解析器(类css选择器语法)
(function (flyingon) {



    //元素节点
    var Selector_Element = flyingon.Selector_Element = function (type, token, name, previous) {

        this.type = type;
        this.token = token;

        switch (name[0])
        {
            case "\"":
            case "'":
                this.name = name.substring(1, name.length - 1);
                break;

            default:
                this.name = name;
                break;
        }

        if (previous)
        {
            previous.next = this;
            this.previous = previous;

            if (type == ",")
            {
                this.previous_type = previous.type;
            }
        }
    };


    (function () {

        //所属组合类型
        this.type = null;

        //前一个组合类型 仅对","有效
        this.previous_type = " ";

        //token标记
        this.token = null;

        //上一个节点
        this.previous = null;

        //下一个节点
        this.next = null;

        //改变构造函数
        this.constructor = Selector_Element;

        this.toString = this.toLocaleString = function () {

            var result = [];

            result.push(this.type);
            result.push(this.token);

            if (this.name != "*")
            {
                result.push(this.name);
            }

            for (var i = 0, length = this.length; i < length; i++)
            {
                result.push(this[i].toString());
            }

            var next = this.next;

            while (next)
            {
                result.push(next.toString());
                next = next.next;
            }

            return result.join("");
        };


    }).call(Selector_Element.prototype = flyingon.__pseudo_array__());





    //属性节点 
    var Selector_Property = flyingon.Selector_Property = function (name) {

        switch (name[0])
        {
            case "\"":
            case "'":
                this.name = name.substring(1, name.length - 1);
                break;

            default:
                this.name = name;
                break;
        }
    };

    (function () {

        //符号
        this.token = "[]";

        //操作符
        this.operator = "";

        //属性值
        this.value = null;

        //条件检测 通过返回目标对象 否则返回false
        this.check = function (target) {

            var value = target[this.name];

            switch (this.operator)
            {
                case "":
                    return value !== undefined ? target : false;

                case "=":
                    return value == this.value ? target : false;

                case "*=": // *= 包含属性值XX (由属性解析)
                    return value && ("" + value).indexOf(this.value) >= 0 ? target : false;

                case "^=": // ^= 属性值以XX开头 (由属性解析)
                    return value && ("" + value).indexOf(this.value) == 0 ? target : false;

                case "$=": // $= 属性值以XX结尾 (由属性解析)
                    return value && (value = "" + value).lastIndexOf(this.value) == value.length - this.value.length ? target : false;

                case "~=": // ~= 匹配以空格分隔的其中一段值 如匹配en US中的en (由属性解析)
                    return value && (this.regex || (this.regex = new RegExp("/(\b|\s+)" + this.value + "(\s+|\b)"))).test("" + value) ? target : false;

                case "|=": // |= 匹配以-分隔的其中一段值 如匹配en-US中的en (由属性解析)
                    return value && (this.regex || (this.regex = new RegExp("/(\b|\-+)" + this.value + "(\-+|\b)"))).test("" + value) ? target : false;

                default:
                    return false;
            }

            return target;
        };

        this.toString = this.toLocaleString = function () {

            return "[" + this.name + "]";
        };

    }).call(Selector_Property.prototype);



    //属性集
    var Selector_Properties = flyingon.Selector_Properties = function (item) {

        this.push(item);
    };

    (function () {

        this.token = "[][]";

        //条件检测 通过返回目标对象 否则返回false
        this.check = function (target) {

            for (var i = 0, length = this.length; i < length; i++)
            {
                if (this[i].check(target) === false)
                {
                    return false;
                }
            }

            return target;
        };

        this.toString = this.toLocaleString = function () {

            var result = [];

            for (var i = 0, length = this.length; i < length; i++)
            {
                result.push(this[i].name);
            }

            return "[" + result.join(",") + "]";
        };

    }).call(Selector_Properties.prototype = flyingon.__pseudo_array__());




    //伪类(不包含伪元素)
    var Selector_Pseudo_Class = flyingon.Selector_Pseudo_Class = function (name) {

        switch (name[0])
        {
            case "\"":
            case "'":
                this.name = name.substring(1, name.length - 1);
                break;

            default:
                this.name = name;
                break;
        }
    };

    (function () {

        this.token = ":";

        //条件检测 通过返回目标对象 否则返回false
        //注: 返回的目标对象可能与传入的对象不同(伪类元素会改变目标对象)
        this.check = function (target, element_fn) {

            switch (this.name)
            {
                case "active":
                case "hover":
                case "focus":
                case "disabled":
                case "checked":
                case "selection":
                    return target.states && target.states[this.name] ? target : false;

                case "enabled":
                    return !target.states || !target.states.disabled ? target : false;

                case "empty":
                    return !target.__children__ || target.__children__.length == 0 ? target : false;

                default: //伪元素 element_fn:伪元素查询方法
                    return element_fn ? element_fn[this.name].call(this, target) : false;
            }

            return target;
        };

        this.toString = this.toLocaleString = function () {

            return ":" + this.name;
        };

    }).call(Selector_Pseudo_Class.prototype = flyingon.__pseudo_array__());






    var split_regex = /"[^"]*"|'[^']*'|[\w-@%&]+|[.#* ,>+:=~|^$()\[\]]/g; //选择器拆分正则表达式


    //[name?=value]属性选择器
    function parse_property(values, length, index) {


        var nodes,
            item,
            token,

            count = 0,  //占用数组数量
            loop = true,
            end = false;


        while (loop && index < length)
        {
            count++;

            switch (token = values[index++])
            {
                case "]":
                    loop = false;
                    break;

                case ",":
                    if (nodes == null)
                    {
                        nodes = new Selector_Properties(item);
                    }

                    end = false;
                    break;

                case "*": // *= 包含属性值XX (由属性解析)
                case "^": // ^= 属性值以XX开头 (由属性解析)
                case "$": // $= 属性值以XX结尾 (由属性解析)
                case "~": // ~= 匹配以空格分隔的其中一段值 如匹配en US中的en (由属性解析)
                case "|": // |= 匹配以-分隔的其中一段值 如匹配en-US中的en (由属性解析)
                    item.operator += token;
                    break;

                case "=":
                    item.operator += "=";
                    end = true;
                    break;

                case " ":
                    break;

                default:
                    if (item && end)
                    {
                        switch (token[0])
                        {
                            case "\"":
                            case "'":
                                token = token.substring(1, token.length - 1);
                                break;
                        }

                        item.value = token;
                    }
                    else
                    {
                        item = new Selector_Property(token);

                        if (nodes)
                        {
                            nodes.push(item);
                        }
                    }
                    break;
            }
        }


        return {

            result: nodes || item,
            count: count
        };
    };



    //(p1[,p2...])
    function parse_parameters(values, length, index) {

        var result = 0,  //占用数组数量

            token,
            loop = true;

        while (loop && index < length)
        {
            result++;

            switch (token = values[index++])
            {
                case ")":
                    loop = false;
                    break;

                case " ":
                case ",":
                    break;

                default:
                    this.push(token);
                    break;
            }
        }

        return result;
    };



    //解析选择器 按从左至右的顺序解析
    flyingon.parse_selector = function (selector) {


        var result,
            node,   //当前节点

            type = " ", //组合类型
            token,      //当前标记

            values = selector.match(split_regex),
            i = 0,
            length = values.length;


        while (i < length)
        {
            //switch代码在chrome下的效率没有IE9好,不知道什么原因,有可能是其操作非合法变量名的时候性能太差
            switch (token = values[i++])
            {
                case "#":  //id选择器标记
                case ".":  //class选择器标记
                    node = new Selector_Element(type, token, values[i++], node);
                    break;

                case "*":  //全部元素选择器标记
                    node = new Selector_Element(type, "*", "*", node);
                    break;

                case " ":  //后代选择器标记
                    if (i == 1 || values[i - 2] != type) //前一个节点是类型则忽略
                    {
                        type = token;
                    }
                    continue;

                case ">":  //子元素选择器标记
                case "+":  //毗邻元素选择器标记
                case "~":  //之后同级元素选择器标记
                case ",":  //组合选择器标记
                    type = token;
                    continue;

                case "[": //属性 [name[?=value]] | [name[?=value]][, [name[?=value]]...] 必须属性某一节点
                    var item = parse_property(values, length, i);
                    i += item.count;

                    if (item = item.result)
                    {
                        (node || (node = new Selector_Element(type, "*", "*"))).push(item);  //未指定节点则默认添加*节点
                    }
                    break;

                case ":": //伪类 :name | :name(p1[,p2...])  必须属于某一节点 
                    if (token = values[i++])
                    {
                        var item = new Selector_Pseudo_Class(token);

                        //处理参数
                        if (i < length && values[i] == "(")
                        {
                            i += parse_parameters.call(item, values, length, ++i);
                        }

                        (node || (node = new Selector_Element(type, "*", "*"))).push(item); //未指定节点则默认添加*节点
                    }
                    break;

                case "]":  //属性选择器结束标记
                case "=":  //属性名与值的分隔 可与其它字符组合
                case "|":  //|= 匹配以-分隔的其中一段值 如匹配en-US中的en (由属性解析)
                case "^":  //^= 属性值以XX开头 (由属性解析)
                case "$":  //$= 属性值以XX结尾 (由属性解析)
                case "(":  //开始参数
                case ")":  //结束参数
                    //由子类处理
                    continue;

                default: //类名 token = ""
                    node = new Selector_Element(type, "", token, node);
                    break;
            }


            type = " "; //容错处理(css不支持容错) 未指定组合类型则默认使用" "

            if (!result && node)
            {
                result = node;
            }
        }


        return result || new Selector_Element(type, "*", "*");
    };



})(flyingon);




﻿

/*

支持的伪类如下:

E:active        匹配鼠标已经其上按下、还没有释放的E元素
E:hover         匹配鼠标悬停其上的E元素
E:focus         匹配获得当前焦点的E元素
E:enabled       匹配表单中激活的元素
E:disabled      匹配表单中禁用的元素
E:checked       匹配表单中被选中的radio（单选框）或checkbox（复选框）元素
E:selection     匹配用户当前选中的元素
E:empty         匹配一个不包含任何子元素的元素，注意，文本节点也被看作子元素

//之后的元素会转为节点元素

E:before        E之前元素
E:after         E之后元素

E:nth-child(n)          匹配其父元素的第n个子元素，第一个编号为1
E:nth-last-child(n)     匹配其父元素的倒数第n个子元素，第一个编号为1
E:nth-of-type(n)        与:nth-child()作用类似，但是仅匹配使用同种标签的元素
E:nth-last-of-type(n)   与:nth-last-child() 作用类似，但是仅匹配使用同种标签的元素
E:first-child           匹配父元素的第一个子元素
E:last-child            匹配父元素的最后一个子元素，等同于:nth-last-child(1)
E:first-of-type         匹配父元素下使用同种标签的第一个子元素，等同于:nth-of-type(1)
E:last-of-type          匹配父元素下使用同种标签的最后一个子元素，等同于:nth-last-of-type(1)
E:only-child            匹配父元素下仅有的一个子元素，等同于:first-child:last-child或 :nth-child(1):nth-last-child(1)
E:only-of-type          匹配父元素下使用同种标签的唯一一个子元素，等同于:first-of-type:last-of-type或 :nth-of-type(1):nth-last-of-type(1)


注: 不支持样式继承, 即不能从父元素继承属性值, 可通过组合选择器" "或">"设置子元素属性值

*/

//扩展选择器条件检测
(function (flyingon) {




    var Selector_Element = flyingon.Selector_Element,  //缓存元素类

        class_list = flyingon.__registry_class_list__, //已注册类型集合

        style_list = {},  //样式集  注:为加快样式值查找对所有样式按元素类型进行分类存储 此处的优先级可能与css样式有些差异???

        style_cache = {}, //样式缓存

        style_group_list = {},   //缓存组名

        pseudo_level = {},  //伪元素级别

        pseudo_keys = {  //伪类key 不在此列即为伪元素 value为伪元素权重 默认为10

            selection: 16,
            enabled: 15,
            disabled: 15,
            active: 14,
            hover: 13,
            focus: 12,
            checked: 11
        },

        style_counter = 0; //样式计数器(控制样式组缓存更新)





    //扩展样式检测 检测指定对象是否符合当前选择器
    Selector_Element.prototype.style_check = function (target) {

        //必须先检测属性及伪类 因为有伪元素的情况下会改变目标对象
        for (var i = 0, length = this.length; i < length; i++)
        {
            if ((target = this[i].check(target, element_fn)) === false)
            {
                return false;
            }
        }

        switch (this.token)
        {
            case "":  //类型
                if (!(target instanceof (this.__type__ || (this.__type__ = class_list[this.name]) || flyingon.Visual)))
                {
                    return false;
                }
                break;

            case ".": //class
                if (!target.__class__ || !target.__class__[this.name])
                {
                    return false;
                }
                break;

            case "#": //id
                if (target.id != this.name)
                {
                    return false;
                }
                break;
        }

        //继续检测上一节点
        if (this.previous && type_fn[this.type].call(this.previous, target) === false)
        {
            return false;
        }

        return true;
    };


    //组合查询方法
    //注: ","组合类型已被拆分,此处不处理
    var type_fn = (function () {

        this[" "] = function (target) {

            var cache = target.__parent__;

            while (cache)
            {
                if (target = this.style_check(cache))
                {
                    return target;
                }

                cache = cache.__parent__;
            }

            return false;
        };

        this[">"] = function (target) {

            return (target = target.__parent__) ? this.style_check(target) : false;
        };

        this["+"] = function (target) {

            var cache = target.__parent__, index;

            target = cache && (cache = cache.__children__) && (index = cache.indexOf(this)) > 0 && cache[--index];
            return target ? this.style_check(target) : false;
        };

        this["~"] = function (target) {

            var cache = target.__parent__, index;

            if (cache && (cache = cache.__children__) && (index = cache.indexOf(this)) > 0)
            {
                for (var i = index - 1; i >= 0; i--)
                {
                    if (target = this.style_check(cache[i]))
                    {
                        return target;
                    }
                }
            }

            return false;
        };

        return this;

    }).call({});


    //伪类元素查询方法  
    //注:此处为反向查找 即:已知目标反查条件
    var element_fn = (function () {

        //获取后一节点
        this.before = function (target) {

            var cache = target.__parent__, index;
            return (cache && (cache = cache.__children__) && (index = cache.indexOf(this)) >= 0 && cache[++index]) || false;
        };

        //获取前一节点
        this.after = function (target) {

            var cache = target.__parent__, index;
            return (cache && (cache = cache.__children__) && (index = cache.indexOf(this)) > 0 && cache[--index]) || false;
        };

        //检测当前节点是否唯一子节点,是则返回父节点
        this["first-child"] = function (target) {

            var parent = target.__parent__, cache;
            return parent && (cache = parent.__children__) && cache.length > 0 && cache[0] == target ? parent : false;
        };

        this["first-of-type"] = function (target) {

            var parent = target.__parent__, cache;
            return parent && (cache = parent.__children__) && cache.length > 0 && cache[0] == target && parent.__fullTypeName__ == target.__fullTypeName__ ? parent : false;
        };

        this["last-child"] = function (target) {

            var parent = target.__parent__, cache;
            return parent && (cache = parent.__children__) && cache.length > 0 && cache[cache.length - 1] == target ? parent : false;
        };

        this["last-of-type"] = function (target) {

            var parent = target.__parent__, cache;
            return parent && (cache = parent.__children__) && cache.length > 0 && cache[cache.length - 1] == target && parent.__fullTypeName__ == target.__fullTypeName__ ? parent : false;
        };

        this["only-child"] = function (target) {

            var parent = target.__parent__, cache;
            return parent && (cache = parent.__children__) && cache.length == 1 ? parent : false;
        };

        this["only-of-type"] = function (target) {

            var parent = target.__parent__, cache;
            return parent && (cache = parent.__children__) && cache.length == 1 && parent.__fullTypeName__ == target.__fullTypeName__ ? parent : false;
        };

        this["nth-child"] = function (target) {

            var parent = target.__parent__, cache, index = +this.value;
            return parent && (cache = parent.__children__) && cache.length > index && cache[index] == target ? parent : false;
        };

        this["nth-of-type"] = function (target) {

            var parent = target.__parent__, cache, index = +this.value;
            return parent && (cache = parent.__children__) && cache.length > index && cache[index] == target && parent.__fullTypeName__ == target.__fullTypeName__ ? parent : false;
        };

        this["nth-last-child"] = function (target) {

            var parent = target.__parent__, cache, index = +this.value;
            return parent && (cache = parent.__children__) && cache.length > index && cache[cache.length - index - 1] == target ? parent : false;
        };

        this["nth-last-of-type"] = function (target) {

            var parent = target.__parent__, cache, index = +this.value;
            return parent && (cache = parent.__children__) && cache.length > index && cache[cache.length - index - 1] == target && parent.__fullTypeName__ == target.__fullTypeName__ ? parent : false;
        };

        return this;

    }).call({});




    //获取样式组 按元素类型进行分组 如果有伪元素则类型设为*
    function style_group(element) {

        var result = element.token == "*" ? "Control" : element.token + element.name,
            pseudo, //伪元素
            item;

        for (var i = 0, length = element.length; i < length; i++)
        {
            if ((item = element[i]).token == ":" && !pseudo_keys[item.name]) //伪元素作特殊处理以加快检索
            {
                pseudo = pseudo ? pseudo + ":" : ":";
            }
        }

        if (pseudo && !pseudo_level[pseudo.length])
        {
            pseudo_level[pseudo.length] = pseudo; //记录第n级父元素的样式组

            if (!(pseudo_level.max >= pseudo.length))
            {
                pseudo_level.max = pseudo.length;
            }

            result = pseudo + result; //前面叠加":"作为组名 有几层子级则加几个":"
        }

        return element.__group__ = result;
    };

    //样式key
    function style_key(element) {

        while (element.previous)
        {
            element = element.previous;
        }

        return element.toString();
    };

    /*
    css选择器权重
    类型选择符的权重为：0001
    类选择符的权重为：0010
    通用选择符的权重为：0000
    子选择符的权重为：0000
    属性选择符的权重为：0010
    伪类选择符的权重为：0010 (此处做了特殊处理:默认为10, 其它伪类提升至11-16)
    伪元素选择符的权重为：0010
    包含选择符的权重为：包含的选择符权重值之和
    内联样式的权重为：1000
    继承的样式的权重为：0000
    */

    //计算选择器的权重
    function style_weight(element) {

        var result = 0;

        do
        {
            switch (element.token)
            {
                case "#":
                    result += 100;
                    break;

                case ".":
                    result += 10;
                    break;

                case "":
                    result += 1;
                    break;
            }

            for (var i = 0; i < element.length; i++)
            {
                result += (element[i].token == ":" && pseudo_keys[element[i].name]) || 10;
            }

        } while (element.next && (element = element.next));


        return element.__weight__ = result << 8; //左移8个字节以留足中间插入的空间(即中间最多可插入256个元素)
    };



    //初始化控件样式组key缓存 先排除无关的样式
    function initialize_group_keys(target) {


        var result = [],

            group_list = style_group_list,
            pseudo_list = pseudo_level,

            items,
            item,

            length,
            cache;


        //预处理伪元素 记下最多可用父节点
        if ((length = pseudo_list.max) > 0)
        {
            item = target;

            for (var i = length; i > 0; i--)
            {
                if (item = item.__parent__)
                {
                    (items || (items = [])).push(pseudo_list[i] ? item : null); //中空的不记录
                }
            }
        }


        //1. id伪元素
        if (items)
        {
            length = items.length; //items从子到父排列

            for (var i = length - 1; i >= 0; i--)
            {
                if ((item = items[i]) && (cache = item.id) && (group_list[cache = pseudo_list[i + 1] + "#" + cache]))
                {
                    result.push(cache);
                }
            }
        }


        //2. id
        if ((cache = target.id) && (group_list[cache = "#" + cache]))
        {
            result.push(cache);
        }


        //3. class伪元素
        if (items)
        {
            for (var i = length - 1; i >= 0; i--)
            {
                if ((item = items[i]) && (item = item.__class__) && (item = item.__names__))
                {
                    for (var j = 0, count = item.length; j < count; j++)
                    {
                        if (group_list[cache = pseudo_list[i + 1] + "." + item[j]])
                        {
                            result.push(cache);
                        }
                    }
                }
            }
        }


        //4. class
        if ((item = target.__class__) && (item = item.__names__))
        {
            for (var i = 0, count = item.length; i < count; i++)
            {
                if (group_list[cache = "." + item[i]])
                {
                    result.push(cache);
                }
            }
        }


        //5. type伪元素
        if (items)
        {
            for (var i = length - 1; i >= 0; i--)
            {
                if ((item = items[i]) && (cache = item.__fullTypeName__) && (group_list[cache = pseudo_list[i + 1] + cache]))
                {
                    result.push(cache);
                }
            }
        }


        //6. type
        cache = target.__type__;
        while (cache && cache != flyingon.SerializableObject)
        {
            if (group_list[cache.fullTypeName])
            {
                result.push(cache.fullTypeName);
            }

            cache = cache.superclass;
        }


        //样式组计数器
        target.__style_counter__ = style_counter;

        //缓存至目标控件
        return target.__style_group__ = result;
    };



    //获取指定组名的最后一个样式值
    flyingon.styleValue_group = function (group, name) {

        var style = style_list[name];

        if (style && (style = style[group]))
        {
            var names = data.__names__ || (data.__names__ = Object.keys(data));

            if (names.length > 0)
            {
                return style[names[names.length - 1]];
            }
        }
    };

    //获取样式值
    flyingon.styleValue = function (target, name) {

        var style, data;

        if (target && (style = style_list[name]))
        {
            var keys = (target.__style_counter__ == style_counter && target.__style_group__) || initialize_group_keys(target);

            for (var i = 0, length = keys.length; i < length; i++)
            {
                if (data = style[keys[i]])
                {
                    var names = data.__names__ || (data.__names__ = Object.keys(data));

                    loop:
                        for (var j = names.length - 1; j >= 0; j--)
                        {
                            var items = data[names[j]],
                                element = items[0],
                                control = target;

                            //必须先检测属性及伪类 因为有伪元素的情况下会改变目标对象 此处直接处理减少函数调用以提升性能
                            for (var i = 0, length = element.length; i < length; i++)
                            {
                                if ((control = element[i].check(control, element_fn)) === false)
                                {
                                    continue loop;
                                }
                            }

                            //继续检测上一节点
                            if (element.previous && type_fn[element.type].call(element.previous, control) === false)
                            {
                                continue;
                            }

                            return items[1];
                        }
                }
            }
        }
    };


    var Thickness = flyingon.Thickness,

        Align = flyingon.Align,

        convert_regex = /\-(\w)/,

        convert_name = (function () {

            ["margin", "border", "padding"].forEach(function (name) {

                ["left", "top", "right", "bottom"].forEach(function (key) {

                    this[name + "-" + key] = name;
                    this[name + key[0].toUpperCase() + key.substring(1)] = name;

                }, this);

            }, this);

            return this;

        }).call({}),

        convert_fn = (function () {

            ["margin", "border", "padding"].forEach(function (name) {

                this[name] = function (value) {

                    return value instanceof Thickness ? value : (this[name] = new Thickness(value));
                };

                ["left", "top", "right", "bottom"].forEach(function (key) {

                    this[name + "-" + key] = this[name + key[0].toUpperCase() + key.substring(1)] = function (value) {

                        var result = this[name] || (this[name] = new Thickness());
                        result[key] = +value || 0;
                        return result;
                    };

                }, this);

            }, this);

            this.align = this.textAlign = function (value) {

                return value instanceof Align ? value : new Align(value);
            };

            return this;

        }).call({});

    //处理样式 按样式属性名存储 再根据
    function handle_style(element, style) {

        var target,
            group = element.__group__ || style_group(element), //处理样式组
            weight = element.__weight__ || style_weight(element), //当前权重
            value,
            index;

        style_group_list[group] = true; //缓存组名
        element.key = style_key(element); //保存选择器名

        loop:
            for (var name in style)
            {
                //处理值
                value = ((value = convert_fn[name]) && value.call(style, style[name])) || style[name];

                if (value !== undefined) //样式属性值设置为undefined则不处理
                {
                    //处理名称
                    name = convert_name[name] || name.replace(convert_regex, function (key, letter) {

                        return letter.toUpperCase();
                    });

                    if (target = style_list[name]) //已有属性
                    {
                        target = target[group] || (target[group] = {});
                        index = weight;

                        while (target[index])
                        {
                            if (target[index][0].key == element.key) //如果选择器相等则后面冲掉前面的值
                            {
                                target[index] = [element, value];
                                continue loop;
                            }

                            index++;
                        }

                        target[index] = [element, value];
                        delete target.__names__;
                    }
                    else
                    {
                        ((style_list[name] = {})[group] = {})[weight] = [element, value];
                    }
                }
            }
    };



    flyingon.reset_style = function () {

        style_list = {};
        style_cache = {};
        style_group_list = {};
        pseudo_level = {};
    };


    //复制元素
    function copy_element(element, previous, cascade) {

        var result = new Selector_Element(element.type, element.token, element.name, previous);

        for (var i = 0, length = element.length; i < length; i++)
        {
            result[i] = element[i];
        }

        //级联复制上级
        if (cascade && (previous = element.previous))
        {
            previous = element.previous = copy_element(previous, null, true);
            previous.next = element;
        }

        return result;
    };


    //拆分元素 把组合元素拆成多组非组合元素
    function split_element(element) {

        var next, items, cache;

        while (next = element.next)
        {
            if (next && next.type == ",")
            {
                cache = [];

                cache.push(element);
                element.next = null;
                element = next;

                do
                {
                    element.previous = null;
                    element.type = element.previous_type;
                    delete element.previous_type;

                    cache.push(element);

                } while ((element = element.next) && element.type == ",")

                if (items) //交叉
                {
                    var exports = [];

                    for (var i = 0, length = items.length; i < length; i++)
                    {
                        for (var j = 0, length1 = cache.length; j < length1; j++)
                        {
                            exports.push(copy_element(cache[j], items[i], true)); //复制生成新节点
                        }
                    }

                    items = exports;
                }
                else
                {
                    items = cache;
                }
            }
            else
            {
                if (items)
                {
                    for (var i = 0, length = items.length; i < length; i++)
                    {
                        items[i] = copy_element(element, items[i]); //复制生成新节点
                    }
                }
            }

            element = next;
        }

        return items || element;
    };



    //定义样式
    flyingon.defineStyle = function (selector, style, super_selector) {

        if (selector && style)
        {
            var cache;

            //处理继承
            if (super_selector && (cache = style_cache[super_selector]))
            {
                cache = Object.create(cache);

                for (var name in style)
                {
                    cache[name] = style[name];
                }

                style = cache;
            }

            //缓存样式
            style_cache[selector] = style;

            //解析选择器
            var element = flyingon.parse_selector(selector);

            if ((cache = split_element(element)).constructor == Array)
            {
                for (var i = 0, length = cache.length; i < length; i++)
                {
                    handle_style(cache[i], style);
                }
            }
            else
            {
                handle_style(cache, style);
            }


            style_counter++;
        }

    };


})(flyingon);




﻿/*

Canvas2D绘图扩展


参考:http://www.w3school.com.cn/html5/html5_ref_canvas.asp

*/

(function (flyingon) {




    /*
    转成RGB颜色

    */
    flyingon.toRGBString = function (r, g, b, alpha) {

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
    flyingon.toHSLString = function (hue, saturation, lightness, alpha) {

        if (alpha == null)
        {
            return "hsl(" + (hue % 360) + "," + saturation + "%," + lightness + "%)";
        }

        return "hsla(" + (hue % 360) + "," + saturation + "%," + lightness + "%," + alpha + ")";
    };




    /*
    线性渐变

    */
    var LinearGradient = flyingon.LinearGradient = function (x1, y1, x2, y2, colorStops) {

        this.x1 = x1;
        this.y1 = y1;
        this.x2 = x2;
        this.y2 = y2;
        this.colorStops = colorStops;
    };

    LinearGradient.prototype.createBrush = function (context) {

        var r = context.boxModel.clientRect,

            x = r.windowX,
            y = r.windowY,
            width = r.width,
            height = r.height,

            g = context.createLinearGradient(x + this.x1 * width, y + this.y1 * height, x + this.x2 * width, y + this.y2 * height),

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
    var RadialGradient = flyingon.RadialGradient = function (x1, y1, radius1, x2, y2, radius2, colorStops) {

        this.x1 = x1;
        this.y1 = y1;
        this.radius1 = radius1;
        this.x2 = x2;
        this.y2 = y2;
        this.radius2 = radius2;
        this.colorStops = colorStops;
    };

    RadialGradient.prototype.createBrush = function (context) {

        var r = context.boxModel.clientRect,

            x = r.windowX,
            y = r.windowY,
            width = r.width,
            height = r.height,

            g = context.createRadialGradient(x + this.x1 * width, y + this.y1 * height, this.radius1, x + this.x2 * width, y + this.y2 * height, this.radius2),

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
    var ImagePattern = flyingon.ImagePattern = function (image, repetition) {

        this.image = image;
        this.repetition = repetition;
    };

    ImagePattern.prototype.createBrush = function (context) {

        return context.createPattern(this.image, this.repetition);
    };




    var radian = Math.PI / 180, //角度转弧度系数

        prototype = CanvasRenderingContext2D.prototype;



    /****************************以下为属性方法扩展********************************/


    /*    
    set_fillStyle(color) = "#000000"	设置填充色
    set_strokeStyle(color) = "#000000"	设置边框色
    */
    ["fillStyle", "strokeStyle"].forEach(function (name) {

        this["set_" + name] = function (value) {

            this[name] = value && value.createBrush ? value.createBrush(this) : value;
            return this;
        };

    }, prototype);



    /*    
    set_shadowColor(color) = "#000000"	设置或返回用于阴影的颜色 
    */
    prototype.set_shadowColor = function (color) {

        this.shadowColor = color;
        return this;
    };

    /* 
    set_shadowBlur(number) = 0	    设置或返回用于阴影的模糊级别 
    */
    prototype.set_shadowBlur = function (value) {

        this.shadowBlur = value;
        return this;
    };

    /* 
    set_shadowOffsetX(number) = 0	设置或返回阴影距形状的水平距离 
    */
    prototype.set_shadowOffsetX = function (value) {

        this.shadowOffsetX = value;
        return this;
    };

    /* 
    set_shadowOffsetY(number) = 0	设置或返回阴影距形状的垂直距离 
    */
    prototype.set_shadowOffsetY = function (value) {

        this.shadowOffsetY = value;
        return this;
    };

    /* 
    set_lineCap("butt|round|square") = "butt"	    设置或返回线条的结束端点样式 
    */
    prototype.set_lineCap = function (value) {

        this.lineCap = value;
        return this;
    };

    /* 
    set_lineJoin("bevel|round|miter") = "miter"	    设置或返回两条线相交时 所创建的拐角类型 
    */
    prototype.set_lineJoin = function (value) {

        this.lineJoin = value;
        return this;
    };

    /* 
    set_lineWidth(number) = 1	    设置或返回当前的线条宽度 
    */
    prototype.set_lineWidth = function (value) {

        this.lineWidth = value;
        return this;
    };

    /* 
    set_miterLimit(number) = 10	    设置或返回最大斜接长度 
    */
    prototype.set_miterLimit = function (value) {

        this.miterLimit = value;
        return this;
    };

    /* 
    set_font("italic small-caps bold 12px arial") = "10px sans-serif"	设置或返回文本内容的当前字体属性 
    */
    prototype.set_font = function (value) {

        this.font = value;
        return this;
    };

    /* 
    set_textAlign("center|end|left|right|start") = "start"	设置或返回文本内容的当前对齐方式 
    */
    //start     文本在指定的位置开始
    //end       文本在指定的位置结束
    //center    文本的中心被放置在指定的位置
    //left      文本左对齐
    //right     文本右对齐
    prototype.set_textAlign = function (value) {

        this.textAlign = value;
        return this;
    };

    /* 
    set_textBaseline("alphabetic|top|hanging|middle|ideographic|bottom") = "alphabetic"	设置或返回在绘制文本时使用的当前文本基线
    */
    //alphabetic    文本基线是普通的字母基线
    //top           文本基线是 em 方框的顶端
    //hanging       文本基线是悬挂基线
    //middle        文本基线是 em 方框的正中
    //ideographic   文本基线是表意基线
    //bottom        文本基线是 em 方框的底端
    prototype.set_textBaseline = function (value) {

        this.textBaseline = value;
        return this;
    };

    /* 
    set_globalAlpha(number)	透明值 必须介于0.0(完全透明)与1.0(不透明)之间
    */
    prototype.set_globalAlpha = function (value) {

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
    prototype.set_globalCompositeOperation = function (value) {

        this.globalCompositeOperation = value;
        return this;
    };


    /*****************************************************************************/






    /****************************以下为标准方法说明********************************/

    /*
    rect(x, y, width, height)	    创建矩形
    fillRect(x, y, width, height)	绘制“被填充”的矩形
    strokeRect(x, y, width, height)	绘制矩形(无填充)
    clearRect(x, y, width, height)	在给定的矩形内清除指定的像素

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


    //绘制图像
    prototype.paint_image = function (image, x, y, width, height, align, stretch) {

        var _width = image.width,
            _height = image.height,
            cache;

        if (stretch)
        {
            switch (stretch)
            {
                case "clip":
                    if (_width > width)
                    {
                        _width = width;
                    }

                    if (_height > height)
                    {
                        _height = height;
                    }
                    break;

                case "zoom":
                    cache = Math.min(_width / width, _height / height);
                    _width *= cache;
                    _height *= cache;
                    break;

                case "stretch":
                    this.drawImage(image, x, y, width, height);
                    return;
            }
        }

        if (align)
        {
            if (cache = width - _width)
            {
                switch (align.horizontal)
                {
                    case "center":
                        x += cache >> 1;
                        break;

                    case "right":
                        x += cache;
                        break;
                }
            }

            if (cache = height - _height)
            {
                switch (align.vertical)
                {
                    case "middle":
                        y += cache >> 1;
                        break;

                    case "bottom":
                        y += cache;
                        break;
                }
            }
        }

        if (stretch)
        {
            this.drawImage(image, 0, 0, _width, _height, x, y, width, height);
        }
        else
        {
            this.drawImage(image, x, y);
        }
    };


    //绘制边框
    prototype.paint_border = function (x, y, width, height, border) {

        this.beginPath();

        this.rect(x, y, width - border.right, border.top);
        this.rect(x + width - border.right, y, border.right, height - border.bottom);
        this.rect(x + border.left, y + height - border.bottom, width - border.left, border.bottom);
        this.rect(x, y + border.top, border.left, height - border.top);

        this.fill();
    };



    prototype.rectTo = function (x, y, width, height, anticlockwise) {

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
    prototype.roundRect = function (x, y, width, height, radius, anticlockwise) {

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
    prototype.fillRoundRect = function (x, y, width, height, radius) {

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
    prototype.strokeRoundRect = function (x, y, width, height, radius) {

        this.beginPath();
        this.roundRect(x, y, width, height, radius);
        this.stroke();
    };


    //多边形
    prototype.polygon = function (sides, x, y, radius, angle, anticlockwise) {

        var delta = (anticlockwise ? -2 : 2) * Math.PI / sides;

        angle = angle ? angle * radian : 0;

        this.moveTo(x + radius * Math.sin(angle), y - radius * Math.cos(angle));

        for (var i = 1; i <= sides; i++)
        {
            angle += delta;
            this.lineTo(x + radius * Math.sin(angle), y - radius * Math.cos(angle));
        }
    };

    prototype.fillPolygon = function (sides, x, y, radius, angle, anticlockwise) {

        this.beginPath();
        this.polygon(sides, x, y, radius, angle, anticlockwise);
        this.fill();
    };

    prototype.strokePolygon = function (sides, x, y, radius, angle, anticlockwise) {

        this.beginPath();
        this.polygon(sides, x, y, radius, angle, anticlockwise);
        this.stroke();
    };



    prototype.starPolygon = function (vertexes, x, y, radius1, radius2, angle, anticlockwise) {

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

    prototype.fillStarPolygon = function (vertexes, x, y, radius1, radius2, angle, anticlockwise) {

        this.beginPath();
        this.starPolygon(vertexes, x, y, radius1, radius2, angle, anticlockwise);
        this.fill();
    };

    prototype.strokeStarPolygon = function (vertexes, x, y, radius1, radius2, angle, anticlockwise) {

        this.beginPath();
        this.starPolygon(vertexes, x, y, radius1, radius2, angle, anticlockwise);
        this.stroke();
    };



    prototype.ellipse = function (x, y, width, height, anticlockwise) {

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

    prototype.fillEllipse = function (x, y, width, height) {

        this.beginPath();
        this.ellipse(x, y, width, height);
        this.fill();
    };

    prototype.strokeEllipse = function (x, y, width, height) {

        this.beginPath();
        this.ellipse(x, y, width, height);
        this.stroke();
    };



    //画虚线
    prototype.dashLine = function (x1, y1, x2, y2, dashArray) {

        dashArray = dashArray || [10, 5];

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
    prototype.cache = function (width, height) {

        cache.width = width;
        cache.height = height;

        return cache.getContext("2d");
    };

    //复制至指定目标
    prototype.copyTo = function (target, x, y) {

        var data = this.getImageData(0, 0, this.canvas.width, this.canvas.height);
        target.putImageData(data, x, y);
    };



})(flyingon);




﻿

//图片管理
(function (flyingon) {


    var image_list = flyingon.images = {}, //图片集
        image_blank = null; //默认图片



    //定义图像
    flyingon.defineImages = function (images) {

        for (var name in images)
        {
            (image_list[name] = new Image()).src = images[name]; //直接转成Image对象
        }

        if (!image_blank && images.blank)
        {
            image_blank = images.blank;
        }
    };



    //获取图片
    flyingon.get_image = function (name) {

        return image_list[name] || image_blank;
    };

    //按顺序获取其中一张有效的图片
    flyingon.get_image_any = function (names) {

        var result;

        for (var i = 0, length = names.length; i < length; i++)
        {
            if (result = image_list[names[i]])
            {
                return result;
            }
        }

        return image_blank;
    };


})(flyingon);






﻿/*

*/
(function (flyingon) {


    var prototype = (flyingon.Point = function (x, y) {

        this.x = x || 0;
        this.y = y || 0;

    }).prototype;



    prototype.toString = prototype.toLocaleString = function () {

        return "{ x:" + this.x + ", y:" + this.y + " }";
    };


})(flyingon);




(function (flyingon) {


    var prototype = (flyingon.Size = function (width, height) {

        this.width = width || 0;
        this.height = height || 0;

    }).prototype;



    prototype.toString = prototype.toLocaleString = function () {

        return "{ width:" + this.width + ", height:" + this.height + " }";
    };


})(flyingon);




(function (flyingon) {


    var prototype = (flyingon.Rect = function (x, y, width, height) {

        if (arguments.length > 0)
        {
            this.x = x || 0;
            this.y = y || 0;
            this.width = width || 0;
            this.height = height || 0;
        }

    }).prototype;



    prototype.x = 0;

    prototype.y = 0;

    prototype.width = 0;

    prototype.height = 0;



    flyingon.defineProperty(prototype, "right", function () {

        return this.x + this.width;
    });

    flyingon.defineProperty(prototype, "bottom", function () {

        return this.y + this.height;
    });



    prototype.copy = function (width_delta, height_delta) {

        return new flyingon.Rect(this.x, this.y, this.width + (width_delta || 0), this.height + (height_delta || 0));
    };

    prototype.toString = prototype.toLocaleString = function () {

        return "{ x:" + this.x + ", y:" + this.y + ", width:" + this.width + ", height:" + this.height + " }";
    };


})(flyingon);




(function (flyingon) {


    //角度转弧度系数
    var radian = Math.PI / 180;


    //2D仿射变换矩阵
    //a	水平旋转绘图
    //b	水平倾斜绘图
    //c	垂直倾斜绘图
    //d	垂直缩放绘图
    //e	水平移动绘图
    //f	垂直移动绘图
    var prototype = (flyingon.Matrix = function () {

        this.a = 1;

        this.b = 0;

        this.c = 0;

        this.d = 1;

        this.e = 0;

        this.f = 0;

    }).prototype;


    prototype.fromArray = function (array) {

        this.a = array[0];
        this.b = array[1];
        this.c = array[2];
        this.d = array[3];
        this.e = array[4];
        this.f = array[5];

        return this;
    };

    prototype.toArray = function () {

        return [this.a, this.b, this.c, this.d, this.e, this.f];
    };

    prototype.translate = function (x, y) {

        this.add(1, 0, 0, 1, x, y);
        return this;
    };

    prototype.scale = function (scaleX, scaleY) {

        this.add(scaleX, 0, 0, scaleY, 0, 0);
        return this;
    };

    prototype.rotate = function (angle) {

        angle *= radian;

        var cos = Math.cos(angle);
        var sin = Math.sin(angle);

        this.add(-sin, cos, cos, sin, 0, 0);
        return this;
    };

    prototype.skew = function (skewX, skewY) {

        var x = Math.Tan(skewX * n);
        var y = Math.Tan(skewY * n);

        this.add(1, x, y, 1, 0, 0);
        return this;
    };

    prototype.add = function (a, b, c, d, e, f) {

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


    prototype.transform = function (x, y) {

        return {
            x: Math.round(x * this.a + y * this.b + this.e, 0),
            y: Math.round(x * this.c + y * this.d + this.f, 0)
        };
    };

    prototype.reverse = function (x, y) {

        return {
            x: Math.round((this.b * y - this.d * x + this.d * this.e - this.b * this.f) / (this.c * this.b - this.a * this.d)),
            y: Math.round((this.c * x - this.a * y - this.c * this.e + this.a * this.f) / (this.c * this.b - this.a * this.d))
        };
    };


})(flyingon);




﻿/*

*/
(function (flyingon) {



    //拖拉管理
    var Dragdrop = flyingon.Dragdrop = {};





    //局部变量
    var dragger,            //拖拉者
        timer,              //定时器

        ownerWindow,        //所属窗口
        ownerLayer,         //拖拉层
        ownerControl,       //目标控件

        dragTargets,        //拖动目标
        dropTarget,         //接收目标

        dragging,           //是否正在拖动
        droppable,          //是否可放下

        start_event,        //原始事件
        last_event,  //记录最后的mousemove事件参数, 用于记录停止拖拉时的最后位置, mouseup为鼠标按下时的坐标,与需求不符
        offsetX,    //X方向因移动造成的修正距离
        offsetY;    //Y方向因移动造成的修正距离




    //新建事件
    function new_event(type, originalEvent) {

        var result = new flyingon.DragEvent(type, ownerControl, originalEvent);

        result.dragTargets = dragTargets;
        result.dropTarget = dropTarget;

        return result;
    };

    //创建拖拉层
    function createLayer() {

        ownerLayer = new flyingon.Layer();
        ownerLayer.disableGetControlAt = true;
        ownerLayer.clipToBounds = false;

        var style = ownerLayer.dom_layer.style;

        style.overflow = "visible";
        style.cursor = dragger.drop_cursor || "move";
        style.opacity = dragger.opacity || 0.5;

        ownerWindow.appendLayer(9999, ownerLayer);
    };




    //默认拖拉者
    Dragdrop.dragger = {


        //默认开始行为
        start: function (event) {

            //发送事件
            ownerControl.dispatchEvent(event);
        },

        //默认绘制行为
        paint: function (context, dragTargets) {

            for (var i = 0; i < dragTargets.length; i++)
            {
                var box = dragTargets[i].__boxModel__;
                if (box)
                {
                    box.render(context);
                }
            }
        },

        //默认移动行为
        move: function (dom_MouseEvent, offsetX, offsetY) {

            //需修正div移动偏差
            var target = ownerWindow.findAt(dom_MouseEvent.offsetX + offsetX, dom_MouseEvent.offsetY + offsetY),
                event;


            if (target == ownerControl)
            {
                target = ownerControl.__parent__;
            }

            if (dropTarget != target)
            {
                if (dropTarget)
                {
                    event = new_event("dragleave", dom_MouseEvent);
                    dropTarget.dispatchEvent(event);
                }


                droppable = false;

                if (target && target.droppable)
                {
                    dropTarget = target;

                    event = new_event("dragenter", dom_MouseEvent);

                    if (target.dispatchEvent(event))
                    {
                        droppable = true;
                    }
                }
                else
                {
                    dropTarget = target = null;
                }


                var cursor = droppable ? (dragger.drop_cursor || "move") : (dragger.nodrop_cursor || "no-drop");
                ownerLayer.dom_layer.style.cursor = cursor;
            }


            event = new_event("drag", dom_MouseEvent);
            ownerControl.dispatchEvent(event);


            if (target)
            {
                event = new_event("dragover", dom_MouseEvent);
                target.dispatchEvent(event);
            }
        },

        //默认停止行为
        stop: function (dom_MouseEvent, offsetX, offsetY) {

            if (dropTarget)
            {
                dropTarget.dispatchEvent(new_event("drop", dom_MouseEvent));
            }

            ownerControl.dispatchEvent(new_event("dragend", dom_MouseEvent));
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
        dragger = Dragdrop.dragger;


        //拖动目标
        dragTargets = [ownerControl];


        //开始拖拉事件
        var event = new_event("dragstart", start_event);

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
            dragger.paint.call(ownerControl, ownerLayer.context, dragTargets);
        }
        else
        {
            dragging = false;
        }
    };

    //开始拖动(200毫秒内保持按下鼠标则执行拖动)
    Dragdrop.start = function (window, target, dom_MouseEvent) {

        if (timer)
        {
            clearTimeout(timer);
        }

        dragging = true;

        ownerWindow = window;
        ownerControl = target;
        start_event = dom_MouseEvent;

        offsetX = 0;
        offsetY = 0;

        timer = setTimeout(start, 200);
    };


    //移动
    Dragdrop.move = function (dom_MouseEvent) {

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
            var event = last_event = dom_MouseEvent;

            //div移动距离
            offsetX = event.clientX - start_event.clientX;
            offsetY = event.clientY - start_event.clientY;

            var offset = dragger.move.call(ownerControl, event, offsetX, offsetY);

            if (offset)
            {
                offsetX = offset.x || 0;
                offsetY = offset.y || 0;
            };

            ownerLayer.dom_layer.style.left = offsetX + "px";
            ownerLayer.dom_layer.style.top = offsetY + "px";

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
            if (last_event && droppable)
            {
                dragger.stop.call(ownerControl, last_event, offsetX, offsetY);
            };

            ownerWindow.removeLayer(ownerLayer);
            ownerLayer = null;

            //处理捕获控件
            ownerWindow.__capture_delay__.registry([last_event]);
        }
        else
        {
            ownerControl.dispatchEvent(new flyingon.MouseEvent("mousedown", ownerControl, start_event));
        };

        ownerWindow = ownerLayer = ownerControl = null;
        start_event = last_event = null;
        dragger = dragTargets = dropTarget = dragging = null;

        return result;
    };



})(flyingon);




(function(flyingon) {



﻿/*
形状基类

*/
flyingon.defineClass("Shape", flyingon.SerializableObject, function (Class, base, flyingon) {



    //背景色
    this.defineProperty("backgroundColor", null);

    //前景色
    this.defineProperty("color", "control-text");

    //线宽
    this.defineProperty("lineWidth", 1);


    //固定宽度
    this.defineProperty("width", "fill");

    //固定高度
    this.defineProperty("height", "fill");

    //外边距
    this.defineProperty("margin", null);

    //内边距
    this.defineProperty("padding", null);

    //是否逆时针绘制
    this.defineProperty("anticlockwise", false);

    //子形状
    this.defineProperty("children", null);



    this.paint = function (context, boxModel) {

        var r = measure.call(this, boxModel.usableRect),
            cache;

        context.beginPath();

        this.draw(context, r.windowX, r.windowY, r.width, r.height);

        if ((cache = this.children) && cache.length > 0)
        {
            paint_children(context, cache, r);
        }

        if (cache = this.backgroundColor)
        {
            context.set_fillStyle(cache);
            context.fill();
        }

        if (cache = this.color)
        {
            context.lineWidth = this.lineWidth;
            context.set_strokeStyle(cache);
            context.stroke();
        }
    };


    function measure(usableRect) {

        var result = usableRect.copy(),
            margin = this.margin,
            width = this.width,
            height = this.height;

        if (margin)
        {
            result.x -= margin.left;
            result.y -= margin.top;
            result.width -= margin.spaceX;
            result.height -= margin.spaceY;
        }

        switch (typeof width)
        {
            case "number":
                result.width = width;
                break;

            case "string":
                if (width.length > 1 && width[width.length - 1] == "%")
                {
                    result.width = Math.round(parseFloat(width) * result.width / 100);
                }
                break;
        }

        switch (typeof height)
        {
            case "number":
                result.height = height;
                break;

            case "string":
                if (height.length > 1 && height[height.length - 1] == "%")
                {
                    result.height = Math.round(parseFloat(height) * result.height / 100);
                }
                break;
        }

        return result;
    };

    function paint_children(context, items, clientRect) {

        var padding = this.padding;
        if (padding)
        {
            clientRect.x -= padding.left;
            clientRect.y -= padding.top;
            clientRect.width -= padding.spaceX;
            clientRect.height -= padding.spaceY;
        }

        for (var i = 0, length = items.length; i < length; i++)
        {
            var item = items[i],
                r = measure.call(item, clientRect);

            item.draw(context, r.windowX, r.windowY, r.width, r.height);

            if (item = item.children && item.length > 0)
            {
                paint_children(context, item, r);
            }
        }
    };



    this.draw = function (context, x, y, width, height) {

    };



});





﻿/*
线条

*/
flyingon.defineClass("Line", flyingon.Shape, function (Class, base, flyingon) {


    this.draw = function (context, x, y, width, height) {

        context.moveTo(x, y);
        context.lineTo(x + width, y + height);
    };


});





﻿/*
线条

*/
flyingon.defineClass("DashLine", flyingon.Shape, function (Class, base, flyingon) {


    //虚线规则
    this.defineProperty("dashArray", [3, 3]);



    this.draw = function (context, x, y, width, height) {

        context.dashLine(x, y, x + width, y + height, this.dashArray);
    };


});





﻿/*
矩形

*/
flyingon.defineClass("Rectangle", flyingon.Shape, function (Class, base, flyingon) {



    this.draw = function (context, x, y, width, height) {

        context.rect(x, y, width, height, this.anticlockwise);
    };


});





﻿/*
矩形

*/
flyingon.defineClass("RoundRectangle", flyingon.Shape, function (Class, base, flyingon) {



    this.defineProperty("radius", 5);



    this.draw = function (context, x, y, width, height) {

        context.roundRect(x, y, width, height, this.radius, this.anticlockwise);
    };


});





﻿/*
椭圆

*/
flyingon.defineClass("Ellipse", flyingon.Shape, function (Class, base, flyingon) {





    this.draw = function (context, x, y, width, height) {

        context.ellipse(x + width / 2, y + height / 2, width, height, this.anticlockwise);
    };


});





﻿/*
椭圆

*/
flyingon.defineClass("Polygon", flyingon.Shape, function (Class, base, flyingon) {



    this.defineProperty("sides", 6);

    this.defineProperty("radius", 20);

    this.defineProperty("angle", 0);



    this.draw = function (context, x, y, width, height) {

        context.polygon(this.sides, x + width / 2, y + height / 2, this.radius, this.angle, this.anticlockwise);
    };


});





﻿/*
椭圆

*/
flyingon.defineClass("StarPolygon", flyingon.Shape, function (Class, base, flyingon) {



    this.defineProperty("vertexes", 5);

    this.defineProperty("radius1", 20);

    this.defineProperty("radius2", 10);

    this.defineProperty("angle", 0);



    this.draw = function (context, x, y, width, height) {

        context.starPolygon(this.vertexes, x + width / 2, y + height / 2, this.radius1, this.radius2, this.angle, this.anticlockwise);
    };


});





﻿

//扩展选择器元素查询方法
(function (flyingon) {


    //组合查询方法
    var type_fn = (function () {

        function query_cascade(items, exports) {

            var cache;

            for (var i = 0, length = items.length; i < length; i++)
            {
                check.call(this, cache = items[i], exports);

                if ((cache = cache.__children__) && cache.length > 0)
                {
                    query_cascade.call(this, cache, exports);
                }
            }
        };

        //所有后代元素
        this[" "] = function (items, exports) {

            var item, cache;

            for (var i = 0, length = items.length; i < length; i++)
            {
                if ((cache = (item = items[i]).__children__) && cache.length > 0)
                {
                    query_cascade.call(this, cache, exports);
                }
            }
        };

        //子元素
        this[">"] = function (items, exports) {

            var children;

            for (var i = 0, length = items.length; i < length; i++)
            {
                if ((children = items[i].__children__) && children.length > 0)
                {
                    for (var j = 0, length1 = children.length; j < length1; j++)
                    {
                        check.call(this, children[j], exports);
                    }
                }
            }
        };

        //后一个元素 元素伪类:after也会转换成此节点类型
        this["+"] = function (items, exports) {

            var item, children, index;

            for (var i = 0, length = items.length; i < length; i++)
            {
                if ((item = items[i]) &&
                    (children = item.__parent__.__children__) &&
                    (children.length > (index = children.indexOf(item) + 1)))
                {
                    check.call(this, children[index], exports);
                }
            }
        };

        //所有后续兄弟元素
        this["~"] = function (items, exports) {

            var item, children;

            for (var i = 0, length = items.length; i < length; i++)
            {
                if ((item = items[i]) && (children = item.__parent__.__children__))
                {
                    for (var j = children.indexOf(item) + 1, length1 = children.length; j < length1; j++)
                    {
                        check.call(this, children[j], exports);
                    }
                }
            }
        };

        //合并元素集
        this[","] = function (items, exports) {

            type_fn[this.previous_type].call(this, items, exports);
        };

        return this;

    }).call({});

    //伪类元素查询方法  
    //注:此处为正向查找
    var element_fn = (function () {

        //获取后一节点
        this.before = function (target) {

            var cache = target.__parent__, index;
            return (cache && (cache = cache.__children__) && (index = cache.indexOf(this)) > 0 && cache[--index]) || false;
        };

        //获取前一节点
        this.after = function (target) {

            var cache = target.__parent__, index;
            return (cache && (cache = cache.__children__) && (index = cache.indexOf(this)) >= 0 && cache[++index]) || false;
        };

        //检测当前节点是否唯一子节点,是则返回父节点
        this["first-child"] = function (target) {

            var cache = target.__children__;
            return (cache && cache.length > 0 && cache[0]) || false;
        };

        this["first-of-type"] = function (target) {

            var result, cache = target.__children__;
            return cache && cache.length > 0 && (result = cache[0]) && target.__fullTypeName__ == result.__fullTypeName__ ? result : false;
        };

        this["last-child"] = function (target) {

            var cache = target.__children__;
            return (cache && cache.length > 0 && cache[cache.length - 1]) || false;
        };

        this["last-of-type"] = function (target) {

            var result, cache = target.__children__;
            return cache && cache.length > 0 && (result = cache[cache.length - 1]) && target.__fullTypeName__ == result.__fullTypeName__ ? result : false;
        };

        this["only-child"] = function (target) {

            var cache = target.__children__;
            return (cache && cache.length == 1 && cache[0]) || false;
        };

        this["only-of-type"] = function (target) {

            var result, cache = target.__children__;
            return cache && cache.length == 1 && (result = cache[0]) && target.__fullTypeName__ == result.__fullTypeName__ ? result : false;
        };

        this["nth-child"] = function (target) {

            var cache = target.__children__, index = +this.value;
            return (cache && cache.length > index && cache[index]) || false;
        };

        this["nth-of-type"] = function (target) {

            var result, cache = target.__children__, index = +this.value;
            return cache && cache.length > index && (result = cache[index]) && target.__fullTypeName__ == result.__fullTypeName__ ? result : false;
        };

        this["nth-last-child"] = function (target) {

            var cache = target.__children__, index = +this.value;
            return (cache && cache.length > index && cache[cache.length - index - 1]) || false;
        };

        this["nth-last-of-type"] = function (target) {

            var result, cache = target.__children__, index = +this.value;
            return cache && cache.length > index && (result = cache[cache.length - index - 1]) && target.__fullTypeName__ == result.__fullTypeName__ ? result : false;
        };

        return this;

    }).call({});


    //目标检测
    function check(target, exports) {

        //必须先检测目标对象是否符合条件 再检测属性及伪类 因为伪元素会改变目标对象
        switch (this.token)
        {
            case "":  //类型
                if (target.__fullTypeName__ != this.name)
                {
                    return false;
                }
                break;

            case ".": //class
                if (!target.__class__ || !target.__class__[this.name])
                {
                    return false;
                }
                break;

            case "#": //id
                if (target.id != this.name)
                {
                    return false;
                }
                break;
        }

        for (var i = 0, length = this.length; i < length; i++)
        {
            if ((target = this[i].check(target, element_fn)) === false) //
            {
                return false;
            }
        }

        exports.push(target);
    };


    //扩展元素查询 查询符合当前选择器的元素
    this.query = function (start) {

        var items = [start],
            exports = [],
            element = this;

        while (true)
        {
            type_fn[element.type].call(element, items, exports);

            if (element = element.next)
            {
                if (element.type != ",") //非组合则把当前集合作为查询依据
                {
                    items = exports;
                    exports = [];
                }
            }
            else
            {
                return exports;
            }
        }
    };


}).call(flyingon.Selector_Element.prototype, flyingon);





﻿
//选择器
(function (flyingon) {


    //缓存数据
    var selector_cache = {};


    //选择器
    //selector: css样式选择表达式 
    //start: 开始搜索节点
    var Query = flyingon.Query = function (selector, start) {

        if (selector)
        {
            if (typeof selector == "string")
            {
                if (!start)
                {
                    throw new Error(flyingon_lang.query_must_start);
                }

                selector = (selector_cache[selector] || (selector_cache[selector] = flyingon.parse_selector(selector))).query(start);
            }
            else
            {
                switch (selector.constructor)
                {
                    case flyingon.Selector_Element:
                        selector = selector.find([start]);
                        break;

                    case Array:
                        break;

                    default:
                        this.push(selector);
                        return;
                }
            }

            if (selector.length > 0)
            {
                this.push.apply(this, selector);
            }
        }
    };






    //扩展选择器方法
    /*
    flyingon.Query.extend({

        test: function () {

            this.forEach(...);
            return this;
        }
    });
    */
    Query.extend = function (data) {

        if (data)
        {
            var prototype = Query.prototype;

            for (var name in data)
            {
                prototype[name] = data[name];
            }
        }
    };





    var prototype = flyingon.query = flyingon.Query.prototype = flyingon.__pseudo_array__();



    //扩展for相关方法
    flyingon.for_extend(prototype);


    //合并
    prototype.merge = function (selector, context) {

        this.push.call(this, selector, context);
        return this;
    };


    //保存状态
    prototype.save = function () {

        var query = new flyingon.Query();

        query.push.apply(query, this);
        query.__previous__ = this;

        return query;
    };

    //恢复到上次保存的状态(没有保存的状态则返回自身)
    prototype.restore = function () {

        var result = this.__previous__;

        if (result)
        {
            this.__previous__ = null;
            return result;
        }

        return this;
    };


    //获取第一个项
    prototype.first = function () {

        if (this.length > 1)
        {
            this.splice(1, this.length - 1);
        }

        return this;
    };

    //获取最后一个项
    prototype.last = function () {

        if (this.length > 1)
        {
            this.splice(0, this.length - 2);
        }

        return this;
    };

    //获取奇数项
    prototype.odd = function () {

        return this.mod(0, 2);
    };

    //获取偶数项
    prototype.even = function () {

        return this.mod(1, 2);
    };

    //复合求余值的项
    prototype.mod = function (mod, length) {

        var values = [];

        for (var i = 0, length = this.length; i < length; i++)
        {
            if (i % length == mod)
            {
                values.push(this[i]);
            }
        }

        this.length = 0;
        this.push.apply(this, values);

        return this;
    };

    //筛选项
    prototype.filter = function (fn) {

        var values = [], item;

        for (var i = 0, length = this.length; i < length; i++)
        {
            if (i % length == mod)
            {
                if (fn(item = this[i], i))
                {
                    values.push(item);
                }
            }
        }

        this.length = 0;
        this.push.apply(this, values);

        return this;
    };





    prototype.addEventListener = function (type, fn) {

        this.for_apply("addEventListener", arguments);
        return this;
    };

    prototype.removeEventListener = function (type, fn) {

        this.for_apply("removeEventListener", arguments);
        return this;
    };



    prototype.hasClass = function (className) {

        return this.for_has("hasClass", true, arguments);
    };

    prototype.addClass = function (className) {

        this.for_apply("addClass", arguments);
        return this;
    };

    prototype.removeClass = function (className) {

        this.for_apply("removeClass", arguments);
        return this;
    };

    prototype.toggleClass = function (className) {

        this.for_apply("toggleClass", arguments);
        return this;
    };



})(flyingon);






﻿
///初始化插入符
flyingon.__fn_initialize_caret__ = function (parentNode) {


    var timer,

        _ownerControl,
        _boxModel,
        _textMetrics,

        caret = document.createElement("div"),
        input = document.createElement("input"), //输入助手

        ime = 0, //对中文输入时有输入预览的浏览器进行特殊处理 chrome safari Opera

        location;


    caret.setAttribute("flyingon", "caret");

    input.type = "text";
    input.setAttribute("flyingon", "input");
    input.setAttribute("style", "position:absolute;z-index:-1;padding:0;border:0;width:1px;height:1px;");


    //根据IE对\v没有转义判断当前浏览器是否IE
    if (!+"\v1") //IE
    {
        input.style.width = 0;
    }


    input.onselectstart = function (event) {

        event.stopPropagation();
        return true;
    };


    parentNode.appendChild(caret);
    parentNode.appendChild(input);






    function toggle() {

        caret.style.visibility = caret.style.visibility == "visible" ? "hidden" : "visible";
    };


    function show() {

        var box = _boxModel.parent,
            x = location.x,
            y = location.y,
            height = _textMetrics.font.height + 2;


        //处理不完全显示
        if (box)
        {
            var r = box.clientRect,
                value;

            if ((value = r.windowY - y) > 0)
            {
                y += value;
                height -= value
            }

            if ((value = y + height - r.windowY - r.height) > 0)
            {
                height -= value;
            }

            if (height < 0)
            {
                height = 0;
            }
        }

        caret.setAttribute("style", "visibility:visible;position:absolute;background-color:black;z-Index:9998;width:1px;left:" + x + "px;top:" + y + "px;height:" + height + "px;");
    };


    //更新控件
    function update() {


        if (timer)
        {
            clearInterval(timer);
        }


        var r = _boxModel.clientRect,
            x = _textMetrics.x + _textMetrics.caret.x,
            y = _textMetrics.y + _textMetrics.caret.y;


        //自动滚动调整.lineAt(y)
        if (x < _boxModel.scrollTop)
        {
            _boxModel.scrollLeft = x;
        }
        else
        {
            var right = _boxModel.scrollLeft + r.width;

            if (x > right)
            {
                _boxModel.scrollLeft = x - r.width;
                x = right;
            }
            else if (right <= r.width)
            {
                _boxModel.scrollLeft = 0;
            }
        }

        x = r.spaceX + x - _boxModel.scrollLeft;
        y = r.spaceY + y - _boxModel.scrollTop;

        if (x > 0)
        {
            x -= 1;
        }


        //显示插入符
        location = _boxModel.targetToOffset(x, y);

        input.style.left = location.x + "px";
        input.style.top = location.y + "px";


        show();
        timer = setInterval(toggle, 500);


        //更新控件
        _ownerControl.invalidate(false);
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


        _textMetrics.replace(text);
        update.call(this);
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
                _textMetrics.remove(-1);
                update.call(this);
                return;

            case 33: //Prior:
            case 37: //Left:
                move.call(this, event.shiftKey, _textMetrics.caret.textIndex - 1, true);
                return;

            case 34: //Next:
            case 39: //Right:
                move.call(this, event.shiftKey, _textMetrics.caret.textIndex + 1, true);
                return;

            case 35: //End:
                move.call(this, event.shiftKey, _textMetrics.text.length);
                return;

            case 36: //Home:
                move.call(this, event.shiftKey, 0);
                return;

            case 38: //Up:
                return;

            case 40: //Down:
                return;

            case 46: //Delete
                _textMetrics.remove(1);
                update.call(this);
                return;
        }


        if (event.ctrlKey)
        {
            switch (keyCode)
            {
                case 65: //a A
                    _textMetrics.moveTo(0);
                    _textMetrics.selectionTo(_textMetrics.text.length);
                    reset();
                    return;

                case 67: //c C
                    return;

                case 86: //v V
                    _textMetrics.replace(input.value);
                    input.value = "";
                    update.call(this);
                    return;

                case 88: //x X
                    _textMetrics.remove(0);
                    update.call(this);
                    return;

                    //case 90: //z Z //undo redo 暂未实现
                    //    return;
            }
        }


        if (keyCode != 17 && !input.readOnly && input.value)
        {
            oninput.call(this, input.value); //不处理ctrl键
        }
    };




    //变更插入符位置
    this.__fn_change_caret__ = function (changeX, changeY) {

        if (_boxModel)
        {
            location.x -= changeX;
            location.y -= changeY;

            show();
        }
    };


    //打开输入法
    this.__fn_open_ime__ = function (ownerControl, readOnly, textMetrics) {

        _ownerControl = ownerControl;
        _boxModel = ownerControl.__boxModel__;
        _textMetrics = textMetrics || ownerControl.__textMetrics__;

        input.readOnly = readOnly;
        reset();
    };

    //重置输入法
    var reset = this.__fn_reset_ime__ = function () {

        input.focus();
        input.value = _textMetrics.selectedText;
        input.select();

        update.call(this);
    };

    //关闭输入法
    this.__fn_close_ime__ = function () {

        if (timer)
        {
            clearInterval(timer);
            timer = null;
        }

        caret.style.visibility = "hidden";
        input.blur();
    };


};






﻿/// <reference path="../Base/Core.js" />
/// <reference path="Control.js" />



//文本绘制辅助类
flyingon["text-painter"] = function (multiline, readOnly) {



    this.defaultValue("text", "");


    this.defineProperty("readOnly", readOnly || false);


    this.defineProperty("selectionStart", 0, {

        getter: function () {

            return (this.__textMetrics__ && this.__textMetrics__.selectionStart) || 0;
        },

        setter: function (value) {

            if (this.ownerWindow && this.ownerWindow.__focused_control__ == this)
            {
                this.__textMetrics__.moveTo(value);
            }

            return this;
        }
    });


    this.defineProperty("selectionLength", 0, {

        getter: function () {

            var textMetrics = this.__textMetrics__;
            return textMetrics ? textMetrics.selectionEnd - textMetrics.selectionStart : 0;
        },

        setter: function (value) {

            if (this.ownerWindow && this.ownerWindow.__focused_control__ == this)
            {
                var textMetrics = this.__textMetrics__;

                if (value < 0)
                {
                    value = 0;
                }

                textMetrics.selectionTo(textMetrics.selectionStart + value);
            }

            return this;
        }
    });


    this.defineProperty("selectedText", function () {

        return this.__textMetrics__.selectedText;
    });







    this.__fn_focus__ = function (event) {

        if (this.focus())
        {
            var ownerWindow = this.ownerWindow,
                textMetrics = this.__textMetrics__;

            if (event || !this.containsFocused || !textMetrics.end)
            {
                var x = event ? event.controlX : 0,
                    y = event ? event.controlY : 0;

                textMetrics.moveAt(x, y);
            }


            //开启输入助手
            ownerWindow.__fn_open_ime__(this, this.readOnly);
        }
    };

    this.__fn_blur__ = function () {

        if (this.blur())
        {
            this.ownerWindow.__fn_close_ime__();
        }
    };




    this.__event_mousedown__ = function (event) {

        this.ownerWindow.__capture_control__ = this; //捕获鼠标
    };

    this.__event_mousemove__ = function (event) {

        if (event.mousedown && this.ownerWindow.__focused_control__ == this)
        {
            var textMetrics = this.__textMetrics__,
                x = event.targetX;


            if (x >= this.__boxModel__.clientRect.right)
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


            this.ownerWindow.__fn_reset_ime__();
        }
    };

    this.__event_mouseup__ = function (event) {

        var ownerWindow = this.ownerWindow;

        if (ownerWindow.__focused_control__ == this)
        {
            ownerWindow.__fn_reset_ime__();
        }

        ownerWindow.__capture_control__ = null; //释放鼠标
    };




    this.defineEvent("textchanging");

    this.defineEvent("textchanged");





    this.paint_text_back = function (context, clientRect, textMetrics) {

        if (textMetrics.selectionEnd > textMetrics.selectionStart)
        {
            var start = textMetrics.start,
                end = textMetrics.end;

            context.fillStyle = "#A9E2F3";// "#E6E6E6";
            context.fillRect(clientRect.windowX + start.x, clientRect.windowY, end.x - start.x, textMetrics.font.height + 4);
        }
    };

};








﻿/*

*/
(function (flyingon) {



    //变量管理器
    var prototype = (flyingon.BoxModel = function (ownerControl) {

        //所属控件
        this.ownerControl = ownerControl;

    }).prototype;



    //上级盒模型
    prototype.parent = null;

    //相对偏移所属父模型
    prototype.offsetParent = null;

    //子项集合
    prototype.children = null;

    //附加子项集合
    prototype.additions = null;

    //是否需要渲染
    prototype.visible = true;



    //是否需要重绘
    prototype.__dirty__ = false;

    //子模型是否需要重绘
    prototype.__children_dirty__ = false;

    //父模型是否需要重绘
    prototype.__parent_dirty__ = false;



    //是否需要测量
    prototype.__measure__ = true;

    //绘图环境
    prototype.context = null;



    //相对x坐标
    prototype.x = 0;

    //相对y坐标
    prototype.y = 0;

    //绝对x坐标
    prototype.windowX = 0;

    //绝对y坐标
    prototype.windowY = 0;


    //渲染宽度
    prototype.width = 0;

    //渲染高度
    prototype.height = 0;

    //右边x坐标
    flyingon.defineProperty(prototype, "right", function () {

        return this.x + this.width;
    });

    //底部y坐标
    flyingon.defineProperty(prototype, "bottom", function () {

        return this.y + this.height;
    });


    //x滚动偏移
    prototype.scrollLeft = 0;

    //y滚动偏移
    prototype.scrollTop = 0;

    //滚动宽度
    prototype.scrollWidth = 0;

    //滚动高度
    prototype.scrollHeight = 0;




    //初始化方法
    prototype.initialize = function (parent) {

        //处理父模型
        this.parent = parent;

        if (parent)
        {
            this.offsetParent = parent;
            parent.children.push(this);
        }
        else
        {
            this.offsetParent = null;
        }

        this.__measure__ = true;
    };

    //初始化附加项方法
    prototype.initialize_addtions = function (parent) {

        //处理父模型
        this.parent = parent;

        if (parent)
        {
            this.offsetParent = parent && parent.parent;
            (parent.additions || (parent.additions = [])).push(this);
        }
        else
        {
            this.offsetParent = null;
        }

        this.__measure__ = true;
    };


    //测量 注:请先调用size方法计算大小
    //传入的区域为可用区域 系统会自动根据此范围计算出实际占用空间
    //options: 扩展选项 见下:
    //width:        指定宽度  0表示不指定由系统自动算出 含margin
    //height:       指定高度  0表示不指定由系统自动算出 含margin
    //maxWidth:     最大可用宽度 含margin
    //maxHeight:    最大可用高度 含margin
    //align_width:  对齐宽度 不设置默认使用指定宽度
    //align_height: 对齐高度 不设置默认使用指定高度
    prototype.measure = function (x, y, width, height, maxWidth, maxHeight, align_width, align_height) {


        var ownerControl = this.ownerControl,

            margin = this.margin = ownerControl.margin,

            spaceX = margin.spaceX,
            spaceY = margin.spaceY,

            align = ownerControl.align,
            width_value = ownerControl.width,
            height_value = ownerControl.height,

            auto_width = this.__auto_width__ = width_value == "auto",
            auto_height = this.__auto_height__ = height_value == "auto",

            cache;


        //记录原始位置作为移动的参考
        this.origin_x = x;
        this.origin_y = y;


        //减去外框
        x += margin.left;
        y += margin.top;

        cache = width;
        width = width > spaceX ? width - spaceX : 0;

        switch (width_value)
        {
            case "default": //默认
                width_value = cache > 0 ? width : ownerControl.__defaults__.width;
                break;

            case "fill": //充满可用区域
            case "auto": //自动大小
                if (cache > 0)
                {
                    width_value = width;
                }
                else if (maxWidth > 0)
                {
                    width_value = maxWidth > spaceX ? maxWidth - spaceX : 0;
                }
                else
                {
                    width_value = ownerControl.__defaults__.width;
                }
                break;

            default:  //固定或百分比
                if (typeof width_value != "number")
                {
                    width_value = flyingon.parseInt(width_value, this.parent.clientRect.width - spaceX);
                }
                break;
        }


        if ((cache = ownerControl.minWidth) >= 0 && width_value < cache)
        {
            width_value = cache;
        }
        else if ((cache = ownerControl.maxWidth) > 0 && width_value > cache)
        {
            width_value = cache;
        }

        cache = height;
        height = height > spaceY ? height - spaceY : 0;

        switch (height_value)
        {
            case "default": //默认
                height_value = cache > 0 ? height : ownerControl.__defaults__.height;
                break;

            case "fill": //充满可用区域
            case "auto": //自动大小
                if (cache > 0)
                {
                    height_value = height;
                }
                else if (maxHeight > 0)
                {
                    height_value = maxHeight > spaceY ? maxHeight - spaceY : 0;
                }
                else
                {
                    height_value = ownerControl.__defaults__.height;
                }
                break;

            default:  //固定或百分比
                if (typeof height_value != "number")
                {
                    height_value = flyingon.parseInt(height_value, this.parent.clientRect.height - spaceY);
                }
                break;
        }

        if ((cache = ownerControl.minWidth) >= 0 && height_value < cache)
        {
            height_value = cache;
        }
        else if ((cache = ownerControl.maxWidth) > 0 && height_value > cache)
        {
            height_value = cache;
        }


        //修正位置
        if ((align_width || (width > 0 && (align_width = width))) && (cache = (align_width - width_value)))
        {
            switch (align_width = align.horizontal)
            {
                case "center":
                    x += cache >> 1;
                    break;

                case "right":
                    x += cache;
                    break;
            }
        }

        if ((align_height || (height > 0 && (align_height = height))) && (cache = (align_height - height_value)))
        {
            switch (align_height = align.vertical)
            {
                case "middle":
                    y += cache >> 1;
                    break;

                case "bottom":
                    y += cache;
                    break;
            }
        }

        this.x = x;
        this.y = y;
        this.width = width_value;
        this.height = height_value;



        //处理自动大小
        if (auto_width || auto_height) //自动大小需立即计算
        {
            //测量
            this.__fn_measure__(ownerControl);

            //自定义文字测量
            ownerControl.measureText(this);
            ownerControl.adjustAutoSize(this, auto_width, auto_height);

            //调整位置
            if (auto_width)
            {
                switch (align_width)
                {
                    case "center":
                        this.x += (width_value - this.width) >> 1;
                        break;

                    case "right":
                        this.x += width_value - this.width;
                        break;
                }
            }

            if (auto_height)
            {
                switch (align_height)
                {
                    case "middle":
                        this.y += (height_value - this.height) >> 1;
                        break;

                    case "bottom":
                        this.y += height_value - this.height;
                        break;
                }
            }

            //计算
            this.compute();
        }
        else
        {
            this.__measure__ = true;
        }



        //标记更新状态
        this.__dirty__ = true;
        return this;
    };



    //移动至指定位置(大小不变)
    prototype.moveTo = function (x, y, origin_position) {

        if (origin_position) //相对原始位置移动
        {
            x -= this.origin_x;
            y -= this.origin_y;
        }
        else //相对真实位置移动(在不按起始位置对齐时有差异)
        {
            x -= this.x;
            y -= this.y;
        }


        this.x += x;
        this.y += y;

        this.origin_x += x;
        this.origin_y += y;


        if (this.clientRect)
        {
            if (x)
            {
                this.windowX += x;

                this.usableRect.x += x;
                this.clientRect.x += x;

                this.usableRect.windowX += x;
                this.clientRect.windowX += x;
            }

            if (y)
            {
                this.windowY += y;

                this.usableRect.y += y;
                this.clientRect.y += y;

                this.usableRect.windowY += y;
                this.clientRect.windowY += y;
            }
        }

        return this;
    };


    //定位单个内容控件
    prototype.content = function (content) {

        if (content && (this.visible = content.visibility != "collapsed"))
        {
            var r = this.clientRect,
                box = content.__boxModel__;

            box.measure(0, 0, r.width, r.height);
        }

        return this;
    };



    prototype.__fn_measure__ = function (ownerControl) {

        //测量
        this.__measure__ = false;

        var fn = ownerControl.measure;
        if (fn)
        {
            fn.call(ownerControl, this);
        }
        else
        {
            this.compute();
        }
    };



    //计算盒模型
    prototype.compute = function () {


        var ownerControl = this.ownerControl,

            r = this.offsetParent && this.offsetParent.clientRect,
            windowX = r ? r.windowX : 0,
            windowY = r ? r.windowY : 0,

            usableRect = this.usableRect = new flyingon.Rect(), //可用区域(除边框及滚动条外的区域,含padding)
            clientRect = this.clientRect = new flyingon.Rect(), //客户区域(内容区,不含padding)

            x = this.x + ownerControl.offsetX,
            y = this.y + ownerControl.offsetY,
            width = this.width,
            height = this.height,

            border = this.border = ownerControl.border,
            padding = this.padding = ownerControl.padding;



        //圆角边框不能隐藏边线及不支持粗细不同的边线
        if (border.border = border.top > 0)
        {
            if (this.borderRadius = ownerControl.borderRadius)
            {
                border.right = border.bottom = border.left = border.top;
            }
        }
        else
        {
            border.border = border.right > 0 || border.bottom > 0 || border.left > 0; //是否有边框线标志
        }

        this.windowX = x + windowX;
        this.windowY = y + windowY;

        usableRect.windowX = (usableRect.x = x + border.left) + windowX;
        usableRect.windowY = (usableRect.y = y + border.top) + windowY;

        if ((usableRect.width = width - border.spaceX) < 0)
        {
            usableRect.width = 0;
        }

        if ((usableRect.height = height - border.spaceY) < 0)
        {
            usableRect.height = 0;
        }

        clientRect.windowX = (clientRect.x = x + (clientRect.spaceX = border.left + padding.left)) + windowX;
        clientRect.windowY = (clientRect.y = y + (clientRect.spaceY = border.top + padding.top)) + windowY;

        if ((clientRect.width = usableRect.width - padding.spaceX) < 0)
        {
            clientRect.width = 0;
        }

        if ((clientRect.height = usableRect.height - padding.spaceY) < 0)
        {
            clientRect.height = 0;
        }

        return this;
    };





    //使当前盒模型无效
    prototype.invalidate = function (measure, update) {

        var target = this, parent;

        if (measure)
        {
            target.__measure__ = true;
        }

        if (!target.__dirty__)
        {
            target.__dirty__ = true;
        }

        while (!target.context && (parent = target.parent))
        {
            if (!parent.__dirty__)
            {
                if (target.__dirty__ && target.__parent_dirty__)
                {
                    parent.__dirty__ = true;
                }
                else
                {
                    parent.__children_dirty__ = true;
                }
            }

            target = parent;
        }

        if (target.context)
        {
            if (update)
            {
                target.__unregistry_update__();
                target.update(target.context);
            }
            else
            {
                target.__registry_update__();
            }
        }
    };



    //更新
    prototype.update = function (context) {

        if (this.__dirty__) //如果需要更新
        {
            this.render(context);
        }
        else if (this.__children_dirty__) //如果子控件需要更新
        {
            this.__children_dirty__ = false;

            if (this.children)
            {
                this.__fn_render_children__(context, "update");
            }

            if (this.additions)
            {
                this.__fn_render_additions__(context, "update");
            }
        }
    };




    //渲染
    prototype.render = function (context) {


        var ownerControl = this.ownerControl;


        //测量
        if (this.__measure__)
        {
            this.__fn_measure__(ownerControl);

            //自定义文字测量
            ownerControl.measureText(this);
        }


        //设置渲染环境
        context.boxModel = this;
        context.save();
        context.globalAlpha = ownerControl.opacity;


        //绘制背景
        this.__parent_dirty__ = !ownerControl.paint_background(context, this) || context.globalAlpha < 1;


        //绘制子项
        if (this.children)
        {
            this.__fn_render_children__(context, "render");
        }

        //绘制附加内容
        if (this.additions)
        {
            this.__fn_render_additions__(context, "render");
        }


        //设置渲染环境
        context.boxModel = this;

        //绘制内框
        ownerControl.paint(context, this);

        //绘制外框
        ownerControl.paint_border(context, this);


        //绘制装饰
        var decorates = ownerControl.decorates;
        if (decorates && decorates.length > 0)
        {
            this.__fn_paint_decorates__(context, decorates);
        }


        context.restore();

        //修改状态
        this.__dirty__ = false;
    };


    //渲染或更新子项
    prototype.__fn_render_children__ = function (context, fn) {

        var ownerControl = this.ownerControl,
            items = ownerControl.__fn_render_children__,
            item,
            length;


        items = items ? items.call(ownerControl, this) : this.children;

        if ((length = items.length) > 0)
        {
            context.save();

            if (this.scrollLeft || this.scrollTop)
            {
                context.translate(-this.scrollLeft, -this.scrollTop);
            }

            if (ownerControl.clipToBounds)
            {
                var r = this.clientRect;

                context.beginPath();
                context.rect(r.x + this.scrollLeft, r.y + this.scrollTop, r.width, r.height);
                context.clip();
            }

            for (var i = 0; i < length; i++)
            {
                if (item = items[i])
                {
                    item[fn](context);
                }
            }

            context.restore();
        }
    };


    //渲染或更新附加内容
    prototype.__fn_render_additions__ = function (context, fn) {

        var additions = this.additions,
            item;

        if (additions)
        {
            for (var i = 0, length = additions.length; i < length; i++)
            {
                if ((item = additions[i]) && item.visible)
                {
                    item[fn](context, this);
                }
            }
        }
    };


    //绘制装饰
    prototype.__fn_paint_decorates__ = function (context, decorates) {

        var reader;

        for (var i = 0, length = decorates.length; i < length; i++)
        {
            var item = decorates[i];

            //未处理
            if (!(item instanceof flyingon.Shape))
            {
                item = decorates[i] = (reader || (reader = new flyingon.SerializeReader())).deserialize(item);
            }

            item.paint(context, this);
        }
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
    prototype.offsetToTarget = function (x, y) {

        var result = scroll.call(this);

        result.x += x - this.windowX;
        result.y += y - this.windowY;

        return result;
    };

    //偏移坐标转窗口坐标
    prototype.offsetToWindow = function (x, y) {

        var result = scroll.call(this);

        result.x += x;
        result.y += y;

        //如果控件自身有滚动动条且落在客户区内则加上滚动偏移
        if (this.scrollLeft && result.x < this.windowX + this.clientRect.right)
        {
            result.x += this.scrollLeft;
        }

        if (this.scrollTop && result.y < this.windowY + this.clientRect.bottom)
        {
            result.y += this.scrollTop;
        }

        return result;
    };

    //偏移坐标转控件坐标
    prototype.offsetToControl = function (x, y) {

        var result = scroll.call(this);

        result.x += x - this.windowX;
        result.y += y - this.windowY;

        //如果控件自身有滚动动条且落在客户区内则加上滚动偏移
        if (this.scrollLeft && result.x < this.clientRect.right)
        {
            result.x += this.scrollLeft;
        }

        if (this.scrollTop && result.y < this.clientRect.bottom)
        {
            result.y += this.scrollTop;
        }

        return result;
    };


    //目标坐标转偏移坐标
    prototype.targetToOffset = function (x, y) {

        var result = scroll.call(this);

        result.x = this.windowX + x - result.x;
        result.y = this.windowY + y - result.y;

        return result;
    };

    //窗口坐标转偏移坐标
    prototype.windowToOffset = function (x, y) {

        var result = scroll.call(this);

        result.x = x - result.x;
        result.y = y - result.y;

        //如果控件自身有滚动动条且落在客户区内则加上滚动偏移
        if (this.scrollLeft && result.x <= this.windowX + this.scrollLeft + this.clientRect.right)
        {
            result.x -= this.scrollLeft;
        }

        if (this.scrollTop && result.y <= this.windowY + this.scrollTop + this.clientRect.bottom)
        {
            result.y -= this.scrollTop;
        }

        return result;
    };

    //控件坐标转偏移坐标
    prototype.controlToOffset = function (x, y) {

        var result = scroll.call(this);

        result.x = this.windowX + x - result.x;
        result.y = this.windowY + y - result.y;

        //如果控件自身有滚动动条且落在客户区内则加上滚动偏移
        if (this.scrollLeft && result.x <= this.windowX + this.scrollLeft + this.clientRect.right)
        {
            result.x -= this.scrollLeft;
        }

        if (this.scrollTop && result.y <= this.windowY + this.scrollTop + this.clientRect.bottom)
        {
            result.y -= this.scrollTop;
        }

        return result;
    };



})(flyingon);



﻿/// <reference path="../Base/Core.js" />


//控件基类
flyingon.defineClass("Control", flyingon.SerializableObject, function (Class, base, flyingon) {




    Class.create = function () {

        //唯一id
        this.__uniqueId__ = ++flyingon.__uniqueId__;

        //盒模型
        this.__boxModel__ = new flyingon.BoxModel(this);
    };




    //引用序列化标记(为true时只序列化名称不序列化内容)
    this.serialize_reference = true;



    //父控件
    this.defineProperty("parent", null, {

        getter: function () {

            return this.__parent__;
        },

        setter: function (value) {

            var oldValue = this.__parent__;

            if (value != oldValue)
            {
                if (oldValue)
                {
                    oldValue.__children__.remove(this);
                }

                if (value)
                {
                    value.__children__.add(this);
                }
            }

            return this;
        }
    });


    //触发父控件变更
    this.__fn_parent__ = function (parent) {

        this.__parent__ = parent;
        this.__style_group__ = null;  //清空缓存的样式组
        this.dispatchEvent(new flyingon.PropertyChangeEvent(this, "parent", parent, this.__parent__));
    };

    //当前控件是否指定控件的父控件
    this.isParent = function (control) {

        if (!control || control == this)
        {
            return false;
        }

        var target = control.__parent__;

        while (target)
        {
            if (target == this)
            {
                return true;
            }

            target = target.__parent__;
        }

        return false;
    };

    //指定控件是否当前控件的父控件
    this.isParentTo = function (control) {

        return control ? control.isParent(this) : false;
    };


    //子索引号
    this.defineProperty("childIndex", function () {

        var cache = this.__parent__;
        return (cache && (cache = cache.__children__) && cache.indexOf(this)) || -1;
    });


    //从父控件中移除自身
    this.remove = function () {

        var parent = this.__parent__;

        if (parent)
        {
            parent.__children__.remove(this);
        }

        return this;
    };





    //主窗口
    this.defineProperty("mainWindow", function () {

        var ownerWindow = this.ownerWindow;
        return ownerWindow && ownerWindow.mainWindow;
    });

    //所属窗口
    this.defineProperty("ownerWindow", function () {

        var parent = this.__parent__;
        return parent && parent.ownerWindow;
    });






    //值变更事件
    this.defineEvent("change");


    var __style_regex__ = /name|value/g,
        __style_string__ = "var value = fields.name, defaults;\n"
        + "if (value === undefined || (defaults = this.__defaults__.name) === value)\n"
        + "{\n"
            + "if (!this.style || (value = this.style.name) === undefined)"
            + "{\n"
                + "if ((value = flyingon.styleValue(this, \"name\")) === undefined && (value = defaults) === undefined)\n"
                + "{\n"
                    + "value = this.__defaults__.name;"
                + "}\n"
            + "}\n"
        + "}\n";

    this.__define_style__ = function (name, oldValue) {

        return __style_string__.replace(__style_regex__, function (key) {

            return key == "name" ? name : (oldValue || key);
        });
    };

    this.__define_getter__ = function (name, attributes) {

        var body;

        if (attributes.style) // 样式属性
        {
            body = "var fields = this.__fields__;\n" + this.__define_style__(name);
        }
        else
        {
            body = "var value = this.__fields__." + name + ";\n";
        }

        body += "return " + (attributes.result || "value;");

        return new Function(body);
    };

    this.__define_setter__ = function (name, attributes) {


        var body = [];


        body.push("var fields = this.__fields__, cache;\n");

        body.push(this.__define_initializing__(name, attributes));


        if (attributes.style)
        {
            body.push(this.__define_style__(name, "oldValue"));
        }
        else
        {
            body.push("var oldValue = fields." + name + ";\n");
        }


        if (attributes.changing)
        {
            body.push(attributes.changing);
            body.push("\n");
        }


        body.push("if (oldValue !== value)\n");
        body.push("{\n");

        body.push(this.__define_change__(name));

        body.push("fields." + name + " = value;\n");
        body.push("var boxModel = this.__boxModel__;\n");


        if (attributes.changed) //自定义值变更代码
        {
            body.push(attributes.changed);
            body.push("\n");
        }

        if (attributes.complete) //自定义值变更结束代码
        {
            body.push(attributes.complete);
            body.push("\n");
        }


        body.push("if (cache = this.__bindings__)\n");
        body.push("{\n");
        body.push("this.__fn_bindings__(\"" + name + "\", cache);\n");
        body.push("}\n");


        //需要重新定位
        if (attributes.locate)
        {
            body.push("(boxModel.parent || boxModel).invalidate(true);\n");
        }
        else if (attributes.measure) //需要重新测量
        {
            body.push("this.invalidate(true);\n");
        }
        else if (attributes.invalidate)  //需要重新绘制
        {
            body.push("this.invalidate(false);\n");
        }


        body.push("}\n");

        body.push("return this;");


        return new Function("value", body.join(""));
    };




    //指定class名 与html一样
    this.defineProperty("className", null, {

        attributes: "locate|query",
        complete: "this.__fn_className__(value);"
    });

    //处理className
    this.__fn_className__ = function (value) {

        var values, cache;

        if (value && (values = value.match(/\S+/g)))
        {
            var cache = this.__class__ = {};

            for (var i = values.length - 1; i >= 0; i--)
            {
                if (!cache[value = values[i]])
                {
                    cache[value] = true;
                }
            }

            this.__fields__.className = (cache.__names__ = Object.keys(cache)).join(" ");
        }
        else
        {
            this.__class__ = null;
            this.__fields__.className = null;
        }


        this.__style_group__ = null;  //清空缓存的样式组

        (this.__parent__ || this).__boxModel__.invalidate(true);
    };

    //是否包含指定class
    this.hasClass = function (className) {

        return this.__class__ && this.__class__(className);
    };

    //添加class
    this.addClass = function (className) {

        if (className)
        {
            this.className += " " + className;
        }
    };

    //移除class
    this.removeClass = function (className) {

        var data = this.__class__;

        if (data && className && data[className])
        {
            delete data[className];
            this.className = Object.keys(data).join(" ");

            return true;
        }
    };

    //切换class 有则移除无则添加
    this.toggleClass = function (className) {

        var data = this.__class__;

        if (data && className)
        {
            if (data[className])
            {
                delete data[className];
                this.className = Object.keys(data).join(" ");
            }
            else
            {
                this.className += " " + className;
            }
        }
    };




    //自定义样式
    this.defineProperty("style", null, "measure|query");




    //状态变更事件
    this.defineEvent("statechange");

    /*

    支持状态

    checked       被选中
    selection     用户当前选中的元素
    focus         获得当前焦点
    hover         鼠标悬停其上
    active        鼠标已经其上按下、还没有释放
    disabled      禁用

    */
    //切换状态 
    //name: checked || selection || focus || hover || active || disabled
    //value: true || false
    this.stateTo = function (name, value) {


        (this.states || (this.states = Object.create(null)))[name] = value;

        //检测是否有状态变更动画 有则播放 状态动画命名规则: 状态名 + "-animation"
        //var animation = flyingon.styleValue(this, name + "-animation");

        //状态变更事件
        this.dispatchEvent(new flyingon.ChangeEvent("statechange", this, name, value));

        //样式变更可能需要重新定位
        (this.__parent__ || this).__boxModel__.invalidate(true);
    };


    //获取状态图片(图片资源有命名规则要求) active -> hover -> checked -> common
    this.__fn_state_image__ = function (image, checked) {

        var states = this.__states__,
            images = [];

        if (states)
        {
            if (states.activate)
            {
                images.push(image + "-active");
            }

            if (states.hover)
            {
                images.push(image + "-hover");
            }
        }

        if (checked)
        {
            images.push(image + "-checked");
        }

        images.push(image);

        return flyingon.get_image_any(images);
    };





    /***************BoxModel相关属性***************/


    //盒式模型
    this.defineProperty("boxModel", function () {

        return this.__boxModel__;
    });


    //控件左上角x及y坐标 仅绝对定位时有效
    this.defineProperties(["left", "top"], 0, "locate|style");

    //相对原来渲染位置的x及y偏移
    this.defineProperties(["offsetX", "offsetY"], 0, "locate|style");

    //控件宽度及高度 可选值: 数字|数字+"%"|"fill"|"auto"
    //数字: 固定大小
    //数字+"%":占客户区域百分比
    //fill: 充满可用区域
    //auto: 根据内容自动计算
    this.defineProperties(["width", "height"], 100, "locate|style");


    //是否显示
    //visible:  显示
    //hidden:   不显示但保留占位
    //collapsed:不显示也不占位
    this.defineProperty("visibility", "visible", "locate|style");

    //最小最大宽度 最小最大高度
    this.defineProperties(["minWidth", "maxWidth", "minHeight", "maxHeight"], 0, "locate|style");


    //对齐属性
    var attributes = {

        attributes: "locate|style",
        changing: "if (!(value instanceof flyingon.Align)) value = new flyingon.Align(value);"
    };

    //位置对齐方式
    //top:      顶部对齐
    //middle:   垂直居中对齐
    //bottom:   底部对齐
    //left:     左边对齐
    //center:   水平居中对齐
    //right:    右边对齐
    //可用逗号分隔同时设置水平及垂直对齐方式 如: "middle,center"
    this.defineProperty("align", new flyingon.Align(), attributes);

    //内容对齐方式
    //top:      顶部对齐
    //middle:   垂直居中对齐
    //bottom:   底部对齐
    //left:     左边对齐
    //center:   水平居中对齐
    //right:    右边对齐
    //可用逗号分隔同时设置水平及垂直对齐方式 如: "middle,center"
    this.defineProperty("textAlign", new flyingon.Align("middle"), attributes);


    //流式布局 auto:自动 inline:同行 newline:新行
    this.defineProperty("flow", "auto", "locate|style");

    //停靠方式
    //left:   左见枚举
    //top:    顶部见枚举
    //right:  右见枚举
    //bottom: 底部见枚举
    //fill:   充满
    this.defineProperty("dock", "left", "locate|style");


    /*********************************************/




    /***************BoxModel及样式相关属性***************/

    attributes = {

        attributes: "locate|style",
        changing: "if (!(value instanceof flyingon.Thickness)) value = new flyingon.Thickness(value);"
    };

    this.defineProperty("margin", new flyingon.Thickness(), attributes);

    this.defineProperty("border", new flyingon.Thickness(), attributes);

    this.defineProperty("padding", new flyingon.Thickness(), attributes);

    this.defineProperty("borderRadius", 0, "measure|style");

    /*********************************************/


    /***************样式相关属性***************/

    //背景色
    this.defineProperty("backgroundColor", null, "style");

    //前景色
    this.defineProperty("color", "black", "style");

    //边框颜色
    this.defineProperty("borderColor", "black", "style");

    //透明度
    this.defineProperty("opacity", 1, "style");

    //变换器
    this.defineProperty("transform", null, "measure|style");

    //字体
    this.defineProperty("font", "normal", {

        attributes: "measure|style",
        result: "flyingon.get_font(value);",
        changed: "this.__text__ = null;"
    });



    //是否只绘制有效范围
    this.defineProperty("clipToBounds", true, "measure|style");



    //文字内容
    this.defineProperty("text", null, {

        attributes: "measure",
        changing: "value += '';",
        changed: "this.__text__ = null;"
    });


    /*********************************************/


    //鼠标样式
    this.defineProperty("cursor", "default", "style");


    this.__fn_cursor__ = function (event) {

        return this.cursor || "default";
    };


    //装饰
    this.defineProperty("decorates", null, "invalidate|style");


    /*********************************************/


    //快捷键(按下alt+accesskey)
    this.defineProperty("accesskey", null);


    //是否可用
    this.defineProperty("enabled", true, {

        changed: "this.stateTo('disabled', !value);"
    });


    //是否可具有焦点
    this.defineProperty("focusable", true);


    //是否为焦点控件
    this.defineProperty("focused", function () {

        return this.ownerWindow && this.ownerWindow.__focused_control__ == this;
    });

    //是否为焦点控件或包含焦点控件
    this.defineProperty("containsFocused", function () {

        var focused = this.ownerWindow && this.ownerWindow.__focused_control__;
        return focused && (focused == this || this.isParent(focused));
    });





    //是否可以拖动
    this.defineProperty("draggable", false);

    //是否可以接受拖放
    this.defineProperty("droppable", false);



    //值变更事件
    this.defineEvent("change");

    //定义鼠标事件
    this.defineEvents(["mousedown", "mousemove", "click", "dblclick", "mouseup", "mouseover", "mouseout", "mousewheel"]);

    //定义拖拉事件
    this.defineEvents(["dragstart", "drag", "dragend", "dragenter", "dragover", "dragleave", "drop"]);

    //定义键盘事件
    this.defineEvents(["keydown", "keypress", "keyup"]);

    //定义其它事件
    this.defineEvents(["focus", "blur", "validate"]);




    //调整自动大小
    this.adjustAutoSize = function (boxModel, auto_width, auto_height) {

        if (auto_width)
        {
            boxModel.width = boxModel.width - boxModel.clientRect.width;
        }
    };



    //模板
    this.defineProperty("template", null, {

        attributes: "measure",
        changed: "this.clearTemplate();",

        getter: function () {

            var template = this.__fields__.template,
                defaults;

            if (template && !(defaults = this.__defaults__.template))
            {
                return template;
            }

            return flyingon.templates[this.__fullTypeName__] || defaults;
        }
    });

    //创建模板控件
    this.createTemplateControl = function (template, context) {

        var items = this.__children__;

        if (items)
        {
            items.clear();
        }
        else
        {
            //子控件集合
            items = this.__children__ = new flyingon.ControlCollection(this);

            //初始化子盒模型
            this.__boxModel__.children = [];
        }

        var result = new flyingon.SerializeReader().deserialize(template, context || this);
        if (result)
        {
            items.add(result);

            result.__template__ = true;
            return result;
        }
    };

    //清除模板控件
    this.clearTemplate = function () {

        var items = this.__children__;

        if (items && items.length > 0)
        {
            items.clear();
        }
    };




    //捕获鼠标
    this.setCapture = function () {

        var ownerWindow = this.ownerWindow;

        if (ownerWindow)
        {
            ownerWindow.__capture_control__ = this;
        }
    };

    //释放鼠标
    this.releaseCapture = function () {

        var ownerWindow = this.ownerWindow;

        if (ownerWindow)
        {
            ownerWindow.__capture_control__ = null;
        }
    };



    //执行验证
    this.validate = function () {

        return this.dispatchEvent("validate");
    };

    this.__fn_focus__ = function (event) {

        return this.focus();
    };

    this.__fn_blur__ = function () {

        return this.blur();
    };


    //设置当前控件为焦点控件
    //注:需此控件focusable为true时才可设为焦点控件
    this.focus = function () {

        if (this.focusable)
        {
            var ownerWindow = this.ownerWindow;

            if (ownerWindow && ownerWindow.__focused_control__ != this)
            {
                ownerWindow.__focused_control__ = this;

                if (this.dispatchEvent("focus"))
                {
                    this.stateTo("focus", true);
                }
            }

            return true;
        }

        return false;
    };

    //此控件失去焦点
    this.blur = function () {

        var ownerWindow = this.ownerWindow;

        if (ownerWindow && ownerWindow.__focused_control__ == this)
        {
            ownerWindow.__focused_control__ = null;

            if (this.dispatchEvent("blur"))
            {
                this.stateTo("focus", false);
            }

            return true;
        }

        return false;
    };




    //查找控件 selector: css选择器样式字符串
    this.find = function (selector) {

        return new flyingon.Query(selector, this);
    };

    //查找指定id的子控件集合
    this.findById = function (id, cascade) {

        return new flyingon.Query(new flyingon.Selector_Element(cascade ? " " : ">", "#", id), this);
    };

    //查找指定名称的子控件集合
    this.findByName = function (name, cascade) {

        var element = new flyingon.Selector_Element(cascade ? " " : ">", "*"),
            property = new flyingon.Selector_Property("name");

        property.operator = "=";
        property.value = name;

        element.push(property);

        return new flyingon.Query(element, this);
    };

    //查找指定类型的子控件集合
    this.findByTypeName = function (fullTypeName, cascade) {

        return new flyingon.Query(new flyingon.Selector_Element(cascade ? " " : ">", "", fullTypeName), this);
    };

    //查找指定class的控件子控件集合
    this.findByClassName = function (className, cascade) {

        return new flyingon.Query(new flyingon.Selector_Element(cascade ? " " : ">", ".", className), this);
    };




    //显示弹出控件
    this.showPopup = function (x, y) {

        var ownerWindow = this.ownerWindow;

        if (ownerWindow)
        {
            var layer = ownerWindow.__popup_layer__;

            if (!layer)
            {
                layer = ownerWindow.__popup_layer__ = ownerWindow.appendLayer(9997);
                layer.layout = "absolute";
                layer.paint_background = function () { };
            }

            if (x != null)
            {
                this.left = x;
            }

            if (y != null)
            {
                this.top = y;
            }

            layer.__children__.add(this);
            layer.invalidate(false);
        }
    };

    //关闭弹出控件
    this.closePopup = function () {

        var ownerWindow = this.ownerWindow;

        if (ownerWindow)
        {
            ownerWindow.removeLayer(ownerWindow.__popup_layer__);
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

        return this.__boxModel__.offsetToWindow(x, y);
    };

    //偏移坐标转目标坐标
    this.offsetToTarget = function (x, y) {

        return this.__boxModel__.offsetToTarget(x, y);
    };

    //偏移坐标转控件坐标
    this.offsetToControl = function (x, y) {

        return this.__boxModel__.offsetToControl(x, y);
    };


    //目标坐标转偏移坐标
    this.targetToOffset = function (x, y) {

        return this.__boxModel__.targetToOffset(x, y);
    };

    //窗口坐标转偏移坐标
    this.windowToOffset = function (x, y) {

        return this.__boxModel__.windowToOffset(x, y);
    };

    //控件坐标转偏移坐标
    this.controlToOffset = function (x, y) {

        return this.__boxModel__.controlToOffset(x, y);
    };



    //命中测试
    this.hitTest = function (x, y) {

        var box = this.__boxModel__;
        return x >= box.x && y >= box.y && x <= box.right && y <= box.bottom;
    };


    //使区域无效
    this.invalidate = function (measure) {

        this.__boxModel__.invalidate(measure, false);
    };


    //更新绘制控件
    this.update = function (measure) {

        this.__boxModel__.invalidate(measure, true);
    };





    this.measureText = function (boxModel) {

        var text = this.text;

        if (text != null && !this.__textMetrics__)
        {
            (this.__textMetrics__ = new flyingon.TextMetrics()).measureText(this.font, text, this.multiline);
        }
    };


    //绘制边框
    this.paint_border = function (context, boxModel) {

        var border = boxModel.border;

        if (border && border.border)
        {
            var color = this.borderColor;

            if (boxModel.borderRadius > 0)
            {
                context.lineWidth = border.top;
                context.set_strokeStyle(color);
                context.strokeRoundRect(boxModel.windowX, boxModel.windowY, boxModel.width, boxModel.height, boxModel.borderRadius);
            }
            else
            {
                context.set_fillStyle(color);
                context.paint_border(boxModel.windowX, boxModel.windowY, boxModel.width, boxModel.height, border);
            }
        }

    };


    //绘制背景
    this.paint_background = function (context, boxModel) {

        var backgroundColor = this.backgroundColor;

        if (backgroundColor)
        {
            var r = boxModel.usableRect;

            context.beginPath();
            context.set_fillStyle(backgroundColor);

            if (boxModel.borderRadius > 0) //圆角矩形
            {
                context.roundRect(r.windowX, r.windowY, r.width, r.height, boxModel.borderRadius);
            }
            else
            {
                context.rect(r.windowX, r.windowY, r.width, r.height);
            }

            context.fill();

            return true;
        }
    };


    //绘制内框
    this.paint = function (context, boxModel) {

        this.paint_text(context, boxModel.clientRect);
    };


    //绘制文字
    this.paint_text = function (context, clientRect) {

        var textMetrics = this.__textMetrics__,
            cache;

        if (textMetrics)
        {


            //区域剪切
            if (this.clipToBounds)
            {
                context.save();

                context.beginPath();
                context.rect(clientRect.windowX, clientRect.windowY, clientRect.width, clientRect.height);
                context.clip();
            }


            if (cache = this.paint_text_back)
            {
                cache.call(this, context, clientRect, textMetrics);
            }


            context.fillStyle = this.color;
            context.font = textMetrics.font;


            var x = clientRect.windowX,
                y = clientRect.windowY + textMetrics.height,
                align = this.textAlign,
                line = textMetrics[0];

            if (align)
            {
                if (cache = clientRect.width - line.width)
                {
                    switch (align.horizontal)
                    {
                        case "center":
                            x += cache >> 1;
                            break;

                        case "right":
                            x += cache;
                            break;
                    }
                }

                if (cache = clientRect.height - line.height)
                {
                    switch (align.vertical)
                    {
                        case "middle":
                            y += cache >> 1;
                            break;

                        case "bottom":
                            y += cache;
                            break;
                    }
                }
            }


            for (var j = 0, count = line.length; j < count; j++)
            {
                var element = line[j];
                context.fillText(element.text, x, y);

                x += element.width;
            }

            if (this.clipToBounds)
            {
                context.restore();
            }

            return true;
        }
    };




}, true);




﻿
//内容控件
flyingon.defineClass("ContentControl", flyingon.Control, function (Class, base, flyingon) {



    Class.create = function () {


        //子控件集合
        this.__children__ = new flyingon.ControlCollection(this);

        //初始化子盒模型
        this.__boxModel__.children = [];
    };



    //内容控件
    this.defineProperty("content",

        function () {

            return this.__children__[0] || null;
        },

        function (value) {

            if (this.__children__[0] != value)
            {
                this.__children__.replace(0, value);
            }
        });




    //查找指定位置的控件
    this.findAt = function (x, y) {

        var content = this.__children__[0];

        if (content && content.hitTest(x, y))
        {
            return content.findAt ? content.findAt(x, y) : content;
        }

        return this;
    };



    this.arrange = function (clientRect) {

        this.__boxModel__.content(this.__children__[0]);
    };



    this.serialize = function (writer) {

        base.serialize.call(this, writer);
        writer.object("content", this.__children__[0]);
    };

    this.deserialize = function (reader, data, excludes) {

        excludes.children = true;

        base.deserialize.call(this, reader, data, excludes);
        reader.object(this.__children__, "0", data.content);
    };


});





﻿//模板控件
flyingon.defineClass("TemplateControl", flyingon.Control, function (Class, base, flyingon) {



    //获取指定位置的控件
    this.findAt = function (x, y) {

        var items = this.__children__;

        if (items && items.length > 0)
        {
            if (!this.__designMode__) //未实现
            {
                var content = items[0];

                if (content && content.hitTest(x, y))
                {
                    return content.findAt ? content.findAt(x, y) : content;
                }
            }
        }

        return this;
    };

    this.arrange = function (clientRect) {

        var items = this.__children__,
            template;

        if ((!items || items.length <= 0) && (template = this.template))
        {
            items[0] = this.createTemplateControl(template)
        }

        if (items && items.length > 0)
        {
            this.__boxModel__.content(items[0]);
        }
    };


});





﻿
//滚动事件
flyingon.ScrollEvent = function (target, originalEvent) {

    this.target = target;
    this.originalEvent = originalEvent;
};



//复合控件服务
//复合控件的子控件不响应事件,但支持样式及状态
flyingon.__complex_control_service__ = function (base) {


    this.hitTest = function (x, y) {

        if (base.hitTest.call(this, x, y))
        {
            var r = this.__boxModel__.clientRect,
                items = this.__children__,
                source = this.__target__,
                target = null;

            x -= r.x;
            y -= r.y;

            for (var i = items.length - 1; i >= 0 ; i--)
            {
                if (items[i].hitTest(x, y))
                {
                    target = items[i];
                    break;
                }
            }

            if (source && source != target)
            {
                source.stateTo("hover", false);
            }

            if (this.__target__ = target)
            {
                target.stateTo("hover", true);
            }

            return true;
        }

        return false;
    };

    this.stateTo = function (name, value) {

        if (this.__target__ && (name != "hover" || !value))
        {
            this.__target__.stateTo(name, value);
        }

        base.stateTo.call(this, name, value);
    };

};


(function () {

    //事件类型
    this.type = "scroll";

    //水平滚动条
    this.horizontalScrollBar = null;

    //竖起滚动条
    this.verticalScrollBar = null;

    //水平变化距离
    this.changeX = 0;

    //竖直变化距离
    this.changeY = 0;

}).call(flyingon.ScrollEvent.prototype = new flyingon.Event());




//滚动条控件
flyingon.defineClass("ScrollBar", flyingon.Control, function (Class, base, flyingon) {



    var timer,      //定时变更定时器
        dragger;    //拖拉者



    Class.create = function () {

        this.__boxModel__.children = [];

        (this.__children__ = new flyingon.ControlCollection(this)).addRange([
            this.__button1__ = new flyingon.ScrollButton(true),
            this.__slider0__ = new flyingon.ScrollSlider(),
            this.__button2__ = new flyingon.ScrollButton(false)]);
    };



    this.defaultValue("focusable", false);


    //滚动条厚度
    this.thickness = flyingon.styleValue_group("ScrollBar", "thickness") || 16;


    //当前值
    this.defineProperty("value", 0, "measure");

    //最大值
    this.defineProperty("maxValue", 100, "measure");

    //最小值
    this.defineProperty("minValue", 0, "measure");

    //显示值大小
    this.defineProperty("viewportSize", 10, "measure");

    //最大变更值
    this.defineProperty("maxChange", 200);

    //最小变更值
    this.defineProperty("minChange", 20);


    //是否竖直滚动条
    this.defineProperty("vertical", false, "locate");



    //滚动事件
    this.defineEvent("scroll");



    //订阅复合控件服务
    flyingon.__complex_control_service__.call(this, base);



    this.__event_mousedown__ = function (event) {

        if (timer)
        {
            clearTimeout(timer);
        }

        var value = this.__target__, limit;

        if (value)
        {
            if (value == this.__button1__)
            {
                value = -this.minChange;
            }
            else if (value == this.__button2__)
            {
                value = this.minChange;
            }
            else //slider
            {
                this.ownerWindow.__capture_control__ = this;

                dragger = {

                    x: event.offsetX,
                    y: event.offsetY,
                    value: this.value
                };

                event.stopPropagation();
                event.preventDefault();
                return;
            }
        }
        else
        {
            var r = this.__boxModel__.clientRect;
            value = this.vertical ? event.windowY - r.windowY : event.windowX - r.windowX;

            if (value < this.__offset_value__) //slider before
            {
                limit = this.minValue + Math.round((value - this.thickness) * this.maxValue / this.__length_value__);
                value = -this.maxChange;
            }
            else  //slider after
            {
                limit = this.minValue + Math.round((value - this.thickness - this.__slider_value__) * this.maxValue / this.__length_value__);
                value = this.maxChange;
            }
        }

        if (this.step_to(value, limit, event))
        {
            step_to_delay.call(this, value, limit, event);
        }
    };


    this.__event_mousemove__ = function (event) {

        if (dragger)
        {
            var offset = this.vertical ? (event.offsetY - dragger.y) : (event.offsetX - dragger.x),
                value = Math.round(offset * (this.maxValue - this.minValue) / this.__length_value__);

            if (value)
            {
                this.step_to(0, dragger.value + value, event);
            }
        }
    };


    this.__event_mouseup__ = function (event) {

        if (timer)
        {
            clearTimeout(timer);
            timer = null;
        }

        this.ownerWindow.__capture_control__ = null;
        dragger = null;
    };



    //移动指定距离
    this.step_to = function (step, limit, originalEvent) {

        var value = this.value + step,
            minValue = this.minValue,
            maxValue = this.maxValue - this.viewportSize;


        if (limit == null)
        {
            limit = step < 0 ? minValue : maxValue;
        }
        else if (limit < minValue)
        {
            limit = minValue;
        }
        else if (limit > maxValue)
        {
            limit = maxValue;
        }


        if (!step || (step > 0 && value > limit) || (step < 0 && value < limit))
        {
            value = limit;
        }


        if ((step = value - this.value) == 0)
        {
            return false;
        }


        this.value = value;


        var event = new flyingon.ScrollEvent(this, originalEvent);

        if (this.vertical)
        {
            event.verticalScrollBar = this;
            event.changeY = step;
        }
        else
        {
            event.horizontalScrollBar = this;
            event.changeX = step;
        }

        this.dispatchEvent(event);


        this.__boxModel__.invalidate(true);

        return value != limit;
    };


    //定时移动指定的距离
    function step_to_delay(step, limit, originalEvent) {

        var self = this,

            fn = function () {

                clearTimeout(timer);

                if (self.step_to(step, limit, originalEvent))
                {
                    timer = setTimeout(fn, 200);
                }
            };

        timer = setTimeout(fn, 200);
    };


    function slider_length(length) {

        if (length <= 8)
        {
            return 0;
        }

        var result = Math.round(length * this.viewportSize / (this.maxValue - this.minValue));
        return result <= 8 ? 8 : result;
    };

    function slider_start(length, slider) {

        if (length <= 0)
        {
            return 0;
        }

        if (this.value >= this.maxValue - this.viewportSize)
        {
            return length - slider;
        }

        return Math.round((this.value - this.minValue) * length / this.maxValue);
    };



    this.measure = function (boxModel) {

        boxModel.compute();

        var r = boxModel.clientRect,
            x = 0,
            y = 0,
            value,
            button1 = this.__button1__,
            button2 = this.__button2__,
            slider0 = this.__slider0__.__boxModel__,
            thickness = this.thickness;

        button1.__boxModel__.measure(0, 0, thickness, thickness);

        if (button1.vertical = button2.vertical = this.vertical)
        {
            var length = this.__length_value__ = (value = boxModel.clientRect.height) - (thickness << 1),
                slider = this.__slider_value__ = slider_length.call(this, length),
                offset = this.__offset_value__ = thickness + slider_start.call(this, length, slider);

            y = Math.max(value - thickness, 0);

            slider0.measure(0, offset, thickness, slider);
        }
        else
        {
            length = this.__length_value__ = (value = boxModel.clientRect.width) - (thickness << 1);
            slider = this.__slider_value__ = slider_length.call(this, length);
            offset = this.__offset_value__ = thickness + slider_start.call(this, length, slider);

            x = Math.max(value - thickness, 0);

            slider0.measure(offset, 0, slider, thickness);
        }

        button2.__boxModel__.measure(x, y, thickness, thickness);
    };



});




//滚动条按钮
flyingon.defineClass("ScrollButton", flyingon.Control, function (Class, base, flyingon) {


    Class.create = function (first) {

        this.__first__ = first;
    };


    this.__vertical__ = false;


    //修改默认值为充满
    this.defaultValue("width", "fill");

    //修改默认值为充满
    this.defaultValue("height", "fill");



    //绘制图像
    this.paint = function (context, boxModel) {

        var image = "scroll-" + (this.__vertical__ ? (this.__first__ ? "up" : "down") : (this.__first__ ? "left" : "right"));

        if (image = this.__fn_state_image__(image))
        {
            var r = boxModel.clientRect;
            context.paint_image(image, r.windowX, r.windowY, r.width, r.height, this.textAlign);
        }
    };


});




//滚动条滑块
flyingon.defineClass("ScrollSlider", flyingon.Control, function (Class, base, flyingon) {

    this.defaultValue("width", "fill");

    this.defaultValue("height", "fill");

    this.defaultValue("align", new flyingon.Align("middle,center"));

});




//滚动条拐角控件
flyingon.defineClass("ScrollCorner", flyingon.Control, function (Class, base, flyingon) {

    this.defaultValue("width", "fill");

    this.defaultValue("height", "fill");

});




﻿//可滚动控件
flyingon.defineClass("ScrollableControl", flyingon.Control, function (Class, base, flyingon) {



    this.defaultValue("clipToBounds", true);



    this.defineProperty("horizontalScrollBar", function () {

        return this.__horizontalScrollBar__;
    });


    this.defineProperty("verticalScrollBar", function () {

        return this.__verticalScrollBar__;
    });




    //定义水平及竖直滚动条显示方式
    //auto   自动显示
    //always 总是显示
    //never  从不显示
    this.defineProperties(["horizontalScroll", "verticalScroll"], "auto", "measure");




    function defineProperty(name, attributes) {

        this.defineProperty("name", 0, {

            attributes: attributes || "invalidate",
            complete: "this.__boxModel__." + name + " = value;"
        });
    };

    //
    defineProperty.call(this, "scrollLeft");

    //
    defineProperty.call(this, "scrollTop");

    //
    defineProperty.call(this, "scrollWidth", "measure");

    //
    defineProperty.call(this, "scrollHeight", "measure");







    this.__event_scroll__ = function (event) {

        var box = this.__boxModel__;

        if (event.changeX)
        {
            box.scrollLeft += event.changeX;
        }

        if (event.changeY)
        {
            box.scrollTop += event.changeY;
        }

        this.__render_children__ = null;
        this.__boxModel__.invalidate(false);

        //修正因滚动造成的输入符位置变更问题
        var ownerWindow = this.ownerWindow;
        if (ownerWindow && this.isParent(ownerWindow.__focused_control__))
        {
            ownerWindow.__fn_change_caret__(event.changeX, event.changeY);
        }

        event.stopPropagation();
        event.preventDefault();
    };

    this.__event_mousewheel__ = function (event) {

        var verticalScrollBar = this.__verticalScrollBar__;

        if (verticalScrollBar)
        {
            var step = verticalScrollBar.minChange;

            if (event.wheelDelta > 0)
            {
                step = -step;
            }

            verticalScrollBar.step_to(step);
            event.stopPropagation();
            event.preventDefault();
        }
    };





    this.findAt = function (x, y) {

        var cache;

        if ((cache = this.__horizontalScrollBar__) && cache.hitTest(x, y))
        {
            return cache;
        }

        if ((cache = this.__verticalScrollBar__) && cache.hitTest(x, y))
        {
            return cache;
        }

        return this;
    };



    this.measure = function (boxModel) {


        boxModel.compute();


        var r = boxModel.clientRect,
            width = boxModel.scrollWidth = r.width,
            height = boxModel.scrollHeight = r.height;


        //初始化滚动条
        initialize.call(this, boxModel, width, height);

        //先按无滚动条进行排列
        this.arrange(boxModel.clientRect);


        //再次初始化滚动条，如果滚动条有变则重新排列
        if (initialize.call(this, boxModel, width, height))
        {
            this.arrange(boxModel.clientRect);
        }


        var horizontalScrollBar = this.__horizontalScrollBar__,
            verticalScrollBar = this.__verticalScrollBar__;

        //处理滚动条及拐角
        if (horizontalScrollBar || verticalScrollBar)
        {
            this.__fn_measure_scroll_bar__(boxModel, horizontalScrollBar, verticalScrollBar);
            this.__fn_measure_scroll_corner__(boxModel, horizontalScrollBar, verticalScrollBar);
        }
    };

    this.adjustAutoSize = function (boxModel, auto_width, auto_height) {

        var r = boxModel.clientRect;

        if (auto_width)
        {
            boxModel.width = boxModel.scrollWidth + boxModel.width - r.width;
        }

        if (auto_height)
        {
            boxModel.height = boxModel.scrollHeight + boxModel.height - r.height;
        }
    };



    //排列子控件
    this.arrange = function (clientRect) {

    };



    function cache(target, name) {

        target.__boxModel__.visible = false;

        this["__" + name + "_cache__"] = target;
        this["__" + name + "__"] = null;
    };

    function restore(name) {

        var key = "__" + name + "_cache__",
            result = this["__" + name + "__"] = this[key];

        if (result)
        {
            result.__boxModel__.visible = true;
            this[key] = undefined;
        }

        return result;
    };

    function initilaize_ScrollBar(boxModel, target, parent) {

        target.__parent__ = parent;
        target.width = "fill";
        target.height = "fill";
        target.__boxModel__.initialize_addtions(boxModel);
    };

    function initialize(boxModel, width, height) {


        var result = false,

            horizontalScrollBar = this.__horizontalScrollBar__,
            verticalScrollBar = this.__verticalScrollBar__,

            clientRect = boxModel.clientRect,

            horizontalScroll = false,
            verticalScroll = false,

            scroll;


        //判读是否有水平滚动条
        if ((scroll = this.horizontalScroll) != "never" && !boxModel.__auto_width__)
        {
            horizontalScroll = scroll != "auto" || (boxModel.scrollWidth > clientRect.width && (result = true));
        }

        //判断是否有垂直滚动条
        if ((scroll = this.verticalScroll) != "never" && !boxModel.__auto_height__)
        {
            verticalScroll = scroll != "auto" || (boxModel.scrollHeight > clientRect.height && (result = true));
        }


        clientRect.width = width;
        clientRect.height = height;


        //创建或隐藏水平滚动条
        if (horizontalScroll)
        {
            if (!horizontalScrollBar && !(horizontalScrollBar = restore.call(this, "horizontalScrollBar")))
            {
                horizontalScrollBar = this.__horizontalScrollBar__ = this.create_ScrollBar();
                initilaize_ScrollBar(boxModel, horizontalScrollBar, this);
            }

            clientRect.height -= horizontalScrollBar.thickness;
            boxModel.scrollHeight -= horizontalScrollBar.thickness;
        }
        else if (horizontalScrollBar)
        {
            cache.call(this, horizontalScrollBar, "horizontalScrollBar");
        }


        //创建或隐藏垂直滚动条
        if (verticalScroll)
        {
            if (!verticalScrollBar && !(verticalScrollBar = restore.call(this, "verticalScrollBar")))
            {
                verticalScrollBar = this.__verticalScrollBar__ = this.create_ScrollBar(true);
                initilaize_ScrollBar(boxModel, verticalScrollBar, this);
            }

            clientRect.width -= verticalScrollBar.thickness;
            boxModel.scrollWidth -= verticalScrollBar.thickness;
        }
        else if (verticalScrollBar)
        {
            cache.call(this, verticalScrollBar, "verticalScrollBar");
        }


        return result;
    };


    //创建滚动条
    this.create_ScrollBar = function (vertical) {

        var result = new flyingon.ScrollBar();

        if (vertical)
        {
            result.vertical = vertical;
        }

        return result;
    };

    //创建滚动条拐角
    this.create_ScrollCorner = function () {

        return new flyingon.ScrollCorner();
    };



    //测量滚动条
    this.__fn_measure_scroll_bar__ = function (boxModel, horizontalScrollBar, verticalScrollBar) {


        var usableRect = boxModel.usableRect,
            clientRect = boxModel.clientRect;


        //调整盒模型
        if (horizontalScrollBar)
        {
            if (boxModel.scrollLeft > boxModel.scrollWidth)
            {
                boxModel.scrollLeft = boxModel.scrollWidth;
            }

            usableRect.height -= horizontalScrollBar.thickness;
        }

        if (verticalScrollBar)
        {
            if (boxModel.scrollTop > boxModel.scrollHeight)
            {
                boxModel.scrollTop = boxModel.scrollHeight;
            }

            usableRect.width -= verticalScrollBar.thickness;
        }


        //水平滚动条
        if (horizontalScrollBar)
        {
            horizontalScrollBar.width = usableRect.width;

            horizontalScrollBar.value = boxModel.scrollLeft;
            horizontalScrollBar.maxValue = boxModel.scrollWidth + usableRect.width - clientRect.width;
            horizontalScrollBar.viewportSize = usableRect.width;

            horizontalScrollBar.__boxModel__.measure(usableRect.x, usableRect.bottom, usableRect.width, horizontalScrollBar.thickness);
        }


        //垂直滚动条
        if (verticalScrollBar)
        {
            verticalScrollBar.height = usableRect.height;

            verticalScrollBar.value = boxModel.scrollTop;
            verticalScrollBar.maxValue = boxModel.scrollHeight + usableRect.height - clientRect.height;
            verticalScrollBar.viewportSize = usableRect.height;

            verticalScrollBar.__boxModel__.measure(usableRect.right, usableRect.y, verticalScrollBar.thickness, usableRect.height);
        }
    };

    //处理拐角
    this.__fn_measure_scroll_corner__ = function (boxModel, horizontalScrollBar, verticalScrollBar) {

        var corner = this.__scroll_corner__;

        if (horizontalScrollBar && verticalScrollBar)
        {
            if (!corner && !(corner = restore.call(this, "scroll_corner")))
            {
                corner = this.__scroll_corner__ = this.create_ScrollCorner();
                corner.__parent__ = this;
                corner.__boxModel__.initialize_addtions(boxModel);
            }

            var r = boxModel.usableRect;
            corner.__boxModel__.measure(r.right, r.bottom, verticalScrollBar.thickness, horizontalScrollBar.__thickness__);
        }
        else if (corner)
        {
            cache.call(this, corner, "scroll_corner");
        }
    };


});





﻿//Html控件基类
flyingon.defineClass("HtmlControl", flyingon.Control, function (Class, base, flyingon) {


    Class.create = function () {

        this.dom = $(this.render.apply(this, arguments));
    };


    this.render = function (layer) {

    };

}, true);



flyingon.defineClass("HtmlFrame", flyingon.HtmlControl, function (Class, base, flyingon) {

    var fn;
    //if (flyingon.Browser.IE) {
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





﻿//绘制型多子项控件基础服务
flyingon["items-painter"] = function (Class, flyingon, items_name) {



    Class.create = function () {

        this.__items__ = new flyingon.ItemCollection(this);
    };




    this.defaultValue("width", 200);

    this.defaultValue("height", 200);




    flyingon.defineProperty(this, items_name || "items",

        function () {

            return this.__items__;
        },

        function (value) {

            var oldValue = this.__items__;
            if (oldValue != value)
            {
                this.__items__ = value;

                //
            }
        });


    //this.__selected_list__ = 



    //最大索引号(小于0则不启用索引状态)
    this.defineProperty("maxIndex", 0, "invalidate");



    //是否固定高度
    this.fixed_height = true;


    //子项默认高度
    this.defineProperty("lineHeight", 16, "invalidate");

    //开始显示索引号
    this.defineProperty("visibleIndex", 0, "invalidate");



    //移动开始显示索引至指定坐标
    this.__fn_visible_to__ = function (y) {

        if (this.fixed_height) //固定高度直接算出
        {
            var lineHeight = this.lineHeight || 16;
            return Math.floor(y / lineHeight);
        }

        return this.__fn_visible_items__(y, 0);
    };

    //获取可视项集合
    this.__fn_visible_items__ = function (height, visibleIndex) {

        var result = [],

            items = this.__items__,
            visible_list = items.__visible_list__,

            lineHeight = this.lineHeight || 16,

            top = 0;


        if (visibleIndex == null)
        {
            visibleIndex = this.visibleIndex || 0;
        }

        for (var i = visibleIndex, length = items.length; i < length; i++)
        {
            var item = visible_list[i] || (visible_list[i] = new flyingon.Rect());

            if ((top += item.height || lineHeight) >= height)
            {
                break;
            }

            result.push(item);
        }

        return result;
    };



    this.measureText = function (boxModel) {


    };




    this.serialize = function (writer) {

        flyingon.SerializableObject.prototype.serialize.call(this, writer);

        var items = this.__items__;
        if (items && items.length > 0)
        {
            writer.array(items_name, items);
        }
    };

    this.deserialize = function (reader, data, excludes) {

        excludes[items_name] = true;

        flyingon.SerializableObject.prototype.deserialize.call(this, reader, data, excludes);
        reader.array(this.__items__, "__items__", data[items_name]);
    };

};





﻿
//var prototype = (flyingon.Item = function () {


//}).prototype;


////
//prototype.y = 0;

//prototype.height = 0;

//prototype.text = null;

//prototype.image = null;

//prototype.selected = false;




//
flyingon.defineClass("ItemCollection", flyingon.Collection, function (Class, base, flyingon) {


    Class.create = function (OwnerControl) {

        this.__visible_list__ = [];
        this.OwnerControl = OwnerControl;
    };



    this.__fn_validate__ = function (index, item) {

        if (!flyingon.__initializing__)
        {
            this.ownerControl.invalidate(false);
        }

        return item;
    };

    this.__fn_remove__ = function (index, item) {

        var items = this.__visible_list__;
        if (items.length > index)
        {
            items.splice(index, 1);
        }

        if (!flyingon.__initializing__)
        {
            this.ownerControl.invalidate(false);
        }
    };

    this.__fn_clear__ = function () {

        this.__visible_list__.length = 0;

        if (!flyingon.__initializing__)
        {
            this.ownerControl.invalidate(false);
        }
    };

}, true);






﻿
//多子项面板
flyingon.defineClass("ListBox", flyingon.TemplateControl, function (Class, base, flyingon) {




    flyingon["items-painter"].call(this, Class, flyingon);



});





﻿
flyingon.defineClass("Repeater", flyingon.TemplateControl, function (Class, base, flyingon) {



  

    this.__fn_create_item__ = function () {

    };

    this.clearTemplate = function () {

        var items = this.__items__,
            length = items && items.length;

        for (var i = 0; i < length; i++)
        {
            var item = items[i],
                control = item.__control__;

            if (control)
            {
                item.__control__ = null;
                control.dispose();
            }
        }
    };

    //排列子项
    this.arrange = function (clientRect) {

        var items = this.__items__,
            children = this.__render_children__ = [],

            maxIndex = this.maxIndex,
            lineHeight = this.lineHeight,
            visibleIndex = this.visibleIndex,

            y = 0,
            width = clientRect.width,
            height = clientRect.height,

            template;


        for (var i = 0, length = items.length; i < length; i++)
        {
            var item = items[i];

            if (item.visible)
            {
                var control = item.__control__;

                if (!control)
                {
                    if (template || (template = this.template))
                    {
                        control = item.__control__ = this.createTemplateControl(template, item);
                    }
                    else
                    {
                        control = item.__control__ = this.__fn_create_item__();
                    }
                }


                if (control)
                {
                    control.__boxModel__.measure(0, y, width, lineHeight);

                    children.push(control);

                    if ((y += box.height) >= height)
                    {
                        break;
                    }
                }
            }
        }
    };



});





﻿/*

*/
flyingon.defineClass("ControlCollection", flyingon.Collection, function (Class, base, flyingon) {


    Class.create = function (ownerControl) {

        this.__ownerControl__ = ownerControl;
    };



    //添加进集合时进行验证
    this.__fn_validate__ = function (index, item) {

        if (item instanceof flyingon.Control)
        {
            item.__boxModel__.initialize(this.__ownerControl__.__boxModel__);

            if (flyingon.__initializing__)
            {
                item.__parent__ = this.__ownerControl__;
            }
            else
            {
                item.__fn_parent__(this.__ownerControl__);
            }

            return item;
        }

        return undefined;
    };

    //移\\\\\
    this.__fn_remove__ = function (index, item) {

        var box = item.__boxModel__;

        box.parent = box.offsetParent = null;

        box = this.__ownerControl__.__boxModel__;
        box.children.splice(index, 1);

        if (!flyingon.__initializing__)
        {
            item.__fn_parent__(null);
            this.__ownerControl__.invalidate(false);
        }
    };

    //注: 清除不触发相关事件
    this.__fn_clear__ = function () {

        this.__ownerControl__.__boxModel__.children.length = 0;

        for (var i = 0, length = this.length; i < length; i++)
        {
            var item = this[i],
                box = item.__boxModel__;

            item.__parent__ = null;
            box.parent = box.offsetParent = null;
        }
    };




    //循环执行指定函数
    this.cascade_call = function (fn) {

        var result, item;

        for (var i = 0, length = this.length; i < length; i++)
        {
            if ((result = fn(item = this[i], i)) !== undefined)
            {
                return result;
            }

            if ((item = item.__children__) && (result = item.cascade_call(fn, true)) !== undefined)
            {
                return result;
            }
        }
    };



    //重载自定义反序列化 
    //注: 反序列化时不执行验证
    this.deserialize = function (reader, data, excludes) {

        if (data)
        {
            reader.properties(this, data, excludes);

            var box = this.__ownerControl__.__boxModel__,
                item;

            for (var i = 0, length = this.length; i < length; i++)
            {
                if (item = this[i])
                {
                    item.__boxModel__.initialize(box);
                    item.__parent__ = this.__ownerControl__;
                }
            }
        }
    };



}, true);





﻿/*

*/
(function (flyingon) {



    //布局格
    var prototype = (flyingon.CellDefine = function (grid, row) {

        this.grid = grid;
        this.row = row;

    }).prototype;



    prototype.grid = null;

    prototype.x = 0;

    prototype.width = 0;

    prototype.__width_string__ = "*";

    prototype.__width_weight__ = 100;

    prototype.__width_auto__ = false;


    //设置列宽
    prototype.setWidth = function (value) {

        if (this.__width_auto__)
        {
            this.row.__width_weights__ -= this.__width_weight__;
            this.__width_auto__ = false;
        }
        else if (this.width)
        {
            this.row.__width_fixed__ -= this.width;
        }

        this.__width_string__ = value = value || "*";

        var length = value.length - 1;

        if (value[length] == "*")
        {
            this.__width_weight__ = length ? value.substring(0, length) : 100;
            this.__width_auto__ = true;
            this.width = 0;
            this.row.__width_weights__ += this.__width_weight__;
        }
        else
        {
            this.width = parseInt(value);
            this.row.__width_fixed__ += this.width;
        }
    };





    //布局行
    var prototype = (flyingon.RowDefine = function (grid) {

        this.grid = grid;
        this.cells = [];

    }).prototype;


    prototype.grid = null;

    prototype.y = 0;

    prototype.height = 0;

    prototype.__height_string__ = "*";

    prototype.__height_weight__ = 100;

    prototype.__height_auto__ = false;

    //所属单元格所有固定宽度的总和
    prototype.__width_fixed__ = 0;

    //自动宽度的表格数
    prototype.__width_weights__ = 0;

    //设置行高
    prototype.setHeight = function (value) {

        if (this.__height_auto__)
        {
            this.grid.__height_weights__ -= this.__height_weight__;
            this.__height_auto__ = false;
        }
        else if (this.height)
        {
            this.grid.__height_fixed__ -= this.height;
        }

        this.__height_string__ = value = value || "*";
        var length = value.length - 1;

        if (value[length] == "*")
        {
            this.__height_weight__ = length == 0 ? 100 : value.substring(0, length);
            this.__height_auto__ = true;
            this.height = 0;
            this.grid.__height_weights__ += this.__height_weight__;
        }
        else
        {
            this.height = parseInt(value);
            this.grid.__height_fixed__ += this.height;
        }
    };





    //布局表
    var prototype = (flyingon.GridDefine = function () {

        this.rows = [];

    }).prototype;



    //列留空
    prototype.spaceX = 0;

    //行留空
    prototype.spaceY = 0;

    //所属行中所有固定高度的总和
    prototype.__height_fixed__ = 0;

    //自动高度的权重总数
    prototype.__height_weights__ = 0;


    prototype.compute = function (width, height) {

        this.width = width || 0;
        this.height = height || 0;

        var spaceX = this.spaceX || 0,
            spaceY = this.spaceY || 0,

            rows = this.rows,
            length = rows.length,

            y = this.y || 0,
            height = Math.max(this.height - this.__height_fixed__ - (length - 1) * spaceY, 0),
            height_weights = this.__height_weights__;


        for (var i = 0; i < length; i++)
        {
            var row = rows[i];

            row.y = y;

            if (row.__height_auto__)
            {
                row.height = Math.round(height * row.__height_weight__ / height_weights);
                height_weights -= row.__height_weight__;
                height -= row.height;
            }


            var cells = row.cells,
                count = cells.length,

                x = this.x || 0,
                width = Math.max(this.width - row.__width_fixed__ - (count - 1) * spaceX, 0),
                width_weights = row.__width_weights__;

            for (var j = 0; j < count; j++)
            {
                var cell = cells[j];

                cell.x = x;

                if (cell.__width_auto__)
                {
                    cell.width = Math.round(width * cell.__width_weight__ / width_weights);
                    width_weights -= cell.__width_weight__;
                    width -= cell.width;
                }

                if (cell.children)
                {
                    var children = cell.children;

                    children.x = x;
                    children.y = y;
                    children.spaceX = spaceX;
                    children.spaceY = spaceY;
                    children.compute(cell.width, row.height);
                }

                x += cell.width + spaceX;
            }

            y += row.height + spaceY;
        }

        return this;
    };



    prototype.create = function (rows, columns) {

        var rows = Math.max(rows, 0) || 3,
            columns = Math.max(columns, 0) || 3;


        for (var i = 0; i < rows; i++)
        {
            var row = new flyingon.RowDefine(this);

            row.__height_auto__ = true;
            this.__height_weights__ += row.__height_weight__;

            for (var j = 0; j < columns; j++)
            {
                var cell = new flyingon.CellDefine(this, row);

                cell.__width_auto__ = true;
                row.__width_weights__ += cell.__width_weight__;

                row.cells.push(cell);
            }

            this.rows.push(row);
        }

        return this;
    };

    prototype.load = function (value) {

        value = value || "T R* C* C* C* R* C* C* C* R* C* C* C* END";

        var children = [],
            rows = [],
            grid = this,
            row,
            cell,
            tokens = value.split(/\s/g);


        for (var i = 0, length = tokens.length; i < length; i++)
        {
            var token = tokens[i],
                value = token.substring(1);

            if (token == "END")
            {
                grid = children.pop();
                row = rows.pop();
            }
            else
            {
                switch (token[0])
                {
                    case "T":
                        if (cell != null)
                        {
                            children.push(grid);
                            rows.push(row);

                            grid = cell.children = new flyingon.GridDefine();
                            row = null;
                        }
                        break;

                    case "R":
                        row = new flyingon.RowDefine(grid);
                        row.setHeight(value);
                        grid.rows.push(row);

                        cell = null;
                        break;

                    case "C":
                        if (row)
                        {
                            cell = new flyingon.CellDefine(grid, row);
                            cell.setWidth(value);
                            row.cells.push(cell);
                        }
                        break;
                }
            }
        }

        return this;
    };


    prototype.serialize = function (writer) {

    };

    prototype.deserialize = function (reader, value, excludes) {


    };

    prototype.__fn_horizontal_cells__ = function (include_children, result) {

        var rows = this.rows;

        result = result || [];

        for (var i = 0, length = rows.length; i < length; i++)
        {
            var row = rows[i],
                cells = row.cells;

            for (var j = 0, count = cells.length; j < count; j++)
            {
                var cell = cells[j];

                if (include_children && cell.children)
                {
                    cell.children.__fn_horizontal_cells__(true, result);
                }
                else
                {
                    result.push(cell);
                }
            }
        }

        return result;
    };

    prototype.__fn_vertical_cells__ = function (include_children, result) {

        var rows = this.rows,
            values = [];

        result = result || [];

        for (var i = 0, length = rows.length; i < length; i++)
        {
            var row = rows[i],
                cells = row.cells;

            for (var j = 0, count = cells.length; j < count; j++)
            {
                var cell = cells[j];

                if (include_children && cell.children)
                {
                    cell.children.__fn_vertical_cells__(true, result);
                }
                else
                {
                    (values[i] || (values[i] = [])).push(cell);
                }
            }
        }

        for (var i = 0, length = values.length; i < length; i++)
        {
            result.push.apply(result, values[i]);
        }

        return result;
    };



    //按顺序自动排列子控件
    prototype.match = function (items, vertical) {

        var cells = this[vertical ? "__fn_vertical_cells__" : "__fn_horizontal_cells__"](true),
            count = cells.length,
            index = 0;

        for (var i = 0, length = items.length; i < length; i++)
        {
            var item = items[i],
                box = item.__boxModel__;

            if (box.visible = index < count && item.visibility != "collapsed")
            {
                var cell = cells[index++];

                box.measure(cell.x, cell.row.y, cell.width, cell.row.height);
            }
        }

        return this;
    };


})(flyingon);




﻿//面板控件
flyingon.defineClass("Panel", flyingon.ScrollableControl, function (Class, base, flyingon) {




    Class.create = function () {


        //子控件集合
        this.__children__ = new flyingon.ControlCollection(this);

        //初始化子盒模型
        this.__boxModel__.children = [];
    };





    //修改默认修值接受拖放
    this.defaultValue("droppable", true);



    this.defaultValue("width", 400);

    this.defaultValue("height", 400);



    //子控件集合
    this.defineProperty("children", function () {

        return this.__children__;
    });



    var attributes = {

        attributes: "locate|style",
        changed: "boxModel.scrollLeft = 0;\nboxModel.scrollTop = 0;"
    };


    //当前布局
    //line:     线性布局
    //flow:     流式布局
    //single:   单个显示
    //dock:     停靠布局
    //queue:    队列布局
    //grid:     网格布局
    //absolute: 绝对定位
    this.defineProperty("layout", "flow", attributes);


    //排列方向
    //horizontal: 横向
    //vertical:   纵向
    this.defineProperty("orientation", "horizontal", attributes);

    //镜向变换 以容器中心点作为变换坐标原点
    //none: 不变换
    //x-axis: 沿x中心轴变换
    //y-axis: 沿y中心轴变换
    //origin: 沿坐标原点变换
    this.defineProperty("mirror", "none", "measure|style");



    //布局x轴间隔 0-1之间表示间隔值为总宽度百分比
    this.defineProperty("spaceX", 0, attributes);

    //布局y轴间隔 0-1之间表示间隔值为总高度的百分比
    this.defineProperty("spaceY", 0, attributes);

    //布局行高
    this.defineProperty("lineHeight", 0, attributes);

    //布局列宽
    this.defineProperty("lineWidth", 0, attributes);

    //当前布局页索引
    this.defineProperty("index", 0, "measure");

    //布局列数
    this.defineProperty("columns", 3, "measure|style");

    //布局行数
    this.defineProperty("rows", 3, "measure|style");

    //布局网格
    this.defineProperty("grid", null, "measure|style");





    //布局集
    var layouts = {};

    //单行布局 spaceX
    function line_horizontal(items, clientRect, spaceX, spaceY) {

        var x = 0,

            width = clientRect.width,
            height = clientRect.height,

            boxModel = this.__boxModel__,
            scrollWidth = boxModel.scrollWidth,
            scrollHeight = boxModel.scrollHeight;


        for (var i = 0, length = items.length; i < length; i++)
        {
            var item = items[i],
                box = item.__boxModel__;

            if (box.visible = (item.visibility != "collapsed"))
            {
                box.measure(x, 0, 0, 0, width - x, height, null, height);

                if ((x = box.right + box.margin.left) > scrollWidth)
                {
                    scrollWidth = x;
                }

                x += spaceX;

                if (box.height > scrollHeight)
                {
                    scrollHeight = box.height;
                }
            }
        }


        boxModel.scrollWidth = scrollWidth;
        boxModel.scrollHeight = scrollHeight;
    };


    //单列排列 spaceY
    function line_vertical(items, clientRect, spaceX, spaceY) {

        var y = 0,

            width = clientRect.width,
            height = clientRect.height,

            boxModel = this.__boxModel__,
            scrollWidth = boxModel.scrollWidth,
            scrollHeight = boxModel.scrollHeight;


        for (var i = 0, length = items.length; i < length; i++)
        {
            var item = items[i],
                box = item.__boxModel__;

            if (box.visible = (item.visibility != "collapsed"))
            {
                box.measure(0, y, 0, 0, width, height - y, width);

                if (box.width > scrollWidth)
                {
                    scrollWidth = box.width;
                }

                if ((y = box.bottom + box.margin.bottom) > scrollHeight)
                {
                    scrollHeight = y;
                }

                y += spaceY;
            }
        }


        boxModel.scrollWidth = scrollWidth;
        boxModel.scrollHeight = scrollHeight;
    };

    //线性布局 spaceX
    layouts.line = function (items, clientRect, orientation, spaceX, spaceY) {

        var fn = orientation == "horizontal" ? line_horizontal : line_vertical;
        fn.call(this, items, clientRect, spaceX, spaceY);
    };


    //多行排列 spaceX spaceY lineHeight
    function flow_horizontal(items, clientRect, spaceX, spaceY) {

        var x = 0,
            y = 0,

            lineHeight = this.lineHeight,

            maxWidth = clientRect.width,
            maxHeight = lineHeight,

            boxModel = this.__boxModel__,
            scrollWidth = boxModel.scrollWidth,
            scrollHeight = boxModel.scrollHeight,

            cache;



        for (var i = 0, length = items.length; i < length; i++)
        {
            var item = items[i],
                box = item.__boxModel__;

            if (box.visible = (item.visibility != "collapsed"))
            {
                box.measure(x, y, 0, 0, maxWidth - x, lineHeight, null, lineHeight);

                cache = box.right + box.margin.right;

                if (x > 0)
                {
                    var newline;

                    switch (item.flow)
                    {
                        case "auto": //如果超出宽度则折行
                            newline = cache > maxWidth;
                            break;

                        case "inline": //永远不换行
                            newline = false;
                            break;

                        case "newline": //永远换行
                            newline = true;
                            break;
                    }

                    //换行
                    if (newline)
                    {
                        box.moveTo(x = 0, y += maxHeight + spaceY, true);
                        cache = box.right + box.margin.right;
                        maxHeight = lineHeight;
                    }
                }

                if ((x = cache) > scrollWidth)
                {
                    scrollWidth = x;
                }

                if ((cache = y + maxHeight) > scrollHeight)
                {
                    scrollHeight = cache;
                }

                if ((cache = box.height + box.margin.spaceY) > maxHeight)
                {
                    maxHeight = cache;
                }

                x += spaceX;
            }
        }


        boxModel.scrollWidth = scrollWidth;
        boxModel.scrollHeight = scrollHeight;
    };


    //多列排列 spaceX spaceY lineWidth
    function flow_vertical(items, clientRect, spaceX, spaceY) {

        var x = 0,
            y = 0,

            lineWidth = this.lineWidth,

            maxWidth = lineWidth,
            maxHeight = clientRect.height,

            boxModel = this.__boxModel__,
            scrollWidth = boxModel.scrollWidth,
            scrollHeight = boxModel.scrollHeight,

            cache;


        for (var i = 0, length = items.length; i < length; i++)
        {
            var item = items[i],
                box = item.__boxModel__;

            if (box.visible = (this.visibility != "collapsed"))
            {
                box.measure(x, y, 0, 0, lineWidth, maxHeight - y, lineWidth);

                cache = box.bottom + box.margin.bottom;

                if (y > 0)
                {
                    var newline;

                    switch (item.flow)
                    {
                        case "auto": //如果超出高度则折行
                            newline = cache > maxHeight;
                            break;

                        case "inline": //永远不换行
                            newline = false;
                            break;

                        case "newline": //永远换行
                            newline = true;
                            break;
                    }

                    //换行
                    if (newline)
                    {
                        box.moveTo(x += maxWidth + spaceX, y = 0, true);
                        cache = box.bottom + box.margin.bottom;
                        maxWidth = lineWidth;
                    }
                }

                if ((y = cache) > scrollHeight)
                {
                    scrollHeight = y;
                }

                if ((cache = x + maxWidth) > scrollWidth)
                {
                    scrollWidth = cache;
                }

                if ((cache = box.width + box.margin.spaceX) > maxWidth)
                {
                    maxWidth = cache;
                }

                y += spaceY;
            }
        }


        boxModel.scrollWidth = scrollWidth;
        boxModel.scrollHeight = scrollHeight;
    };

    //流式布局 spaceX
    layouts.flow = function (items, clientRect, orientation, spaceX, spaceY) {

        var fn = orientation == "horizontal" ? flow_horizontal : flow_vertical;
        fn.call(this, items, clientRect, spaceX, spaceY);
    };


    //单个显示 index
    layouts.single = function (items, clientRect, orientation, spaceX, spaceY) {

        var index = this.index,
            length = items.length;

        if (index < 0)
        {
            index = 0;
        }
        else if (index >= length)
        {
            index = length - 1;
        }

        for (var i = 0; i < length; i++)
        {
            var item = items[i],
                box = item.__boxModel__;

            if (box.visible = (i == index))
            {
                box.measure(0, 0, clientRect.width, clientRect.height);
            }
        }
    };


    //停靠布局 spaceX spaceY dock
    layouts.dock = function (items, clientRect, orientation, spaceX, spaceY) {

        var x = 0,
            y = 0,

            width = clientRect.width,
            height = clientRect.height,

            right = width,
            bottom = height,

            fill = [];


        for (var i = 0, length = items.length; i < length; i++)
        {
            var item = items[i],
                box = item.__boxModel__;

            if (box.visible = (item.visibility != "collapsed"))
            {
                if (width <= 0 || height <= 0)
                {
                    box.visible = false;
                }
                else
                {
                    switch (item.dock)
                    {
                        case "left":
                            box.measure(x, y, 0, height, width);
                            x = box.right + spaceX;
                            width = right - x;
                            break;

                        case "top":
                            box.measure(x, y, width, 0, null, height);
                            y = box.bottom + spaceY;
                            height = bottom - y;
                            break;

                        case "right":
                            box.measure(x, y, 0, height, width);
                            right -= box.width;

                            box.moveTo(right, y, true);

                            right -= spaceX;
                            width = right - x;
                            break;

                        case "bottom":
                            box.measure(x, y, width, 0, null, height);
                            bottom -= box.height;

                            box.moveTo(x, bottom, true);

                            bottom -= spaceY;
                            height = bottom - y;
                            break;

                        default:
                            fill.push(box);
                            break;
                    }
                }
            }
        }


        if (width <= 0 || height <= 0)
        {
            for (var i = 0; i < fill.length; i++)
            {
                fill[i].visible = false;
            }
        }
        else
        {
            for (var i = 0; i < fill.length; i++)
            {
                fill[i].measure(x, y, width, height);
            }
        }
    };


    //队列布局 columns rows spaceX spaceY
    layouts.queue = function (items, clientRect, orientation, spaceX, spaceY) {


        var horizontal = orientation == "horizontal",

            rows = this.rows,
            columns = this.columns,
            count = (rows = rows > 0 ? rows : 3) * (columns = (columns > 0 ? columns : 3)),
            row = 0,
            column = 0,

            width_cache = [],
            height_cache = [],

            x = spaceX,
            y = clientRect.width - spaceX * (columns + 1);


        //先计算好行列位置及宽度
        for (var i = 0; i < columns; i++)
        {
            var value = Math.floor(y / (columns - i));
            width_cache[i] = [x, value];

            x += value + spaceX;
            y -= value;
        }

        x = spaceY;
        y = clientRect.height - spaceY * (rows + 1);

        for (var i = 0; i < rows; i++)
        {
            var value = Math.floor(y / (rows - i));
            height_cache[i] = [x, value];

            x += value + spaceY;
            y -= value;
        }


        for (var i = 0, length = items.length; i < length; i++)
        {
            var item = items[i],
                box = item.__boxModel__;

            if (box.visible = row < rows && column < columns && item.visibility != "collapsed")
            {
                if (horizontal)
                {
                    var width = width_cache[column++],
                        height = height_cache[row];

                    box.measure(width[0], height[0], width[1], height[1]);

                    if (column >= columns)
                    {
                        column = 0;
                        row++;
                    }
                }
                else
                {
                    var width = width_cache[column],
                        height = height_cache[row++];

                    box.measure(width[0], height[0], width[1], height[1]);

                    if (row >= rows)
                    {
                        row = 0;
                        column++;
                    }
                }
            }
        }
    };


    //网格布局 grid spaceX spaceY
    //示例: "T R* C* C* C* R* C* C* C* R* C* C* C* END"
    layouts.grid = function (items, clientRect, orientation, spaceX, spaceY) {

        var grid = this.grid;

        if (!(grid instanceof flyingon.GridDefine))
        {
            grid = new flyingon.GridDefine().load(grid);
        }

        grid.spaceX = spaceX;
        grid.spaceY = spaceY;

        grid.compute(clientRect.width, clientRect.height);
        grid.match(items, orientation == "vertical");
    };


    //绝对定位 left top
    layouts.absolute = function (items, clientRect) {

        var boxModel = this.__boxModel__;

        for (var i = 0, length = items.length; i < length; i++)
        {
            var item = items[i],
                box = item.__boxModel__;

            if (box.visible = (this.visibility != "collapsed"))
            {
                box.measure(item.left, item.top, item.width, item.height);

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



    //注册自定义布局 
    //注意:
    //1. 遵守回调函数规范(items, clientRect, orientation, spaceX, spaceY)
    //2. 按需设置盒模型的scrollWidth及scrollHeight值
    Class.registryLayout = function (name, fn) {

        layouts[name] = fn;
    };




    //测量
    this.measure = function (boxModel) {

        base.measure.call(this, boxModel);

        var mirror = this.mirror,
            items,
            length;

        if (mirror != "none" && (items = boxModel.children) && (length = items.length) > 0)
        {
            switch (this.mirror) //处理镜像变换
            {
                case "x-axis": //沿x中心轴变换
                    var height = boxModel.scrollHeight;

                    for (var i = 0; i < length; i++)
                    {
                        var box = items[i];
                        box.moveTo(box.x, height - box.bottom);
                    }
                    break;

                case "y-axis": //沿y中心轴变换
                    var width = boxModel.scrollWidth;

                    for (var i = 0; i < length; i++)
                    {
                        var box = items[i];
                        box.moveTo(width - box.right, box.y);
                    }
                    break;

                case "origin": //沿坐标原点变换
                    width = boxModel.scrollWidth;
                    height = boxModel.scrollHeight;

                    for (var i = 0; i < length; i++)
                    {
                        var box = items[i];
                        box.moveTo(width - box.right, height - box.bottom);
                    }
                    break;
            }
        }
    };

    //排列子控件
    this.arrange = function (clientRect) {

        this.__render_children__ = null;

        var items = this.__children__;

        if (items.length > 0)
        {
            var fn = layouts[this.layout];

            if (fn)
            {
                var spaceX = this.spaceX,
                    spaceY = this.spaceY;

                if (typeof spaceX != "number")
                {
                    spaceX = flyingon.parseInt(spaceX, clientRect.width);
                }

                if (typeof spaceY != "number")
                {
                    spaceY = flyingon.parseInt(spaceY, clientRect.height);
                }

                fn.call(this, items, clientRect, this.orientation, spaceX, spaceY);
            }
        }

        return this;
    };



    //获取当前可渲染的子项
    this.__fn_render_children__ = function (boxModel) {

        var result = this.__render_children__;

        if (!result)
        {
            var clipToBounds = this.clipToBounds,

                children = boxModel.children,
                r = boxModel.clientRect,
                x = boxModel.scrollLeft,
                y = boxModel.scrollTop,
                right = x + r.width,
                bottom = y + r.height;

            result = this.__render_children__ = [];

            for (var i = 0, length = children.length; i < length; i++)
            {
                var item = children[i];

                if (item.visible &&
                    item.right >= x &&
                    item.bottom >= y &&
                    item.ownerControl.visibility == "visible" &&
                    (!clipToBounds || (item.x < right && item.y < bottom)))
                {
                    result.push(item);
                }
            }
        }

        return result;
    };





    //获取指定位置的控件
    this.findAt = function (x, y) {

        //判断滚动条
        var result = base.findAt.call(this, x, y);

        if (result != this)
        {
            return result;
        }



        var box = this.__boxModel__,
            r = box.clientRect;


        x += box.scrollLeft - r.x;
        y += box.scrollTop - r.y;

        //if (this.transform)
        //{

        //}


        var items = this.__render_children__;

        if (items && items.length > 0)
        {
            for (var i = items.length - 1; i >= 0 ; i--)
            {
                var item = items[i].ownerControl;

                if (item.hitTest(x, y))
                {
                    return item.findAt ? item.findAt(x, y) : item;
                }
            }
        }


        return this;
    };




    this.focus = function () {


        if (this.containsFocused)
        {
            return true;
        }


        var items = this.__children__;

        for (var i = 0, length = items.length; i < length; i++)
        {
            if (items[i].focus(event))
            {
                return true;
            }
        }

        return base.focus.call(this, event);
    };

    this.blur = function () {

        return this.containsFocused ? base.blur.call(this, event) : false;
    };




    this.serialize = function (writer) {

        base.serialize.call(this, writer);

        var items = this.__children__;
        if (items.length > 0)
        {
            writer.array("children", items);
        }
    };

    this.deserialize = function (reader, data, excludes) {

        excludes.children = true;

        base.deserialize.call(this, reader, data, excludes);
        this.__children__.deserialize(reader, data["children"]);
    };


}, true);




﻿//分隔条控件
flyingon.defineClass("Splitter", flyingon.ContentControl, function (Class, base, flyingon) {



    Class.create = function () {

        var fields = this.__fields__;
        fields.cursor = "col-resize";
        fields.dock = "left";
        fields.draggable = true;
    };



    this.defaultValue("draggable", true);

    this.defaultValue("dock", "left");





    this.__event_mousedown__ = function (event) {


    };

    this.__event_mousemove__ = function (event) {


    };

    this.__event_mouseup__ = function (event) {


    };



    this.dragger = {

        drop_cursor: "col-Resize",

        nodrop_cursor: "no-drop",

        paint: function (context, dragTargets) {

            var box = this.__boxModel__,
                r = box.clientRect;

            context.fillStyle = "rgba(255,0,0,0.5)";
            context.fillRect(r.x, r.y, r.width, r.height);

            this.paint(context, box);
            this.paint_border(context, box);
        },

        move: function (event, offsetX, offsetY) {

            switch (this.dock)
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


}, true);





﻿/*
用户控件
*/
flyingon.defineClass("UserControl", flyingon.Panel, function (Class, base, flyingon) {





});






﻿
//图层服务
flyingon.__layer_service__ = function (host) {


    //创建绘图环境
    var div = this.dom_layer = document.createElement("div"),
        canvas = this.dom_canvas = document.createElement("canvas"),
        boxModel = this.__boxModel__;


    div.setAttribute("flyingon", "layer");
    div.setAttribute("style", "position:absolute;width:100%;height:100%;overflow:hidden;outline:none;");

    canvas.setAttribute("flyingon", "canvas");
    canvas.setAttribute("style", "position:absolute;outline:none;");

    div.appendChild(canvas);

    if (host)
    {
        host.appendChild(div);
    }


    //创建绘画环境
    this.context = boxModel.context = canvas.getContext("2d");

    
    //扩展盒模型更新相关方法
    (function(){


        //更新定时器
        var timer, boxModel = this;


        //更新画布
        function update() {

            boxModel.update(boxModel.context);
        };

        //注册更新
        this.__registry_update__ = function () {

            if (timer)
            {
                clearTimeout(timer);
            };

            timer = setTimeout(update, 5);
        };

        //注销更新
        this.__unregistry_update__ = function () {

            if (timer)
            {
                clearTimeout(timer);
                timer = 0;
            };
        };


    }).call(boxModel);

};




/*

*/
flyingon.defineClass("Layer", flyingon.Panel, function (Class, base, flyingon) {



    Class.create = function () {

        //订阅图层服务
        flyingon.__layer_service__.call(this);
    };



    //修改透明度属性
    this.defineProperty("opacity", 1, {

        complete: "this.dom_layer.style.opacity = value;"
    });

    //修改宽度属性
    this.defineProperty("width", function () {

        return this.dom_canvas.width;
    });

    //修改高度属性
    this.defineProperty("height", function () {

        return this.dom_canvas.height;
    });


    this.update = function () {

        this.__boxModel__.invalidate(false);
        this.__boxModel__.update(this.context);
    };


}, true);






﻿//窗口基类
flyingon.defineClass("WindowBase", flyingon.Panel, function (Class, base, flyingon) {



    var host,                       //主容器
        dragging = false,           //是否处理拖动
        mousedown_cache = false;          //鼠标是否按下



    Class.create = function () {


        var div = this.dom_window = document.createElement("div");

        div.setAttribute("flyingon", "window");
        div.setAttribute("style", "position:absolute;z-index:9990;width:100%;height:100%;overflow:hidden;-moz-user-select:none;-webkit-user-select:none;outline:none;cursor:default;");
        div.setAttribute("tabindex", "0");

        //订阅图层服务
        flyingon.__layer_service__.call(this, div);

        //缓存当前对象
        div.__ownerWindow__ = this.dom_layer.__ownerWindow__ = this.dom_canvas.__ownerWindow__ = this;

        //IE禁止选中文本 其它浏览器使用样式控件 -moz-user-select:none;-webkit-user-select:none;
        div.onselectstart = function (event) { return false; };


        //初始化图层
        this.layers = [this];

        //子窗口集合
        this.__windows__ = [];


        //默认设置为初始化状态,在渲染窗口后终止
        flyingon.__initializing__ = true;

        //绑定dom事件
        this.__fn_binging_event__(div);

        //初始化输入符
        flyingon.__fn_initialize_caret__.call(this, this.dom_window);
    };




    //开始初始化
    flyingon.beginInit = function () {

        flyingon.__initializing__ = true;
        return this;
    };

    //结束初始化
    flyingon.endInit = function () {

        flyingon.__initializing__ = false;
        return this;
    };




    //绑定dom事件
    this.__fn_binging_event__ = function (div) {


        //绑定事件
        div.addEventListener("mousedown", mousedown, true);

        //宿主
        if (!host)
        {
            host = document.documentElement;

            //样式说明: 禁止选中文本: -moz-user-select:none;-webkit-user-select:none;
            host.setAttribute("style", "-moz-user-select:none;-webkit-user-select:none;");

            host.addEventListener("mousemove", mousemove, false);   //注册顶级dom以便捕获鼠标
            host.addEventListener("mouseup", mouseup, false);       //注册顶级dom以便捕获鼠标
        }


        div.addEventListener("click", click, true);
        div.addEventListener("dblclick", dblclick, true);

        div.addEventListener("mousewheel", mousewheel, true);
        div.addEventListener("DOMMouseScroll", mousewheel, true); //firefox

        div.addEventListener("keydown", key_event, true);
        div.addEventListener("keypress", key_event, true);
        div.addEventListener("keyup", key_event, true);


        //创建控件捕获延迟执行器
        this.__capture_delay__ = new flyingon.DelayExecutor(10, capture_control, this);
    };


    //所属窗口
    this.defineProperty("ownerWindow", function () {

        return this;
    });

    //修改透明度属性
    this.defineProperty("opacity", 1, {

        complete: "this.dom_layer.style.opacity = value;"
    });

    //修改宽度属性
    this.defineProperty("width", function () {

        return this.dom_canvas.width;
    });

    //修改高度属性
    this.defineProperty("height", function () {

        return this.dom_canvas.height;
    });



    //窗口切换为活动窗口事件
    this.defineEvent("activate");

    //窗口切换为非活动窗口事件
    this.defineEvent("deactivate");





    //设置当前窗口为活动窗口
    this.activate = function (deactivate) {

        var parentWindow = this.parentWindow,
            activateWindow;


        if (parentWindow)
        {
            if (deactivate !== false && (activateWindow = parentWindow.__activateWindow__))
            {
                activateWindow.__fn_deactivate__();
            }

            parentWindow.__activateWindow__ = this;
            this.__fn_activate__();
        }
    };


    //获取活动窗口
    this.get_activateWindow = function () {

        var result = this,
            activateWindow;


        while (activateWindow = result.__activateWindow__)
        {
            result = activateWindow;
        }

        return result == this ? null : result;
    };



    this.__fn_activate__ = function () {

        this.dom_window.style.zIndex = 9991;
        this.dispatchEvent("activate");

        this.stateTo("active", true);
    };

    this.__fn_deactivate__ = function () {

        this.dom_window.style.zIndex = 9990;
        this.dispatchEvent("deactivate");

        this.stateTo("active", false);
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

    this.appendLayer = function (zIndex, layer) {

        var result = layer || new flyingon.Layer(),
            dom_layer = result.dom_layer,
            dom_canvas = result.dom_canvas;


        if (zIndex)
        {
            dom_layer.style.zIndex = zIndex;
        }

        dom_canvas.width = this.width;
        dom_canvas.height = this.height;

        result.__boxModel__.measure(0, 0, dom_canvas.width, dom_canvas.height);
        result.__parent__ = this;

        dom_layer.__ownerWindow__ = dom_canvas.__ownerWindow__ = this;

        this.dom_window.appendChild(dom_layer);
        this.layers.push(result);

        return result;
    };


    this.removeLayer = function (layer) {

        if (layer)
        {
            layer.__parent__ = layer.dom_layer.__ownerWindow__ = layer.dom_canvas.__ownerWindow__ = null;

            this.dom_window.removeChild(layer.dom_layer);
            this.layers.remove(layer);
        }
    };



    this.findAt = function (x, y) {

        for (var i = this.layers.length - 1; i >= 0; i--)
        {
            var layer = this.layers[i];

            if (!layer.disableGetControlAt && layer.context.getImageData(x, y, 1, 1).data[3] != 0)
            {
                return base.findAt.call(layer, x, y);
            }
        }

        return this;
    };


    //缓存html节点
    var html_node = document.documentElement;

    //计算偏移,处理firefox没有offsetX及offsetY的问题
    function offset(event) {

        if (!event.__offsetX__)
        {
            var x = 0,
                y = 0,
                target = this.dom_window || event.target;

            while (target)
            {
                x += target.offsetLeft;
                y += target.offsetTop;

                target = target.offsetParent;
            }

            //不能使用offsetX 在IE下无法重赋值
            event.__offsetX__ = event.pageX - x;
            event.__offsetY__ = event.pageY - y;
        }
    };


    //触发带mousedown的鼠标事件
    function dispatchEvent(type, target, dom_MouseEvent) {

        var event = new flyingon.MouseEvent(type, target, dom_MouseEvent);
        event.mousedown = mousedown_cache;

        target.dispatchEvent(event);
    };


    //控件捕获
    function capture_control(dom_MouseEvent) {


        var source = flyingon.__hover_control__,
            target = this.findAt(dom_MouseEvent.__offsetX__, dom_MouseEvent.__offsetY__) || this;

        if (target != source)
        {
            document.title = target.id;

            flyingon.__hover_control__ = target;

            if (source)
            {
                source.stateTo("hover", false);
                dispatchEvent("mouseout", source, dom_MouseEvent);
            }

            if (target && target.enabled)
            {
                this.dom_window.style.cursor = target.__fn_cursor__(dom_MouseEvent);
                target.stateTo("hover", true);

                dispatchEvent("mouseover", target, dom_MouseEvent);
                dispatchEvent("mousemove", target, dom_MouseEvent);
            }
        }
    };


    function mousedown(dom_MouseEvent) {


        var ownerWindow = this.__ownerWindow__.__capture_delay__.execute();


        //设置鼠标按下
        mousedown_cache = true;



        //处理弹出窗口
        if (ownerWindow != ownerWindow.mainWindow.get_activateWindow()) //活动窗口不是当前点击窗口
        {
            ownerWindow.activate(true);
        }


        //处理鼠标按下事件
        var target = ownerWindow.__capture_control__ || flyingon.__hover_control__;

        if (target && target.enabled)
        {
            offset.call(ownerWindow, dom_MouseEvent);

            //如果可拖动
            if (dragging = target.draggable || ownerWindow.designMode)
            {
                flyingon.Dragdrop.start(ownerWindow, target, dom_MouseEvent, true);
            }
            else
            {
                target.stateTo("active", true);

                //处理焦点
                if (target.focusable)
                {
                    var focused = ownerWindow.__focused_control__;
                    if (focused && focused != target && focused.validate())
                    {
                        focused.__fn_blur__();
                    }

                    target.__fn_focus__(event);
                }

                //分发事件
                var event = new flyingon.MouseEvent("mousedown", target, dom_MouseEvent);
                target.dispatchEvent(event);
            }


            //设置捕获(注:setCapture及releaseCapture仅IE支持,不能使用)
            host.__ownerWindow__ = ownerWindow;

            dom_MouseEvent.stopPropagation();
        }
    };


    function mousemove(dom_MouseEvent) {


        var ownerWindow = host.__ownerWindow__ || dom_MouseEvent.target.__ownerWindow__,
            target;


        if (ownerWindow)
        {
            offset.call(ownerWindow, dom_MouseEvent);

            if (dragging) //处理拖动
            {
                flyingon.Dragdrop.move(dom_MouseEvent);
            }
            else if (target = ownerWindow.__capture_control__) //启用捕获
            {
                if (target.enabled)
                {
                    dispatchEvent("mousemove", target, dom_MouseEvent);
                }
            }
            else
            {
                ownerWindow.__capture_delay__.registry([dom_MouseEvent]); //启用延迟捕获
            }
        }
        else if (target = flyingon.__hover_control__)
        {
            flyingon.__hover_control__ = null;

            target.stateTo("hover", false);
            dispatchEvent("mouseout", target, dom_MouseEvent);
        }
    };


    function mouseup(dom_MouseEvent) {


        var ownerWindow = host.__ownerWindow__;

        if (ownerWindow)
        {
            var target = ownerWindow.__capture_control__ || flyingon.__hover_control__;

            if (target && target.enabled)
            {
                offset.call(ownerWindow, dom_MouseEvent);

                if (dragging)
                {
                    dragging = false;

                    if (!flyingon.Dragdrop.stop())
                    {
                        return;
                    }
                }

                target.stateTo("active", false);
                target.dispatchEvent(new flyingon.MouseEvent("mouseup", target, dom_MouseEvent));
            }


            //取消捕获
            host.__ownerWindow__ = null;

            //设置鼠标弹起
            mousedown_cache = false;
        }
    };



    //鼠标事件翻译方法
    function translate_MouseEvent(type, dom_MouseEvent) {


        var ownerWindow = this.__ownerWindow__.__capture_delay__.execute(),
            target = ownerWindow.__capture_control__ || flyingon.__hover_control__;


        if (target && target.enabled)
        {
            offset.call(ownerWindow, dom_MouseEvent);
            target.dispatchEvent(new flyingon.MouseEvent(type, target, dom_MouseEvent));
        }

        dom_MouseEvent.stopPropagation();
    };

    function click(dom_MouseEvent) {

        translate_MouseEvent.call(this, "click", dom_MouseEvent);
    };

    function dblclick(dom_MouseEvent) {

        translate_MouseEvent.call(this, "dblclick", dom_MouseEvent);
    };

    function mousewheel(dom_MouseEvent) {

        translate_MouseEvent.call(this, "mousewheel", dom_MouseEvent);
    };



    function key_event(dom_KeyEvent) {

        var ownerWindow = this.__ownerWindow__,
            focused = ownerWindow.__focused_control__;

        //如果有输入焦点控件则发送事件至输入焦点控件
        if (focused && focused.enabled)
        {
            focused.dispatchEvent(new flyingon.KeyEvent(dom_KeyEvent.type, focused, dom_KeyEvent));
        }
        else //否则处理accessKey
        {

        }

    };



    //获取窗口范围
    this.__fn_getBoundingClientRect__ = function (fill) {

        flyingon.__initializing__ = false;

        var r = this.dom_window.getBoundingClientRect();

        if (fill) //画布充满窗口
        {
            this.__fields__.width = this.dom_canvas.width = r.width;
            this.__fields__.height = this.dom_canvas.height = r.height;
        }

        return r;
    };

    //重新调整窗口大小
    this.__fn_resize__ = function (offsetX, offsetY, width, height) {

        var layers = this.layers;

        for (var i = 0, length = layers.length; i < length; i++)
        {
            var layer = layers[i],
                canvas = layer.dom_canvas,
                box = layer.__boxModel__;

            canvas.width = width; //清空画布
            canvas.height = height;

            box.__unregistry_update__();
            box.measure(offsetX, offsetY, width - offsetX, height - offsetY);
            box.render(layer.context);
        }
    };



}, true);





﻿//主窗口
flyingon.defineClass("Window", flyingon.WindowBase, function (Class, base, flyingon) {



    Class.create = function (parentNode) {


        var div = this.dom_host = document.createElement("div");

        div.setAttribute("flyingon", "window-host");
        div.setAttribute("style", "position:relative;width:100%;height:100%;overflow:hidden;");

        //添加窗口
        div.appendChild(this.dom_window);

        //添加至指定dom
        if (parentNode)
        {
            parentNode.appendChild(div);
        }


        //定义主窗口变量
        flyingon.defineVariable(this, "mainWindow", this);

        //设为活动窗口
        this.activate();



        //绑定resize事件
        var self = this;
        window.addEventListener("resize", function (event) {

            self.update();

        }, true);
    };




    //父dom节点
    flyingon.defineProperty(this, "parentNode",

        function () {

            return this.dom_host.parentNode;
        },

        function (value) {

            if (value)
            {
                value.appendChild(this.dom_host);
            }
        });




    //刷新窗口
    this.update = function () {

        var r = this.__fn_getBoundingClientRect__(true);
        this.__fn_resize__(0, 0, r.width, r.height);
    };


}, true);





﻿
//窗口标题栏按钮
flyingon.defineClass("WindowToolButton", flyingon.Control, function (Class, base, flyingon) {


    //修改默认值为充满
    this.defaultValue("width", "fill");

    //修改默认值为充满
    this.defaultValue("height", "fill");

    //图片
    this.defineProperty("image", null);


    //绘制图像
    this.paint = function (context, boxModel) {

        var image = this.__fn_state_image__(this.image);

        if (image)
        {
            var r = boxModel.clientRect;
            context.paint_image(image, r.windowX, r.windowY, r.width, r.height, this.textAlign);
        }
    };


});



//窗口标题栏
flyingon.defineClass("WindowToolBar", flyingon.Panel, function (Class, base, flyingon) {


    Class.create = function (parent) {

        var fields = this.__fields__;

        fields.horizontalScroll = "never";
        fields.verticalScroll = "never";
        fields.width = "fill";
        fields.height = "fill";
        fields.dock = "top";

        this.__fn_initialize_button__();
        this.__parent__ = parent;
        this.__boxModel__.initialize_addtions(parent.__boxModel__);
    };


    this.__fn_initialize_button__ = function () {

        button.call(this, "window-icon", "left");
        button.call(this, "window-close", "right", close);
        button.call(this, "window-maximize", "right", close);
        button.call(this, "window-minimize", "right", close);
    };



    this.defaultValue("focusable", false);

    this.defaultValue("height", 25);

    this.defaultValue("layout", "dock");



    function close() {

        this.ownerWindow.close();
    };

    function button(image, dock, click) {

        var result = this[image] = new flyingon.WindowToolButton();

        result.image = image;
        result.dock = dock;

        if (click)
        {
            result.onclick = function (event) {

                click.call(this);
            };
        }

        this.__children__.add(result);
        return result;
    };


    var offsetX, offsetY;

    function translate(ownerWindow, left, top) {


        var mainWindow = ownerWindow.mainWindow,

            left = ownerWindow.left,
            top = ownerWindow.top,
            width = mainWindow.width,
            height = mainWindow.height;


        if (left < 0)
        {
            left = 0;
        }
        else if (left >= width)
        {
            left = width - 8;
        }

        if (top < 0)
        {
            top = 0;
        }
        else if (top > height)
        {
            top = height - 8;
        }

        return {

            left: left,
            top: top
        };
    };



    this.__event_mousedown__ = function (event) {

        var ownerWindow = this.ownerWindow,
            offset = translate(ownerWindow);

        offsetX = offset.left - event.clientX;
        offsetY = offset.top - event.clientY;

        ownerWindow.__capture_control__ = this; //捕获鼠标
    };

    this.__event_mousemove__ = function (event) {

        if (event.mousedown)
        {
            var ownerWindow = this.ownerWindow,
                style = ownerWindow.dom_window.style;

            ownerWindow.left = event.clientX + offsetX,
            ownerWindow.top = event.clientY + offsetY;

            var offset = translate(ownerWindow);
            style.left = offset.left + "px";
            style.top = offset.top + "px";
        }
    };

    this.__event_mouseup__ = function (event) {

        this.ownerWindow.__capture_control__ = null;
    };



    this.__fn_measure__ = function (boxModel, width) {

        var y = (this.visibility == "visible" && this.height) || 0;

        this.__boxModel__.measure(0, 0, width, y).compute();
        return y;
    };


});




//子窗口
flyingon.defineClass("ChildWindow", flyingon.WindowBase, function (Class, base, flyingon) {




    Class.create = function () {

        this.toolbar = new flyingon.WindowToolBar(this);
    };



    this.defineProperty("width", 640);

    this.defineProperty("height", 480);

    this.defineProperty("fill", false, "this.update();");

    //窗口起始位置 center:居中  manual:自定义
    this.defineProperty("startPosition", "center");




    this.__event_change__ = function (event) {

        switch (event.name)
        {
            case "left":
            case "top":
                this.dom_window.style[event.name] = event.value + "px";
                break;
        }
    };


    this.defineEvent("closing");

    this.defineEvent("closed");




    this.findAt = function (x, y) {

        //判断滚动条
        if (this.toolbar.hitTest(x, y))
        {
            return this.toolbar.findAt(x, y);
        }

        return base.findAt.call(this, x, y);
    };



    function show(parentWindow, showDialog) {


        if (!parentWindow)
        {
            throw new Error("parentWindow not allow null!");
        }

        var children = parentWindow.__windows__;
        if (!children)
        {
            throw new Error("parentWindow is not a flyingon.WindowBase object!");
        }


        children.push(this);

        flyingon.defineVariable(this, "parentWindow", parentWindow);


        var host = parentWindow.mainWindow.dom_host;

        if (showDialog) //如果是模式窗口则添加遮罩层
        {
            var mask = this.dom_mask = document.createElement("div");
            mask.setAttribute("flyingon", "mask");
            mask.setAttribute("style", "position:absolute;z-index:9990;width:100%;height:100%;overflow:hidden;-moz-user-select:none;-webkit-user-select:none;outline:none;cursor:default;background-color:silver;opacity:0.1;");
            host.appendChild(this.dom_mask);
        }

        host.appendChild(this.dom_window);

        this.activate(true);
        this.update(this.startPosition == "center");
    };

    this.show = function (parentWindow) {

        show.call(this, parentWindow, false);
    };

    this.showDialog = function (parentWindow) {

        show.call(this, parentWindow, true);
    };





    this.close = function () {

        var parentWindow = this.parentWindow;

        if (parentWindow)
        {
            var index = parentWindow.__windows__.indexOf(this);

            if (index >= 0 && this.dispatchEvent("closing"))
            {
                var host = ownerWindow.mainWindow.dom_host;

                host.removeChild(this.dom_window);
                if (this.dom_mask)
                {
                    host.removeChild(this.dom_mask);
                }

                parentWindow.__windows__.splice(index, 1);

                delete this.parentWindow;

                this.dispatchEvent("closed");

                parentWindow.activate(true);
            }
        }

        this.dispose();
    };



    //刷新窗口
    this.update = function (center) {


        var r = this.__fn_getBoundingClientRect__(this.fill),
            width = this.width,
            height = this.height,

            style = this.dom_window.style;


        if (center)
        {
            this.left = Math.round((r.width - width) / 2);
            this.top = Math.round((r.height - height) / 2);
        }


        style.left = this.left + "px";
        style.top = this.top + "px";
        style.width = width + "px";
        style.height = height + "px";


        var y = this.toolbar.__fn_measure__(this.__boxModel__, width);
        this.__fn_resize__(0, y, width, height);
    };



}, true);





﻿



﻿/// <reference path="../Base/Core.js" />
/// <reference path="Control.js" />


/*

*/
flyingon.defineClass("TextBoxBase", flyingon.Control, function (Class, base, flyingon) {




    this.defaultValue("width", 100);

    this.defaultValue("height", 21);

    this.defaultValue("multiline", false);



    flyingon["text-painter"].call(this, false);


});









﻿/// <reference path="../Base/Core.js" />
/// <reference path="Control.js" />


/*

*/
flyingon.defineClass("TextButtonBase", flyingon.TextBoxBase, function (Class, base, flyingon) {



    this.defineProperty("items", []);


    this.defineProperty("showButton", true, "measure");



    this.measure = function (boxModel) {


        boxModel.compute();


        var clientRect = boxModel.clientRect,
            imageRect = boxModel.imageRect;


        if (!imageRect)
        {
            imageRect = boxModel.imageRect = new flyingon.Rect();
        }

        imageRect.x = clientRect.x;
        imageRect.y = clientRect.y;


        if (this.showButton)
        {
            clientRect.width -= 16;

            imageRect.canvasX = clientRect.canvasX + clientRect.width;
            imageRect.canvasY = clientRect.canvasY;

            imageRect.width = 16;
            imageRect.height = clientRect.height;
        }
        else
        {
            imageRect.width = 0;
            imageRect.height = 0;
        }
    };



    //绘制内框
    this.paint = function (context, boxModel) {

        this.paint_text(context, boxModel.clientRect);
        this.paint_image(context, boxModel.imageRect);
    };

    this.paint_image = function (context, imageRect) {

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
flyingon.defineClass("TextBox", flyingon.Control, function (Class, base, flyingon) {







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
flyingon.defineClass("PictureBox", flyingon.Control, function (Class, base, flyingon) {




    //修改默认值为充满
    this.defaultValue("width", "fill");

    //修改默认值为充满
    this.defaultValue("height", "fill");


    //拉伸方式
    //none:     不拉伸
    //clip:     不拉伸,超出范围则剪切
    //zoom:     等比缩放至最大空间
    //stretch:  变比拉伸至充满空间
    this.defineProperty("stretch", "none");


    //图片
    this.defineProperty("image", null);



    //绘制内框
    this.paint = function (context, boxModel) {

        this.paint_image(context, boxModel.clientRect);
        this.paint_text(context, boxModel.clientRect);
    };


    //缓存方法
    this.__fn_get_image = flyingon.get_image;


    //绘制图像
    this.paint_image = function (context, clientRect) {

        var image = this.__fn_get_image(this.image);

        if (image)
        {
            context.paint_image(image, clientRect.windowX, clientRect.windowY, clientRect.width, clientRect.height, this.textAlign, this.stretch);
        }
    };


});



﻿



﻿/// <reference path="../Base/Core.js" />
/// <reference path="Control.js" />


/*

*/
flyingon.defineClass("ComboBox", flyingon.TextButtonBase, function (Class, base, flyingon) {



    this.defineProperty("items", []);



});





﻿/// <reference path="../Base/Core.js" />
/// <reference path="Control.js" />


/*

*/
flyingon.defineClass("Memo", flyingon.ScrollableControl, function (Class, base, flyingon) {



    this.defaultValue("width", 200);

    this.defaultValue("height", 40);

    this.defaultValue("multiline", true);



    this.defineProperty("textWrap", false, "measure");




    flyingon["text-painter"].call(this, true);




});





﻿/*

*/
flyingon.defineClass("Button", flyingon.Control, function (Class, base, flyingon) {



    this.defaultValue("width", 100);

    this.defaultValue("height", 21);


});





﻿/*

*/
flyingon.defineClass("TextBlock", flyingon.ScrollableControl, function (Class, base, flyingon) {



});









})(flyingon);