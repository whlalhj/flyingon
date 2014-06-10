/// <reference path="../Base/Core.js" />


//控件基类
flyingon.defineClass("Control", flyingon.SerializableObject, function (Class, base, flyingon) {



    Class.create = function () {

        //唯一id
        this.__uniqueId = ++flyingon.__uniqueId;

        //自定义样式数据
        this.__style = Object.create(null);

        //样式表缓存数据
        this.__styleSheets = Object.create(null);
    };



    //子控件集合
    this.__children = null;

    //可见子项集合
    this.__visible_items = null;


    //引用序列化标记(为true时只序列化名称不序列化内容)
    this.serialize_reference = true;



    //父控件
    this.defineProperty("parent", null, {

        getter: function () {

            return this.__parent;
        },

        setter: function (value) {

            var oldValue = this.__parent;

            if (value !== oldValue)
            {
                if (oldValue)
                {
                    oldValue.__children.remove(this);
                }

                if (value)
                {
                    value.__children.append(this);
                }
            }

            return this;
        }
    });



    //触发父控件变更
    this.__fn_parent = function (parent) {

        this.__parent = parent;
        this.__fn_reset_style();    //重置样式

        this.dispatchEvent(new flyingon.PropertyChangeEvent(this, "parent", parent, this.__parent));
    };

    //当前控件是否指定控件的父控件
    this.isParent = function (control) {

        if (!control || control === this)
        {
            return false;
        }

        var target = control.__parent;

        while (target)
        {
            if (target === this)
            {
                return true;
            }

            target = target.__parent;
        }

        return false;
    };

    //指定控件是否当前控件的父控件
    this.isParentTo = function (control) {

        return control ? control.isParent(this) : false;
    };



    var ControlCollection = flyingon.ControlCollection;

    //子控件集合
    this.defineProperty("children", function () {

        return this.__children || (this.__children = this.__visible_items = new ControlCollection(this));
    });

    //子索引号
    this.defineProperty("childIndex", function () {

        var cache = this.__parent;
        return (cache && (cache = cache.__children) && cache.indexOf(this)) || -1;
    });


    //从父控件中移除自身
    this.remove = function () {

        var parent = this.__parent;

        if (parent)
        {
            parent.__children.remove(this);
        }

        return this;
    };




    //所属窗口变量
    this.__ownerWindow = null;

    //所属图层内部变量
    this.__ownerLayer = null;



    //所属窗口
    this.defineProperty("ownerWindow", function () {

        return this.__ownerWindow || (this.__ownerWindow = this.__parent.ownerWindow);
    });


    //所属图层
    this.defineProperty("ownerLayer", function () {

        return this.__ownerLayer || (this.__parent && (this.__ownerLayer = this.__parent.ownerLayer)) || null;
    });




    //class state
    (function (flyingon) {


        //id
        this.defineProperty("id", null, {

            attributes: "layout",
            changed: "this.__fn_reset_style();"    //重置样式
        });


        //指定class名 与html一样
        this.defineProperty("className", null, {

            attributes: "layout|query",
            complete: "this.__fn_className(value);"
        });

        //处理className
        this.__fn_className = function (value) {

            var values;

            if (value && (values = value.match(/\S+/g)).length > 0)
            {
                var cache = this.__class_names = {};

                for (var i = 0, _ = values.length; i < _; i++)
                {
                    cache[values[i]] = true;
                }

                this.__fields.className = (cache.__keys = Object.keys(cache)).join(" ");
            }
            else
            {
                this.__class_names = null;
                this.__fields.className = null;
            }

            //重置样式
            this.__style_version = 0;
            this.__style_types = null;

            //class变更可能需要重新布局
            (this.__parent || this).invalidate(true);
        };

        //是否包含指定class
        this.hasClass = function (className) {

            return this.__class_names && this.__class_names[className];
        };

        //添加class
        this.addClass = function (className) {

            if (className)
            {
                this.className += " " + className;
            }
        };

        //移除class
        this.removeClass = function (className) {

            var names = this.__class_names;

            if (names && className && names[className])
            {
                delete names[className];
                this.className = Object.keys(names).join(" ");

                return true;
            }
        };

        //切换class 有则移除无则添加
        this.toggleClass = function (className) {

            var names = this.__class_names;

            if (names && className)
            {
                if (names[className])
                {
                    delete names[className];
                    this.className = Object.keys(names).join(" ");
                }
                else
                {
                    this.className += " " + className;
                }
            }
        };




        //状态变更事件
        this.defineEvent("statechange");

        /*
    
        支持状态
    
        checked       被选中
        selection     用户当前选中的元素
        focus         获得当前焦点
        hover         鼠标悬停其上
        active        鼠标已经其上按下、还没有释放
        disabled      禁用
    
        */
        //切换状态 
        //name: checked || selection || focus || hover || active || disabled
        //value: true || false
        this.stateTo = function (name, value) {

            //保存状态值
            (this.__states || (this.__states = Object.create(null)))[name] = value;

            //清空缓存样式表
            this.__style_version = 0;
            this.__style_types = null;

            //状态变更事件
            this.dispatchEvent(new flyingon.ChangeEvent("statechange", this, name, value));

            //样式变更可能需要重新布局
            (this.__parent || this).invalidate(true);
        };


        //获取状态图片(图片资源有命名规则要求) active -> hover -> checked -> common
        this.__fn_state_image = function (name) {

            var states = this.__states,
                images = [];

            if (states)
            {
                if (states.active)
                {
                    images.push(name + "-active");
                }

                if (states.hover)
                {
                    images.push(name + "-hover");
                }

                if (states.checked)
                {
                    images.push(name + "-checked");
                }
            }

            images.push(name);

            return flyingon.get_image_any(images);
        };


    }).call(this, flyingon);




    //样式相关
    (function (flyingon) {




        //当前样式版本(控制样式组缓存更新)
        flyingon.__style_version = 0;



        var self = this,

            style_split_fn = {},    //样式拆分函数

            style_data_type = {},  //样式数据类型

            style_sheets = {},      //样式表集合

            style_type_fn = {},     //样式类型检查函数

            style_pseudo_fn = {},   //样式伪类检查函数

            style_cache_list = {},  //缓存样式值集合`  注:为加快样式值查找对所有样式按元素类型进行分类存储 此处的优先级可能与css样式有些差异???

            style_type_names = {},  //样式类别名集合(按类别缓存样式) 缓存方式: 属性名 -> 类别 -> 权重 -> [选择器, 样式值]

            convert_name_regex = /[-_](\w)/g,   //名称转换规则 例: margin-left || margin_left -> marginLeft

            pseudo_keys = {         //伪类key 不在此列即为伪元素 value为伪元素权重 默认为10

                selection: 16,
                enabled: 15,
                disabled: 15,
                active: 14,
                hover: 13,
                focus: 12,
                checked: 11
            };





        //当前版本
        this.__style_version = 0;

        //样式类别
        this.__style_types = null;




        //修改集合项为首字母大写
        function toUpperCase(values, prefix) {

            prefix = prefix || "";

            for (var i = 0, _ = values.length; i < _; i++)
            {
                values[i] = prefix + values[i][0].toUpperCase() + values[i].substring(1);
            }

            return values;
        };


        //定义复合属性 不存储实际数据 通过定义属性进行操作
        function complex(name, getter, split_fn) {

            var name = name.replace(convert_name_regex, function (_, x) {

                return x.toUpperCase();
            });

            if (getter.constructor !== Function) //如果getter为数组则表示子属性
            {
                var template, names;

                if (getter[1].constructor !== String)
                {
                    template = getter[0];
                    names = getter[1];
                }
                else
                {
                    template = name + "-?";
                    names = getter;
                }

                for (var i = 0, _ = names.length; i < _; i++)
                {
                    names[i] = "this." + template.replace("?", names[i]).replace(convert_name_regex, function (_, x) {

                        return x.toUpperCase();
                    });
                }

                getter = new Function("return [" + names.join(",") + "].join(\" \");")

                if (!split_fn) //未指定则默认拆分成4个值 只有一个值则全部相等 两个值则2,3=0,1 3个值则3=1
                {
                    var body = "\n";

                    for (var i = 0, _ = names.length; i < _; i++)
                    {
                        body += names[i] + " = values[" + i + "];\n";
                    }

                    split_fn = new Function("value", flyingon.function_body(function () {

                        var values = value != null && ("" + value).match(/[\w-_%]+/g);

                        if (values)
                        {
                            if (values.length < 4)
                            {
                                switch (values.length)
                                {
                                    case 1:
                                        values[1] = values[2] = values[3] = values[0];
                                        break;

                                    case 2:
                                        values[2] = values[0];
                                        values[3] = values[1];
                                        break;

                                    default:
                                        values[3] = values[1];
                                        break;
                                }
                            }
                        }
                        else
                        {
                            values = [];
                        }

                    }) + body);
                }
            }

            flyingon.defineProperty(self, name, getter, style_split_fn[name] = split_fn);
        };


        //创建样式
        function style(name, defaultValue, inherit, level) {

            name = name.replace(convert_name_regex, function (_, x) {

                return x.toUpperCase();
            });

            var getter = "var value;\n"
                    + "if ((value = this.__style." + name + ") !== undefined)\n"
                    + "{\n"
                    + "return value;\n"
                    + "}\n\n"

                    + "if (this.__style_version === flyingon.__style_version)\n"
                    + "{\n"
                        + "if ((value = this.__styleSheets." + name + ") !== undefined)\n"
                        + "{\n"
                        + "return value;\n"
                        + "}\n"
                    + "}\n"
                    + "else\n"
                    + "{\n"
                    + "this.__style_types = null;\n"
                    + "}\n\n"

                    + "if ((value = this.__styleSheets." + name + " = this.__fn_style_value(\"" + name + "\")) !== undefined)\n"
                    + "{\n"
                    + "return value;\n"
                    + "}\n\n"

                    + "return "
                    + (inherit ? "this.__parent ? this.__parent." + name + " : " : "")
                    + (typeof defaultValue === "string" ? "\"" + defaultValue + "\"" : defaultValue)
                    + ";",

                setter = [];


            switch (style_data_type[name] = typeof defaultValue)
            {
                case "boolean":
                    setter.push("value = !!value;\n");
                    break;

                case "number":
                    if (("" + defaultValue).indexOf(".") >= 0)
                    {
                        style_data_type[name] = "integer";
                        setter.push("value = parseInt(value);\n");
                    }
                    else
                    {
                        setter.push("value = parseInt(value);\n");
                    }
                    break;

                case "string":
                    setter.push("value = value ? \"\"+ value : \"\";\n");
                    break;
            }


            setter.push("var fields = this.__style, cache;\n\n");

            setter.push(self.__define_initializing(name, false));

            setter.push("var oldValue = this." + name + ";\n\n");


            setter.push("if (oldValue !== value)\n");
            setter.push("{\n\n");

            setter.push(self.__define_change(name, false));

            setter.push("fields." + name + " = value;\n\n");


            setter.push("if (cache = this.__bindings)\n");
            setter.push("{\n");
            setter.push("this.__fn_bindings(\"" + name + "\", cache);\n");
            setter.push("}\n\n");


            //此块与控件有关
            switch (level)
            {
                case "relayout":
                    setter.push("(this.__parent || this).invalidate(true);\n");
                    break;

                case "rearrange":
                    setter.push("this.invalidate(true);\n");
                    break;

                default:
                    setter.push("this.invalidate(false);\n");
                    break;
            }

            setter.push("}");



            flyingon.defineProperty(self, name, new Function(getter), new Function("value", setter.join("")));
        };


        //创建多个相同性质的样式
        function styles(template, names, defaultValue, inherit, level) {

            for (var i = 0, _ = names.length; i < _; i++)
            {
                style(template.replace("?", names[i]), defaultValue, inherit, level);
            }
        };




        //控件宽度及高度
        //auto	    自动(根据不同的排列和空间自动取值) 
        //fill      充满可用空间
        //content   根据内容自动调整
        //number	整数值
        styles("?", ["width", "height"], "auto", false, "relayout");

        //控件横向偏移距离
        //number	整数值
        style("offset-x", 0, false, "relayout");

        //控件纵向偏移距离
        //number	整数值
        style("offset-y", 0, false, "relayout");

        //控件最小宽度和最小高度
        //number	整数值 
        styles("min-?", ["width", "height"], 0, false, "relayout");

        //控件最大宽度和最大高度
        //number	整数值 
        styles("max-?", ["width", "height"], 0, false, "relayout");

        //控件层叠顺序
        //number	整数值 
        style("z-index", 0, false, "rearrange");




        //控件阅读方向
        //ltr	    从左到右 
        //rtl	    从右到左 
        style("direction", "ltr", true, "rearrange");

        //是否竖排布局(非html css属性)
        //true      竖排
        //false     横排
        style("vertical", false, false, "rearrange");


        //控件停靠方式(此值仅在所属布局类型为停靠布局(dock)时有效)(非html css属性)
        //left:     左见枚举
        //top:      顶部见枚举
        //right:    右见枚举
        //bottom:   底部见枚举
        //fill:     充满
        //none:     不停靠(使用绝对定位)
        style("dock", "left", false, "relayout");

        //是否强制换行(此值仅在所属布局类型为流式布局(flow),网格布局(grid)及表格布局(table)时有效)(非html css属性)
        //fals
        //true
        style("line-break", false, false, "relayout");

        //纵跨列数(此值仅在所属布局类型为网格布局(grid)或表格布局(table)时有效)(非html css属性)
        //number	整数值 
        //all       横跨所有列
        style("column-span", 0, false, "relayout");

        //横跨行数(此值仅在所属布局类型为网格布局(grid)或表格布局(table)时有效)(非html css属性)
        //number	整数值 
        //all       横跨所有行
        style("row-span", 0, false, "relayout");

        //跳过网格表格数(此值仅在所属布局类型为网格布局(grid)或表格布局(table)时有效)(非html css属性)
        //number    整数值
        style("jump-cells", 0, false, "rearrange");

        //控件左上角x及y坐标(此值仅在所属布局类型为绝对定位(absolute)时有效)
        //number	整数值
        styles("?", ["top", "left"], 0, false, "relayout");


        //布局类型(仅对Panel类型控件有效)(非html css属性)
        //line:         线性布局(支持竖排)
        //flow:         流式布局(支持竖排)
        //page:         单页显示(不支持竖排)
        //dock:         停靠布局(不支持竖排)
        //grid:         网格布局(支持竖排)
        //table:        表格布局(不支持竖排)
        //absolute:     绝对定位(不支持竖排)
        //...:          其它自定义布局
        style("layout-type", "flow", false, "rearrange");

        //布局时行与行之间的间隔(非html css属性)
        //number	整数值 
        //number%   总宽度的百分比
        style("layout-line-space", 0, false, "rearrange");

        //布局时项与项之间的间隔(非html css属性)
        //number	整数值 
        //number%   总高度的百分比
        style("layout-item-space", 0, false, "rearrange");

        //布局行高(此值仅对横向流式布局(flow)有效)(非html css属性)
        //number	整数值 
        style("layout-height", 0, false, "rearrange");

        //布局列宽(此值仅对纵向流式布局(flow)有效)(非html css属性)
        //number	整数值 
        style("layout-width", 0, false, "rearrange");

        //单页显示布局当前页(此值仅对单页显示布局(page)有效)(非html css属性)
        //number	整数值 
        style("layout-page", 0, false, "rearrange");

        //均匀网格布局列数(此值仅对网格布局(grid)有效)(非html css属性)
        //number	整数值 
        //string    自定义列 如:"20 30% 20* *"表示3列 第一列固定宽度为20 第2列使用剩下可用空间的30% 第3,4行使用全部剩余空间,第3行占比20/120 第4行占比100/120
        style("layout-grid-columns", 3, false, "rearrange");

        //均匀网格布局行数(此值仅对网格布局(grid)有效)(非html css属性)
        //number	整数值 
        //string    自定义行 如:"20 30% 20* *"表示3列 第一行固定宽度为20 第2行使用剩下可用空间的30% 第3,4行使用全部剩余空间,第3行占比20/120 第4行占比100/120
        style("layout-grid-rows", 3, false, "rearrange");

        //表格布局定义(此值仅对表格布局(table)有效)(非html css属性)
        //行列格式: row[column ...] ...
        //row,column可选值: 整数(固定行高或列宽) 数字%(总宽度或高度的百分比) [数字]*(剩余空间的百分比,数字表示权重,省略时权重默认为100)
        //column可嵌套表,嵌套表格式: table(spaceX spaceY) row[column ...] ... end spaceX,spaceY为横或纵向留空(可省略,默认与父表相等),整数值或百分比
        //九宫格正中内嵌九宫格(留空为父表的一半)示例: "*[* * *] *[* * table(50% 50%) *[* * *] *[* * *] *[* * *] end *] *[* * *]"
        style("layout-table", "*[* * *] *[* * *] *[* * *]", false, "rearrange");




        //控件对齐方式简写方式(同时设置横向及纵向对齐方式以空格分开 如:"left top")(非html css属性)
        //left      左边对齐
        //center    横向居中对齐
        //right     右边对齐
        //top       顶部对齐
        //middle    纵向居中对齐
        //bottom    底部对齐
        complex("align", ["x", "y"], (function () {

            var regex1 = /left|center|right/,
                regex2 = /top|middle|bottom/;

            return function (value) {

                this.alignX = value.match(regex1) || "left";
                this.alignY = value.match(regex2) || "top";
            };

        })());

        //控件横向对齐方式(非html css属性)
        //left      左边对齐
        //center    横向居中对齐
        //right     右边对齐
        style("align-x", "center", false, "relayout");

        //控件纵向对齐方式(非html css属性)
        //top       顶部对齐
        //middle    纵向居中对齐
        //bottom    底部对齐
        style("align-y", "middle", false, "relayout");



        //控件内容对齐方式简写(同时设置横向及纵向对齐方式用空格分开 如:"left bottom")(非html css属性)
        complex("content-align", ["x", "y"], (function () {

            var regex1 = /left|center|right/,
                regex2 = /top|middle|bottom/;

            return function (value) {

                this.contentAlignX = value.match(regex1) || "center";
                this.contentAlignY = value.match(regex2) || "middle";
            };

        })());

        //控件内容横向对齐样式(非html css属性)
        //left      左边对齐
        //center    横向居中对齐
        //right     右边对齐
        style("content-align-x", "center", false, "rearrange");

        //控件内容纵向对齐样式(非html css属性)
        //top       顶部对齐
        //middle    纵向居中对齐
        //bottom    底部对齐
        style("content-align-y", "middle", false, "rearrange");




        //控件溢出处理(包含横向溢出处理及纵向溢出处理)
        //hidden    内容会被修剪 其余内容是不可见的
        //scroll	内容会被修剪 但是浏览器会显示滚动条以便查看其余的内容
        //auto      如果内容被修剪 则浏览器会显示滚动条以便查看其余的内容
        //同时设置横向溢出处理及纵向溢出处理以空格分开, 如:"auto scroll"
        complex("overflow", ["x", "y"], (function () {

            var regex = /hidden|scroll|auto/g;

            return function (value) {

                var values = value.match(regex);

                if (values)
                {
                    this.overflowX = values[0];
                    this.overflowY = values[1] || values[0];
                }
            }
        }));

        //控件横向溢出处理及纵向溢出处理
        //hidden    内容会被修剪 其余内容是不可见的
        //scroll	内容会被修剪 但是浏览器会显示滚动条以便查看其余的内容
        //auto      如果内容被修剪 则浏览器会显示滚动条以便查看其余的内容
        styles("overflow-?", ["x", "y"], "hidden", false, "rearrange");



        //控件可见性
        //visible	默认值 元素是可见的 
        //hidden	元素是不可见的 
        //collapse	当在表格元素中使用时, 此值可删除一行或一列, 但是它不会影响表格的布局 被行或列占据的空间会留给其他内容使用 如果此值被用在其他的元素上, 会呈现为 "hidden" 
        style("visibility", "visible", true, "relayout");

        //控件透明度
        //number	0(完全透明)到1(完全不透明)之间数值
        style("opacity", 1, false);

        //控件鼠标样式
        //url	    需使用的自定义光标的 URL     注释：请在此列表的末端始终定义一种普通的光标, 以防没有由 URL 定义的可用光标 
        //default	默认光标(通常是一个箭头)
        //auto	    默认 浏览器设置的光标 
        //crosshair	光标呈现为十字线 
        //pointer	光标呈现为指示链接的指针(一只手)
        //move	    此光标指示某对象可被移动 
        //e-resize	此光标指示矩形框的边缘可被向右(东)移动 
        //ne-resize	此光标指示矩形框的边缘可被向上及向右移动(北/东) 
        //nw-resize	此光标指示矩形框的边缘可被向上及向左移动(北/西) 
        //n-resize	此光标指示矩形框的边缘可被向上(北)移动 
        //se-resize	此光标指示矩形框的边缘可被向下及向右移动(南/东) 
        //sw-resize	此光标指示矩形框的边缘可被向下及向左移动(南/西) 
        //s-resize	此光标指示矩形框的边缘可被向下移动(南) 
        //w-resize	此光标指示矩形框的边缘可被向左移动(西) 
        //text	    此光标指示文本 
        //wait	    此光标指示程序正忙(通常是一只表或沙漏) 
        //help	    此光标指示可用的帮助(通常是一个问号或一个气球) 
        style("cursor", "auto", true);




        //控件外边距简写方式(按照上右下左的顺序编写 与css规则相同)
        complex("margin", ["top", "right", "bottom", "left"]);

        //控件上右下左外边距
        //number	整数值 
        styles("margin-?", ["top", "right", "bottom", "left"], 0, false, "relayout");



        //注: 控件的边框与css有些不同 不支持对不同的边框线设置不同的宽度,样式及圆角大小等, 但可设置是否绘制边框
        //border            统一设置四边都绘制的边框风格
        //border-top        是否绘制顶边框 true|false
        //border-right      是否绘制右边框 true|false
        //border-bottom     是否绘制底边框 true|false
        //border-left       是否绘制左边框 true|false
        //border-width      边框厚度 整数值
        //border-style      边框样式 目前仅支持solid
        //border-color      边框颜色 
        //border-radius     边框圆角大小 整数值


        //控件边框简写方式(按照 width -> style -> color 的顺序设置)
        //width	边框宽度 整数值 
        //style	边框样式
        //color	边框颜色
        complex("border", ["width", "style", "color"], (function () {

            var regex = /(\d+)?\s*(solid|dotted|dashed)?\s*(\S+)?/,
                names1 = toUpperCase(["width", "style", "color"], "border"),
                names2 = toUpperCase(["top", "right", "bottom", "left"], "border");

            return function (value) {

                if (value)
                {
                    var self = this;

                    ("" + value).replace(regex, function (_, width, style, color) {

                        self[names1[0]] = width;
                        self[names1[1]] = style;
                        self[names1[2]] = color;

                        self[names2[0]] = self[names2[1]] = self[names2[2]] = self[names2[3]] = width > 0;
                    });
                }
            };

        })());

        //是否绘制控件上边框 true|false
        style("border-top", true, false, "relayout");

        //是否绘制控件右边框 true|false
        style("border-right", true, false, "relayout");

        //是否绘制控件下边框 true|false
        style("border-bottom", true, false, "relayout");

        //是否绘制控件左边框 true|false
        style("border-left", true, false, "relayout");

        //控件边框样式(注: 目前仅支持solid边框样式)
        //solid	    定义实线边框
        //dotted	定义点状边框 在大多数浏览器中呈现为实线 
        //dashed	定义虚线 在大多数浏览器中呈现为实线 
        style("border-style", "solid", false);

        //控件边框宽度
        //number	整数值 
        style("border-width", 0, false, "relayout");

        //控件边框颜色
        //color_name	规定颜色值为颜色名称的边框颜色(比如 red) 
        //hex_number	规定颜色值为十六进制值的边框颜色(比如 #ff0000) 
        //rgb_number	规定颜色值为 rgb 代码的边框颜色(比如 rgb(255,0,0)) 
        //transparent	边框颜色为透明 
        //inherit	    规定应该从父元素继承边框颜色 
        style("border-color", "transparent", false);

        //控件边框圆角大小
        //number	整数值
        style("border-radius", 0, false);


        //"border-collapse"
        //"border-image"
        //"border-image-outset"
        //"border-image-repeat"
        //"border-image-slice"
        //"border-image-source"
        //"border-image-width"




        //控件内边距简写方式(上右下左内边距的简写方式 按照上右下左的顺序编写 与css规则相同)
        complex("padding", ["top", "right", "bottom", "left"]);

        //控件上右下左内边距
        //number	整数值
        styles("padding-?", ["top", "right", "bottom", "left"], 0, false, "relayout");


        //控件背景简写方式 必须按照 color -> image -> repeat -> attachment -> position 的顺序编写 可省略某些属性
        complex("background", ["color", "image", "repeat", "attachment", "position"], (function () {

            var regex = /(none|url\([^\)]*\))|(repeat|repeat-x|repeat-y|no-repeat)|(scroll|fixed)|(left|top|center|right|bottom|\d+[\w%]*)|\S+/g,
                names = toUpperCase(["color", "image", "repeat", "attachment", "position"], "background"),
                name;

            return function (value) {

                if (value)
                {
                    var values, cache;

                    ("" + value).replace(regex, function (_, image, repeat, attachment, position, color) {

                        values = values || {};

                        color && (values.color = color);
                        image && (values.mage = image);
                        repeat && (values.repeat = repeat);
                        attachment && (values.attachment = attachment);

                        if (position)
                        {
                            switch (position)
                            {
                                case "top":
                                    cache ? (cache[1] = "0%") : (cache = ["50%", "0%"]);
                                    break;

                                case "left":
                                    cache ? (cache[0] = "0%") : (cache = ["0%", "50%"]);
                                    break;

                                case "center":
                                    cache ? (cache[1] = "50%") : (cache = ["50%", "50%"]);
                                    break;

                                case "right":
                                    cache ? (cache[0] = "100%") : (cache = ["100%", "50%"]);
                                    break;

                                case "bottom":
                                    cache ? (cache[1] = "100%") : (cache = ["50%", "100%"]);
                                    break;

                                default:
                                    cache ? (cache[1] = position) : (cache = [position, "50%"]);
                                    break;
                            }
                        }
                    });

                    if (values)
                    {
                        if (cache)
                        {
                            values.position = cache.join(" ");
                        }

                        for (var i = 0; i < 5; i++)
                        {
                            cache = names[i];
                            this[cache[1]] = values[cache[0]];
                        }
                    }
                }
            };

        })());

        //控件背景颜色
        //color_name	规定颜色值为颜色名称的背景颜色(比如 red) 
        //hex_number	规定颜色值为十六进制值的背景颜色(比如 #ff0000) 
        //rgb_number	规定颜色值为 rgb 代码的背景颜色(比如 rgb(255,0,0)) 
        //transparent	背景颜色为透明 
        style("background-color", "transparent", false);

        //控件背景图片
        //url('URL')	指向图像的路径 
        //none	        不显示背景图像 
        style("background-image", "none", false);

        //控件背景重复方式
        //repeat	背景图像将在垂直方向和水平方向重复 
        //repeat-x	背景图像将在水平方向重复 
        //repeat-y	背景图像将在垂直方向重复 
        //no-repeat	背景图像将仅显示一次 
        style("background-repeat", "repeat", false);

        //控件背景滚动方向
        //scroll	背景图像会随着页面其余部分的滚动而移动 
        //fixed	    当页面的其余部分滚动时 背景图像不会移动 
        style("background-attachment", "scroll", false);

        //控件背景颜色对齐方式
        //top left
        //top center
        //top right
        //center left
        //center center
        //center right
        //bottom left
        //bottom center
        //bottom right  如果您仅规定了一个关键词, 那么第二个值将是"center"     默认值：0% 0% 
        //x% y%	        第一个值是水平位置, 第二个值是垂直位置     左上角是 0% 0% 右下角是 100% 100%     如果您仅规定了一个值, 另一个值将是 50% 
        //xpos ypos	    第一个值是水平位置, 第二个值是垂直位置     左上角是 0 0 单位是像素 (0px 0px) 或任何其他的 CSS 单位     如果您仅规定了一个值, 另一个值将是50%     您可以混合使用 % 和 position 值 
        style("background-position", "0% 0%", false);

        //控件背景显示范围
        //padding-box	背景图像相对于内边距框来定位 	
        //border-box	背景图像相对于边框盒来定位 	
        //content-box	背景图像相对于内容框来定位 
        style("background-origin", "padding-box", false);

        //控件背景颜色缩放规则
        //length	    设置背景图像的高度和宽度     第一个值设置宽度, 第二个值设置高度     如果只设置一个值, 则第二个值会被设置为 "auto" 
        //percentage	以父元素的百分比来设置背景图像的宽度和高度     第一个值设置宽度, 第二个值设置高度     如果只设置一个值, 则第二个值会被设置为 "auto" 
        //cover	        把背景图像扩展至足够大, 以使背景图像完全覆盖背景区域     背景图像的某些部分也许无法显示在背景定位区域中 
        //contain	    把图像图像扩展至最大尺寸, 以使其宽度和高度完全适应内容区域 
        style("background-size", "auto", false);



        //控件颜色
        //color_name	规定颜色值为颜色名称的颜色(比如 red) 
        //hex_number	规定颜色值为十六进制值的颜色(比如 #ff0000) 
        //rgb_number	规定颜色值为 rgb 代码的颜色(比如 rgb(255,0,0)) 
        style("color", "black", true);




        //控件字体简写方式(必须按照 style -> variant -> weight -> size -> line-height -> family 的顺序编写 可省略某些属性)
        complex("font",

            function () {

                return this.fontStyle + " " + this.fontVariant + " " + this.fontWeight + " " + this.fontSize + "px " + this.fontFamily;
            },

            (function () {

                var regex = /(normal|italic|oblique)?\s*(normal|small-caps)?\s*(normal|bold|bolder|lighter|100|200|300|400|500|600|700|800|900)?\s*(\d+)?\s*\/?\s*(\d+[\w|%]*)?/;

                return function (value) {

                    if (value)
                    {
                        var self = this;

                        (value = "" + value).replace(regex, function (all, style, variant, weight, size, lineHeight) {

                            style && (self.fontStyle = style);
                            variant && (self.fontVariant = variant);
                            weight && (self.fontWeight = weight);
                            size && (self.fontSize = size);
                            lineHeight && (self.lineHeight = lineHeight);

                            if (value.length > all.length)
                            {
                                self.fontFamily = value.substring(all.length);
                            }
                        });
                    }
                };

            })());

        //控件字体样式
        //normal	浏览器显示一个标准的字体样式 
        //italic	浏览器会显示一个斜体的字体样式 
        //oblique	浏览器会显示一个倾斜的字体样式 
        style("font-style", "normal", true, "rearrange");

        //控件字体变体
        //normal	    浏览器会显示一个标准的字体 
        //small-caps	浏览器会显示小型大写字母的字体 
        style("font-variant", "normal", true, "rearrange");

        //控件字体粗细
        //normal	定义标准的字符 
        //bold	    定义粗体字符 
        //bolder	定义更粗的字符 
        //lighter	定义更细的字符 
        //100-900   定义由粗到细的字符 400 等同于 normal, 而 700 等同于 bold 
        style("font-weight", "normal", true, "rearrange");

        //控件字体大小
        //number	整数值
        style("font-size", 12, true, "rearrange");

        //控件字体族 family-name generic-family  用于某个元素的字体族名称或/及类族名称的一个优先表
        style("font-family", "arial,宋体,sans-serif", true, "rearrange");

        //控件文字行高
        //number	整数值 
        style("line-height", 12, true, "relayout");




        //控件文字字间距
        //number	整数值 
        style("letter-spacing", 0, true, "rearrange");

        //控件文字词间距(以空格为准)
        //number	整数值 
        style("word-spacing", 0, true, "rearrange");

        //控件文字缩进
        //number	整数值 
        style("text-indent", 0, true, "rearrange");

        //控件文字装饰
        //none	        默认 定义标准的文本 
        //underline	    定义文本下的一条线 
        //overline	    定义文本上的一条线 
        //line-through	定义穿过文本下的一条线 
        //blink	        定义闪烁的文本 
        style("text-decoration", "none", false);

        //控件文字换行方式
        //false	    不换行
        //true	    自动换行
        style("text-wrap", false, false, "rearrange")

        //控件文字溢出处理方式
        //clip	    修剪文本 	测试
        //ellipsis	显示省略符号来代表被修剪的文本 	
        //string	使用给定的字符串来代表被修剪的文本 
        //"text-overflow"

        //控件文字变换
        //none	        默认 定义带有小写字母和大写字母的标准的文本 
        //capitalize	文本中的每个单词以大写字母开头 
        //uppercase	    定义仅有大写字母 
        //lowercase	    定义无大写字母, 仅有小写字母 
        //"text-transform"

        //
        //normal	    默认 空白会被浏览器忽略 
        //pre	        空白会被浏览器保留 其行为方式类似 HTML 中的 <pre> 标签 
        //nowrap	    文本不会换行, 文本会在在同一行上继续, 直到遇到 <br> 标签为止 
        //pre-wrap	    保留空白符序列, 但是正常地进行换行 
        //pre-line	    合并空白符序列, 但是保留换行符 
        //"white-space"

        //
        //normal	    使用浏览器默认的换行规则 
        //break-all	    允许在单词内换行 
        //keep-all	    只能在半角空格或连字符处换行 
        //"word-break"

        //
        //normal	    只在允许的断字点换行(浏览器保持默认处理) 
        //break-word	在长单词或 URL 地址内部进行换行 
        //"word-wrap"





        //cssText
        flyingon.defineProperty(this, "style",

            function () {

                var data = [],
                    style = this.__style;

                for (var name in style)
                {
                    data.push(name + ":" + style[name]);
                }

                return data.join(";");
            },

            function (value) {

                var style = this.__style = Object.create(null);

                if (value)
                {
                    if (value.constructor === String)
                    {
                        var values = value.replace(convert_name_regex, function (_, x) {

                            return x.toUpperCase();

                        }).split(/\s*:\s*|\s*;\s*/g);

                        for (var i = 0, length = values.length; i < length; i++)
                        {
                            style[values[i++]] = values[i] || "";
                        }
                    }
                    else
                    {
                        for (var name in value)
                        {
                            style[name] = value[name];
                        }
                    }
                }
            });




        //获取样式值
        this.__fn_style_value = function (name) {

            var cache_name = style_cache_list[name],
                cache_type;

            if (cache_name)
            {
                var types = this.__style_types || this.__fn_style_types();

                for (var i = types.length - 1; i >= 0; i--)
                {
                    if (cache_type = cache_name[types[i]])
                    {
                        var weights = cache_type.__weights || (cache_type.__weights = Object.keys(cache_type));

                        next:
                            for (var j = weights.length - 1; j >= 0; j--)
                            {
                                var target = this,
                                    values = cache_type[weights[j]],
                                    selector = values[0],
                                    end = selector.length - 1,
                                    node = selector[end];

                                //处理伪元素
                                if (node.token === ":" && (!(target = style_pseudo_fn[node.name]) || target(node, target) === undefined))
                                {
                                    continue;
                                }

                                //检测属性
                                for (var index = 0, _ = node.length ; index < _; index++)
                                {
                                    if (node[index].check(target) === false)
                                    {
                                        continue next;
                                    }
                                }

                                //继续处理上一节点
                                if (end > 0 && style_type_fn[node.type](selector, end - 1, target) === false)
                                {
                                    continue;
                                }

                                return values[1];
                            }
                    }
                }
            }
        };


        //重置样式类别排除无关的样式
        this.__fn_style_types = function () {

            var Control = flyingon.Control,
                types = [],
                names = style_type_names,
                cache;

            //all
            types.push("*");

            //type
            var type = this.__class_type;

            while (type && type !== Control)
            {
                if (names[cache = type.fullTypeName])
                {
                    types.push(cache);
                }

                type = type.superclass;
            }

            //class
            if (cache = this.__class_names)
            {
                var keys = cache.__keys;

                for (var i = 0, _ = keys.length; i < _; i++) //后置优先
                {
                    if (names[cache = "." + keys[i]])
                    {
                        types.push(cache);
                    }
                }
            }

            //id
            if ((cache = this.id) && (names[cache = "#" + cache]))
            {
                types.push(cache);
            }

            //重置样式
            this.__style_version = flyingon.__style_version;
            this.__styleSheets = Object.create(null);
            return this.__style_types = types;
        };



        //重置样式
        this.__fn_reset_style = function () {

            this.__style_version = 0;
            this.__style_types = null;
        };





        //已注册的样式表
        flyingon.styleSheets = function () {

            return style_sheets;
        };


        //重置样式表
        style_sheets.reset = function () {

            flyingon.clear_styleSheets();

            for (var name in style_sheets)
            {
                flyingon.defineStyle(name, style);
            }
        };


        //清除所有样式
        style_sheets.clear = function () {

            style_sheets = {};
            style_cache_list = {};
            style_type_names = {};

            flyingon.__style_version++;
        };



        //定义样式
        flyingon.defineStyle = function (selector, style, super_selector) {

            if (selector && style)
            {
                var cache;

                //处理继承
                if (super_selector && (cache = style_sheets[super_selector]))
                {
                    for (var name in cache)
                    {
                        if (!style[name])
                        {
                            style[name] = cache[name];
                        }
                    }
                }

                //缓存样式
                style_sheets[selector] = style;

                //解析选择器
                selector = flyingon.parse_selector(selector);

                if (selector.forks) //如果存在分支则拆分分支为独立选择器
                {
                    selector = split_selector(selector);

                    for (var i = selector.length - 1; i >= 0; i--)
                    {
                        handle_style(selector[i], style);
                    }
                }
                else
                {
                    handle_style(selector, style);
                }

                flyingon.__style_version++;
            }
        };



        //拆分有分支的选择器为多个独立选择器
        function split_selector(selector) {

            var result = [],                    //结果集
                forks = selector.forks,         //分支位置集合
                fill = 1,                       //每一轮的填充个数(从后到前逐级递增)
                total = 1;                      //总数

            //计算总结果数
            for (var i = forks.length - 1; i >= 0; i--)
            {
                total *= selector[forks[i]].length;
            }

            result.length = total;

            //先全部复制选择器内容
            for (var i = 0; i < total; i++)
            {
                result[i] = selector.slice(0);
            }

            //再从后到前替换每个分支子项
            for (var i = forks.length - 1; i >= 0; i--)
            {
                var index = forks[i],            //目标位置
                    nodes = selector[index],     //当前分支节点
                    length = nodes.length,
                    j = 0;                       //填充位置

                while (j < total)
                {
                    for (var j1 = 0; j1 < length; j1++)
                    {
                        var node = nodes[j1];

                        for (var j2 = 0; j2 < fill; j2++)
                        {
                            result[j++][index] = node;
                        }
                    }
                }

                fill *= length;
            }

            return result;
        };



        //处理样式 按样式属性名存储 再根据
        function handle_style(selector, style) {

            var type = selector[selector.length - 1],
                value;

            //以最后一个节点的 token + name 作为样式类别并缓存样式类别名 (伪元素以*作为样式类别名)
            style_type_names[type = type.token !== ":" ? type.token + type.name : "*"] = true;

            //以字符串作为选择器key(不包含属性值)
            selector.key = selector.join("");

            for (var name in style)
            {
                if (value = style[name]) //未注册的属性及未设置样式值则不处理
                {
                    name = name.replace(convert_name_regex, function (_, x) {

                        return x.toUpperCase();
                    });

                    //复合样式进行拆分 然后丢弃
                    if (name in style_split_fn)
                    {
                        var values = {};
                        style_split_fn[name].call(values, value);

                        for (var key in values)
                        {
                            if (value = values[key])
                            {
                                store_style(selector, type, key, value);
                            }
                        }
                    }
                    else
                    {
                        store_style(selector, type, name, value);
                    }
                }
            }
        };


        //缓存样式
        function store_style(selector, type, name, value) {

            var weight = selector.weight || selector_weight(selector), //当前权重
                cache_name = style_cache_list[name],
                cache_type;

            //类型转换
            if (cache_type = style_data_type[name])
            {
                switch (cache_type)
                {
                    case "boolean": //布尔型
                        value = !!value;
                        break;

                    case "integer": //整数
                        value = parseInt(value);
                        break;

                    case "number": //小数
                        value = +value || 0;
                        break;

                    case "string": //字符串
                        value = value ? "" + value : "";
                        break;
                }
            }

            if (cache_name) //已有属性
            {
                if (cache_type = cache_name[type])
                {
                    while ((cache_name = cache_type[weight]) && cache_name[0].key !== selector.key) //如果选择器相等则后置优先
                    {
                        weight++;
                    }

                    cache_type[weight] = [selector, value];
                    delete cache_type.__names;
                }
                else
                {
                    (cache_name[type] = {})[weight] = [selector, value];
                }
            }
            else
            {
                ((style_cache_list[name] = {})[type] = {})[weight] = [selector, value];
            }
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
        function selector_weight(selector) {

            var result = 0;

            for (var i = selector.length - 1; i >= 0; i--)
            {
                var node = selector[i];

                switch (node.token)
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

                    case ":": //伪元素
                        result += 10;
                        break;
                }

                for (var j = 0, _ = node.length; j < _; j++)
                {
                    result += pseudo_keys[node[j].name] || 10;
                }
            }

            return selector.weight = result << 8; //左移8个字节以留足中间插入的空间(即中间最多可插入256个元素)
        };




        //查询方法
        //注: ","组合类型已被拆分,此处不处理
        (function (pseudo_fn) {



            //未知伪元素检查函数
            function pseudo_unkown(node, target) {

            };


            //样式检测 检测指定对象是否符合当前选择器
            function check_node(selector, index, target) {

                var node = selector[index];

                switch (node.token)
                {
                    case "":  //类型
                        if (target.__fullTypeName !== node.name)
                        {
                            return false;
                        }
                        break;

                    case ".": //class
                        if (!target.className || !target.className[node.name])
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
                        if ((target = (pseudo_fn[node.name] || pseudo_unkown)(node, target)) === undefined)
                        {
                            return false;
                        }
                        break;
                }

                //再检测属性及伪类(不包含伪元素)
                var length = node.length;

                if (length > 0)
                {
                    for (var i = 0; i < length; i++)
                    {
                        if (node[i].check(target) === false)
                        {
                            return false;
                        }
                    }
                }

                //继续检测上一节点
                if (index > 0 && style_type_fn[node.type](selector, index - 1, target) === false)
                {
                    return false;
                }

                return true;
            };



            this[" "] = function (selector, index, target) {

                var parent = target.__parent;

                while (parent)
                {
                    if (check_node(selector, index, parent))
                    {
                        return true;
                    }

                    parent = parent.__parent;
                }

                return false;
            };

            this[">"] = function (selector, index, target) {

                var parent = target.__parent;
                return parent ? check_node(selector, index, parent) : false;
            };

            this["+"] = function (selector, index, target) {

                var parent = target.__parent;

                if (parent)
                {
                    var children = parent.__children,
                        i = children.indexOf(target);

                    if (i > 0)
                    {
                        return check_node(selector, index, children[--i]);
                    }
                }

                return false;
            };

            this["~"] = function (selector, index, target) {

                var parent = target.__parent;

                if (parent)
                {
                    var children = parent.__children,
                        i = children.indexOf(target);

                    while (i-- > 0)
                    {
                        if (check_node(selector, index, children[i]))
                        {
                            return true;
                        }
                    }
                }

                return false;
            };




            pseudo_fn["before"] = function (node, target) {

                var parent = target.__parent;

                if (parent)
                {
                    var children = parent.__children,
                        index;

                    if (children.length > (index = children.indexOf(this)) + 1)
                    {
                        return children[++index];
                    }
                }
            };

            pseudo_fn["after"] = function (node, target) {

                var parent = target.__parent, index;

                if (parent)
                {
                    var children = parent.__children,
                        index;

                    if ((index = children.indexOf(this)) > 0)
                    {
                        return children[--index];
                    }
                }
            };

            pseudo_fn["first-child"] = pseudo_fn["first-of-type"] = function (node, target) {

                var parent = target.__parent;

                if (parent)
                {
                    var children = parent.__children;

                    if (children[0] === target)
                    {
                        if (node.name.length === 11 || target.__fullTypeName === parent.__fullTypeName)
                        {
                            return parent;
                        }
                    }
                }
            };

            pseudo_fn["last-child"] = pseudo_fn["last-of-type"] = function (node, target) {

                var parent = target.__parent;

                if (parent)
                {
                    var children = parent.__children;

                    if (children[children.length - 1] === target)
                    {
                        if (node.name.length === 10 || target.__fullTypeName === parent.__fullTypeName)
                        {
                            return parent;
                        }
                    }
                }
            };

            pseudo_fn["only-child"] = pseudo_fn["only-of-type"] = function (node, target) {

                var parent = target.__parent;

                if (parent)
                {
                    var children = parent.__children;

                    if (children.length === 1)
                    {
                        if (node.name.length === 10 || target.__fullTypeName === parent.__fullTypeName)
                        {
                            return parent;
                        }
                    }
                }
            };

            pseudo_fn["nth-child"] = pseudo_fn["nth-of-type"] = function (node, target) {

                var parent = target.__parent;

                if (parent)
                {
                    var children = parent.__children;

                    if (children[+node.parameters[0]] === target)
                    {
                        if (node.name.length === 9 || target.__fullTypeName === parent.__fullTypeName)
                        {
                            return parent;
                        }
                    }
                }
            };

            pseudo_fn["nth-last-child"] = pseudo_fn["nth-last-of-type"] = function (node, target) {

                var parent = target.__parent;

                if (parent)
                {
                    var children = parent.__children;

                    if (children[children.length - node.parameters[0]] === target)
                    {
                        if (node.name.length === 14 || target.__fullTypeName === parent.__fullTypeName)
                        {
                            return parent;
                        }
                    }
                }
            };


        }).call(style_type_fn, style_pseudo_fn);




    }).call(this, flyingon);




    //滚动条
    (function (flyingon) {



        this.__event_mousewheel = function (event) {

            var vscroll = this.__vscroll_bar;

            if (vscroll)
            {
                vscroll.value += event.wheelDelta > 0 ? -20 : 20;

                event.stopPropagation();
                event.preventDefault();
            }
        };



        //是否需重新处理滚动条
        this.__scroll_dirty = false;



        //标记水平滚动条
        this.__fn_sign_hscroll = function (box, rtl) {

            var hscroll = this.__hscroll_bar || (this.__hscroll_bar = this.__hscroll_cache || new flyingon.ScrollBar(this));

            hscroll.__rtl = rtl; //不支持单独设置rtl

            this.clientHeight = this.controlHeight - box.control_spaceY - (+hscroll.height || 16);
            this.__scroll_dirty = true;
        };

        //标记竖直滚动条
        this.__fn_sign_vscroll = function (box, rtl) {

            var vscroll = this.__vscroll_bar || (this.__vscroll_bar = this.__vscroll_cache || new flyingon.ScrollBar(this, true)),
                thickness = +vscroll.width || 16;

            if (vscroll.__rtl = rtl) //滚动条在左边
            {
                this.clientX = box.clientX + thickness;
            }
            else
            {
                this.clientX = box.clientX;
            }

            this.clientWidth = this.controlWidth - box.control_spaceX - thickness;
            this.__scroll_dirty = true;
        };


        //测量滚动条 需先进行标记
        this.__fn_measure_scroll = function (box) {

            var hscroll = this.__hscroll_bar,
                vscroll = this.__vscroll_bar,
                thickness1 = hscroll && +hscroll.height || 16,
                thickness2 = vscroll && +vscroll.width || 16,
                x,
                y,
                width = this.controlWidth,
                height = this.controlHeight;

            //有水平滚动条
            if (hscroll)
            {
                hscroll.maxValue = this.contentWidth - this.clientWidth;
                hscroll.measure(width - box.border_spaceX - (vscroll ? thickness2 : 0), thickness1, 1, 1);
                hscroll.locate(
                    vscroll && vscroll.__rtl ? box.border_left + thickness2 : box.border_left,
                    y = this.controlHeight - box.border_bottom - thickness1);

                this.contentX = hscroll.__rtl ? hscroll.maxValue - hscroll.value : hscroll.value;
            }

            //有竖直滚动条
            if (vscroll)
            {
                vscroll.maxValue = this.contentHeight - this.clientHeight;
                vscroll.measure(thickness2, height - box.border_spaceY - (hscroll ? thickness1 : 0), 1, 1);
                vscroll.locate(
                    x = vscroll && vscroll.__rtl ? box.border_left : width - box.border_right - thickness2,
                    box.border_top);

                this.contentY = vscroll.value;
            }

            //有双滚动条时生成拐角
            if (hscroll && vscroll)
            {
                var corner = this.__scroll_corner || (this.__scroll_corner = new flyingon.ScrollCorner(this));

                corner.measure(thickness2, thickness1, 1, 1);
                corner.locate(x, y);
            }

            this.__scroll_dirty = false;
        };



    }).call(this, flyingon);




    //盒模型
    (function (flyingon) {


        var round = Math.round,
            parse = parseFloat;


        //控件大小(含边框及滚动条)
        this.controlX = 0;   //相对父控件客户区左上角偏移
        this.controlY = 0;   //相对父控件客户区左上角偏移
        this.controlWidth = 0;
        this.controlHeight = 0;

        //客户区(不含内边距及滚动条)
        this.clientX = 0;     //相对控件左上角偏移
        this.clientY = 0;     //相对控件左上角偏移
        this.clientWidth = 0;
        this.clientHeight = 0;

        //内容区(实际内容大小及开始渲染位置)
        this.contentX = 0;
        this.contentY = 0;
        this.contentWidth = 0;
        this.contentHeight = 0;


        //添加右下属性
        ["control", "client"].forEach(function (name) {

            flyingon.defineProperty(this, name + "Right", new Function("return this." + name + "X + this." + name + "Width;"));
            flyingon.defineProperty(this, name + "Bottom", new Function("return this." + name + "Y + this." + name + "Height;"));

        }, this);


        //是否需要重新布局
        this.__arrange_dirty = true;

        //是否需要重绘
        this.__current_dirty = false;

        //子控件是否需要重绘
        this.__children_dirty = false;

        //父控件是否需要重绘
        this.__update_parent = false;




        //计算盒模型样式
        this.__fn_box_style = function (margin_x, margin_y) {

            var box = Object.create(null),
                width = box.border_width = this.borderWidth;

            box.margin_spaceX = (box.margin_left = this.marginLeft) + (box.margin_right = this.marginRight);
            box.margin_spaceY = (box.margin_top = this.marginTop) + (box.margin_bottom = this.marginBottom);

            box.border_spaceX = (box.border_left = this.borderLeft ? width : 0) + (box.border_right = this.borderRight ? width : 0);
            box.border_spaceY = (box.border_top = this.borderTop ? width : 0) + (box.border_bottom = this.borderBottom ? width : 0);

            box.padding_spaceX = (box.padding_left = this.paddingLeft) + (box.padding_right = this.paddingRight);
            box.padding_spaceY = (box.padding_top = this.paddingTop) + (box.padding_bottom = this.paddingBottom);

            box.control_spaceX = box.border_spaceX + box.padding_spaceX;
            box.control_spaceY = box.border_spaceY + box.padding_spaceY;

            if (width > 0)
            {
                if (box.border_top === box.border_right &&
                    box.border_bottom === box.border_left &&
                    box.border_right === box.border_bottom) //四条边相等
                {
                    if (box.border_top === 0) //4条边都为0
                    {
                        box.border_width = width = 0;
                    }
                    else
                    {
                        box.border_same = true; //标记4条边相等
                    }
                }
            }

            //处理圆角边框
            box.border_radius = width <= 0 || (box.border_top <= 0 && box.border_bottom <= 0) ? 0 : this.borderRadius;

            //计算内部区及客户区位置
            this.clientX = box.clientX = box.border_left + box.padding_left;
            this.clientY = box.clientY = box.border_top + box.padding_top;

            //缓存最大最小值
            box.minWidth = this.minWidth;
            box.minHeight = this.minHeight;

            if ((box.maxWidth = this.maxWidth) <= 0)
            {
                box.maxWidth = 99999999;
            }

            if ((box.maxHeight = this.maxHeight) <= 0)
            {
                box.maxHeight = 99999999;
            }

            //创建临时内部变量并返回
            return this.__box_style = box;
        };


        //测量大小
        //usable_width              可用宽度 整数值
        //usable_height             可用高度 整数值
        //auto_width_to_fill        当宽度为auto时是否充满可用空间 true|false || 1|0
        //auto_height_to_fill       当高度为auto时是否充满可用空间 true|false || 1|0
        //less_width_to_default     当宽度不足时是否使用默认宽度 true|false || 1|0
        //less_height_to_default    当高度不足时是否使用默认高度 true|false || 1|0
        //返回最大占用宽度及高度
        this.measure = function (usable_width, usable_height, auto_width_to_fill, auto_height_to_fill, less_width_to_default, less_height_to_default) {

            var box = this.__fn_box_style(),

                auto_width = false,
                auto_height = false,

                width,
                height,

                value,
                cache;

            //处理宽度
            if ((value = +(cache = this.width)) >= 0) //固定大小
            {
                width = value;
            }
            else
            {
                switch (cache)
                {
                    case "auto": //默认
                        if (auto_width_to_fill)
                        {
                            cache = true;
                        }
                        else
                        {
                            width = this.__defaults.width;
                        }
                        break;

                    case "fill": //充满可用区域
                        cache = true;
                        break;

                    case "content": //根据内容自动调整大小
                        auto_width = true;
                        cache = true;
                        break;

                    default:  //百分比
                        width = this.__parent && round(this.__parent.clientWidth * parse(cache) / 100) || 0;
                        break;
                }

                //充满可用宽度
                if (cache === true)
                {
                    if ((usable_width -= box.margin_spaceX) > box.control_spaceX) //至少可以显示边框及内边距
                    {
                        width = usable_width;
                    }
                    else if (less_width_to_default) //可用空间不足时使用默认宽度
                    {
                        width = this.__defaults.width;
                    }
                    else //有多少用多少
                    {
                        width = usable_width > 0 ? usable_width : 0;
                    }
                }
            }

            //处理最小及最大宽度
            if (width < box.minWidth)
            {
                width = box.minWidth;
            }
            else if (width > box.maxWidth)
            {
                width = box.maxWidth;
            }

            //计算客户区宽度
            if ((width = (this.controlWidth = width) - box.control_spaceX) < 0)
            {
                width = 0;
            };

            //处理高度
            if ((value = +(cache = this.height)) >= 0) //固定大小
            {
                height = value;
            }
            else
            {
                switch (cache)
                {
                    case "auto": //自动
                        if (auto_height_to_fill)
                        {
                            cache = true;
                        }
                        else
                        {
                            height = this.__defaults.height;
                        }
                        break;

                    case "fill": //充满可用区域
                        cache = true;
                        break;

                    case "content": //根据内容自动调整大小
                        auto_height = true;
                        cache = true;
                        break;

                    default:  //百分比
                        height = this.__parent && round(this.__parent.clientHeight * parse(cache) / 100) || 0;
                        break;
                }

                //充满可用高度
                if (cache === true)
                {
                    if ((usable_height -= box.margin_spaceY) > box.control_spaceY) //至少可以显示边框及内边距
                    {
                        height = usable_height;
                    }
                    else if (less_height_to_default) //可用空间不足时使用默认高度
                    {
                        height = this.__defaults.height;
                    }
                    else //有多少用多少
                    {
                        height = usable_height > 0 ? usable_height : 0;
                    }
                }
            }

            //处理最小及最大宽度
            if (height < box.minHeight)
            {
                height = box.minHeight;
            }
            else if (height > box.maxHeight)
            {
                height = box.maxHeight;
            }

            //计算客户区高度
            if ((height = (this.controlHeight = height) - box.control_spaceY) < 0)
            {
                height = 0;
            }

            //处理自动宽高
            if (auto_width || auto_height)
            {
                this.__fn_measure_auto(auto_width ? width : 0, auto_height ? height : 0);

                //重计算宽度
                if (width !== (cache = this.contentWidth))
                {
                    if ((cache += box.control_spaceX) < box.minWidth)
                    {
                        width = (this.controlWidth = box.minWidth) - box.control_spaceX;
                    }
                    else if (cache > box.maxWidth)
                    {
                        width = (this.controlWidth = box.maxWidth) - box.control_spaceX;
                    }
                    else
                    {
                        this.controlWidth = (width = cache) + box.control_spaceX;
                    }
                }

                //重计算高度
                if (height !== (cache = this.contentHeight))
                {
                    if ((cache += box.control_spaceY) < box.minHeight)
                    {
                        height = (this.controlHeight = box.minHeight) - box.control_spaceY;
                    }
                    else if (cache > box.maxHeight)
                    {
                        height = (this.controlHeight = box.maxHeight) - box.control_spaceY;
                    }
                    else
                    {
                        this.controlHeight = (height = cache) + box.control_spaceY;
                    }
                }
            }

            //设置客户区域大小 客户区变化时才会请求重新排列
            if (this.clientWidth !== width || this.clientHeight !== height)
            {
                this.clientWidth = width;
                this.clientHeight = height;

                this.__arrange_dirty = true;
            }

            //返回布局大小
            return { width: this.controlWidth + box.margin_spaceX, height: this.controlHeight + box.margin_spaceY };
        };


        //测量自动宽高
        //maxWidth:     最大可用宽度 0表示无限大
        //maxHeight:    最大可用高度 0表示无限大
        this.__fn_measure_auto = function (maxWidth, maxHeight) {

            this.__fn_arrange();
        };


        //设置控件位置(需先调用measure才可调用此方法)
        //x             起始x坐标
        //y             起始y坐标
        //align_width   对齐宽度 大于0则按此宽度分派空间并对齐
        //align_height  对齐高度 大于0则按此高度分派空间并对齐
        //返回控件最大占位坐标
        this.locate = function (x, y, align_width, align_height) {

            var box = this.__box_style,
                width = this.controlWidth + box.margin_spaceX,
                height = this.controlHeight + box.margin_spaceY,
                cache;

            if (align_width > 0 && (cache = align_width - width))
            {
                switch (this.alignX)
                {
                    case "center":
                        x += cache >> 1;
                        break;

                    case "right":
                        x += cache;
                        break;
                }
            }

            if (align_height > 0 && (cache = align_height - height))
            {
                switch (this.alignY)
                {
                    case "middle":
                        y += cache >> 1;
                        break;

                    case "bottom":
                        y += cache;
                        break;
                }
            }

            return {

                x: (this.controlX = box.margin_left + x + this.offsetX) + width + this.marginRight,
                y: (this.controlY = box.margin_top + y + this.offsetY) + height + this.marginBottom
            }
        };


        //排列子控件
        this.__fn_arrange = function () {

            var box = this.__box_style,
                overflowX = this.overflowX,
                overflowY = this.overflowY,
                rtl = this.direction === "rtl",
                repeat = false;

            //处理横向滚动条
            if (overflowX === "scroll")
            {
                this.__fn_sign_hscroll(box, rtl);
            }
            else if (this.__hscroll_bar) //如果存在滚动条则重算客户区
            {
                this.clientHeight = this.controlHeight - box.control_spaceY;
            }

            //处理纵向滚动条
            if (overflowY === "scroll")
            {
                this.__fn_sign_vscroll(box, rtl);
            }
            else if (this.__vscroll_bar) //如果存在滚动条则重算客户区
            {
                this.clientX = box.clientX;
                this.clientWidth = this.controlWidth - box.control_spaceX;
            }

            //初始化内容区
            this.contentWidth = this.clientWidth;
            this.contentHeight = this.clientHeight;

            //排列 overflow === "auto" 时先按没有滚动条的方式排列
            this.arrange();

            //处理水平方向自动滚动
            if (this.contentWidth > this.clientWidth && overflowX === "auto")
            {
                this.__fn_sign_hscroll(box, rtl);
                repeat = true;
            }
            else if (this.__hscroll_bar) //如果存在滚动条则隐藏
            {
                this.__hscroll_bar.value = 0;
                this.__hscroll_cache = this.__hscroll_bar;
                this.__hscroll_bar = null;

                this.contentX = 0;
            }

            //处理竖直方向自动滚动
            if (this.contentHeight > this.clientHeight && overflowY === "auto")
            {
                this.__fn_sign_vscroll(box, rtl);
                repeat = true;
            }
            else if (this.__vscroll_bar) //如果存在滚动条则隐藏
            {
                this.__vscroll_bar.value = 0;
                this.__vscroll_cache = this.__vscroll_bar;
                this.__vscroll_bar = null;

                this.contentY = 0;
            }

            //重新排列
            if (repeat)
            {
                this.arrange();
            }

            //测量滚动条
            if (this.__scroll_dirty)
            {
                this.__fn_measure_scroll(box);
            }

            //执行rtl变换
            if (rtl && this.__children)
            {
                this.__fn_arrange_rtl(this.__children);
            }

            this.__arrange_dirty = false;
        };


        //默认使用线性布局, Panel控件才支持自定义布局
        var layout_line = flyingon.layouts["line"];

        //默认排列方法
        this.arrange = function () {

            var items = this.__children;

            if (items && items.length > 0)
            {
                layout_line.call(this, items);
            }
        };


        //rtl排列变换
        this.__fn_arrange_rtl = function (items) {

            if (this.vertical)
            {
                this.__fn_arrange_x(items);
            }
            else
            {
                this.__fn_arrange_y(items);
            }
        };

        //沿x中心轴进行排列变换
        this.__fn_arrange_x = function (items) {

            var height, item;

            if ((height = this.contentHeight) < this.clientHeight)
            {
                height = this.clientHeight;
            }

            for (var i = 0, _ = items.length; i < _; i++)
            {
                (item = items[i]).controlY = height - item.controlY - item.controlHeight;
            }
        };

        //沿y中心轴进行排列变换
        this.__fn_arrange_y = function (items) {

            var width, item;

            if ((width = this.contentWidth) < this.clientWidth)
            {
                width = this.clientWidth;
            }

            for (var i = 0, _ = items.length; i < _; i++)
            {
                (item = items[i]).controlX = width - item.controlX - item.controlWidth;
            }
        };

        //沿坐标原点进行排列变换
        this.__fn_arrange_origin = function (items) {

            var width, height, item;

            if ((width = this.contentWidth) < this.clientWidth)
            {
                width = this.clientWidth;
            }

            if ((height = this.contentHeight) < this.clientHeight)
            {
                height = this.clientHeight;
            }

            for (var i = 0, _ = items.length; i < _; i++)
            {
                item = items[i];
                item.controlX = width - item.controlX - item.controlWidth;
                item.controlY = height - item.controlY - item.controlHeight;
            }
        };




        //移动指定距离
        this.moveBy = function (x, y) {

            this.controlX += x;
            this.controlY += y;

            (this.__parent || this).invalidate(false);
        };

        //移动到指定坐标
        this.moveTo = function (x, y) {

            this.controlX = x;
            this.controlY = y;

            (this.__parent || this).invalidate(false);
        };

        //滚动指定距离
        this.scrollBy = function (x, y) {

            this.scrollTo(this.contentX + x, this.contentY + y);
        };

        //滚动到指定坐标
        this.scrollTo = function (x, y) {

            this.contentX = x || 0;
            this.contentY = y || 0;

            this.invalidate(false, true);
        };





        //子控件功能扩展
        flyingon.children_extender = function (base) {




        };




        //查找指定位置的可视控件
        //注: 非可见控件不能命中
        this.fintAt = function (x, y) {

            x -= this.controlX;
            y -= this.controlY;

            if (this.__hscroll_bar && this.__hscroll_bar.hitTest(x, y))
            {
                return this.__hscroll_bar.fintAt(x, y);
            }

            if (this.__vscroll_bar && this.__vscroll_bar.hitTest(x, y))
            {
                return this.__vscroll_bar.fintAt(x, y);
            }

            var items = this.__visible_items, item;

            if (items && items.length > 0)
            {
                x += this.contentX - this.clientX;
                y += this.contentY - this.clientY;

                //if (this.transform)
                //{

                //}

                for (var i = 0, _ = items.length; i < _ ; i++)
                {
                    if ((item = items[i]).hitTest(x, y))
                    {
                        return item.fintAt(x, y);
                    }
                }
            }

            return this;
        };


        //命中测试
        //注: 非可见控件不能命中
        this.hitTest = function (x, y) {

            return (x -= this.controlX) >= 0 && x <= this.controlWidth && (y -= this.controlY) >= 0 && y <= this.controlHeight;
        };








        /**********************************坐标说明**********************************/

        //canvas:  画布坐标 相对画布左上角偏移坐标(不受滚动条影响)
        //window:  窗口坐标 相对窗口左上角偏移坐标(受滚动条影响)
        //contol:  控件坐标 相对父控件内容区左上角偏移坐标(受滚动条影响)

        /****************************************************************************/



        //获取所有父控件偏移值
        function offset_fn(target, offset, scroll) {

            var parent,
                x = 0,
                y = 0;

            while (parent = target.__parent)
            {
                //计算滚动
                if (scroll)
                {
                    x += parent.contentX;
                    y += parent.contentY;
                }

                //计算偏移
                if (offset)
                {
                    x += parent.controlX;
                    y += parent.controlY;

                    if (!target.__additions)  //附加型控件(如滚动条)不在客户区内
                    {
                        x += parent.clientX;
                        y += parent.clientY;
                    }
                }

                target = parent;
            }

            return { x: x, y: y }
        };


        //控件坐标转画布坐标
        this.control_to_canvas = function (x, y) {

            var offset = offset_fn(this, true, false);
            return { x: x + offset.x + this.controlX, y: y + offset.y + this.controlY };
        };

        //控件坐标转窗口坐标
        this.control_to_window = function (x, y) {

            var offset = offset_fn(this, true, true);
            return { x: x + offset.x + this.controlX, y: y + offset.y + this.controlY };
        };


        //画布坐标转控件坐标
        this.canvas_to_control = function (x, y) {

            var offset = offset_fn(this, true, false);
            return { x: x - offset.x - this.controlX, y: y - offset.y - this.controlY };
        };

        //画布坐标转窗口坐标
        this.canvas_to_window = function (x, y) {

            var offset = offset_fn(this, false, true);
            return { x: x + offset.x, y: y + offset.y };
        };


        //窗口坐标转画布坐标
        this.window_to_canvas = function (x, y) {

            var offset = offset_fn(this, false, true);
            return { x: x - offset.x, y: y - offset.y };
        };

        //窗口坐标转控件坐标
        this.window_to_control = function (x, y) {

            var offset = offset_fn(this, true, true);
            return { x: x - offset.x - this.controlX, y: y - offset.y - this.controlY };
        };



    }).call(this, flyingon);




    //事件
    (function (flyingon) {



        //是否可以拖动
        this.defineProperty("draggable", false);

        //是否可以接受拖放
        this.defineProperty("droppable", false);



        //值变更事件
        this.defineEvent("change");

        //定义鼠标事件
        this.defineEvents(["mousedown", "mousemove", "click", "dblclick", "mouseup", "mouseover", "mouseout", "mousewheel"]);

        //定义拖拉事件
        this.defineEvents(["dragstart", "drag", "dragend", "dragenter", "dragover", "dragleave", "drop"]);

        //定义键盘事件
        this.defineEvents(["keydown", "keypress", "keyup"]);

        //定义其它事件
        this.defineEvents(["focus", "blur", "validate"]);



    }).call(this, flyingon);




    //其它属性
    (function (flyingon) {



        //快捷键(按下alt+accesskey)
        this.defineProperty("accesskey", null);


        //是否可用
        this.defineProperty("enabled", true, {

            changed: "this.stateTo('disabled', !value);"
        });


        //是否可具有焦点
        this.defineProperty("focusable", true);


        //是否为焦点控件
        this.defineProperty("focused", function () {

            return this.ownerWindow && this.ownerWindow.__focused_control === this;
        });

        //是否为焦点控件或包含焦点控件
        this.defineProperty("containsFocused", function () {

            var focused = this.ownerWindow && this.ownerWindow.__focused_control;
            return focused && (focused === this || this.isParent(focused));
        });



    }).call(this, flyingon);




    //选择器
    (function (flyingon) {


        //查找控件 selector: css选择器样式字符串
        this.find = function (selector) {

            return new flyingon.Query(selector, this);
        };

        //查找指定id的子控件集合
        this.findById = function (id, cascade) {

            return new flyingon.Query(new flyingon.__element_node(cascade ? " " : ">", "#", id), this);
        };

        //查找指定名称的子控件集合
        this.findByName = function (name, cascade) {

            var node = new flyingon.__element_node(cascade ? " " : ">", "*"),
                property = new flyingon.__element_property("name");

            property.operator = "=";
            property.value = name;

            node.push(property);

            return new flyingon.Query(node, this);
        };

        //查找指定类型的子控件集合
        this.findByTypeName = function (fullTypeName, cascade) {

            return new flyingon.Query(new flyingon.__element_node(cascade ? " " : ">", "", fullTypeName), this);
        };

        //查找指定class的控件子控件集合
        this.findByClassName = function (className, cascade) {

            return new flyingon.Query(new flyingon.__element_node(cascade ? " " : ">", ".", className), this);
        };


    }).call(this, flyingon);




    //杂项
    (function (flyingon) {


        //模板
        this.defineProperty("template", null, {

            attributes: "rearrange",
            changed: "this.clearTemplate();",

            getter: function () {

                var template = this.__fields.template,
                    defaults;

                if (template && !(defaults = this.__defaults.template))
                {
                    return template;
                }

                return flyingon.templates[this.__fullTypeName] || defaults;
            }
        });

        //创建模板控件
        this.createTemplateControl = function (template, context) {

            var items = this.__children;

            if (items)
            {
                items.clear();
            }
            else
            {
                //子控件集合
                items = this.__children = new flyingon.ControlCollection(this);
            }

            var result = new flyingon.SerializeReader().deserialize(template, context || this);
            if (result)
            {
                items.append(result);

                result.__template = true;
                return result;
            }
        };

        //清除模板控件
        this.clearTemplate = function () {

            var items = this.__children;

            if (items && items.length > 0)
            {
                items.clear();
            }
        };




        //捕获鼠标
        this.setCapture = function () {

            var ownerWindow = this.ownerWindow;

            if (ownerWindow)
            {
                ownerWindow.__capture_control = this;
            }
        };

        //释放鼠标
        this.releaseCapture = function () {

            var ownerWindow = this.ownerWindow;

            if (ownerWindow)
            {
                ownerWindow.__capture_control = null;
            }
        };



        //执行验证
        this.validate = function () {

            return this.dispatchEvent("validate");
        };

        this.__fn_focus = function (event) {

            return this.focus();
        };

        this.__fn_blur = function () {

            return this.blur();
        };


        //设置当前控件为焦点控件
        //注:需此控件focusable为true时才可设为焦点控件
        this.focus = function () {

            if (this.focusable)
            {
                var ownerWindow = this.ownerWindow;

                if (ownerWindow && ownerWindow.__focused_control !== this)
                {
                    ownerWindow.__focused_control = this;

                    if (this.dispatchEvent("focus"))
                    {
                        this.stateTo("focus", true);
                    }
                }

                return true;
            }

            return false;
        };

        //此控件失去焦点
        this.blur = function () {

            var ownerWindow = this.ownerWindow;

            if (ownerWindow && ownerWindow.__focused_control === this)
            {
                ownerWindow.__focused_control = null;

                if (this.dispatchEvent("blur"))
                {
                    this.stateTo("focus", false);
                }

                return true;
            }

            return false;
        };




        //显示弹出控件
        this.show = function (x, y) {

            var ownerWindow = this.ownerWindow;

            if (ownerWindow)
            {
                var layer = ownerWindow.__popup_layer;

                if (!layer)
                {
                    layer = ownerWindow.__popup_layer = ownerWindow.appendLayer(9997);
                    layer.layoutType = "absolute";
                    layer.paint_background = function () { };
                }

                if (x != null)
                {
                    this.left = x;
                }

                if (y != null)
                {
                    this.top = y;
                }

                layer.__children.append(this);
                layer.invalidate(false);
            }
        };

        //关闭弹出控件
        this.close = function () {

            var ownerWindow = this.ownerWindow;

            if (ownerWindow)
            {
                ownerWindow.removeLayer(ownerWindow.__popup_layer);
            }
        };




        //自定义序列化
        this.serialize = function (writer) {



            base.serialize.call(this, writer);
        };

        //自定义反序列化
        this.deserialize = function (reader, data, excludes) {

            if (data.style)
            {
                excludes.style = true;

            }

            base.deserialize.call(reader, data, excludes);
        };




    }).call(this, flyingon);




    //绘图相关
    (function (flyingon) {



        //使区域无效
        //rearrange     是否需要重新排列
        //update_now    是否立即更新
        this.invalidate = function (rearrange, update_now) {

            var target = this,
                parent;

            if (rearrange)
            {
                target.__arrange_dirty = true;
            }

            target.__current_dirty = true;

            while (parent = target.__parent)
            {
                if (target.__update_parent)
                {
                    parent.__current_dirty = true;
                }
                else
                {
                    parent.__children_dirty = true;
                }

                target = parent;
            }

            if (target = this.__ownerLayer || this.ownerLayer)
            {
                target.__registry_update(update_now);
            }
        };


        //更新控件
        this.update = function () {

            this.invalidate(false, true);
        };




        //初始化边框坐标点
        function initialize_border(target, box) {

            //圆角处理
            if (box.border_radius > 0)
            {
                return initialize_border2(target, box);
            }

            //有4条非圆角边框则直接画矩形
            if (box.border_same)
            {
                var border = box.border_width,
                    offset = border >> 1;

                box.border_lines = [offset, offset, target.controlWidth - border, target.controlHeight - border];
            }
            else
            {
                //否则画线条
                initialize_border1(target, box);
            }

            //返回无需剪切标记
            return box.border_clip = true;
        };

        //初始化无圆角部分边框线
        function initialize_border1(target, box) {

            var lines = box.border_lines = [],  //边框线

                offset = box.border_width >> 1, //边框偏移(中线)

                width = target.controlWidth,
                height = target.controlHeight,

                border1 = box.border_top > 0,
                border2 = box.border_right > 0,
                border3 = box.border_bottom > 0,
                border4 = box.border_left > 0;

            //上边框
            if (border1)
            {
                lines.push(["moveTo", [box.border_same ? offset : 0, offset]]);
                lines.push(["lineTo", [border2 ? width - offset : width, offset]]);
            }
            else if (border2)
            {
                lines.push(["moveTo", [width - offset, 0]]);
            }

            //右边框
            if (border2)
            {
                lines.push(["lineTo", [width - offset, border3 ? height - offset : height]]);
            }
            else if (border3)
            {
                lines.push(["moveTo", [width, height - offset]]);
            }

            //下边框
            if (border3)
            {
                lines.push(["lineTo", [border4 ? offset : 0, height - offset]]);
            }
            else if (border4)
            {
                lines.push(["moveTo", [offset, height]]);
            }

            //左边框
            if (border4)
            {
                lines.push(["lineTo", [offset, border1 ? offset : 0]]);
            }
        };

        //初始化圆角边框
        function initialize_border2(target, box) {


            var lines = box.border_lines = [],

                thickness = box.border_width,
                offset = thickness >> 1,      //边框中线偏移

                width = target.controlWidth,
                height = target.controlHeight,
                right = width - offset,              //右边框中线坐标
                bottom = height - offset,            //下边框中线坐标

                border1 = box.border_top > 0,
                border2 = box.border_right > 0,
                border3 = box.border_bottom > 0,
                border4 = box.border_left > 0,

                radius = box.border_radius + offset;


            //生成绘制路径

            //上边框
            if (border1)
            {
                lines.push(["moveTo", [offset, radius]]);
                lines.push(["quadraticCurveTo", [offset, offset, radius, offset]]);
                lines.push(["lineTo", [width - radius, offset]]);
                lines.push(["quadraticCurveTo", [right, offset, right, radius]]);
            }
            else if (border2)
            {
                lines.push(["moveTo", [right, 0]]);
            }

            //右边框
            if (border2)
            {
                lines.push(["lineTo", [right, border3 ? height - radius : height]]);
            }
            else if (border3)
            {
                lines.push(["moveTo", [right, height - radius]]);
            }

            //下边框
            if (border3)
            {
                lines.push(["quadraticCurveTo", [right, bottom, width - radius, bottom]]);
                lines.push(["lineTo", [radius, bottom]]);
                lines.push(["quadraticCurveTo", [offset, bottom, offset, height - radius]]);
            }
            else if (border4)
            {
                lines.push(["moveTo", [offset, height]]);
            }

            //左边框
            if (border4)
            {
                if (box.border_same) //有4条边则关闭
                {
                    lines.push(["closePath"]);
                    box.border_same = false;
                }
                else
                {
                    lines.push(["lineTo", [offset, border1 ? radius : 0]]);
                }
            }


            //生成剪切路径
            var clip = box.border_clip = [];

            radius += offset;

            //上边框
            if (border1)
            {
                clip.push(["moveTo", [0, radius]]);
                clip.push(["quadraticCurveTo", [0, 0, radius, 0]]);
                clip.push(["lineTo", [width - radius, 0]]);
                clip.push(["quadraticCurveTo", [width, 0, width, radius]]);
            }
            else
            {
                clip.push(["moveTo", [0, 0]]);
                clip.push(["lineTo", [width, 0]]);
            }

            //右边框
            clip.push(["lineTo", [width, border3 ? height - radius : height]]);

            //下边框
            if (border3)
            {
                clip.push(["quadraticCurveTo", [width, height, width - radius, height]]);
                clip.push(["lineTo", [radius, height]]);
                clip.push(["quadraticCurveTo", [0, height, 0, height - radius]]);
            }
            else
            {
                clip.push(["lineTo", [0, height]]);
            }

            clip.push(["closePath"]);

            //返回需处理圆角矩形剪切标记
            return clip;
        };

        //绘制边框路径
        function border_path(context, lines) {

            for (var i = 0, _ = lines.length; i < _; i++)
            {
                var line = lines[i];
                context[line[0]].apply(context, line[1]);
            }
        };



        //渲染控件(包含排列及绘制)
        //注1:IE9在绘制时性能太差(比chrome差5到10倍) 暂时未找个原因(不知道是否与属性访问有关,或者与坐标变量或剪切有关,需要进一步测试)
        //注2:IE9绘制同样的字符可能线条粗细有不同(估计是IE本身的问题)
        //注3:oprea的字体渲染不够清晰(不知道是不是与字体设置有关, 需进一步测试)
        this.render = function (painter, clear) {

            var box = this.__box_style,
                context = painter.context,
                cache;

            //重新排列
            if (this.__arrange_dirty)
            {
                this.__fn_arrange();
            }

            //保存渲染环境
            context.save();

            //设置目标控件
            painter.target = this;

            //设置透明度
            this.__update_parent = (context.globalAlpha = this.opacity) < 1;

            //切换原点到当前控件左上角
            context.translate(this.controlX, this.controlY);

            //清除原有内容
            if (clear !== false)
            {
                context.clearRect(0, 0, this.controlWidth, this.controlHeight);
            }

            //裁剪防止内容超出边框区范围
            context.beginPath();

            if (box.border_width > 0 && (box.border_clip || initialize_border(this, box)) !== true)
            {
                border_path(context, box.border_clip);
            }
            else
            {
                context.rect(0, 0, this.controlWidth, this.controlHeight);
            }

            context.save();
            context.clip();

            //绘制背景
            this.paint_background(painter);

            //绘制内容
            this.paint(painter);

            //渲染子项
            if (this.__visible_items)
            {
                this.__fn_render_children(painter, false);
            }

            //回滚至剪切区域
            context.restore();

            //绘制滚动条
            if (cache = this.__hscroll_bar)
            {
                cache.render(painter, false);
            }

            if (this.__vscroll_bar)
            {
                this.__vscroll_bar.render(painter, false);

                if (cache && (cache = this.__scroll_corner))
                {
                    cache.render(painter, false);
                }
            }

            //绘制边框
            if (box.border_lines)
            {
                painter.strokeStyle = this.borderColor;

                //奇数宽度线要平移0.5像素以防止线条模糊
                //注意IE在进行0.5像素偏移绘制的时候性能很差,所以在偏移后绘制的内容越少越好,绘制完毕马上回退
                if ((context.lineWidth = box.border_width) & 1)
                {
                    context.translate(0.5, 0.5);
                }

                context.beginPath();

                if (box.border_same) //无圆角四条相同的边
                {
                    context.rect.apply(context, box.border_lines);
                }
                else
                {
                    border_path(context, box.border_lines);
                }

                if ((cache = this.borderStyle) != "solid")
                {
                    if (cache === "dashed")
                    {
                        painter.setLineDash([12, 4]);
                    }
                    else
                    {
                        painter.setLineDash([12, 4, 4, 4]);
                    }
                }

                context.stroke();
            }

            //修改状态
            this.__current_dirty = false;

            //回滚到绘制本控件前的状态
            context.restore();
        };


        //渲染或更新子控件
        this.__fn_render_children = function (painter, update) {

            var items = this.__visible_items,
                length = items.length;

            if (length > 0)
            {
                var context = painter.context;

                context.save();
                context.translate(this.clientX - this.contentX, this.clientY - this.contentY);

                if (update)
                {
                    for (var i = 0; i < length; i++)
                    {
                        var item = items[i];

                        if (item.__current_dirty) //如果需要更新
                        {
                            item.render(painter);
                        }
                        else if (item.__children_dirty) //如果子控件需要更新
                        {
                            item.__fn_render_children(painter, true);
                            item.__children_dirty = false;
                        }
                    }
                }
                else
                {
                    for (var i = 0; i < length; i++)
                    {
                        items[i].render(painter, false);
                    }
                }

                context.restore();
            }
        };



        ////绘制装饰
        //this.__fn_paint_decorates = function (context, decorates) {

        //    var reader;

        //    for (var i = 0, _ = decorates.length; i < _; i++)
        //    {
        //        var item = decorates[i];

        //        //未处理
        //        if (!(item instanceof flyingon.Shape))
        //        {
        //            item = decorates[i] = (reader || (reader = new flyingon.SerializeReader())).deserialize(item);
        //        }

        //        item.paint(context, this);
        //    }
        //};




        //绘制背景
        this.paint_background = function (painter) {

            var color = this.backgroundColor,
                image = this.backgroundImage,
                cache;

            if ((cache = (color !== "transparent")) || image)
            {
                var context = painter.context,
                    box = this.__box_style;

                context.beginPath();
                context.rect(box.border_left, box.border_top, this.controlWidth - box.border_spaceX, this.controlHeight - box.border_spaceY);

                if (cache)
                {
                    painter.fillStyle = color;
                    context.fill();
                }

                if (image)
                {

                }
            }
        };



        //绘制内框
        this.paint = function (painter) {

            var box = this.__box_style,
                width = this.controlWidth,
                height = this.controlHeight,
                context = painter.context;

            //context.translate(0.5, 0.5);
            //context.lineWidth = 1;
            //context.strokeStyle = "silver";
            //context.strokeRect(-box.margin_left, -box.margin_top - 1, width + box.margin_spaceX, height + box.margin_spaceY - 1);

            if (this.__fullTypeName === "Panel")
            {
                context.fillStyle = "green";
                context.fillRect(box.border_left, box.border_top, this.controlWidth - box.border_spaceX, this.controlHeight - box.border_spaceY);
            }

            //context.strokeStyle = "blue";
            //context.strokeRect(this.clientX, this.clientY, this.clientWidth - 1, this.clientHeight - 1);

            //context.translate(-0.5, -0.5);

            var text = this.uniqueId + ":" + this.controlX + "," + this.controlY + "," + width + "," + height;

            context.fillStyle = "black";
            context.textBaseline = "top";
            context.font = this.font;
            context.fillText(text, this.clientX, this.clientY);
        };


        //绘制文字
        this.paint_text = function (painter) {


        };



    }).call(this, flyingon);




}, true);
