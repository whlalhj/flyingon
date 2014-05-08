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

            for (var i = 0, length = this.length; i < length; i++)
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
        this.for_has = function (name, value, parameters) {

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
        this.for_exist = function (name, value) {

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
        this.for_value = function (name, value) {

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
                //生成伪数组对象作为某些仿数组对象的原型
                //注: 直接使用[]作为原型在ie6时会出错(无法更改length值), 用此方法原型链也会短一些, 但创建时性能会差一些
                if (prototype === true)
                {
                    this.prototype = prototype = { length: 0 };

                    ["indexOf", "lastIndexOf", "push", "pop", "shift", "unshift", "splice", "join", "slice", "forEach", "sort", "concat", "toString", "toLocaleString", "remove", "removeAt", "clear", "binary_between", "binary_search"].forEach(function (name) {

                        this[name] = Array.prototype[name];

                    }, prototype);
                }
                else
                {
                    this.prototype = prototype;
                }
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
            if (result.constructor === String && !(result = namespace_list[result]))
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
    function initialize(namespace, type, typeName) {


        var prototype = type.prototype,
            fullTypeName = namespace.name ? namespace.name + "." + typeName : typeName;


        //绑定类型
        prototype.__type__ = type;

        //获取当前类型
        prototype.getType = function () {

            return type;
        };

        type.namesapce = prototype.__namespace__ = namespace;
        type.typeName = prototype.__typeName__ = typeName;
        type.fullTypeName = prototype.__fullTypeName__ = fullTypeName;


        //输出及注册类
        namespace[typeName] = class_list[fullTypeName] = type;


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
        prototype.__defaults__ = fn.__defaults__ = Object.create(superclass.__defaults__ || null);

        //初始化类型系统
        initialize(this, fn, typeName);

        //扩展
        class_fn.call(prototype, fn, fn.base, flyingon);


        //处理构造函数(自动调用父类的构造函数)
        if (base_create)
        {
            var create_list = superclass.__create_list__;

            if (create = fn.create)
            {
                //合并构造函数以提升性能 注:已有构造链时不可以合并
                if (!create_list && constructor_merge)
                {
                    fn.create = create.merge(base_create, true);
                }
                else //生成构造链
                {
                    create_list = fn.__create_list__ = create_list ? create_list.slice(0) : [base_create];
                    create_list.push(create);

                    fn.create = function () {

                        var list = fn.__create_list__;
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
                    fn.__create_list__ = create_list;
                }

                fn.create = base_create;
            }
        }

        create = fn.create;

        return fn;
    };




})(flyingon);
