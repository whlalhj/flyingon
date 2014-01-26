//窗口基类
flyingon.class("WindowBase", flyingon.Layer, function (Class, flyingon) {



    var host,                       //主容器
        dragging = false,           //是否处理拖动
        mousedown_cache = false;          //鼠标是否按下



    Class.create = function () {


        var div = this.dom_window = document.createElement("div");

        div.setAttribute("flyingon", "window");
        div.setAttribute("style", "position:absolute;z-index:9990;width:100%;height:100%;overflow:hidden;-moz-user-select:none;-webkit-user-select:none;outline:none;cursor:default;");
        div.setAttribute("tabindex", "0");
        div.appendChild(this.dom_layer);

        div.__ownerWindow__ = this.dom_layer.__ownerWindow__ = this.dom_canvas.__ownerWindow__ = this; //缓存当前对象

        //IE禁止选中文本 其它浏览器使用样式控件 -moz-user-select:none;-webkit-user-select:none;
        div.onselectstart = function (event) { return false; };


        this.layers = [this]; //初始化图层
        this.__windows__ = [];   //子窗口集合


        //默认设置为初始化状态,在渲染窗口后终止
        flyingon.__initializing__ = true;

        //绑定dom事件
        this.__fn_binging_event__(div);

        //初始化输入符
        flyingon.__fn_initialize_caret__.call(this, this.dom_window);
    };



    //绑定dom事件
    this.__fn_binging_event__ = function (div) {


        //绑定事件
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
        this.__capture_delay__ = new flyingon.DelayExecutor(10, capture_control, this);
    };


    //所属窗口
    this.defineProperty("ownerWindow", function () {

        return this;
    });

    //图层
    this.defineProperty("ownerLayer", function () {

        return this;
    });




    //窗口切换为活动窗口事件
    this.defineEvent("activate");

    //窗口切换为非活动窗口事件
    this.defineEvent("deactivate");





    //设置当前窗口为活动窗口
    this.activate = function (deactivate) {

        var parentWindow = this.parentWindow,
            activateWindow;


        if (parentWindow)
        {
            if (deactivate !== false && (activateWindow = parentWindow.__activateWindow__))
            {
                activateWindow.__fn_deactivate__();
            }

            parentWindow.__activateWindow__ = this;
            this.__fn_activate__();
        }
    };


    //获取活动窗口
    this.getActivateWindow = function () {

        var result = this,
            activateWindow;


        while (activateWindow = result.__activateWindow__)
        {
            result = activateWindow;
        }

        return result == this ? null : result;
    };



    //定义活动状态
    this.defineStates("activate-states", "activate");


    this.__fn_activate__ = function () {

        this.dom_window.style.zIndex = 9991;
        this.dispatchEvent("activate");
        this.switchState("activate-states", "activate");
    };

    this.__fn_deactivate__ = function () {

        this.dom_window.style.zIndex = 9990;
        this.dispatchEvent("deactivate");
        this.switchState("activate-states", "deactivate");
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

        var result = layer || new flyingon.Layer(),
            dom_layer = result.dom_layer,
            dom_canvas = result.dom_canvas;


        if (zIndex)
        {
            dom_layer.style.zIndex = zIndex;
        }

        dom_canvas.width = this.width;
        dom_canvas.height = this.height;

        result.__boxModel__.measure(null, 0, 0, dom_canvas.width, dom_canvas.height);
        result.__parent__ = this;

        dom_layer.__ownerWindow__ = dom_canvas.__ownerWindow__ = this;

        this.dom_window.appendChild(dom_layer);
        this.layers.push(result);

        return result;
    };


    this.removeLayer = function (layer) {

        if (layer)
        {
            layer.__parent__ = layer.dom_layer.__ownerWindow__ = layer.dom_canvas.__ownerWindow__ = null;

            this.dom_window.removeChild(layer.dom_layer);
            this.layers.remove(layer);
        }
    };



    this.getControlAt = function (x, y) {

        for (var i = this.layers.length - 1; i >= 0; i--)
        {
            var layer = this.layers[i];

            if (!layer.disableGetControlAt && layer.context.getImageData(x, y, 1, 1).data[3] != 0)
            {
                return flyingon.WindowBase.super.getControlAt.call(layer, x, y);
            }
        }

        return this;
    };



    //计算偏移,处理firefox没有offsetX及offsetY的问题
    function offset(event) {

        if (!event.__offsetX__)
        {
            var x = 0,
                y = 0,
                target = this.dom_window || event.target,
                body = document.body;

            while (target)
            {
                x += target.scrollLeft;
                y += target.offsetTop;

                target = target.offsetParent;
            }

            //不能使用offsetX 在IE下无法重赋值
            event.__offsetX__ = event.pageX - x;
            event.__offsetY__ = event.pageY - y;
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


        var source = flyingon.__hover_control__,
            target = this.getControlAt(dom_MouseEvent.__offsetX__, dom_MouseEvent.__offsetY__) || this;

        if (target != source)
        {
            document.title = target.id;

            flyingon.__hover_control__ = target;

            if (source)
            {
                dispatchEvent("mouseout", source, dom_MouseEvent);

                source.switchState("hover-states", "leave-animate");
            }

            if (target && target.enabled)
            {
                this.dom_window.style.cursor = target.__fn_cursor__(dom_MouseEvent);

                dispatchEvent("mouseover", target, dom_MouseEvent);
                dispatchEvent("mousemove", target, dom_MouseEvent);

                target.switchState("hover-states", "hover");
            }
        }
    };


    function mousedown(dom_MouseEvent) {


        var ownerWindow = this.__ownerWindow__.__capture_delay__.execute();


        //设置鼠标按下
        mousedown_cache = true;



        //处理弹出窗口
        if (ownerWindow != ownerWindow.mainWindow.getActivateWindow()) //活动窗口不是当前点击窗口
        {
            ownerWindow.activate(true);
        }


        //处理鼠标按下事件
        var target = ownerWindow.__capture_control__ || flyingon.__hover_control__;

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
                //分发事件
                var event = new flyingon.MouseEvent("mousedown", target, dom_MouseEvent);
                target.dispatchEvent(event);


                //处理焦点
                if (target.focusable)
                {
                    var focused = ownerWindow.__focused_control__;
                    if (focused && focused != target && focused.validate())
                    {
                        focused.__fn_blur__();
                    }

                    target.__fn_focus__(event);
                }
            }


            //设置捕获(注:setCapture及releaseCapture仅IE支持,不能使用)
            host.__ownerWindow__ = ownerWindow;

            dom_MouseEvent.stopPropagation();
        }
    };


    function mousemove(dom_MouseEvent) {


        var ownerWindow = host.__ownerWindow__ || dom_MouseEvent.target.__ownerWindow__,
            target;


        if (ownerWindow)
        {
            offset.call(ownerWindow, dom_MouseEvent);

            if (dragging) //处理拖动
            {
                flyingon.Dragdrop.move(dom_MouseEvent);
            }
            else if (target = ownerWindow.__capture_control__) //启用捕获
            {
                if (target.enabled)
                {
                    dispatchEvent("mousemove", target, dom_MouseEvent);
                }
            }
            else
            {
                ownerWindow.__capture_delay__.registry([dom_MouseEvent]); //启用延迟捕获
            }
        }
        else if (target = flyingon.__hover_control__)
        {
            flyingon.__hover_control__ = null;

            dispatchEvent("mouseout", target, dom_MouseEvent);
            target.switchState("hover-states", "leave-animate");
        }
    };


    function mouseup(dom_MouseEvent) {


        var ownerWindow = host.__ownerWindow__;

        if (ownerWindow)
        {
            var target = ownerWindow.__capture_control__ || flyingon.__hover_control__;

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

                target.dispatchEvent(new flyingon.MouseEvent("mouseup", target, dom_MouseEvent));
            }


            //取消捕获
            host.__ownerWindow__ = null;

            //设置鼠标弹起
            mousedown_cache = false;
        }
    };



    //鼠标事件翻译方法
    function translate_MouseEvent(type, dom_MouseEvent) {


        var ownerWindow = this.__ownerWindow__.__capture_delay__.execute(),
            target = ownerWindow.__capture_control__ || flyingon.__hover_control__;


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

        var ownerWindow = this.__ownerWindow__,
            focused = ownerWindow.__focused_control__;

        //如果有输入焦点控件则发送事件至输入焦点控件
        if (focused && focused.enabled)
        {
            focused.dispatchEvent(new flyingon.KeyEvent(dom_KeyEvent.type, focused, dom_KeyEvent));
        }
        else //否则处理accessKey
        {

        }

    };




    //使区域无效
    this.invalidate = function () {

        this.__boxModel__.invalidate();

        //绘制窗口内容
        var layers = this.layers;

        for (var i = 0, length = layers.length; i < length; i++)
        {
            layers[i].registryUpdate();
        }
    };



    this.__fn_getBoundingClientRect__ = function (fill) {

        flyingon.__initializing__ = false;

        var r = this.dom_window.getBoundingClientRect();

        if (fill) //画布充满窗口
        {
            this.__storage__.width = this.dom_canvas.width = r.width;
            this.__storage__.height = this.dom_canvas.height = r.height;
        }

        return r;
    };

    //重新调整窗口大小
    this.__fn_resize__ = function (offsetX, offsetY, width, height) {

        var layers = this.layers;

        for (var i = 0, length = layers.length; i < length; i++)
        {
            var layer = layers[i],
                canvas = layer.dom_canvas,
                box = layer.__boxModel__;

            layer.unregistryUpdate();

            canvas.width = width; //清空画布
            canvas.height = height;

            box.measure(null, offsetX, offsetY, width - offsetX, height - offsetY);
            box.render(layer.context);
        }
    };



}, true);

