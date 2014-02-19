

//扩展选择器查询方法
(function (flyingon) {



    var prototype = flyingon.SelectorElement.prototype;


    //扩展元素查询
    prototype.query = function (items) {

        var exports = [],
            element = this;

        while (true)
        {
            this[element.type](items, exports);

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



    prototype.query_cascade = function (items, exports) {

        var cache;

        for (var i = 0, length = items.length; i < length; i++)
        {
            if (this.query_check(cache = items[i], exports) === false)
            {
                return false;
            }

            if ((cache = cache.__children__) && cache.length > 0)
            {
                if (this.query_cascade(cache, exports) === false)
                {
                    return false;
                }
            }
        }
    };

    prototype[" "] = function (items, exports) {

        var item, cache;

        for (var i = 0, length = items.length; i < length; i++)
        {
            item = items[i];

            if ((cache = item.__children__) && cache.length > 0)
            {
                this.query_cascade(cache, exports);
            }
        }
    };

    prototype[">"] = function (items, exports) {

        var children;

        for (var i = 0, length = items.length; i < length; i++)
        {
            if ((children = items[i].__children__) && children.length > 0)
            {
                for (var j = 0, length_j = children.length; j < length_j; j++)
                {
                    if (this.query_check(children[j], exports) === false)
                    {
                        break;
                    }
                }
            }
        }
    };

    //此token由before元素伪类转换而来
    prototype["<"] = function (items, exports) {

        var item, children, index;

        for (var i = 0, length = items.length; i < length; i++)
        {
            if ((item = items[i]) &&
                (children = item.__parent__.__children__) &&
                (children.length > (index = children.indexOf(item) - 1)))
            {
                this.query_check(children[index], exports);
            }
        }
    };

    prototype["+"] = function (items, exports) {

        var item, children, index;

        for (var i = 0, length = items.length; i < length; i++)
        {
            if ((item = items[i]) &&
                (children = item.__parent__.__children__) &&
                (children.length > (index = children.indexOf(item) + 1)))
            {
                this.query_check(children[index], exports);
            }
        }
    };

    prototype["~"] = function (items, exports) {

        var item, children;

        for (var i = 0, length = items.length; i < length; i++)
        {
            if ((item = items[i]) && (children = item.__parent__.__children__))
            {
                for (var j = children.indexOf(item) + 1, length_j = children.length; j < length_j; j++)
                {
                    if (this.query_check(children[j], exports) === false)
                    {
                        break;
                    }
                }
            }
        }
    };

    prototype[","] = function (items, exports) {

        this[this.previous_type](items, exports);
    };



    //扩展元素查找检测 返回值为false: 中止查找
    prototype.query_check = function (item, exports) {

        switch (this.token)
        {
            case "":  //类型
                if (item.__fullTypeName__ != this.name) return;
                break;

            case ".": //class
                if (!item.hasClass(this.name)) return;
                break;

            case "#": //id
                if (item.id != this.name) return;
                break;
        }

        if (this.length > 0)
        {
            var result = [item], items;

            for (var i = 0, length = this.length; i < length; i++)
            {
                items = result;
                result = [];

                for (var j = 0, length_j = items.length; j < length_j; j++)
                {
                    if (this[i].query_check(item = items[j], result))
                    {
                        result.push(item);
                    }
                }
            }

            if (result.length > 0)
            {
                exports.push.apply(exports, result);
            }
        }
        else
        {
            exports.push(item);
        }
    };


    //扩展属性查找检测
    flyingon.SelectorProperty.prototype.query_check = flyingon.SelectorProperty.prototype.check;

    //扩展属性组查找检测
    flyingon.SelectorProperties.prototype.query_check = flyingon.SelectorProperties.prototype.check;


    /*

    支持的伪类如下:

    E:active        匹配鼠标已经其上按下、还没有释放的E元素
    E:hover         匹配鼠标悬停其上的E元素
    E:focus         匹配获得当前焦点的E元素
    E:enabled       匹配表单中激活的元素
    E:disabled      匹配表单中禁用的元素
    E:checked       匹配表单中被选中的radio（单选框）或checkbox（复选框）元素
    E:selection     匹配用户当前选中的元素
    E:empty         匹配一个不包含任何子元素的元素，注意，文本节点也被看作子元素
    
    E:before        E之前元素
    E:after         E之后元素
    
    E:nth-child(n)          匹配其父元素的第n个子元素，第一个编号为1
    E:nth-last-child(n)     匹配其父元素的倒数第n个子元素，第一个编号为1
    E:nth-of-type(n)        与:nth-child()作用类似，但是仅匹配使用同种标签的元素
    E:nth-last-of-type(n)   与:nth-last-child() 作用类似，但是仅匹配使用同种标签的元素
    E:first-child           匹配父元素的第一个子元素
    E:last-child            匹配父元素的最后一个子元素，等同于:nth-last-child(1)
    E:first-of-type         匹配父元素下使用同种标签的第一个子元素，等同于:nth-of-type(1)
    E:last-of-type          匹配父元素下使用同种标签的最后一个子元素，等同于:nth-last-of-type(1)
    E:only-child            匹配父元素下仅有的一个子元素，等同于:first-child:last-child或 :nth-child(1):nth-last-child(1)
    E:only-of-type          匹配父元素下使用同种标签的唯一一个子元素，等同于:first-of-type:last-of-type或 :nth-of-type(1):nth-last-of-type(1)
    E:nth-mod-child(n,length)     匹配其父元素的第n个以length为基数的余数的子元素

    */
    //扩展伪类查找检测
    flyingon.SelectorPseudo.prototype.query_check = function (item, exports) {

        switch (this.name)
        {
            case "active":
            case "hover":
            case "focus":
            case "disabled":
            case "checked":
            case "selection":
                return item.states && item.states[this.name];

            case "enabled":
                return !item.states || !item.states.disabled;

            case "empty":
                return item.__parent__.index_child(0) === undefined;

            case "before":
                if ((item = item.__parent__.child_offset(item, -1)) != null)
                {
                    exports.push(item);
                }
                return false;

            case "after":
                if ((item = item.__parent__.child_offset(item, -1)) != null)
                {
                    exports.push(item);
                }
                return false;

            case "nth-child":
            case "nth-of-type":
                return item.__parent__.child_indexOf(item) == this[0];

            case "nth-last-child":
            case "nth-last-of-type":
                return item.__parent__.child_lastIndexOf(item) == this[0];

            case "first-child":
            case "first-of-type":
                return item.__parent__.index_child(0) === item;

            case "last-child":
            case "last-of-type":
                return item.__parent__.last_index_child(0) === item;

            case "only-child":
            case "only-of-type":
                if ((item = item.__parent__.index_child(1)) != null)
                {
                    exports.push(item);
                }
                return false;

            case "nth-mod-child":
                mod_child.call(this, item, exports);
                return false;
        }

        return true;
    };


    function mod_child(item, exports) {

        var parent = item.__parent__,
            mod = 0 + this[0],
            loop = 0 + this[1],
            index = mode;

        while ((item = parent.index_child(index)) != null)
        {
            exports.push(item);
            index += loop;
        }
    };



})(flyingon);

