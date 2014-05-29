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


    //扩展字符串
    (function () {


        //增加字符串顺序格式化支持
        this.format = function () {

            return arguments.length === 0 ? this : this.replace(/\{\d+\}/g, function (key) {

                return arguments[key.substring(1, key.length - 1)] || "";
            });
        };


        //增加字符串名字格式化支持
        this.format_name = function (value) {

            return !value ? this : this.replace(/\{\w+\}/g, function (key) {

                return value[key.substring(1, key.length - 1)] || "";
            });
        };

        //增加字符串顺序格式化支持
        this.trim = function () {

            return arguments.length === 0 ? this : this.replace(/^\s+|\s+$/g, "");
        };


    }).call(String.prototype);



    //扩展数组
    (function () {


        //移除指定项
        this.remove = function (item) {

            var index = this.indexOf(item);
            if (index >= 0)
            {
                this.splice(index, 1);
            }
        };

        //移除指定索引
        this.removeAt = function (index) {

            this.splice(index, 1);
        };

        //清空
        this.clear = function () {

            if (this.length > 0)
            {
                this.splice(0, this.length);
            }
        };

        //二分法搜索
        this.binary_search = function (value, start, end) {

            var flag = typeof value !== "function";

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
        this.binary_between = function (value, start, end) {

            var flag = typeof value !== "function";

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


    }).call(Array.prototype);


    //给指定对象扩展指定名称的数组方法
    flyingon.array_extend = function (target, names) {

        var length, name;

        if (target && names && (length = names.length) > 0)
        {
            var prototype = Array.prototype;

            for (var i = 0; i < length; i++)
            {
                target[name = names[i]] = prototype[name];
            }
        }
    };



    var for_data = {};

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

    (function () {

        //循环执行指定函数
        this.for_execute = function (fn) {

            var result;

            for (var i = 0, _ = this.length; i < _; i++)
            {
                if ((result = fn(this[i], i)) !== undefined)
                {
                    return result;
                }
            }
        };

        //以apply的方式循环调用指定名称的方法
        this.for_apply = function (name, parameters) {

            var result,
                item,
                fn;

            for (var i = 0, _ = this.length; i < _; i++)
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
        this.for_has = function (name, value, parameters) {

            var item,
                fn;

            for (var i = 0, _ = this.length; i < _; i++)
            {
                if ((item = this[i]) && (fn = item[name]) && fn.apply(item, parameters) === value)
                {
                    return true;
                }
            }

            return false;
        };

        //循环检查指定属性是否具有指定值
        this.for_exist = function (name, value) {

            var item;

            for (var i = 0, _ = this.length; i < _; i++)
            {
                if ((item = this[i]) && (item[name] === value))
                {
                    return true;
                }
            }

            return false;
        };

        //循环获取指定属性值或给指定属性赋值
        this.for_value = function (name, value) {

            var item;

            if (value === undefined)
            {
                for (var i = 0, _ = this.length; i < _; i++)
                {
                    if ((item = this[i]) && (item = item[name]) !== undefined)
                    {
                        return item;
                    }
                }

                return undefined;
            }

            for (var i = 0, _ = this.length; i < _; i++)
            {
                if (item = this[i])
                {
                    item[name] = value;
                }
            }
        };

    }).call(for_data);




    Image.prototype.toDataUrl = function () {

        var canvas = document.createElement("canvas");

        canvas.width = this.width;
        canvas.height = this.height;
        canvas.getContext("2d").drawImage(this, 0, 0);

        return canvas.toDataURL("image/png");
    };



    //扩展函数
    (function () {


        //获取函数内容
        this.get_body = function () {

            var result = this.toString();
            return result.substring(result.indexOf("{") + 1, result.lastIndexOf("}"))
        };

        //获取函数参数
        this.get_parameters = function () {

            if (this.length > 0)
            {
                var result = this.toString();

                result = result.match(/\([^)]*\)/)[0];
                result = result.substring(1, result.length - 1).replace(/\s+/, "");;

                return result.split(",");
            }

            return [];
        };

        //复制函数生成新函数
        this.copy = function () {

            return new Function(this.get_parameters(), this.get_body());
        };

        //合并函数内容生成新函数
        this.merge = function (body, insertBefore, parameters) {

            if (body)
            {
                body = typeof body === "function" ? body.get_body() : "" + body;
                body = insertBefore ? body + this.get_body() : this.get_body() + body;

                return new Function(parameters || this.get_parameters(), body);
            }
        };

        //替换函数内容生成新函数
        this.replace = function (key, value, parameters) {

            if (key)
            {
                var body = this.get_body().replace(key, value);
                return new Function(parameters || this.get_parameters(), body);
            }
        };


        //扩展原型
        this.extend = function (fn, prototype) {

            if (prototype)
            {
                this.prototype = prototype;
            }
            else
            {
                prototype = this.prototype;
            }

            if (fn)
            {
                if (fn instanceof Function)
                {
                    fn.call(prototype, flyingon);
                }
                else
                {
                    for (var name in fn)
                    {
                        prototype[name] = fn[name];
                    }
                }
            }

            return this;
        };



    }).call(Function.prototype);


})(flyingon);




