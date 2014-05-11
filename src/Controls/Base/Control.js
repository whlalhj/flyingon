/// <reference path="../Base/Core.js" />


//控件基类
flyingon.defineClass("Control", flyingon.SerializableObject, function (Class, base, flyingon) {




    Class.create = function () {

        //唯一id
        this.__uniqueId = ++flyingon.__uniqueId;

        //盒模型
        this.__boxModel = new flyingon.BoxModel(this);
    };



    //子控件集合
    this.__children = null;


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
        this.__style_cache = null;    //清空样式缓存

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




    //主窗口
    this.defineProperty("mainWindow", function () {

        var ownerWindow = this.ownerWindow;
        return ownerWindow && ownerWindow.mainWindow;
    });

    //所属窗口
    this.defineProperty("ownerWindow", function () {

        var parent = this.__parent;
        return parent && parent.ownerWindow;
    });




    //动态方法定义
    (function () {


        //值变更事件
        this.defineEvent("change");


        this.__define_getter = function (name, attributes) {

            var body;

            if (attributes.style) // 样式属性
            {
                if (attributes.inherit)
                {
                    body = "var name = \"" + name + "\", parent = this.__parent, value;\n"
                        + "value = flyingon.__fn_style_value(this, name, parent != null);\n"
                        + "return value !== undefined ? value : parent[name];\n";
                }
                else
                {
                    body = "return flyingon.__fn_style_value(this, \"" + name + "\", false);";
                }
            }
            else
            {
                body = "return this.__fields." + name + ";"
            }

            return new Function(body);
        };

        this.__define_setter = function (name, attributes) {


            var body = [];


            body.push("var fields = this.__fields, cache;\n");

            body.push(this.__define_initializing(name, attributes));

            body.push("var oldValue = fields." + name + ";\n");


            if (attributes.changing)
            {
                body.push(attributes.changing);
                body.push("\n");
            }


            body.push("if (oldValue !== value)\n");
            body.push("{\n");

            body.push(this.__define_change(name));

            body.push("fields." + name + " = value;\n");
            body.push("var boxModel = this.__boxModel;\n");


            if (attributes.style) //更新样式缓存
            {
                body.push("if (cache = this.__style_cache) delete cache[name];\n");
            }


            if (attributes.changed) //自定义值变更代码
            {
                body.push(attributes.changed);
                body.push("\n");
            }

            if (attributes.complete) //自定义值变更结束代码
            {
                body.push(attributes.complete);
                body.push("\n");
            }


            body.push("if (cache = this.__bindings)\n");
            body.push("{\n");
            body.push("this.__fn_bindings(\"" + name + "\", cache);\n");
            body.push("}\n");


            //需要重新布局
            if (attributes.layout)
            {
                body.push("this.__fn_layout(boxModel);\n");
            }
            else if (attributes.measure) //需要重新测量
            {
                body.push("this.invalidate(true);\n");
            }
            else if (attributes.invalidate)  //需要重新绘制
            {
                body.push("this.invalidate(false);\n");
            }


            body.push("}\n");

            body.push("return this;");


            return new Function("value", body.join(""));
        };


    }).call(this);




    //class
    (function () {


        //id
        this.defineProperty("id", null, {

            attributes: "layout",
            changed: " this.__style_cache = null;" //清空样式缓存
        });


        //指定class名 与html一样
        this.defineProperty("className", null, {

            attributes: "layout|query",
            complete: "this.__fn_className(value);"
        });

        //处理className
        this.__fn_className = function (value) {

            var values, cache;

            if (value && (values = value.match(/\S+/g)))
            {
                var cache = this.__class = {};

                for (var i = values.length - 1; i >= 0; i--)
                {
                    if (!cache[value = values[i]])
                    {
                        cache[value] = true;
                    }
                }

                this.__fields.className = (cache.__names = Object.keys(cache)).join(" ");
            }
            else
            {
                this.__class = null;
                this.__fields.className = null;
            }


            this.__style_cache = null;  //清空样式缓存

            (this.__parent || this).__boxModel.invalidate(true);
        };

        //是否包含指定class
        this.hasClass = function (className) {

            return this.__class && this.__class(className);
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

            var data = this.__class;

            if (data && className && data[className])
            {
                delete data[className];
                this.className = Object.keys(data).join(" ");

                return true;
            }
        };

        //切换class 有则移除无则添加
        this.toggleClass = function (className) {

            var data = this.__class;

            if (data && className)
            {
                if (data[className])
                {
                    delete data[className];
                    this.className = Object.keys(data).join(" ");
                }
                else
                {
                    this.className += " " + className;
                }
            }
        };


    }).call(this);




    //盒模型及样式
    (function () {



        //清空样式
        this.clear_style_cache = function () {

            this.__style_cache = null;
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


            (this.states || (this.states = Object.create(null)))[name] = value;

            //清空缓存样式
            if (this.__style_cache)
            {
                this.__style_cache.__version = 0;
            }

            //检测是否有状态变更动画 有则播放 状态动画命名规则: 状态名 + "-animation"
            //var animation = flyingon.__fn_style_value(this, name + "-animation");

            //状态变更事件
            this.dispatchEvent(new flyingon.ChangeEvent("statechange", this, name, value));

            //样式变更可能需要重新定位
            (this.__parent || this).__boxModel.invalidate(true);
        };


        //获取状态图片(图片资源有命名规则要求) active -> hover -> checked -> common
        this.__fn_state_image = function (image, checked) {

            var states = this.__states,
                images = [];

            if (states)
            {
                if (states.activate)
                {
                    images.push(image + "-active");
                }

                if (states.hover)
                {
                    images.push(image + "-hover");
                }
            }

            if (checked)
            {
                images.push(image + "-checked");
            }

            images.push(image);

            return flyingon.get_image_any(images);
        };



        //盒式模型
        this.defineProperty("boxModel", function () {

            return this.__boxModel;
        });


        //控件左上角x及y坐标 仅绝对定位时有效
        this.defineProperties(["left", "top"], 0, "layout|style");

        //相对原来渲染位置的x及y偏移
        this.defineProperties(["offsetX", "offsetY"], 0, "layout|style");

        //控件宽度及高度 可选值: 数字|数字+"%"|"fill"|"auto"
        //数字: 固定大小
        //数字+"%":占客户区域百分比
        //fill: 充满可用区域
        //auto: 根据内容自动计算
        this.defineProperties(["width", "height"], 100, "layout|style");


        //是否显示
        //visible:  显示
        //hidden:   不显示但保留占位
        //collapsed:不显示也不占位
        this.defineProperty("visibility", "visible", "layout|style");

        //最小最大宽度 最小最大高度
        this.defineProperties(["minWidth", "maxWidth", "minHeight", "maxHeight"], 0, "layout|style");


        //对齐属性
        var attributes = {

            attributes: "layout|style",
            changing: "if (!(value instanceof flyingon.Align)) value = new flyingon.Align(value);"
        };

        //位置对齐方式
        //top:      顶部对齐
        //middle:   垂直居中对齐
        //bottom:   底部对齐
        //left:     左边对齐
        //center:   水平居中对齐
        //right:    右边对齐
        //可用逗号分隔同时设置水平及垂直对齐方式 如: "middle,center"
        this.defineProperty("align", new flyingon.Align(), attributes);

        //流式布局 auto:自动 inline:同行 newline:新行
        this.defineProperty("flow", "auto", "layout|style");

        //停靠方式
        //left:   左见枚举
        //top:    顶部见枚举
        //right:  右见枚举
        //bottom: 底部见枚举
        //fill:   充满
        this.defineProperty("dock", "left", "layout|style");


        attributes = {

            attributes: "layout|style",
            changing: "if (!(value instanceof flyingon.Thickness)) value = new flyingon.Thickness(value);"
        };

        this.defineProperty("margin", new flyingon.Thickness(), attributes);

        this.defineProperty("border", new flyingon.Thickness(), attributes);

        this.defineProperty("padding", new flyingon.Thickness(), attributes);

        this.defineProperty("borderRadius", 0, "measure|style");



        //背景色
        this.defineProperty("backgroundColor", null, "invalidate|style");

        //边框颜色
        this.defineProperty("borderColor", "black", "invalidate|style");

        //前景色
        this.defineProperty("color", "black", "invalidate|style");


        //透明度
        this.defineProperty("opacity", 1, "invalidate|style");

        //变换
        this.defineProperty("transform", null, "measure|style");

        //是否只绘制有效范围
        this.defineProperty("clipToBounds", true, "measure|style");


        /*********************************************/


        //鼠标样式
        this.defineProperty("cursor", "default", "invalidate|style");


        this.__fn_cursor = function (event) {

            return this.cursor || "default";
        };


        //装饰
        this.defineProperty("decorates", null, "invalidate|style");


    }).call(this);




    //其它属性
    (function () {



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



    }).call(this);




    //事件
    (function () {


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



    }).call(this);





    //选择器
    (function () {


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

            var element = new flyingon.__element_node(cascade ? " " : ">", "*"),
                property = new flyingon.__element_property("name");

            property.operator = "=";
            property.value = name;

            element.push(property);

            return new flyingon.Query(element, this);
        };

        //查找指定类型的子控件集合
        this.findByTypeName = function (fullTypeName, cascade) {

            return new flyingon.Query(new flyingon.__element_node(cascade ? " " : ">", "", fullTypeName), this);
        };

        //查找指定class的控件子控件集合
        this.findByClassName = function (className, cascade) {

            return new flyingon.Query(new flyingon.__element_node(cascade ? " " : ">", ".", className), this);
        };


    }).call(this);





    //位置相关
    (function () {

        /*
        测量控件大小
    
        usableWidth:        最大可用宽度
        usableHeight:       最大可用高度
        default_usable:     默认是否使用最大可用大小
        */
        this.measure = function (boxModel, usableWidth, usableHeight, default_usable) {

            this.__fn_measure.apply(this, arguments);
            boxModel.__measure = true;
        };

        //测量自动宽度
        this.measure_auto = function (boxModel, width_auto, height_auto) {

        };

        //内部测量方法
        this.__fn_measure = function (boxModel, usableWidth, usableHeight, default_usable) {


            var margin = boxModel.margin = flyingon.__fn_style_value(this, "__margin", false),
                border = boxModel.border = flyingon.__fn_style_value(this, "__border", false),
                padding = boxModel.padding = flyingon.__fn_style_value(this, "__padding", false),
                spaceX = boxModel.spaceX = margin.left + margin.right,
                spaceY = boxModel.spaceY = margin.top + margin.bottom,
                width = boxModel.width = this.width || 0,
                height = boxModel.height = this.height || 0;


            //自动宽高
            boxModel.auto_width = false;
            boxModel.auto_height = false;

            //盒模型定位
            boxModel.clientX = (boxModel.insideX = border.left) + padding.left;
            boxModel.clientY = (boxModel.insideY = border.top) + padding.top;

            //缓存背景
            boxModel.background = flyingon.__fn_style_value(this, "__background", false);


            //处理宽度
            if (width.constructor === String)
            {
                switch (width)
                {
                    case "default": //默认
                        boxModel.width = default_usable ? usableWidth - spaceX : this.__defaults.width;
                        break;

                    case "fill": //充满可用区域
                        if ((boxModel.width = usableWidth - spaceX) <= 0)
                        {
                            boxModel.width = this.__defaults.width;
                        }
                        break;

                    case "auto": //自动大小
                        boxModel.auto_width = true;
                        boxModel.width = usableWidth;

                        if ((boxModel.clientWidth = usableWidth - boxModel.clientX - border.right - padding.right) < 0)
                        {
                            boxModel.clientWidth = 0;
                        }
                        break;

                    default:  //固定或百分比
                        boxModel.width = flyingon.parseInt(width, boxModel.parent.clientRect.width);
                        break;
                }
            }


            //处理高度
            if (height.constructor === String)
            {
                switch (height)
                {
                    case "default": //默认
                        boxModel.height = default_usable ? usableHeight - spaceY : this.__defaults.height;
                        break;

                    case "fill": //充满可用区域
                        if ((boxModel.height = usableHeight - spaceY) <= 0)
                        {
                            boxModel.height = this.__defaults.height;
                        }
                        break;

                    case "auto": //自动大小
                        boxModel.auto_height = true;
                        boxModel.height = usableHeight;

                        if ((boxModel.clientHeight = usableHeight - boxModel.clientY - border.bottom - padding.bottom) < 0)
                        {
                            boxModel.clientHeight = 0;
                        }
                        break;

                    default:  //固定或百分比
                        boxModel.height = flyingon.parseInt(height, boxModel.parent.clientRect.height);
                        break;
                }
            }


            //处理自动宽高
            if (boxModel.auto_width || boxModel.auto_height)
            {
                this.measure_auto(boxModel, boxModel.auto_width, boxModel.auto_height);
            }


            //处理最小最大值
            if (boxModel.width < (width = this.minWidth))
            {
                boxModel.width = width;
            }
            else if (boxModel.width > (width = this.maxWidth))
            {
                boxModel.width = width;
            }

            if (boxModel.height < (height = this.minHeight))
            {
                boxModel.height = height;
            }
            else if (boxModel.height > (height = this.maxHeight))
            {
                boxModel.height = height;
            }


            //计算盒模型
            if ((boxModel.insideWidth = width - border.left - border.right) < 0)
            {
                boxModel.insideWidth = 0;
                boxModel.clientWidth = 0;
            }
            else if ((boxModel.clientWidth = boxModel.insideWidth - padding.left - padding.right) < 0)
            {
                boxModel.clientWidth = 0;
            }

            if ((boxModel.insideHeight = height - border.top - border.bottom) < 0)
            {
                boxModel.insideHeight = 0;
                boxModel.clientHeight = 0;
            }
            else if ((boxModel.clientHeight = boxModel.insideHeight - padding.top - padding.bottom) < 0)
            {
                boxModel.clientHeight = 0;
            }
        };

        //重新布局
        this.__fn_layout = function (boxModel) {

            var parent = boxModel.parent;

            if (parent)
            {
                while (parent.parent && (parent.auto_width || parent.auto_height)) //如果自动宽度需重新布局父控件
                {
                    parent = parent.parent;
                }

                parent.ownerControl.invalidate(true);
            }
            else
            {
                this.invalidate(true);
            }
        };





        //子控件扩展
        this.children_extender = function (Class, base) {


            Class.create = function () {


                //子控件集合
                this.__children = new flyingon.ControlCollection(this);

                //初始化子盒模型
                this.__boxModel.children = [];
            };


            this.measure = function (boxModel, usableWidth, usableHeight, default_usable) {

                this.__fn_measure.apply(this, arguments);

                if (boxModel.__measure)
                {
                    this.__fn_arrange(boxModel);
                }
            };


            this.__fn_arrange = function (boxModel) {

                boxModel.scrollWidth = boxModel.scrollHeight = 0;

                var writingMode = this.writingMode;

                this.arrange(boxModel, "tb".indexOf(writingMode[0]) >= 0);

                //处理阅读顺序进行坐标变换
                switch (writingMode)
                {
                    case "lr-tb": //不变换
                    case "tb-lr":
                        break;

                    case "bt-lr": //沿x轴变换
                    case "bt-rl":
                        boxModel.mirror_x();
                        break;

                    case "rl-tb": //沿y轴变换
                    case "rl-bt":
                        boxModel.mirror_y();
                        break;

                    case "lr-bt": //沿中心点变换
                    case "tb-rl":
                        boxModel.mirror_center();
                        break;
                }

                boxModel.__measure = false;
            };


            this.measure_auto = function (boxModel, width_auto, height_auto) {

                this.__fn_arrange(boxModel);

                if (width_auto)
                {
                    boxModel.width = boxModel.clientX + boxModel.scrollWidth + boxModel.border.right + boxModel.padding.right;
                }

                if (height_auto)
                {
                    boxModel.height = boxModel.clientY + boxModel.scrollHeight + boxModel.border.bottom + boxModel.padding.bottom;
                }

                boxModel.__measure = false;
            };

        };



        ////调整自动大小
        //this.adjustAutoSize = function (boxModel, auto_width, auto_height) {

        //    if (auto_width)
        //    {
        //        boxModel.width = boxModel.width - boxModel.clientRect.width;
        //    }
        //};


        //命中测试
        this.hitTest = function (x, y) {

            var box = this.__boxModel;
            return x >= box.x && y >= box.y && x <= box.right && y <= box.bottom;
        };






        /**********************************坐标说明**********************************/

        //offsetX, offsetY:  偏移坐标 相对目标窗口左上角的显示偏移距离(不受滚动条影响)
        //targetX, targetY:  目标坐标 相对目标控件左上角的物理偏移距离(不受滚动条影响)
        //windowX, windowY:  窗口坐标 相对目标窗口左上角的渲染偏移距离(受滚动条影响)
        //targetX, targetY:控件坐标 相对目标控件左上角的渲染偏移距离(受滚动条影响)

        /****************************************************************************/


        //偏移坐标转窗口坐标
        this.offsetToWindow = function (x, y) {

            return this.__boxModel.offsetToWindow(x, y);
        };

        //偏移坐标转目标坐标
        this.offsetToTarget = function (x, y) {

            return this.__boxModel.offsetToTarget(x, y);
        };

        //偏移坐标转控件坐标
        this.offsetToControl = function (x, y) {

            return this.__boxModel.offsetToControl(x, y);
        };


        //目标坐标转偏移坐标
        this.targetToOffset = function (x, y) {

            return this.__boxModel.targetToOffset(x, y);
        };

        //窗口坐标转偏移坐标
        this.windowToOffset = function (x, y) {

            return this.__boxModel.windowToOffset(x, y);
        };

        //控件坐标转偏移坐标
        this.controlToOffset = function (x, y) {

            return this.__boxModel.controlToOffset(x, y);
        };



    }).call(this);





    //杂项
    (function () {


        //模板
        this.defineProperty("template", null, {

            attributes: "measure",
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

                //初始化子盒模型
                this.__boxModel.children = [];
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
        this.showPopup = function (x, y) {

            var ownerWindow = this.ownerWindow;

            if (ownerWindow)
            {
                var layer = ownerWindow.__popup_layer;

                if (!layer)
                {
                    layer = ownerWindow.__popup_layer = ownerWindow.appendLayer(9997);
                    layer.layout = "absolute";
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
        this.closePopup = function () {

            var ownerWindow = this.ownerWindow;

            if (ownerWindow)
            {
                ownerWindow.removeLayer(ownerWindow.__popup_layer);
            }
        };



    }).call(this);





    //绘图相关
    (function () {


        //使区域无效
        this.invalidate = function (measure) {

            this.__boxModel.invalidate(measure, false);
        };


        //更新绘制控件
        this.update = function (measure) {

            this.__boxModel.invalidate(measure, true);
        };




        //绘制边框
        this.paint_border = function (context, boxModel) {

            var border = boxModel.border;

            if (border && border.border)
            {
                var color = this.borderColor;

                if (boxModel.borderRadius > 0)
                {
                    context.lineWidth = border.top;
                    context.set_strokeStyle(color);
                    context.strokeRoundRect(boxModel.windowX, boxModel.windowY, boxModel.width, boxModel.height, boxModel.borderRadius);
                }
                else
                {
                    context.set_fillStyle(color);
                    context.paint_border(boxModel.windowX, boxModel.windowY, boxModel.width, boxModel.height, border);
                }
            }

        };


        //绘制背景
        this.paint_background = function (context, boxModel) {

            var backgroundColor = this.backgroundColor;

            if (backgroundColor)
            {
                var r = boxModel.usableRect;

                context.beginPath();
                context.set_fillStyle(backgroundColor);

                if (boxModel.borderRadius > 0) //圆角矩形
                {
                    context.roundRect(r.windowX, r.windowY, r.width, r.height, boxModel.borderRadius);
                }
                else
                {
                    context.rect(r.windowX, r.windowY, r.width, r.height);
                }

                context.fill();

                return true;
            }
        };


        //绘制内框
        this.paint = function (context, boxModel) {

            this.paint_text(context, boxModel.clientRect);
        };


        //绘制文字
        this.paint_text = function (context, clientRect) {

            var textMetrics = this.__textMetrics,
                cache;

            if (textMetrics)
            {


                //区域剪切
                if (this.clipToBounds)
                {
                    context.save();

                    context.beginPath();
                    context.rect(clientRect.windowX, clientRect.windowY, clientRect.width, clientRect.height);
                    context.clip();
                }


                if (cache = this.paint_text_back)
                {
                    cache.call(this, context, clientRect, textMetrics);
                }


                context.fillStyle = this.color;
                context.font = textMetrics.font;


                var x = clientRect.windowX,
                    y = clientRect.windowY + textMetrics.height,
                    align = this.textAlign,
                    line = textMetrics[0];

                if (align)
                {
                    if (cache = clientRect.width - line.width)
                    {
                        switch (align.horizontal)
                        {
                            case "center":
                                x += cache >> 1;
                                break;

                            case "right":
                                x += cache;
                                break;
                        }
                    }

                    if (cache = clientRect.height - line.height)
                    {
                        switch (align.vertical)
                        {
                            case "middle":
                                y += cache >> 1;
                                break;

                            case "bottom":
                                y += cache;
                                break;
                        }
                    }
                }


                for (var j = 0, count = line.length; j < count; j++)
                {
                    var element = line[j];
                    context.fillText(element.text, x, y);

                    x += element.width;
                }

                if (this.clipToBounds)
                {
                    context.restore();
                }

                return true;
            }
        };


    }).call(this);




}, true);
