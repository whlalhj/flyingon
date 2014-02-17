"use strict";
///以上代码启用严格模式

//注意页面渲染模式设置, 否则IE启用了兼容模式时可能无法执行脚本
//<!--以IE的当前版本渲染,如果安装了ChromeFrame则优先使用-->
//<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />

/*

*/




//根命名空间
var flyingon = this.flyingon = {};




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


    //二分法搜索数据段
    prototype.binary_between = function (value, start, end) {

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
    prototype.binary_indexOf = function (value, start, end) {

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
    prototype.binary_search = function (callback, start, end) {

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
            result = callback.call(this, start, center, end);

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


    //去重复 
    //save_after: 为true时保留后面的值
    prototype.remove_repeat = function (save_after) {

        var keys = {},
            key;

        if (save_after)
        {
            for (var i = this.length; i >= 0; i--)
            {
                if (keys[key = this[i]])
                {
                    this.removeAt(i);
                }
                else
                {
                    keys[key] = true;
                }
            }
        }
        else
        {
            for (var i = 0, length = this.length; i < length; i++)
            {
                if (keys[key = this[i]])
                {
                    this.removeAt(i);
                    length--;
                }
                else
                {
                    keys[key] = true;
                }
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

            if (key.constructor == Array)
            {
                if (value.constructor == Array)
                {
                    for (var i = 0; i < key.length; i++)
                    {
                        body = body.replace(key[i], value[i]);
                    }
                }

                throw new Error(flyingon_lang.parameter_error);
            }
            else //key传入数组
            {
                body = body.replace(key, value);
            }

            return new Function(parameters || this.get_parameters(), body);
        }

        return this;
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



})(flyingon);




//循环处理
(function (flyingon) {


    var data = {};

    //循环执行指定函数
    data.for_call = function (fn) {

        var result;

        for (var i = 0, length = this.length; i < length; i++)
        {
            if ((result = fn(this[i], i)) !== undefined)
            {
                return result;
            }
        }
    };

    //循环调用指定名称的方法
    data.for_invoke = function (name, parameters) {

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
    data.for_has = function (name, value, parameters) {

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
    data.for_exist = function (name, value) {

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
    data.for_value = function (name, value) {

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
            for (var name in data)
            {
                target[name] = data[name];
            }
        }
    };



})(flyingon);




//名字空间
(function (flyingon) {


    //缓存命名空间
    var cache = { "flyingon": flyingon },
        self = this;


    //名字空间类
    var Class = function (name) {

        this.__namespace_name__ = name;
        cache[name] = this;
    };


    //创建或切换名字空间方法
    flyingon.namespace = function (namespace, fn) {


        var result = namespace;


        if (result)
        {
            if (result.constructor == String && !(result = cache[result]))
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
                        result = result[name] || (result[name] = new Class(value));
                    }
                }
            }
        }
        else
        {
            result = flyingon;
        }


        flyingon.__namespace__ = result; //切换当前命名空间

        if (fn)
        {
            fn(result, flyingon);
        }


        return result;
    };


    //切换当前命名空间为默认命名空间
    flyingon.__namespace__ = flyingon;



}).call(this, flyingon);




//基类及继承实现
(function (flyingon) {



    //已注册类集合
    flyingon.__registry_list__ = { "RootObject": flyingon.RootObject };


    flyingon.registry_class = function (Class, fullTypeName) {

        flyingon.__registry_list__[fullTypeName || Class.__fullTypeName__] = Class;
    };

    flyingon.unregistry_class = function (fullTypeName) {

        delete flyingon.__registry_list__[fullTypeName];
    };

    flyingon.get_regsitry_class = function (fullTypeName) {

        return flyingon.__registry_list__[fullTypeName];
    };



    //初始化类型系统
    function initialize(Class, typeName) {


        var namespace = flyingon.__namespace__,
            prototype = Class.prototype,
            name;


        //绑定类型
        prototype.__type__ = Class;

        //开放所属类型属性
        flyingon.defineVariable(prototype, "type", Class);

        Class.namesapce = prototype.__namespace__ = namespace;
        Class.typeName = prototype.__typeName__ = typeName;
        Class.fullTypeName = prototype.__fullTypeName__ = (name = namespace.__namespace_name__) ? name + "." + typeName : typeName;



        //输出类
        namespace[typeName] = Class;
        //注册类
        flyingon.__registry_list__[name] = Class;


        prototype.toString = prototype.toLocaleString = function () {

            return "[object " + this.__fullTypeName__ + "]";
        };
    };



    //根类
    initialize(flyingon.RootObject = function () { }, "RootObject");



    //定义类方法
    //body: 扩展代码 必须为函数
    //constructor_merge: 是否合并构造函数 true:合并构造函数内容以提升性能 如果构造函数中有局部变量则不可设成true 默认为false
    flyingon.class = function (typeName, supertype, body, constructor_merge) {


        //处理参数
        if (!typeName)
        {
            throw new Error(flyingon_setting.define_class_error.format(typeName));
        }

        if (!body || typeof body == "boolean")
        {
            body = supertype;
            supertype = flyingon.RootObject;
        }
        else if (!supertype) //没有指定基类
        {
            supertype = flyingon.RootObject;
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
        var prototype = Class.prototype = Object.create(supertype.prototype);

        //父类
        Class.supertype = supertype;
        //父类原型
        Class.super = supertype.prototype;
        //子类集合
        (supertype.subtypes || (supertype.subtypes = [])).push(Class);

        //构造函数/所属类型
        prototype.constructor = Class;
        //默认值
        prototype.__defaults__ = Class.__defaults__ = Object.create(supertype.__defaults__ || null);

        //初始化类型系统
        initialize(Class, typeName);



        //扩展
        if (typeof body == "function")
        {
            body.call(prototype, Class, flyingon);
        }
        else//兼容类似{ __init__: function(Class, flyingon) { }, p1: 1 }写法扩展
        {
            for (var name in body)
            {
                if (name == "__init__" && typeof body[name] == "function") //初始化
                {
                    body[name].call(prototype, Class, flyingon);
                }
                else
                {
                    prototype[name] = body[name];
                }
            }
        }



        //处理构造函数
        var supertype_create = supertype.create;
        if (supertype_create)
        {
            var Class_create = Class.create,
                create_list = supertype.__create_list__;

            if (Class_create)
            {
                //合并构造函数以提升性能 注:已有构造链时不可以合并
                if (!create_list && constructor_merge)
                {
                    Class.create = Class_create.merge(supertype_create, true);
                }
                else //生成构造链
                {
                    create_list = Class.__create_list__ = create_list ? create_list.slice(0) : [supertype_create];
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

                Class.create = supertype_create;
            }
        }


        return Class;
    };




})(flyingon);