//通用函数区
(function (flyingon) {



    //代码性能测试
    flyingon.performance = function (code, times) {

        if (typeof code === "function")
        {
            code = code.get_body();
        }

        code = "var time, times = " + times + ", date = new Date();\n"
            + "for (i = 0; i < times; i++){}\n"
            + "time = new Date() - date;\n"
            + "date = new Date();\n"
            + "for (i = 0; i < times; i++)\n"
            + "{\n"
            + code
            + "}\n"
            + "return (new Date() - date) - time;"

        return new Function(code)();
    };


    //转换字符串为整数 支持"%"
    flyingon.parseInt = function (value, total) {

        if ((value = "" + value) && value[value.length - 1] === "%")
        {
            return Math.floor(parseFloat(value) * total / 100);
        }

        return parseInt(value);
    };

    //转换字符串为浮点数 支持"%"
    flyingon.parseFloat = function (value, total) {

        if ((value = "" + value) && value[value.length - 1] === "%")
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



    //导入javascript脚本
    flyingon.import = function (url, callback) {

        var dom = document.createElement('script'),
            head = document.getElementsByTagName("head")[0];

        dom.type = 'text/javascript';
        dom.src = url;
        dom.onload = dom.onreadystatechange = function () {

            if (!dom.readyState || dom.readyState == 'loaded' || dom.readyState == 'complete')
            {
                dom.onload = dom.onreadystatechange = null;

                if (callback)
                {
                    callback(dom);
                }

                head.removeChild(dom);
            }
        };

        head.appendChild(dom);
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
    //注: 使用些方式定义属性时,以chrome中如果访问带特殊字符的变量(如:this.__name)时性能很差
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


    //定义多个属性
    flyingon.defineProperties = function (target, names, getter, setter) {

        for (var i = 0, _ = names.length; i < _; i++)
        {
            flyingon.defineProperty(target, names[i], getter, setter);
        }
    };


})(flyingon);





//名字空间及类实现
(function (flyingon) {



    var namespace_list = { "flyingon": flyingon }, //缓存命名空间

        class_list = flyingon.__registry_class_list = {}, //已注册类型集合

        RootObject = flyingon.RootObject = function () { }, //根类

        self = this; //记下根对象



    //注册类型
    flyingon.registry_class = function (Class, fullTypeName) {

        class_list[fullTypeName || Class.__fullTypeName] = Class;
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
            if (result.constructor === String && !(result = namespace_list[result]))
            {
                result = self;

                var names = namespace.split("."),
                    name,
                    value;

                for (var i = 0, _ = names.length; i < _; i++)
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
    function initialize(namespace, type, typeName) {


        var prototype = type.prototype,
            fullTypeName = namespace.name ? namespace.name + "." + typeName : typeName;


        //绑定类型
        prototype.__class_type = type;

        //获取当前类型
        prototype.getType = function () {

            return type;
        };

        type.namesapce = prototype.__namespace = namespace;
        type.typeName = prototype.__typeName = typeName;
        type.fullTypeName = prototype.__fullTypeName = fullTypeName;


        //输出及注册类
        namespace[typeName] = class_list[fullTypeName] = type;


        prototype.toString = prototype.toLocaleString = function () {

            return "[object " + this.__fullTypeName + "]";
        };
    };



    //初始化根类
    initialize(flyingon, RootObject, "RootObject");




    //定义类方法
    //class_fn: 类型扩展函数 共有三个参数 Class:当前类型 base:父类 flyingon:系统对象 
    //constructor_merge: 是否合并构造函数 true:合并构造函数内容以提升性能 如果构造函数中有局部变量则不可设成true 默认为false
    flyingon.defineClass = namespace_fn.prototype.defineClass = function (typeName, superclass, class_fn, constructor_merge) {


        //处理参数
        if (!class_fn || typeof class_fn === "boolean")
        {
            class_fn = superclass;
            superclass = RootObject;
        }
        else if (!superclass) //没有指定基类
        {
            superclass = RootObject;
        }

        if (!typeName || typeof class_fn !== "function")
        {
            throw new Error(flyingon_setting.define_class_error.format(typeName));
        }


        //声明构造函数及父类构造函数
        var create, base_create = superclass.create;

        //定义类模板
        function fn() {

            if (create)
            {
                create.apply(this, arguments);
            }
        };



        //创建类原型
        var prototype = fn.prototype = Object.create(superclass.prototype);

        //父类
        fn.superclass = superclass;

        //父类原型
        fn.base = superclass.prototype;

        //子类集合
        (superclass.subtypes || (superclass.subtypes = [])).push(fn);

        //构造函数/所属类型
        prototype.constructor = fn;
        //默认值
        prototype.__defaults = fn.__defaults = Object.create(superclass.__defaults || null);

        //初始化类型系统
        initialize(this, fn, typeName);

        //扩展
        class_fn.call(prototype, fn, fn.base, flyingon);


        //处理构造函数(自动调用父类的构造函数)
        if (base_create)
        {
            var create_list = superclass.__create_list;

            if (create = fn.create)
            {
                //合并构造函数以提升性能 注:已有构造链时不可以合并
                if (!create_list && constructor_merge)
                {
                    fn.create = create.merge(base_create, true);
                }
                else //生成构造链
                {
                    create_list = fn.__create_list = create_list ? create_list.slice(0) : [base_create];
                    create_list.push(create);

                    fn.create = function () {

                        var list = fn.__create_list;
                        for (var i = 0, _ = list.length; i < _; i++)
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
                    fn.__create_list = create_list;
                }

                fn.create = base_create;
            }
        }

        create = fn.create;

        return fn;
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

            if (segment[0] === "<") //如果是标签
            {
                if (!(name = segment.match(/[\w\.\:_\-\u0370-\uffff]+/)))
                {
                    throw new Error("xml tag error!");
                }

                name = name[0];

                if (segment[1] !== "/") //开始标签
                {
                    if (type = segment.match(/type\s*=\s*[\"\']/))
                    {
                        var index = type.index + type[0].length,
                            type = segment.substring(index, segment.indexOf(segment[index - 1], index));
                    }
                    else if (length > i + 1) //未指定类型时有子项则为对象否则为字符串
                    {
                        var text = segments[i + 1];
                        type = text[0] === "<" && text[1] !== "/" ? "object" : "string";
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
                            if (nodes.length === 0)
                            {
                                return value;
                            }

                            node = nodes[nodes.length - 1];
                            break;
                    }

                    if (node.constructor === Array)
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

        this.host.id = "__submit_host_" + (++id);
        //this.host.style.display = "none";

        this.iframe.name = "__submit_iframe";
        this.iframe.src = "about:blank";

        this.form.name = "__submit_form";
        this.form.target = "__submit_iframe";

        this.host.appendChild(this.iframe);
        this.host.appendChild(this.form);

        document.documentElement.children[0].appendChild(this.host);

        this.iframe.contentWindow.name = "__submit_iframe"; //解决IE6在新窗口打开的BUG
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

        if (request.readyState === 4)
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

            if (data && typeof data === "object")
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

        this.__indexOf = target.indexOf;
        this.__push = target.push;
        this.__splice = target.splice;

    }).call(this, Array.prototype);



    //子项数
    this.length = 0;



    //获取指定项的索引
    this.indexOf = function indexOf(item) {

        if (item && typeof item === "object") //缓存索引以加快检索速度
        {
            var cache = this.__index_cache || (this.__index_cache = {}),
                id = item.__uniqueId || (item.__uniqueId = ++flyingon.__uniqueId);

            return cache[id] || (cache[id] = this.__indexOf(item));
        }

        return this.__indexOf(item);
    };

    //循环执行
    this.forEach = Array.prototype.forEach;


    //添加子项
    this.append = function (item) {

        var fn = this.__fn_validate;

        if (!fn || (item = fn.call(this, this.length, item)) !== undefined)
        {
            this.__push(item);
            return true;
        }
    };

    //添加多个子项
    this.appendRange = function (items) {

        if (items && items.length > 0)
        {
            var fn = this.__fn_validate;

            if (fn)
            {
                var item;

                for (var i = 0, _ = items.length; i < _; i++)
                {
                    if ((item = fn.call(this, this.length, items[i])) !== undefined)
                    {
                        this.__push(item);
                    }
                }
            }
            else
            {
                this.__push.apply(this, items);
            }
        }
    };

    //在指定位置插入子项
    this.insert = function (index, item) {

        if (index >= 0)
        {
            var fn = this.__fn_validate;

            if (!fn || (item = fn.call(this, index, item)) !== undefined)
            {
                this.__splice(index, 0, item);
                return true;
            }
        }
    };

    //在指定位置插入多个子项
    this.insertRange = function (index, items) {

        if (index >= 0 && items && items.length > 0)
        {
            var fn = this.__fn_validate,
                item;

            for (var i = 0, _ = items.length; i < _; i++)
            {
                if (!fn || (item = fn.call(this, index, item)) !== undefined)
                {
                    this.__splice(index++, 0, item);
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
                if ((fn = this.__fn_remove) && fn.call(this, index, cache) === false)
                {
                    return;
                }

                if (cache = cache.__uniqueId && this.__index_cache)
                {
                    delete this.__index_cache[cache];
                }
            }

            if (!(fn = this.__fn_validate) || (item = fn.call(this, index, item)) !== undefined)
            {
                this[index] = item;

                if (length <= index)
                {
                    this.length = index + 1;
                }

                this.__index_cache = null; //清空索引缓存
                return true;
            }
        }
    };

    //移除指定子项
    this.remove = function (item) {

        var index = this.indexOf(item),
            fn;

        if (index >= 0 && (!(fn = this.__fn_remove) || fn.call(this, index, item) !== false))
        {
            this.__splice(index, 1);

            if (item.__uniqueId && this.__index_cache)
            {
                delete this.__index_cache[item.__uniqueId];
            }

            return true;
        }
    };

    //移除指定位置的子项
    this.removeAt = function (index) {

        var fn, item;

        if (this.length > index && (!(fn = this.__fn_remove) || fn.call(this, index, item = this[index]) !== false))
        {
            this.__splice(index, 1);

            if (item.__uniqueId && this.__index_cache)
            {
                delete this.__index_cache[item.__uniqueId];
            }

            return true;
        }
    };

    //清除
    this.clear = function () {

        if (this.length > 0)
        {
            var fn = this.__fn_clear;

            if (!fn || fn.call(this) !== false)
            {
                this.__splice(0, this.length);
                this.__index_cache = null; //清空索引缓存

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



    var class_list = flyingon.__registry_class_list;




    this.deserialize = function (data, context) {

        if (data)
        {
            if (data.constructor === String)
            {
                data = data[0] === "<" ? flyingon.parseXml : this.parse(data);
            }

            var result = this[data.constructor === Array ? "array" : "object"](null, null, data);

            this.__fn_complete(this, context || result);
            return result;
        }

        return null;
    };


    //序列化完毕后执行方法(内部方法)
    this.__fn_complete = function (reader, context) {

        //缓存的资源
        var references = reader.references,
            items = reader.__bindings,
            binding,
            source;

        if (items)
        {
            for (var i = 0, _ = items.length; i < _; i++)
            {
                var item = items[i],
                    bindings = item[1];

                for (var name in bindings)
                {
                    if (binding = bindings[name])
                    {
                        if (binding.constructor === String)
                        {
                            binding = new flyingon.DataBinding(context, binding);
                        }
                        else
                        {
                            if (source = binding.source)
                            {
                                if (source.constructor === String)
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

                        binding.__fn_initialize(item[0], name);
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
                return this[value.constructor === Array ? "array" : "object"](null, null, value);

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

        for (var i = 0, _ = keys.length; i < _; i++)
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

            for (var i = 0, _ = value.length; i < _; i++)
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

            if (fn !== String)
            {
                value = this[fn === Array ? "array" : "object"](target, name, value);
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
            this.__bindings || (this.__bindings = []).push([target, data]);
        }
    };

});





flyingon.defineClass("XmlSerializeReader", flyingon.SerializeReader, function (Class, base, flyingon) {


    this.parse = flyingon.parseXml;

});





﻿
flyingon.defineClass("SerializeWriter", function (Class, base, flyingon) {



    this.__root = null;

    this.__push = Array.prototype.push;

    this.length = 0;



    this.serialize = function (target) {

        this[target.constructor === Array ? "array" : "object"](this.__root, target);
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
            this.__push(",");
        }

        this.__push("\"" + name + "\":");
    };




    this.null = function (name) {


        if (name)
        {
            key(name);
        }

        this.__push("null");
    };

    this.boolean = function (name, value) {

        if (value !== undefined)
        {
            if (name)
            {
                key(name);
            }

            this.__push(!!value);
        }
    };

    this.number = function (name, value) {

        if (value !== undefined)
        {
            if (name)
            {
                key(name);
            }

            this.__push(value || 0);
        }
    };

    this.string = function (name, value) {

        if (value !== undefined)
        {
            if (name)
            {
                key(name);
            }

            this.__push(value != null ? "\"" + value.replace(/\"/g, "\\\"") + "\"" : "null");
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
                    this.__push("\"" + value.serializeTo() + "\"");
                }
                else
                {
                    this.__push("{");

                    if (name = value.__fullTypeName)
                    {
                        this.__push("\"type\":\"" + name + "\"");
                    }

                    if ("serialize" in value)
                    {
                        value.serialize(this);
                    }
                    else
                    {
                        this.properties(value);
                    }

                    this.__push("}");
                }
            }
            else
            {
                this.__push("null");
            }
        }
    };

    this.properties = function (value, keys) {

        var key = this[this.length - 1] !== "{";

        keys = keys || Object.keys(value);

        for (var i = 0, _ = keys.length; i < _; i++)
        {
            if (i > 0 || key)
            {
                this.__push(",");
            }

            this.__push("\"" + (key = keys[i]) + "\":");
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
                this.__push("[");

                for (var i = 0, _ = value.length; i < _; i++)
                {
                    if (i > 0)
                    {
                        this.__push(",");
                    }

                    this.value(null, value[i]);
                }

                this.__push("]");
            }
            else
            {
                this.__push("null");
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
                    value = value.name = "__name_" + (++flyingon.__auto_name);
                }

                this.string(name, value);
            }
        }
    };


    this.bindings = function (target) {

        if (target && (target = target.__bindings) && (target = target.pull))
        {
            this.object("bindings", target);
        }
    };


    this.toString = this.toLocaleString = function () {

        return this.join("");
    };

});




flyingon.defineClass("XmlSerializeWriter", flyingon.SerializeWriter, function (Class, base, flyingon) {


    this.__root = "xml";


    this.null = function (name) {

        this.__push("<" + name + " type=\"null\"/>");
    };

    this.boolean = function (name, value) {

        if (value !== undefined)
        {
            this.__push("<" + name + " type=\"boolean\">" + (value ? "1" : "0") + "</" + name + ">");
        }
    };

    this.number = function (name, value) {

        if (value !== undefined)
        {
            this.__push("<" + name + " type=\"number\">" + (value || 0) + "</" + name + ">");
        }
    };

    this.string = function (name, value) {

        if (value !== undefined)
        {
            if (value != null)
            {
                value.indexOf("&") >= 0 && (value = flyingon.decodeXml(value));
                this.__push("<" + name + " type=\"string\">" + value + "</" + name + ">");
            }
            else
            {
                this.__push("<" + name + " type=\"null\"/>");
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
            this.__push("<" + name + " type=\"" + (value.__fullTypeName || "object") + "\">");

            if ("serialize" in value)
            {
                value.serialize(this);
            }
            else
            {
                this.properties(value);
            }

            this.__push("</" + name + ">");
        }
        else
        {
            this.__push("<" + name + " type=\"null\"/>");
        }
    };

    this.properties = function (value, keys) {

        var key;

        keys = keys || Object.keys(value);

        for (var i = 0, _ = keys.length; i < _; i++)
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
            this.__push("<" + name + " type=\"array\"");

            for (var i = 0, _ = value.length; i < _; i++)
            {
                this.value("item", value[i]);
            }

            this.__push("</" + name + ">");
        }
        else
        {
            this.__push("<" + name + " type=\"null\"/>");
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

        for (var i = 0, _ = values.length; i < _; i++)
        {
            switch (value = values[i])
            {
                case "'":
                case "\"":
                    if (!escape)
                    {
                        quote ? (quote === value && (quote = null)) : (quote = value);
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
                    if (value[0] === "@" && !quote)
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


        for (var i = 0, _ = parameters.length; i < _; i++)
        {
            body += "var " + (value = parameters[i]) + " = this[\"" + value + "\"];\n";
        }


        body += values.join("");
        return new Function(body);
    };


    prototype.__expression = "";



    //表达式内容
    flyingon.defineProperty(prototype, "expression",

        function () {

            return this.__expression;
        },

        function (value) {

            this.__expression = "" + value;
            this.parameters = [];
            this.__function = parse(this.__expression, this.parameters);
        });


    //计算
    prototype.eval = function (thisArg) {

        var fn = this.__function;

        if (fn)
        {
            return fn.call(thisArg);
        }
    };



    prototype.serialize = function (writer) {

        writer.string("expression", this.__expression);
    };

    prototype.deserialize = function (reader, data, excludes) {

        reader.string(this, "__expression", data.expression);
    };





})(flyingon);



﻿/// <reference path="Core.js" />
/// <reference path="SerializableObject.js" />


(function (flyingon) {




    //正向绑定(绑定数据源至目标控件)
    flyingon.bindingTo = function (source, name) {

        var bindings = source.__bindings,
            binding;

        if (bindings && (bindings = bindings.push) && (binding = bindings[name]))
        {
            var keys = Object.keys(binding),
                length = keys.length;

            if (length === 0)
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


    function clearBindings(fields, dispose) {

        var keys = Object.keys(fields),
            key,
            bindings;

        for (var i = 0, _ = keys.length; i < _; i++)
        {
            if ((key = keys[i]) && (bindings = source[key]))
            {
                var keys2 = Object.keys(bindings);

                for (var j = 0, __ = keys2.length; j < __; j++)
                {
                    bindings[keys2[j]].clear(dispose);
                }
            }
        }
    };

    flyingon.clearBindings = function (source, dispose) {

        if (source && (source = source.__bindings))
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



    flyingon.DataBinding = (function (source, expression, setter) {

        if (source)
        {
            if (!expression && (expression = source.expression))
            {
                setter = source.setter;
                source = source.source;
            }

            this.__source = source;
            this.__expression = expression;
            this.__setter = setter;
        }

    }).extend(function () {


        var self = this,

            defineProperty = function (name) {

                flyingon.defineProperty(self, name, function () {

                    return this["__" + name];
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
        this.__binding = false;

        //获取值函数
        this.__fn_getter = null;

        //设置值函数
        this.__fn_setter = null;



        //初始化绑定关系
        this.__fn_initialize = function (target, name) {

            var source = this.__source,
                expression = this.__expression,
                bindings = target.__bindings || (target.__bindings = {}),
                id = target.id || (target.id = flyingon.newId()),
                cache;


            this.__target = target;
            this.__name = name;


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



            bindings = source.__bindings || (source.__bindings = { push: {} });
            bindings = bindings.push || (bindings.push = {});

            //如果表达式以数据开头或包含字母数字下划线外的字符则作表达式处理
            if (expression.match(/^\d|[^\w]/))
            {
                cache = (this.__fn_getter = new flyingon.Expression(expression)).parameters;

                for (var i = 0; i < length; i++)
                {
                    expression = cache[i];
                    (bindings[expression] || (bindings[expression] = {}))[id] = this;
                }
            }
            else
            {
                this.__fn_getter = null;
                (bindings[expression] || (bindings[expression] = {}))[id] = this;
            }


            //处理更新
            if (cache = this.__setter)
            {
                this.__fn_setter = new flyingon.Expression(cache);
            }
        };



        //从数据源同步数据至目标属性
        this.pull = function () {

            var source = this.__source,
                result;

            if (result = this.__fn_getter)
            {
                result = result.eval(source);
            }
            else
            {
                var name = this.__expression;
                if ((result = source[name]) === undefined && source instanceof flyingon.DataObject)
                {
                    result = source.value(name);
                }
            }

            this.__binding = true;
            this.__target[this.__name] = result;
            this.__binding = false;
        };


        //从目标属性同步数据至源
        this.push = function () {

            var cache = this.__expression;

            if (cache)
            {
                this.__binding = true;

                if (!this.__fn_getter) //直接绑定字段
                {
                    var target = this.__target,
                        name = this.__name;

                    if ((result = target[name]) === undefined && target instanceof flyingon.DataObject)
                    {
                        result = target.value(name);
                    }

                    this.__source[cache] = result;
                }
                else if (cache = this.__fn_setter) //表达式需要自定义setter方法
                {
                    cache.call(this.__target);
                }

                this.__binding = false;
            }
        };


        //清除绑定关系
        this.clear = function (dispose) {

            var source = this.__source,
                target = this.__target,
                bindings,
                cache;

            if (source && target && (bindings = source.__bindings_source))
            {
                if (cache = this.__getter)
                {
                    var parameters = cache.parameters;

                    for (var i = 0, _ = parameters.length; i < _; i++)
                    {
                        if (cache = bindings[parameters[i]])
                        {
                            delete cache[target.id];
                        }
                    }
                }
                else if ((cache = this.__expression) && (cache = bindings[cache]))
                {
                    delete cache[target.id];
                }


                delete target.__bindings[this.__name];
            }


            if (dispose)
            {
                delete this.__source;
                delete this.__target;
                delete this.__fn_getter;
                delete this.__fn_setter;
            }
        };


        this.serialize = function (writer) {

            writer.reference("source", this.__source);
            writer.string("expression", this.__expression);
            writer.string("setter", this.__setter);
        };

        this.deserialize = function (reader, data, excludes) {

            reader.reference(this, "__source", data.source);
            reader.string(this, "__expression", data.expression);
            reader.string(this, "__setter", data.setter);
        };


    });



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


    var target = this;


    function defineProperty(name) {

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


    defineProperty = null;
    



    function canvas_to_window() {

        var event = this.originalEvent;

        if (!event.windowX)
        {
            var offset = this.target.canvas_to_window(event.canvasX, event.canvasY);

            event.windowX = offset.x;
            event.windowY = offset.y;
        }

        return event;
    };


    function canvas_to_control() {

        var event = this.originalEvent;

        if (!event.controlX)
        {
            var offset = this.target.canvas_to_control(event.canvasX, event.canvasY);

            event.controlX = offset.x;
            event.controlY = offset.y;
        }

        return event;
    };



    //x画布坐标
    flyingon.defineProperty(this, "canvasX", function () {

        return this.originalEvent.canvasX;
    });

    //y画布坐标
    flyingon.defineProperty(this, "canvasY", function () {

        return this.originalEvent.canvasY;
    });


    //x窗口坐标
    flyingon.defineProperty(this, "windowX", function () {

        return this.originalEvent.windowX || canvas_to_window.call(this).windowX;
    });

    //y窗口坐标
    flyingon.defineProperty(this, "windowY", function () {

        return this.originalEvent.windowY || canvas_to_window.call(this).windowY;
    });

    //x控件坐标
    flyingon.defineProperty(this, "controlX", function () {

        return this.originalEvent.controlX || canvas_to_control.call(this).controlX;
    });

    //y控件坐标
    flyingon.defineProperty(this, "controlY", function () {

        return this.originalEvent.controlY || canvas_to_control.call(this).controlY;
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
            + "\n"

            + "fields." + name + " = value;\n"

            + "if (cache = this.__bindings)\n"
            + "{\n"
            + "this.__fn_bindings(\"" + name + "\", cache);\n"
            + "}\n"

            + (attributes.complete || "")
            + "\n"

            + "return this;\n"

            + "}\n";
    };

    this.__define_change = function (name) {

        return "if ((cache = this.__events) && (cache = cache['change']) && cache.length > 0)\n"
            + "{\n"
                + "var event = new flyingon.PropertyChangeEvent(this, \"" + name + "\", value, oldValue);\n"
                + "if (this.dispatchEvent(event) === false)\n"
                + "{\n"
                    + "return this;\n"
                + "}\n"
                + "value = event.value;\n"
            + "}\n";
    };

    this.__define_setter = function (name, attributes) {

        var body = [];

        body.push("var fields = this.__fields, cache;\n");

        body.push(this.__define_initializing(name, attributes));

        body.push("var oldValue = fields." + name + ";\n");

        if (attributes.changing) //自定义值变更代码
        {
            body.push(attributes.changing);
            body.push("\n");
        }

        body.push("if (oldValue !== value)\n");
        body.push("{\n");

        body.push(this.__define_change(name));

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


        body.push("if (cache = this.__bindings)\n");
        body.push("{\n");
        body.push("this.__fn_bindings(\"" + name + "\", cache);\n");
        body.push("}\n");


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

        body.push("return this;\n");


        return new Function("value", body.join(""));
    };



    function split_attributes(attributes, value) {

        var values = value.split("|");

        for (var i = 0, _ = values.length; i < _; i++)
        {
            attributes[values[i]] = true;
        }

        return attributes;
    };


    //定义属性及set_XXX方法
    this.defineProperty = function (name, defaultValue, attributes) {

        if (typeof defaultValue === "function" && (attributes == null || typeof attributes === "function"))
        {
            flyingon.defineProperty(this, name, defaultValue, attributes);
        }
        else
        {
            if (defaultValue !== undefined)
            {
                this.__defaults[name] = defaultValue;
            }

            if (attributes)
            {
                if (attributes.constructor === String)
                {
                    attributes = split_attributes({}, attributes);
                }
                else if (attributes.attributes)
                {
                    split_attributes(attributes, attributes.attributes);
                    delete attributes.attributes;
                }
            }
            else
            {
                attributes = {};
            }

            var getter = attributes.getter || this.__define_getter(name, attributes),
                setter = !attributes.readOnly ? (attributes.setter || this.__define_setter(name, attributes)) : null;

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

            var events = (this.__events || (this.__events = {}))[name];

            events ? (events.length > 0 && (events.length = 0)) : (events = this.__events[name] = []);
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
            var events = (this.__events || (this.__events = {}));
            (events[type] || (events[type] = [])).push(fn);
        }

        return this;
    };

    //移除事件处理
    this.removeEventListener = function (type, fn) {

        var events = this.__events;

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
            //处理默认事件 默认事件方法规定: "__event_" + type
            if ((events = target["__event_" + type]))
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
            if ((events = target.__events) && (events = events[type]) && (length = events.length) > 0)
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

            target = target.__parent;
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

        var events = this.__events;

        if (events && (events = events[type]) && events.length > 0)
        {
            return true;
        }

        return bubbleEvent ? parent.hasEvent(type, true) : false;
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
    var element_node = flyingon.__element_node = (function (nodes, token, name) {

        var last;

        if (nodes.type !== "," || nodes.length === 0) //非组合直接添加到当前节点集合
        {
            this.type = nodes.type || " ";
            nodes.push(this);
        }
        else if ((last = nodes[nodes.length - 1]) instanceof element_nodes)
        {
            last.push(this);
        }
        else
        {
            nodes.pop();
            (nodes.forks || (nodes.forks = [])).push(nodes.length); //记录分支位置
            nodes.push(new element_nodes(last, this));
        }

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

        nodes.type = null;

    }).extend(function () {

        //所属组合类型
        this.type = null;

        //token标记
        this.token = null;

        //节点名称
        this.name = null;

        //伪元素名称(仅伪元素有效)
        this.pseudo = null;

        //节点参数(仅伪元素有效)
        this.parameters = null;

        //子项数
        this.length = 0;


        this.push = function (item) {

            this[this.length++] = item;
        };

        this.toString = this.toLocaleString = function () {

            var result = [];

            if (this.type)
            {
                result.push(this.type);
            }

            result.push(this.token);
            result.push(this.name);

            //参数
            if (this.parameters)
            {
                result.push("(" + this.parameters.join(",") + ")");
            }

            //属性
            result.push(Array.prototype.join(""));

            return result.join("");
        };


    });



    //元素节点集合 不同类型的节点组合成一个集合
    var element_nodes = flyingon.__element_nodes = (function (first, second) {

        second.type = first.type;

        this[0] = first;
        this[1] = second;

    }).extend(function () {

        //元素类型
        this.type = ",";

        //子项数
        this.length = 2;


        this.push = function (item) {

            item.type = this[0].type;
            this[this.length++] = item;
        };

        this.toString = this.toLocaleString = function () {

            return Array.prototype.join(",");
        };

    });




    //元素属性 
    var element_property = flyingon.__element_property = (function (name) {

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

    }).extend(function () {

        //标识
        this.token = "[]";

        //名称
        this.name = null;

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
                    return value && ("" + value).indexOf(this.value) === 0 ? target : false;

                case "$=": // $= 属性值以XX结尾 (由属性解析)
                    return value && (value = "" + value).lastIndexOf(this.value) === value.length - this.value.length ? target : false;

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

    });



    //元素属性集合
    var element_properties = flyingon.__element_properties = (function (first) {

        this[0] = first;

    }).extend(function () {

        //标识
        this.token = "[][]";

        //子项数
        this.length = 1;


        this.push = function (item) {

            this[this.length++] = item;
        };

        //条件检测 通过返回目标对象 否则返回false
        this.check = function (target) {

            for (var i = 0, _ = this.length; i < _; i++)
            {
                if (this[i].check(target) === false)
                {
                    return false;
                }
            }

            return target;
        };

        this.toString = this.toLocaleString = function () {

            return "[" + Array.prototype.join(",") + "]";
        };

    });




    function state_check(target) {

        return target.states && target.states[this.name] ? target : false;
    };

    var pseudo_check = {

        active: state_check,
        hover: state_check,
        focus: state_check,
        disabled: state_check,
        checked: state_check,
        selection: state_check,

        enabled: function (target) {

            return !target.states || !target.states.disabled ? target : false
        },

        empty: function (target) {

            return !target.__children || target.__children.length === 0 ? target : false;
        }
    };

    //元素伪类(不含伪元素)
    var element_pseudo = flyingon.__element_pseudo = (function (name) {

        this.check = pseudo_check[this.name = name];

    }).extend(function () {

        //标识
        this.token = ":";

        //当前名称
        this.name = null;

        //条件检测 通过返回目标对象 否则返回false
        this.check = null;


        this.toString = this.toLocaleString = function () {

            return ":" + this.name;
        };

    });






    var split_regex = /"[^"]*"|'[^']*'|[\w-@%&]+|[.#* ,>+:=~|^$()\[\]]/g; //选择器拆分正则表达式


    //[name?=value]属性选择器
    function parse_property(values, length, index) {

        var properties,
            property,
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
                    if (properties == null)
                    {
                        properties = new element_properties(property);
                    }

                    end = false;
                    break;

                case "*": // *= 包含属性值XX (由属性解析)
                case "^": // ^= 属性值以XX开头 (由属性解析)
                case "$": // $= 属性值以XX结尾 (由属性解析)
                case "~": // ~= 匹配以空格分隔的其中一段值 如匹配en US中的en (由属性解析)
                case "|": // |= 匹配以-分隔的其中一段值 如匹配en-US中的en (由属性解析)
                    property.operator += token;
                    break;

                case "=":
                    property.operator += "=";
                    end = true;
                    break;

                case " ":
                    break;

                default:
                    if (property && end)
                    {
                        switch (token[0])
                        {
                            case "\"":
                            case "'":
                                token = token.substring(1, token.length - 1);
                                break;
                        }

                        property.value = token;
                    }
                    else
                    {
                        property = new element_property(token);

                        if (properties)
                        {
                            properties.push(property);
                        }
                    }
                    break;
            }
        }

        return {

            result: properties || property,
            count: count
        };
    };



    //预解析 按从左至右的顺序解析
    flyingon.parse_selector = function (selector) {

        var nodes = [], //节点数组
            node,       //当前节点

            tokens = selector.match(split_regex), //标记集合
            token,      //当前标记

            i = 0,
            length = tokens.length,

            cache;

        //设置默认类型
        nodes.type = " ";

        while (i < length)
        {
            //switch代码在chrome下的效率没有IE9好,不知道什么原因,有可能是其操作非合法变量名的时候性能太差
            switch (token = tokens[i++])
            {
                case "#":  //id选择器标记
                case ".":  //class选择器标记
                    node = new element_node(nodes, token, tokens[i++]);
                    break;

                case "*":  //全部元素选择器标记
                    node = new element_node(nodes, "*", "");
                    break;

                case " ":  //后代选择器标记 不处理 注: "> "应解析为">"
                    break;

                case ">":  //子元素选择器标记
                case "+":  //毗邻元素选择器标记
                case "~":  //之后同级元素选择器标记
                case ",":  //组合选择器标记
                    nodes.type = token;
                    continue;

                case "[": //属性 [name[?=value]] | [name[?=value]][, [name[?=value]]...] 必须属性某一节点
                    cache = parse_property(tokens, length, i);
                    i += cache.count;

                    if (cache = cache.result)
                    {
                        (node || (new element_node(type, "*", ""))).push(cache);  //未指定节点则默认添加*节点
                    }
                    break;

                case ":": //伪类 :name | :name(p1[,p2...])  必须属于某一节点 
                    if (token = tokens[i++])
                    {
                        if (token in pseudo_check) //伪类解析为节点项
                        {
                            (node || new element_node(nodes, "*", "")).push(new element_pseudo(token));  //未指定节点则默认添加*节点
                        }
                        else //伪属性解析为*节点 类型为伪类类型 参数放至parameters数组中
                        {
                            node = new element_node(nodes, ":", token);

                            //处理参数
                            if (i < length && tokens[i] === "(")
                            {
                                node.parameters = [];

                                while ((token = tokens[++i]) !== ")")
                                {
                                    switch (token)
                                    {
                                        case " ":
                                        case ",":
                                            break;

                                        default:
                                            node.parameters.push(token);
                                            break;
                                    }
                                }

                                i++;
                            }
                        }
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
                    node = new element_node(nodes, "", token);
                    break;
            }
        }

        return nodes;
    };



})(flyingon);








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
                if (width.length > 1 && width[width.length - 1] === "%")
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
                if (height.length > 1 && height[height.length - 1] === "%")
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

        for (var i = 0, _ = items.length; i < _; i++)
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

        for (var i = 0, _ = names.length; i < _; i++)
        {
            if (result = image_list[names[i]])
            {
                return result;
            }
        }

        return image_blank;
    };


})(flyingon);






﻿
//坐标点
flyingon.Point = (function (x, y) {

    this.x = x || 0;
    this.y = y || 0;

}).extend(function () {


    this.toString = this.toLocaleString = function () {

        return "{ x:" + this.x + ", y:" + this.y + " }";
    };

});

//空坐标
flyingon.Point.empty = new flyingon.Point();



//大小
flyingon.Size = (function (width, height) {

    this.width = width || 0;
    this.height = height || 0;

}).extend(function () {


    this.toString = this.toLocaleString = function () {

        return "{ width:" + this.width + ", height:" + this.height + " }";
    };

});

//空大小
flyingon.Size.empty = new flyingon.Size();




//矩形范围
flyingon.Rect = (function (x, y, width, height) {

    if (arguments.length > 0)
    {
        this.x = x || 0;
        this.y = y || 0;
        this.width = width || 0;
        this.height = height || 0;
    }

}).extend(function () {


    this.x = 0;

    this.y = 0;

    this.width = 0;

    this.height = 0;



    flyingon.defineProperty(this, "right", function () {

        return this.x + this.width;
    });

    flyingon.defineProperty(this, "bottom", function () {

        return this.y + this.height;
    });



    this.copy = function (width_delta, height_delta) {

        return new flyingon.Rect(this.x, this.y, this.width + (width_delta || 0), this.height + (height_delta || 0));
    };

    this.toString = this.toLocaleString = function () {

        return "{ x:" + this.x + ", y:" + this.y + ", width:" + this.width + ", height:" + this.height + " }";
    };

});

//空矩形
flyingon.Rect.empty = new flyingon.Rect();




//2D仿射变换矩阵
//scale_x	水平旋转绘图
//skew_x	水平倾斜绘图
//skew_y	垂直倾斜绘图
//scale_y	垂直缩放绘图
//move_x	水平移动绘图
//move_y	垂直移动绘图
flyingon.Matrix = (function (scale_x, skew_x, skew_y, scale_y, move_x, move_y) {

    this.scale_x = scale_x || 1;

    this.skew_x = skew_x || 0;

    this.skew_y = skew_y || 0;

    this.scale_y = scale_y || 1;

    this.move_x = move_x || 0;

    this.move_y = move_y || 0;

}).extend(function () {


    this.fromArray = function (values) {

        this.scale_x = values[0];
        this.skew_x = values[1];
        this.skew_y = values[2];
        this.scale_y = values[3];
        this.move_x = values[4];
        this.move_y = values[5];

        return this;
    };

    this.toArray = function () {

        return [this.scale_x, this.skew_x, this.skew_y, this.scale_y, this.move_x, this.move_y];
    };

    this.translate = function (x, y) {

        this.append(1, 0, 0, 1, x, y);
        return this;
    };

    this.scale = function (scaleX, scaleY) {

        this.append(scaleX, 0, 0, scaleY, 0, 0);
        return this;
    };

    this.rotate = function (angle) {

        var cos = Math.cos(angle *= Math.PI / 180),
            sin = Math.sin(angle);

        this.append(-sin, cos, cos, sin, 0, 0);
        return this;
    };

    this.skew = function (skewX, skewY) {

        var x = Math.Tan(skewX * n),
            y = Math.Tan(skewY * n);

        this.append(1, x, y, 1, 0, 0);
        return this;
    };

    this.append = function (scale_x, skew_x, skew_y, scale_y, move_x, move_y) {

        var scale_x1 = this.scale_x,
            skew_x1 = this.skew_x,
            skew_y1 = this.skew_y,
            scale_y1 = this.scale_y;

        this.scale_x = scale_x * scale_x1 + skew_x * skew_y1;
        this.skew_x = scale_x * skew_x1 + skew_x * scale_y1;
        this.skew_y = skew_y * scale_x1 + scale_y * skew_y1;
        this.scale_y = skew_y * skew_x1 + scale_y * scale_y1;
        this.move_x = move_x * scale_x1 + move_y * skew_y1 + this.move_x;
        this.move_y = move_x * skew_x1 + move_y * scale_y1 + this.move_y;

        return this;
    };


    this.transform = function (x, y) {

        return {

            x: Math.round(x * this.scale_x + y * this.skew_x + this.move_x, 0),
            y: Math.round(x * this.skew_y + y * this.scale_y + this.move_y, 0)
        };
    };

    this.reverse = function (x, y) {

        return {

            x: Math.round((this.skew_x * y - this.scale_y * x + this.scale_y * this.move_x - this.skew_x * this.move_y) / (this.skew_y * this.skew_x - this.scale_x * this.scale_y)),
            y: Math.round((this.skew_y * x - this.scale_x * y - this.skew_y * this.move_x + this.scale_x * this.move_y) / (this.skew_y * this.scale_x - this.scale_x * this.scale_y))
        };
    };


});





﻿/// <reference path="../../../js/flyingon.js" />



(function (flyingon) {


    var layouts = {},
        layout_unkown = null;;


    //注册自定义布局 
    //注1. 遵守回调函数规范(items, spaceX, spaceY)
    //注2. 按需内容区宽高 contentWidth, contentHeight
    var registry = flyingon.registry_layout = function (name, arrange_fn) {

        layouts[name] = arrange_fn;
    };


    flyingon.execute_layout = function (layout_type, items, spaceX, spaceY) {

        if (spaceX == null)
        {
            spaceX = this.spaceX || 0;
            if (spaceX.constructor !== Number)
            {
                spaceX = flyingon.parseInt(spaceX, this.clientWidth);
            }
        }

        if (spaceY == null)
        {
            spaceY = this.spaceY || 0;

            if (spaceY.constructor !== Number)
            {
                spaceY = flyingon.parseInt(spaceY, this.clientHeight);
            }
        }

        (layouts[layout_type] || layout_unkown).call(this, items, spaceX, spaceY);
    };



    //线性布局
    (function (flyingon) {


        function fn1(items, spaceX, spaceY) {

            var x = 0,
                clientWidth = this.clientWidth,
                clientHeight = this.clientHeight,
                contentHeight = 0;

            for (var i = 0, _ = items.length; i < _; i++)
            {
                var item = items[i];

                if (item.__visible = (item.__style.visibility !== "collapsed"))
                {
                    if (x > 0)
                    {
                        x += spaceX;
                    }

                    item.__fn_measure(clientWidth - x, clientHeight, false, true);
                    item.__fn_position(x, 0, null, clientHeight);

                    x += item.columnWidth;

                    if (item.rowHeight > contentHeight)
                    {
                        contentHeight = item.rowHeight;
                    }
                }
            }

            this.contentWidth = x;
            this.contentHeight = contentHeight;
        };

        function fn2(items, spaceX, spaceY) {

            var y = 0,
                clientWidth = this.clientWidth,
                clientHeight = this.clientHeight,
                contentWidth = 0;

            for (var i = 0, _ = items.length; i < _; i++)
            {
                var item = items[i];

                if (item.__visible = (item.__style.visibility !== "collapsed"))
                {
                    if (y > 0)
                    {
                        y += spaceY;
                    }

                    item.__fn_measure(clientWidth, clientHeight - y, false, true);
                    item.__fn_position(0, y, clientWidth);

                    x += item.rowHeight;

                    if (item.columnWidth > contentWidth)
                    {
                        contentWidth = item.columnWidth;
                    }
                }
            }

            this.contentWidth = contentWidth;
            this.contentHeight = y;
        };


        registry("line", function (items, spaceX, spaceY) {

            (this.vertical ? fn2 : fn1).call(this, items, spaceX, spaceY);
        });


    })(flyingon);



    //流式布局
    (function (flyingon) {


        function fn1(items, spaceX, spaceY) {

            var x = 0,
                y = 0,
                clientWidth = this.clientWidth,
                maxHeight = this.clientHeight,
                rowHeight = this.rowHeight,
                contentWidth = 0,
                contentHeight = 0,
                cache;

            for (var i = 0, _ = items.length; i < _; i++)
            {
                var item = items[i];

                if (item.__visible = (item.__style.visibility !== "collapsed"))
                {
                    if (x > 0)
                    {
                        if (item.newline) //强制在新行显示
                        {
                            x = 0;
                            y = y > 0 ? contentHeight + spaceY : contentHeight;
                        }
                        else
                        {
                            x += spaceX;
                        }
                    }

                    item.__fn_measure(clientWidth - x, rowHeight, false, true);

                    if (x > 0 && (x += item.columnWidth) > clientWidth) //超行
                    {
                        x = 0;
                        y = y > 0 ? contentHeight + spaceY : contentHeight;
                    }

                    item.__fn_position(x, y, null, rowHeight);

                    if ((cache = x + item.columnWidth) > contentWidth)
                    {
                        contentWidth = cache;
                    }

                    if ((cache = y + item.rowHeight) > contentHeight)
                    {
                        contentHeight = cache;
                    }
                }
            }

            this.contentWidth = contentWidth;
            this.contentHeight = contentHeight;
        };

        function fn2(items, spaceX, spaceY) {

            var x = 0,
                y = 0,
                clientHeight = this.clientHeight,
                maxWidth = this.clientWidth,
                columnWidth = this.columnWidth,
                contentWidth = 0,
                contentHeight = 0,
                cache;

            for (var i = 0, _ = items.length; i < _; i++)
            {
                var item = items[i];

                if (item.__visible = (item.__style.visibility !== "collapsed"))
                {
                    if (y > 0)
                    {
                        if (item.newline) //强制在新行显示
                        {
                            y = 0;
                            x = x > 0 ? contentWidth + spaceX : contentWidth;
                        }
                        else
                        {
                            y += spaceY;
                        }
                    }

                    item.__fn_measure(columnWidth, clientHeight - y, false, true);

                    if (y > 0 && (y += item.rowHeight) > clientHeight) //超行
                    {
                        y = 0;
                        x = x > 0 ? contentWidth + spaceX : contentWidth;
                    }

                    item.__fn_position(x, y, columnWidth);

                    if ((cache = x + item.columnWidth) > contentWidth)
                    {
                        contentWidth = cache;
                    }

                    if ((cache = y + item.rowHeight) > contentHeight)
                    {
                        contentHeight = cache;
                    }
                }
            }

            this.contentWidth = contentWidth;
            this.contentHeight = contentHeight;
        };


        registry("flow", layout_unkown = function (items, spaceX, spaceY) {

            (this.vertical ? fn2 : fn1).call(this, items, spaceX, spaceY);
        });


    })(flyingon);



    //单个显示
    registry("page", function (items, spaceX, spaceY) {

        var page = this.layoutPage,
            length = items.length;

        if (page < 0)
        {
            page = 0;
        }
        else if (page >= length)
        {
            page = length - 1;
        }

        for (var i = 0; i < length; i++)
        {
            var item = items[i];

            if (item.__visible = (i === page))
            {
                item.__fn_measure(this.clientWidth, this.clientHeight, true, false);
                item.__fn_position(0, 0, this.clientWidth, this.clientHeight);
            }
        }
    });



    //停靠布局
    registry("dock", function (items, spaceX, spaceY) {

        var x = 0,
            y = 0,
            width = this.clientWidth,
            height = this.clientHeight,
            right = width,
            bottom = height,
            fill = [];

        for (var i = 0, _ = items.length; i < _; i++)
        {
            var item = items[i];

            if (item.__visible = (item.visibility !== "collapsed"))
            {
                if (width <= 0 || height <= 0)
                {
                    item.__visible = false;
                }
                else
                {
                    switch (item.dock)
                    {
                        case "left":
                            item.__fn_measure(width, height, true, false);
                            item.__fn_position(x, y);

                            width = right - (x += item.columnWidth + spaceX);
                            break;

                        case "top":
                            item.__fn_measure(width, height, true, false);
                            item.__fn_position(x, y);

                            height = bottom - (y = item.rowHeight + spaceY);
                            break;

                        case "right":
                            item.__fn_measure(width, height, true, false);
                            item.__fn_position(right -= item.columnWidth, y);

                            width = (right -= spaceX) - x;
                            break;

                        case "bottom":
                            item.__fn_measure(width, height, true, false);
                            item.__fn_position(x, bottom -= item.rowHeight);

                            height = (bottom -= spaceY) - y;
                            break;

                        default:
                            fill.push(item);
                            break;
                    }
                }
            }
        }

        if (width <= 0 || height <= 0)
        {
            for (var i = 0, _ = fill.length; i < _; i++)
            {
                fill[i].__visible = false;
            }
        }
        else
        {
            for (var i = 0, _ = fill.length; i < _; i++)
            {
                fill[i].__fn_measure(width, height, true, false);
                fill[i].__fn_position(x, y);
            }
        }
    });



    //队列布局 columns rows spaceX spaceY
    registry("queue", function (items, spaceX, spaceY) {

        var rows = this.layoutRows || 3,
            columns = this.layoutColumns || 3,
            row = 0,
            column = 0,

            width_cache = [],
            height_cache = [],
            width,
            height,
            cache;

        //分割横向空间
        width = columns > 1 ? this.clientWidth - spaceY * (columns - 1) : this.clientWidth;

        for (var i = 0; i < columns; i++)
        {
            width_cache[i] = [

                i > 0 ? (cache += spaceX) : (cache = 0),
                cache = Math.floor(width / (columns - i))
            ];

            width -= cache;
        }

        //分割纵向空间
        height = rows > 1 ? this.clientHeight - spaceY * (rows - 1) : this.clientHeight;

        for (var i = 0; i < rows; i++)
        {
            height_cache[i] = [

                i > 0 ? (cache += spaceY) : (cache = 0),
                cache = Math.floor(height / (columns - i))
            ];

            height -= cache;
        }

        //按顺序排列
        if (this.vertical)
        {
            for (var i = 0, _ = items.length; i < _; i++)
            {
                var item = items[i];

                if (item.__visible = row < rows && column < columns && item.visibility !== "collapsed")
                {
                    width = width_cache[column];
                    height = height_cache[row++];

                    item.__fn_measure(width[1], height[1], true, false);
                    item.__fn_position(width[0], height[0]);

                    if (row >= rows)
                    {
                        row = 0;
                        column++;
                    }
                }
            }
        }
        else
        {
            for (var i = 0, _ = items.length; i < _; i++)
            {
                var item = items[i];

                if (item.__visible = row < rows && column < columns && item.visibility !== "collapsed")
                {
                    width = width_cache[column++];
                    height = height_cache[row];

                    item.__fn_measure(width[1], height[1], true, false);
                    item.__fn_position(width[0], height[0]);

                    if (column >= columns)
                    {
                        column = 0;
                        row++;
                    }
                }
            }
        }
    });



    //网格布局 grid spaceX spaceY
    //示例: "T R* C* C* C* R* C* C* C* R* C* C* C* END"
    registry("grid", function (items, spaceX, spaceY) {

        var grid = new flyingon.GridDefine().load(this.layoutGrid);

        grid.spaceX = spaceX;
        grid.spaceY = spaceY;

        grid.compute(this.clientWidth, this.clientHeight);
        grid.match(items, this.vertical);
    });


    //绝对定位 left top
    registry("absolute", function (items) {

        var contentWidth = 0,
            contentHeight = 0,
            cache;

        for (var i = 0, _ = items.length; i < _; i++)
        {
            var item = items[i];

            if (item.__visible = (item.visibility !== "collapsed"))
            {
                item.__fn_measure(+item.width || item.__defaults.width, +item.height || item.__defaults.height, false, false, true);
                item.__fn_position(+item.left || 0, +item.top || 0);

                if ((cache = item.layoutX + item.columnWidth) > contentWidth)
                {
                    contentWidth = cache;
                }

                if ((cache = item.layoutY + item.rowHeight) > contentHeight)
                {
                    contentHeight = cache;
                }
            }
        }

        this.contentWidth = contentWidth;
        this.contentHeight = contentHeight;
    });



})(flyingon);




/*

网格布局定义

*/
(function (flyingon) {



    //布局格
    flyingon.CellDefine = (function (grid, row) {

        this.grid = grid;
        this.row = row;

    }).extend(function () {

        this.grid = null;

        this.x = 0;

        this.width = 0;

        this.__width_string = "*";

        this.__width_weight = 100;

        this.__width_auto = false;


        //设置列宽
        this.set_width = function (value) {

            if (this.__width_auto)
            {
                this.row.__width_weights -= this.__width_weight;
                this.__width_auto = false;
            }
            else if (this.width)
            {
                this.row.__width_fixed -= this.width;
            }

            this.__width_string = value = value || "*";

            var length = value.length - 1;

            if (value[length] === "*")
            {
                this.__width_weight = length ? value.substring(0, length) : 100;
                this.__width_auto = true;
                this.width = 0;
                this.row.__width_weights += this.__width_weight;
            }
            else
            {
                this.width = parseInt(value);
                this.row.__width_fixed += this.width;
            }
        };

    });



    //布局行
    flyingon.RowDefine = (function (grid) {

        this.grid = grid;
        this.cells = [];

    }).extend(function () {

        this.grid = null;

        this.y = 0;

        this.height = 0;

        this.__height_string = "*";

        this.__height_weight = 100;

        this.__height_auto = false;

        //所属单元格所有固定宽度的总和
        this.__width_fixed = 0;

        //自动宽度的表格数
        this.__width_weights = 0;



        //设置行高
        this.set_height = function (value) {

            if (this.__height_auto)
            {
                this.grid.__height_weights -= this.__height_weight;
                this.__height_auto = false;
            }
            else if (this.height)
            {
                this.grid.__height_fixed -= this.height;
            }

            this.__height_string = value = value || "*";
            var length = value.length - 1;

            if (value[length] === "*")
            {
                this.__height_weight = length === 0 ? 100 : value.substring(0, length);
                this.__height_auto = true;
                this.height = 0;
                this.grid.__height_weights += this.__height_weight;
            }
            else
            {
                this.height = parseInt(value);
                this.grid.__height_fixed += this.height;
            }
        };

    });



    //布局表
    flyingon.GridDefine = (function () {

        this.rows = [];

    }).extend(function () {


        //列留空
        this.spaceX = 0;

        //行留空
        this.spaceY = 0;

        //所属行中所有固定高度的总和
        this.__height_fixed = 0;

        //自动高度的权重总数
        this.__height_weights = 0;


        this.compute = function (width, height) {

            this.width = width || 0;
            this.height = height || 0;

            var spaceX = this.spaceX || 0,
                spaceY = this.spaceY || 0,

                rows = this.rows,
                length = rows.length,

                y = this.y || 0,
                height = Math.max(this.height - this.__height_fixed - (length - 1) * spaceY, 0),
                height_weights = this.__height_weights;


            for (var i = 0; i < length; i++)
            {
                var row = rows[i];

                row.y = y;

                if (row.__height_auto)
                {
                    row.height = Math.round(height * row.__height_weight / height_weights);
                    height_weights -= row.__height_weight;
                    height -= row.height;
                }


                var cells = row.cells,
                    count = cells.length,

                    x = this.x || 0,
                    width = Math.max(this.width - row.__width_fixed - (count - 1) * spaceX, 0),
                    width_weights = row.__width_weights;

                for (var j = 0; j < count; j++)
                {
                    var cell = cells[j];

                    cell.x = x;

                    if (cell.__width_auto)
                    {
                        cell.width = Math.round(width * cell.__width_weight / width_weights);
                        width_weights -= cell.__width_weight;
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



        this.create = function (rows, columns) {

            var rows = Math.max(rows, 0) || 3,
                columns = Math.max(columns, 0) || 3;


            for (var i = 0; i < rows; i++)
            {
                var row = new flyingon.RowDefine(this);

                row.__height_auto = true;
                this.__height_weights += row.__height_weight;

                for (var j = 0; j < columns; j++)
                {
                    var cell = new flyingon.CellDefine(this, row);

                    cell.__width_auto = true;
                    row.__width_weights += cell.__width_weight;

                    row.cells.push(cell);
                }

                this.rows.push(row);
            }

            return this;
        };

        this.load = function (value) {

            value = value || "T R* C* C* C* R* C* C* C* R* C* C* C* END";

            var children = [],
                rows = [],
                grid = this,
                row,
                cell,
                tokens = value.split(/\s/g);


            for (var i = 0, _ = tokens.length; i < _; i++)
            {
                var token = tokens[i],
                    value = token.substring(1);

                if (token === "END")
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
                            row.set_height(value);
                            grid.rows.push(row);

                            cell = null;
                            break;

                        case "C":
                            if (row)
                            {
                                cell = new flyingon.CellDefine(grid, row);
                                cell.set_width(value);
                                row.cells.push(cell);
                            }
                            break;
                    }
                }
            }

            return this;
        };


        this.serialize = function (writer) {

        };

        this.deserialize = function (reader, value, excludes) {


        };



        function horizontal_cells(result) {

            var rows = this.rows;

            result = result || [];

            for (var i = 0, _ = rows.length; i < _; i++)
            {
                var row = rows[i],
                    cells = row.cells;

                for (var j = 0, __ = cells.length; j < __; j++)
                {
                    var cell = cells[j];

                    if (cell.children)
                    {
                        horizontal_cells.call(cell.children, result);
                    }
                    else
                    {
                        result.push(cell);
                    }
                }
            }

            return result;
        };

        function vertical_cells(result) {

            var rows = this.rows,
                values = [];

            result = result || [];

            for (var i = 0, _ = rows.length; i < _; i++)
            {
                var row = rows[i],
                    cells = row.cells;

                for (var j = 0, __ = cells.length; j < __; j++)
                {
                    var cell = cells[j];

                    if (cell.children)
                    {
                        vertical_cells(cell.children, result);
                    }
                    else
                    {
                        (values[i] || (values[i] = [])).push(cell);
                    }
                }
            }

            for (var i = 0, _ = values.length; i < _; i++)
            {
                result.push.apply(result, values[i]);
            }

            return result;
        };



        //按顺序自动排列子控件
        this.match = function (items, vertical) {

            var cells = vertical ? vertical_cells() : horizontal_cells(),
                length = cells.length,
                index = 0;

            for (var i = 0, _ = items.length; i < _; i++)
            {
                var item = items[i];

                if (item.__visible = index < length && item.visibility !== "collapsed")
                {
                    var cell = cells[index++];

                    item.__fn_measure(cell.width, cell.row.height, true, false);
                    item.__fn_position(cell.x, cell.row.y);
                }
            }

            return this;
        };

    });


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




﻿/*

Canvas2D绘图
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

    LinearGradient.prototype.style = function (context) {

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

    RadialGradient.prototype.style = function (context) {

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

    ImagePattern.prototype.style = function (context) {

        return context.createPattern(this.image, this.repetition);
    };




    //2d图形绘制器
    flyingon.Painter = (function (context) {

        this.context = context;

    }).extend(function (flyingon) {



        var self = this,

            radian = Math.PI / 180, //角度转弧度系数

            prototype = CanvasRenderingContext2D.prototype,

            value = "value instanceof Function ? value.style(this) : value";



        function defineProperty(name) {

            var getter = new Function("return this.context." + name + ";"),
                setter = new Function("value", "this.context." + name + " = " + value + ";\nreturn this");

            flyingon.defineProperty(self, name, getter, setter);
        };



        //目标控件
        this.target = null;


        /*    
        设置填充色
        (color) = "#000000"	
        */
        defineProperty("fillStyle");

        /*    
        设置边框色
        (color) = "#000000"	
        */
        defineProperty("strokeStyle");


        value = "value";

        /*    
        设置或返回用于阴影的颜色
        (color) = "#000000"	 
        */
        defineProperty("shadowColor");

        /* 
        设置或返回用于阴影的模糊级别
        (number) = 0	     
        */
        defineProperty("shadowBlur");

        /* 
        设置或返回阴影距形状的水平距离
        (number) = 0	
        */
        defineProperty("shadowOffsetX");

        /* 
        设置或返回阴影距形状的垂直距离
        (number) = 0	 
        */
        defineProperty("shadowOffsetY");


        /* 
        设置或返回线条的结束端点样式
        ("butt|round|square") = "butt"	     
        */
        defineProperty("lineCap");

        /* 
        设置或返回两条线相交时 所创建的拐角类型
        ("bevel|round|miter") = "miter"	   
        */
        defineProperty("lineJoin");

        /* 
        设置或返回当前的线条宽度
        (number) = 1	  
        */
        defineProperty("lineWidth");

        /* 
        设置或返回最大斜接长度
        (number) = 10	     
        */
        defineProperty("miterLimit");


        /* 
        设置或返回文本内容的当前字体属性
        set_font("italic small-caps bold 12px arial") = "10px sans-serif"	 
        */
        defineProperty("font");

        /* 
        设置或返回文本内容的当前对齐方式
        set_textAlign("center|end|left|right|start") = "start"	 
        
        start     文本在指定的位置开始
        end       文本在指定的位置结束
        center    文本的中心被放置在指定的位置
        left      文本左对齐
        right     文本右对齐
        */
        defineProperty("textAlign");

        /* 
        设置或返回在绘制文本时使用的当前文本基线
        set_textBaseline("alphabetic|top|hanging|middle|ideographic|bottom") = "alphabetic"	

        alphabetic    文本基线是普通的字母基线
        top           文本基线是 em 方框的顶端
        hanging       文本基线是悬挂基线
        middle        文本基线是 em 方框的正中
        ideographic   文本基线是表意基线
        bottom        文本基线是 em 方框的底端
        */
        defineProperty("textBaseline");


        /* 
        透明值 必须介于0.0(完全透明)与1.0(不透明)之间
        set_globalAlpha(number)	
        */
        defineProperty("globalAlpha");

        /* 
        设置或返回新图像如何绘制到已有的图像上
        set_globalCompositeOperation("source-over|source-atop|source-in|source-out|destination-over|destination-atop|destination-in|destination-out|lighter|copy|source-over") = "source-over"	
    
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
        defineProperty("globalCompositeOperation");



        //创建矩形
        this.rect = function (x, y, width, height) {

            this.context.rect(x, y, width, height);
        };

        //绘制填充的矩形
        this.fillRect = function (x, y, width, height) {

            this.context.fillRect(x, y, width, height);
        };

        //绘制无填充矩形
        this.strokeRect = function (x, y, width, height) {

            this.context.strokeRect(x, y, width, height);
        };

        //在给定的矩形内清除指定的像素
        this.clearRect = function (x, y, width, height) {

            this.context.clearRect(x, y, width, height);
        };



        //填充当前绘图(路径)
        this.fill = function () {

            this.context.fill();
        };

        //绘制已定义的路径
        this.stroke = function () {

            this.context.stroke();
        };

        //起始一条路径 或重置当前路径
        this.beginPath = function () {

            this.context.beginPath();
        };

        //创建从当前点回到起始点的路径
        this.closePath = function () {

            this.context.closePath();
        };

        //把路径移动到画布中的指定点 不创建线条
        this.moveTo = function (x, y) {

            this.context.moveTo(x, y);
        };

        //添加一个新点 然后在画布中创建从该点到最后指定点的线条
        this.lineTo = function (x, y) {

            this.context.lineTo(x, y);
        };

        //如果指定的点位于当前路径中 则返回 true 否则返回 false
        this.isPointInPath = function (x, y) {

            this.context.isPointInPath(x, y);
        };


        /*
        创建二次贝塞尔曲线

        control_x	贝塞尔控制点的 x 坐标
        control_y	贝塞尔控制点的 y 坐标
        end_x	结束点的 x 坐标
        end_y	结束点的 y 坐标
        */
        this.quadraticCurveTo = function (control_x, control_y, end_x, end_y) {

            this.context.quadraticCurveTo(control_x, control_y, end_x, end_y);
        };

        /*
        创建三次方贝塞尔曲线
        control_x1	第一个贝塞尔控制点的 x 坐标
        control_y1	第一个贝塞尔控制点的 y 坐标
        control_x2	第二个贝塞尔控制点的 x 坐标
        control_y2	第二个贝塞尔控制点的 y 坐标
        end_x	结束点的 x 坐标
        end_y	结束点的 y 坐标
        */
        this.bezierCurveTo = function (control_x1, control_y1, control_x2, control_y2, end_x, end_y) {

            var context = this.context;
            context.bezierCurveTo.apply(context, arguments);
        };

        /*
        创建弧/曲线(用于创建圆形或部分圆)

        x	圆的中心的 x 坐标 
        y	圆的中心的 y 坐标 
        radius	圆的半径 
        angle1	起始角 以弧度计 (弧的圆形的三点钟位置是 0 度) 
        angle2	结束角 以弧度计 
        anticlockwise	可选 规定应该逆时针还是顺时针绘图 False = 顺时针 true = 逆时针 
        */
        this.arc = function (x, y, radius, angle1, angle2, anticlockwise) {

            var context = this.context;
            context.arc.apply(context, arguments);
        };

        /*
        创建两切线之间的弧/曲线

        x1  
        y1  
        x2  
        y2      
        radius  半径
        */
        this.arcTo = function (x1, y1, x2, y2, radius) {

            this.context.arcTo(x1, y1, x2, y2, radius);
        };


        //重新映射画布上的 (0,0) 位置
        this.translate = function (x, y) {

            this.context.translate(x, y);
        };

        //缩放当前绘图至更大或更小
        this.scale = function (x, y) {

            this.context.scale(x, y);
        };

        //旋转当前绘图
        this.rotate = function (angle) {

            this.context.rotate(angle);
        };

        /*
        替换绘图的当前转换矩阵
        
        scale_x	水平缩放绘图
        skew_x	水平倾斜绘图
        skew_y	垂直倾斜绘图
        scale_y	垂直缩放绘图
        move_x	水平移动绘图
        move_y	垂直移动绘图
        */
        this.transform = function (scale_x, skew_x, skew_y, scale_y, move_x, move_y) {

            var context = this.context;
            context.transform.apply(context, arguments);
        };

        /*
        将当前转换重置为单位矩阵 然后运行 transform()
        
        scale_x	水平缩放绘图
        skew_x	水平倾斜绘图
        skew_y	垂直倾斜绘图
        scale_y	垂直缩放绘图
        move_x	水平移动绘图
        move_y	垂直移动绘图
        */
        this.setTransform = function (scale_x, skew_x, skew_y, scale_y, move_x, move_y) {

            var context = this.context;
            context.setTransform.apply(context, arguments);
        };


        //从原始画布剪切任意形状和尺寸的区域
        this.clip = function () {

            this.context.clip();
        };

        //保存当前环境的状态
        this.save = function () {

            this.context.save();
        };

        //返回之前保存过的路径状态和属性
        this.restore = function () {

            this.context.restore();
        };



        /*
        在画布上绘制“被填充的”文本
        
        text	    规定在画布上输出的文本
        x	        开始绘制文本的x坐标位置(相对于画布)
        y	        开始绘制文本的y坐标位置(相对于画布)
        maxWidth	可选 允许的最大文本宽度,以像素计
        */
        this.fillText = function (text, x, y, maxWidth) {

            var context = this.context;
            context.fillText.apply(context, arguments);
        };

        /*
        在画布上绘制文本(无填充)

        text	    规定在画布上输出的文本
        x	        开始绘制文本的x坐标位置(相对于画布)
        y	        开始绘制文本的y坐标位置(相对于画布)
        maxWidth	可选 允许的最大文本宽度,以像素计
        */
        this.strokeText = function (text, x, y, maxWidth) {

            var context = this.context;
            context.strokeText.apply(context, arguments);
        };

        //返回包含指定文本宽度
        this.measureText = function (text) {

            return this.context.measureText(text);
        };


        /*
        向画布上绘制图像、画布或视频
    
        image   规定要使用的图像、画布或视频
        source_x	    可选 开始剪切的x坐标位置
        source_y	    可选 开始剪切的y坐标位置
        source_width	可选 被剪切图像的宽度
        source_height	可选 被剪切图像的高度
        x	    可选 在画布上放置图像的x坐标位置
        y	    可选 在画布上放置图像的y坐标位置
        width	可选 要使用的图像的宽度(伸展或缩小图像)
        height	可选 要使用的图像的高度(伸展或缩小图像)
        */
        this.drawImage = function (image, source_x, source_y, source_width, source_height, x, y, width, height) {

            var context = this.context;
            context.drawImage.apply(context, arguments);
        };

        //绘制图像
        this.paint_image = function (image, x, y, width, height, align, stretch) {

            var context = this.context,
                _width = image.width,
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
                        context.drawImage(image, x, y, width, height);
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
                context.drawImage(image, 0, 0, _width, _height, x, y, width, height);
            }
            else
            {
                context.drawImage(image, x, y);
            }
        };


        //绘制边框
        this.paint_border = function (x, y, width, height, border) {

            var context = this.context;

            context.beginPath();

            context.rect(x, y, width - border.right, border.top);
            context.rect(x + width - border.right, y, border.right, height - border.bottom);
            context.rect(x + border.left, y + height - border.bottom, width - border.left, border.bottom);
            context.rect(x, y + border.top, border.left, height - border.top);

            context.fill();
        };



        this.rectTo = function (x, y, width, height, anticlockwise) {

            var context = this.context,
                right = x + width,
                bottom = y + height;

            if (anticlockwise)
            {
                context.moveTo(x, y);
                context.lineTo(x, bottom);
                context.lineTo(right, bottom);
                context.lineTo(right, y);
                context.lineTo(x, y);
            }
            else
            {
                context.moveTo(x, y);
                context.lineTo(right, y);
                context.lineTo(right, bottom);
                context.lineTo(x, bottom);
                context.lineTo(x, y);
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
        this.roundRect = function (x, y, width, height, radius, anticlockwise) {

            var context = this.context,
                right = x + width,
                bottom = y + height;

            if (anticlockwise)
            {
                context.moveTo(x, y + radius);

                context.lineTo(x, bottom - radius);
                context.quadraticCurveTo(x, bottom, x + radius, bottom);

                context.lineTo(right - radius, bottom);
                context.quadraticCurveTo(right, bottom, right, bottom - radius);

                context.lineTo(right, y + radius);
                context.quadraticCurveTo(right, y, right - radius, y);

                context.lineTo(x + radius, y);
                context.quadraticCurveTo(x, y, x, y + radius);
            }
            else
            {
                context.moveTo(x + radius, y);

                context.lineTo(right - radius, y);
                context.quadraticCurveTo(right, y, right, y + radius);

                context.lineTo(right, bottom - radius);
                context.quadraticCurveTo(right, bottom, right - radius, bottom);

                context.lineTo(x + radius, bottom);
                context.quadraticCurveTo(x, bottom, x, bottom - radius);

                context.lineTo(x, y + radius);
                context.quadraticCurveTo(x, y, x + radius, y);
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
        this.fillRoundRect = function (x, y, width, height, radius) {

            var context = this.context;

            context.beginPath();
            context.roundRect(x, y, width, height, radius);
            context.fill();
        };

        /*
        * 描边圆角矩形
        * @param {Number} x The top left x coordinate
        * @param {Number} y The top left y coordinate 
        * @param {Number} width The width of the rectangle 
        * @param {Number} height The height of the rectangle
        * @param {Number} radius The corner radius. Defaults to 5;
        */
        this.strokeRoundRect = function (x, y, width, height, radius) {

            var context = this.context;

            context.beginPath();
            context.roundRect(x, y, width, height, radius);
            context.stroke();
        };


        //多边形
        this.polygon = function (sides, x, y, radius, angle, anticlockwise) {

            var context = this.context,
                delta = (anticlockwise ? -2 : 2) * Math.PI / sides;

            angle = angle ? angle * radian : 0;

            context.moveTo(x + radius * Math.sin(angle), y - radius * Math.cos(angle));

            for (var i = 1; i <= sides; i++)
            {
                angle += delta;
                context.lineTo(x + radius * Math.sin(angle), y - radius * Math.cos(angle));
            }
        };

        this.fillPolygon = function (sides, x, y, radius, angle, anticlockwise) {

            var context = this.context;

            context.beginPath();
            context.polygon(sides, x, y, radius, angle, anticlockwise);
            context.fill();
        };

        this.strokePolygon = function (sides, x, y, radius, angle, anticlockwise) {

            var context = this.context;

            context.beginPath();
            context.polygon(sides, x, y, radius, angle, anticlockwise);
            context.stroke();
        };



        this.starPolygon = function (vertexes, x, y, radius1, radius2, angle, anticlockwise) {

            var context = this.context,
                delta = (anticlockwise ? -1 : 1) * Math.PI / vertexes;

            angle = angle ? angle * radian : 0;

            context.moveTo(x + radius1 * Math.sin(angle), y - radius1 * Math.cos(angle));

            for (var i = 1; i <= vertexes; i++)
            {
                angle += delta;
                context.lineTo(x + radius2 * Math.sin(angle), y - radius2 * Math.cos(angle));

                angle += delta;
                context.lineTo(x + radius1 * Math.sin(angle), y - radius1 * Math.cos(angle));
            }
        };

        this.fillStarPolygon = function (vertexes, x, y, radius1, radius2, angle, anticlockwise) {

            var context = this.context;

            context.beginPath();
            context.starPolygon(vertexes, x, y, radius1, radius2, angle, anticlockwise);
            context.fill();
        };

        this.strokeStarPolygon = function (vertexes, x, y, radius1, radius2, angle, anticlockwise) {

            var context = this.context;

            context.beginPath();
            context.starPolygon(vertexes, x, y, radius1, radius2, angle, anticlockwise);
            context.stroke();
        };



        this.ellipse = function (x, y, width, height, anticlockwise) {

            var context = this.context,
                controlX = width / 1.5,  //控制点x(width / 0.75) / 2
                controlY = height / 2;   //控制点y

            if (anticlockwise)
            {
                context.moveTo(x, y + controlY);
                context.bezierCurveTo(x + controlX, y + controlY, x + controlX, y - controlY, x, y - controlY);
                context.bezierCurveTo(x - controlX, y - controlY, x - controlX, y + controlY, x, y + controlY);
            }
            else
            {
                context.moveTo(x, y - controlY);
                context.bezierCurveTo(x + controlX, y - controlY, x + controlX, y + controlY, x, y + controlY);
                context.bezierCurveTo(x - controlX, y + controlY, x - controlX, y - controlY, x, y - controlY);
            }
        };

        this.fillEllipse = function (x, y, width, height) {

            var context = this.context;

            context.beginPath();
            context.ellipse(x, y, width, height);
            context.fill();
        };

        this.strokeEllipse = function (x, y, width, height) {

            var context = this.context;

            context.beginPath();
            context.ellipse(x, y, width, height);
            context.stroke();
        };



        //画虚线
        this.dashLine = function (x1, y1, x2, y2, dashArray) {

            dashArray = dashArray || [10, 5];

            var context = this.context,
                length = dashArray.length,
                width = (x2 - x1),
                height = (y2 - y1),
                slope = height / width,
                distRemaining = Math.sqrt(width * width + height * height),
                index = 0,
                draw = false;

            context.moveTo(x1, y1);

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

                context[(draw = !draw) ? "lineTo" : "moveTo"](x1, y1);

                distRemaining -= dashLength;
            }
        };


    });



})(flyingon);




﻿/*

*/
flyingon.defineClass("ControlCollection", flyingon.Collection, function (Class, base, flyingon) {




    Class.create = function (target) {

        this.target = target;
    };



    //添加进集合时进行验证
    this.__fn_validate = function (index, item) {

        if (item instanceof flyingon.Control)
        {
            if (flyingon.__initializing)
            {
                item.__parent = this.target;
            }
            else
            {
                item.__fn_parent(this.target);
            }

            return item;
        }

        return undefined;
    };

    //移除
    this.__fn_remove = function (index, item) {

        if (!flyingon.__initializing)
        {
            item.__fn_parent(null);
            item.__ownerWindow = null;
            item.__ownerLayer = null;

            this.target.invalidate(false);

            if ((item = item.__children) && item.length > 0)
            {
                clear_children(item);
            }
        }
    };

    //注: 清除不触发相关事件
    this.__fn_clear = function () {

        for (var i = 0, _ = this.length; i < _; i++)
        {
            var item = this[i];

            item.__parent = null;
            item.__ownerWindow = null;
            item.__ownerLayer = null;

            if ((item = item.__children) && item.length > 0)
            {
                clear_children(item);
            }
        }
    };

    //清除子控件关系缓存
    function clear_children(children) {

        for (var i = 0, _ = children.length; i < _; i++)
        {
            var item = children[i];

            item.__ownerWindow = null;
            item.__ownerLayer = null;

            if ((item = item.__children) && item.length > 0)
            {
                clear_children(item);
            }
        }
    };


    //循环执行指定函数
    this.cascade_call = function (fn) {

        var result, item;

        for (var i = 0, _ = this.length; i < _; i++)
        {
            if ((result = fn(item = this[i], i)) !== undefined)
            {
                return result;
            }

            if ((item = item.__children) && (result = item.cascade_call(fn, true)) !== undefined)
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

            var terget = this.target,
                item;

            for (var i = 0, _ = this.length; i < _; i++)
            {
                if (item = this[i])
                {
                    item.__parent = target;
                }
            }
        }
    };



}, true);





﻿

//扩展选择器元素查询方法
(function (flyingon) {



    var selector_cache = {},    //缓存数据
        type_fn = {};           //类型查找函数



    //从start开始查找所有符合条件的元素
    flyingon.querySelectorAll = function (selector, start) {

        if (!start)
        {
            throw new Error(flyingon_lang.query_must_start);
        }

        var nodes = selector_cache[selector] || (selector_cache[selector] = flyingon.parse_selector(selector)),
            node,
            items = [start],
            exports;

        for (var i = 0, _ = nodes.length; i < _; i++)
        {
            node = nodes[i];

            type_fn[node.type](node, items, exports = []); //批量传入数组减少函数调用以提升性能

            if (exports.length == 0)
            {
                return exports;
            }

            items = exports;
        }

        return exports;
    };




    //组合查询方法
    (function () {


        //伪元素处理集
        var pseudo_fn = {};


        //目标检测
        function check_node(node, target, exports) {

            switch (node.token)
            {
                case "":  //类型
                    if (target.__fullTypeName !== node.name)
                    {
                        return false;
                    }
                    break;

                case ".": //class
                    if (!target.__class_names || !target.__class_names[node.name])
                    {
                        return false;
                    }
                    break;

                case "#": //id
                    if (target.id !== node.name)
                    {
                        return false;
                    }
                    break;

                case ":": //伪元素
                    return (pseudo_fn[node.name] || pseudo_unkown)(node, target, exports);
            }

            for (var i = 0, _ = node.length; i < _; i++)
            {
                if (node[i].check(target) === false)
                {
                    return false;
                }
            }

            exports.push(target);
        };


        //检查属性 伪元素检测用
        function check_property(node, target, exports) {

            for (var i = 0, _ = node.length; i < _; i++)
            {
                if (node[i].check(target) === false)
                {
                    return false;
                }
            }

            exports.push(target);
        };



        //合并元素集
        this[","] = function (node, items, exports) {

            var fn, values;

            for (var i = 0, _ = node.length; i < _; i++)
            {
                if (fn = type_fn[node.type])
                {
                    fn(node, items, values = []);

                    if (values.length > 0)
                    {
                        exports.push.apply(exports, values);
                    }
                }
            }
        };
        
        //所有后代元素
        this[" "] = function (node, items, exports) {

            var children;

            for (var i = 0, _ = items.length; i < _; i++)
            {
                if ((children = items[i].__children) && children.length > 0)
                {
                    query_cascade(node, children, exports);
                }
            }
        };

        function query_cascade(node, items, exports) {

            var cache;

            for (var i = 0, _ = items.length; i < _; i++)
            {
                check_node(node, cache = items[i], exports);

                if ((cache = cache.__children) && cache.length > 0)
                {
                    query_cascade(node, cache, exports);
                }
            }
        };
        
        //子元素
        this[">"] = function (node, items, exports) {

            var children;

            for (var i = 0, _ = items.length; i < _; i++)
            {
                if ((children = items[i].__children) && children.length > 0)
                {
                    for (var j = 0, __ = children.length; j < __; j++)
                    {
                        check_node(node, children[j], exports);
                    }
                }
            }
        };

        //后一个元素 元素伪类:after也会转换成此节点类型
        this["+"] = function (node, items, exports) {

            var item, children, index;

            for (var i = 0, _ = items.length; i < _; i++)
            {
                if ((item = items[i]).__parent)
                {
                    children = item.__parent.__children;

                    if (children.length > (index = children.indexOf(item) + 1))
                    {
                        check_node(node, children[index], exports);
                    }
                }
            }
        };

        //所有后续兄弟元素
        this["~"] = function (node, items, exports) {

            var item, children;

            for (var i = 0, _ = items.length; i < _; i++)
            {
                if ((item = items[i]).__parent)
                {
                    children = item.__parent.__children;

                    for (var j = children.indexOf(item) + 1, __ = children.length; j < __; j++)
                    {
                        check_node(node, children[j], exports);
                    }
                }
            }
        };




        //未知伪元素处理
        function pseudo_unkown(node, target, exports) {

            return false;
        };


        pseudo_fn["before"] = function (node, target, exports) {

            var children, index;

            if (target.__parent)
            {
                children = target.__parent.__children;

                if ((index = children.indexOf(target) - 1) >= 0)
                {
                    return check_property(node, children[index], exports);
                }
            }

            return false;
        };

        pseudo_fn["after"] = function (node, target, exports) {

            var children, index;

            if (target.__parent)
            {
                children = target.__parent.__children;

                if (children.length > (index = children.indexOf(target) + 1))
                {
                    return check_property(node, children[index], exports);
                }
            }

            return false;
        };

        pseudo_fn["first-child"] = function (node, target, exports) {

            var children;

            if ((children = target.__children) && children.length > 0)
            {
                return check_property(node, children[0], exports);
            }

            return false;
        };

        pseudo_fn["first-of-type"] = function (node, target, exports) {

            var children;

            if ((children = target.__children) && children.length > 0 && children[0].__fullTypeName === target.__fullTypeName)
            {
                return check_property(node, children[0], exports);
            }

            return false;
        };

        pseudo_fn["last-child"] = function (node, target, exports) {

            var children;

            if ((children = target.__children) && children.length > 0)
            {
                return check_property(node, children[children.length - 1], exports);
            }

            return false;
        };

        pseudo_fn["last-of-type"] = function (node, target, exports) {

            var children;

            if ((children = target.__children) && children.length > 0 && children[children.length - 1].__fullTypeName === target.__fullTypeName)
            {
                return check_property(node, children[children.length - 1], exports);
            }

            return false;
        };

        pseudo_fn["only-child"] = function (node, target, exports) {

            if ((children = target.__children) && children.length === 1)
            {
                return check_property(node, children[0], exports);
            }

            return false;
        };

        pseudo_fn["only-of-type"] = function (node, target, exports) {

            var children;

            if ((children = target.__children) && children.length === 1 && children[0].__fullTypeName === target.__fullTypeName)
            {
                return check_property(node, children[0], exports);
            }

            return false;
        };

        pseudo_fn["nth-child"] = function (node, target, exports) {

            var children, index = +node.parameters[0];

            if ((children = target.__children) && children.length > index)
            {
                return check_property(node, children[index], exports);
            }

            return false;
        };

        pseudo_fn["nth-of-type"] = function (node, target, exports) {

            var children, index = +node.parameters[0];

            if ((children = target.__children) && children.length > index && children[index].__fullTypeName === target.__fullTypeName)
            {
                return check_property(node, children[index], exports);
            }

            return false;
        };

        pseudo_fn["nth-last-child"] = function (node, target, exports) {

            var children, index = +node.parameters[0];

            if ((children = target.__children) && children.length > index)
            {
                return check_property(node, children[children.length - index - 1], exports);
            }

            return false;
        };

        pseudo_fn["nth-last-of-type"] = function (node, target, exports) {

            var children, index = +node.parameters[0];

            if ((children = target.__children) && children.length > index)
            {
                var j = children.length - index - 1;

                if (children[j].__fullTypeName === target.__fullTypeName)
                {
                    return check_property(node, children[j], exports);
                }
            }

            return false;
        };


    }).call(type_fn);



})(flyingon);





﻿
//选择器
(function (flyingon) {



    //选择器
    //selector: css样式选择表达式 
    //start: 开始搜索节点
    flyingon.Query = (function (selector, start) {

        if (selector)
        {
            switch (selector.constructor)
            {
                case String:
                    selector = flyingon.querySelectorAll(selector, start);

                case Array:
                    if (selector.length > 0)
                    {
                        this.push.apply(this, selector);
                    }
                    break;

                default:
                    this.push(selector);
                    return;
            }
        }

    }).extend(function (flyingon) {


        //开放接口
        flyingon.query = this;



        //子项数
        this.length = 0;

        //添加元素
        this.push = Array.prototype.push;

        //移除或替换元素
        this.splice = Array.prototype.splice;



        //扩展for相关方法
        flyingon.for_extend(this);



        //合并
        this.merge = function (selector, context) {

            this.push.call(this, selector, context);
            return this;
        };


        //保存状态
        this.save = function () {

            var query = new flyingon.Query();

            query.push.apply(query, this);
            query.__previous = this;

            return query;
        };

        //恢复到上次保存的状态(没有保存的状态则返回自身)
        this.restore = function () {

            var result = this.__previous;

            if (result)
            {
                this.__previous = null;
                return result;
            }

            return this;
        };


        //获取第一个项
        this.first = function () {

            if (this.length > 1)
            {
                this.splice(1, this.length - 1);
            }

            return this;
        };

        //获取最后一个项
        this.last = function () {

            if (this.length > 1)
            {
                this.splice(0, this.length - 2);
            }

            return this;
        };

        //获取奇数项
        this.odd = function () {

            return this.mod(0, 2);
        };

        //获取偶数项
        this.even = function () {

            return this.mod(1, 2);
        };

        //复合求余值的项
        this.mod = function (mod, length) {

            var values = [];

            for (var i = 0, length = this.length; i < length; i++)
            {
                if (i % length === mod)
                {
                    values.push(this[i]);
                }
            }

            this.length = 0;
            this.push.apply(this, values);

            return this;
        };

        //筛选项
        this.filter = function (fn) {

            var values = [], item;

            for (var i = 0, length = this.length; i < length; i++)
            {
                if (i % length === mod)
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





        this.addEventListener = function (type, fn) {

            this.for_apply("addEventListener", arguments);
            return this;
        };

        this.removeEventListener = function (type, fn) {

            this.for_apply("removeEventListener", arguments);
            return this;
        };



        this.hasClass = function (className) {

            return this.for_has("hasClass", true, arguments);
        };

        this.addClass = function (className) {

            this.for_apply("addClass", arguments);
            return this;
        };

        this.removeClass = function (className) {

            this.for_apply("removeClass", arguments);
            return this;
        };

        this.toggleClass = function (className) {

            this.for_apply("toggleClass", arguments);
            return this;
        };


    });



})(flyingon);






﻿
///初始化插入符
flyingon.__fn_initialize_caret = function (parentNode) {


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

        caret.style.visibility = caret.style.visibility === "visible" ? "hidden" : "visible";
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


        if (keyCode !== 17 && !input.readOnly && input.value)
        {
            oninput.call(this, input.value); //不处理ctrl键
        }
    };




    //变更插入符位置
    this.__fn_change_caret = function (changeX, changeY) {

        if (_boxModel)
        {
            location.x -= changeX;
            location.y -= changeY;

            show();
        }
    };


    //打开输入法
    this.__fn_open_ime = function (ownerControl, readOnly, textMetrics) {

        _ownerControl = ownerControl;
        _boxModel = ownerControl.__boxModel;
        _textMetrics = textMetrics || ownerControl.__textMetrics;

        input.readOnly = readOnly;
        reset();
    };

    //重置输入法
    var reset = this.__fn_reset_ime = function () {

        input.focus();
        input.value = _textMetrics.selectedText;
        input.select();

        update.call(this);
    };

    //关闭输入法
    this.__fn_close_ime = function () {

        if (timer)
        {
            clearInterval(timer);
            timer = null;
        }

        caret.style.visibility = "hidden";
        input.blur();
    };


};






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
                var box = dragTargets[i].__boxModel;
                if (box)
                {
                    box.render(context);
                }
            }
        },

        //默认移动行为
        move: function (dom_MouseEvent, offsetX, offsetY) {

            //需修正div移动偏差
            var target = ownerWindow.hitTest(dom_MouseEvent.offsetX + offsetX, dom_MouseEvent.offsetY + offsetY),
                event;


            if (target === ownerControl)
            {
                target = ownerControl.__parent;
            }

            if (dropTarget !== target)
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
            ownerWindow.__capture_delay.registry([last_event]);
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




﻿/// <reference path="../Base/Core.js" />


//控件基类
flyingon.defineClass("Control", flyingon.SerializableObject, function (Class, base, flyingon) {



    Class.create = function () {

        //唯一id
        this.__uniqueId = ++flyingon.__uniqueId;

        //自定义样式数据
        this.__style = Object.create(null);

        //样式表缓存数据
        this.__styleSheets = Object.create(null);
    };



    //子控件集合
    this.__children = null;

    //可见子项集合
    this.__visible_items = null;


    //引用序列化标记(为true时只序列化名称不序列化内容)
    this.serialize_reference = true;



    //父控件
    this.defineProperty("parent", null, {

        getter: function () {

            return this.__parent;
        },

        setter: function (value) {

            var oldValue = this.__parent;

            if (value !== oldValue)
            {
                if (oldValue)
                {
                    oldValue.__children.remove(this);
                }

                if (value)
                {
                    value.__children.append(this);
                }
            }

            return this;
        }
    });



    //触发父控件变更
    this.__fn_parent = function (parent) {

        this.__parent = parent;
        this.__fn_reset_style();    //重置样式

        this.dispatchEvent(new flyingon.PropertyChangeEvent(this, "parent", parent, this.__parent));
    };

    //当前控件是否指定控件的父控件
    this.isParent = function (control) {

        if (!control || control === this)
        {
            return false;
        }

        var target = control.__parent;

        while (target)
        {
            if (target === this)
            {
                return true;
            }

            target = target.__parent;
        }

        return false;
    };

    //指定控件是否当前控件的父控件
    this.isParentTo = function (control) {

        return control ? control.isParent(this) : false;
    };



    var ControlCollection = flyingon.ControlCollection;

    //子控件集合
    this.defineProperty("children", function () {

        return this.__children || (this.__visible_items ? null : (this.__children = this.__visible_items = new ControlCollection(this)));
    });

    //子索引号
    this.defineProperty("childIndex", function () {

        var cache = this.__parent;
        return (cache && (cache = cache.__children) && cache.indexOf(this)) || -1;
    });


    //从父控件中移除自身
    this.remove = function () {

        var parent = this.__parent;

        if (parent)
        {
            parent.__children.remove(this);
        }

        return this;
    };




    //所属窗口变量
    this.__ownerWindow = null;

    //所属图层内部变量
    this.__ownerLayer = null;



    //所属窗口
    this.defineProperty("ownerWindow", function () {

        return this.__ownerWindow || (this.__ownerWindow = this.__parent.ownerWindow);
    });


    //所属图层
    this.defineProperty("ownerLayer", function () {

        return this.__ownerLayer || (this.__ownerLayer = this.__parent.ownerLayer);
    });




    //class state
    (function (flyingon) {


        //id
        this.defineProperty("id", null, {

            attributes: "layout",
            changed: "this.__fn_reset_style();"    //重置样式
        });


        //指定class名 与html一样
        this.defineProperty("className", null, {

            attributes: "layout|query",
            complete: "this.__fn_className(value);"
        });

        //处理className
        this.__fn_className = function (value) {

            var values;

            if (value && (values = value.match(/\S+/g)).length > 0)
            {
                var cache = this.__class_names = {};

                for (var i = 0, _ = values.length; i < _; i++)
                {
                    cache[values[i]] = true;
                }

                this.__fields.className = (cache.__keys = Object.keys(cache)).join(" ");
            }
            else
            {
                this.__class_names = null;
                this.__fields.className = null;
            }

            //重置样式
            this.__fn_reset_style();

            //class变更可能需要重新布局
            (this.__parent || this).invalidate(true);
        };

        //是否包含指定class
        this.hasClass = function (className) {

            return this.__class_names && this.__class_names[className];
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

            var keys = this.__class_names;

            if (keys && className && keys[className])
            {
                delete keys[className];
                this.className = Object.keys(keys).join(" ");

                return true;
            }
        };

        //切换class 有则移除无则添加
        this.toggleClass = function (className) {

            var keys = this.__class_names;

            if (keys && className)
            {
                if (keys[className])
                {
                    delete keys[className];
                    this.className = Object.keys(keys).join(" ");
                }
                else
                {
                    this.className += " " + className;
                }
            }
        };




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

            //清空缓存样式表
            this.__style_version = 0;

            //状态变更事件
            this.dispatchEvent(new flyingon.ChangeEvent("statechange", this, name, value));

            //样式变更可能需要重新布局
            (this.__parent || this).invalidate(true);
        };


        //获取状态图片(图片资源有命名规则要求) active -> hover -> checked -> common
        this.__fn_state_image = function (image, checked) {

            var states = this.__states,
                images = [];

            if (states)
            {
                if (states.active)
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


    }).call(this, flyingon);




    //样式相关
    (function (flyingon) {




        //当前样式版本(控制样式组缓存更新)
        flyingon.__style_version = 0;



        var self = this,

            style_split_fn = {},    //样式拆分函数

            style_data_type = {},  //样式数据类型

            style_sheets = {},      //样式表集合

            style_type_fn = {},     //样式类型检查函数

            style_pseudo_fn = {},   //样式伪类检查函数

            style_cache_list = {},  //缓存样式值集合`  注:为加快样式值查找对所有样式按元素类型进行分类存储 此处的优先级可能与css样式有些差异???

            style_type_names = {},  //样式类别名集合(按类别缓存样式) 缓存方式: 属性名 -> 类别 -> 权重 -> [选择器, 样式值]

            convert_name_regex = /[-_](\w)/g,   //名称转换规则 例: margin-left || margin_left -> marginLeft

            pseudo_keys = {         //伪类key 不在此列即为伪元素 value为伪元素权重 默认为10

                selection: 16,
                enabled: 15,
                disabled: 15,
                active: 14,
                hover: 13,
                focus: 12,
                checked: 11
            };





        //当前版本
        this.__style_version = 0;

        //样式类别
        this.__style_types = null;




        //修改集合项为首字母大写
        function toUpperCase(values, prefix) {

            prefix = prefix || "";

            for (var i = 0, _ = values.length; i < _; i++)
            {
                values[i] = prefix + values[i][0].toUpperCase() + values[i].substring(1);
            }

            return values;
        };


        //定义复合属性 不存储实际数据 通过定义属性进行操作
        function complex(name, getter, split_fn) {

            var name = name.replace(convert_name_regex, function (_, x) {

                return x.toUpperCase();
            });

            if (getter.constructor !== Function) //如果getter为数组则表示子属性
            {
                var template, names;

                if (getter[1].constructor !== String)
                {
                    template = getter[0];
                    names = getter[1];
                }
                else
                {
                    template = name + "-?";
                    names = getter;
                }

                for (var i = 0, _ = names.length; i < _; i++)
                {
                    names[i] = "this." + template.replace("?", names[i]).replace(convert_name_regex, function (_, x) {

                        return x.toUpperCase();
                    });
                }

                getter = new Function("return [" + names.join(",") + "].join(\" \");")

                if (!split_fn) //未指定则默认拆分成4个值 只有一个值则全部相等 两个值则2,3=0,1 3个值则3=1
                {
                    var body = "\n";

                    for (var i = 0, _ = names.length; i < _; i++)
                    {
                        body += names[i] + " = values[" + i + "];\n";
                    }

                    split_fn = new Function("value", (function () {

                        var values = value && ("" + value).match(/[\w-_%]+/g);

                        if (values)
                        {
                            switch (values.length)
                            {
                                case 1:
                                    values[1] = values[2] = values[3] = values[0];
                                    break;

                                case 2:
                                    values[2] = values[0];
                                    values[3] = values[1];
                                    break;

                                default:
                                    values[3] = values[1];
                                    break;
                            }
                        }
                        else
                        {
                            values = [];
                        }

                    }).get_body() + body);
                }
            }

            flyingon.defineProperty(self, name, getter, style_split_fn[name] = split_fn);
        };


        //创建样式
        function style(name, defaultValue, inherit) {

            name = name.replace(convert_name_regex, function (_, x) {

                return x.toUpperCase();
            });

            var getter = "var value;\n"
                    + "if ((value = this.__style." + name
                        + " || (this.__style_version === flyingon.__style_version && this.__styleSheets." + name + ")"
                        + " || (this.__styleSheets." + name + " = this.__fn_style_value(\"" + name + "\"))"
                    + ") !== undefined)\n"
                    + "{\n"
                    + "return value;\n"
                    + "}\n"
                    + "return "
                    + (inherit ? "this.__parent ? this.__parent.__style." + name + " : " : "")
                    + (typeof defaultValue === "string" ? "\"" + defaultValue + "\"" : defaultValue)
                    + ";",

                setter = "var data = this.__style, oldValue = data." + name + ";\n";

            //根据默认值类型进行类型转换
            switch (typeof defaultValue)
            {
                case "boolean":
                    style_data_type[name] = 0;
                    setter += "value = !!value;\n";
                    break;

                case "number":
                    style_data_type[name] = 1;
                    setter += "value = +value;\n";
                    break;
            }

            setter += "if (value !== oldValue)\n"
                   + "{\n"
                   + "data." + name + " = value;\n"
                   + "}\n";

            flyingon.defineProperty(self, name, new Function(getter), new Function("value", setter));
        };


        //创建多个相同性质的样式
        function styles(template, names, defaultValue, inherit) {

            for (var i = 0, _ = names.length; i < _; i++)
            {
                style(template.replace("?", names[i]), defaultValue, inherit);
            }
        };




        //auto	    自动 
        //fill      充满可用空间
        //content   根据内容自动调整
        //number	数值
        styles("?", ["width", "height"], "auto", false);


        //number	数值
        styles("?", ["top", "left"], 0, false);

        //number	数值
        styles("?", ["offsetX", "offsetY"], 0, false);


        //number	数值 
        styles("min-?", ["width", "height"], 0, false);


        //number	定义元素的最大宽度值 
        styles("max-?", ["width", "height"], 0, false);


        //number	数值 
        style("line-height", 12, true);


        //number	数值 
        style("z-index", 0, false);



        //是否在同行显示 仅对流式布局有效 
        //true:     强制在新行显示
        //false:    尝试在当前行显示,显示不下才换行
        style("newline", false, false);

        //停靠方式
        //left:   左见枚举
        //top:    顶部见枚举
        //right:  右见枚举
        //bottom: 底部见枚举
        //fill:   充满
        style("dock", "left", false);


        //以下layout属性仅对Panel有效
        //当前布局类型
        //line:     线性布局
        //flow:     流式布局
        //single:   单个显示
        //dock:     停靠布局
        //queue:    队列布局
        //grid:     网格布局
        //absolute: 绝对定位
        style("layout-type", "flow", false);

        //布局x轴间隔 0-1之间表示间隔值为总宽度百分比
        style("layout-spaceX", 0, false);

        //布局y轴间隔 0-1之间表示间隔值为总高度的百分比
        style("layout-spaceY", 0, false);

        //当前布局页
        style("layout-page", 0, false);

        //布局列数
        style("layout-columns", 3, false);

        //布局行数
        style("layout-rows", 3, false);

        //布局网格
        style("layout-grid", "T R* C* C* C* R* C* C* C* R* C* C* C* END", false);


        //行高
        style("row-height", 0, false);

        //列宽
        style("column-width", 0, false);




        complex("overflow", ["x", "y"], function (value) {

            var values = value.match(/\w+/g);

            if (values)
            {
                this.overflowX = values[0];
                this.overflowY = values[1] || values[0];
            }
        });

        //visible   默认值 内容不会被修剪 会呈现在元素框之外
        //hidden    内容会被修剪 其余内容是不可见的
        //scroll	内容会被修剪 但是浏览器会显示滚动条以便查看其余的内容
        //auto      如果内容被修剪 则浏览器会显示滚动条以便查看其余的内容
        styles("overflow-?", ["x", "y"], "visible", false);




        //visible	默认值 元素是可见的 
        //hidden	元素是不可见的 
        //collapse	当在表格元素中使用时, 此值可删除一行或一列, 但是它不会影响表格的布局 被行或列占据的空间会留给其他内容使用 如果此值被用在其他的元素上, 会呈现为 "hidden" 
        style("visibility", "visible", true);

        //value	规定不透明度 从 0.0 （完全透明）到 1.0（完全不透明） 	测试
        style("opacity", 1, false);

        //url	    需使用的自定义光标的 URL     注释：请在此列表的末端始终定义一种普通的光标, 以防没有由 URL 定义的可用光标 
        //default	默认光标（通常是一个箭头）
        //auto	    默认 浏览器设置的光标 
        //crosshair	光标呈现为十字线 
        //pointer	光标呈现为指示链接的指针（一只手）
        //move	    此光标指示某对象可被移动 
        //e-resize	此光标指示矩形框的边缘可被向右（东）移动 
        //ne-resize	此光标指示矩形框的边缘可被向上及向右移动（北/东） 
        //nw-resize	此光标指示矩形框的边缘可被向上及向左移动（北/西） 
        //n-resize	此光标指示矩形框的边缘可被向上（北）移动 
        //se-resize	此光标指示矩形框的边缘可被向下及向右移动（南/东） 
        //sw-resize	此光标指示矩形框的边缘可被向下及向左移动（南/西） 
        //s-resize	此光标指示矩形框的边缘可被向下移动（南） 
        //w-resize	此光标指示矩形框的边缘可被向左移动（西） 
        //text	    此光标指示文本 
        //wait	    此光标指示程序正忙（通常是一只表或沙漏） 
        //help	    此光标指示可用的帮助（通常是一个问号或一个气球） 
        style("cursor", "auto", true);

        //ltr	    默认 文本方向从左到右 
        //rtl	    文本方向从右到左 
        style("direction", "ltr", true);

        //是否竖排 非css属性
        //true      竖排
        //false     横排
        style("vertical", false, false);


        //shape	    设置元素的形状 唯一合法的形状值是：rect (top, right, bottom, left)
        //auto	    默认值 不应用任何剪裁 
        style("clip", "auto", false);


        //margin
        complex("margin", ["top", "right", "bottom", "left"]);


        //number	数值 
        styles("margin-?", ["top", "right", "bottom", "left"], 0, false);



        //拆分边框
        //必须按照 width -> style -> color 的顺序编写 可省略某些属性 未传入有效数据则清空相关属性
        function split_border(name) {

            var regex = /(\d+)?\s*(none|hidden|dotted|dashed|solid|double|groove|ridge|inset)?\s*(\S+)?/,
                names = toUpperCase(["width", "style", "color"], "border" + (name ? name[0].toUpperCase() + name.substring(1) : ""));

            return function (value) {

                if (value)
                {
                    var self = this;

                    ("" + value).replace(regex, function (_, width, style, color) {

                        self[names[0]] = width;
                        self[names[1]] = style;
                        self[names[2]] = color;
                    });
                }
            };
        };

        //border-width	规定边框的宽度 参阅：border-width 中可能的值 
        //border-style	规定边框的样式 参阅：border-style 中可能的值 
        //border-color	规定边框的颜色 参阅：border-color 中可能的值 
        complex("border", (function () {

            var items1 = toUpperCase(["width", "style", "color"]),
                items2 = toUpperCase(["top", "right", "bottom", "left"]);

            return function () {

                var values = [];

                loop:
                    for (var i = 0; i < 3; i++)
                    {
                        var name = items1[i],
                            value = this["border" + items2[0] + name];

                        for (var j = 1; j < 4; j++)
                        {
                            if (value !== this["border" + items2[j] + name])
                            {
                                continue loop;
                            }
                        }

                        values.push(value);
                    }

                return values.join(" ");
            };

        })(), split_border());

        //border-top-width	规outset定上边框的宽度 参阅：border-top-width 中可能的值 
        //border-top-style	规inherit定上边框的样式 参阅：border-top-style 中可能的值 
        //border-top-color	规定上边框的颜色 参阅：border-top-color 中可能的值 
        complex("border-top", ["width", "style", "color"], split_border("top"));

        //border-right-width	规定右边框的宽度 参阅：border-right-width 中可能的值 
        //border-right-style	规定右边框的样式 参阅：border-right-style 中可能的值 
        //border-right-color	规定右边框的颜色 参阅：border-right-color 中可能的值 
        complex("border-right", ["width", "style", "color"], split_border("right"));

        //border-bottom-width	规定下边框的宽度 参阅：border-bottom-width 中可能的值 
        //border-bottom-style	规定下边框的样式 参阅：border-bottom-style 中可能的值 
        //border-bottom-color	规定下边框的颜色 参阅：border-bottom-color 中可能的值 
        complex("border-bottom", ["width", "style", "color"], split_border("bottom"));

        //border-left-width	规定左边框的宽度 参阅：border-left-width 中可能的值 
        //border-left-style	规定左边框的样式 参阅：border-left-style 中可能的值 
        //border-left-color	规定左边框的颜色 参阅：border-left-color 中可能的值 
        complex("border-left", ["width", "style", "color"], split_border("left"));

        //
        complex("border-style", ["border-?-style", ["top", "right", "bottom", "left"]]);

        //none	    定义无边框 
        //hidden	与 "none" 相同 不过应用于表时除外, 对于表, hidden 用于解决边框冲突 
        //dotted	定义点状边框 在大多数浏览器中呈现为实线 
        //dashed	定义虚线 在大多数浏览器中呈现为实线 
        //solid	    定义实线 
        //double	定义双线 双线的宽度等于 border-width 的值 
        //groove	定义 3D 凹槽边框 其效果取决于 border-color 的值 
        //ridge	    定义 3D 垄状边框 其效果取决于 border-color 的值 
        //inset	    定义 3D inset 边框 其效果取决于 border-color 的值 
        //outset	定义 3D outset 边框 其效果取决于 border-color 的值 
        styles("border-?-style", ["top", "right", "bottom", "left"], "none", false);

        //
        complex("border-width", ["border-?-width", ["top", "right", "bottom", "left"]]);

        //number	数值 
        styles("border-?-width", ["top", "right", "bottom", "left"], 0, false);

        //
        complex("border-color", ["border-?-color", ["top", "right", "bottom", "left"]]);

        //color_name	规定颜色值为颜色名称的边框颜色（比如 red） 
        //hex_number	规定颜色值为十六进制值的边框颜色（比如 #ff0000） 
        //rgb_number	规定颜色值为 rgb 代码的边框颜色（比如 rgb(255,0,0)） 
        //transparent	默认值 边框颜色为透明 
        //inherit	    规定应该从父元素继承边框颜色 
        styles("border-?-color", ["top", "right", "bottom", "left"], "transparent", false);

        //
        complex("border-radius", ["border-?-radius", ["top-left", "top-right", "bottom-left", "bottom-right"]]);

        //number	数值
        styles("border-?-radius", ["top-left", "top-right", "bottom-left", "bottom-right"], 0, false);


        //"border-collapse"
        //"border-image"
        //"border-image-outset"
        //"border-image-repeat"
        //"border-image-slice"
        //"border-image-source"
        //"border-image-width"





        complex("padding", ["top", "right", "bottom", "left"]);

        //number	数值
        styles("padding-?", ["top", "right", "bottom", "left"], 0, false);



        //必须按照 color -> image -> repeat -> attachment -> position -> family 的顺序编写 可省略某些属性
        complex("background", ["color", "image", "repeat", "attachment", "position"], (function () {

            var regex = /(none|url\([^\)]*\))|(repeat|repeat-x|repeat-y|no-repeat)|(scroll|fixed)|(left|top|center|right|bottom|\d+[\w%]*)|\S+/g,
                names = toUpperCase(["color", "image", "repeat", "attachment", "position"], "background"),
                name;

            return function (value) {

                if (value)
                {
                    var values, cache;

                    ("" + value).replace(regex, function (_, image, repeat, attachment, position, color) {

                        values = values || {};

                        color && (values.color = color);
                        image && (values.mage = image);
                        repeat && (values.repeat = repeat);
                        attachment && (values.attachment = attachment);

                        if (position)
                        {
                            switch (position)
                            {
                                case "top":
                                    cache ? (cache[1] = "0%") : (cache = ["50%", "0%"]);
                                    break;

                                case "left":
                                    cache ? (cache[0] = "0%") : (cache = ["0%", "50%"]);
                                    break;

                                case "center":
                                    cache ? (cache[1] = "50%") : (cache = ["50%", "50%"]);
                                    break;

                                case "right":
                                    cache ? (cache[0] = "100%") : (cache = ["100%", "50%"]);
                                    break;

                                case "bottom":
                                    cache ? (cache[1] = "100%") : (cache = ["50%", "100%"]);
                                    break;

                                default:
                                    cache ? (cache[1] = position) : (cache = [position, "50%"]);
                                    break;
                            }
                        }
                    });

                    if (values)
                    {
                        if (cache)
                        {
                            values.position = cache.join(" ");
                        }

                        for (var i = 0; i < 5; i++)
                        {
                            cache = names[i];
                            this[cache[1]] = values[cache[0]];
                        }
                    }
                }
            };

        })());

        //color_name	规定颜色值为颜色名称的背景颜色（比如 red） 
        //hex_number	规定颜色值为十六进制值的背景颜色（比如 #ff0000） 
        //rgb_number	规定颜色值为 rgb 代码的背景颜色（比如 rgb(255,0,0)） 
        //transparent	默认 背景颜色为透明 
        style("background-color", "transparent", false);

        //url('URL')	指向图像的路径 
        //none	        默认值 不显示背景图像 
        style("background-image", "none", false);

        //repeat	默认 背景图像将在垂直方向和水平方向重复 
        //repeat-x	背景图像将在水平方向重复 
        //repeat-y	背景图像将在垂直方向重复 
        //no-repeat	背景图像将仅显示一次 
        style("background-repeat", "repeat", false);

        //scroll	默认值 背景图像会随着页面其余部分的滚动而移动 
        //fixed	    当页面的其余部分滚动时, 背景图像不会移动 
        style("background-attachment", "scroll", false);

        //top left
        //top center
        //top right
        //center left
        //center center
        //center right
        //bottom left
        //bottom center
        //bottom right  如果您仅规定了一个关键词, 那么第二个值将是"center"     默认值：0% 0% 
        //x% y%	        第一个值是水平位置, 第二个值是垂直位置     左上角是 0% 0% 右下角是 100% 100%     如果您仅规定了一个值, 另一个值将是 50% 
        //xpos ypos	    第一个值是水平位置, 第二个值是垂直位置     左上角是 0 0 单位是像素 (0px 0px) 或任何其他的 CSS 单位     如果您仅规定了一个值, 另一个值将是50%     您可以混合使用 % 和 position 值 
        style("background-position", "0% 0%", false);

        //padding-box	背景图像相对于内边距框来定位 	
        //border-box	背景图像相对于边框盒来定位 	
        //content-box	背景图像相对于内容框来定位 
        style("background-origin", "padding-box", false);

        //length	    设置背景图像的高度和宽度     第一个值设置宽度, 第二个值设置高度     如果只设置一个值, 则第二个值会被设置为 "auto" 
        //percentage	以父元素的百分比来设置背景图像的宽度和高度     第一个值设置宽度, 第二个值设置高度     如果只设置一个值, 则第二个值会被设置为 "auto" 
        //cover	        把背景图像扩展至足够大, 以使背景图像完全覆盖背景区域     背景图像的某些部分也许无法显示在背景定位区域中 
        //contain	    把图像图像扩展至最大尺寸, 以使其宽度和高度完全适应内容区域 
        style("background-size", "auto", false);

        //border-box	背景被裁剪到边框盒 
        //padding-box	背景被裁剪到内边距框 
        //content-box	背景被裁剪到内容框 
        style("background-clip", "border-box", false);



        //color_name	规定颜色值为颜色名称的颜色（比如 red） 
        //hex_number	规定颜色值为十六进制值的颜色（比如 #ff0000） 
        //rgb_number	规定颜色值为 rgb 代码的颜色（比如 rgb(255,0,0)） 
        style("color", "black", true);




        //必须按照 style -> variant -> weight -> size -> line-height -> family 的顺序编写 可省略某些属性
        complex("font",

            function () {

                return this.fontStyle + " " + this.fontVariant + " " + this.fontWeight + " " + this.fontSize + "px " + this.fontFamily;
            },

            (function () {

                var regex = /(normal|italic|oblique)?\s*(normal|small-caps)?\s*(normal|bold|bolder|lighter|100|200|300|400|500|600|700|800|900)?\s*(\d+)?\s*\/?\s*(\d+[\w|%]*)?/;

                return function (value) {

                    if (value)
                    {
                        var self = this;

                        (value = "" + value).replace(regex, function (all, style, variant, weight, size, lineHeight) {

                            style && (self.fontStyle = style);
                            variant && (self.fontVariant = variant);
                            weight && (self.fontWeight = weight);
                            size && (self.fontSize = size);
                            lineHeight && (self.lineHeight = lineHeight);

                            if (value.length > all.length)
                            {
                                self.fontFamily = value.substring(all.length);
                            }
                        });
                    }
                };

            })());

        //normal	默认值 浏览器显示一个标准的字体样式 
        //italic	浏览器会显示一个斜体的字体样式 
        //oblique	浏览器会显示一个倾斜的字体样式 
        style("font-style", "normal", true);

        //normal	    默认值 浏览器会显示一个标准的字体 
        //small-caps	浏览器会显示小型大写字母的字体 
        style("font-variant", "normal", true);

        //normal	默认值 定义标准的字符 
        //bold	    定义粗体字符 
        //bolder	定义更粗的字符 
        //lighter	定义更细的字符 
        //100-900   定义由粗到细的字符 400 等同于 normal, 而 700 等同于 bold 
        style("font-weight", "normal", true);

        //number	数值
        style("font-size", 12, true);

        //family-name generic-family  用于某个元素的字体族名称或/及类族名称的一个优先表  默认值：取决于浏览器 
        style("font-family", "arial,宋体,sans-serif", true);


        //left	    把文本排列到左边 默认值：由浏览器决定 
        //right	    把文本排列到右边 
        //center	把文本排列到中间 
        style("text-align", "left", true);

        //top	        把元素的顶端与行中最高元素的顶端对齐
        //middle	    把此元素放置在父元素的中部 
        //bottom	    把元素的顶端与行中最低的元素的顶端对齐 
        style("vertical-align", "top", false);

        //number	数值 
        style("letter-spacing", 0, true);

        //number	数值 
        style("word-spacing", 0, true);

        //number	数值 
        style("text-indent", 0, true);

        //none	        默认 定义标准的文本 
        //underline	    定义文本下的一条线 
        //overline	    定义文本上的一条线 
        //line-through	定义穿过文本下的一条线 
        //blink	        定义闪烁的文本 
        style("text-decoration", "none", false);

        //文字换行
        //false	    不换行
        //true	    自动换行
        style("text-wrap", false, false)


        //clip	    修剪文本 	测试
        //ellipsis	显示省略符号来代表被修剪的文本 	
        //string	使用给定的字符串来代表被修剪的文本 
        //"text-overflow"

        //none	        默认 定义带有小写字母和大写字母的标准的文本 
        //capitalize	文本中的每个单词以大写字母开头 
        //uppercase	    定义仅有大写字母 
        //lowercase	    定义无大写字母, 仅有小写字母 
        //"text-transform"

        //normal	    默认 空白会被浏览器忽略 
        //pre	        空白会被浏览器保留 其行为方式类似 HTML 中的 <pre> 标签 
        //nowrap	    文本不会换行, 文本会在在同一行上继续, 直到遇到 <br> 标签为止 
        //pre-wrap	    保留空白符序列, 但是正常地进行换行 
        //pre-line	    合并空白符序列, 但是保留换行符 
        //"white-space"

        //normal	    使用浏览器默认的换行规则 
        //break-all	    允许在单词内换行 
        //keep-all	    只能在半角空格或连字符处换行 
        //"word-break"

        //normal	    只在允许的断字点换行（浏览器保持默认处理） 
        //break-word	在长单词或 URL 地址内部进行换行 
        //"word-wrap"


        //销毁
        complex = style = styles = null;





        //cssText
        flyingon.defineProperty(this, "style",

            function () {

                var data = [],
                    style = this.__style;

                for (var name in style)
                {
                    data.push(name + ":" + style[name]);
                }

                return data.join(";");
            },

            function (value) {

                var style = this.__style = Object.create(null);

                if (value)
                {
                    if (value.constructor === String)
                    {
                        var values = value.replace(convert_name_regex, function (_, x) {

                            return x.toUpperCase();

                        }).split(/\s*:\s*|\s*;\s*/g);

                        for (var i = 0, length = values.length; i < length; i++)
                        {
                            style[values[i++]] = values[i] || "";
                        }
                    }
                    else
                    {
                        for (var name in value)
                        {
                            style[name] = value[name];
                        }
                    }
                }
            });




        //获取样式值
        this.__fn_style_value = function (name) {

            var cache_name = style_cache_list[name],
                cache_type;

            if (cache_name)
            {
                var types = this.__style_types || this.__fn_style_types();

                for (var i = 0, _ = types.length; i < _; i++)
                {
                    if (cache_type = cache_name[types[i]])
                    {
                        var weights = cache_type.__weights || (cache_type.__weights = Object.keys(cache_type));

                        next:
                            for (var j = weights.length - 1; j >= 0; j--)
                            {
                                var target = this,
                                    values = cache_type[weights[j]],
                                    selector = values[0],
                                    end = selector.length - 1,
                                    node = selector[end];

                                //处理伪元素
                                if (node.token === ":" && (!(target = style_pseudo_fn[node.name]) || target(node, target) === undefined))
                                {
                                    continue;
                                }

                                //检测属性
                                for (var index = 0, _ = node.length ; i < _; i++)
                                {
                                    if (node[index].check(target) === false)
                                    {
                                        continue next;
                                    }
                                }

                                //继续处理上一节点
                                if (end > 0 && style_type_fn[node.type](selector, 1, target) === false)
                                {
                                    continue;
                                }

                                return values[1];
                            }
                    }
                }
            }
        };


        //重置样式类别排除无关的样式
        this.__fn_style_types = function () {

            var Control = flyingon.Control,
                types = [],
                names = style_type_names,
                cache;

            //all
            types.push("*");

            //type
            var type = this.__class_type;

            while (type && type !== Control)
            {
                if (names[cache = type.fullTypeName])
                {
                    types.push(cache);
                }

                type = type.superclass;
            }

            //class
            if (this.__class_names)
            {
                var keys = this.__keys;

                for (var i = 0, _ = keys.length; i < _; i++) //后置优先
                {
                    if (names[cache = "." + keys[i]])
                    {
                        types.push(cache);
                    }
                }
            }

            //id
            if ((cache = this.id) && (names[cache = "#" + cache]))
            {
                types.push(cache);
            }

            //重置样式
            this.__style_version = flyingon.__style_version;
            this.__styleSheets = Object.create(null);
            return this.__style_types = types;
        };



        //重置样式
        this.__fn_reset_style = function () {

            this.__style_version = 0;
            this.__style_types = null;
        };





        //已注册的样式表
        flyingon.styleSheets = function () {

            return style_sheets;
        };


        //定义样式
        flyingon.defineStyle = function (selector, style, super_selector) {

            if (selector && style)
            {
                var cache;

                //处理继承
                if (super_selector && (cache = style_sheets[super_selector]))
                {
                    for (var name in cache)
                    {
                        if (!style[name])
                        {
                            style[name] = cache[name];
                        }
                    }
                }

                //缓存样式
                style_sheets[selector] = style;

                //解析选择器
                selector = flyingon.parse_selector(selector);

                if (selector.forks) //如果存在分支则拆分分支为独立选择器
                {
                    selector = split_selector(selector);

                    for (var i = selector.length - 1; i >= 0; i--)
                    {
                        handle_style(selector[i], style);
                    }
                }
                else
                {
                    handle_style(selector, style);
                }

                flyingon.__style_version++;
            }
        };


        //重置样式表
        flyingon.reset_styleSheets = function () {

            flyingon.clear_styleSheets();

            for (var name in style_sheets)
            {
                flyingon.defineStyle(name, style);
            }
        };


        //清除所有样式
        flyingon.clear_styleSheets = function () {

            style_sheets = {};
            style_cache_list = {};
            style_type_names = {};

            flyingon.__style_version++;
        };



        //拆分有分支的选择器为多个独立选择器
        function split_selector(selector) {

            var result = [],                    //结果集
                forks = selector.forks,         //分支位置集合
                fill = 1,                       //每一轮的填充个数(从后到前逐级递增)
                total = 1;                      //总数

            //计算总结果数
            for (var i = forks.length - 1; i >= 0; i--)
            {
                total *= selector[forks[i]].length;
            }

            result.length = total;

            //先全部复制选择器内容
            for (var i = 0; i < total; i++)
            {
                result[i] = selector.slice(0);
            }

            //再从后到前替换每个分支子项
            for (var i = forks.length - 1; i >= 0; i--)
            {
                var index = forks[i],            //目标位置
                    nodes = selector[index],     //当前分支节点
                    length = nodes.length,
                    j = 0;                       //填充位置

                while (j < total)
                {
                    for (var j1 = 0; j1 < length; j1++)
                    {
                        var node = nodes[j1];

                        for (var j2 = 0; j2 < fill; j2++)
                        {
                            result[j++][index] = node;
                        }
                    }
                }

                fill *= length;
            }

            return result;
        };



        //处理样式 按样式属性名存储 再根据
        function handle_style(selector, style) {

            var type = selector[selector.length - 1],
                value;

            //以最后一个节点的 token + name 作为样式类别并缓存样式类别名 (伪元素以*作为样式类别名)
            style_type_names[type = type.token !== ":" ? type.token + type.name : "*"] = true;

            //以字符串作为选择器key(不包含属性值)
            selector.key = selector.join("");

            for (var name in style)
            {
                if (value = style[name]) //未注册的属性及未设置样式值则不处理
                {
                    name = name.replace(convert_name_regex, function (_, x) {

                        return x.toUpperCase();
                    });

                    //复合样式进行拆分 然后丢弃
                    if (name in style_split_fn)
                    {
                        var values = {};
                        style_split_fn[name].call(values, value);

                        for (var key in values)
                        {
                            if (value = values[key])
                            {
                                store_style(selector, type, key, value);
                            }
                        }
                    }
                    else
                    {
                        store_style(selector, type, name, value);
                    }
                }
            }
        };


        //缓存样式
        function store_style(selector, type, name, value) {

            var weight = selector.weight || selector_weight(selector), //当前权重
                cache_name = style_cache_list[name],
                cache_type;

            //类型转换
            if (cache_type = style_data_type[name])
            {
                switch (cache_type)
                {
                    case 0: //布尔型
                        value = !!value;
                        break;

                    case 1: //数字型
                        value = +value;
                        break;
                }
            }

            if (cache_name) //已有属性
            {
                if (cache_type = cache_name[type])
                {
                    while ((cache_name = cache_type[weight]) && cache_name[0].key !== selector.key) //如果选择器相等则后置优先
                    {
                        weight++;
                    }

                    cache_type[weight] = [selector, value];
                    delete cache_type.__names;
                }
                else
                {
                    (cache_name[type] = {})[weight] = [selector, value];
                }
            }
            else
            {
                ((style_cache_list[name] = {})[type] = {})[weight] = [selector, value];
            }
        };



        //获取选择器的权重
        /*
        css选择器权重参考
        
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
        function selector_weight(selector) {

            var result = 0;

            for (var i = selector.length - 1; i >= 0; i--)
            {
                var node = selector[i];

                switch (node.token)
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

                    case ":": //伪元素
                        result += 10;
                        break;
                }

                for (var j = 0, _ = node.length; j < _; j++)
                {
                    result += pseudo_keys[node[j].name] || 10;
                }
            }

            return selector.weight = result << 8; //左移8个字节以留足中间插入的空间(即中间最多可插入256个元素)
        };




        //查询方法
        //注: ","组合类型已被拆分,此处不处理
        (function (pseudo_fn) {



            //未知伪元素检查函数
            function pseudo_unkown(node, target) {

            };


            //样式检测 检测指定对象是否符合当前选择器
            function check_node(selector, index, target) {

                switch (node.token)
                {
                    case "":  //类型
                        if (target.__fullTypeName !== node.name)
                        {
                            return false;
                        }
                        break;

                    case ".": //class
                        if (!target.className || !target.className[node.name])
                        {
                            return false;
                        }
                        break;

                    case "#": //id
                        if (target.id !== node.name)
                        {
                            return false;
                        }
                        break;

                    case ":": //伪元素
                        if ((target = (pseudo_fn[node.name] || pseudo_unkown)(node, target)) === undefined)
                        {
                            return false;
                        }
                        break;
                }

                //再检测属性及伪类(不包含伪元素)
                var length = node.length;

                if (length > 0)
                {
                    for (var i = 0; i < length; i++)
                    {
                        if (node[i].check(target) === false)
                        {
                            return false;
                        }
                    }
                }

                //继续检测上一节点
                if (selector.length > ++index && style_type_fn[node.type](selector, index, target) === false)
                {
                    return false;
                }

                return true;
            };



            this[" "] = function (selector, index, target) {

                var parent = target.__parent;

                while (parent)
                {
                    if (check_node(selector, index, parent))
                    {
                        return true;
                    }

                    parent = parent.__parent;
                }

                return false;
            };

            this[">"] = function (selector, index, target) {

                var parent = target.__parent;
                return parent ? check_node(selector, index, parent) : false;
            };

            this["+"] = function (selector, index, target) {

                var parent = target.__parent;

                if (parent)
                {
                    var children = parent.__children,
                        i = children.indexOf(target);

                    if (i > 0)
                    {
                        return check_node(selector, index, children[--i]);
                    }
                }

                return false;
            };

            this["~"] = function (selector, index, target) {

                var parent = target.__parent;

                if (parent)
                {
                    var children = parent.__children,
                        i = children.indexOf(target);

                    while (i-- > 0)
                    {
                        if (check_node(selector, index, children[i]))
                        {
                            return true;
                        }
                    }
                }

                return false;
            };




            pseudo_fn["before"] = function (node, target) {

                var parent = target.__parent;

                if (parent)
                {
                    var children = parent.__children,
                        index;

                    if (children.length > (index = children.indexOf(this)) + 1)
                    {
                        return children[++index];
                    }
                }
            };

            pseudo_fn["after"] = function (node, target) {

                var parent = target.__parent, index;

                if (parent)
                {
                    var children = parent.__children,
                        index;

                    if ((index = children.indexOf(this)) > 0)
                    {
                        return children[--index];
                    }
                }
            };

            pseudo_fn["first-child"] = pseudo_fn["first-of-type"] = function (node, target) {

                var parent = target.__parent;

                if (parent)
                {
                    var children = parent.__children;

                    if (children[0] === target)
                    {
                        if (node.name.length === 11 || target.__fullTypeName === parent.__fullTypeName)
                        {
                            return parent;
                        }
                    }
                }
            };

            pseudo_fn["last-child"] = pseudo_fn["last-of-type"] = function (node, target) {

                var parent = target.__parent;

                if (parent)
                {
                    var children = parent.__children;

                    if (children[children.length - 1] === target)
                    {
                        if (node.name.length === 10 || target.__fullTypeName === parent.__fullTypeName)
                        {
                            return parent;
                        }
                    }
                }
            };

            pseudo_fn["only-child"] = pseudo_fn["only-of-type"] = function (node, target) {

                var parent = target.__parent;

                if (parent)
                {
                    var children = parent.__children;

                    if (children.length === 1)
                    {
                        if (node.name.length === 10 || target.__fullTypeName === parent.__fullTypeName)
                        {
                            return parent;
                        }
                    }
                }
            };

            pseudo_fn["nth-child"] = pseudo_fn["nth-of-type"] = function (node, target) {

                var parent = target.__parent;

                if (parent)
                {
                    var children = parent.__children;

                    if (children[+node.parameters[0]] === target)
                    {
                        if (node.name.length === 9 || target.__fullTypeName === parent.__fullTypeName)
                        {
                            return parent;
                        }
                    }
                }
            };

            pseudo_fn["nth-last-child"] = pseudo_fn["nth-last-of-type"] = function (node, target) {

                var parent = target.__parent;

                if (parent)
                {
                    var children = parent.__children;

                    if (children[children.length - node.parameters[0]] === target)
                    {
                        if (node.name.length === 14 || target.__fullTypeName === parent.__fullTypeName)
                        {
                            return parent;
                        }
                    }
                }
            };


        }).call(style_type_fn, style_pseudo_fn);




    }).call(this, flyingon);




    //滚动条
    (function (flyingon) {



        var ScrollBar = flyingon.ScrollBar,
            Corner = flyingon.ScrollBar_Corner;



        //滚动条厚度
        flyingon.hscroll_thickness = flyingon.vscroll_thickness = 16;



        this.__event_scroll = function (event) {

            if (event.changeX)
            {
                this.contentX += event.changeX;
            }

            if (event.changeY)
            {
                this.contentY += event.changeY;
            }

            this.invalidate(false);

            //修正因滚动造成的输入符位置变更问题
            var ownerWindow = this.ownerWindow;
            if (ownerWindow && this.isParent(ownerWindow.__focused_control))
            {
                ownerWindow.__fn_change_caret(event.changeX, event.changeY);
            }

            event.stopPropagation();
            event.preventDefault();
        };


        this.__event_mousewheel = function (event) {

            var vscroll = this.__vscroll;

            if (vscroll)
            {
                var step = vscroll.min_change;

                if (event.wheelDelta > 0)
                {
                    step = -step;
                }

                vscroll.step_to(step);
                event.stopPropagation();
                event.preventDefault();
            }
        };




        //竖直滚动条是否在左边
        this.__hscroll_rtl = false;

        //是否需重新处理滚动条
        this.__scroll_dirty = false;




        function initialize(target, parent) {

            target.__parent = parent;
            target.__addtions = true;

            target.width = "fill";
            target.height = "fill";

            return target;
        };



        //标记水平滚动条
        this.__fn_sign_hscroll = function (visible, rtl) {

            var thickness = flyingon.hscroll_thickness;

            if (visible)
            {
                this.clientHeight -= thickness;
                this.insideHeight -= thickness;

                initialize(this.__hscroll = new ScrollBar(), this).direction = rtl ? "rtl" : "ltr";
            }
            else
            {
                this.clientHeight += thickness;
                this.insideHeight += thickness;

                this.__hscroll = null;
                this.__scroll_corner = null;
            }

            this.__scroll_dirty = true;
        };

        //标记竖直滚动条
        this.__fn_sign_vscroll = function (visible, rtl) {

            var thickness = flyingon.vscroll_thickness;

            if (visible)
            {
                if (rtl) //滚动在左边
                {
                    this.clientX += thickness;
                    this.insideX += thickness;
                }

                this.clientWidth -= thickness;
                this.insideWidth -= thickness;

                initialize(this.__vscroll = new ScrollBar(), this).vertical = true;
                this.__vscroll.direction = "ltr";
            }
            else
            {
                if (rtl) //滚动条在左边
                {
                    this.clientX -= thickness;
                    this.insideX -= thickness;
                }

                this.clientWidth += thickness;
                this.insideWidth += thickness;

                this.__vscroll = null;
                this.__scroll_corner = null;
            }

            this.__vscroll_rtl = rtl;
            this.__scroll_dirty = true;
        };


        //测量滚动条 需先进行标记
        this.__fn_measure_scroll = function () {

            var thickness1 = flyingon.hscroll_thickness,
                thickness2 = flyingon.vscroll_thickness,
                hscroll = this.__hscroll,
                vscroll = this.__vscroll;

            //有水平滚动条
            if (hscroll)
            {
                hscroll.value = this.contentX;
                hscroll.length = this.contentWidth;
                hscroll.viewportSize = this.clientWidth;

                hscroll.__fn_measure(this.insideWidth, thickness1, true);
                hscroll.__fn_position(this.insideX, this.insideHeight);
            }

            //有竖直滚动条
            if (vscroll)
            {
                vscroll.value = this.contentY;
                vscroll.length = this.contentHeight;
                vscroll.viewportSize = this.clientHeight;

                vscroll.__fn_measure(thickness2, this.insideHeight, true);
                vscroll.__fn_position(this.__scroll_rtl ? this.insideX : this.insideWidth, this.insideY);
            }

            //有双滚动条时生成拐角
            if (hscroll && vscroll)
            {
                var corner = initialize(this.__scroll_corner = new ScrollBar_Corner(), this);

                corner.__fn_measure(thickness2, thickness1, true);
                corner.__fn_position(this.__scroll_rtl ? this.insideX : this.insideWidth, this.insideHeight);
            }

            this.__scroll_dirty = false;
        };



    }).call(this, flyingon);




    //盒模型
    (function (flyingon) {



        //是否需要渲染
        this.__visible = true;


        //注: 布局区域 >= 可视区域 >= 内部区域 >= 客户区域

        //布局区域范围
        this.layoutX = 0;
        this.layoutY = 0;
        this.layoutWidth = 0;
        this.layoutHeight = 0;


        //可视区域范围(含边框及滚动条)
        this.visualX = 0;
        this.visualY = 0;
        this.visualWidth = 0;
        this.visualHeight = 0;


        //内部区域范围(不含边框及滚动条)
        this.insideX = 0;     //相对可视区偏移
        this.insideY = 0;     //相对可视区偏移
        this.insideWidth = 0;
        this.insideHeight = 0;


        //客户区域范围(不含内边距)
        this.clientX = 0;     //相对可视区偏移
        this.clientY = 0;     //相对可视区偏移
        this.clientWidth = 0;
        this.clientHeight = 0;


        //内容区域范围(实际内容大小,默认等于客户区域范围)
        this.contentX = 0;
        this.contentY = 0;
        this.contentWidth = 0;
        this.contentHeight = 0;


        //相对窗口坐标(以边框左上角为基点)
        this.windowX = 0;
        this.windowY = 0;


        //是否需要重新布局
        this.__arrange_dirty = true;

        //是否需要重绘
        this.__self_dirty = false;

        //子控件是否需要重绘
        this.__children_dirty = false;

        //父控件是否需要重绘
        this.__update_parent = false;




        //测量大小
        //usable_width      可用宽度
        //usable_height     可用高度
        //auto_to_fill      自动大小转充满
        //less_to_default   空间不足时使用默认大小
        //ignore_margin     忽略外边距
        this.__fn_measure = function (usable_width, usable_height, auto_to_fill, less_to_default, ignore_margin) {


            var margin_x,
                margin_y,

                border_x = this.insideY = this.borderLeftWidth,
                border_y = this.insideX = this.borderTopWidth,

                padding_x = this.paddingLeft,
                padding_y = this.paddingTop,

                auto_width = false,
                auto_height = false,

                value,
                cache;


            //计算客户区位置
            this.clientX = border_x + padding_x;
            this.clientY = border_y + padding_y;


            //处理盒模型
            if (ignore_margin) //忽略margin 绝对定位时不使用margin
            {
                margin_x = margin_y = this.visualX = this.visualY = 0;
            }
            else
            {
                margin_x = (this.visualX = this.marginLeft) + this.marginRight;
                margin_y = (this.visualY = this.marginTop) + this.marginBottom;
            }

            border_x += this.borderRightWidth;
            border_y += this.borderBottomWidth;

            padding_x += this.paddingRight;
            padding_y += this.paddingBottom;


            //处理宽度
            if (value = +(cache = this.width)) //固定大小
            {
                this.visualWidth = value;
            }
            else
            {
                switch (cache)
                {
                    case "auto": //默认
                        if (auto_to_fill)
                        {
                            cache = true;
                        }
                        else
                        {
                            this.visualWidth = this.__defaults.width;
                        }
                        break;

                    case "fill": //充满可用区域
                        cache = true;
                        break;

                    case "content": //根据内容自动调整大小
                        auto_width = true;
                        cache = true;
                        break;

                    default:  //百分比
                        this.visualWidth = this.__parent ? Math.round(this.__parent.clientWidth * parseFloat(cache) / 100) : 0;
                        break;
                }

                //充满可用宽度
                if (cache === true)
                {
                    if (usable_width > margin_x + border_x + padding_x) //至少可以显示边框及内边距
                    {
                        this.visualWidth = usable_width - margin_x;
                    }
                    else if (less_to_default) //可用空间不足时使用默认宽度
                    {
                        this.visualWidth = this.__defaults.width;
                    }
                    else //有多少用多少
                    {
                        this.visualWidth = usable_width > margin_x ? usable_width - margin_x : 0;
                    }
                }
            }


            //处理高度
            if (value = +(cache = this.height)) //固定大小
            {
                this.visualHeight = value;
            }
            else
            {
                switch (cache)
                {
                    case "auto": //自动
                        if (auto_to_fill)
                        {
                            cache = true;
                        }
                        else
                        {
                            this.visualHeight = this.__defaults.height;
                        }
                        break;

                    case "fill": //充满可用区域
                        cache = true;
                        break;

                    case "content": //根据内容自动调整大小
                        auto_height = true;
                        cache = true;
                        break;

                    default:  //百分比
                        this.visualHeight = this.__parent ? Math.round(this.__parent.clientHeight * parseFloat(cache) / 100) : 0;
                        break;
                }

                //充满可用高度
                if (cache === true)
                {
                    if (usable_height > margin_y + border_y + padding_y) //至少可以显示边框及内边距
                    {
                        this.visualHeight = usable_height - margin_y;
                    }
                    else if (less_to_default) //可用空间不足时使用默认高度
                    {
                        this.visualHeight = this.__defaults.height;
                    }
                    else //有多少用多少
                    {
                        this.visualHeight = usable_height > margin_y ? usable_height - margin_y : 0;
                    }
                }
            }


            //处理最小最大值
            if (this.visualWidth < (cache = this.minWidth))
            {
                this.visualWidth = cache;
            }
            else if (this.visualWidth > (cache = this.maxWidth))
            {
                this.visualWidth = cache;
            }

            if (this.visualHeight < (cache = this.minHeight))
            {
                this.visualHeight = cache;
            }
            else if (this.visualHeight > (cache = this.maxHeight))
            {
                this.visualHeight = cache;
            }


            //计算内部区域及客户区域大小
            if ((this.insideWidth = this.visualWidth - border_x) <= 0)
            {
                this.insideWidth = 0;
                this.clientWidth = 0;
            }
            else if ((this.clientWidth = this.insideWidth - padding_x) < 0)
            {
                this.clientWidth = 0;
            }

            if ((this.insideHeight = this.visualHeight - border_y) <= 0)
            {
                this.insideHeight = 0;
                this.clientHeight = 0;
            }
            else if ((this.clientHeight = this.insideHeight - padding_y) < 0)
            {
                this.clientHeight = 0;
            }


            //处理自动宽高
            if (auto_width || auto_height)
            {
                this.__fn_measure_auto(auto_width, auto_height);

                //重计算宽度
                if (auto_width)
                {
                    this.clientWidth = this.contentWidth;
                    this.insideWidth = this.clientWidth + padding_x;
                    this.visualWidth = this.insideWidth + border_x;
                }

                //重计算高度
                if (auto_height)
                {
                    this.clientHeight = this.contentHeight;
                    this.insideHeight = this.clientHeight + padding_y;
                    this.visualHeight = this.insideHeight + border_y;
                }
            }


            //计算布局区域大小
            this.layoutWidth = this.visualWidth + margin_x;
            this.layoutHeight = this.visualHeight + margin_y;
        };


        //测量自动宽高
        this.__fn_measure_auto = function (auto_width, auto_height) {

            this.__fn_arrange();
        };


        //计算位置(需先调用__fn_measure方法后才可调用此方法)
        this.__fn_position = function (x, y, align_width, align_height) {

            var cache;

            //计算水平对齐(对齐宽度小于布局宽度时不处理)
            if (align_width > 0)
            {
                switch (cache = this.textAlign)
                {
                    case "center":
                        x += (align_width - this.visualWidth) >> 1;
                        break;

                    case "right":
                        x += align_width - this.visualWidth;
                        break;
                }
            }

            //计算竖直对齐(对齐高度小于布局高度时不处理)
            if (align_height > 0)
            {
                switch (cache = this.verticalAlign)
                {
                    case "middle":
                        y += (align_height - this.visualHeight) >> 1;
                        break;

                    case "right":
                        y += align_height - this.visualHeight;
                        break;
                }
            }

            //计算位置
            this.windowX = (this.visualX += (this.layoutX = x));
            this.windowY = (this.visualY += (this.layoutY = y));

            if (cache = this.__parent)
            {
                this.windowX += cache.windowX;
                this.windowY += cache.windowY;
            }
        };


        //排列子控件
        this.__fn_arrange = function () {

            var overflowX = this.overflowX,
                overflowY = this.overflowY,
                rtl = this.direction === "rtl",
                repeat = false;

            //初始化内容区
            this.contentWidth = this.clientWidth;
            this.contentHeight = this.clientHeight;

            //处理横向滚动条
            if (overflowX === "scroll")
            {
                if (!this.__hscroll)
                {
                    this.__fn_sign_hscroll(true);
                }
            }
            else if (this.__hscroll)
            {
                this.__fn_sign_hscroll(false);
            }

            //处理纵向滚动条
            if (overflowY === "scroll")
            {
                if (!this.__vscroll)
                {
                    this.__fn_sign_vscroll(true, rtl);
                }
            }
            else if (this.__vscroll)
            {
                this.__fn_sign_vscroll(false);
            }


            //排列 overflow === "auto" 时先按没有滚动条的方式排列
            this.arrange();

            //处理水平方向自动滚动
            if (overflowX === "auto" && this.contentWidth > this.clientWidth)
            {
                this.__fn_sign_hscroll(true);
                repeat = true;
            }

            //处理竖直方向自动滚动
            if (overflowY === "auto" && this.contentHeight > this.clientHeight)
            {
                this.__fn_sign_vscroll(true, rtl);
                repeat = true;
            }

            //重新排列
            if (repeat)
            {
                this.arrange();
            }

            //测量滚动条
            if (this.__scroll_dirty)
            {
                this.__fn_measure_scroll();
            }

            //从右到左坐标变换
            if (rtl && this.__children)
            {
                this.__fn_mirror_x(this.__children);
            }

            this.__arrange_dirty = false;
        };


        //排列子控件
        this.arrange = function () {

            var items = this.__visible_items;

            if (items && items.length > 0)
            {
                flyingon.execute_layout.call(this, this.layoutType, items);
            }
        };




        //移动指定距离
        this.moveBy = function (x, y) {

            this.layoutX += x || (x = 0);
            this.visualX += x;
            this.windowX += x;

            this.layoutY += y || (y = 0);
            this.visualY += y;
            this.windowY += y;
        };

        //移动到指定坐标
        this.moveTo = function (x, y) {

            this.moveBy(x - this.visualX, y - this.visualY);
        };

        //滚动指定距离
        this.scrollBy = function (x, y) {

            this.contentX += x || 0;
            this.contentY += y || 0;

            this.invalidate(false);
        };

        //滚动到指定坐标
        this.scrollTo = function (x, y) {

            this.contentX = x || 0;
            this.contentY = y || 0;

            this.invalidate(false);
        };


        //沿x中心轴变换
        this.__fn_mirror_x = function (items) {

            var height = this.contentHeight,
                item;

            for (var i = 0, _ = items.length; i < _; i++)
            {
                (item = items[i]).moveBy(0, height - item.visualY - item.visualHeight);
            }
        };

        //沿y中心轴变换
        this.__fn_mirror_y = function (items) {

            var width = this.contentWidth,
                item;

            for (var i = 0, _ = items.length; i < _; i++)
            {
                (item = items[i]).moveBy(width - item.visualX - item.visualWidth, 0);
            }
        };

        //沿坐标原点变换
        this.__fn_mirror_origin = function (items) {

            var width = this.contentWidth,
                height = this.contentHeight,
                item;

            for (var i = 0, _ = items.length; i < _; i++)
            {
                (item = items[i]).moveBy(width - item.visualX - item.visualWidth, height - item.visualY - item.visualHeight);
            }
        };







        //可视控件功能扩展
        flyingon.visual_extender = function () {


            //禁止滚动条
            flyingon.defineProperties(this, ["overflow", "overflowX", "overflowY"], function () {

                return null;
            });


            //禁止获取焦点
            this.defaultValue("focusable", false);


            this.defaultValue("width", "fill");

            this.defaultValue("height", "fill");

        }



        //子控件功能扩展
        flyingon.children_extender = function (base) {




        };




        //命中测试 找到目标控件则返回 否则返回undefined
        //注: 非可见控件不能命中
        this.hitTest = function (x, y) {

            var cache;

            if (this.__hscroll && this.__hscroll.hitTest(x, y))
            {
                return this.__hscroll;
            }

            if (this.__vscroll && this.__vscroll.hitTest(x, y))
            {
                return this.__vscroll;
            }

            if ((cache = x - this.visualX) >= 0 && cache <= this.visualWidth &&
                (cache = y - this.visualY) >= 0 && cache <= this.visualHeight)
            {
                if ((cache = this.__visible_items) && cache.length > 0)
                {
                    x += this.contentX - this.clientWidth;
                    y += this.contentY - this.clientHeight;

                    //if (this.transform)
                    //{

                    //}

                    for (var i = cache.length - 1; i >= 0 ; i--)
                    {
                        var item = cache[i];

                        if (item = item.hitTest(x, y))
                        {
                            return item;
                        }
                    }
                }

                return this;
            }
        };







        /**********************************坐标说明**********************************/

        //canvas:  画布坐标 相对画布左上角偏移坐标(不受滚动条影响)
        //window:  窗口坐标 相对窗口左上角偏移坐标(受滚动条影响)
        //contol:  控件坐标 相对父控件内容区左上角偏移坐标(受滚动条影响)

        /****************************************************************************/



        //获取所有父控件偏移值
        function offset(target, offset, scroll) {

            var parent = target.__parent,
                x = 0,
                y = 0;

            //如果是附加控件(比如滚动条,窗口标题栏)
            if (parent && target.__additions)
            {
                parent = parent.__parent;
            }

            while (parent)
            {
                //计算偏移
                if (offset)
                {
                    x += parent.clientX;
                    y += parent.clientY;
                }

                //计算滚动
                if (scroll)
                {
                    x += parent.contentX;
                    y += parent.contentY;
                }

                parent = parent.__parent;
            }

            return { x: x, y: y }
        };


        //控件坐标转画布坐标
        this.control_to_canvas = function (x, y) {

            var offset = offset(this, true, false);
            return { x: x + offset.x, y: y + offset.y };
        };

        //控件坐标转窗口坐标
        this.control_to_window = function (x, y) {

            var offset = offset(this, true, true);
            return { x: x + offset.x, y: y + offset.y };
        };


        //画布坐标转控件坐标
        this.canvas_to_control = function (x, y) {

            var offset = offset(this, true, false);
            return { x: x - offset.x, y: y - offset.y };
        };

        //画布坐标转窗口坐标
        this.canvas_to_window = function (x, y) {


            var offset = offset(this, false, true);
            return { x: x + offset.x, y: y + offset.y };
        };


        //窗口坐标转画布坐标
        this.window_to_canvas = function (x, y) {

            var offset = offset(this, false, true);
            return { x: x - offset.x, y: y - offset.y };
        };

        //窗口坐标转控件坐标
        this.window_to_control = function (x, y) {

            var offset = offset(this, true, true);
            return { x: x - offset.x, y: y - offset.y };
        };



    }).call(this, flyingon);




    //事件
    (function (flyingon) {


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



    }).call(this, flyingon);




    //其它属性
    (function (flyingon) {



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

            return this.ownerWindow && this.ownerWindow.__focused_control === this;
        });

        //是否为焦点控件或包含焦点控件
        this.defineProperty("containsFocused", function () {

            var focused = this.ownerWindow && this.ownerWindow.__focused_control;
            return focused && (focused === this || this.isParent(focused));
        });



    }).call(this, flyingon);




    //选择器
    (function (flyingon) {


        //查找控件 selector: css选择器样式字符串
        this.find = function (selector) {

            return new flyingon.Query(selector, this);
        };

        //查找指定id的子控件集合
        this.findById = function (id, cascade) {

            return new flyingon.Query(new flyingon.__element_node(cascade ? " " : ">", "#", id), this);
        };

        //查找指定名称的子控件集合
        this.findByName = function (name, cascade) {

            var node = new flyingon.__element_node(cascade ? " " : ">", "*"),
                property = new flyingon.__element_property("name");

            property.operator = "=";
            property.value = name;

            node.push(property);

            return new flyingon.Query(node, this);
        };

        //查找指定类型的子控件集合
        this.findByTypeName = function (fullTypeName, cascade) {

            return new flyingon.Query(new flyingon.__element_node(cascade ? " " : ">", "", fullTypeName), this);
        };

        //查找指定class的控件子控件集合
        this.findByClassName = function (className, cascade) {

            return new flyingon.Query(new flyingon.__element_node(cascade ? " " : ">", ".", className), this);
        };


    }).call(this, flyingon);




    //杂项
    (function (flyingon) {


        //模板
        this.defineProperty("template", null, {

            attributes: "rearrange",
            changed: "this.clearTemplate();",

            getter: function () {

                var template = this.__fields.template,
                    defaults;

                if (template && !(defaults = this.__defaults.template))
                {
                    return template;
                }

                return flyingon.templates[this.__fullTypeName] || defaults;
            }
        });

        //创建模板控件
        this.createTemplateControl = function (template, context) {

            var items = this.__children;

            if (items)
            {
                items.clear();
            }
            else
            {
                //子控件集合
                items = this.__children = new flyingon.ControlCollection(this);
            }

            var result = new flyingon.SerializeReader().deserialize(template, context || this);
            if (result)
            {
                items.append(result);

                result.__template = true;
                return result;
            }
        };

        //清除模板控件
        this.clearTemplate = function () {

            var items = this.__children;

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
                ownerWindow.__capture_control = this;
            }
        };

        //释放鼠标
        this.releaseCapture = function () {

            var ownerWindow = this.ownerWindow;

            if (ownerWindow)
            {
                ownerWindow.__capture_control = null;
            }
        };



        //执行验证
        this.validate = function () {

            return this.dispatchEvent("validate");
        };

        this.__fn_focus = function (event) {

            return this.focus();
        };

        this.__fn_blur = function () {

            return this.blur();
        };


        //设置当前控件为焦点控件
        //注:需此控件focusable为true时才可设为焦点控件
        this.focus = function () {

            if (this.focusable)
            {
                var ownerWindow = this.ownerWindow;

                if (ownerWindow && ownerWindow.__focused_control !== this)
                {
                    ownerWindow.__focused_control = this;

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

            if (ownerWindow && ownerWindow.__focused_control === this)
            {
                ownerWindow.__focused_control = null;

                if (this.dispatchEvent("blur"))
                {
                    this.stateTo("focus", false);
                }

                return true;
            }

            return false;
        };




        //显示弹出控件
        this.showPopup = function (x, y) {

            var ownerWindow = this.ownerWindow;

            if (ownerWindow)
            {
                var layer = ownerWindow.__popup_layer;

                if (!layer)
                {
                    layer = ownerWindow.__popup_layer = ownerWindow.appendLayer(9997);
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

                layer.__children.append(this);
                layer.invalidate(false);
            }
        };

        //关闭弹出控件
        this.closePopup = function () {

            var ownerWindow = this.ownerWindow;

            if (ownerWindow)
            {
                ownerWindow.removeLayer(ownerWindow.__popup_layer);
            }
        };




        //自定义序列化
        this.serialize = function (writer) {

            var text = this.__style.cssText;
            if (text)
            {
                writer.property("style", text);
            }

            base.serialize.call(this, writer);
        };

        //自定义反序列化
        this.deserialize = function (reader, data, excludes) {

            if (data.style)
            {
                excludes.style = true;
                this.__style.cssText = data.style;
            }

            base.deserialize.call(reader, data, excludes);
        };




    }).call(this, flyingon);




    //绘图相关
    (function (flyingon) {



        //使区域无效
        //rearrange  是否需要重新排列
        this.invalidate = function (rearrange) {

            var target = this,
                parent;

            if (rearrange)
            {
                target.__arrange_dirty = true;
            }

            target.__self_dirty = true;

            while ((parent = target.parent) && !parent.__self_dirty && !parent.__children_dirty)
            {
                if (target.__update_parent)
                {
                    parent.__self_dirty = true;
                }
                else
                {
                    parent.__children_dirty = true;
                }

                target = parent;
            }

            (this.__ownerLayer || this.ownerLayer).__registry_update();
        };


        //更新控件
        this.update = function () {

            this.invalidate();
            (this.__ownerLayer || this.ownerLayer).__registry_update();
        };




        //渲染
        this.__fn_render = function (painter) {

            //重新排列
            if (this.__arrange_dirty)
            {
                this.__fn_arrange();
            }

            //设置渲染环境
            var context = painter.context;

            context.save();
            context.globalAlpha = this.opacity;

            //设置目标控件
            painter.target = this;

            //绘制背景
            this.__update_parent = !this.paint_background(painter) || context.globalAlpha < 1;

            //渲染子项
            if (this.__visible_items)
            {
                this.__fn_render_children(painter, false);
            }

            //绘制内框
            this.paint(painter);

            //绘制滚动条


            //绘制外框
            this.paint_border(painter);

            ////绘制装饰
            //var decorates = this.decorates;
            //if (decorates && decorates.length > 0)
            //{
            //    this.__fn_paint_decorates(context, decorates);
            //}

            context.restore();

            //修改状态
            this.__self_dirty = false;
        };



        //渲染或更新子项
        this.__fn_render_children = function (painter, update) {

            var items = this.__visible_items,
                length = items.length;

            if (length > 0)
            {
                var context = painter.context;

                context.save();

                var context = painter.context,
                    contentX = this.contentX,
                    contentY = this.contentY;

                if (contentX > 0 || contentY > 0)
                {
                    context.translate(-contentX, -contentY);
                }

                context.beginPath();
                context.rect(this.clientX + contentX, this.clientY + contentX, this.clientWidth, this.clientHeight);
                context.clip();

                if (update)
                {
                    for (var i = 0; i < length; i++)
                    {
                        var item = items[i];

                        if (item.__self_dirty) //如果需要更新
                        {
                            item.__fn_render(painter);
                        }
                        else if (item.__children_dirty) //如果子控件需要更新
                        {
                            item.__fn_render_children(painter, true);
                            item.__children_dirty = false;
                        }
                    }
                }
                else
                {
                    for (var i = 0; i < length; i++)
                    {
                        items[i].__fn_render(painter);
                    }
                }

                context.restore();
            }
        };



        ////绘制装饰
        //this.__fn_paint_decorates = function (context, decorates) {

        //    var reader;

        //    for (var i = 0, _ = decorates.length; i < _; i++)
        //    {
        //        var item = decorates[i];

        //        //未处理
        //        if (!(item instanceof flyingon.Shape))
        //        {
        //            item = decorates[i] = (reader || (reader = new flyingon.SerializeReader())).deserialize(item);
        //        }

        //        item.paint(context, this);
        //    }
        //};









        //绘制边框
        this.paint_border = function (painter) {

            painter.context.strokeRect(this.visualX, this.visualY, this.visualWidth, this.visualHeight);


            //var border = boxModel.border;

            //if (border && border.border)
            //{
            //    var color = this.borderColor;

            //    if (boxModel.borderRadius > 0)
            //    {
            //        context.lineWidth = border.top;
            //        context.set_strokeStyle(color);
            //        context.strokeRoundRect(boxModel.windowX, boxModel.windowY, boxModel.width, boxModel.height, boxModel.borderRadius);
            //    }
            //    else
            //    {
            //        context.set_fillStyle(color);
            //        context.paint_border(boxModel.windowX, boxModel.windowY, boxModel.width, boxModel.height, border);
            //    }
            //}



        };


        //绘制背景
        this.paint_background = function (painter) {

            //var backgroundColor = this.backgroundColor;

            //if (backgroundColor)
            //{
            //    var r = boxModel.usableRect;

            //    context.beginPath();
            //    context.set_fillStyle(backgroundColor);

            //    if (boxModel.borderRadius > 0) //圆角矩形
            //    {
            //        context.roundRect(r.windowX, r.windowY, r.width, r.height, boxModel.borderRadius);
            //    }
            //    else
            //    {
            //        context.rect(r.windowX, r.windowY, r.width, r.height);
            //    }

            //    context.fill();

            //    return true;
            //}
        };



        //绘制内框
        this.paint = function (painter) {


        };


        //绘制文字
        this.paint_text = function (painter) {


        };


    }).call(this, flyingon);




}, true);




﻿
//滚动事件
flyingon.ScrollEvent = function (target, originalEvent) {

    this.target = target;
    this.originalEvent = originalEvent;
};


(function () {

    //事件类型
    this.type = "scroll";

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

        this.__visible_items = [
            this.__button1 = new flyingon.ScrollBar_Button(true),
            this.__slider0 = new flyingon.ScrollBar_Slider(),
            this.__button2 = new flyingon.ScrollBar_Button(false)];
    };




    //扩展可视控件功能
    flyingon.visual_extender.call(this);



    //当前值
    this.defineProperty("value", 0, "invalidate");

    //滚动条长度
    this.defineProperty("length", 100, "invalidate");

    //显示值大小
    this.defineProperty("viewportSize", 10, "rearrange");

    //最大变更值
    this.defineProperty("max_change", 200);

    //最小变更值
    this.defineProperty("min_change", 20);



    //滚动事件
    this.defineEvent("scroll");




    this.__event_mousedown = function (event) {

        if (timer)
        {
            clearTimeout(timer);
        }

        var value = this.__target, limit;

        if (value)
        {
            if (value === this.__button1)
            {
                value = -this.min_change;
            }
            else if (value === this.__button2)
            {
                value = this.min_change;
            }
            else //slider
            {
                this.ownerWindow.__capture_control = this;

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
            var r = this.__boxModel.clientRect;
            value = this.vertical ? event.windowY - r.windowY : event.windowX - r.windowX;

            if (value < this.__offset_value) //slider before
            {
                limit = Math.round((value - this.thickness) * this.length / this.__length_value);
                value = -this.max_change;
            }
            else  //slider after
            {
                limit = Math.round((value - this.thickness - this.__slider_value) * this.length / this.__length_value);
                value = this.max_change;
            }
        }

        if (this.step_to(value, limit, event))
        {
            step_to_delay.call(this, value, limit, event);
        }
    };


    this.__event_mousemove = function (event) {

        if (dragger)
        {
            var offset = this.vertical ? (event.offsetY - dragger.y) : (event.offsetX - dragger.x),
                value = Math.round(offset * this.length / this.__length_value);

            if (value)
            {
                this.step_to(0, dragger.value + value, event);
            }
        }
    };


    this.__event_mouseup = function (event) {

        if (timer)
        {
            clearTimeout(timer);
            timer = null;
        }

        this.ownerWindow.__capture_control = null;
        dragger = null;
    };



    //移动指定距离
    this.step_to = function (step, limit, originalEvent) {

        var value = this.value + step,
            length = this.length - this.viewportSize;


        if (limit == null)
        {
            limit = step < 0 ? 0 : length;
        }
        else if (limit < 0)
        {
            limit = 0;
        }
        else if (limit > length)
        {
            limit = length;
        }


        if (!step || (step > 0 && value > limit) || (step < 0 && value < limit))
        {
            value = limit;
        }


        if ((step = value - this.value) === 0)
        {
            return false;
        }


        this.value = value;


        var event = new flyingon.ScrollEvent(this, originalEvent);

        if (this.vertical)
        {
            event.changeY = step;
        }
        else
        {
            event.changeX = step;
        }

        this.dispatchEvent(event);


        this.__boxModel.invalidate(true);

        return value !== limit;
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

        var result = Math.round(length * this.viewportSize / this.length);
        return result <= 8 ? 8 : result;
    };

    function slider_start(length, slider) {

        if (length <= 0)
        {
            return 0;
        }

        if (this.value >= this.length - this.viewportSize)
        {
            return length - slider;
        }

        return Math.round(this.value * length / this.length);
    };



    this.measure = function (boxModel) {

        boxModel.compute();

        var r = boxModel.clientRect,
            x = 0,
            y = 0,
            value,
            button1 = this.__button1,
            button2 = this.__button2,
            slider0 = this.__slider0.__boxModel,
            thickness = this.thickness;

        button1.__boxModel.measure(0, 0, thickness, thickness);

        if (button1.vertical = button2.vertical = this.vertical)
        {
            var length = this.__length_value = (value = boxModel.clientRect.height) - (thickness << 1),
                slider = this.__slider_value = slider_length.call(this, length),
                offset = this.__offset_value = thickness + slider_start.call(this, length, slider);

            y = Math.max(value - thickness, 0);

            slider0.measure(0, offset, thickness, slider);
        }
        else
        {
            length = this.__length_value = (value = boxModel.clientRect.width) - (thickness << 1);
            slider = this.__slider_value = slider_length.call(this, length);
            offset = this.__offset_value = thickness + slider_start.call(this, length, slider);

            x = Math.max(value - thickness, 0);

            slider0.measure(offset, 0, slider, thickness);
        }

        button2.__boxModel.measure(x, y, thickness, thickness);
    };



});




//滚动条按钮
flyingon.defineClass("ScrollBar_Button", flyingon.Control, function (Class, base, flyingon) {


    Class.create = function (first) {

        this.__first = first;
    };




    this.__vertical = false;


    //扩展可视控件功能
    flyingon.visual_extender.call(this);



    //绘制图像
    this.paint = function (context, boxModel) {

        var image = "scroll-" + (this.__vertical ? (this.__first ? "up" : "down") : (this.__first ? "left" : "right"));

        if (image = this.__fn_state_image(image))
        {
            var r = boxModel.clientRect;
            context.paint_image(image, r.windowX, r.windowY, r.width, r.height, this.textAlign);
        }
    };


});




//滚动条滑块
flyingon.defineClass("ScrollBar_Slider", flyingon.Control, flyingon.visual_extender);




//滚动条拐角控件
flyingon.defineClass("ScrollBar_Corner", flyingon.Control, flyingon.visual_extender);




﻿//面板控件
flyingon.defineClass("Panel", flyingon.Control, function (Class, base, flyingon) {




    //子控件功能扩展
    flyingon.children_extender.call(this, base);




    //修改默认修值接受拖放
    this.defaultValue("droppable", true);



    this.defaultValue("width", 400);

    this.defaultValue("height", 400);





    this.__fn_arrange = function () {

        var children = this.__children,
            length;

        if (children && (length = children.length) > 0)
        {
            base.__fn_arrange.call(this);

            var items = this.__visible_items = [],
                x = this.contentX,
                y = this.contentY,
                right = x + this.clientWidth,
                bottom = y + this.clientHeight,
                cache;

            for (var i = 0; i < length; i++)
            {
                var item = children[i],
                    x1 = item.__visualX,
                    y1 = item.__visualY;

                if (item.__visible &&
                    x1 < right &&
                    y1 < bottom &&
                    x1 + item.__visualWidth >= x &&
                    y1 + item.__visualHeight >= y)
                {
                    result.push(item);
                }
            }
        }
    };





    //this.focus = function () {


    //    if (this.containsFocused)
    //    {
    //        return true;
    //    }


    //    var items = this.__children;

    //    for (var i = 0, _ = items.length; i < _; i++)
    //    {
    //        if (items[i].focus(event))
    //        {
    //            return true;
    //        }
    //    }

    //    return base.focus.call(this, event);
    //};

    //this.blur = function () {

    //    return this.containsFocused ? base.blur.call(this, event) : false;
    //};




    //this.serialize = function (writer) {

    //    base.serialize.call(this, writer);

    //    var items = this.__children;
    //    if (items.length > 0)
    //    {
    //        writer.array("children", items);
    //    }
    //};

    //this.deserialize = function (reader, data, excludes) {

    //    excludes.children = true;

    //    base.deserialize.call(this, reader, data, excludes);
    //    this.__children.deserialize(reader, data["children"]);
    //};


}, true);




﻿
//内容控件
flyingon.defineClass("ContentControl", flyingon.Control, function (Class, base, flyingon) {


  
    //内容控件
    this.defineProperty("content",

        function () {

            return this.__children && this.__children[0] || null;
        },

        function (value) {

            if ((this.__children || this.children)[0] !== value)
            {
                this.__children.replace(0, value);
            }
        });


    this.arrange = function () {

        
    };


});





﻿//模板控件
flyingon.defineClass("TemplateControl", flyingon.Control, function (Class, base, flyingon) {



   
    this.arrange = function (clientRect) {

        var items = this.__children,
            template;

        if ((!items || items.length <= 0) && (template = this.template))
        {
            items[0] = this.createTemplateControl(template)
        }

        if (items && items.length > 0)
        {
           
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





﻿//分隔条控件
flyingon.defineClass("Splitter", flyingon.ContentControl, function (Class, base, flyingon) {



    Class.create = function () {

        var fields = this.__fields;
        fields.cursor = "col-resize";
        fields.dock = "left";
        fields.draggable = true;
    };



    this.defaultValue("draggable", true);

    this.defaultValue("dock", "left");





    this.__event_mousedown = function (event) {


    };

    this.__event_mousemove = function (event) {


    };

    this.__event_mouseup = function (event) {


    };



    this.dragger = {

        drop_cursor: "col-Resize",

        nodrop_cursor: "no-drop",

        paint: function (context, dragTargets) {

            context.fillStyle = "rgba(255, 0, 0, 0.5)";
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





﻿//绘制型多子项控件基础服务
flyingon["items-painter"] = function (Class, flyingon, items_name) {



    Class.create = function () {

        this.__items = new flyingon.ItemCollection(this);
    };




    this.defaultValue("width", 200);

    this.defaultValue("height", 200);




    flyingon.defineProperty(this, items_name || "items",

        function () {

            return this.__items;
        },

        function (value) {

            var oldValue = this.__items;
            if (oldValue !== value)
            {
                this.__items = value;

                //
            }
        });


    //this.__selected_list = 



    //最大索引号(小于0则不启用索引状态)
    this.defineProperty("maxIndex", 0, "invalidate");



    //是否固定高度
    this.fixed_height = true;


    //子项默认高度
    this.defineProperty("lineHeight", 16, "invalidate");

    //开始显示索引号
    this.defineProperty("visibleIndex", 0, "invalidate");



    //移动开始显示索引至指定坐标
    this.__fn_visible_to = function (y) {

        if (this.fixed_height) //固定高度直接算出
        {
            var lineHeight = this.lineHeight || 16;
            return Math.floor(y / lineHeight);
        }

        return this.__fn_visible_items(y, 0);
    };

    //获取可视项集合
    this.__fn_visible_items = function (height, visibleIndex) {

        var result = [],

            items = this.__items,
            visible_list = items.__visible_list,

            lineHeight = this.lineHeight || 16,

            top = 0;


        if (visibleIndex === null)
        {
            visibleIndex = this.visibleIndex || 0;
        }

        for (var i = visibleIndex, _ = items.length; i < _; i++)
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

        var items = this.__items;
        if (items && items.length > 0)
        {
            writer.array(items_name, items);
        }
    };

    this.deserialize = function (reader, data, excludes) {

        excludes[items_name] = true;

        flyingon.SerializableObject.prototype.deserialize.call(this, reader, data, excludes);
        reader.array(this.__items, "__items", data[items_name]);
    };

};





﻿

//
flyingon.defineClass("ItemCollection", flyingon.Collection, function (Class, base, flyingon) {



    Class.create = function (target) {

        this.__visible_list = [];
        this.target = target;
    };



    this.__fn_validate = function (index, item) {

        if (!flyingon.__initializing)
        {
            this.target.invalidate(false);
        }

        return item;
    };

    this.__fn_remove = function (index, item) {

        var items = this.__visible_list;
        if (items.length > index)
        {
            items.splice(index, 1);
        }

        if (!flyingon.__initializing)
        {
            this.target.invalidate(false);
        }
    };

    this.__fn_clear = function () {

        this.__visible_list.length = 0;

        if (!flyingon.__initializing)
        {
            this.target.invalidate(false);
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



  

    this.__fn_create_item = function () {

    };

    this.clearTemplate = function () {

        var items = this.__items,
            length = items && items.length;

        for (var i = 0; i < length; i++)
        {
            var item = items[i],
                control = item.__control;

            if (control)
            {
                item.__control = null;
                control.dispose();
            }
        }
    };

    //排列子项
    this.arrange = function (clientRect) {

        var items = this.__items,
            children = this.__render_children = [],

            maxIndex = this.maxIndex,
            lineHeight = this.lineHeight,
            visibleIndex = this.visibleIndex,

            y = 0,
            width = clientRect.width,
            height = clientRect.height,

            template;


        for (var i = 0, _ = items.length; i < _; i++)
        {
            var item = items[i];

            if (item.visible)
            {
                var control = item.__control;

                if (!control)
                {
                    if (template || (template = this.template))
                    {
                        control = item.__control = this.createTemplateControl(template, item);
                    }
                    else
                    {
                        control = item.__control = this.__fn_create_item();
                    }
                }


                if (control)
                {
                    control.__boxModel.measure(0, y, width, lineHeight);

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
用户控件
*/
flyingon.defineClass("UserControl", flyingon.Panel, function (Class, base, flyingon) {





});






﻿
//图层扩展
flyingon.layer_extender = function (host) {


    var div = this.dom_layer = document.createElement("div"),
        canvas = this.dom_canvas = document.createElement("canvas"),

        target = this,
        timer;


    //创建dom
    div.setAttribute("flyingon", "layer");
    div.setAttribute("style", "position:absolute;width:100%;height:100%;overflow:hidden;outline:none;");

    canvas.setAttribute("flyingon", "canvas");
    canvas.setAttribute("style", "position:absolute;outline:none;");

    div.appendChild(canvas);

    if (host)
    {
        host.appendChild(div);
    }


    //重载当前图层
    this.defineProperty("ownerLayer", function () {

        return this;
    });


    //创建绘画环境
    this.painter = new flyingon.Painter(this.context = canvas.getContext("2d"));


    //更新画布
    function update() {

        if (timer)
        {
            clearTimeout(timer);
        }

        var self = target;

        if (self.__self_dirty) //如果需要更新
        {
            self.__fn_render(self.painter);
        }
        else if (self.__children_dirty) //如果子控件需要更新
        {
            self.__fn_render_children(self.painter, true);
            self.__children_dirty = false;
        }
    };


    //注册更新
    this.__registry_update = function () {

        if (timer)
        {
            clearTimeout(timer);
        }

        timer = setTimeout(update, 5);
    };

    //注销更新
    this.__unregistry_update = function () {

        if (timer)
        {
            clearTimeout(timer);
            timer = 0;
        };
    };

};




/*

*/
flyingon.defineClass("Layer", flyingon.Panel, function (Class, base, flyingon) {



    Class.create = function (host) {

        //执行图层扩展
        flyingon.layer_extender.call(this, host);
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

        this.__unregistry_update();
        this.__fn_render(this.painter);
    };


}, true);






﻿//窗口扩展服务
flyingon.window_extender = function (base, flyingon) {



    var host,                       //主容器
        dragging = false,           //是否处理拖动
        mousedown_cache = false;    //鼠标是否按下



    this.__fn_create = function () {


        var div = this.dom_window = document.createElement("div");

        div.setAttribute("flyingon", "window");
        div.setAttribute("style", "position:absolute;z-index:9990;width:100%;height:100%;overflow:hidden;-moz-user-select:none;-webkit-user-select:none;outline:none;cursor:default;");
        div.setAttribute("tabindex", "0");

        //执行图层扩展
        flyingon.layer_extender.call(this, div);

        //缓存当前对象
        div.__ownerWindow = this.dom_layer.__ownerWindow = this.dom_canvas.__ownerWindow = this;

        //IE禁止选中文本 其它浏览器使用样式控件 -moz-user-select:none;-webkit-user-select:none;
        div.onselectstart = function (event) { return false; };


        //初始化图层
        this.layers = [this];


        //默认设置为初始化状态,在渲染窗口后终止
        flyingon.__initializing = true;

        //绑定dom事件
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
        this.__capture_delay = new flyingon.DelayExecutor(10, capture_control, this);


        //初始化输入符
        flyingon.__fn_initialize_caret.call(this, this.dom_window);
    };




    //主窗口
    this.defineProperty("mainWindow", function () {

        return this.__mainWindow || null;
    });


    //活动窗口
    this.defineProperty("activeWindow", function () {

        return this.__mainWindow && this.__mainWindow.__activeWindow || null;
    });


    //父窗口
    this.defineProperty("parentWindow", function () {

        return this.__parentWindow || null;
    });


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
    this.setActive = function () {

        var root = this.mainWindow,
            target;

        if ((target = root.activeWindow) !== this)
        {
            if (target)
            {
                target.dom_window.style.zIndex = 9990;
                target.dispatchEvent("deactivate");
                target.stateTo("active", false);
            }

            root.__activeWindow = this;

            this.dom_window.style.zIndex = 9991;
            this.dispatchEvent("activate");
            this.stateTo("active", true);
        }
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

        var result = layer || new flyingon.Layer(this.dom_window),
            dom_layer = result.dom_layer,
            dom_canvas = result.dom_canvas;

        if (zIndex)
        {
            dom_layer.style.zIndex = zIndex;
        }

        result.__parent = this;
        result.__fn_measure(dom_canvas.width = this.width, dom_canvas.height = this.height);
        result.__fn_position(0, 0);

        dom_layer.__ownerWindow = dom_canvas.__ownerWindow = this;

        this.layers.push(result);

        return result;
    };


    this.removeLayer = function (layer) {

        if (layer)
        {
            layer.__parent = layer.dom_layer.__ownerWindow = layer.dom_canvas.__ownerWindow = null;

            this.dom_window.removeChild(layer.dom_layer);
            this.layers.remove(layer);
        }
    };



    this.hitTest = function (x, y) {

        for (var i = this.layers.length - 1; i >= 0; i--)
        {
            var layer = this.layers[i];

            if (!layer.disableGetControlAt && layer.context.getImageData(x, y, 1, 1).data[3] !== 0)
            {
                return base.hitTest.call(layer, x, y);
            }
        }

        return this;
    };



    //计算画布坐标(相对画布节点的偏移),处理firefox没有offsetX及offsetY的问题
    function offset(event) {

        if (!event.canvasX)
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
            event.canvasX = event.pageX - x;
            event.canvasY = event.pageY - y;
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

        var source = flyingon.__hover_control,
            target = this.hitTest(dom_MouseEvent.canvasX, dom_MouseEvent.canvasY) || this;

        if (target !== source)
        {
            document.title = target.id;

            flyingon.__hover_control = target;

            if (source)
            {
                source.stateTo("hover", false);
                dispatchEvent("mouseout", source, dom_MouseEvent);
            }

            if (target && target.enabled)
            {
                this.dom_window.style.cursor = target.cursor;
                target.stateTo("hover", true);

                dispatchEvent("mouseover", target, dom_MouseEvent);
                dispatchEvent("mousemove", target, dom_MouseEvent);
            }
        }
    };


    function mousedown(dom_MouseEvent) {

        //处理延时
        var ownerWindow = this.__ownerWindow.__capture_delay.execute();

        //设置鼠标按下
        mousedown_cache = true;

        //处理弹出窗口
        if (ownerWindow !== ownerWindow.activeWindow) //活动窗口不是当前点击窗口
        {
            ownerWindow.setActive();
        }

        //处理鼠标按下事件
        var target = ownerWindow.__capture_control || flyingon.__hover_control;

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
                    var focused = ownerWindow.__focused_control;
                    if (focused && focused !== target && focused.validate())
                    {
                        focused.__fn_blur();
                    }

                    target.__fn_focus(event);
                }

                //分发事件
                var event = new flyingon.MouseEvent("mousedown", target, dom_MouseEvent);
                target.dispatchEvent(event);
            }

            //设置捕获(注:setCapture及releaseCapture仅IE支持,不能使用)
            host.__ownerWindow = ownerWindow;

            //取消冒泡
            dom_MouseEvent.stopPropagation();
        }
    };


    function mousemove(dom_MouseEvent) {

        var ownerWindow = host.__ownerWindow || dom_MouseEvent.target.__ownerWindow,
            target;

        if (ownerWindow)
        {
            offset.call(ownerWindow, dom_MouseEvent);

            if (dragging) //处理拖动
            {
                flyingon.Dragdrop.move(dom_MouseEvent);
            }
            else if (target = ownerWindow.__capture_control) //启用捕获
            {
                if (target.enabled)
                {
                    dispatchEvent("mousemove", target, dom_MouseEvent);
                }
            }
            else
            {
                ownerWindow.__capture_delay.registry([dom_MouseEvent]); //启用延迟捕获
            }
        }
        else if (target = flyingon.__hover_control)
        {
            flyingon.__hover_control = null;

            target.stateTo("hover", false);
            dispatchEvent("mouseout", target, dom_MouseEvent);
        }
    };


    function mouseup(dom_MouseEvent) {

        var ownerWindow = host.__ownerWindow;

        if (ownerWindow)
        {
            var target = ownerWindow.__capture_control || flyingon.__hover_control;

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
            host.__ownerWindow = null;

            //设置鼠标弹起
            mousedown_cache = false;
        }
    };



    //鼠标事件翻译方法
    function translate_MouseEvent(type, dom_MouseEvent) {

        var ownerWindow = this.__ownerWindow.__capture_delay.execute(),
            target = ownerWindow.__capture_control || flyingon.__hover_control;

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

        var ownerWindow = this.__ownerWindow,
            focused = ownerWindow.__focused_control;

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
    this.__fn_clientRect = function (fill) {

        flyingon.__initializing = false;

        var rect = this.dom_window.getBoundingClientRect();

        if (fill) //画布充满窗口
        {
            this.__fields.width = this.dom_canvas.width = rect.width;
            this.__fields.height = this.dom_canvas.height = rect.height;
        }

        return rect;
    };

    //重新调整窗口大小
    this.__fn_resize = function (x, y, width, height) {

        var layers = this.layers;

        for (var i = 0, _ = layers.length; i < _; i++)
        {
            var layer = layers[i],
                canvas = layer.dom_canvas;

            canvas.width = width; //清空画布
            canvas.height = height;

            this.__unregistry_update();

            this.__fn_measure(width - x, height - y);
            this.__fn_position(x, y);

            this.__fn_render(layer.painter);
        }
    };





    //开始初始化
    flyingon.beginInit = function () {

        flyingon.__initializing = true;
    };

    //结束初始化
    flyingon.endInit = function () {

        flyingon.__initializing = false;
    };


};




//主窗口
flyingon.defineClass("Window", flyingon.Control, function (Class, base, flyingon) {



    flyingon.window_extender.call(this, base, flyingon);



    Class.create = function (host) {

        this.__fn_create();

        var div = this.dom_host = document.createElement("div");

        div.setAttribute("flyingon", "window-host");
        div.setAttribute("style", "position:relative;width:100%;height:100%;overflow:hidden;");
        div.appendChild(this.dom_window);

        host && host.appendChild(div);

        //设为活动窗口
        this.setActive();

        //绑定resize事件
        var self = this;
        window.addEventListener("resize", function (event) {

            self.update();

        }, true);
    };




    //主窗口
    this.defineProperty("mainWindow", function () {

        return this;
    });


    //活动窗口
    this.defineProperty("activeWindow", function () {

        return this.__activeWindow || this;
    });


    //父窗口
    this.defineProperty("parentWindow", function () {

        return null;
    });



    //刷新窗口
    this.update = function () {

        var rect = this.__fn_clientRect(true);
        this.__fn_resize(0, 0, rect.width, rect.height);
    };


}, true);







﻿
//窗口标题栏按钮
flyingon.defineClass("ChildWindow_ToolButton", flyingon.Control, function (Class, base, flyingon) {


    //修改默认值为充满
    this.defaultValue("width", "fill");

    //修改默认值为充满
    this.defaultValue("height", "fill");

    //图片
    this.defineProperty("image", null);


    //绘制图像
    this.paint = function (context, boxModel) {

        var image = this.__fn_state_image(this.image);

        if (image)
        {
            var r = boxModel.clientRect;
            context.paint_image(image, r.windowX, r.windowY, r.width, r.height, this.textAlign);
        }
    };


});



//窗口标题栏
flyingon.defineClass("ChildWindow_ToolBar", flyingon.Panel, function (Class, base, flyingon) {


    Class.create = function (parent) {

        this.__parent = parent;
        this.__addtions = true;
        this.__children = new flyingon.ControlCollection();

        this.__fn_initialize();
    };


    this.__fn_initialize = function () {

        var close = this.ownerWindow.close;

        button.call(this, "window-icon", "left");
        button.call(this, "window-close", "right", close);
        button.call(this, "window-maximize", "right", close);
        button.call(this, "window-minimize", "right", close);
    };




    this.defaultValue("focusable", false);

    this.defaultValue("width", "fill");

    this.defaultValue("height", 25);



    function button(image, dock, click) {

        var result = new flyingon.ChildWindow_ToolButton();

        result.image = image;
        result.dock = dock;

        if (click)
        {
            result.onclick = function (event) {

                click.call(this);
            };
        }

        this.__children.append(result);
        return result;
    };


    var offsetX, offsetY;

    function translate(ownerWindow) {

        var root = ownerWindow.mainWindow,
            x = ownerWindow.left,
            y = ownerWindow.top,
            width = root.width,
            height = root.height;

        if (x < 0)
        {
            x = 0;
        }
        else if (x >= width)
        {
            x = width - 8;
        }

        if (y < 0)
        {
            y = 0;
        }
        else if (y > height)
        {
            y = height - 8;
        }

        return { x: x, y: y };
    };



    this.__event_mousedown = function (event) {

        var ownerWindow = this.ownerWindow,
            offset = translate(ownerWindow);

        offsetX = offset.x - event.clientX;
        offsetY = offset.y - event.clientY;

        ownerWindow.__capture_control = this; //捕获鼠标
    };

    this.__event_mousemove = function (event) {

        if (event.mousedown)
        {
            var ownerWindow = this.ownerWindow,
                offset = translate(ownerWindow),
                style = ownerWindow.dom_window.style;

            ownerWindow.left = event.clientX + offsetX,
            ownerWindow.top = event.clientY + offsetY;

            style.left = offset.x + "px";
            style.top = offset.y + "px";
        }
    };

    this.__event_mouseup = function (event) {

        this.ownerWindow.__capture_control = null;
    };



    this.__fn_render = function (width) {

        var height = this.visibility === "visible" ? +this.height || 25 : 0;

        this.__fn_measure(0, 0, width, height, true, false);
        this.__fn_position(0, 0);
        this.__fn_arrange();
    };


});




//子窗口
flyingon.defineClass("ChildWindow", flyingon.Control, function (Class, base, flyingon) {



    flyingon.window_extender.call(this, base, flyingon);



    Class.create = function () {

        this.__fn_create();
        this.toolbar = new flyingon.ChildWindow_ToolBar(this);
    };


    

    this.defineProperty("width", 640);

    this.defineProperty("height", 480);

    this.defineProperty("fill", false, {

        changed: "this.update();"
    });

    //窗口起始位置 center:居中  manual:自定义
    this.defineProperty("start", "center");



    this.defineEvent("closing");

    this.defineEvent("closed");




    this.__event_change = function (event) {

        switch (event.name)
        {
            case "left":
            case "top":
                this.dom_window.style[event.name] = event.value + "px";
                break;
        }
    };



    function show(parentWindow, showDialog) {

        if (!(this.__parentWindow = parentWindow) || !(this.__mainWindow = parentWindow.mainWindow))
        {
            throw new Error("parentWindow error!");
        }

        var host = this.__mainWindow.dom_host;

        if (showDialog) //如果是模式窗口则添加遮罩层
        {
            var mask = this.dom_mask = document.createElement("div");
            mask.setAttribute("flyingon", "mask");
            mask.setAttribute("style", "position:absolute;z-index:9990;width:100%;height:100%;overflow:hidden;-moz-user-select:none;-webkit-user-select:none;outline:none;cursor:default;background-color:silver;opacity:0.1;");
            host.appendChild(this.dom_mask);
        }

        host.appendChild(this.dom_window);

        this.setActive();
        this.update(this.start === "center");
    };

    this.show = function (parentWindow) {

        show.call(this, parentWindow, false);
    };

    this.showDialog = function (parentWindow) {

        show.call(this, parentWindow, true);
    };


    this.close = function () {

        var parent = this.__parentWindow;

        if (parent)
        {
            if (this.dispatchEvent("closing"))
            {
                var root = this.__mainWindow,
                    host = root.dom_host;

                host.removeChild(this.dom_window);

                if (this.dom_mask)
                {
                    host.removeChild(this.dom_mask);
                }

                this.dispatchEvent("closed");

                this.__parentWindow = this.__mainWindow = root.__activeWindow = null;
                parent.setActive();
            }
        }

        this.dispose();
    };



    //刷新窗口
    this.update = function (center) {

        var rect = this.__fn_clientRect(this.fill),
            width = this.width,
            height = this.height,
            style = this.dom_window.style;

        if (center)
        {
            this.left = (rect.width - width) >> 1;
            this.top = (rect.height - height) >> 1;
        }

        style.left = this.left + "px";
        style.top = this.top + "px";
        style.width = width + "px";
        style.height = height + "px";

        this.toolbar.__fn_render(width);
        this.__fn_resize(0, this.toolbar.marginBottom, width, height);
    };



    this.hitTest = function (x, y) {

        return this.toolbar.hitTest(x, y) || base.hitTest.call(this, x, y);
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



    //flyingon["text-painter"].call(this, false);


});









﻿/// <reference path="../Base/Core.js" />
/// <reference path="Control.js" />


/*

*/
flyingon.defineClass("TextButtonBase", flyingon.TextBoxBase, function (Class, base, flyingon) {



    this.defineProperty("items", []);


    this.defineProperty("showButton", true, "rearrange");



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
flyingon.defineClass("Memo", flyingon.Control, function (Class, base, flyingon) {



    this.defaultValue("width", 200);

    this.defaultValue("height", 40);

    this.defaultValue("multiline", true);





    //flyingon["text-painter"].call(this, true);




});





﻿/*

*/
flyingon.defineClass("Button", flyingon.Control, function (Class, base, flyingon) {



    this.defaultValue("width", 100);

    this.defaultValue("height", 21);


});





﻿/*

*/
flyingon.defineClass("TextBlock", flyingon.Control, function (Class, base, flyingon) {



});









