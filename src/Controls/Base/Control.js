/// <reference path="../Base/Core.js" />


//控件基类
flyingon.defineClass("Control", flyingon.SerializableObject, function (Class, base, flyingon) {




    Class.create = function () {

        //唯一id
        this.__uniqueId__ = ++flyingon.__uniqueId__;

        //盒模型
        this.__boxModel__ = new flyingon.BoxModel(this);
    };




    //引用序列化标记(为true时只序列化名称不序列化内容)
    this.serialize_reference = true;



    //父控件
    this.defineProperty("parent", null, {

        getter: function () {

            return this.__parent__;
        },

        setter: function (value) {

            var oldValue = this.__parent__;

            if (value != oldValue)
            {
                if (oldValue)
                {
                    oldValue.__children__.remove(this);
                }

                if (value)
                {
                    value.__children__.add(this);
                }
            }

            return this;
        }
    });


    //触发父控件变更
    this.__fn_parent__ = function (parent) {

        this.__parent__ = parent;
        this.__style_group__ = null;  //清空缓存的样式组
        this.dispatchEvent(new flyingon.PropertyChangeEvent(this, "parent", parent, this.__parent__));
    };

    //当前控件是否指定控件的父控件
    this.isParent = function (control) {

        if (!control || control == this)
        {
            return false;
        }

        var target = control.__parent__;

        while (target)
        {
            if (target == this)
            {
                return true;
            }

            target = target.__parent__;
        }

        return false;
    };

    //指定控件是否当前控件的父控件
    this.isParentTo = function (control) {

        return control ? control.isParent(this) : false;
    };


    //子索引号
    this.defineProperty("childIndex", function () {

        var cache = this.__parent__;
        return (cache && (cache = cache.__children__) && cache.indexOf(this)) || -1;
    });


    //从父控件中移除自身
    this.remove = function () {

        var parent = this.__parent__;

        if (parent)
        {
            parent.__children__.remove(this);
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

        var parent = this.__parent__;
        return parent && parent.ownerWindow;
    });






    //值变更事件
    this.defineEvent("change");


    var __style_regex__ = /name|value/g,
        __style_string__ = "var value = fields.name, defaults;\n"
        + "if (value === undefined || (defaults = this.__defaults__.name) === value)\n"
        + "{\n"
            + "if (!this.style || (value = this.style.name) === undefined)"
            + "{\n"
                + "if ((value = flyingon.styleValue(this, \"name\")) === undefined && (value = defaults) === undefined)\n"
                + "{\n"
                    + "value = this.__defaults__.name;"
                + "}\n"
            + "}\n"
        + "}\n";

    this.__define_style__ = function (name, oldValue) {

        return __style_string__.replace(__style_regex__, function (key) {

            return key == "name" ? name : (oldValue || key);
        });
    };

    this.__define_getter__ = function (name, attributes) {

        var body;

        if (attributes.style) // 样式属性
        {
            body = "var fields = this.__fields__;\n" + this.__define_style__(name);
        }
        else
        {
            body = "var value = this.__fields__." + name + ";\n";
        }

        body += "return " + (attributes.result || "value;");

        return new Function(body);
    };

    this.__define_setter__ = function (name, attributes) {


        var body = [];


        body.push("var fields = this.__fields__, cache;\n");

        body.push(this.__define_initializing__(name, attributes));


        if (attributes.style)
        {
            body.push(this.__define_style__(name, "oldValue"));
        }
        else
        {
            body.push("var oldValue = fields." + name + ";\n");
        }


        if (attributes.changing)
        {
            body.push(attributes.changing);
            body.push("\n");
        }


        body.push("if (oldValue !== value)\n");
        body.push("{\n");

        body.push(this.__define_change__(name));

        body.push("fields." + name + " = value;\n");
        body.push("var boxModel = this.__boxModel__;\n");


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


        body.push("if (cache = this.__bindings__)\n");
        body.push("{\n");
        body.push("this.__fn_bindings__(\"" + name + "\", cache);\n");
        body.push("}\n");


        //需要重新定位
        if (attributes.locate)
        {
            body.push("(boxModel.parent || boxModel).invalidate(true);\n");
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




    //指定class名 与html一样
    this.defineProperty("className", null, {

        attributes: "locate|query",
        complete: "this.__fn_className__(value);"
    });

    //处理className
    this.__fn_className__ = function (value) {

        var values, cache;

        if (value && (values = value.match(/\S+/g)))
        {
            var cache = this.__class__ = {};

            for (var i = values.length - 1; i >= 0; i--)
            {
                if (!cache[value = values[i]])
                {
                    cache[value] = true;
                }
            }

            this.__fields__.className = (cache.__names__ = Object.keys(cache)).join(" ");
        }
        else
        {
            this.__class__ = null;
            this.__fields__.className = null;
        }


        this.__style_group__ = null;  //清空缓存的样式组

        (this.__parent__ || this).__boxModel__.invalidate(true);
    };

    //是否包含指定class
    this.hasClass = function (className) {

        return this.__class__ && this.__class__(className);
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

        var data = this.__class__;

        if (data && className && data[className])
        {
            delete data[className];
            this.className = Object.keys(data).join(" ");

            return true;
        }
    };

    //切换class 有则移除无则添加
    this.toggleClass = function (className) {

        var data = this.__class__;

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




    //自定义样式
    this.defineProperty("style", null, "measure|query");




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

        //检测是否有状态变更动画 有则播放 状态动画命名规则: 状态名 + "-animation"
        //var animation = flyingon.styleValue(this, name + "-animation");

        //状态变更事件
        this.dispatchEvent(new flyingon.ChangeEvent("statechange", this, name, value));

        //样式变更可能需要重新定位
        (this.__parent__ || this).__boxModel__.invalidate(true);
    };


    //获取状态图片(图片资源有命名规则要求) active -> hover -> checked -> common
    this.__fn_state_image__ = function (image, checked) {

        var states = this.__states__,
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





    /***************BoxModel相关属性***************/


    //盒式模型
    this.defineProperty("boxModel", function () {

        return this.__boxModel__;
    });


    //控件左上角x及y坐标 仅绝对定位时有效
    this.defineProperties(["left", "top"], 0, "locate|style");

    //相对原来渲染位置的x及y偏移
    this.defineProperties(["offsetX", "offsetY"], 0, "locate|style");

    //控件宽度及高度 可选值: 数字|数字+"%"|"fill"|"auto"
    //数字: 固定大小
    //数字+"%":占客户区域百分比
    //fill: 充满可用区域
    //auto: 根据内容自动计算
    this.defineProperties(["width", "height"], 100, "locate|style");


    //是否显示
    //visible:  显示
    //hidden:   不显示但保留占位
    //collapsed:不显示也不占位
    this.defineProperty("visibility", "visible", "locate|style");

    //最小最大宽度 最小最大高度
    this.defineProperties(["minWidth", "maxWidth", "minHeight", "maxHeight"], 0, "locate|style");


    //对齐属性
    var attributes = {

        attributes: "locate|style",
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

    //内容对齐方式
    //top:      顶部对齐
    //middle:   垂直居中对齐
    //bottom:   底部对齐
    //left:     左边对齐
    //center:   水平居中对齐
    //right:    右边对齐
    //可用逗号分隔同时设置水平及垂直对齐方式 如: "middle,center"
    this.defineProperty("textAlign", new flyingon.Align("middle"), attributes);


    //流式布局 auto:自动 inline:同行 newline:新行
    this.defineProperty("flow", "auto", "locate|style");

    //停靠方式
    //left:   左见枚举
    //top:    顶部见枚举
    //right:  右见枚举
    //bottom: 底部见枚举
    //fill:   充满
    this.defineProperty("dock", "left", "locate|style");


    /*********************************************/




    /***************BoxModel及样式相关属性***************/

    attributes = {

        attributes: "locate|style",
        changing: "if (!(value instanceof flyingon.Thickness)) value = new flyingon.Thickness(value);"
    };

    this.defineProperty("margin", new flyingon.Thickness(), attributes);

    this.defineProperty("border", new flyingon.Thickness(), attributes);

    this.defineProperty("padding", new flyingon.Thickness(), attributes);

    this.defineProperty("borderRadius", 0, "measure|style");

    /*********************************************/


    /***************样式相关属性***************/

    //背景色
    this.defineProperty("backgroundColor", null, "style");

    //前景色
    this.defineProperty("color", "black", "style");

    //边框颜色
    this.defineProperty("borderColor", "black", "style");

    //透明度
    this.defineProperty("opacity", 1, "style");

    //变换器
    this.defineProperty("transform", null, "measure|style");

    //字体
    this.defineProperty("font", "normal", {

        attributes: "measure|style",
        result: "flyingon.get_font(value);",
        changed: "this.__text__ = null;"
    });



    //是否只绘制有效范围
    this.defineProperty("clipToBounds", true, "measure|style");



    //文字内容
    this.defineProperty("text", null, {

        attributes: "measure",
        changing: "value += '';",
        changed: "this.__text__ = null;"
    });


    /*********************************************/


    //鼠标样式
    this.defineProperty("cursor", "default", "style");


    this.__fn_cursor__ = function (event) {

        return this.cursor || "default";
    };


    //装饰
    this.defineProperty("decorates", null, "invalidate|style");


    /*********************************************/


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

        return this.ownerWindow && this.ownerWindow.__focused_control__ == this;
    });

    //是否为焦点控件或包含焦点控件
    this.defineProperty("containsFocused", function () {

        var focused = this.ownerWindow && this.ownerWindow.__focused_control__;
        return focused && (focused == this || this.isParent(focused));
    });





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




    //调整自动大小
    this.adjustAutoSize = function (boxModel, auto_width, auto_height) {

        if (auto_width)
        {
            boxModel.width = boxModel.width - boxModel.clientRect.width;
        }
    };



    //模板
    this.defineProperty("template", null, {

        attributes: "measure",
        changed: "this.clearTemplate();",

        getter: function () {

            var template = this.__fields__.template,
                defaults;

            if (template && !(defaults = this.__defaults__.template))
            {
                return template;
            }

            return flyingon.templates[this.__fullTypeName__] || defaults;
        }
    });

    //创建模板控件
    this.createTemplateControl = function (template, context) {

        var items = this.__children__;

        if (items)
        {
            items.clear();
        }
        else
        {
            //子控件集合
            items = this.__children__ = new flyingon.ControlCollection(this);

            //初始化子盒模型
            this.__boxModel__.children = [];
        }

        var result = new flyingon.SerializeReader().deserialize(template, context || this);
        if (result)
        {
            items.add(result);

            result.__template__ = true;
            return result;
        }
    };

    //清除模板控件
    this.clearTemplate = function () {

        var items = this.__children__;

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
            ownerWindow.__capture_control__ = this;
        }
    };

    //释放鼠标
    this.releaseCapture = function () {

        var ownerWindow = this.ownerWindow;

        if (ownerWindow)
        {
            ownerWindow.__capture_control__ = null;
        }
    };



    //执行验证
    this.validate = function () {

        return this.dispatchEvent("validate");
    };

    this.__fn_focus__ = function (event) {

        return this.focus();
    };

    this.__fn_blur__ = function () {

        return this.blur();
    };


    //设置当前控件为焦点控件
    //注:需此控件focusable为true时才可设为焦点控件
    this.focus = function () {

        if (this.focusable)
        {
            var ownerWindow = this.ownerWindow;

            if (ownerWindow && ownerWindow.__focused_control__ != this)
            {
                ownerWindow.__focused_control__ = this;

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

        if (ownerWindow && ownerWindow.__focused_control__ == this)
        {
            ownerWindow.__focused_control__ = null;

            if (this.dispatchEvent("blur"))
            {
                this.stateTo("focus", false);
            }

            return true;
        }

        return false;
    };




    //查找控件 selector: css选择器样式字符串
    this.find = function (selector) {

        return new flyingon.Query(selector, this);
    };

    //查找指定id的子控件集合
    this.findById = function (id, cascade) {

        return new flyingon.Query(new flyingon.Selector_Element(cascade ? " " : ">", "#", id), this);
    };

    //查找指定名称的子控件集合
    this.findByName = function (name, cascade) {

        var element = new flyingon.Selector_Element(cascade ? " " : ">", "*"),
            property = new flyingon.Selector_Property("name");

        property.operator = "=";
        property.value = name;

        element.push(property);

        return new flyingon.Query(element, this);
    };

    //查找指定类型的子控件集合
    this.findByTypeName = function (fullTypeName, cascade) {

        return new flyingon.Query(new flyingon.Selector_Element(cascade ? " " : ">", "", fullTypeName), this);
    };

    //查找指定class的控件子控件集合
    this.findByClassName = function (className, cascade) {

        return new flyingon.Query(new flyingon.Selector_Element(cascade ? " " : ">", ".", className), this);
    };




    //显示弹出控件
    this.showPopup = function (x, y) {

        var ownerWindow = this.ownerWindow;

        if (ownerWindow)
        {
            var layer = ownerWindow.__popup_layer__;

            if (!layer)
            {
                layer = ownerWindow.__popup_layer__ = ownerWindow.appendLayer(9997);
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

            layer.__children__.add(this);
            layer.invalidate(false);
        }
    };

    //关闭弹出控件
    this.closePopup = function () {

        var ownerWindow = this.ownerWindow;

        if (ownerWindow)
        {
            ownerWindow.removeLayer(ownerWindow.__popup_layer__);
        }
    };






    /**********************************坐标说明**********************************/

    //offsetX, offsetY:  偏移坐标 相对目标窗口左上角的显示偏移距离(不受滚动条影响)
    //targetX, targetY:  目标坐标 相对目标控件左上角的物理偏移距离(不受滚动条影响)
    //windowX, windowY:  窗口坐标 相对目标窗口左上角的渲染偏移距离(受滚动条影响)
    //targetX, targetY:控件坐标 相对目标控件左上角的渲染偏移距离(受滚动条影响)

    /****************************************************************************/


    //偏移坐标转窗口坐标
    this.offsetToWindow = function (x, y) {

        return this.__boxModel__.offsetToWindow(x, y);
    };

    //偏移坐标转目标坐标
    this.offsetToTarget = function (x, y) {

        return this.__boxModel__.offsetToTarget(x, y);
    };

    //偏移坐标转控件坐标
    this.offsetToControl = function (x, y) {

        return this.__boxModel__.offsetToControl(x, y);
    };


    //目标坐标转偏移坐标
    this.targetToOffset = function (x, y) {

        return this.__boxModel__.targetToOffset(x, y);
    };

    //窗口坐标转偏移坐标
    this.windowToOffset = function (x, y) {

        return this.__boxModel__.windowToOffset(x, y);
    };

    //控件坐标转偏移坐标
    this.controlToOffset = function (x, y) {

        return this.__boxModel__.controlToOffset(x, y);
    };



    //命中测试
    this.hitTest = function (x, y) {

        var box = this.__boxModel__;
        return x >= box.x && y >= box.y && x <= box.right && y <= box.bottom;
    };


    //使区域无效
    this.invalidate = function (measure) {

        this.__boxModel__.invalidate(measure, false);
    };


    //更新绘制控件
    this.update = function (measure) {

        this.__boxModel__.invalidate(measure, true);
    };





    this.measureText = function (boxModel) {

        var text = this.text;

        if (text != null && !this.__textMetrics__)
        {
            (this.__textMetrics__ = new flyingon.TextMetrics()).measureText(this.font, text, this.multiline);
        }
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

        var textMetrics = this.__textMetrics__,
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




}, true);
