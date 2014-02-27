/// <reference path="../Base/Core.js" />


//可视化组件基类
//注: 此组件支持样式及自绘, 但不支持事件, 某些特殊的绘图要求可从此继承, 一般情况下尽量从Control类继承
flyingon.class("Visual", flyingon.SerializableObject, function (Class, flyingon) {




    Class.create = function () {

        //盒模型
        this.__boxModel__ = new flyingon.BoxModel(this);
    };




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



    //是否显示 visible:显示 hidden:不显示但保留占位 collapsed:不显示也不占位 见枚举flyingon.Visibility对象
    this.defineProperty("visibility", "visible", "locate|style");

    //最小最大宽度 最小最大高度
    this.defineProperties(["minWidth", "maxWidth", "minHeight", "maxHeight"], 0, "locate|style");

    //水平对齐 left center right 见枚举flyingon.HorizontalAlign对象
    this.defineProperty("horizontalAlign", "left", "locate|style");

    //垂直对齐 top center bottom 见枚举flyingon.VerticalAlign对象
    this.defineProperty("verticalAlign", "top", "locate|style");




    /*********************************************/


    /***************BoxModel及样式相关属性***************/

    var attributes = {

        attributes: "locate|style",
        changing: "if (!(value instanceof flyingon.Thickness)) value = new flyingon.Thickness(value);"
    };

    this.defineProperty("margin", new flyingon.Thickness(0), attributes);

    this.defineProperty("border", new flyingon.Thickness(0), attributes);

    this.defineProperty("padding", new flyingon.Thickness(0), attributes);

    this.defineProperty("borderRadius", 0, "measure|style");

    /*********************************************/


    /***************样式相关属性***************/

    //背景色
    this.defineProperty("backColor", null, "style");

    //前景色
    this.defineProperty("foreColor", "black", "style");

    //边框色
    this.defineProperty("borderColor", "rgb(100,100,100)", "style");

    //透明度
    this.defineProperty("opacity", 1, "style");

    //变换器
    this.defineProperty("transform", null, "measure|style");

    //字体
    this.defineProperty("font", "normal", {

        attributes: "measure|style",
        result: "flyingon.get_font(value);",
        changed: "this.__textMetrics__ = null;"
    });



    //是否只绘制有效范围
    this.defineProperty("clipToBounds", true, "measure|style");



    //文字内容
    this.defineProperty("text", null, {

        attributes: "measure",
        changing: "value += '';",
        changed: "this.__textMetrics__ = null;"
    });


    /*********************************************/


    //获取状态图片(图片资源有命名规则要求) active -> hover -> checked -> common
    this.__fn_state_image__ = function (image, checked) {

        var states = this.__states__,
           images = [];

        if (states.activate)
        {
            images.push(image + "-active");
        }

        if (states.hover)
        {
            images.push(image + "-hover");
        }

        if (checked)
        {
            images.push(image + "-checked");
        }

        images.push(image);

        return flyingon.get_image_any(images);
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

        var backColor = this.backColor;

        if (backColor)
        {
            var r = boxModel.usableRect;

            context.beginPath();
            context.set_fillStyle(backColor);

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
            var font = textMetrics.font;

            context.save();


            //区域剪切
            if (cache = this.clipToBounds)
            {
                context.beginPath();
                context.rect(clientRect.windowX, clientRect.windowY, clientRect.width, clientRect.height);
                context.clip();
            }


            if (cache = this.paint_text_back)
            {
                cache.call(this, context, clientRect, textMetrics);
            }


            context.set_fillStyle(this.foreColor);
            context.set_font(font);


            var x = clientRect.windowX,
                y = clientRect.windowY + textMetrics.height;

            for (var i = 0, length = textMetrics.length; i < length; i++)
            {
                var line = textMetrics[i];

                for (var j = 0, count = line.length; j < count; j++)
                {
                    var element = line[j];
                    context.fillText(element.text, x, y);

                    x += element.width;
                }
            }


            context.restore();
            return true;
        }
    };



}, true);
