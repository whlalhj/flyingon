
//选择器
(function (flyingon) {



    //实现解析器查询方法
    (function () {

        //查找
        this.find = function (items) {

            var exports = [],
                node = this;

            while (true)
            {
                node[node.type](items, exports);

                if (node = node.next)
                {
                    if (node.type != ",") //非组合则把当前集合作为查询依据
                    {
                        items = exports;
                        exports = [];
                    }
                }
                else
                {
                    return exports;
                }
            }
        };

        this.find_cascade = function (items, exports) {

            var cache;

            for (var i = 0, length = items.length; i < length; i++)
            {
                if (this.check(cache = items[i], i, exports) === false)
                {
                    return false;
                }

                if ((cache = cache.__children__) && cache.length > 0)
                {
                    if (this.find_cascade(cache, exports) === false)
                    {
                        return false;
                    }
                }
            }
        };

        this[" "] = function (items, exports) {

            var item, cache;

            for (var i = 0, length = items.length; i < length; i++)
            {
                item = items[i];

                if ((cache = item.__children__) && cache.length > 0)
                {
                    this.find_cascade(cache, exports);
                }
            }
        };

        this[">"] = function (items, exports) {

            var children;

            for (var i = 0, length = items.length; i < length; i++)
            {
                if ((children = items[i].__children__) && children.length > 0)
                {
                    for (var j = 0, length_j = children.length; j < length_j; j++)
                    {
                        if (this.check(children[j], j, exports) === false)
                        {
                            break;
                        }
                    }
                }
            }
        };

        this["+"] = function (items, exports) {

            var item, parent, children, index;

            for (var i = 0, length = items.length; i < length; i++)
            {
                if ((item = items[i]) && (parent = item.__parent__) && (children = parent.__children__))
                {
                    index = children.indexOf(item) + 1;

                    if (children.length > index)
                    {
                        this.check(children[index], index, exports);
                    }
                }
            }
        };

        this["~"] = function (items, exports) {

            var item, parent, children;

            for (var i = 0, length = items.length; i < length; i++)
            {
                if ((item = items[i]) && (parent = item.__parent__) && (children = parent.__children__))
                {
                    for (var j = children.indexOf(item) + 1, length_j = children.length; j < length_j; j++)
                    {
                        if (this.check(children[j], j, exports) === false)
                        {
                            break;
                        }
                    }
                }
            }
        };

        this[","] = function (items, exports) {

            this[this.previous_type](items, exports);
        };

    }).call(flyingon.Query_Element.prototype);




    var selector_cache = {}; //缓存数据

    //选择器
    //selector: css样式选择表达式 
    //start: 开始搜索节点
    //cache: 是否缓存解析结果
    var Query = flyingon.Query = function (selector, start) {

        if (selector)
        {
            if (typeof selector == "string")
            {
                if (!start)
                {
                    throw new Error(flyingon_lang.query_must_start);
                }

                if (start.constructor != Array)
                {
                    start = [start];
                }

                selector = (selector_cache[selector] || (selector_cache[selector] = flyingon.parse_selector(selector))).find(start);
            }
            else
            {
                switch (selector.constructor)
                {
                    case flyingon.Query_Element:
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

            return this.forEach(...);
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





    var prototype = flyingon.query = flyingon.Query.prototype = [];


    //循环执行指定函数
    prototype.forEach = function (fn) {

        for (var i = 0, length = this.length; i < length; i++)
        {
            fn(this[i], i);
        }

        return this;
    };

    //扩展for相关方法
    flyingon.for_extend(prototype);


    //合并
    prototype.merge = function (selector, context) {

        flyingon.Selector.call(this, selector, context);
        return this;
    };

    //筛选子项
    prototype.filter = function (fn) {

    };

    //如果进行过筛选则回到筛选前的状态
    prototype.back = function () {


    };





    prototype.addEventListener = function (type, fn) {

        return this.for_invoke("addEventListener", arguments);
    };

    prototype.removeEventListener = function (type, fn) {

        return this.for_invoke("removeEventListener", arguments);
    };



    prototype.hasClass = function (className) {

        return this.for_has("hasClass", true, arguments);
    };

    prototype.addClass = function (className) {

        this.for_invoke("addClass", arguments);
        return this;
    };

    prototype.removeClass = function (className) {

        return this.for_invoke("removeClass", arguments);
    };

    prototype.toggleClass = function (className) {

        return this.for_invoke("toggleClass", arguments);
    };



})(flyingon);


