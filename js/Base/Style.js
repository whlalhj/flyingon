

//扩展选择器条件检测
(function (flyingon) {


    //扩展选择器元素
    var SelectorElement = flyingon.SelectorElement,
        prototype = SelectorElement.prototype;



    /*
    css选择器权重
    类型选择符的权重为：0001
    类选择符的权重为：0010
    通用选择符的权重为：0000
    子选择符的权重为：0000
    属性选择符的权重为：0010
    伪类选择符的权重为：0010
    伪元素选择符的权重为：0010
    包含选择符的权重为：包含的选择符权重值之和
    内联样式的权重为：1000
    继承的样式的权重为：0000
    */

    //计算选择器的权重
    //注: 本系统与css权重做法有些差别 本系统先按状态分组再对比权重 组级高的永远比组级低的优先
    prototype.style_weight = function () {

        var result = 0,
            element = this;

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

                case ".":
                    result += 1;
                    break;
            }

            if (this.length > 0)
            {
                result += this.length * 10;
            }

        } while (element = element.next);


        return this.__weight__ = result << 8; //左移8个字节以留足中间插入的空间(即中间最多可插入256个元素)
    };


    //获取样式组 抽出第一个与状态有关的伪类作为样式组名
    prototype.style_group = function () {

        var item, key;

        for (var i = 0, length = this.length; i < length; i++)
        {
            if ((item = this[i]).token == ":")
            {
                switch (key = item.name)
                {
                    case "active":  //此组伪类转换为样式组
                    case "hover":
                    case "focus":
                    case "disabled":
                    case "checked":
                    case "selection":
                        this.splice(i, 1);
                        return key;
                }
            }
        }

        return this.__group__ = "__";
    };


    //扩展属性查找检测
    (prototype = flyingon.SelectorProperty.prototype).style_check = prototype.check;


    //扩展属性组查找检测
    (prototype = flyingon.SelectorProperties.prototype).style_check = prototype.check;


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
    flyingon.SelectorPseudo.prototype.style_check = function (element, item) {

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

            case "before": //后面有节点
                return item.__parent__.child_offset(item, 1) !== undefined;

            case "after": //前面有节点
                return item.__parent__.child_offset(item, -1) !== undefined;

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
                return item.__parent__.index_child(1) === undefined;

            case "nth-mod-child":
                return item.__parent__.child_indexOf(item) % this[1] == this[0];
        }

        return true;
    };


})(flyingon);




//定义样式
(function (flyingon) {



    var styles = {},  //样式集

        styles_cache = {}, //样式缓存

        thickness = ["margin", "border", "padding"],

        registry_list = flyingon.__registry_list__;



    //获取样式值
    flyingon.styleValue = function (target, name) {

        var states = target.__states__ || ["__"],
            style;

        for (var i = states.length - 1; i >= 0; i--)
        {
            if ((style = styles[name]) && (style = style[states[i]]))
            {
                var names = style.__names__ || (style.__names__ = Object.keys(style));

                loop:
                    for (var j = names.length - 1; j >= 0; j--)
                    {
                        var items = style[names[j]],
                            element = items[0],
                            length;

                        switch (element.token)
                        {
                            case "":  //类型
                                if (!(target instanceof element.__type__)) continue;
                                break;

                            case ".": //class
                                if (!target.hasClass(element.name)) continue;
                                break;

                            case "#": //id
                                if (target.id != element.name) continue;
                                break;
                        }

                        if ((length = element.length) > 0)
                        {
                            for (var k = 0; k < length; k++)
                            {
                                if (element[k].style_check(element, target) === false)
                                {
                                    continue loop;
                                }
                            }
                        }

                        return items[1];
                    }
            }
        }
    };


    //处理样式 按样式属性名存储 再根据
    function handle_style(element, style) {

        //类
        if (element.token == "")
        {
            element.__type__ = registry_list[element.name] || flyingon.Control;
        }

        var target,
            group = element.__group__ || element.style_group(), //先处理样式组
            weight = element.__weight__ || element.style_weight(), //当前权重
            value,
            index;

        loop:
            for (var name in style)
            {
                if ((value = style[name]) !== undefined) //样式属性值设置为undefined则不处理
                {
                    if (target = styles[name]) //已有属性
                    {
                        target = target[group] || (target[group] = {});
                        index = weight;

                        while (target[index])
                        {
                            if (target[index][0].selector == element.selector) //如果选择器相等则后面冲掉前面的值
                            {
                                target[index] = [element, value];
                                continue loop;
                            }

                            index++;
                        }

                        target[index] = [element, value];
                        delete target.__keys__;
                    }
                    else
                    {
                        ((styles[name] = {})[group] = {})[weight] = [element, value];
                    }
                }
            }
    };


    //定义样式
    flyingon.defineStyle = function (selector, style, super_selector) {

        if (selector && style)
        {
            var items, cache;

            //处理thickness
            for (var i = 0; i < 3; i++)
            {
                if (style[cache = thickness[i]])
                {
                    style[cache] = new flyingon.Thickness(cache);
                }
            }

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

            //解析选择器
            var element = flyingon.parse_selector(selector).last;

            //拆分选择器 把最后的组合选择器拆分成单独的元素进行处理
            if (element.type != ",")
            {
                element.selector = selector;
                handle_style(element, style);
            }
            else
            {
                items = [element];

                while (element = element.previous)
                {
                    items.push(element);

                    if (element.type != ",")
                    {
                        break;
                    }
                }

                element.next = null;

                for (var i = 0; i < items.length; i++)
                {
                    (cache = items[i]).previous = element;
                    cache.selector = selector;

                    handle_style(cache, style);
                }
            }
        }

    };


})(flyingon);
