

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

//之后的元素会转为节点元素

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

*/

//扩展选择器条件检测
(function (flyingon) {




    var Selector_Element = flyingon.Selector_Element,  //缓存元素类

        registry_list = flyingon.__registry_list__, //已注册类型集合

        styles_data = {},  //样式集  注:为加快样式值查找对所有样式按元素类型进行分类存储 此处的优先级可能与css样式有些差异???

        styles_cache = {}, //样式缓存

        group_data = {},   //缓存组名

        pseudo_data = {},  //伪元素存储

        pseudo_keys = {  //伪类key 不在此列即为伪元素 value为伪元素权重 默认为10

            selection: 16,
            enabled: 15,
            disabled: 15,
            active: 14,
            hover: 13,
            focus: 12,
            checked: 11
        };




    //扩展样式检测 检测指定对象是否符合当前选择器
    Selector_Element.prototype.style_check = function (target) {

        //必须先检测属性及伪类 因为有伪元素的情况下会改变目标对象
        for (var i = 0, length = this.length; i < length; i++)
        {
            if ((target = this[i].check(target, element_fn)) === false)
            {
                return false;
            }
        }

        switch (this.token)
        {
            case "":  //类型
                if (!(target instanceof (this.__type__ || (this.__type__ = registry_list[this.name]) || flyingon.Visual)))
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

        //继续检测上一节点
        if (this.previous && type_fn[this.type].call(this.previous, target) === false)
        {
            return false;
        }

        return true;
    };


    //组合查询方法
    //注: ","组合类型已被拆分,此处不处理
    var type_fn = (function () {

        this[" "] = function (target) {

            var cache = target.__parent__;

            while (cache)
            {
                if (target = this.style_check(cache))
                {
                    return target;
                }

                cache = cache.__parent__;
            }

            return false;
        };

        this[">"] = function (target) {

            return (target = target.__parent__) ? this.style_check(target) : false;
        };

        this["+"] = function (target) {

            var cache = target.__parent__, index;

            target = cache && (cache = cache.__children__) && (index = cache.indexOf(this)) > 0 && cache[--index];
            return target ? this.style_check(target) : false;
        };

        this["~"] = function (target) {

            var cache = target.__parent__, index;

            if (cache && (cache = cache.__children__) && (index = cache.indexOf(this)) > 0)
            {
                for (var i = index - 1; i >= 0; i--)
                {
                    if (target = this.style_check(cache[i]))
                    {
                        return target;
                    }
                }
            }

            return false;
        };

        return this;

    }).call({});


    //伪类元素查询方法  
    //注:此处为反向查找 即:已知目标反查条件
    var element_fn = (function () {

        //获取后一节点
        this.before = function (target) {

            var cache = target.__parent__, index;
            return (cache && (cache = cache.__children__) && (index = cache.indexOf(this)) >= 0 && cache[++index]) || false;
        };

        //获取前一节点
        this.after = function (target) {

            var cache = target.__parent__, index;
            return (cache && (cache = cache.__children__) && (index = cache.indexOf(this)) > 0 && cache[--index]) || false;
        };

        //检测当前节点是否唯一子节点,是则返回父节点
        this["first-child"] = function (target) {

            var parent = target.__parent__, cache;
            return parent && (cache = parent.__children__) && cache.length > 0 && cache[0] == target ? parent : false;
        };

        this["first-of-type"] = function (target) {

            var parent = target.__parent__, cache;
            return parent && (cache = parent.__children__) && cache.length > 0 && cache[0] == target && parent.__fullTypeName__ == target.__fullTypeName__ ? parent : false;
        };

        this["last-child"] = function (target) {

            var parent = target.__parent__, cache;
            return parent && (cache = parent.__children__) && cache.length > 0 && cache[cache.length - 1] == target ? parent : false;
        };

        this["last-of-type"] = function (target) {

            var parent = target.__parent__, cache;
            return parent && (cache = parent.__children__) && cache.length > 0 && cache[cache.length - 1] == target && parent.__fullTypeName__ == target.__fullTypeName__ ? parent : false;
        };

        this["only-child"] = function (target) {

            var parent = target.__parent__, cache;
            return parent && (cache = parent.__children__) && cache.length == 1 ? parent : false;
        };

        this["only-of-type"] = function (target) {

            var parent = target.__parent__, cache;
            return parent && (cache = parent.__children__) && cache.length == 1 && parent.__fullTypeName__ == target.__fullTypeName__ ? parent : false;
        };

        this["nth-child"] = function (target) {

            var parent = target.__parent__, cache, index = +this.value;
            return parent && (cache = parent.__children__) && cache.length > index && cache[index] == target ? parent : false;
        };

        this["nth-of-type"] = function (target) {

            var parent = target.__parent__, cache, index = +this.value;
            return parent && (cache = parent.__children__) && cache.length > index && cache[index] == target && parent.__fullTypeName__ == target.__fullTypeName__ ? parent : false;
        };

        this["nth-last-child"] = function (target) {

            var parent = target.__parent__, cache, index = +this.value;
            return parent && (cache = parent.__children__) && cache.length > index && cache[cache.length - index - 1] == target ? parent : false;
        };

        this["nth-last-of-type"] = function (target) {

            var parent = target.__parent__, cache, index = +this.value;
            return parent && (cache = parent.__children__) && cache.length > index && cache[cache.length - index - 1] == target && parent.__fullTypeName__ == target.__fullTypeName__ ? parent : false;
        };

        return this;

    }).call({});




    //获取样式组 按元素类型进行分组 如果有伪元素则类型设为*
    function style_group(element) {

        var result = element.token == "*" ? "Visual" : element.token + element.name,
            pseudo, //伪元素
            item;

        for (var i = 0, length = element.length; i < length; i++)
        {
            if ((item = element[i]).token == ":" && !pseudo_keys[item.name]) //伪元素作特殊处理以加快检索
            {
                pseudo = pseudo ? pseudo + ":" : ":";
            }
        }

        if (pseudo)
        {
            pseudo_data[pseudo.length] = pseudo; //记录第n级父元素的样式组

            if (!(pseudo_data.max >= pseudo.length))
            {
                pseudo_data.max = pseudo.length;
            }

            result = pseudo + result; //前面叠加":"作为组名
        }

        return element.__group__ = result;
    };


    //生成样式组缓存 先排除无关的样式
    function initialize_group(target) {


        var result = target.__style_group__ = [],

            group = group_data,
            pseudo = pseudo_data,

            items,
            item,

            length,
            cache;


        //预处理伪元素 记下最多可用父节点
        if ((length = pseudo.max) > 0)
        {
            item = target;

            for (var i = length; i > 0; i--)
            {
                if (item = item.__parent__)
                {
                    (items || (items = [])).push(pseudo[i] ? item : null); //中空的不记录
                }
            }
        }


        //1. id伪元素
        if (items)
        {
            length = items.length; //items从子到父排列

            for (var i = length - 1; i >= 0; i--)
            {
                if ((item = items[i]) && (cache = item.id) && (group[cache = pseudo[i + 1] + "#" + cache]))
                {
                    result.push(cache);
                }
            }
        }


        //2. id
        if ((cache = target.id) && (group[cache = "#" + cache]))
        {
            result.push(cache);
        }


        //3. class伪元素
        if (items)
        {
            for (var i = length - 1; i >= 0; i--)
            {
                if ((item = items[i]) && (item = item.__class__) && (item = item.__names__))
                {
                    for (var j = 0, count = item.length; j < count; j++)
                    {
                        if (group[cache = pseudo[i + 1] + "." + item[j]])
                        {
                            result.push(cache);
                        }
                    }
                }
            }
        }


        //4. class
        if ((item = target.__class__) && (item = item.__names__))
        {
            for (var i = 0, count = item.length; i < count; i++)
            {
                if (group[cache = "." + item[i]])
                {
                    result.push(cache);
                }
            }
        }


        //5. type伪元素
        if (items)
        {
            for (var i = length - 1; i >= 0; i--)
            {
                if ((item = items[i]) && (cache = item.__fullTypeName__) && (group[cache = pseudo[i + 1] + cache]))
                {
                    result.push(cache);
                }
            }
        }


        //6. type
        cache = target.__type__;
        while (cache && cache != flyingon.SerializableObject)
        {
            if (group[cache.fullTypeName])
            {
                result.push(cache.fullTypeName);
            }

            cache = cache.superclass;
        }


        return result;
    };


    //样式key
    function style_key(element) {

        while (element.previous)
        {
            element = element.previous;
        }

        return element.toString();
    };


    /*
    css选择器权重
    类型选择符的权重为：0001
    类选择符的权重为：0010
    通用选择符的权重为：0000
    子选择符的权重为：0000
    属性选择符的权重为：0010
    伪类选择符的权重为：0010 (此处做了特殊处理:默认为10, 其它伪类提升至11-16)
    伪元素选择符的权重为：0010
    包含选择符的权重为：包含的选择符权重值之和
    内联样式的权重为：1000
    继承的样式的权重为：0000
    */

    //计算选择器的权重
    function style_weight(element) {

        var result = 0;

        do
        {
            switch (element.token)
            {
                case "#":
                    result += 100;
                    break;

                case ".":
                    result += 10;
                    break;

                case "":
                    result += 1;
                    break;
            }

            for (var i = 0; i < element.length; i++)
            {
                result += (element[i].token == ":" && pseudo_keys[element[i].name]) || 10;
            }

        } while (element.next && (element = element.next));


        return element.__weight__ = result << 8; //左移8个字节以留足中间插入的空间(即中间最多可插入256个元素)
    };



    //获取样式值
    flyingon.styleValue = function (target, name) {

        var style = styles_data[name];

        if (style)
        {
            var group = target.__style_group__ || initialize_group(target);

            for (var i = 0, length = group.length; i < length; i++)
            {
                var data = style[group[i]];

                if (data)
                {
                    var names = data.__names__ || (data.__names__ = Object.keys(data));

                    loop:
                        for (var j = names.length - 1; j >= 0; j--)
                        {
                            var items = data[names[j]],
                                element = items[0],
                                control = target;

                            //必须先检测属性及伪类 因为有伪元素的情况下会改变目标对象 此处直接处理减少函数调用以提升性能
                            for (var i = 0, length = element.length; i < length; i++)
                            {
                                if ((control = element[i].check(control, element_fn)) === false)
                                {
                                    continue loop;
                                }
                            }

                            //继续检测上一节点
                            if (element.previous && type_fn[element.type].call(element.previous, control) === false)
                            {
                                continue;
                            }

                            return items[1];
                        }
                }
            }
        }
    };

    //通过className获取样式值 此方法不能查询组合选择器 也不能包含属性 但可包含状态型伪类
    flyingon.styleValue_by_class = function (className, name, states) {

        var style = styles_data[name], data;

        if (style && (data = style["." + className]))
        {
            var names = data.__names__ || (data.__names__ = Object.keys(data));

            loop:
                for (var j = names.length - 1; j >= 0; j--)
                {
                    var items = data[names[j]],
                        item,
                        element = items[0];

                    for (var i = 0, length = element.length; i < length; i++)
                    {
                        if ((item = element[i]).token != ":" || !states[item.name])
                        {
                            continue loop;
                        }
                    }

                    return items[1];
                }
        }
    };


    var Thickness = flyingon.Thickness,

        Align = flyingon.Align,

        convert_fn = (function () {

            ["margin", "border", "padding"].forEach(function (name) {

                this[name] = function (value) {

                    return value instanceof Thickness ? value : (this[name] = new Thickness(value));
                };

                ["left", "top", "right", "bottom"].forEach(function (key) {

                    this[name + "-" + key] = function (value) {

                        var result = this[name] || (this[name] = new Thickness());
                        result[key] = +value || 0;
                        return result;
                    };

                }, this);

            }, this);

            this.align = this.textAlign = function (value) {

                return value instanceof Align ? value : new Align(value);
            };

            return this;

        }).call({});

    //处理样式 按样式属性名存储 再根据
    function handle_style(element, style) {

        var target,
            group = element.__group__ || style_group(element), //处理样式组
            weight = element.__weight__ || style_weight(element), //当前权重
            value,
            index;

        group_data[group] = true; //缓存组名
        element.key = style_key(element); //保存选择器名

        loop:
            for (var name in style)
            {
                value = ((value = convert_fn[name]) && value.call(style, style[name])) || style[name];

                if (value !== undefined) //样式属性值设置为undefined则不处理
                {
                    if (target = styles_data[name]) //已有属性
                    {
                        target = target[group] || (target[group] = {});
                        index = weight;

                        while (target[index])
                        {
                            if (target[index][0].key == element.key) //如果选择器相等则后面冲掉前面的值
                            {
                                target[index] = [element, value];
                                continue loop;
                            }

                            index++;
                        }

                        target[index] = [element, value];
                        delete target.__names__;
                    }
                    else
                    {
                        ((styles_data[name] = {})[group] = {})[weight] = [element, value];
                    }
                }
            }
    };



    //复制元素
    function copy_element(element, previous, cascade) {

        var result = new Selector_Element(element.type, element.token, element.name, previous);

        for (var i = 0, length = element.length; i < length; i++)
        {
            result[i] = element[i];
        }

        //级联复制上级
        if (cascade && (previous = element.previous))
        {
            previous = element.previous = copy_element(previous, null, true);
            previous.next = element;
        }

        return result;
    };


    //拆分元素 把组合元素拆成多组非组合元素
    function split_element(element) {

        var next, items, cache;

        while (next = element.next)
        {
            if (next && next.type == ",")
            {
                cache = [];

                cache.push(element);
                element.next = null;
                element = next;

                do
                {
                    element.previous = null;
                    element.type = element.previous_type;
                    delete element.previous_type;

                    cache.push(element);

                } while ((element = element.next) && element.type == ",")

                if (items) //交叉
                {
                    var exports = [];

                    for (var i = 0, length = items.length; i < length; i++)
                    {
                        for (var j = 0, length_j = cache.length; j < length_j; j++)
                        {
                            exports.push(copy_element(cache[j], items[i], true)); //复制生成新节点
                        }
                    }

                    items = exports;
                }
                else
                {
                    items = cache;
                }
            }
            else
            {
                if (items)
                {
                    for (var i = 0, length = items.length; i < length; i++)
                    {
                        items[i] = copy_element(element, items[i]); //复制生成新节点
                    }
                }
            }

            element = next;
        }

        return items || element;
    };



    //定义样式
    flyingon.defineStyle = function (selector, style, super_selector) {

        if (selector && style)
        {
            var cache;

            //处理继承
            if (super_selector && (cache = styles_cache[super_selector]))
            {
                cache = Object.create(cache);

                for (var name in style)
                {
                    cache[name] = style[name];
                }

                style = cache;
            }

            //缓存样式
            styles_cache[selector] = style;

            //解析选择器
            var element = flyingon.parse_selector(selector);

            if ((cache = split_element(element)).constructor == Array)
            {
                for (var i = 0, length = cache.length; i < length; i++)
                {
                    handle_style(cache[i], style);
                }
            }
            else
            {
                handle_style(cache, style);
            }
        }

    };


})(flyingon);
