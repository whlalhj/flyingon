"use strict";
///以上代码启用严格模式

//注意页面渲染模式设置, 否则IE启用了兼容模式时可能无法执行脚本
//<!--以IE的当前版本渲染,如果安装了ChromeFrame则优先使用-->
//<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />

/*

*/




//根命名空间
var flyingon = this.flyingon = function () {

};


//全局设定
//可以加载此脚本前使用 var flyingon_setting = { xxx }; 的方式设置参数
//也可以在加载此脚本后直接修改属性值
var flyingon_setting = this.flyingon_setting = flyingon_setting || {};


//默认全局设定 初始化设定值
var flyingon_defaults = {


    //版本
    version: "0.0.0.1",

    //语言
    language: "zh-CHS",

    //默认样式
    default_style: "/themes/default.js",

    //滚动条厚度
    scroll_thickness: 16

};





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




    prototype = Function.prototype;

    prototype.get_body = function () {

        var result = this.toString();
        return result.substring(result.indexOf("{") + 1, result.lastIndexOf("}"))
    };

    prototype.get_parameters = function () {

        var result = this.toString();

        result = result.match(/\([^)]*\)/)[0];
        result = result.substring(1, result.length - 1).replace(/\s+/, "");;

        return result ? result.split(",") : [];
    };

    //合并函数内容
    prototype.merge = function (body, insertBefore) {

        body = typeof body == "function" ? body.get_body() : "" + body;
        body = insertBefore ? body + this.get_body() : this.get_body() + body;

        return new Function(this.get_parameters(), body);
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


    //处理边框属性如:margin border padding值为标准长度为4的数组
    flyingon.__fn_thickness__ = function (target, name) {

        var value = target[name];

        if (value == null)
        {
            target[name] = [0, 0, 0, 0];
        }
        else if (value.constructor == Array)
        {
            switch (value.length)
            {
                case 0:
                    target[name] = [0, 0, 0, 0];
                    break;

                case 1:
                    value[1] = value[2] = value[3] = value[0];
                    break;

                case 2:
                    value[2] = value[0];
                    value[3] = value[1];
                    break;

                case 3:
                    value[3] = value[1];
                    break;
            }
        }
        else
        {
            target[name] = [value = value - 0 || 0, value, value, value];
        }
    };


    //判断目标是否对象或数组(除undefined null boolean number string function外的数据类型)
    flyingon.isObjectOrArray = function (target) {

        if (target != null && typeof target == "object")
        {
            switch (target.constructor)
            {
                case Boolean:
                case Number:
                case String:
                    return false;

                default:
                    return true;
            }
        }

        return false;
    };

    //判断目标是否对象(除undefined null boolean number string function及数组外的数据类型)
    flyingon.isObject = function (target) {

        if (target != null && typeof target == "object")
        {
            switch (target.constructor)
            {
                case Boolean:
                case Number:
                case String:
                case Array:
                    return false;

                default:
                    return !(target instanceof Array);
            }
        }

        return false;
    };

    //复制对象
    flyingon.copy = function (source, ignore_check) {

        var isObject = flyingon.isObjectOrArray;

        if (ignore_check === true || isObject(source))
        {
            var result = new source.constructor(),
                cache;

            if (result instanceof Array)
            {
                for (var i = 0, length = source.length; i < length; i++)
                {
                    result[i] = isObject(cache = source[i]) ? flyingon.copy(cache, true) : cache;
                }
            }
            else
            {
                var keys = Object.keys(source);

                for (var i = 0, length = keys.length; i < length; i++)
                {
                    result[cache = keys[i]] = isObject(cache = source[cache]) ? flyingon.copy(cache, true) : cache;
                }
            }

            return result;
        }

        return source;
    };

    //合并源对象属性至目标对象
    //ignore_exist: 是否忽略已存在的属性
    flyingon.mearge = function (source, target, ignore_exist) {

        var keys = Object.keys(source),
            isObject = flyingon.isObject;

        for (var i = 0, length = keys.length; i < length; i++)
        {
            var key = keys[i],
                source_value = source[key],
                target_value;

            if (isObject(source_value)) //源是对象且不是数组
            {
                if ((target_value = target[key]) && isObject(target_value))
                {
                    flyingon.mearge(source_value, target_value, ignore_exist);
                }
                else if (!ignore_exist || target_value === undefined)
                {
                    target[key] = flyingon.copy(source_value);
                }
            }
            else if (!ignore_exist || (target_value = target[key]) === undefined)
            {
                if (source_value instanceof Array) //源是数组
                {
                    target_value = target[key] = new source_value.constructor();

                    for (var j = 0, count = source_value.length; j < count; j++)
                    {
                        target_value.push(flyingon.copy(source_value[j]));
                    }
                }
                else //简单对象
                {
                    target[key] = source_value;
                }
            }
        }

        return target;
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



    //合并全局设定
    flyingon.mearge(flyingon_defaults, flyingon_setting, false);


})(flyingon);




