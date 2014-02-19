
//选择器
(function (flyingon) {


    //缓存数据
    var selector_cache = {}; 


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

                selector = (selector_cache[selector] || (selector_cache[selector] = flyingon.parse_selector(selector))).query(start);
            }
            else
            {
                switch (selector.constructor)
                {
                    case flyingon.SelectorElement:
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


