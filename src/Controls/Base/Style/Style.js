

/*

功能说明:

注1: 使用类css选择器样式字符串
注2: 子类直接继承父类控件样式
注3: 注意选择器权重(与css相仿)
注4: 样式书写顺序不影响权重,同一个对象应用多个class时后置优先
注5: 伪类优先级 selection > enabled, disabled > active > hover > focus > checked 
注6: 仅 writingMode, align, textAlign ... 支持继承
注7: font, background, margin, border, padding可分子属性设置样式, 但不支持与其它样式的子属性合并 如: .class1 { marginLeft: 10 } .class2 { marginTop: 10 } 在优先应用.class2样式时不使用.class1的marginLeft属性值 


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


注: 不支持样式继承, 即不能从父元素继承属性值, 可通过组合选择器" "或">"设置子元素属性值

*/

//扩展选择器条件检测
(function (flyingon) {




    var element_node = flyingon.__element_node,  //缓存元素类型

        class_list = flyingon.__registry_class_list, //已注册类型集合

        style_version = 0,      //当前样式版本(控制样式组缓存更新)

        style_value_list = {},  //样式值集`  注:为加快样式值查找对所有样式按元素类型进行分类存储 此处的优先级可能与css样式有些差异???

        style_kind_list = {},   //缓存类型

        style_define_list = {}, //定义样式集

        pseudo_max_level = 0,  //最大伪元素级别(最多需处理匹配的伪元素级别数)

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
    element_node.prototype.style_check = function (target, check_token) {

        //必须先检测属性及伪类 因为有伪元素的情况下会改变目标对象
        var length = this.length;

        if (length > 0)
        {
            for (var i = 0; i < length; i++)
            {
                if ((target = this[i].check(target)) === false)
                {
                    return false;
                }
            }
        }

        //检查标签
        if (check_token)
        {
            switch (this.token)
            {
                case "":  //类型
                    if (!(target instanceof (this.__type || (this.__type = class_list[this.name]) || flyingon.Visual)))
                    {
                        return false;
                    }
                    break;

                case ".": //class
                    if (!target.__class || !target.__class[this.name])
                    {
                        return false;
                    }
                    break;

                case "#": //id
                    if (target.id !== this.name)
                    {
                        return false;
                    }
                    break;
            }
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

            var cache = target.__parent;

            while (cache)
            {
                if (this.style_check(cache, true))
                {
                    return true;
                }

                cache = cache.__parent;
            }

            return false;
        };

        this[">"] = function (target) {

            return (target = target.__parent) ? this.style_check(target, true) : false;
        };

        this["+"] = function (target) {

            var cache = target.__parent, index;

            target = cache && (cache = cache.__children) && (index = cache.indexOf(this)) > 0 && cache[--index];
            return target ? this.style_check(target, true) : false;
        };

        this["~"] = function (target) {

            var cache = target.__parent, index;

            if (cache && (cache = cache.__children) && (index = cache.indexOf(this)) > 0)
            {
                for (var i = index - 1; i >= 0; i--)
                {
                    if (this.style_check(cache[i], true))
                    {
                        return true;
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

            var cache = target.__parent, index;
            return (cache && (cache = cache.__children) && (index = cache.indexOf(this)) >= 0 && cache[++index]) || false;
        };

        //获取前一节点
        this.after = function (target) {

            var cache = target.__parent, index;
            return (cache && (cache = cache.__children) && (index = cache.indexOf(this)) > 0 && cache[--index]) || false;
        };

        //检测当前节点是否唯一子节点,是则返回父节点
        this["first-child"] = function (target) {

            var parent = target.__parent, cache;
            return parent && (cache = parent.__children) && cache.length > 0 && cache[0] === target ? parent : false;
        };

        this["first-of-type"] = function (target) {

            var parent = target.__parent, cache;
            return parent && (cache = parent.__children) && cache.length > 0 && cache[0] === target && parent.__fullTypeName === target.__fullTypeName ? parent : false;
        };

        this["last-child"] = function (target) {

            var parent = target.__parent, cache;
            return parent && (cache = parent.__children) && cache.length > 0 && cache[cache.length - 1] === target ? parent : false;
        };

        this["last-of-type"] = function (target) {

            var parent = target.__parent, cache;
            return parent && (cache = parent.__children) && cache.length > 0 && cache[cache.length - 1] === target && parent.__fullTypeName === target.__fullTypeName ? parent : false;
        };

        this["only-child"] = function (target) {

            var parent = target.__parent, cache;
            return parent && (cache = parent.__children) && cache.length === 1 ? parent : false;
        };

        this["only-of-type"] = function (target) {

            var parent = target.__parent, cache;
            return parent && (cache = parent.__children) && cache.length === 1 && parent.__fullTypeName === target.__fullTypeName ? parent : false;
        };

        this["nth-child"] = function (target) {

            var parent = target.__parent, cache, index = +this.value;
            return parent && (cache = parent.__children) && cache.length > index && cache[index] === target ? parent : false;
        };

        this["nth-of-type"] = function (target) {

            var parent = target.__parent, cache, index = +this.value;
            return parent && (cache = parent.__children) && cache.length > index && cache[index] === target && parent.__fullTypeName === target.__fullTypeName ? parent : false;
        };

        this["nth-last-child"] = function (target) {

            var parent = target.__parent, cache, index = +this.value;
            return parent && (cache = parent.__children) && cache.length > index && cache[cache.length - index - 1] === target ? parent : false;
        };

        this["nth-last-of-type"] = function (target) {

            var parent = target.__parent, cache, index = +this.value;
            return parent && (cache = parent.__children) && cache.length > index && cache[cache.length - index - 1] === target && parent.__fullTypeName === target.__fullTypeName ? parent : false;
        };

        return this;

    }).call({});





    var convert_regex = /[-|_](\w)/g,   //样式名转换表达式
        style_types = {},               //注册样式类型
        style_properties = {};          //注册子属性关系



    //样式注册
    flyingon.__fn_style_registry = function (name, type, properties, inherit) {

        style_types[name] = type;

        var length;

        if (properties && (length = properties.length) > 0)
        {
            for (var i = 0; i < length; i++)
            {
                style_properties[properties[i]] = name;
            }

            flyingon["__fn_style_" + name] = function (target, name) {

                var value = flyingon.__fn_style_value(target, name, true);

                if (value !== undefined)
                {
                    return value;
                }


            };
        }
    };


    //重置样式缓存 生成样式类别排除无关的样式
    function reset_style_cache(target) {


        var kinds = [],

            kinds = style_kind_list,

            items,
            length = pseudo_max_level,

            item,
            cache;


        //预处理伪元素
        //比如最大需处理的伪元素级别为2, 则从子到父记下需处理的控件为 [target, parent, parent_parent]
        if (length > 0)
        {
            items = [target]; //第一个元素不使用
            item = target;

            for (var i = length; i > 0; i--)
            {
                if (item = item.__parent)
                {
                    items.push(item);
                }
                else
                {
                    break;
                }
            }
        }


        //1. id伪元素
        if (length > 0)
        {
            for (var i = length; i > 0; i--)
            {
                item = items[i];

                if ((cache = item.id) && (kinds[cache = "#" + cache + ":" + i]))
                {
                    kinds.push(cache);
                }
            }
        }


        //2. id
        if ((cache = target.id) && (kinds[cache = "#" + cache]))
        {
            kinds.push(cache);
        }


        //3. class伪元素
        if (length >= 0)
        {
            for (var i = length; i > 0; i--)
            {
                item = items[i];

                if ((item = item.__class) && (item = item.__names))
                {
                    for (var j = item.length - 1; j >= 0; j--) //后置优先
                    {
                        if (kinds[cache = "." + item[j] + ":" + i])
                        {
                            kinds.push(cache);
                        }
                    }
                }
            }
        }


        //4. class
        if ((item = target.__class) && (item = item.__names))
        {
            for (var j = item.length - 1; j >= 0; j--) //后置优先
            {
                if (kinds[cache = "." + item[i]])
                {
                    kinds.push(cache);
                }
            }
        }


        //5. type伪元素
        if (length >= 0)
        {
            for (var i = length; i > 0; i--)
            {
                item = items[i];

                if ((cache = item.__fullTypeName) && (kinds[cache = cache + ":" + i]))
                {
                    kinds.push(cache);
                }
            }
        }


        //6. type
        item = target.__type;
        while (item && item !== flyingon.SerializableObject)
        {
            if (kinds[cache = cache.fullTypeName])
            {
                kinds.push(cache);
            }

            item = item.superclass;
        }


        //设置样式缓存
        return target.__style_cache = {

            __version: style_version,
            __kinds: kinds
        };
    };


    //查找样式值
    function find_style_value(target, kinds, name) {

        var style = style_value_list[name], data;

        if (style)
        {
            for (var i = 0, length = kinds.length; i < length; i++)
            {
                if (data = style[kinds[i]])
                {
                    var names = data.__names || (data.__names = Object.keys(data));

                    for (var j = names.length - 1; j >= 0; j--)
                    {
                        var values = data[names[j]];

                        if (values[0].style_check(target, false))
                        {
                            return values[1]; //缓存并返回结果
                        }
                    }
                }
            }
        }
    };


    //获取样式值
    function get_style_value(target, name, no_default) {

        //data: x->指定值 y->样式值 _->默认值
        var cache = target.__style_cache, data, value;

        if (cache)
        {
            if (data = cache[name]) //已经缓存
            {
                if ((value = data.x) !== undefined) //如果指定了值则直接取出
                {
                    return value;
                }

                if (cache.__version === style_version) //样式版本未发生变化
                {
                    return no_default || data.y !== undefined ? data.y : data._;
                }

                cache = {

                    __version: style_version,
                    __kinds: cache.__kinds
                };
            }
            else if (cache.__version !== style_version) //样式版本已发生变化
            {
                cache = {

                    __version: style_version,
                    __kinds: cache.__kinds
                };
            }
        }


        //缓存值
        data = (cache || reset_style_cache(target))[name] = {

            _: target.__defaults[name],    //默认值
            x: target.__fields.hasOwnProperty(name) ? target.__fields[name] : undefined      //指定值
        };

        if (value = style_types[name]) //如果是需转换的属性
        {
            name = "__x_" + name; //转换后的名称

            if (data._ != null)
            {
                data._ = target.__defaults[name] || (target.__defaults[name] = new value(data._)); //转换后的默认值
            }

            if (data.x != null) //转换指定值
            {
                data.x = new value(data.x);
            }
        }

        data.y = find_style_value(target, cache.__kinds, name); //样式值

        return data.x !== undefined ? data.x : (no_default || data.y !== undefined ? data.y : data._);
    };


    //获取样式值
    var style_value = flyingon.__fn_style_value = function (target, name, inherit) {

        var value = get_style_value(target, name, true),
            type;

        if (value !== undefined)
        {
            return value;
        }

        type = style_types[name];

        if (!inherit || type === undefined)
        {
            return target.__defaults[name];
        }

        if (inherit && target.__parent)
        {
            value = style_value(target.__parent, name, true);
        }

    };


    //获取当前字体(注意字体继承及组合)
    flyingon.__fn_style_font = function (name) {

        var value = this.__fn_style_value(name, false);

        //自身设置了值则直接返回
        if (value !== undefined)
        {
            return value;
        }

        if (this.__parent)
        {
            value = this.__parent[name]; //获取继承值

            //找出设置或样式中的子项值


            return value;
        }

        return this.__defaults[name];
    };


    //获取指定类型的最后一个样式值
    flyingon.__fn_style_last = function (kind, name) {

        var style = style_value_list[name];

        if (style && (style = style[kind]))
        {
            var names = data.__names || (data.__names = Object.keys(data));

            if (names.length > 0)
            {
                return style[names[names.length - 1]];
            }
        }
    };


    //清除所有样式
    flyingon.__fn_style_clear = function () {

        style_value_list = {};
        style_define_list = {};
        style_kind_list = {};

        pseudo_max_level = 0;

        style_version++;
    };





    //定义样式
    flyingon.defineStyle = function (selector, style, super_selector) {

        if (selector && style)
        {
            var cache;

            //处理继承
            if (super_selector && (cache = style_define_list[super_selector]))
            {
                cache = Object.create(cache);

                for (var name in style)
                {
                    cache[name] = style[name];
                }

                style = cache;
            }

            //缓存样式
            style_define_list[selector] = style;

            //解析选择器
            var element = flyingon.parse_selector(selector);

            if ((cache = split_element(element)).constructor === Array)
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


            style_version++;
        }

    };



    //获取样式类别 按元素类型进行分组 如果有伪元素则类型设为*
    function get_style_kind(element) {

        var result = element.token === "*" ? "Control" : element.token + element.name,
            length = element.length;

        if (length > 0)
        {
            var level = 0, cache;

            for (var i = 0; i < length; i++)
            {
                cache = element[i];

                if (cache.token === ":" && !pseudo_keys[cache.name]) //伪元素作特殊处理以加快检索
                {
                    level++;
                }
            }

            if (level > 0)
            {
                if (pseudo_max_level < level)
                {
                    pseudo_max_level = level;
                }

                //后面叠加": + 级别数"作为组名
                //如#id:firstchild记为#id:1, #id:firstchild:firstchild记为#id:2
                result += ":" + level;
            }
        }

        return element.__kind = result;
    };


    //获取样式key
    function get_style_key(element) {

        while (element.previous)
        {
            element = element.previous;
        }

        return element.toString();
    };


    //获取选择器的权重
    /*
    css选择器权重参考

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
    function get_style_weight(element) {

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
                result += (element[i].token === ":" && pseudo_keys[element[i].name]) || 10;
            }

        } while (element.next && (element = element.next));


        return element.__weight = result << 8; //左移8个字节以留足中间插入的空间(即中间最多可插入256个元素)
    };


    //处理样式 按样式属性名存储 再根据
    function handle_style(element, style) {

        var kind = element.__kind || get_style_kind(element), //处理样式类别
            value,
            cache_x, //缓存主属性
            cache_y, //缓存子属性
            data;

        style_kind_list[kind] = true; //缓存类别
        element.key = get_style_key(element); //保存选择器key

        for (var name in style)
        {
            //处理值
            value = style[name];

            if (value !== undefined) //样式属性值设置为undefined则不处理
            {
                //处理名称
                name = name.replace(convert_regex, function (key, letter) {

                    return letter.toUpperCase();
                });

                //储存原始值
                store_style(element, name, value);

                //储存主属性实例 __x_ + 属性名
                if (data = style_types[name])
                {
                    store_style(element, "__x_" + name, (cache_x || (cache_x = {}))[name] = new data(value));
                }

                //储存转换关系
                if (data = style_properties[name])
                {
                    //如果主属性已储存则重写子属性
                    //margin: 1
                    //marginLeft: 4
                    //转成margin: 1,1,1,4
                    if (cache_x && data in cache_x)
                    {
                        cache_x[data].set(name, value);
                    }

                    //储存子属性组以加快检索(避免一次检索一个子属性) __y_ + 属性名
                    store_style(element, "__y_" + name, (cache_y || (cache_y = {}))[name] = value);
                }
            }
        }
    };


    //缓存样式
    function store_style(element, name, value) {

        var target = style_value_list[name],
            kind = element.__kind,
            weight = element.__weight || get_style_weight(element), //当前权重
            cache;

        if (target) //已有属性
        {
            if (cache = target[kind])
            {
                while ((target = cache[weight]) && target[0].key !== element.key) //如果选择器相等则后置优先
                {
                    weight++;
                }

                cache[weight] = [element, value];
                delete cache.__names;
            }
            else
            {
                target[kind] = {

                    weight: [element, value]
                };
            }
        }
        else
        {
            style_value_list[name] = {

                kind: {

                    weight: [element, value]
                }
            };
        }
    };


    //复制元素
    function copy_element(element, previous, cascade) {

        var result = new element_node(element.type, element.token, element.name, previous);

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
            if (next && next.type === ",")
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

                } while ((element = element.next) && element.type === ",")

                if (items) //交叉
                {
                    var exports = [];

                    for (var i = 0, length = items.length; i < length; i++)
                    {
                        for (var j = 0, length1 = cache.length; j < length1; j++)
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



})(flyingon);
