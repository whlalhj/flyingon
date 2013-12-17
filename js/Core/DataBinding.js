/// <reference path="Core.js" />
/// <reference path="SerializableObject.js" />


(function ($) {



    $.clearBindings = function (source) {

        if (source = source["x:bindings:source"])
        {
            var names = Object.getOwnPropertyNames(source),
                name,
                binding,
                target;


            for (var i = 0, length = names.length; i < length; i++)
            {
                if ((name = names[i]) && (binding = source[name]))
                {
                    delete source[name];

                    if (target = binding["x:target"])
                    {
                        delete target[binding.propertyName];
                    }
                }
            }
        }
    };




    $.DataBinding = function (source, expression, formatter, setter) {

        if (arguments.length > 0)
        {
            if (expression == null)
            {
                expression = source.expression;
                formatter = source.formatter;
                setter = source.setter;
                source = source.source;
            }


            this["x:source"] = source;
            this["x:expression"] = "" + expression;

            if (formatter != null)
            {
                this["x:formatter"] = "" + formatter;
            }

            if (setter != null)
            {
                this["x:setter"] = "" + setter;
            }
        }
    };


    var p = $.DataBinding.prototype;


    var defineProperty = function (name) {

        $.defineProperty(p, name, function () {

            return this["x:" + name];
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

    //格式化
    defineProperty("formatter");

    //更新表达式
    defineProperty("setter");




    //是否正在处理绑定
    p["x:binding"] = false;

    //获取值函数
    p["y:getter"] = null;

    //设置值函数
    p["y:setter"] = null;



    //初始化绑定关系
    p["y:initialize"] = function (target, name) {

        var source = this["x:source"],
            expression = this["x:expression"],
            bindings = source["x:bindings:source"] || (source["x:bindings:source"] = {}),
            cache;


        this["x:target"] = target;
        this["x:name"] = name;


        //缓存目标
        if (cache = target["x:bindings"])
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
            (target["x:bindings"] = {})[name] = this;
        }



        //如果表达式以数据开头或包含字母数字下划线外的字符则作表达式处理
        if (expression.match(/^\d|[^\w]/))
        {
            cache = (this["y:getter"] = new $.Expression(expression)).variables;

            for (var i = 0, length = cache.length; i < length; i++)
            {
                bindings[cache[i]] = this;
            }
        }
        else
        {
            this["y:getter"] = null;
            bindings[expression] = this;
        }


        //处理更新
        if (cache = this["x:setter"])
        {
            this["y:setter"] = new $.Expression(cache);
        }
    };


    //从数据源同步数据至目标属性
    p.pull = function () {

        var cache,
            result = (cache = this["y:getter"]) ? cache.eval(this["x:source"]) : this["x:source"][this["x:expression"]];

        this["x:binding"] = true;
        this["x:target"][this.name] = (cache = this["x:formatter"]) ? cache.format(result) : result;
        this["x:binding"] = false;
    };


    //从目标属性同步数据至源
    p.push = function () {

        var cache = this["x:expression"];

        if (cache)
        {
            this["x:binding"] = true;

            if (!this["y:getter"]) //直接绑定字段
            {
                this["x:source"][cache] = this["x:target"][this["x:name"]];
            }
            else if (cache = this["y:setter"]) //表达式需要自定义setter方法
            {
                cache.call(this["x:target"]);
            }

            this["x:binding"] = false;
        }
    };


    //清除绑定关系
    p.clear = function () {

        var source = this["x:source"],
            target = this["x:target"],
            bindings,
            cache;

        if (source && target && (bindings = source["x:bindings:source"]))
        {
            if (cache = this["x:getter"])
            {
                var variables = cache.variables;

                for (var i = 0, length = variables.length; i < length; i++)
                {
                    if (cache = bindings[variables[i]])
                    {
                        delete cache[target.id];
                    }
                }
            }
            else if ((cache = this["x:expression"]) && (cache = bindings[cache]))
            {
                delete cache[target.id];
            }


            delete target["x:bindings"][this["x:name"]];
        }
    };


    p.serialize = function (writer) {

        writer.string("name", this["x:name"]);

        //this["x:source"] = source;
        writer.string("expression", this["x:expression"]);
        writer.string("formatter", this["x:formatter"]);
        writer.string("setter", this["x:setter"]);
    };

    p.deserialize = function (reader, data) {

        reader.string(this, "x:name", data["name"]);

        //this["x:source"] = source;
        reader.string(this, "x:expression", data["expression"]);
        reader.string(this, "x:formatter", data["formatter"]);
        reader.string(this, "x:setter", data["setter"]);
    };


    p.dispose = function () {

        this["x:source"] = null;
        this["x:target"] = null;
        this["y:getter"] = null;
        this["y:setter"] = null;
    };



})(flyingon);