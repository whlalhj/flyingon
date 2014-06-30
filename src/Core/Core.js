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


    //是否IE IE不对"\v"作转义处理
    support.IE = !+"\v1";


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



    //增加字符串顺序格式化支持
    flyingon.string_format = function (string_value, values) {

        return string_value ? string_value.replace(/\{(\d+)\}/g, function (_, key) {

            return values[key] || "";

        }) : string_value;
    };


    //增加字符串关键字格式化支持
    flyingon.string_format_key = function (string_value, values) {

        return string_value ? string_value.replace(/\{(\w+)\}/g, function (_, key) {

            return values[key] || "";

        }) : string_value;
    };

    //增加字符串顺序格式化支持
    flyingon.string_trim = function (string_value) {

        return string_value ? string_value.replace(/^\s+|\s+$/g, "") : string_value;
    };




    //移除指定项
    flyingon.array_remove = function (array, item) {

        if (array)
        {
            var index = array.indexOf(item);
            if (index >= 0)
            {
                array.splice(index, 1);
            }
        }
    };

    //清空
    flyingon.array_clear = function (array) {

        if (array && array.length > 0)
        {
            array.splice(0, array.length);
        }
    };

    //二分法搜索
    flyingon.binary_search = function (array, value, start, end) {

        if (array)
        {
            var flag = typeof value !== "function";

            start = start || 0;
            end = end || array.length - 1;

            while (start <= end)
            {
                var index = (start + end) >> 1,
                    result = flag ? array[index] - value : value.call(array, index);

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
        }

        return -1;
    };

    //二分法搜索区间
    flyingon.binary_between = function (array, value, start, end) {

        if (array)
        {
            var flag = typeof value !== "function";

            start = start || 0;
            end = end || array.length - 1;

            while (start <= end)
            {
                var index = (start + end) >> 1,
                    result = flag ? array[index] - value : value.call(array, index);

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

                    if ((flag ? array[index + 1] - value : value.call(array, index + 1)) > 0)
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
        }

        return -1;
    };




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




    flyingon.toDataUrl = function (image) {

        if (image)
        {
            var canvas = document.createElement("canvas");

            canvas.width = image.width;
            canvas.height = image.height;
            canvas.getContext("2d").drawImage(image, 0, 0);

            return canvas.toDataURL("image/png");
        }
    };




    //获取函数内容
    flyingon.function_body = function (fn) {

        if (fn)
        {
            var result = fn.toString();
            return result.substring(result.indexOf("{") + 1, result.lastIndexOf("}"));
        }
    };

    //获取函数参数
    flyingon.function_parameters = function (fn) {

        if (fn && fn.length > 0)
        {
            var result = fn.toString();

            result = result.match(/\([^)]*\)/)[0];
            result = result.substring(1, result.length - 1).replace(/\s+/, "");;

            return result.split(",");
        }

        return [];
    };

    //复制函数生成新函数
    flyingon.function_copy = function (fn) {

        return fn && new Function(flyingon.function_parameters(fn), flyingon.function_body(fn));
    };

    //合并函数内容生成新函数
    flyingon.function_merge = function (fn, body, insertBefore, parameters) {

        if (fn && body)
        {
            var get = flyingon.function_body;

            body = typeof body === "function" ? get(body) : "" + body;
            body = insertBefore ? body + get(fn) : get(fn) + body;

            return new Function(parameters || flyingon.function_parameters(fn), body);
        }
    };

    //替换函数内容生成新函数
    flyingon.function_replace = function (fn, key, value, parameters) {

        if (fn && key)
        {
            parameters = parameters || flyingon.function_parameters(fn);
            value = flyingon.function_body(fn).replace(key, value);

            return new Function(parameters, value);
        }
    };


    //扩展原型
    flyingon.function_extend = function (fn, extend, prototype) {

        fn = fn || function () { };

        if (!extend)
        {
            extend = fn;
            fn = function () { };
        }

        if (prototype)
        {
            fn.prototype = prototype;
        }
        else
        {
            prototype = fn.prototype;
        }

        if (typeof extend === "function")
        {
            extend.call(prototype, flyingon);
        }
        else
        {
            for (var name in extend)
            {
                prototype[name] = extend[name];
            }
        }

        return fn;
    };


})(flyingon);




//通用函数区
(function (flyingon) {



    //代码性能测试
    flyingon.performance_test = function (code, times) {

        if (typeof code === "function")
        {
            code = flyingon.function_body(code);
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
    flyingon.defineVariable = function (target, name, value, writable, configurable, enumerable) {

        //target[name] = value;
        Object.defineProperty(target, name, {

            value: value,
            writable: writable || false,
            configurable: configurable || true,
            enumerable: enumerable || false
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

        unkown_index = 1, //未知类索引

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
            if (typeof result === "string" && !(result = namespace_list[result]))
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
    function initialize(namespace, Class, typeName) {


        var prototype = Class.prototype,
            name = typeName || "unkown_type_" + unkown_index++;


        //绑定类型
        prototype.__class_type = Class;

        //获取当前类型
        prototype.getType = function () {

            return Class;
        };

        Class.namesapce = prototype.__namespace = namespace;

        Class.typeName = prototype.__typeName = name;
        Class.fullTypeName = prototype.__fullTypeName = namespace.name ? namespace.name + "." + name : name;

        //输出及注册类(匿名类不注册)
        if (typeName)
        {
            namespace[typeName] = class_list[Class.fullTypeName] = Class;
        }

        prototype.toString = prototype.toLocaleString = function () {

            return "[object " + this.__fullTypeName + "]";
        };
    };



    //初始化根类
    initialize(flyingon, RootObject, "RootObject");




    //定义类方法
    //class_fn: 类型扩展函数 共有三个参数 Class:当前类型 base:父类 flyingon:系统对象 
    flyingon.defineClass = namespace_fn.prototype.defineClass = function (typeName, superclass, class_fn) {


        //处理参数
        if (typeName && typeName.constructor !== String) //不传typeName则创建匿名类
        {
            class_fn = superclass;
            superclass = typeName;
            typeName = null;
        }

        if (!class_fn)
        {
            class_fn = superclass;
            superclass = RootObject;
        }
        else if (!superclass) //没有指定基类
        {
            superclass = RootObject;
        }

        if (class_fn.constructor !== Function)
        {
            throw new Error("class_fn error!");
        }


        //声明构造函数及父类构造函数
        var create, base_create = superclass.create;

        //定义类模板
        function Class() {

            if (create)
            {
                create.apply(this, arguments);
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
        prototype.__defaults = Class.__defaults = Object.create(superclass.__defaults || null);

        //初始化类型系统
        initialize(this, Class, typeName);

        //扩展
        class_fn.call(prototype, Class, Class.base, flyingon);


        //处理构造函数(自动调用父类的构造函数)
        if (base_create)
        {
            var create_list = superclass.__create_list;

            if (create = Class.create)
            {
                //合并构造函数以提升性能 注:已有构造链时不可以合并
                if (!create_list && Class.combine_create)
                {
                    Class.create = flyingon.function_merge(create, base_create, true);
                }
                else //生成构造链
                {
                    create_list = Class.__create_list = create_list ? create_list.slice(0) : [base_create];
                    create_list.push(create);

                    Class.create = function () {

                        var list = Class.__create_list;
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
                    Class.__create_list = create_list;
                }

                Class.create = base_create;
            }
        }

        create = Class.create;

        return Class;
    };




})(flyingon);
