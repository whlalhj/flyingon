/// <reference path="Core.js" />
/// <reference path="SerializableObject.js" />


(function ($) {


    $.class("DataBinding", $.SerializableObject, function () {


        this.defineProperty("source", null, "resource");

        this.defineProperty("name", null);

        this.defineProperty("getter", null);

        this.defineProperty("setter", null);

        this.defineProperty("formatter", null);



        //绑定源
        this["x:source"] = null;

        //绑定目标
        this["x:target"] = null;

        //是否正在处理绑定
        this["x:binding"] = false;

        //获取值变量列表
        this["x:getter:variables"] = null;

        //设置值变量列表
        this["x:setter:variables"] = null;

        //获取值函数
        this["fn:getter"] = null;

        //设置值函数
        this["fn:setter"] = null;



        this.initialize = function (source, target) {

            if (source && target)
            {

            }
        };

        this.getValue = function (source) {

            var storage = this["x:storage"],
                cache,
                result;

            if (storage.getter)
            {
                if (!(cache = this["fn:getter"]))
                {
                    cache = this["x:getter:variables"] = [];
                    cache = this["fn:getter"] = $.Expression.parse(storage.getter, cache);
                }

                result = cache.call(source);
            }
            else
            {
                result = source[storage.name];
            }

            return (cache = storage.formatter) ? cache.format(result) : result;
        };

        this.setValue = function (value) {

        };


        this.dispose = function () {

            this["x:source"] = null;
            this["x:target"] = null;
            this["fn:getter"] = null;
            this["fn:setter"] = null;
        };

    });



})(flyingon);