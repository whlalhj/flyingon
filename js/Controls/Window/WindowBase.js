//窗口基类
$.class("WindowBase", $.Layer, function ($) {



    var host,                       //主容器
        dragging = false,           //是否处理拖动
        mouseDown = false,          //鼠标是否按下
        global = $.global;          //全局对象



    this.create = function () {


        //默认设置为初始化状态,在第一次渲染窗口后终止
        global.initializing = true;



        var style = "position:absolute;z-index:9990;width:100%;height:100%;overflow:hidden;-moz-user-select:none;-webkit-user-select:none;outline:none;cursor:default;";


        var domMask = this.domMask = document.createElement("div");
        domMask.setAttribute("flyingon", "window.mask");
        domMask.setAttribute("style", style + "background-color:white;opacity:0.1;");


        var domWindow = this.domWindow = document.createElement("div");

        domWindow["x:ownerWindow"] = this.domLayer["x:ownerWindow"] = this.domCanvas["x:ownerWindow"] = this; //缓存当前对象

        domWindow.setAttribute("flyingon", "window");
        domWindow.setAttribute("style", style);
        domWindow.setAttribute("tabindex", "0");

        //IE禁止选中文本 其它浏览器使用样式控件 -moz-user-select:none;-webkit-user-select:none;
        domWindow.onselectstart = domMask.onselectstart = function (event) {

            return false;
        };

        //设置图层
        domWindow.appendChild(this.domLayer);
        this.layers = [this];



        domWindow.addEventListener("mousedown", mousedown, true);

        //宿主
        if (!host)
        {
            host = document.documentElement;

            //样式说明: 禁止选中文本: -moz-user-select:none;-webkit-user-select:none;
            host.setAttribute("style", "-moz-user-select:none;-webkit-user-select:none;");

            host.addEventListener("mousemove", mousemove, false);   //注册顶级dom以便捕获鼠标
            host.addEventListener("mouseup", mouseup, false);       //注册顶级dom以便捕获鼠标
        }


        domWindow.addEventListener("click", click, true);
        domWindow.addEventListener("dblclick", dblclick, true);

        domWindow.addEventListener("mousewheel", mousewheel, true);
        domWindow.addEventListener("DOMMouseScroll", mousewheel, true); //firefox

        domWindow.addEventListener("keydown", keydown, true);
        domWindow.addEventListener("keypress", keypress, true);
        domWindow.addEventListener("keyup", keyup, true);


        //初始化插入符
        caret.call(this, domWindow);


        //子窗口集合
        this["x:windows"] = [];

        //创建控件捕获延迟执行器
        this["x:captureDelay"] = new $.DelayExecutor(10, captureControl, this);
    };





    //所属窗口
    this.defineProperty("ownerWindow", undefined, {

        readOnly: true,
        getter: function () {

            return this;
        }
    });

    //图层
    this.defineProperty("ownerLayer", undefined, {

        readOnly: true,
        getter: function () {

            return this;
        }
    });




    //窗口切换为活动窗口事件
    this.defineEvent("activate");

    //窗口切换为非活动窗口事件
    this.defineEvent("deactivate");




    //开始初始化
    this.beginInit = function () {

        global.initializing = true;
        return this;
    };

    //结束初始化
    this.endInit = function () {

        global.initializing = false;
        return this;
    };




    //设置当前窗口为活动窗口
    this.activate = function (deactivate) {

        var parentWindow = this.parentWindow,
            activateWindow;


        if (parentWindow)
        {
            if (deactivate !== false && (activateWindow = parentWindow["x:activateWindow"]))
            {
                activateWindow["fn:deactivate"]();
            }

            parentWindow["x:activateWindow"] = this;
            this["fn:activate"]();
        }
    };


    //获取活动窗口
    this.getActivateWindow = function () {

        var result = this,
            activateWindow;


        while (activateWindow = result["x:activateWindow"])
        {
            result = activateWindow;
        }

        return result == this ? null : result;
    };


    this["fn:activate"] = function () {

        this.domWindow.style.zIndex = 9991;
        this.dispatchEvent("activate");
    };

    this["fn:deactivate"] = function () {

        this.domWindow.style.zIndex = 9990;
        this.dispatchEvent("deactivate");
    };



    /*

    关于层的顺序 本系统最高层使用9999,默认层为0
    
    拖拉层:     9999
    插入符:     9998
    弹出层:     9997
    活动窗口:   9991
    非活动窗口: 9990
    


    //最大z-index 
    //IE FireFox Safari的z-index最大值是2147483647 。 
    //Opera的最大值是2147483584.。 
    //IE Safari Opera在超过其最大值时按最大值处理。 
    //FireFox 在超过最大值时会数据溢出正负不定,但有一点可以肯定绝对不会高于2147483647层
    //IE FireFox Safari的z-index最小值是-2147483648 
    //Opera的z-index最小值-2147483584 
    //FireFox在-2147483648<=z-index<0时层不显示 在z-index<-2147483648时溢出实际数字正负不定 
    //IE Safari Opera在z-index<0时显示,在小于其最小值时都按其最小值处理

    */

    this.appendLayer = function (zIndex) {

        var storage = this["x:storage"],
            result = layer || new $.Layer();


        if (zIndex)
        {
            result.domLayer.style.zIndex = zIndex;
        }

        result.domCanvas.width = storage.width;
        result.domCanvas.height = storage.height;

        result["x:boxModel"].setUsableRect(null, 0, 0, storage.width, storage.height);
        result["x:parent"] = this;

        result.domLayer["x:ownerWindow"] = result.domCanvas["x:ownerWindow"] = this;

        this.domWindow.appendChild(result.domLayer);
        this.layers.push(result);

        return result;
    };


    this.removeLayer = function (layer) {

        if (layer)
        {
            layer["x:parent"] = layer.domLayer["x:ownerWindow"] = layer.domCanvas["x:ownerWindow"] = null;

            this.domWindow.removeChild(layer.domLayer);
            this.layers.remove(layer);
        }
    };




    this.getControlAt = function (x, y) {

        for (var i = this.layers.length - 1; i >= 0; i--)
        {
            var layer = this.layers[i];

            if (!layer.disableGetControlAt && layer.context.getImageData(x, y, 1, 1).data[3] != 0)
            {
                return $.WindowBase.super.getControlAt.call(layer, x, y);
            }
        }

        return this;
    };





    //计算偏移,处理firefox没有offsetX及offsetY的问题
    function offset(event) {

        if (!event["x:offsetX"])
        {
            var x = 0,
                y = 0,
                target = this.domWindow || event.target;

            while (target)
            {
                x += target.offsetLeft;
                y += target.offsetTop;

                target = target.offsetParent;
            }

            //不能使用offsetX 在IE下无法重赋值
            event["x:offsetX"] = event.clientX - x;
            event["x:offsetY"] = event.clientY - y;
        }
    };


    //触发带mouseDown的鼠标事件
    function dispatchEvent(type, target, domMouseEvent) {

        var event = new $.MouseEvent(type, target, domMouseEvent);
        event.mouseDown = mouseDown;

        target.dispatchEvent(event);
    };


    //控件捕获
    function captureControl(domMouseEvent) {


        var source = global.mouseControl,
            target = this.getControlAt(domMouseEvent["x:offsetX"], domMouseEvent["x:offsetY"]) || this;

        if (target != source)
        {
            global.mouseControl = target;

            if (source)
            {
                source.switchState("hover-states", "leave-animate");
                dispatchEvent("mouseout", source, domMouseEvent);
            }

            if (target && target["x:storage"].enabled)
            {
                this.domWindow.style.cursor = target["fn:cursor"](domMouseEvent);

                target.switchState("hover-states", "hover");

                dispatchEvent("mouseover", target, domMouseEvent);
                dispatchEvent("mousemove", target, domMouseEvent);
            }
        }
    };


    function mousedown(domMouseEvent) {


        var ownerWindow = this["x:ownerWindow"]["x:captureDelay"].execute();


        //设置鼠标按下
        mouseDown = true;



        //处理弹出窗口
        if (ownerWindow != ownerWindow.mainWindow.getActivateWindow()) //活动窗口不是当前点击窗口
        {
            ownerWindow.activate(true);
        }



        //处理鼠标按下事件
        var target = ownerWindow["x:captureControl"] || global.mouseControl;

        if (target && target["x:storage"].enabled)
        {
            offset.call(ownerWindow, domMouseEvent);

            //如果可拖动
            if (dragging = target["x:storage"].draggable || ownerWindow["x:storage"].designMode)
            {
                $.Dragdrop.start(ownerWindow, target, domMouseEvent, true);
            }
            else
            {
                //分发事件
                var event = new $.MouseEvent("mousedown", target, domMouseEvent);
                target.dispatchEvent(event);


                //处理焦点
                var focusControl = ownerWindow["x:focusControl"];

                if (target["x:storage"].focusable)
                {
                    var validate = true;

                    if (focusControl && focusControl != target && (validate = focusControl.validate()))
                    {
                        focusControl["fn:blur"]();
                    }

                    if (validate)
                    {
                        target["fn:focus"](event);
                    }
                }
            }


            //设置捕获(注:setCapture及releaseCapture仅IE支持,不能使用)
            host["x:ownerWindow"] = ownerWindow;

            domMouseEvent.stopPropagation();
        }
    };


    function mousemove(domMouseEvent) {


        var ownerWindow = host["x:ownerWindow"] || domMouseEvent.target["x:ownerWindow"],
            target;


        if (ownerWindow)
        {
            offset.call(ownerWindow, domMouseEvent);

            if (dragging) //处理拖动
            {
                $.Dragdrop.move(domMouseEvent);
            }
            else if (target = ownerWindow["x:captureControl"]) //启用捕获
            {
                if (target["x:storage"].enabled)
                {
                    dispatchEvent("mousemove", target, domMouseEvent);
                }
            }
            else
            {
                ownerWindow["x:captureDelay"].registry([domMouseEvent]); //启用延迟捕获
            }
        }
        else if (target = global.mouseControl)
        {
            global.mouseControl = null;
            target.switchState("hover-states", "leave-animate");

            dispatchEvent("mouseout", target, domMouseEvent);
        }
    };


    function mouseup(domMouseEvent) {


        var ownerWindow = host["x:ownerWindow"];

        if (ownerWindow)
        {
            var target = ownerWindow["x:captureControl"] || global.mouseControl;

            if (target && target["x:storage"].enabled)
            {
                offset.call(ownerWindow, domMouseEvent);

                if (dragging)
                {
                    dragging = false;

                    if (!$.Dragdrop.stop())
                    {
                        return;
                    }
                }

                target.dispatchEvent(new $.MouseEvent("mouseup", target, domMouseEvent));
            }


            //取消捕获
            host["x:ownerWindow"] = null;

            //设置鼠标弹起
            mouseDown = false;
        }
    };



    //鼠标事件翻译方法
    function translateMouseEvent(type, domMouseEvent) {


        var ownerWindow = this["x:ownerWindow"]["x:captureDelay"].execute(),
            target = ownerWindow["x:captureControl"] || global.mouseControl;


        if (target && target["x:storage"].enabled)
        {
            offset.call(ownerWindow, domMouseEvent);
            target.dispatchEvent(new $.MouseEvent(type, target, domMouseEvent));
        }

        domMouseEvent.stopPropagation();
    };

    function click(domMouseEvent) {

        translateMouseEvent.call(this, "click", domMouseEvent);
    };

    function dblclick(domMouseEvent) {

        translateMouseEvent.call(this, "dblclick", domMouseEvent);
    };

    function mousewheel(domMouseEvent) {

        translateMouseEvent.call(this, "mousewheel", domMouseEvent);
    };



    function keydown(domMouseEvent) {

        var ownerWindow = this["x:ownerWindow"],
            focuseControl = ownerWindow["x:focuseControl"];

        //如果有输入焦点控件则发送事件至输入焦点控件
        if (focuseControl && focuseControl["x:storage"].enabled)
        {
            target.dispatchEvent(new $.KeyEvent(domMouseEvent.type, target, domMouseEvent));
        }
        else //否则处理accessKey
        {

        }

    };

    var keypress = keydown, keyup = keydown;





    this["fn:fill"] = function (storage) {

        global.initializing = false;

        var domHost = this.domWindow.parentNode;

        if (domHost)
        {
            var rect = domHost.getBoundingClientRect();

            if (storage)
            {
                this["x:storage"].width = rect.width;
                this["x:storage"].height = rect.height;
            }

            return rect;
        }

        return { width: 0, height: 0 };
    };


    //使区域无效
    this.invalidate = function () {

        this["x:boxModel"].invalidate();

        //绘制窗口内容
        var layers = this.layers,
            i = 0,
            length = layers.length;

        while (i < length)
        {
            layers[i++].registryUpdate();
        }
    };







    ///插入符
    function caret(parentNode) {


        var timer,

            target,
            boxModel,
            textMetrics,
            point,

            div = document.createElement("div"),
            input = document.createElement("input"), //输入助手

            ime = 0; //对中文输入时有输入预览的浏览器进行特殊处理 chrome safari Opera


        div.setAttribute("flyingon", "caret");

        input.type = "text";
        input.setAttribute("flyingon", "input");
        input.setAttribute("style", "position:absolute;z-index:-1;padding:0;border:0;width:1px;height:1px;top:100px;");


        if (navigator.userAgent.match(/MSIE/))
        {
            input.style.width = 0;
        }


        input.onselectstart = function (event) {

            event.stopPropagation();
            return true;
        };


        parentNode.appendChild(div);
        parentNode.appendChild(input);






        function toggle() {

            div.style.visibility = div.style.visibility == "visible" ? "hidden" : "visible";
        };


        function show() {

            var box = boxModel.parent,
                x = point.x,
                y = point.y,
                height = textMetrics.font.lineHeight + 2;


            //处理不完全显示
            if (box)
            {
                var rect = box.innerRect,
                    value;

                if ((value = rect.windowY - y) > 0)
                {
                    y += value;
                    height -= value
                }

                if ((value = y + height - rect.windowY - rect.height) > 0)
                {
                    height -= value;
                }

                if (height < 0)
                {
                    height = 0;
                }
            }

            div.setAttribute("style", "visibility:visible;position:absolute;background-color:black;z-Index:9998;width:1px;left:" + x + "px;top:" + y + "px;height:" + height + "px;");
        };


        //更新控件
        function update() {


            if (timer)
            {
                clearInterval(timer);
            }


            var rect = boxModel.innerRect,
                x = textMetrics.caretEnd.x;


            //自动滚动调整
            if (x < boxModel.scrollLeft)
            {
                boxModel.scrollLeft = x;
            }
            else
            {
                var right = boxModel.scrollLeft + rect.width;

                if (x > right)
                {
                    boxModel.scrollLeft = x - rect.width;
                    x = right;
                }
                else if (right <= rect.width)
                {
                    boxModel.scrollLeft = 0;
                }
            }


            //显示插入符
            point = boxModel.targetToOffset(rect.spaceX + x - boxModel.scrollLeft, rect.spaceY);
            if (x > 0)
            {
                point.x -= 1;
            }


            input.style.left = point.x + "px";
            input.style.top = point.y + "px";


            show();
            timer = setInterval(toggle, 500);


            //更新控件
            target.invalidate();
        };


        //输入字符
        function oninput(text) {

            if (ime >= 0) //输入法
            {
                var value = text.charAt(ime);

                if (value >= "A" && value <= "z")
                {
                    return;
                }

                if (++ime >= text.length)
                {
                    ime = 0;
                    input.value = "";
                }

                text = value;
            }
            else
            {
                ime = 0;
                input.value = "";
            }


            textMetrics.replace(text);
            update.call(this);
        };

        //移动
        function move(selectionTo, textIndex, selected) {

            if (selectionTo)
            {
                textMetrics.selectionTo(textIndex);
                reset();
            }
            else
            {
                textMetrics.moveTo(selected && textMetrics.selectedText ? textMetrics.caretEnd.textIndex : textIndex);
                update.call(this);
            }
        };


        input.onkeypress = function (event) {

            ime = -1; //开启输入法时不会触发
            event.stopPropagation();
        };

        input.onkeyup = function (event) {

            event.stopPropagation();


            var keyCode = event.keyCode;

            switch (keyCode)
            {
                case 8: //BackSpace
                    textMetrics.remove(-1);
                    update.call(this);
                    return;

                case 33: //Prior:
                case 37: //Left:
                    move.call(this, event.shiftKey, textMetrics.caretEnd.textIndex - 1, true);
                    return;

                case 34: //Next:
                case 39: //Right:
                    move.call(this, event.shiftKey, textMetrics.caretEnd.textIndex + 1, true);
                    return;

                case 35: //End:
                    move.call(this, event.shiftKey, textMetrics.text.length);
                    return;

                case 36: //Home:
                    move.call(this, event.shiftKey, 0);
                    return;

                case 38: //Up:
                    return;

                case 40: //Down:
                    return;

                case 46: //Delete
                    textMetrics.remove(1);
                    update.call(this);
                    return;
            }


            if (event.ctrlKey)
            {
                switch (keyCode)
                {

                    case 65: //a A
                        textMetrics.moveTo(0);
                        textMetrics.selectionTo(textMetrics.text.length);
                        reset();
                        return;

                    case 67: //c C
                        return;

                    case 86: //v V
                        textMetrics.replace(input.value);
                        input.value = "";
                        update.call(this);
                        return;

                    case 88: //x X
                        textMetrics.remove(0);
                        update.call(this);
                        return;

                        //case 90: //z Z //undo redo 暂未实现
                        //    return;
                }
            }


            if (keyCode != 17 && !input.readOnly && input.value) //不处理ctrl键
            {
                oninput.call(this, input.value);
            }
        };




        //变更插入符位置
        this["fn:caret"] = function (changedX, changedY) {

            if (boxModel)
            {
                point.x -= changedX;
                point.y -= changedY;

                show();
            }
        };


        //打开输入助手
        this["fn:open:input"] = function (ownerControl, readOnly) {

            target = ownerControl;
            boxModel = ownerControl["x:boxModel"];
            textMetrics = ownerControl["x:textMetrics"];

            input.readOnly = readOnly;
            reset();
        };

        //重置输入助手
        var reset = this["fn:input"] = function () {

            input.focus();
            input.value = textMetrics.selectedText;
            input.select();

            update.call(this);
        };

        //关闭输入助手
        this["fn:close:input"] = function () {

            if (timer)
            {
                clearInterval(timer);
                timer = null;
            }

            div.style.visibility = "hidden";
            input.blur();
        };


    };



});

