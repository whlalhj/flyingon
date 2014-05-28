

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
            node,
            items = [start],
            exports;

        for (var i = 0, _ = nodes.length; i < _; i++)
        {
            node = nodes[i];

            type_fn[node.type](node, items, exports = []); //批量传入数组减少函数调用以提升性能

            if (exports.length == 0)
            {
                return exports;
            }

            items = exports;
        }

        return exports;
    };




    //组合查询方法
    (function () {


        //伪元素处理集
        var pseudo_fn = {};


        //目标检测
        function check_node(node, target, exports) {

            switch (node.token)
            {
                case "":  //类型
                    if (target.__fullTypeName !== node.name)
                    {
                        return false;
                    }
                    break;

                case ".": //class
                    if (!target.__class_names || !target.__class_names[node.name])
                    {
                        return false;
                    }
                    break;

                case "#": //id
                    if (target.id !== node.name)
                    {
                        return false;
                    }
                    break;

                case ":": //伪元素
                    return (pseudo_fn[node.name] || pseudo_unkown)(node, target, exports);
            }

            for (var i = 0, _ = node.length; i < _; i++)
            {
                if (node[i].check(target) === false)
                {
                    return false;
                }
            }

            exports.push(target);
        };


        //检查属性 伪元素检测用
        function check_property(node, target, exports) {

            for (var i = 0, _ = node.length; i < _; i++)
            {
                if (node[i].check(target) === false)
                {
                    return false;
                }
            }

            exports.push(target);
        };



        //合并元素集
        this[","] = function (node, items, exports) {

            var fn, values;

            for (var i = 0, _ = node.length; i < _; i++)
            {
                if (fn = type_fn[node.type])
                {
                    fn(node, items, values = []);

                    if (values.length > 0)
                    {
                        exports.push.apply(exports, values);
                    }
                }
            }
        };
        
        //所有后代元素
        this[" "] = function (node, items, exports) {

            var children;

            for (var i = 0, _ = items.length; i < _; i++)
            {
                if ((children = items[i].__children) && children.length > 0)
                {
                    query_cascade(node, children, exports);
                }
            }
        };

        function query_cascade(node, items, exports) {

            var cache;

            for (var i = 0, _ = items.length; i < _; i++)
            {
                check_node(node, cache = items[i], exports);

                if ((cache = cache.__children) && cache.length > 0)
                {
                    query_cascade(node, cache, exports);
                }
            }
        };
        
        //子元素
        this[">"] = function (node, items, exports) {

            var children;

            for (var i = 0, _ = items.length; i < _; i++)
            {
                if ((children = items[i].__children) && children.length > 0)
                {
                    for (var j = 0, __ = children.length; j < __; j++)
                    {
                        check_node(node, children[j], exports);
                    }
                }
            }
        };

        //后一个元素 元素伪类:after也会转换成此节点类型
        this["+"] = function (node, items, exports) {

            var item, children, index;

            for (var i = 0, _ = items.length; i < _; i++)
            {
                if ((item = items[i]).__parent)
                {
                    children = item.__parent.__children;

                    if (children.length > (index = children.indexOf(item) + 1))
                    {
                        check_node(node, children[index], exports);
                    }
                }
            }
        };

        //所有后续兄弟元素
        this["~"] = function (node, items, exports) {

            var item, children;

            for (var i = 0, _ = items.length; i < _; i++)
            {
                if ((item = items[i]).__parent)
                {
                    children = item.__parent.__children;

                    for (var j = children.indexOf(item) + 1, __ = children.length; j < __; j++)
                    {
                        check_node(node, children[j], exports);
                    }
                }
            }
        };




        //未知伪元素处理
        function pseudo_unkown(node, target, exports) {

            return false;
        };


        pseudo_fn["before"] = function (node, target, exports) {

            var children, index;

            if (target.__parent)
            {
                children = target.__parent.__children;

                if ((index = children.indexOf(target) - 1) >= 0)
                {
                    return check_property(node, children[index], exports);
                }
            }

            return false;
        };

        pseudo_fn["after"] = function (node, target, exports) {

            var children, index;

            if (target.__parent)
            {
                children = target.__parent.__children;

                if (children.length > (index = children.indexOf(target) + 1))
                {
                    return check_property(node, children[index], exports);
                }
            }

            return false;
        };

        pseudo_fn["first-child"] = function (node, target, exports) {

            var children;

            if ((children = target.__children) && children.length > 0)
            {
                return check_property(node, children[0], exports);
            }

            return false;
        };

        pseudo_fn["first-of-type"] = function (node, target, exports) {

            var children;

            if ((children = target.__children) && children.length > 0 && children[0].__fullTypeName === target.__fullTypeName)
            {
                return check_property(node, children[0], exports);
            }

            return false;
        };

        pseudo_fn["last-child"] = function (node, target, exports) {

            var children;

            if ((children = target.__children) && children.length > 0)
            {
                return check_property(node, children[children.length - 1], exports);
            }

            return false;
        };

        pseudo_fn["last-of-type"] = function (node, target, exports) {

            var children;

            if ((children = target.__children) && children.length > 0 && children[children.length - 1].__fullTypeName === target.__fullTypeName)
            {
                return check_property(node, children[children.length - 1], exports);
            }

            return false;
        };

        pseudo_fn["only-child"] = function (node, target, exports) {

            if ((children = target.__children) && children.length === 1)
            {
                return check_property(node, children[0], exports);
            }

            return false;
        };

        pseudo_fn["only-of-type"] = function (node, target, exports) {

            var children;

            if ((children = target.__children) && children.length === 1 && children[0].__fullTypeName === target.__fullTypeName)
            {
                return check_property(node, children[0], exports);
            }

            return false;
        };

        pseudo_fn["nth-child"] = function (node, target, exports) {

            var children, index = +node.parameters[0];

            if ((children = target.__children) && children.length > index)
            {
                return check_property(node, children[index], exports);
            }

            return false;
        };

        pseudo_fn["nth-of-type"] = function (node, target, exports) {

            var children, index = +node.parameters[0];

            if ((children = target.__children) && children.length > index && children[index].__fullTypeName === target.__fullTypeName)
            {
                return check_property(node, children[index], exports);
            }

            return false;
        };

        pseudo_fn["nth-last-child"] = function (node, target, exports) {

            var children, index = +node.parameters[0];

            if ((children = target.__children) && children.length > index)
            {
                return check_property(node, children[children.length - index - 1], exports);
            }

            return false;
        };

        pseudo_fn["nth-last-of-type"] = function (node, target, exports) {

            var children, index = +node.parameters[0];

            if ((children = target.__children) && children.length > index)
            {
                var j = children.length - index - 1;

                if (children[j].__fullTypeName === target.__fullTypeName)
                {
                    return check_property(node, children[j], exports);
                }
            }

            return false;
        };


    }).call(type_fn);



})(flyingon);

