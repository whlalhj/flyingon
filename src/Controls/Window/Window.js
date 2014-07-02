//窗口扩展服务
flyingon.window_extender = function (base, flyingon) {


    var host,                       //主容器

        Event = flyingon.Event,
        KeyEvent = flyingon.KeyEvent,
        MouseEvent = flyingon.MouseEvent,

        dragging,                   //是否拖动状态
        dragdrop = flyingon.dragdrop,

        hover_control,              //鼠标指向控件
        capture_control,            //鼠标捕获控件

        start_event = null;         //关联的鼠标开始事件(mousedown事件)




    this.__fn_create = function () {


        var self = this,
            div = this.dom_window = document.createElement("div");

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
        div.addEventListener("mousedown", handle_mousedown);

        //宿主
        if (!host)
        {
            host = document.documentElement;

            //样式说明: 禁止选中文本: -moz-user-select:none;-webkit-user-select:none;
            host.setAttribute("style", "-moz-user-select:none;-webkit-user-select:none;");

            host.addEventListener("mousemove", handle_mousemove);   //注册顶级dom以便捕获鼠标
            host.addEventListener("mouseup", handle_mouseup);       //注册顶级dom以便捕获鼠标
        }


        div.addEventListener("click", handle_click);
        div.addEventListener("dblclick", handle_dblclick);

        div.addEventListener("mousewheel", handle_mousewheel);
        div.addEventListener("DOMMouseScroll", handle_mousewheel); //firefox

        div.addEventListener("keydown", handle_key_event);
        div.addEventListener("keypress", handle_key_event);
        div.addEventListener("keyup", handle_key_event);


        //初始化输入符
        //flyingon.__fn_initialize_caret.call(this, this.dom_window);
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

        minValue: 0,
        maxValue: 1,
        complete: "this.dom_window.style.opacity = value;"
    });



    //窗口切换为活动窗口事件
    this.defineEvent("activate");

    //窗口切换为非活动窗口事件
    this.defineEvent("deactivate");






    //设置当前窗口为活动窗口
    this.active = function () {

        var root = this.mainWindow,
            target;

        if ((target = root.__activeWindow) !== this)
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

            this.dispatchEvent(new Event("activate", this));

            root.__activeWindow = this;
            host.__ownerWindow = this;

            if (this !== root)
            {
                this.dom_window.style.zIndex = 9991;
            }

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




    //设置捕获控件
    this.__fn_capture_control = function (target) {

        capture_control = target;
    };




    function handle_mousedown(dom_event) {

        //立即处理鼠标指向
        var ownerWindow = this.__ownerWindow,
            target = capture_control = hover_control, //点击自动锁定当前控件
            focused;

        //处理弹出窗口
        if (ownerWindow !== ownerWindow.activeWindow) //活动窗口不是当前点击窗口
        {
            ownerWindow.active();
        }

        //如果可拖动
        if (target.draggable && dragdrop.start(target, dom_event))
        {
            dragging = true; //标记拖动状态
        }
        else if (target && target.enabled)
        {
            //初始化允许点击事件
            flyingon.__disable_click = flyingon.__disable_dbclick = false;

            //切换输入焦点
            if (target.focusable && (focused = this.__focused_control) !== target)
            {
                if (focused && focused.validate())
                {
                    focused.__fn_blur();
                }

                target.__fn_focus(dom_event);
            }

            //分发事件
            start_event = new MouseEvent("mousedown", target, dom_event);
            target.dispatchEvent(start_event);

            //设置活动状态
            target.stateTo("active", true);
        }
    };


    function handle_mousemove(dom_event) {

        var cache;

        if (dragging) //处理拖动
        {
            dragdrop.move(dom_event);
        }
        else if (cache = capture_control) //启用捕获
        {
            cache.dispatchEvent(new MouseEvent("mousemove", cache, dom_event, start_event));
        }
        else
        {
            var ownerWindow = host.__ownerWindow,
                target = ownerWindow.fintAt(dom_event.canvasX, dom_event.__canvasY) || ownerWindow;

            if (target.enabled)
            {
                if (target !== (cache = hover_control))
                {
                    if (cache && cache.enabled)
                    {
                        cache.dispatchEvent(new MouseEvent("mouseout", cache, dom_event, start_event), true);
                        cache.stateTo("hover", false);
                    }

                    hover_control = target;
                    ownerWindow.dom_window.style.cursor = target.cursor;

                    target.dispatchEvent(new MouseEvent("mouseover", target, dom_event, start_event));
                    target.stateTo("hover", true);
                }

                target.dispatchEvent(new MouseEvent("mousemove", target, dom_event, start_event));
            }
        }
    };


    function handle_mouseup(dom_event) {

        //如果处于拖动状态则停止拖动
        if (dragging)
        {
            flyingon.__disable_click = flyingon.__disable_dbclick = true;  //取消click及dbclick事件
            dragdrop.stop(dom_event); //停止拖动
            dragging = false;
        }
        else
        {
            var target = capture_control || hover_control;

            if (target && target.enabled)
            {
                //分发事件
                target.dispatchEvent(new MouseEvent("mouseup", target, dom_event, start_event));

                //取消活动状态
                target.stateTo("active", false);
            }
        }

        //取消捕获
        capture_control = null;

        //取消鼠标按下状态
        start_event = null;
    };




    //dom鼠标事件顺序: mousedown -> mouseup -> click -> mousedown -> mouseup -> click -> dblclick
    function translate_mouse_event(type, dom_event) {

        var target = capture_control || hover_control;

        if (target && target.enabled)
        {
            return target.dispatchEvent(new MouseEvent(type, target, dom_event));
        }
    };

    function handle_click(dom_event) {

        if (flyingon.__disable_click)
        {
            flyingon.__disable_click = false;
        }
        else
        {
            translate_mouse_event("click", dom_event);
        }
    };

    function handle_dblclick(dom_event) {

        if (flyingon.__disable_dbclick)
        {
            flyingon.__disable_dbclick = false;
        }
        else
        {
            translate_mouse_event("dblclick", dom_event);
        }
    };

    function handle_mousewheel(dom_event) {

        translate_mouse_event("mousewheel", dom_event);
    };



    function handle_key_event(dom_event) {

        var ownerWindow = this.__ownerWindow,
            focused = ownerWindow.__focused_control;

        //如果有输入焦点控件则分发事件至输入焦点控件
        if (focused && focused.enabled && focused.dispatchEvent(new KeyEvent(dom_event.type, focused, dom_event)))
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



    Class.create_mode = "merge";

    Class.create = function (host) {

        this.__fn_create();

        var self = this,
            div = this.dom_host = document.createElement("div");

        div.setAttribute("flyingon", "window-host");
        div.setAttribute("style", "position:relative;width:100%;height:100%;overflow:hidden;");
        div.appendChild(this.dom_window);

        host && host.appendChild(div);

        //绑定resize事件
        window.addEventListener("resize", function (event) { self.update(); });

        //设为活动窗口
        this.active();
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



