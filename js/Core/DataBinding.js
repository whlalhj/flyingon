/// <reference path="Core.js" />
/// <reference path="SerializableObject.js" />


(function (flyingon) {




    //正向绑定(绑定数据源至目标控件)
    flyingon.bindingTo = function (source, name) {

        var bindings = source["x:bindings"],
            binding;

        if (bindings && (bindings = bindings.push) && (binding = bindings[name]))
        {
            var keys = Object.getOwnPropertyNames(binding),
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


    var clearBindings = function (storage, dispose) {

        var names = Object.getOwnPropertyNames(storage),
            name,
            bindings;

        for (var i = 0, length = names.length; i < length; i++)
        {
            if ((name = names[i]) && (bindings = source[name]))
            {
                var keys = Object.getOwnPropertyNames(bindings);

                for (var j = 0, count = keys.length; j < count; j++)
                {
                    bindings[keys[j]].clear(dispose);
                }
            }
        }
    };

    flyingon.clearBindings = function (source, dispose) {

        if (source && (source = source["x:bindings"]))
        {
            var storage = source.pull;

            storage && clearBindings(storage, dispose);
            (storage = source.push) && clearBindings(storage, dispose);
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

            this["x:source"] = source;
            this["x:expression"] = expression;
            this["x:setter"] = setter;
        }

    }).prototype;


    var defineProperty = function (name) {

        flyingon.defineProperty(prototype, name, function () {

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

    //更新表达式
    defineProperty("setter");




    //是否正在处理绑定
    prototype["x:binding"] = false;

    //获取值函数
    prototype["y:getter"] = null;

    //设置值函数
    prototype["y:setter"] = null;



    //初始化绑定关系
    prototype["y:initialize"] = function (target, name) {

        var source = this["x:source"],
            expression = this["x:expression"],
            bindings = target["x:bindings"] || (target["x:bindings"] = {}),
            id = target.id || (target.id = flyingon.newId()),
            cache;


        this["x:target"] = target;
        this["x:name"] = name;


        //缓存目标
        if (cache = bindings.pull)
        {
            //一个目标属性只能绑定一个
            cache[name] && cache[name].clear();
            cache[name] = this;
        }
        else
        {
            (bindings.pull = {})[name] = this;
        }



        bindings = source["x:bindings"] || (source["x:bindings"] = { push: {} });
        bindings = bindings.push || (bindings.push = {});

        //如果表达式以数据开头或包含字母数字下划线外的字符则作表达式处理
        if (expression.match(/^\d|[^\w]/))
        {
            cache = (this["y:getter"] = new flyingon.Expression(expression)).variables;

            for (var i = 0, length = cache.length; i < length; i++)
            {
                expression = cache[i];
                (bindings[expression] || (bindings[expression] = {}))[id] = this;
            }
        }
        else
        {
            this["y:getter"] = null;
            (bindings[expression] || (bindings[expression] = {}))[id] = this;
        }


        //处理更新
        (cache = this["x:setter"]) && (this["y:setter"] = new flyingon.Expression(cache));
    };



    //从数据源同步数据至目标属性
    prototype.pull = function () {

        var source = this["x:source"],
            result;

        if (result = this["y:getter"])
        {
            result = result.eval(source);
        }
        else
        {
            var name = this["x:expression"];
            if ((result = source[name]) === undefined)
            {
                source instanceof flyingon.DataObject && (result = source.value(name));
            }
        }

        this["x:binding"] = true;
        this["x:target"][this["x:name"]] = result;
        this["x:binding"] = false;
    };


    //从目标属性同步数据至源
    prototype.push = function () {

        var cache = this["x:expression"];

        if (cache)
        {
            this["x:binding"] = true;

            if (!this["y:getter"]) //直接绑定字段
            {
                var target = this["x:target"],
                    name = this["x:name"];

                (result = target[name]) === undefined && target instanceof flyingon.DataObject && (result = target.value(name));
                this["x:source"][cache] = result;
            }
            else if (cache = this["y:setter"]) //表达式需要自定义setter方法
            {
                cache.call(this["x:target"]);
            }

            this["x:binding"] = false;
        }
    };


    //清除绑定关系
    prototype.clear = function (dispose) {

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


        if (dispose)
        {
            delete this["x:source"];
            delete this["x:target"];
            delete this["y:getter"];
            delete this["y:setter"];
        }
    };


    prototype.serialize = function (writer) {

        writer.reference("source", this["x:source"]);
        writer.string("expression", this["x:expression"]);
        writer.string("setter", this["x:setter"]);
    };

    prototype.deserialize = function (reader, data) {

        reader.reference(this, "x:source", data["source"]);
        reader.string(this, "x:expression", data["expression"]);
        reader.string(this, "x:setter", data["setter"]);
    };



})(flyingon);