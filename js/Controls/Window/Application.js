

//应用程序
(function (flyingon) {



    function Class() { };


    (function (flyingon) {


        var default_style,  //默认样式

            parse_setting = {

                margin: parse_thickness,
                border: parse_thickness,
                padding: parse_thickness
            };



        //加载默认样式
        function load_default_style() {

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
                initialize_style(flyingon.Control);
            }
        };

        //复制样式
        function initialize_style(Class) {

            var subtypes = Class.subtypes;
            if (subtypes)
            {
                var styles = flyingon.styles,
                    templates = flyingon.templates,
                    parent_style = styles[Class.fullTypeName],
                    parent_template = templates[Class.fullTypeName];

                for (var i = 0, length = subtypes.length; i < length; i++)
                {
                    var target = subtypes[i],
                        fullTypeName = target.fullTypeName,
                        style = styles[fullTypeName] || (styles[fullTypeName] = {}),
                        template = templates[fullTypeName] || (templates[fullTypeName] = {});


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
        this.load_style = function (url) {

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



        //初始化应用
        this.initialize = function (reset) {

            if (!flyingon.styles)
            {
                //加载资源包
                flyingon.require(flyingon_setting.language_file);

                //加载默认样式
                load_default_style();
            }
        };



    }).call(Class.prototype, flyingon);




    var cache = {},
        system = flyingon.__application__ = new Class();


    //创建或切换应用程序
    flyingon.application = function (name, fn) {

        flyingon.__application__ = name ? cache[name] || (cache[name] = {}) : system;

        if (typeof fn == "function")
        {
            fn.call(flyingon.__application__, flyingon);
        }
    };



})(flyingon);
