
//选择器
(function (flyingon) {


    //缓存数据
    var selector_cache = {};


    //选择器
    //selector: css样式选择表达式 
    //start: 开始搜索节点
    var Query = flyingon.Query = function (selector, start) {

        if (selector)
        {
            if (typeof selector == "string")
            {
                if (!start)
                {
                    throw new Error(flyingon_lang.query_must_start);
                }

                selector = (selector_cache[selector] || (selector_cache[selector] = flyingon.parse_selector(selector))).query(start);
            }
            else
            {
                switch (selector.constructor)
                {
                    case flyingon.Selector_Element:
                        selector = selector.find([start]);
                        break;

                    case Array:
                        break;

                    default:
                        this.push(selector);
                        return;
                }
            }

            if (selector.length > 0)
            {
                this.push.apply(this, selector);
            }
        }
    };






    //扩展选择器方法
    /*
    flyingon.Query.extend({

        test: function () {

            this.forEach(...);
            return this;
        }
    });
    */
    Query.extend = function (data) {

        if (data)
        {
            var prototype = Query.prototype;

            for (var name in data)
            {
                prototype[name] = data[name];
            }
        }
    };





    var prototype = flyingon.query = flyingon.Query.prototype = flyingon.__pseudo_array__();



    //扩展for相关方法
    flyingon.for_extend(prototype);


    //合并
    prototype.merge = function (selector, context) {

        this.push.call(this, selector, context);
        return this;
    };


    //保存状态
    prototype.save = function () {

        var query = new flyingon.Query();

        query.push.apply(query, this);
        query.__previous__ = this;

        return query;
    };

    //恢复到上次保存的状态(没有保存的状态则返回自身)
    prototype.restore = function () {

        var result = this.__previous__;

        if (result)
        {
            this.__previous__ = null;
            return result;
        }

        return this;
    };


    //获取第一个项
    prototype.first = function () {

        if (this.length > 1)
        {
            this.splice(1, this.length - 1);
        }

        return this;
    };

    //获取最后一个项
    prototype.last = function () {

        if (this.length > 1)
        {
            this.splice(0, this.length - 2);
        }

        return this;
    };

    //获取奇数项
    prototype.odd = function () {

        return this.mod(0, 2);
    };

    //获取偶数项
    prototype.even = function () {

        return this.mod(1, 2);
    };

    //复合求余值的项
    prototype.mod = function (mod, length) {

        var values = [];

        for (var i = 0, length = this.length; i < length; i++)
        {
            if (i % length == mod)
            {
                values.push(this[i]);
            }
        }

        this.length = 0;
        this.push.apply(this, values);

        return this;
    };

    //筛选项
    prototype.filter = function (fn) {

        var values = [], item;

        for (var i = 0, length = this.length; i < length; i++)
        {
            if (i % length == mod)
            {
                if (fn(item = this[i], i))
                {
                    values.push(item);
                }
            }
        }

        this.length = 0;
        this.push.apply(this, values);

        return this;
    };





    prototype.addEventListener = function (type, fn) {

        this.for_apply("addEventListener", arguments);
        return this;
    };

    prototype.removeEventListener = function (type, fn) {

        this.for_apply("removeEventListener", arguments);
        return this;
    };



    prototype.hasClass = function (className) {

        return this.for_has("hasClass", true, arguments);
    };

    prototype.addClass = function (className) {

        this.for_apply("addClass", arguments);
        return this;
    };

    prototype.removeClass = function (className) {

        this.for_apply("removeClass", arguments);
        return this;
    };

    prototype.toggleClass = function (className) {

        this.for_apply("toggleClass", arguments);
        return this;
    };



})(flyingon);


