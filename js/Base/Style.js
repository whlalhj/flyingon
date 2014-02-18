

var flyingon_fonts = {},

    flyingon_colors = {},

    flyingon_images = {};




//定义字体
flyingon.defineFonts = function (fonts) {

    flyingon.mearge(flyingon_fonts, fonts);
};



//定义颜色
flyingon.defineColors = function (colors) {

    flyingon.mearge(flyingon_colors, colors);
};



//定义图像
flyingon.defineImages = function (images, conver_at_once) {

    //转成Image对象
    if (conver_at_once !== false)
    {
        for (var name in images)
        {
            images[name] = new Image().src = images[name];
        }
    }

    flyingon.mearge(flyingon_images, images);
};



//定义样式
(function (flyingon) {



    var styles = {},  //样式集

        styles_cache = {}, //样式缓存

        thickness = ["margin", "border", "padding"];



    //获取样式值
    flyingon.styleValue = function (target, name) {

        var style = styles[name],
            keys,
            items,
            element;

        if (style)
        {
            keys = style.__keys__ || (style.__keys__ = Object.keys(style));

            loop:
                for (var i = keys.length - 1; i >= 0; i--)
                {
                    element = (items = style[keys[i]])[0];

                    switch (element.token)
                    {
                        case "":  //类型
                            if (target.__fullTypeName__ != element.name) continue;
                            break;

                        case ".": //class
                            if (!target.hasClass(element.name)) continue;
                            break;

                        case "#": //id
                            if (target.id != element.name) continue;
                            break;
                    }

                    if (element.length > 0)
                    {
                        for (var j = 0; j < element.length; j++)
                        {
                            if (element[j].check(target) === false)
                            {
                                continue loop;
                            }
                        }
                    }

                    return items[1];
                }
        }
    };


    //处理样式 按样式属性名存储 再根据
    function handle_style(element, style) {

        //当前权重
        var weight = element.weight() * 100,
            item;

        for (var name in style)
        {
            //已有属性
            if (item = styles[name])
            {
                while (item[weight])
                {
                    weight++;
                }

                item[weight] = [element, style[name]];
                delete item.__keys__;
            }
            else
            {
                (styles[name] = {})[weight] = [element, style[name]];
            }
        }
    };


    //定义样式
    var defineStyle = flyingon.defineStyle = function (selector, style, super_selector) {

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
                    handle_style(cache, style);
                }
            }
        }

    };


    //初始化默认样式 注意伪类的初始化顺序
    defineStyle("*", {

        width: "default", //宽度 default|fill|auto|number|number%
        height: "default", //高度 default|fill|auto|number|number%
        background: "control-back",
        foreground: "control-text",
        borderColor: "control-border"
    });

    //选中时控件默认样式
    defineStyle("*:checked", {

        background: "checked-back",
        foreground: "checked-text",
        borderColor: "checked-border"
    });

    //获取焦点时控件默认样式
    defineStyle("*:focus", {

        background: "focus-back",
        foreground: "focus-text",
        borderColor: "focus-border"
    });


    //捕获鼠标时控件默认样式
    defineStyle("*:hover", {

        background: "hover-back",
        foreground: "hover-text",
        borderColor: "hover-border"
    });

    //活动状态时控件默认样式
    defineStyle("*:active", {

        background: "active-back",
        foreground: "active-text",
        borderColor: "active-border"
    });

    //禁用时控件默认样式
    defineStyle("*:disabled", {

        background: "disabled-back",
        foreground: "disabled-text",
        borderColor: "disabled-border"
    });


    defineStyle(".window-maximize.hover", {

        background: "white",
        image: "window-maximize-hover"
    });


})(flyingon);
