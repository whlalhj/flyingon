/// <reference path="../Base/Core.js" />


//控件基类
flyingon.class("Control", flyingon.SerializableObject, function (Class, flyingon) {




    Class.create = function () {


        //盒模型
        this["x:boxModel"] = new flyingon.BoxModel(this);
    };



    //初始化类方法
    Class.initialize = function (Class, flyingon) {


        var className = Class.className,
            styles = flyingon.styles,
            style = styles[className] || (styles[className] = {}),
            templates = flyingon.templates,
            template = templates[className] || (templates[className] = {});


        className = Class["superClass"].className;

        //复制上级样式
        if (styles.hasOwnProperty(className))
        {
            flyingon["simple-copy"](styles[className], style, true);
        }

        //复制上级模板
        if (templates.hasOwnProperty(className))
        {
            flyingon["simple-copy"](templates[className], template, true);
        }
    };





    //引用序列化标记(为true时只序列化名称不序列化内容)
    this["x:reference"] = true;




    //父控件
    this.defineProperty("parent", null, {

        getter: function () {

            return this["x:parent"];
        },

        setter: function (value) {

            var oldValue = this["x:parent"];

            if (value != oldValue)
            {
                if (oldValue)
                {
                    oldValue["x:children"].remove(this);
                }

                if (value)
                {
                    value["x:children"].append(this);
                }
            }

            return this;
        }
    });


    //触发父控件变更
    this["y:parent"] = function (parent) {

        var box = this["x:boxModel"];

        if (box.parent)
        {
            box.parent["x:partition"] = true;
        }

        if (parent)
        {
            parent["x:boxModel"]["x:partition"] = true;
        }

        this["x:parent"] = parent;
        this.dispatchEvent(new flyingon.ChangeEvent(this, "parent", parent, this["x:parent"]));
    };






    //主窗口
    this.defineProperty("mainWindow", function () {

        var result = this.ownerWindow;
        return result && (result.mainWindow || result);
    });

    //所属窗口
    this.defineProperty("ownerWindow", function () {

        var parent = this["x:parent"];
        return parent && parent.ownerWindow;
    });

    //所属图层
    this.defineProperty("ownerLayer", function () {

        var parent = this["x:parent"];
        return parent && parent.ownerLayer;
    });


    //当前控件是否指定控件的父控件
    this.isParent = function (control) {

        if (!control || control == this)
        {
            return false;
        }

        var target = control["x:parent"];

        while (target)
        {
            if (target == this)
            {
                return true;
            }

            target = target["x:parent"];
        }

        return false;
    };

    //指定控件是否当前控件的父控件
    this.isParentTo = function (control) {

        return control ? control.isParent(this) : false;
    };

    //获取当前控件的上级控件列表(按从上到下的顺序显示)
    this.getParentList = function () {

        var result = [],
            parent = this["x:parent"];

        while (parent)
        {
            result.unshift(parent);
            parent = parent["x:parent"];
        }

        return result;
    };

    //从父控件中移除自身
    this.remove = function () {

        var parent = this["x:parent"];

        if (parent)
        {
            parent["x:children"].remove(this);
        }

        return this;
    };








    flyingon["x:define-getter"] = function (name, options) {

        var body;

        if (options.style) // 样式属性
        {
            body = "return this.styleValue('" + name + "');";
        }
        else
        {
            body = "return this['x:storage']['" + name + "'];"
        }

        return new Function(body);
    };

    flyingon["x:define-setter"] = function (name, attributes) {


        var body = "var storage = this['x:storage'], cache, name = '" + name + "';\n"

            + flyingon["x:define-initialize"]


            + (attributes.style ? "var oldValue = this.styleValue(name);\n" : "var oldValue = storage[name];\n")

            + (attributes.valueChangingCode ? attributes.valueChangingCode + "\n" : "") //自定义值变更代码


            + "if (oldValue !== value)\n"
            + "{\n"

            + flyingon["x:define-change"]

            + "storage[name] = value;\n"
            + "var boxModel = this['x:boxModel'];\n";


        if (attributes.valueChangedCode)
        {
            body += attributes.valueChangedCode + "\n"; //自定义值变更代码
        }

        body += flyingon["x:define-binding"]; //处理绑定源


        //需要重新定位
        if (attributes.locate)
        {
            body += "if (cache = boxModel.parent)\n"
                + "{\n"
                + "cache['x:measure'] = true;\n"
                + "cache.ownerControl.invalidate();\n"
                + "}\n"
                + "else\n"
                + "{\n"
                + "boxModel['x:measure'] = true;\n"
                + "this.invalidate();\n"
                + "}\n";
        }
        else if (attributes.measure) //需要重新测量
        {
            body += "boxModel['x:measure'] = true;\nthis.invalidate();\n";
        }
        else if (attributes.invalidate)  //需要重新绘制
        {
            body += "this.invalidate();\n";
        }


        body += "}\nreturn this;";


        return new Function("value", body);
    };




    //指定样式Key
    this.defineProperty("styleKey", null, "invalidate");

    //自定义样式
    this.defineProperty("style", null, "invalidate");

    /*
    预定义状态组:
    common-states:  普通状态组(enter-animate disabled pressed)
    check-states:   选中状态组(checked unchecked unkown)
    focus-states:   焦点状态组(focused leaver-animate)
    hover-states:   鼠标悬停状态组(hover leaver-animate)
    */
    this["x:states"] = ["common-states", "focus-states", "hover-states"];

    //自定义状态组
    this.defineStates = function (statesName, defaultValue, index) {

        var states = this["x:states"] = this["x:states"].slice(0);
        states.splice(index || states.length - 2, 0, statesName);

        if (defaultValue !== undefined)
        {
            this.defaultValue(statesName, defaultValue);
        }
    };

    this.defaultValue("common-states", null);

    this.defaultValue("focus-states", null);

    this.defaultValue("hover-states", null);

    //切换状态
    this.switchState = function (statesName, stateName) {

        if (statesName && stateName)
        {
            this["x:storage"][statesName] = (stateName == "enter-animate" || stateName == "leave-animate") ? null : stateName;

            //记录最后变更的状态组以作为状态变更动画依据
            this["x:statesName"] = statesName;
            this["x:stateName"] = stateName;

            this.invalidate();
        }
    };


    function styleValue(style, name) {

        var storage = this["x:storage"],
            states = this["x:states"],
            i = states.length - 1,
            statesName,
            stateName,
            result;

        while (i >= 0)
        {
            if ((statesName = states[i--]) && (stateName = storage[statesName]))
            {
                if ((result = (style.states && style.states[statesName])) &&
                    (result = (result[stateName])) &&
                    (result = result[name]) !== undefined)
                {
                    return result;
                }
            }
        }


        return style[name];
    };

    //获取样式值
    this.styleValue = function (name) {


        var storage = this["x:storage"];

        if (storage.hasOwnProperty(name))
        {
            return storage[name];
        }

        var style = storage.style;
        if (style && (style = styleValue.call(this, style, name)) != undefined)
        {
            return style;
        }


        var styles = flyingon.styles,
            styleKey;

        if ((styleKey = storage.styleKey) &&
            (style = (styles[styleKey])) &&
            (style = styleValue.call(this, style, name)) != undefined)
        {
            return style;
        }


        styleKey = this["x:className"];
        style = styles[styleKey];

        if ((style = styleValue.call(this, style, name)) != undefined)
        {
            return style;
        }

        return storage[name] || null;
    };




    /***************BoxModel相关属性***************/

    //盒式模型
    this.defineProperty("boxModel", function () {

        return this["x:boxModel"];
    });



    //
    this.defineProperties(["left", "top", "width", "height"], 0, "locate");




    //是否显示 visible:显示 hidden:不显示但保留占位 collapsed:不显示也不占位 见枚举flyingon.Visibility对象
    this.defineProperty("visibility", "visible", "locate");

    //
    this.defineProperties(["minWidth", "maxWidth", "minHeight", "maxHeight"], 0, "locate");



    //拉伸方式 no:不拉伸 width:宽度拉伸 height:高度拉伸 all:全部拉伸 见枚举flyingon.Stretch对象
    this.defineProperty("stretch", "no", "locate");

    //水平对齐 left center right 见枚举flyingon.HorizontalAlign对象
    this.defineProperty("horizontalAlign", "left", "locate");

    //垂直对齐 top center bottom 见枚举flyingon.VerticalAlign对象
    this.defineProperty("verticalAlign", "top", "locate");

    //停靠方式 left top right bottom fill 见枚举flyingon.Dock对象
    this.defineProperty("dock", "left", "locate");

    //表格布局时行及列索引 
    this.defineProperties(["rowIndex", "columnIndex"], null, "locate");




    /*********************************************/


    /***************BoxModel及样式相关属性***************/

    this.defineProperty("margin", [0, 0, 0, 0], "locate|style");

    this.defineProperty("border", [0, 0, 0, 0], "measure|style");

    this.defineProperty("padding", [0, 0, 0, 0], "measure|style");

    this.defineProperty("borderRadius", 0, "measure|style");

    /*********************************************/


    /***************样式相关属性***************/

    //
    this.defineProperty("background", null, "style");

    //
    this.defineProperty("foreground", "black", "style");

    //
    this.defineProperty("borderColor", "rgb(100,100,100)", "style");

    //透明度
    this.defineProperty("opacity", 1, "style");

    //变换器
    this.defineProperty("transform", null, "measure|style");

    //字体
    this.defineProperty("font", "normal", {

        attributes: "measure|style",
        getter: function () {

            return flyingon.fonts[this.styleValue("font") || "normal"] || flyingon.fonts["normal"];
        }

    }, "this['x:textMetrics'] = null;");




    //装饰
    this.defineProperty("decorates", null, "invalidate|style");




    //自动调整大小方式(根据内容大小自动变化)  no:不调整 width:宽度调整 height:高度调整 all:全部调整见枚举flyingon.AutoSize对象
    this.defineProperty("autoSize", "no", {

        valueChangedCode: "value && value != 'no' && this.adjustAutoSize(this['x:boxModel']);"
    });

    //调整自动大小
    this.adjustAutoSize = function (boxModel) {

    };



    this.defineProperty("text", null, {

        attributes: "measure",
        valueChangingCode: "value += '';",
        valueChangedCode: "this['x:textMetrics'] = null;"
    });

    this.defineProperty("textHorizontalAlign", "left", "measure");

    this.defineProperty("textVerticalAlign", "center", "measure");




    this.defineProperty("cursor", null);

    this["y:cursor"] = function (event) {

        var cursor = this.styleValue("cursor") || "default";
        return flyingon.cursors[cursor] || cursor;
    };



    /*********************************************/



    //是否只绘制有效范围
    this.defineProperty("clipToBounds", true, "measure");



    //快捷键(按下alt+accesskey)
    this.defineProperty("accesskey", null);


    //是否可用
    this.defineProperty("enabled", true, {

        valueChangedCode: "this.switchState('common-states', value ? 'disabled' : 'enter-animate');"
    });


    //是否可具有焦点
    this.defineProperty("focusable", true);


    //是否为焦点控件
    this.defineProperty("focused", function () {

        return this.ownerWindow && this.ownerWindow["x:focused-control"] == this;
    });

    //是否为焦点控件或包含焦点控件
    this.defineProperty("containsFocused", function () {

        var focused = this.ownerWindow && this.ownerWindow["x:focused-control"];
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
    this.defineEvents(["focus", "blur", "locationchanged", "resize", "validate"]);






    //模板
    this.defineProperty("template", null, {

        attributes: "measure",
        valueChangedCode: "this.clearTemplate();",

        getter: function () {

            var storage = this["x:storage"];

            if (storage.hasOwnProperty("template"))
            {
                return storage.template;
            }

            return flyingon.templates[this["x:className"]] || storage.template;
        }
    });

    //创建模板控件
    this.createTemplateControl = function (template, context) {

        var result = new flyingon.SerializeReader().deserialize(template, context || this);

        if (result)
        {
            result["x:parent"] = this;
            result["x:template"] = true;
            return result;
        }
    };

    //清除模板控件
    this.clearTemplate = function () {

    };






    //执行验证
    this.validate = function () {

        return this.dispatchEvent("validate");
    };

    this["y:focus"] = function (event) {

        return this.focus();
    };

    this["y:blur"] = function () {

        return this.blur();
    };


    //设置当前控件为焦点控件
    //注:需此控件focusable为true时才可设为焦点控件
    this.focus = function () {

        if (this["x:storage"].focusable)
        {
            var ownerWindow = this.ownerWindow;

            if (ownerWindow && ownerWindow["x:focused-control"] != this)
            {
                ownerWindow["x:focused-control"] = this;

                if (this.dispatchEvent("focus"))
                {
                    this.switchState("focus-states", "focused");
                }
            }

            return true;
        }

        return false;
    };

    //此控件失去焦点
    this.blur = function () {

        var ownerWindow = this.ownerWindow;

        if (ownerWindow && ownerWindow["x:focused-control"] == this)
        {
            ownerWindow["x:focused-control"] = null;

            if (this.dispatchEvent("blur"))
            {
                this.switchState("focus-states", "leave-animate");
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
            var layer = ownerWindow["x:popup-layer"];

            if (!layer)
            {
                layer = ownerWindow["x:popup-layer"] = ownerWindow.appendLayer(9997);
                layer.layout = "absolute";
                layer["paint-background"] = function () { };
            }

            if (x != null)
            {
                this["x:storage"].left = x;
            }

            if (y != null)
            {
                this["x:storage"].top = y;
            }

            layer["x:children"].append(this);
            layer.invalidate();
        }
    };

    //关闭弹出控件
    this.closePopup = function () {

        var ownerWindow = this.ownerWindow;

        if (ownerWindow)
        {
            ownerWindow.removeLayer(ownerWindow["x:popup-layer"]);
        }
    };





    //捕获鼠标
    this.setCapture = function () {

        var ownerWindow = this.ownerWindow;

        if (ownerWindow)
        {
            ownerWindow["x:capture-control"] = this;
        }
    };

    //释放鼠标
    this.releaseCapture = function () {

        var ownerWindow = this.ownerWindow;

        if (ownerWindow)
        {
            ownerWindow["x:capture-control"] = null;
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

        return this["x:boxModel"].offsetToWindow(x, y);
    };

    //偏移坐标转目标坐标
    this.offsetToTarget = function (x, y) {

        return this["x:boxModel"].offsetToTarget(x, y);
    };

    //偏移坐标转控件坐标
    this.offsetToControl = function (x, y) {

        return this["x:boxModel"].offsetToControl(x, y);
    };


    //目标坐标转偏移坐标
    this.targetToOffset = function (x, y) {

        return this["x:boxModel"].targetToOffset(x, y);
    };

    //窗口坐标转偏移坐标
    this.windowToOffset = function (x, y) {

        return this["x:boxModel"].windowToOffset(x, y);
    };

    //控件坐标转偏移坐标
    this.controlToOffset = function (x, y) {

        return this["x:boxModel"].controlToOffset(x, y);
    };




    this.hitTest = function (x, y) {

        var box = this["x:boxModel"];
        return x >= box.x && y >= box.y && x <= box.right && y <= box.bottom;
    };



    //使区域无效
    this.invalidate = function () {

        var layer = this.ownerLayer;

        this["x:boxModel"].invalidate();

        if (layer)
        {
            layer.registryUpdate();
        }
    };


    //更新绘制控件
    this.update = function () {

        var layer = this.ownerLayer;

        this["x:boxModel"].invalidate();

        if (layer)
        {
            layer.unregistryUpdate();
            layer["x:boxModel"].render(layer.context);
        }
    };




    this.measureText = function (boxModel) {

        var storage = this["x:storage"];
        if (storage.text != null && !this["x:textMetrics"])
        {
            (this["x:textMetrics"] = new flyingon.TextMetrics()).measureText(this.font, storage.text, storage.multiline);
        }
    };


    //绘制边框
    this["paint-border"] = function (context, boxModel) {

        var border = boxModel.border;

        if (border && border.border)
        {
            var color = this.styleValue("borderColor");

            if (boxModel.borderRadius > 0)
            {
                context.lineWidth = border[0];
                context.set_strokeStyle(color);
                context.strokeRoundRect(boxModel.windowX, boxModel.windowY, boxModel.width, boxModel.height, boxModel.borderRadius);
            }
            else
            {
                context.set_fillStyle(color);
                context["paint-border"](boxModel.windowX, boxModel.windowY, boxModel.width, boxModel.height, border);
            }
        }

    };


    //绘制背景
    this["paint-background"] = function (context, boxModel) {

        var background = this.background;

        if (background)
        {
            var r = boxModel.insideRect;

            context.beginPath();
            context.set_fillStyle(background);

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

        this["paint-text"](context, boxModel.clientRect);
    };


    //绘制文字
    this["paint-text"] = function (context, clientRect) {

        var textMetrics = this["x:textMetrics"],
            cache;

        if (textMetrics)
        {
            var font = textMetrics.font;

            context.save();


            //区域剪切
            if (cache = this["x:storage"].clipToBounds)
            {
                context.beginPath();
                context.rect(clientRect.windowX, clientRect.windowY, clientRect.width, clientRect.height);
                context.clip();
            }


            if (cache = this["paint-text-back"])
            {
                cache.call(this, context, clientRect, textMetrics);
            }


            context.set_fillStyle(this.foreground);
            context.set_font(font);


            var x = clientRect.windowX,
                y = clientRect.windowY + textMetrics[0].height;

            for (var i = 0, length = textMetrics.length; i < length; i++)
            {
                var line = textMetrics[i];

                for (var j = 0, count = line.length; j < count; j++)
                {
                    var snippet = line[j];
                    context.fillText(snippet.text, x, y);

                    x += snippet.width;
                }
            }


            context.restore();
            return true;
        }
    };



}, true);