//名字空间
(function (flyingon) {


    //缓存命名空间
    var cache = { "flyingon": flyingon },
        global = this;


    //名字空间类
    var Class = function (name) {

        this.__name__ = name;
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

        result = flyingon.__namespace__ = result; //切换当前命名空间

        if (fn)
        {
            fn(result, flyingon);
        }

        return result;
    };



    //获取类全名
    flyingon.__fn_classFullName__ = function (namespace, className, with_default) {

        var name = namespace && namespace.__name__;

        if (name)
        {
            return name + "." + className;
        }

        return with_default ? "flyingon." + className : className;
    };



    //切换当前命名空间为默认命名空间
    flyingon.__namespace__ = flyingon;


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




    flyingon.__registry_list__ = { "RootObject": flyingon.RootObject };


    flyingon.registryClass = function (Class, classFullName) {

        flyingon.__registry_list__[classFullName || Class.classFullName] = Class;
    };

    flyingon.unregistryClass = function (classFullName) {

        delete flyingon.__registry_list__[classFullName];
    };

    flyingon.getRegistryClass = function (classFullName) {

        return flyingon.__registry_list__[classFullName];
    };



    var errorMsg = "define class error!",

        defineProperty = function (Class, prototype, name, value) {

            Class[name] = value;
            prototype["__" + name + "__"] = value;
            flyingon.defineVariable(prototype, name, value);
        };


    //定义类方法
    //extension: 类扩展 必须为函数
    //constructor_merge: 是否合并构造函数 true:合并构造函数内容以提升性能 如果构造函数中有局部变量则不可设成true 默认为false
    flyingon.class = function (className, superclass, extension, constructor_merge) {


        //处理参数
        if (!className)
        {
            throw new Error(errorMsg);
        }

        if (extension == null || typeof extension != "function")
        {
            constructor_merge = extension;
            extension = superclass;
            superclass = flyingon.RootObject;
        }
        else if (!superclass) //没有指定基类
        {
            superclass = flyingon.RootObject;
        }

        if (typeof extension != "function") //扩展不是函数
        {
            throw new Error(errorMsg);
        }




        var namespace = flyingon.__namespace__, //当前名字空间
            classFullName = flyingon.__fn_classFullName__(namespace, className); //类全名




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


        defineProperty(Class, prototype, "className", className);           //类名
        defineProperty(Class, prototype, "classFullName", classFullName);   //类全名

        Class.superclass = superclass;          //父类
        Class.super = superclass.prototype;     //父类原型
        (superclass.subclasses || (superclass.subclasses = [])).push(Class);  //子类集合

        prototype.constructor = Class;                                   //构造函数
        prototype.__defaults__ = Class.__defaults__ = Object.create(superclass.__defaults__ || Object.prototype);  //默认值


        flyingon.registryClass(Class); //注册类
        namespace[className] = Class; //输出类



        //扩展
        extension.call(prototype, Class, flyingon);



        //处理构造函数
        var superclass_create = superclass.create;
        if (superclass_create)
        {
            var Class_create = Class.create,
                create_chain = superclass.__create_chain__;

            if (Class_create)
            {
                //合并构造函数 注:已有构造链时不可以合并
                if (!create_chain && constructor_merge)
                {
                    Class.create = Class_create.merge(superclass_create, true);
                }
                else //生成构造链
                {
                    (Class.__create_chain__ = (create_chain && create_chain.slice(0)) || [superclass_create]).push(Class_create);

                    Class.create = function () {

                        var create_chain = Class.__create_chain__;
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
                    Class.__create_chain__ = create_chain;
                }

                Class.create = superclass_create;
            }
        }


        return Class;
    };




})(flyingon);





//系统初始化方法
(function (flyingon) {


    var style_loaded = false;


    //加载默认样式
    function load_default_style() {

        if (!style_loaded)
        {
            var data = flyingon.require(flyingon_setting.default_style || "themes/default.js");

            if (data)
            {
                flyingon.fonts = data.fonts || {};
                flyingon.cursors = data.cursors || {};
                flyingon.images = data.images || {};
                flyingon.colors = data.colors || {};
                flyingon.styles = data.styles || {};
                flyingon.templates = data.templates || {};

                parse_style(flyingon.styles);
            }

            style_loaded = true;
        }
    };

    //复制样式
    function initialize_style(Class) {

        var subclasses = Class.subclasses;
        if (subclasses)
        {
            var styles = flyingon.styles,
                templates = flyingon.templates,
                parent_style = styles[Class.classFullName],
                parent_template = templates[Class.classFullName];

            for (var i = 0, length = subclasses.length; i < length; i++)
            {
                var target = subclasses[i],
                    className = target.className,
                    style = styles[className] || (styles[className] = {}),
                    template = templates[className] || (templates[className] = {});


                //复制上级样式
                if (parent_style)
                {
                    flyingon.mearge(parent_style, style, true);
                }

                //复制上级模板
                if (parent_template)
                {
                    flyingon.mearge(parent_template, template, true);
                }


                //递归
                initialize_style(target);
            }
        }
    };


    function parse_thickness(name) {

        this[name] = new flyingon.Thickness(this[name]);
    };


    var parse_setting = {

        margin: parse_thickness,
        border: parse_thickness,
        padding: parse_thickness
    };


    function parse_style(target) {

        var names = Object.keys(target),
            name,
            value,
            fn;

        for (var i = 0, length = names.length; i < length; i++)
        {
            if ((name = names[i]) && (fn = parse_setting[name]))
            {
                fn.call(target, name);
            }
            else if ((value = target[name]) && typeof value == "object" && value.constructor != Array)
            {
                parse_style(value);
            }
        }

    };



    //加载样式
    flyingon.load_style = function (url) {

        if (url)
        {
            load_default_style();

            var data = flyingon.require(url);

            if (data)
            {
                parse_style(data);
                flyingon.mearge(data, flyingon);
            }
        }
    };



    //初始化系统
    flyingon.initialize = function (reset) {

        if (flyingon.Control)
        {
            //加载默认样式
            load_default_style();

            //初始化控件样式
            initialize_style(flyingon.Control);
        }
    };


})(flyingon);