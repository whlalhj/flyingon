//窗口扩展服务
flyingon.window_extender = function (base, flyingon) {



    var host,                       //主容器
        dragging = false,           //是否处理拖动
        mousedown_cache = false;    //鼠标是否按下



    this.__fn_create = function () {


        var div = this.dom_window = document.createElement("div");

        div.setAttribute("flyingon", "window");
        div.setAttribute("style", "position:absolute;z-index:9990;width:100%;height:100%;overflow:hidden;-moz-user-select:none;-webkit-user-select:none;outline:none;cursor:default;");
        div.setAttribute("tabindex", "0");

        //执行图层扩展
        flyingon.layer_extender.call(this, div);

        //缓存当前对象
        div.__ownerWindow = this.dom_layer.__ownerWindow = this.dom_canvas.__ownerWindow = this;

        //IE禁止选中文本 其它浏览器使用样式控件 -moz-user-select:none;-webkit-user-select:none;
        div.onselectstart = function (event) { return false; };


        //初始化图层
        this.layers = [this];


        //默认设置为初始化状态,在渲染窗口后终止
        flyingon.__initializing = true;

        //绑定dom事件
        div.addEventListener("mousedown", mousedown, true);

        //宿主
        if (!host)
        {
            host = document.documentElement;

            //样式说明: 禁止选中文本: -moz-user-select:none;-webkit-user-select:none;
            host.setAttribute("style", "-moz-user-select:none;-webkit-user-select:none;");

            host.addEventListener("mousemove", mousemove, false);   //注册顶级dom以便捕获鼠标
            host.addEventListener("mouseup", mouseup, false);       //注册顶级dom以便捕获鼠标
        }


        div.addEventListener("click", click, true);
        div.addEventListener("dblclick", dblclick, true);

        div.addEventListener("mousewheel", mousewheel, true);
        div.addEventListener("DOMMouseScroll", mousewheel, true); //firefox

        div.addEventListener("keydown", key_event, true);
        div.addEventListener("keypress", key_event, true);
        div.addEventListener("keyup", key_event, true);


        //创建控件捕获延迟执行器
        this.__capture_delay = new flyingon.DelayExecutor(10, capture_control, this);


        //初始化输入符
        flyingon.__fn_initialize_caret.call(this, this.dom_window);
    };




    //主窗口
    this.defineProperty("mainWindow", function () {

        return this.__mainWindow || null;
    });


    //活动窗口
    this.defineProperty("activeWindow", function () {

        return this.__mainWindow && this.__mainWindow.__activeWindow || null;
    });


    //父窗口
    this.defineProperty("parentWindow", function () {

        return this.__parentWindow || null;
    });


    //所属窗口
    this.defineProperty("ownerWindow", function () {

        return this;
    });



    //修改透明度属性
    this.defineProperty("opacity", 1, {

        complete: "this.dom_layer.style.opacity = value;"
    });

    //修改宽度属性
    this.defineProperty("width", function () {

        return this.dom_canvas.width;
    });

    //修改高度属性
    this.defineProperty("height", function () {

        return this.dom_canvas.height;
    });



    //窗口切换为活动窗口事件
    this.defineEvent("activate");

    //窗口切换为非活动窗口事件
    this.defineEvent("deactivate");






    //设置当前窗口为活动窗口
    this.setActive = function () {

        var root = this.mainWindow,
            target;

        if ((target = root.activeWindow) !== this)
        {
            if (target)
            {
                target.dom_window.style.zIndex = 9990;
                target.dispatchEvent("deactivate");
                target.stateTo("active", false);
            }

            root.__activeWindow = this;

            this.dom_window.style.zIndex = 9991;
            this.dispatchEvent("activate");
            this.stateTo("active", true);
        }
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

    this.appendLayer = function (zIndex, layer) {

        var result = layer || new flyingon.Layer(this.dom_window),
            dom_layer = result.dom_layer,
            dom_canvas = result.dom_canvas;

        if (zIndex)
        {
            dom_layer.style.zIndex = zIndex;
        }

        result.__parent = this;
        result.measure(dom_canvas.width = this.width, dom_canvas.height = this.height);
        result.locate(0, 0);

        dom_layer.__ownerWindow = dom_canvas.__ownerWindow = this;

        this.layers.push(result);

        return result;
    };


    this.removeLayer = function (layer) {

        if (layer)
        {
            layer.__parent = layer.dom_layer.__ownerWindow = layer.dom_canvas.__ownerWindow = null;

            this.dom_window.removeChild(layer.dom_layer);
            this.layers.splice(this.layers.indexOf(layer), 0, 1);
        }
    };



    this.hitTest = function (x, y) {

        for (var i = this.layers.length - 1; i >= 0; i--)
        {
            var layer = this.layers[i];

            if (!layer.disableGetControlAt && layer.context.getImageData(x, y, 1, 1).data[3] !== 0)
            {
                return base.hitTest.call(layer, x, y);
            }
        }

        return this;
    };



    //计算画布坐标(相对画布节点的偏移),处理firefox没有offsetX及offsetY的问题
    function offset(event) {

        if (!event.canvasX)
        {
            var x = 0,
                y = 0,
                target = this.dom_window || event.target;

            while (target)
            {
                x += target.offsetLeft;
                y += target.offsetTop;

                target = target.offsetParent;
            }

            //不能使用offsetX 在IE下无法重赋值
            event.canvasX = event.pageX - x;
            event.canvasY = event.pageY - y;
        }
    };


    //触发带mousedown的鼠标事件
    function dispatchEvent(type, target, dom_MouseEvent) {

        var event = new flyingon.MouseEvent(type, target, dom_MouseEvent);
        event.mousedown = mousedown_cache;

        target.dispatchEvent(event);
    };


    //控件捕获
    function capture_control(dom_MouseEvent) {

        var source = flyingon.__hover_control,
            target = this.hitTest(dom_MouseEvent.canvasX, dom_MouseEvent.canvasY) || this;

        if (target !== source)
        {
            document.title = target.id;

            flyingon.__hover_control = target;

            if (source)
            {
                source.stateTo("hover", false);
                dispatchEvent("mouseout", source, dom_MouseEvent);
            }

            if (target && target.enabled)
            {
                this.dom_window.style.cursor = target.cursor;
                target.stateTo("hover", true);

                dispatchEvent("mouseover", target, dom_MouseEvent);
                dispatchEvent("mousemove", target, dom_MouseEvent);
            }
        }
    };


    function mousedown(dom_MouseEvent) {

        //处理延时
        var ownerWindow = this.__ownerWindow.__capture_delay.execute();

        //设置鼠标按下
        mousedown_cache = true;

        //处理弹出窗口
        if (ownerWindow !== ownerWindow.activeWindow) //活动窗口不是当前点击窗口
        {
            ownerWindow.setActive();
        }

        //处理鼠标按下事件
        var target = ownerWindow.__capture_control || flyingon.__hover_control;

        if (target && target.enabled)
        {
            offset.call(ownerWindow, dom_MouseEvent);

            //如果可拖动
            if (dragging = target.draggable || ownerWindow.designMode)
            {
                flyingon.Dragdrop.start(ownerWindow, target, dom_MouseEvent, true);
            }
            else
            {
                target.stateTo("active", true);

                //处理焦点
                if (target.focusable)
                {
                    var focused = ownerWindow.__focused_control;
                    if (focused && focused !== target && focused.validate())
                    {
                        focused.__fn_blur();
                    }

                    target.__fn_focus(event);
                }

                //分发事件
                var event = new flyingon.MouseEvent("mousedown", target, dom_MouseEvent);
                target.dispatchEvent(event);
            }

            //设置捕获(注:setCapture及releaseCapture仅IE支持,不能使用)
            host.__ownerWindow = ownerWindow;

            //取消冒泡
            dom_MouseEvent.stopPropagation();
        }
    };


    function mousemove(dom_MouseEvent) {

        var ownerWindow = host.__ownerWindow || dom_MouseEvent.target.__ownerWindow,
            target;

        if (ownerWindow)
        {
            offset.call(ownerWindow, dom_MouseEvent);

            if (dragging) //处理拖动
            {
                flyingon.Dragdrop.move(dom_MouseEvent);
            }
            else if (target = ownerWindow.__capture_control) //启用捕获
            {
                if (target.enabled)
                {
                    dispatchEvent("mousemove", target, dom_MouseEvent);
                }
            }
            else
            {
                ownerWindow.__capture_delay.registry([dom_MouseEvent]); //启用延迟捕获
            }
        }
        else if (target = flyingon.__hover_control)
        {
            flyingon.__hover_control = null;

            target.stateTo("hover", false);
            dispatchEvent("mouseout", target, dom_MouseEvent);
        }
    };


    function mouseup(dom_MouseEvent) {

        var ownerWindow = host.__ownerWindow;

        if (ownerWindow)
        {
            var target = ownerWindow.__capture_control || flyingon.__hover_control;

            if (target && target.enabled)
            {
                offset.call(ownerWindow, dom_MouseEvent);

                if (dragging)
                {
                    dragging = false;

                    if (!flyingon.Dragdrop.stop())
                    {
                        return;
                    }
                }

                target.stateTo("active", false);
                target.dispatchEvent(new flyingon.MouseEvent("mouseup", target, dom_MouseEvent));
            }

            //取消捕获
            host.__ownerWindow = null;

            //设置鼠标弹起
            mousedown_cache = false;
        }
    };



    //鼠标事件翻译方法
    function translate_MouseEvent(type, dom_MouseEvent) {

        var ownerWindow = this.__ownerWindow.__capture_delay.execute(),
            target = ownerWindow.__capture_control || flyingon.__hover_control;

        if (target && target.enabled)
        {
            offset.call(ownerWindow, dom_MouseEvent);
            target.dispatchEvent(new flyingon.MouseEvent(type, target, dom_MouseEvent));
        }

        dom_MouseEvent.stopPropagation();
    };

    function click(dom_MouseEvent) {

        translate_MouseEvent.call(this, "click", dom_MouseEvent);
    };

    function dblclick(dom_MouseEvent) {

        translate_MouseEvent.call(this, "dblclick", dom_MouseEvent);
    };

    function mousewheel(dom_MouseEvent) {

        translate_MouseEvent.call(this, "mousewheel", dom_MouseEvent);
    };



    function key_event(dom_KeyEvent) {

        var ownerWindow = this.__ownerWindow,
            focused = ownerWindow.__focused_control;

        //如果有输入焦点控件则发送事件至输入焦点控件
        if (focused && focused.enabled)
        {
            focused.dispatchEvent(new flyingon.KeyEvent(dom_KeyEvent.type, focused, dom_KeyEvent));
        }
        else //否则处理accessKey
        {

        }
    };



    //获取窗口范围
    this.__fn_clientRect = function (fill) {

        flyingon.__initializing = false;

        var rect = this.dom_window.getBoundingClientRect();

        if (fill) //画布充满窗口
        {
            this.__fields.width = this.dom_canvas.width = rect.width;
            this.__fields.height = this.dom_canvas.height = rect.height;
        }

        return rect;
    };

    //重绘窗口
    this.__fn_update = function (x, y, width, height) {

        var layers = this.layers;

        for (var i = 0, _ = layers.length; i < _; i++)
        {
            var layer = layers[i],
                canvas = layer.dom_canvas;

            canvas.width = width; //清空画布
            canvas.height = height;

            layer.__unregistry_update();

            layer.measure(width - x, height - y);
            layer.locate(x, y);

            layer.__fn_render(layer.painter);
        }
    };





    //开始初始化
    flyingon.beginInit = function () {

        flyingon.__initializing = true;
    };

    //结束初始化
    flyingon.endInit = function () {

        flyingon.__initializing = false;
    };


};




//主窗口
flyingon.defineClass("Window", flyingon.Panel, function (Class, base, flyingon) {



    flyingon.window_extender.call(this, base, flyingon);



    Class.create = function (host) {

        this.__fn_create();

        var div = this.dom_host = document.createElement("div");

        div.setAttribute("flyingon", "window-host");
        div.setAttribute("style", "position:relative;width:100%;height:100%;overflow:hidden;");
        div.appendChild(this.dom_window);

        host && host.appendChild(div);

        //设为活动窗口
        this.setActive();

        //绑定resize事件
        var self = this;
        window.addEventListener("resize", function (event) {

            self.update();

        }, true);
    };




    //主窗口
    this.defineProperty("mainWindow", function () {

        return this;
    });


    //活动窗口
    this.defineProperty("activeWindow", function () {

        return this.__activeWindow || this;
    });


    //父窗口
    this.defineProperty("parentWindow", function () {

        return null;
    });



    //刷新窗口
    this.update = function () {

        var rect = this.__fn_clientRect(true);
        this.__fn_update(0, 0, rect.width, rect.height);
    };


}, true);



