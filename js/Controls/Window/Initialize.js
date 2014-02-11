
//系统初始化方法
(function (flyingon) {


    var style_loaded = false;


    //加载默认样式
    function load_default_style() {

        if (!style_loaded)
        {
            var data = flyingon.require(flyingon_setting.style_file || "themes/default.js");

            if (data)
            {
                flyingon.fonts = data.fonts || {};
                flyingon.cursors = data.cursors || {};
                flyingon.images = data.images || {};
                flyingon.colors = data.colors || {};
                flyingon.styles = data.styles || {};
                flyingon.templates = data.templates || {};

                parse_style(flyingon.styles);
            }

            style_loaded = true;
        }
    };

    //复制样式
    function initialize_style(Class) {

        var subclasses = Class.subclasses;
        if (subclasses)
        {
            var styles = flyingon.styles,
                templates = flyingon.templates,
                parent_style = styles[Class.classFullName],
                parent_template = templates[Class.classFullName];

            for (var i = 0, length = subclasses.length; i < length; i++)
            {
                var target = subclasses[i],
                    className = target.className,
                    style = styles[className] || (styles[className] = {}),
                    template = templates[className] || (templates[className] = {});


                //复制上级样式
                if (parent_style)
                {
                    flyingon.mearge(parent_style, style, true);
                }

                //复制上级模板
                if (parent_template)
                {
                    flyingon.mearge(parent_template, template, true);
                }


                //递归
                initialize_style(target);
            }
        }
    };


    function parse_thickness(name) {

        this[name] = new flyingon.Thickness(this[name]);
    };


    var parse_setting = {

        margin: parse_thickness,
        border: parse_thickness,
        padding: parse_thickness
    };


    function parse_style(target) {

        var names = Object.keys(target),
            name,
            value,
            fn;

        for (var i = 0, length = names.length; i < length; i++)
        {
            if ((name = names[i]) && (fn = parse_setting[name]))
            {
                fn.call(target, name);
            }
            else if ((value = target[name]) && typeof value == "object" && value.constructor != Array)
            {
                parse_style(value);
            }
        }

    };



    //加载样式
    flyingon.load_style = function (url) {

        if (url)
        {
            load_default_style();

            var data = flyingon.require(url);

            if (data)
            {
                parse_style(data);
                flyingon.mearge(data, flyingon);
            }
        }
    };



    //初始化系统
    flyingon.initialize = function (reset) {

        if (flyingon.Control)
        {
            //加载资源包
            flyingon.require(flyingon_setting.language_file);

            //加载默认样式
            load_default_style();

            //初始化控件样式
            initialize_style(flyingon.Control);
        }
    };


})(flyingon);