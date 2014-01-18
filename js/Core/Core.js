﻿"use strict";
///以上代码启用严格模式

//注意页面渲染模式设置, 否则IE启用了兼容模式时可能无法执行脚本
//<!--以IE的当前版本渲染,如果安装了ChromeFrame则优先使用-->
//<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />

/*

*/




//根命名空间
var flyingon = this.flyingon = this.flyingon || {};




//全局变量
(function (flyingon) {


    //版本
    flyingon.version = "0.0.0.1";

    //语言
    flyingon.language = "zh-CHS";

    //系统设置 记录当前用户样式语言等信息
    flyingon.setting = flyingon.setting || {};


})(flyingon);




//扩展函数
(function (flyingon) {


    //增加字符串格式化支持
    String.prototype.format = function () {

        return arguments.length == 0 ? this : this.replace(/\{\d+\}/g, function (value) {

            return arguments[value.substring(1, value.length - 1)] || "";
        });
    };



    var prototype = Array.prototype;


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


    //二分法搜索数据段
    prototype.binaryBetween = function (value, start, end) {

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
    prototype.binaryIndexOf = function (value, start, end) {

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
    prototype.binarySearch = function (callbackfn, start, end) {

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
(function (flyingon) {


    var support = flyingon.support = {};



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
(function (flyingon) {



    flyingon.defineVariable = function (target, name, value, configurable, enumerable) {

        //target[name] = value;
        Object.defineProperty(target, name, {

            value: value,
            writable: false,
            configurable: configurable === undefined ? false : configurable,
            enumerable: enumerable === undefined ? true : enumerable
        });
    };



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






    //增加模板函数支持 以当前函数为模板动态创建新函数
    flyingon["y:template-to"] = function (fn, values, names) {

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

        return new Function(names, "return (" + body + ")")()
    };


    //浅复制源对象属性至目标属性(对象直接复制引用)
    //ignoreExists: 是否忽略已存在的属性
    flyingon["simple-copy"] = function (source, target, ignoreExists) {


        var names = Object.getOwnPropertyNames(source);

        for (var i = 0, length = names.length; i < length; i++)
        {
            var name = names[i],
                value = source[name];

            if (value != null && typeof value == "object")
            {
                var cache = target[name];

                if (cache != null && typeof cache == "object")
                {
                    flyingon["simple-copy"](value, cache, ignoreExists);
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
    flyingon["deep-copy"] = function (source, target, ignoreExists) {


        var names = Object.getOwnPropertyNames(source);

        for (var i = 0, length = names.length; i < length; i++)
        {
            var name = names[i],
                value = source[name];

            if (value != null && typeof value == "object")
            {
                var cache = target[name];

                if ((cache === undefined && (cache = target[name] = {})) ||
                    (cache !== null && typeof cache == "object"))
                {
                    flyingon["deep-copy"](value, cache, ignoreExists);
                }
            }
            else if (!ignoreExists || !target.hasOwnProperty(name))
            {
                target[name] = value instanceof Array ? value.slice(0) : value;
            }
        }

        return target;
    };



    flyingon.parseJson = (window.JSON && window.JSON.parse) || function (data) {

        return (new Function("return " + data))();
    };




    //开始初始化
    flyingon.beginInit = function () {

        flyingon["x:initializing"] = true;
        return this;
    };

    //结束初始化
    flyingon.endInit = function () {

        flyingon["x:initializing"] = false;
        return this;
    };



})(flyingon);




//函数元数据
(function (flyingon) {


    var prototype = (flyingon.MetaFunction = function (fn) {

        this.fn = fn;

        var body = fn.toString();

        this.body = body.substring(body.indexOf("{") + 1, body.lastIndexOf("}"));

        body = body.match(/\([^)]*\)/)[0];
        body = body.substring(1, body.length - 1).replace(/\s+/, "");;

        this.parameters = body ? body.split(",") : [];

    }).prototype;


    //合并函数内容
    prototype.merge = function (body, insertBefore) {

        if (typeof body == "function")
        {
            body = body.toString();
            body = body.substring(body.indexOf("{") + 1, body.lastIndexOf("}"));
        }

        this.body = insertBefore ? body + this.body : this.body + body;
        this.fn = new Function(this.parameters, this.body);
        return this;
    };


})(flyingon);




//名字空间
(function (flyingon) {


    //缓存命名空间
    var cache = { "flyingon": flyingon },
        global = this;


    //名字空间类
    var Class = function (name) {

        this["x:name"] = name;
        cache[name] = this;
    };



    //创建或切换名字空间方法
    flyingon.namespace = function (namespace, fn) {

        var result = namespace;

        if (result)
        {
            if (result.constructor == String && !(result = cache[result]))
            {
                result = global;

                var names = namespace.split("."),
                    name,
                    value;

                for (var i = 0, length = names.length; i < length; i++)
                {
                    if (name = names[i])
                    {
                        value = (value && value + "." + name) || name;
                        result = result[name] || (result[name] = new Class(value));
                    }
                }
            }
        }
        else
        {
            result = flyingon;
        }

        result = flyingon["x:namespace"] = result; //切换当前命名空间

        if (fn)
        {
            fn(result, flyingon);
        }

        return result;
    };



    //获取类全名
    flyingon["y:classFullName"] = function (namespace, className, with_default) {

        var name = namespace && namespace["x:name"];

        if (name)
        {
            return name + "." + className;
        }

        return with_default ? "flyingon." + className : className;
    };



    //切换当前命名空间为默认命名空间
    flyingon["x:namespace"] = flyingon;


}).call(this, flyingon);




//基类及继承实现
(function (flyingon) {



    var prototype = (flyingon.RootObject = function () {


    }).prototype;



    //类名
    prototype.className = flyingon.RootObject.className = "RootObject";


    prototype.toString = prototype.toLocaleString = function () {

        return "[object " + this.className + "]";
    };




    flyingon["x:registryList"] = { "RootObject": flyingon.RootObject };


    flyingon.registryClass = function (Class, classFullName) {

        flyingon["x:registryList"][classFullName || Class.classFullName] = Class;
    };

    flyingon.unregistryClass = function (classFullName) {

        delete flyingon["x:registryList"][classFullName];
    };

    flyingon.getRegistryClass = function (classFullName) {

        return flyingon["x:registryList"][classFullName];
    };



    var errorMsg = "define class error!",

        defineProperty = function (Class, prototype, name, value) {

            Class[name] = value;
            prototype["x:" + name] = value;
            flyingon.defineVariable(prototype, name, value, false, true);
        };


    //定义类方法
    //extension: 类扩展 必须为函数
    //constructor_merge: 是否合并构造函数 true:合并构造函数内容以提升性能 如果构造函数中有局部变量则不可设成true 默认为false
    flyingon.class = function (className, superClass, extension, constructor_merge) {


        //处理参数
        if (!className)
        {
            throw new Error(errorMsg);
        }

        if (extension == null || typeof extension != "function")
        {
            constructor_merge = extension;
            extension = superClass;
            superClass = flyingon.RootObject;
        }
        else if (!superClass) //没有指定基类
        {
            superClass = flyingon.RootObject;
        }

        if (typeof extension != "function") //扩展不是函数
        {
            throw new Error(errorMsg);
        }




        var namespace = flyingon["x:namespace"], //当前名字空间
            classFullName = flyingon["y:classFullName"](namespace, className); //类全名




        //定义类模板 Class.create为构造函数
        var Class = function () {

            var fn = Class.create;
            if (fn)
            {
                fn.apply(this, arguments);
            }
        };



        //创建类原型
        var prototype = Class.prototype = Object.create(superClass.prototype);


        defineProperty(Class, prototype, "className", className);           //类名
        defineProperty(Class, prototype, "classFullName", classFullName);   //类全名

        Class["superClass"] = superClass;                                   //父类
        Class["super"] = superClass.prototype;                              //父类原型
        prototype["constructor"] = Class;                                   //构造函数
        prototype["x:defaults"] = Class["x:defaults"] = Object.create(superClass["x:defaults"] || Object.prototype);  //默认值


        flyingon.registryClass(Class); //注册类
        namespace[className] = Class; //输出类



        //扩展
        extension.call(prototype, Class, flyingon);



        //处理构造函数
        var superClass_create = superClass.create;
        if (superClass_create)
        {
            var Class_create = Class.create,
                create_chain = superClass["x:create-chain"];

            if (Class_create)
            {
                //合并构造函数 注:已有构造链时不可以合并
                if (!create_chain && constructor_merge)
                {
                    Class_create = new flyingon.MetaFunction(Class_create);
                    Class.create = Class_create.merge(superClass_create, true).fn;
                }
                else //生成构造链
                {
                    (Class["x:create-chain"] = (create_chain && create_chain.slice(0)) || [superClass_create]).push(Class_create);

                    Class.create = function () {

                        var create_chain = Class["x:create-chain"];
                        for (var i = 0, length = create_chain.length; i < length; i++)
                        {
                            create_chain[i].apply(this, arguments);
                        }
                    };
                }
            }
            else
            {
                if (create_chain)
                {
                    Class["x:constructor-chain"] = create_chain;
                }

                Class.create = superClass_create;
            }
        }



        //类初始化
        var inherit_chain = [superClass, Class];
        while (superClass = superClass.superClass)
        {
            inherit_chain.unshift(superClass);
        }

        for (var i = 0, length = inherit_chain.length; i < length; i++)
        {
            if (inherit_chain[i].initialize)
            {
                inherit_chain[i].initialize(Class, flyingon);
            }
        }



        return Class;
    };




})(flyingon);

