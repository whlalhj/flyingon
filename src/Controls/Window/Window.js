//窗口扩展服务
flyingon.window_extender = function (base, flyingon) {


    //flyingon.__capture_control:   当前捕获控件
    //flyingon.__hover_control:     当前鼠标指向的控件


    var host,                       //主容器
        mousedown_state = false,    //鼠标是否按下

        Dragdrop = flyingon.Dragdrop,

        Event = flyingon.Event,
        MouseEvent = flyingon.MouseEvent,
        KeyEvent = flyingon.KeyEvent;



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

        complete: "this.dom_window.style.opacity = value;"
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
                if (target !== root)
                {
                    target.dom_window.style.zIndex = 9990;
                }

                target.dispatchEvent(new Event("deactivate", target), true);
                target.stateTo("active", false);
            }

            root.__activeWindow = this;

            if (this !== root)
            {
                this.dom_window.style.zIndex = 9991;
            }

            this.dispatchEvent(new Event("activate", this), true);
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

    this.appendLayer = function (zIndex, disable_findAt) {

        var layer = new flyingon.Layer(this.dom_window),
            dom_layer = layer.dom_layer,
            dom_canvas = layer.dom_canvas;

        if (zIndex)
        {
            dom_layer.style.zIndex = zIndex;
        }

        if (disable_findAt) //禁止查找控件
        {
            layer.disable_findAt = true;
        }

        layer.__parent = this;
        layer.measure(dom_canvas.width = this.width, dom_canvas.height = this.height);
        layer.locate(0, 0);

        dom_layer.__ownerWindow = dom_canvas.__ownerWindow = this;

        this.layers.push(layer);

        return layer;
    };


    this.removeLayer = function (layer) {

        if (layer)
        {
            layer.__parent = layer.dom_layer.__ownerWindow = layer.dom_canvas.__ownerWindow = null;

            this.dom_window.removeChild(layer.dom_layer);

            if ((layer = this.layers.indexOf(layer)) >= 0)
            {
                this.layers.splice(layer, 1);
            }
        }
    };


    //切换输入焦点
    this.__fn_switch_focus = function (target) {

        var focused;

        if (target.focusable && (focused = this.__focused_control) !== target)
        {
            if (focused && focused.validate())
            {
                focused.__fn_blur();
            }

            target.__fn_focus(event);
        }
    };


    this.fintAt = function (x, y) {

        for (var i = this.layers.length - 1; i >= 0; i--)
        {
            var layer = this.layers[i];

            if (!layer.disable_findAt && (i === 0 || layer.context.getImageData(x, y, 1, 1).data[3] !== 0))
            {
                return base.fintAt.call(layer, x, y);
            }
        }

        return this;
    };



    //计算画布坐标(相对画布节点的偏移),处理firefox没有offsetX及offsetY的问题
    function compute_canvas(dom_window, event) {

        var x = 0,
            y = 0,
            target = dom_window || event.target;

        while (target)
        {
            x += target.offsetLeft;
            y += target.offsetTop;

            target = target.offsetParent;
        }

        //不能使用offsetX属性 在IE下offsetX属性只读
        event.canvasX = event.pageX - x;
        event.canvasY = event.pageY - y;

        return dom_window;
    };



    //控件捕获
    function capture_control(dom_event) {

        compute_canvas(this.dom_window, dom_event);

        var source = flyingon.__hover_control,
            target = this.fintAt(dom_event.canvasX, dom_event.canvasY) || this;

        if (target !== source)
        {
            flyingon.__hover_control = target;

            if (source && source.enabled)
            {
                source.stateTo("hover", false);
                source.dispatchEvent(new MouseEvent("mouseout", source, dom_event), true);
            }

            if (target && target.enabled)
            {
                this.dom_window.style.cursor = target.cursor;

                target.stateTo("hover", true);
                target.dispatchEvent(new MouseEvent("mouseover", target, dom_event), true);

                dispatch_mousemove(target, dom_event, true);
            }
        }
        else if (target)
        {
            dispatch_mousemove(target, dom_event, true);
        }
    };


    //触发mousemove事件
    function dispatch_mousemove(target, dom_event, bubble) {

        var event = new MouseEvent("mousemove", target, dom_event);
        event.mousedown = mousedown_state;
        target.dispatchEvent(event, bubble);
    };


    function mousedown(dom_event) {

        //处理延时并捕获当前窗口
        var ownerWindow = this.__ownerWindow.__capture_delay.execute();

        //处理弹出窗口
        if (ownerWindow !== ownerWindow.activeWindow) //活动窗口不是当前点击窗口
        {
            ownerWindow.setActive();
        }

        //记录鼠标按下状态
        mousedown_state = true;

        //处理鼠标按下事件
        var capture = flyingon.__capture_control,
            target = capture || flyingon.__hover_control;

        if (target && target.enabled)
        {
            compute_canvas(ownerWindow.dom_window, dom_event);

            //如果可拖动
            if (target.draggable)
            {
                //设置活动状态
                target.stateTo("active", true);

                //开始拖动
                Dragdrop.start(ownerWindow, target, dom_event, true);
            }
                //else if (ownerWindow.designMode)
                //{
                //    Dragdrop.start(ownerWindow, target, dom_event, true);
                //}
            else
            {
                //设置活动状态
                target.stateTo("active", true);

                //切换输入焦点
                ownerWindow.__fn_switch_focus(target);

                //分发事件 捕获控件时不按冒泡方式分发(仅分发至目标控件而不分发至父控件)
                target.dispatchEvent(new MouseEvent("mousedown", target, dom_event), capture !== target);
            }

            //取消冒泡
            dom_event.stopImmediatePropagation();
        }
    };


    function mousemove(dom_event) {

        var ownerWindow = host.__ownerWindow,
            target;

        if (ownerWindow)
        {
            if (target = flyingon.__capture_control) //启用捕获
            {
                compute_canvas(ownerWindow.dom_window, dom_event); //计算画布坐标
                dispatch_mousemove(target, dom_event, false);  //直接分发至目标控件(不分发至父控件)
                return;
            }

            if (Dragdrop.state > 0) //处理拖动
            {
                compute_canvas(ownerWindow.dom_window, dom_event); //计算画布坐标
                Dragdrop.move(dom_event);   //拖动
                return;
            }

            if (ownerWindow !== dom_event.target.__ownerWindow) //如果窗口与当前控件所属窗口不同则立即处理原注册mousemove事件
            {
                if ((target = flyingon.__hover_control) && target.enabled)
                {
                    target.stateTo("hover", false);
                    target.dispatchEvent(new MouseEvent("mouseout", target, dom_event), true);
                }

                ownerWindow.__capture_delay.cancel(); //取消原延时事件
                ownerWindow = null;
            }
        }

        if (ownerWindow || (ownerWindow = host.__ownerWindow = dom_event.target.__ownerWindow))
        {
            ownerWindow.__capture_delay.registry(dom_event); //启用延迟捕获
        }
    };


    function mouseup(dom_event) {

        var ownerWindow = host.__ownerWindow;

        if (ownerWindow)
        {
            var capture = flyingon.__capture_control,
                target = capture || flyingon.__hover_control;

            if (target && target.enabled)
            {
                //计算画布坐标
                compute_canvas(ownerWindow.dom_window, dom_event);

                //如果处于拖动状态则先停止拖动
                if (Dragdrop.state > 0)
                {
                    Dragdrop.stop();
                }

                //取消活动状态
                target.stateTo("active", false);

                //分发事件 捕获控件时不按冒泡方式分发(仅分发至目标控件而不分发至父控件)
                target.dispatchEvent(new MouseEvent("mouseup", target, dom_event), capture !== target);
            }
        }

        //取消鼠标按下状态
        mousedown_state = false;
    };



    //鼠标事件翻译方法
    function translate_MouseEvent(type, dom_event) {

        var ownerWindow = this.__ownerWindow.__capture_delay.execute(),
            capture = flyingon.__capture_control,
            target = capture || flyingon.__hover_control;

        if (target && target.enabled)
        {
            //计算画布坐标
            compute_canvas(ownerWindow.dom_window, dom_event);

            //分发事件 捕获控件时不按冒泡方式分发(仅分发至目标控件而不分发至父控件)
            target.dispatchEvent(new MouseEvent(type, target, dom_event), capture !== target);
        }

        dom_event.stopImmediatePropagation();
    };

    function click(dom_event) {

        translate_MouseEvent.call(this, "click", dom_event);
    };

    function dblclick(dom_event) {

        translate_MouseEvent.call(this, "dblclick", dom_event);
    };

    function mousewheel(dom_event) {

        translate_MouseEvent.call(this, "mousewheel", dom_event);
    };



    function key_event(dom_KeyEvent) {

        var ownerWindow = this.__ownerWindow,
            focused = ownerWindow.__focused_control;

        //如果有输入焦点控件则分发事件(不使用冒泡方式分布直接分发至焦点控件)至输入焦点控件
        if (focused && focused.enabled && focused.dispatchEvent(new KeyEvent(dom_KeyEvent.type, focused, dom_KeyEvent), false))
        {
            return;
        }

        //否则处理accessKey
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
    this.__fn_update_window = function (width, height) {

        var layers = this.layers;

        for (var i = 0, _ = layers.length; i < _; i++)
        {
            var layer = layers[i],
                canvas = layer.dom_canvas;

            canvas.width = width; //清空画布
            canvas.height = height;

            layer.__unregistry_update();

            layer.measure(width, height);
            layer.render(layer.painter);
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



    Class.combine_create = true;

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




    //修改宽度属性
    this.defineProperty("width", function () {

        return this.dom_canvas.width;
    });

    //修改高度属性
    this.defineProperty("height", function () {

        return this.dom_canvas.height;
    });



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
        this.__fn_update_window(rect.width, rect.height);
    };


});



