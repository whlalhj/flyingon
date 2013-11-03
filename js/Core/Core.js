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

