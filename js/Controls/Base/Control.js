/// <reference path="../Base/Core.js" />


//控件基类
$.class("Control", $.SerializableObject, function ($) {




    this.create = function () {


        //盒模型
        this["x:boxModel"] = new $.BoxModel(this);

    };






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
        }
    });


    //触发父控件变更
    this["fn:parent"] = function (parent) {

        var box = this["x:boxModel"];

        if (box.parent)
        {
            box.parent["x:measure"] = true;
        }
        else
        {
            box["x:measure"] = true;
        }

        if (parent)
        {
            parent["x:boxModel"]["x:measure"] = true;
        }


        var oldValue = this["x:parent"];

        this["x:parent"] = parent;

        this.dispatchEvent({

            type: "change",
            name: "parent",
            value: parent,
            oldValue: this["x:parent"]
        });
    };






    //主窗口
    this.defineProperty("mainWindow", undefined, {

        readOnly: true,
        getter: function () {

            var result = this.ownerWindow;
            return result && (result.mainWindow || result);
        }
    });

    //所属窗口
    this.defineProperty("ownerWindow", undefined, {

        readOnly: true,
        getter: function () {

            var parent = this["x:parent"];
            return parent && (parent["x:ownerWindow"] || (parent["x:ownerWindow"] = parent.ownerWindow));
        }
    });

    //所属图层
    this.defineProperty("ownerLayer", undefined, {

        readOnly: true,
        getter: function () {

            var parent = this["x:parent"];
            return parent && (parent["x:ownerLayer"] || (parent["x:ownerLayer"] = parent.ownerLayer));
        }
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








    this["fn:define:getter"] = function (name, options) {

        var body;

        if (options.style) // 样式属性
        {
            body = "return this.getStyleValue('" + name + "');";
        }
        else
        {
            body = "return this['x:storage']['" + name + "'];"
        }

        return new Function(body);
    };

    this["fn:define:setter"] = function (name, attributes) {


        var body = "var storage = this['x:storage'], cache, name = '" + name + "';\n"

            + this["fn:define:setter:initialize"]


            + (attributes.style ? "var oldValue = this.getStyleValue(name);" : "var oldValue = storage[name];")

            + (attributes.valueChangingCode ? attributes.valueChangingCode + "\n" : "") //自定义值变更代码


            + "if (oldValue !== value)\n"
            + "{\n"

            + this["fn:define:setter:change"]

            + "storage[name] = value;\n";


        //布局 可能会影响父控件布局
        if (attributes.layout)
        {
            body += "if (cache = this['x:boxModel'].parent)\n"
                + "{\n"
                + "cache['x:measure'] = true;\n"
                + "cache.ownerControl.invalidate();\n"
                + "}\n"
                + "else\n"
                + "{\n"
                + "this.invalidate();\n"
                + "}\n";

            attributes.invalidate = false;
        }


        //测量 可能会影响空间占用及子控件排列
        if (attributes.measure)
        {
            body += "this['x:boxModel']['x:measure'] = true;\nthis.invalidate();\n";
        }
        else if (attributes.invalidate) //标记区域无效 需要重新绘制
        {
            body += "this.invalidate();\n";
        }


        if (attributes.valueChangedCode) //自定义值变更代码
        {
            body += attributes.valueChangedCode + "\n";
        }


        body += this["fn:define:setter:bindingTo"] //处理绑定源

            //处理绑定目标
            + "if ((cache = this['x:bindings']) && (cache = cache[name]) && cache.setter !== null && cache['x:binding'] != true)\n"
            + "{\n"
            + "if (cache.setter === undefined)\n"
            + "{\n"
            + "cache.source[cache.expression] = this[name]\n"
            + "}\n"
            + "else\n"
            + "{\n"
            + "cache.setter.call(cache.source, this[name]);\n"
            + "}\n"
            + "}\n"


            + "}\n"

            + "return this;\n";


        return new Function("value", body);
    };




    //自定义样式
    this.defineProperty("styleKey", null, "invalidate");

    /*
    预定义状态组:
    common-states:  普通状态组(enter-animate disabled pressed)
    check-states:   选中状态组(checked unchecked unkown)
    focus-states:   焦点状态组(focused leaver-animate)
    hover-states:   鼠标悬停状态组(hover leaver-animate)
    */
    this["x:states"] = ["common-states", "focus-states", "hover-states"];

    //自定义状态组
    this.defineStates = function (states) {

        this["x:states"] = ["common-states"].concat(states).concat(["focus-states", "hover-states"]);
    };

    this.setDefaultValue("common-states", null);

    this.setDefaultValue("focus-states", null);

    this.setDefaultValue("hover-states", null);

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


    //复制样式(复制基类的样式至子类以便加速访问)
    function copyStyle(styles, style, superClass) {

        var className = superClass.className,
            parent = styles[className] || (styles[className] = {});

        if (!parent["x:cache"])
        {
            copyStyle(styles, parent, superClass.superClass);
        }

        $["fn:simple:copy"](parent, style, true);


        style["x:cache"] = true;
    };

    function getStyleValue(style, name) {

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
    this.getStyleValue = function (name) {


        var storage = this["x:storage"],
            result;


        if ((result = (storage.hasOwnProperty(name) && storage[name])) != false)
        {
            return result;
        }


        var styles = $.styles,
            styleKey,
            style;

        if ((styleKey = storage.styleKey) &&
            (style = (styles[styleKey])) &&
            (result = getStyleValue.call(this, style, name)) != undefined)
        {
            return result;
        }


        styleKey = this["x:class"].className;
        style = (styles[styleKey] || (styles[styleKey] = {}));

        if (!style["x:cache"])
        {
            copyStyle(styles, style, this["x:class"].superClass);
        }


        if ((result = getStyleValue.call(this, style, name)) != undefined)
        {
            return result;
        }

        return storage[name] || null;
    };




    /***************BoxModel相关属性***************/

    //盒式模型
    this.defineProperty("boxModel", undefined, {

        readOnly: true,
        getter: function () {

            return this["x:boxModel"];
        }
    });



    //
    this.defineProperties(["offsetX", "offsetY"], 0, "measure|layout");


    //
    this.defineProperties(["left", "top"], 0, "measure|layout", "this.dispatchEvent(new flyingon.PropertyChangedEvent('locationchanged', this, name, value, oldValue));");


    //
    this.defineProperties(["width", "height"], 0, "measure|layout", "this.dispatchEvent(new flyingon.PropertyChangedEvent('resize', this, name, value, oldValue));");




    //是否显示 visible:显示 hidden:不显示但保留占位 collapsed:不显示也不占位 见枚举flyingon.Visibility对象
    this.defineProperty("visibility", "visible", "layout");

    //
    this.defineProperties(["minWidth", "maxWidth", "minHeight", "maxHeight"], 0, "measure|layout");



    //拉伸方式 n:不拉伸 x:横向拉伸 y:纵向拉伸 xy:全部拉伸 见枚举flyingon.Stretch对象
    this.defineProperty("stretch", "xy", "measure|layout");

    //水平对齐 left center right 见枚举flyingon.HorizontalAlign对象
    this.defineProperty("horizontalAlign", "left", "measure|layout");

    //垂直对齐 top center bottom 见枚举flyingon.VerticalAlign对象
    this.defineProperty("verticalAlign", "top", "measure|layout");

    //停靠方式 left top right bottom fill 见枚举flyingon.Dock对象
    this.defineProperty("dock", "left", "measure|layout");

    //表格布局时行及列索引 
    this.defineProperties(["rowIndex", "columnIndex"], null, "measure|layout");



    //
    this.defineProperty("outerRect", undefined, {

        readOnly: true,
        getter: function () {

            return this["x:boxModel"]["outerRect"];
        }
    });

    //
    this.defineProperty("innerRect", undefined, {

        readOnly: true,
        getter: function () {

            return this["x:boxModel"]["innerRect"];
        }
    });



    /*********************************************/


    /***************BoxModel及样式相关属性***************/

    this.defineProperty("margin", [0, 0, 0, 0], "measure|style");

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

        attributes: "style",

        getter: function () {

            return $.fonts[this.getStyleValue("font") || "normal"] || $.fonts["normal"];
        }

    }, "this['x:textMetrics'] = null;");




    //装饰
    this.defineProperty("decorates", null, "style");




    this.defineProperty("text", null, {

        attributes: "measure",
        valueChangingCode: "value += '';",
        valueChangedCode: "this['x:textMetrics'] = null;"
    });

    this.defineProperty("textHorizontalAlign", "left", "measure");

    this.defineProperty("textVerticalAlign", "center", "measure");




    this.defineProperty("cursor", null);

    this["fn:cursor"] = function (event) {

        var cursor = this.getStyleValue("cursor") || "default";
        return $.cursors[cursor] || cursor;
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
    this.defineProperty("focused", undefined, {

        readOnly: true,
        getter: function () {

            return this.ownerWindow && this.ownerWindow["x:focusControl"] == this;
        }
    });

    //是否为焦点控件或包含焦点控件
    this.defineProperty("containsFocused", undefined, {

        readOnly: true,
        getter: function () {

            var focusControl = this.ownerWindow && this.ownerWindow["x:focusControl"];
            return focusControl && (focusControl == this || this.isParent(focusControl));
        }
    });




    //执行验证
    this.validate = function () {

        return this.dispatchEvent("validate");
    };

    this["fn:focus"] = function (event) {

        return this.focus();
    };

    this["fn:blur"] = function () {

        return this.blur();
    };


    //设置当前控件为焦点控件
    //注:需此控件focusable为true时才可设为焦点控件
    this.focus = function () {

        if (this["x:storage"].focusable)
        {
            var ownerWindow = this.ownerWindow;

            if (ownerWindow && ownerWindow["x:focusControl"] != this)
            {
                ownerWindow["x:focusControl"] = this;

                this.dispatchEvent("focus");
                this.switchState("focus-states", "focused");
            }

            return true;
        }

        return false;
    };

    //此控件失去焦点
    this.blur = function () {

        var ownerWindow = this.ownerWindow;

        if (ownerWindow && ownerWindow["x:focusControl"] == this)
        {
            ownerWindow["x:focusControl"] = null;

            this.dispatchEvent("blur");
            this.switchState("focus-states", "leave-animate");

            return true;
        }

        return false;
    };






    ////数据绑定主体
    //this.dataContext = null;

    //binding = { source: object, expression: "name" || function () {}, formatter: function () {}, setter: function() {} }
    this.setBinding = function (propertyName, binding) {

        if (propertyName && binding)
        {
            var source = binding.source,
                expression = binding.expression;

            if (source && expression)
            {
                var bindings = source["x:bindings:source"] || (source["x:bindings:source"] = {}),
                    id = this.id;


                //执行绑定
                binding["x:binding"] = true;
                this[propertyName] = typeof expression == "function" ? expression.call(source) : source[expression];
                binding["x:binding"] = false;


                //设置绑定
                if (typeof expression == "function")
                {
                    var properties = binding.properties = expression.toString().match(/this\.[\w\$]+/g);

                    for (var i = 0; i < properties.length; i++)
                    {
                        expression = properties[i] = properties[i++].substring(5);
                        (bindings[expression] || (bindings[expression] = {}))[id] = propertyName;
                    }

                    if (binding.setter === undefined)
                    {
                        binding.setter = null;
                    }
                }
                else //字段
                {
                    (bindings[expression] || (bindings[expression] = {}))[id] = propertyName;
                }

                (this["x:bindings"] || (this["x:bindings"] = {}))[propertyName] = binding;
            }
        }
    };

    this.removeBinding = function (propertyName) {

        var bindings = this["x:bindings"];

        if (bindings && bindings.hasOwnProperty(propertyName))
        {
            var target_binding = bindings[propertyName],
                source_binding = target_binding.source["x:bindings:source"],
                properties = target_binding.properties,
                id = this.id;

            if (properties)
            {
                for (var i = 0; i < properties.length; i++)
                {
                    delete source_binding[properties[i]][id];
                }
            }
            else
            {
                delete source_binding[target_binding.expression][id];
            }

            delete bindings[propertyName];
        }
    };



    //显示弹出控件
    this.showPopup = function (x, y) {

        var ownerWindow = this.ownerWindow;

        if (ownerWindow)
        {
            var layer = ownerWindow["x:popupLayer"];

            if (!layer)
            {
                layer = ownerWindow["x:popupLayer"] = ownerWindow.appendLayer(null, 9997);
                layer.layout = "absolute";
                layer.paintBackground = function () { };
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
            ownerWindow.removeLayer(ownerWindow["x:popupLayer"]);
        }
    };






    //是否可以拖动
    this.defineProperty("draggable", false);

    //是否可以接受拖放
    this.defineProperty("droppable", false);




    //定义鼠标事件
    this.defineEvents(["mousedown", "mousemove", "click", "dblclick", "mouseup", "mouseover", "mouseout", "mousewheel"]);

    //定义拖拉事件
    this.defineEvents(["dragstart", "drag", "dragend", "dragenter", "dragover", "dragleave", "drop"]);

    //定义键盘事件
    this.defineEvents(["keydown", "keypress", "keyup"]);

    //定义其它事件
    this.defineEvents(["parentchanged", "focus", "blur", "locationchanged", "resize", "validate"]);



    //捕获鼠标
    this.setCapture = function () {

        var ownerWindow = this.ownerWindow;
        if (ownerWindow)
        {
            ownerWindow["x:captureControl"] = this;
        }
    };

    //释放鼠标
    this.releaseCapture = function () {

        var ownerWindow = this.ownerWindow;
        if (ownerWindow)
        {
            ownerWindow["x:captureControl"] = null;
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

        var rect = this["x:boxModel"].outerRect;
        return x >= rect.x && y >= rect.y && x <= rect.right && y <= rect.bottom;
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





    //测量文字方法
    this["fn:measure:text"] = function () {

        if (!this["x:textMetrics"])
        {
            var storage = this["x:storage"];

            this["x:textMetrics"] = new $.TextMetrics(this);
            this["x:textMetrics"].measureText(this.font, storage.text, storage.multiline);
        }
    };




    //绘制边框
    this.paintBorder = function (context) {

        var boxModel = context.boxModel,
            border = boxModel.border;

        if (border && border.border)
        {
            var color = this.getStyleValue("borderColor");

            if (boxModel.borderRadius > 0)
            {
                var rect = boxModel.borderRect,
                    lineWidth = border[0],
                    offset = lineWidth / 2;

                context.lineWidth = lineWidth;
                context.set_strokeStyle(color);
                context.strokeRoundRect(rect.windowX + offset, rect.windowY + offset, rect.width - lineWidth, rect.height - lineWidth, boxModel.borderRadius);
            }
            else
            {
                var rect = boxModel.outerRect;

                context.set_fillStyle(color);
                context.drawBorder(rect.windowX, rect.windowY, rect.width, rect.height, border);
            }
        }

    };


    //绘制背景
    this.paintBackground = function (context) {

        var boxModel = context.boxModel,
            background = this.background;

        if (background)
        {
            var rect = boxModel.borderRect;

            context.beginPath();
            context.set_fillStyle(background);

            if (boxModel.borderRadius > 0) //圆角矩形
            {
                context.roundRect(rect.windowX, rect.windowY, rect.width, rect.height, boxModel.borderRadius);
            }
            else
            {
                context.rect(rect.windowX, rect.windowY, rect.width, rect.height);
            }

            context.fill();

            return true;
        }
    };


    //绘制内框
    this.paint = function (context) {

        this.paintText(context);
    };


    //绘制文字
    this.paintText = function (context) {

        var textMetrics = this["x:textMetrics"];

        if (textMetrics)
        {
            var boxModel = context.boxModel,
                rect = boxModel.innerRect,
                font = textMetrics.font;


            context.save();


            //区域剪切
            var cliped = this["x:storage"].clipToBounds;
            if (cliped)
            {
                context.beginPath();
                context.rect(rect.windowX, rect.windowY, rect.width, rect.height);
                context.clip();
            }


            if (this.paintTextBackground)
            {
                this.paintTextBackground(context);
            }


            context.set_fillStyle(this.foreground);
            context.set_font(font);


            var x = rect.windowX - boxModel.scrollLeft,
                y = rect.windowY + textMetrics[0].height,

                i = 0,
                length = textMetrics.length;


            while (i < length)
            {
                var line = textMetrics[i++],
                    j = 0,
                    count = line.length;

                while (j < count)
                {
                    var snippet = line[j++];
                    context.fillText(snippet.text, x, y);

                    x += snippet.width;
                }
            }


            context.restore();
            return true;
        }
    };




    this.serialize = function (writer) {

        var bindings = this["x:bindings"];

        if (bindings && bindings["x:serialize"])
        {
            writer.write("d:bindings", bindings);
        }
    };


});
