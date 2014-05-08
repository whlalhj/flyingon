/// <reference path="Core.js" />
/// <reference path="SerializableObject.js" />


(function (flyingon) {




    //正向绑定(绑定数据源至目标控件)
    flyingon.bindingTo = function (source, name) {

        var bindings = source.__bindings__,
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

        if (source && (source = source.__bindings__))
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

            this.__source__ = source;
            this.__expression__ = expression;
            this.__setter__ = setter;
        }

    }).extend(function () {


        var self = this,

            defineProperty = function (name) {

                flyingon.defineProperty(self, name, function () {

                    return this["__" + name + "__"];
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
        this.__binding__ = false;

        //获取值函数
        this.__fn_getter__ = null;

        //设置值函数
        this.__fn_setter__ = null;



        //初始化绑定关系
        this.__fn_initialize__ = function (target, name) {

            var source = this.__source__,
                expression = this.__expression__,
                bindings = target.__bindings__ || (target.__bindings__ = {}),
                id = target.id || (target.id = flyingon.newId()),
                cache;


            this.__target__ = target;
            this.__name__ = name;


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



            bindings = source.__bindings__ || (source.__bindings__ = { push: {} });
            bindings = bindings.push || (bindings.push = {});

            //如果表达式以数据开头或包含字母数字下划线外的字符则作表达式处理
            if (expression.match(/^\d|[^\w]/))
            {
                cache = (this.__fn_getter__ = new flyingon.Expression(expression)).parameters;

                for (var i = 0, length = cache.length; i < length; i++)
                {
                    expression = cache[i];
                    (bindings[expression] || (bindings[expression] = {}))[id] = this;
                }
            }
            else
            {
                this.__fn_getter__ = null;
                (bindings[expression] || (bindings[expression] = {}))[id] = this;
            }


            //处理更新
            if (cache = this.__setter__)
            {
                this.__fn_setter__ = new flyingon.Expression(cache);
            }
        };



        //从数据源同步数据至目标属性
        this.pull = function () {

            var source = this.__source__,
                result;

            if (result = this.__fn_getter__)
            {
                result = result.eval(source);
            }
            else
            {
                var name = this.__expression__;
                if ((result = source[name]) === undefined && source instanceof flyingon.DataObject)
                {
                    result = source.value(name);
                }
            }

            this.__binding__ = true;
            this.__target__[this.__name__] = result;
            this.__binding__ = false;
        };


        //从目标属性同步数据至源
        this.push = function () {

            var cache = this.__expression__;

            if (cache)
            {
                this.__binding__ = true;

                if (!this.__fn_getter__) //直接绑定字段
                {
                    var target = this.__target__,
                        name = this.__name__;

                    if ((result = target[name]) === undefined && target instanceof flyingon.DataObject)
                    {
                        result = target.value(name);
                    }

                    this.__source__[cache] = result;
                }
                else if (cache = this.__fn_setter__) //表达式需要自定义setter方法
                {
                    cache.call(this.__target__);
                }

                this.__binding__ = false;
            }
        };


        //清除绑定关系
        this.clear = function (dispose) {

            var source = this.__source__,
                target = this.__target__,
                bindings,
                cache;

            if (source && target && (bindings = source.__bindings_source__))
            {
                if (cache = this.__getter__)
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
                else if ((cache = this.__expression__) && (cache = bindings[cache]))
                {
                    delete cache[target.id];
                }


                delete target.__bindings__[this.__name__];
            }


            if (dispose)
            {
                delete this.__source__;
                delete this.__target__;
                delete this.__fn_getter__;
                delete this.__fn_setter__;
            }
        };


        this.serialize = function (writer) {

            writer.reference("source", this.__source__);
            writer.string("expression", this.__expression__);
            writer.string("setter", this.__setter__);
        };

        this.deserialize = function (reader, data, excludes) {

            reader.reference(this, "__source__", data.source);
            reader.string(this, "__expression__", data.expression);
            reader.string(this, "__setter__", data.setter);
        };


    });



})(flyingon);