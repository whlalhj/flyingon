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
        index >= 0 && this.splice(index, 1);
    };


    //移除指定索引
    prototype.removeAt = function (index) {

        this.splice(index, 1);
    };


    //二分法搜索数据段
    prototype.binaryBetween = function (value, start, end) {

        (start == null || start < 0) && (start = 0);
        (end == null || end >= this.length) && (end = this.length - 1);


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

        (start == null || start < 0) && (start = 0);
        (end == null || end >= this.length) && (end = this.length - 1);


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

        (start == null || start < 0) && (start = 0);
        (end == null || end >= this.length) && (end = this.length - 1);


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

        getter && (attributes.get = getter);
        setter && (attributes.set = setter);

        Object.defineProperty(target, name, attributes);

    } : function (target, name, getter, setter) {

        getter && target.__defineGetter__(name, getter);
        setter && target.__defineSetter__(name, setter);
    };






    //增加模板函数支持 以当前函数为模板动态创建新函数
    flyingon["y:template:to"] = function (fn, values, names) {

        var body = fn.toString().replace(/"\{\w+\}"/g, function (value) {

            value = values[value.substring(2, value.length - 2)] || "";

            if (typeof value == "function")
            {
                value = value.toString();

                var index = value.indexOf("{");
                if (index++ > 0)
                {
                    var lastIndexOf = value.lastIndexOf("}");
                    lastIndexOf > 0 && (value = value.substring(index, lastIndexOf));
                }
            }

            return value;
        });

        return new Function(names, "return (" + body + ")")()
    };


    //浅复制源对象属性至目标属性(对象直接复制引用)
    //ignoreExists: 是否忽略已存在的属性
    flyingon["y:simple:copy"] = function (source, target, ignoreExists) {


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
                    flyingon["y:simple:copy"](value, cache, ignoreExists);
                    continue;
                }
            }

            (!ignoreExists || !target.hasOwnProperty(name)) && (target[name] = value);
        }

        return target;
    };


    //深度复制源对象属性至目标属性(创建新对象)
    //ignoreExists: 是否忽略已存在的属性
    flyingon["y:deep:copy"] = function (source, target, ignoreExists) {


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
                    flyingon["y:deep:copy"](value, cache, ignoreExists);
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




//名字空间
(function (global, flyingon) {


    //缓存命名空间
    var cache = { "flyingon": flyingon };


    //名字空间类
    function Namespace(name) {

        this.namespaceName = name;
        cache[name] = this;
    };



    //创建或切换名字空间方法
    flyingon.namespace = function (name, fn) {

        var result = cache[name];

        if (!result && name)
        {
            result = global;

            var values = name.split(".");

            for (var i = 0, length = values.length; i < length; i++)
            {
                var value = values[i];

                if (value)
                {
                    name = i == 0 ? value : (name + "." + value);

                    !result[value] && (result[value] = new Namespace(name));
                    result = result[value];
                }
            }
        }

        flyingon.namespace.current = result || flyingon; //切换当前命名空间

        fn && fn(flyingon, result);

        return result;
    };


    //切换当前命名空间为默认命名空间
    flyingon.namespace.current = flyingon;


})(this, flyingon);




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




//基类及继承实现
(function (flyingon) {



    var prototype = (flyingon.RootObject = function () {


    }).prototype;



    //类名
    prototype.className = flyingon.RootObject.className = "RootObject";


    prototype.toString = prototype.toLocaleString = function () {

        return "[object " + this.className + "]";
    };




    flyingon["x:registryList"] = { "flyingon.RootObject": flyingon.RootObject };


    flyingon.registryClass = function (Class, classFullName) {

        var name = classFullName || Class.classFullName;
        flyingon["x:registryList"][name] = Class;
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




        var namespace = flyingon.namespace.current, //当前名字空间
            classFullName = (namespace.namespaceName ? namespace.namespaceName + "." : "") + className; //类全名




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
                constructor_chain = superClass["x:constructor-chain"];

            if (Class_create)
            {
                //合并构造函数 注:已有构造链时不可以合并
                if (!constructor_chain && constructor_merge) 
                {
                    Class_create = new flyingon.MetaFunction(Class_create);
                    Class.create = Class_create.merge(superClass_create, true).fn;
                }
                else //生成构造链
                {
                    (Class["x:constructor-chain"] = (constructor_chain && constructor_chain.slice(0)) || [superClass_create]).push(Class_create);

                    Class.create = function () {

                        var constructor_chain = Class["x:constructor-chain"];
                        for (var i = 0, length = constructor_chain.length; i < length; i++)
                        {
                            constructor_chain[i].apply(this, arguments);
                        }
                    };
                }
            }
            else
            {
                constructor_chain && (Class["x:constructor-chain"] = constructor_chain);
                Class.create = superClass_create;
            }
        }



        //初始化链
        var initialize_chain = superClass["x:initialize-chain"],
            initialize = Class.initialize;

        if (initialize || initialize_chain)
        {
            initialize_chain = Class["x:initialize-chain"] = initialize_chain ? initialize_chain.slice(0) : [];

            initialize && initialize_chain.push(initialize);

            for (var i = 0; i < initialize_chain.length; i++) //执行初始化类方法(从基类开始执行)
            {
                initialize_chain[i].call(Class, flyingon);
            }
        }



        return Class;
    };




})(flyingon);

