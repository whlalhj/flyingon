

//扩展选择器元素查询方法
(function (flyingon) {


    //组合查询方法
    var type_fn = (function () {

        function query_cascade(items, exports) {

            var cache;

            for (var i = 0, length = items.length; i < length; i++)
            {
                check.call(this, cache = items[i], exports);

                if ((cache = cache.__children__) && cache.length > 0)
                {
                    query_cascade.call(this, cache, exports);
                }
            }
        };

        //所有后代元素
        this[" "] = function (items, exports) {

            var item, cache;

            for (var i = 0, length = items.length; i < length; i++)
            {
                if ((cache = (item = items[i]).__children__) && cache.length > 0)
                {
                    query_cascade.call(this, cache, exports);
                }
            }
        };

        //子元素
        this[">"] = function (items, exports) {

            var children;

            for (var i = 0, length = items.length; i < length; i++)
            {
                if ((children = items[i].__children__) && children.length > 0)
                {
                    for (var j = 0, length_j = children.length; j < length_j; j++)
                    {
                        check.call(this, children[j], exports);
                    }
                }
            }
        };

        //后一个元素 元素伪类:after也会转换成此节点类型
        this["+"] = function (items, exports) {

            var item, children, index;

            for (var i = 0, length = items.length; i < length; i++)
            {
                if ((item = items[i]) &&
                    (children = item.__parent__.__children__) &&
                    (children.length > (index = children.indexOf(item) + 1)))
                {
                    check.call(this, children[index], exports);
                }
            }
        };

        //所有后续兄弟元素
        this["~"] = function (items, exports) {

            var item, children;

            for (var i = 0, length = items.length; i < length; i++)
            {
                if ((item = items[i]) && (children = item.__parent__.__children__))
                {
                    for (var j = children.indexOf(item) + 1, length_j = children.length; j < length_j; j++)
                    {
                        check.call(this, children[j], exports);
                    }
                }
            }
        };

        //合并元素集
        this[","] = function (items, exports) {

            type_fn[this.previous_type].call(this, items, exports);
        };

        return this;

    }).call({});

    //伪类元素查询方法  
    //注:此处为正向查找
    var element_fn = (function () {

        //获取后一节点
        this.before = function (target) {

            var cache = target.__parent__, index;
            return (cache && (cache = cache.__children__) && (index = cache.indexOf(this)) > 0 && cache[--index]) || false;
        };

        //获取前一节点
        this.after = function (target) {

            var cache = target.__parent__, index;
            return (cache && (cache = cache.__children__) && (index = cache.indexOf(this)) >= 0 && cache[++index]) || false;
        };

        //检测当前节点是否唯一子节点,是则返回父节点
        this["first-child"] = function (target) {

            var cache = target.__children__;
            return (cache && cache.length > 0 && cache[0]) || false;
        };

        this["first-of-type"] = function (target) {

            var result, cache = target.__children__;
            return cache && cache.length > 0 && (result = cache[0]) && target.__fullTypeName__ == result.__fullTypeName__ ? result : false;
        };

        this["last-child"] = function (target) {

            var cache = target.__children__;
            return (cache && cache.length > 0 && cache[cache.length - 1]) || false;
        };

        this["last-of-type"] = function (target) {

            var result, cache = target.__children__;
            return cache && cache.length > 0 && (result = cache[cache.length - 1]) && target.__fullTypeName__ == result.__fullTypeName__ ? result : false;
        };

        this["only-child"] = function (target) {

            var cache = target.__children__;
            return (cache && cache.length == 1 && cache[0]) || false;
        };

        this["only-of-type"] = function (target) {

            var result, cache = target.__children__;
            return cache && cache.length == 1 && (result = cache[0]) && target.__fullTypeName__ == result.__fullTypeName__ ? result : false;
        };

        this["nth-child"] = function (target) {

            var cache = target.__children__, index = +this.value;
            return (cache && cache.length > index && cache[index]) || false;
        };

        this["nth-of-type"] = function (target) {

            var result, cache = target.__children__, index = +this.value;
            return cache && cache.length > index && (result = cache[index]) && target.__fullTypeName__ == result.__fullTypeName__ ? result : false;
        };

        this["nth-last-child"] = function (target) {

            var cache = target.__children__, index = +this.value;
            return (cache && cache.length > index && cache[cache.length - index - 1]) || false;
        };

        this["nth-last-of-type"] = function (target) {

            var result, cache = target.__children__, index = +this.value;
            return cache && cache.length > index && (result = cache[cache.length - index - 1]) && target.__fullTypeName__ == result.__fullTypeName__ ? result : false;
        };

        return this;

    }).call({});


    //目标检测
    function check(target, exports) {

        //必须先检测目标对象是否符合条件 再检测属性及伪类 因为伪元素会改变目标对象
        switch (this.token)
        {
            case "":  //类型
                if (target.__fullTypeName__ != this.name)
                {
                    return false;
                }
                break;

            case ".": //class
                if (!target.__class__ || !target.__class__[this.name])
                {
                    return false;
                }
                break;

            case "#": //id
                if (target.id != this.name)
                {
                    return false;
                }
                break;
        }

        for (var i = 0, length = this.length; i < length; i++)
        {
            if ((target = this[i].check(target, element_fn)) === false) //
            {
                return false;
            }
        }

        exports.push(target);
    };


    //扩展元素查询 查询符合当前选择器的元素
    this.query = function (start) {

        var items = [start],
            exports = [],
            element = this;

        while (true)
        {
            type_fn[element.type].call(element, items, exports);

            if (element = element.next)
            {
                if (element.type != ",") //非组合则把当前集合作为查询依据
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


}).call(flyingon.Selector_Element.prototype, flyingon);

