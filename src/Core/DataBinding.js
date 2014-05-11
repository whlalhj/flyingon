/// <reference path="Core.js" />
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


    var clearBindings = function (fields, dispose) {

        var keys = Object.keys(fields),
            key,
            bindings;

        for (var i = 0, length = keys.length; i < length; i++)
        {
            if ((key = keys[i]) && (bindings = source[key]))
            {
                var keys2 = Object.keys(bindings);

                for (var j = 0, length2 = keys2.length; j < length2; j++)
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

                for (var i = 0, length = cache.length; i < length; i++)
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

                    for (var i = 0, length = parameters.length; i < length; i++)
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