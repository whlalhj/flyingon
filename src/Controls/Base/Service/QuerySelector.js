

//扩展选择器元素查询方法
(function (flyingon) {



    var selector_cache = {},    //缓存数据
        type_fn = {};           //类型查找函数



    //从start开始查找所有符合条件的元素
    flyingon.querySelectorAll = function (selector, start) {

        if (!start)
        {
            throw new Error(flyingon_lang.query_must_start);
        }

        var nodes = selector_cache[selector] || (selector_cache[selector] = flyingon.parse_selector(selector)),
            items = [start],
            exports,
            fn;

        for (var i = 0, length = nodes.length; i < length; i++)
        {
            if (fn = type_fn[element.type])
            {
                fn(element, items, exports = []); //批量传入数组减少函数调用以提升性能

                if (exports.length == 0)
                {
                    return exports;
                }

                items = exports;
            }
        }

        return exports;
    };




    //组合查询方法
    (function () {



        //合并元素集
        this[","] = function (element, items, exports) {

            var fn, values;

            for (var i = 0, length = element.length; i < length; i++)
            {
                if (fn = type_fn[element.type || element.default_type])
                {
                    fn(element, items, values = []);

                    if (values.length > 0)
                    {
                        exports.push.apply(exports, values);
                    }
                }
            }
        };




        //目标检测
        function check_element(element, target, exports) {

            switch (element.token)
            {
                case "":  //类型
                    if (target.__fullTypeName !== element.name)
                    {
                        return false;
                    }
                    break;

                case ".": //class
                    if (!target.__class_names || !target.__class_names[element.name])
                    {
                        return false;
                    }
                    break;

                case "#": //id
                    if (target.id !== element.name)
                    {
                        return false;
                    }
                    break;
            }

            for (var i = 0, length = element.length; i < length; i++)
            {
                if (element[i].check_element(target) === false)
                {
                    return false;
                }
            }

            exports.push(target);
        };



        function query_cascade(element, items, exports) {

            var cache;

            for (var i = 0, length = items.length; i < length; i++)
            {
                check_element(element, cache = items[i], exports);

                if ((cache = cache.__children) && cache.length > 0)
                {
                    query_cascade(element, cache, exports);
                }
            }
        };


        //所有后代元素
        this[" "] = function (element, items, exports) {

            var children;

            for (var i = 0, length = items.length; i < length; i++)
            {
                if ((children = items[i].__children) && children.length > 0)
                {
                    query_cascade(element, children, exports);
                }
            }
        };

        //子元素
        this[">"] = function (element, items, exports) {

            var children;

            for (var i = 0, length = items.length; i < length; i++)
            {
                if ((children = items[i].__children) && children.length > 0)
                {
                    for (var j = 0, length1 = children.length; j < length1; j++)
                    {
                        check_element(element, children[j], exports);
                    }
                }
            }
        };

        //后一个元素 元素伪类:after也会转换成此节点类型
        this["+"] = function (element, items, exports) {

            var item, children, index;

            for (var i = 0, length = items.length; i < length; i++)
            {
                if ((item = items[i]).__parent)
                {
                    children = item.__parent.__children;

                    if (children.length > (index = children.indexOf(item) + 1))
                    {
                        check_element(element, children[index], exports);
                    }
                }
            }
        };

        //所有后续兄弟元素
        this["~"] = function (element, items, exports) {

            var item, children;

            for (var i = 0, length = items.length; i < length; i++)
            {
                if ((item = items[i]).__parent)
                {
                    children = item.__parent.__children;

                    for (var j = children.indexOf(item) + 1, count = children.length; j < count; j++)
                    {
                        check_element(element, children[j], exports);
                    }
                }
            }
        };



        this[":before"] = function (element, items, exports) {

            var item, children, index;

            for (var i = 0, length = items.length; i < length; i++)
            {
                if ((item = items[i]).__parent)
                {
                    children = item.__parent.__children;

                    if ((index = children.indexOf(item) - 1) >= 0)
                    {
                        check_element(element, children[index], exports);
                    }
                }
            }
        };

        this[":after"] = this["+"];

        this[":first-child"] = function (element, items, exports) {

            var item, children;

            for (var i = 0, length = items.length; i < length; i++)
            {
                item = items[i];

                if ((children = item.__children) && children.length > 0)
                {
                    check_element(element, children[0], exports);
                }
            }
        };

        this[":first-of-type"] = function (element, items, exports) {

            var item, children;

            for (var i = 0, length = items.length; i < length; i++)
            {
                item = items[i];

                if ((children = item.__children) && children.length > 0)
                {
                    for (var j = 0, count = children.length; j < count; j++)
                    {
                        if (children[j].__fullTypeName === item.__fullTypeName)
                        {
                            check_element(element, children[j], exports);
                            break;
                        }
                    }
                }
            }
        };

        this[":last-child"] = function (element, items, exports) {

            var item, children;

            for (var i = 0, length = items.length; i < length; i++)
            {
                item = items[i];

                if ((children = item.__children) && children.length > 0)
                {
                    check_element(element, children[children.length - 1], exports);
                }
            }
        };

        this[":last-of-type"] = function (element, items, exports) {

            var item, children;

            for (var i = 0, length = items.length; i < length; i++)
            {
                item = items[i];

                if ((children = item.__children) && children.length > 0)
                {
                    for (var j = children.length - 1; j >= 0; j--)
                    {
                        if (children[j].__fullTypeName === item.__fullTypeName)
                        {
                            check_element(element, children[j], exports);
                            break;
                        }
                    }
                }
            }
        };

        this[":only-child"] = function (element, items, exports) {

            var item, children;

            for (var i = 0, length = items.length; i < length; i++)
            {
                item = items[i];

                if ((children = item.__children) && children.length === 1)
                {
                    check_element(element, children[0], exports);
                }
            }
        };

        this[":only-of-type"] = function (element, items, exports) {

            var item, children;

            for (var i = 0, length = items.length; i < length; i++)
            {
                item = items[i];

                if ((children = item.__children) && children.length === 1 && children[0].__fullTypeName === item.__fullTypeName)
                {
                    check_element(element, children[0], exports);
                }
            }
        };

        this[":nth-child"] = function (element, items, exports) {

            var item, children, index = +element.parameters[0];

            for (var i = 0, length = items.length; i < length; i++)
            {
                item = items[i];

                if ((children = item.__children) && children.length > index)
                {
                    check_element(element, children[index], exports);
                }
            }
        };

        this[":nth-of-type"] = function (element, items, exports) {

            var item, children, index = +element.parameters[0];

            for (var i = 0, length = items.length; i < length; i++)
            {
                item = items[i];

                if ((children = item.__children) && children.length > index && children[index].__fullTypeName === item.__fullTypeName)
                {
                    check_element(element, children[index], exports);
                }
            }
        };

        this[":nth-last-child"] = function (element, items, exports) {

            var item, children, index = +element.parameters[0];

            for (var i = 0, length = items.length; i < length; i++)
            {
                item = items[i];

                if ((children = item.__children) && children.length > index)
                {
                    check_element(element, children[children.length - index - 1], exports);
                }
            }
        };

        this[":nth-last-of-type"] = function (element, items, exports) {

            var item, children, index = +element.parameters[0];

            for (var i = 0, length = items.length; i < length; i++)
            {
                item = items[i];

                if ((children = item.__children) && children.length > index)
                {
                    var j = children.length - index - 1;

                    if (children[j].__fullTypeName === item.__fullTypeName)
                    {
                        check_element(element, children[j], exports);
                    }
                }
            }
        };


    }).call(type_fn);



})(flyingon);

