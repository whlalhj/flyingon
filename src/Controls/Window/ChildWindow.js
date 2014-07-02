
//弹出窗口
(function (flyingon) {


    //窗口标题栏按钮
    var tool_button = flyingon.defineClass(flyingon.Control, function (Class, base, flyingon) {


        this.defaultValue("width", 16);


        //图片
        this.image = null;


        //绘制图像
        this.paint = function (painter) {

            var image = this.__fn_state_image(this.image);

            if (image)
            {
                painter.paint_image(image, this.clientX, this.clientY, this.clientWidth, this.clientHeight, "center", "middle");
            }
        };


    });




    //窗口标题栏
    var window_header = flyingon.defineClass(flyingon.Control, function (Class, base, flyingon) {



        var layout_dock = flyingon.layouts["dock"],
            offsetX,
            offsetY;



        Class.merge_create = true;

        Class.create = function (parent) {

            this.__parent = parent;
            this.__additions = true;
            this.__children = this.__visible_items = new flyingon.ControlCollection(this);

            this.__fn_button("window-icon", "left");
            this.__fn_button("window-close", "right", function () { parent.close(); });

            this.__fn_initialize_className("window-header");
        };



        this.defaultValue("focusable", false);



        this.__fn_button = function (image, dock, click) {

            var result = new tool_button();

            result.image = image;
            result.dock = dock;

            this.__fn_initialize_className("window-header-button");

            click && (result.onclick = function (event) {

                click.call(this);
            });

            this.__children.append(result);
            return result;
        };



        this.__event_bubble_mousedown = function (event) {

            var parent = this.__parent;

            event = event.dom_event;

            offsetX = parent.left - event.clientX;
            offsetY = parent.top - event.clientY;
        };

        this.__event_bubble_mousemove = function (event) {

            if (event.which === 1) //鼠标左键被按下
            {
                var parent = this.__parent,
                    root = parent.mainWindow,
                    style = parent.dom_window.style,
                    x = (event = event.dom_event).clientX + offsetX,
                    y = event.clientY + offsetY;

                if (x < 0)
                {
                    x = 0;
                }
                else if (x >= root.width)
                {
                    x = root.width - 8;
                }

                if (y < 0)
                {
                    y = 0;
                }
                else if (y > root.height)
                {
                    y = root.height - 8;
                }

                style.left = (parent.left = x) + "px";
                style.top = (parent.top = y) + "px";
            }
        };



        //排列子控件
        this.__fn_arrange = function () {

            var items = this.__children;

            if (items && items.length > 0)
            {
                layout_dock.call(this, items);

                //执行rtl变换
                if (this.direction === "rtl")
                {
                    this.__fn_arrange_rtl(items);
                }
            }

            this.__arrange_dirty = false;
        };


    });




    //子窗口
    flyingon.defineClass("ChildWindow", flyingon.Panel, function (Class, base, flyingon) {



        Class.create = function () {

            this.__fn_create();
            this.header = new window_header(this);
        };




        flyingon.window_extender.call(this, base, flyingon);


        //窗口宽度
        this.defaultValue("width", 640);

        //窗口高度
        this.defaultValue("height", 480);


        //是否充满容器
        this.defineProperty("fill", false, {

            change: "this.update();"
        });


        //窗口起始位置 center:居中  manual:自定义
        this.defineProperty("start", "center");


        //是否可调整大小
        this.defineProperty("resizable", true);



        this.defineEvent("closing");

        this.defineEvent("closed");




        //默认位置变更处理
        this.__event_bubble_change = function (event) {

            switch (event.name)
            {
                case "left":
                case "top":
                    this.dom_window.style[event.name] = event.value + "px";
                    break;
            }
        };




        var resize_side,        //可调整大小的边(left, top, right, bottom或两者组合)
            resize_start;       //开始调整大小时的状态

        this.__event_capture_mousedown = function (event) {

            if (resize_side)
            {
                var dom = event.dom_event;

                resize_start = {

                    clientX: dom.clientX,
                    clientY: dom.clientY,
                    x: this.left,
                    y: this.top,
                    width: +this.width,
                    height: +this.height
                };

                event.stopImmediatePropagation();
            }
        };

        this.__event_capture_mousemove = function (event) {

            if (resize_start)
            {
                var dom = event.dom_event,
                    start = resize_start,
                    side = resize_side,
                    fieds = this.__style,
                    style = this.dom_window.style;

                if (side.left)
                {
                    if ((fieds.left = dom.clientX + start.x - start.clientX) < 0)
                    {
                        fieds.left = 0;
                    }

                    fieds.width = start.width + start.x - fieds.left;
                }
                else if (side.right)
                {
                    fieds.width = start.width + dom.clientX - start.clientX;
                }

                if (side.top)
                {
                    if ((fieds.top = dom.clientY + start.y - start.clientY) < 0)
                    {
                        fieds.top = 0;
                    }

                    fieds.height = start.height + start.y - fieds.top;
                }
                else if (side.bottom)
                {
                    fieds.height = start.height + dom.clientY - start.clientY;
                }

                this.update();

                event.stopImmediatePropagation();
            }
            else if (event.which === 0)
            {
                var style = this.dom_window.style;

                if (this.resizable) //计算当前位置的调整大小类型
                {
                    var x = event.canvasX,
                        y = event.canvasY,
                        width = +this.width,
                        height = +this.height,
                        cursor;

                    resize_side = null;

                    if (x > 0 && x <= 4)
                    {
                        cursor = "w-resize";
                        resize_side = { left: true };
                    }
                    else if (x < width && x >= width - 4)
                    {
                        cursor = "e-resize";
                        resize_side = { right: true };
                    }

                    if (y > 0 && y <= 4)
                    {
                        if (resize_side)
                        {
                            cursor = resize_side.left ? "nw-resize" : "ne-resize";
                            resize_side.top = true;
                        }
                        else
                        {
                            cursor = "n-resize";
                            resize_side = { top: true };
                        }
                    }
                    else if (y < height && y >= height - 4)
                    {
                        if (resize_side)
                        {
                            cursor = resize_side.left ? "sw-resize" : "se-resize";
                            resize_side.bottom = true;
                        }
                        else
                        {
                            cursor = "s-resize";
                            resize_side = { bottom: true };
                        }
                    }

                    if (cursor)
                    {
                        style.cursor = cursor;
                        event.stopImmediatePropagation();
                    }
                    else
                    {
                        style.cursor = event.target.cursor;
                    }
                }
                else if (resize_side)
                {
                    style.cursor = this.cursor;
                    resize_side = null;
                }
            }
        };

        this.__event_capture_mouseup = function (event) {

            if (resize_start)
            {
                resize_start = null;
                event.stopImmediatePropagation();
            }
        };




        function show(parentWindow, showDialog) {

            this.__parentWindow = parentWindow;
            this.__mainWindow = parentWindow.mainWindow;

            var host = this.__mainWindow.dom_host;

            if (showDialog) //如果是模式窗口则添加遮罩层
            {
                var mask = this.dom_mask = document.createElement("div");
                mask.setAttribute("flyingon", "mask");
                mask.setAttribute("style", "position:absolute;z-index:9990;width:100%;height:100%;overflow:hidden;-moz-user-select:none;-webkit-user-select:none;outline:none;cursor:default;background-color:silver;opacity:0.1;");
                host.appendChild(this.dom_mask);
            }

            host.appendChild(this.dom_window);

            this.active();
            this.update(this.start === "center");
        };

        this.show = function (parentWindow) {

            show.call(this, parentWindow, false);
        };

        this.showDialog = function (parentWindow) {

            show.call(this, parentWindow, true);
        };


        this.close = function () {

            var parent = this.__parentWindow;

            if (parent)
            {
                if (this.dispatchEvent(new flyingon.Event("closing", this)))
                {
                    var root = this.__mainWindow,
                        host = root.dom_host;

                    host.removeChild(this.dom_window);

                    if (this.dom_mask)
                    {
                        host.removeChild(this.dom_mask);
                    }

                    this.dispatchEvent(new flyingon.Event("closed", this));

                    this.__parentWindow = this.__mainWindow = root.__activeWindow = null;
                    parent.active();
                }
            }

            this.dispose();
        };



        this.fintAt = function (x, y) {

            return this.header.hitTest(x, y) ? this.header.fintAt(x, y) : base.fintAt.call(this, x, y);
        };



        //刷新窗口
        this.update = function (center) {

            var rect = this.__fn_clientRect(this.fill),
                width = +this.width || (this.width = 640),
                height = +this.height || (this.height = 480),
                style = this.dom_window.style;

            if (center)
            {
                this.left = (rect.width - width) >> 1;
                this.top = (rect.height - height) >> 1;
            }

            style.left = (+this.left || (this.left = 0)) + "px";
            style.top = (+this.top || (this.top = 0)) + "px";

            style.width = width + "px";
            style.height = height + "px";

            this.__fn_update_window(width, height);
        };


        //测量标题栏并修正客户区
        this.measure = function () {

            var header = this.header;

            base.measure.apply(this, arguments);

            if (header && (header.__visible = header.visibility === "visible"))
            {
                var height = +header.height || 25;

                header.measure(this.controlWidth, height, 1, 1);
                header.locate(0, 0);

                this.clientY += height;
                this.clientHeight -= height;
            }
        };


        //修正滚动条位置
        this.__fn_scrollbar = function (scrollbar, x, y, width, height, vertical) {

            var cache;

            if (vertical && (cache = this.header) && cache.__visible)
            {
                y += (cache = +cache.height || 25);
                height -= cache;
            }

            base.__fn_scrollbar.apply(this, arguments);
        };


        //绘制工具条
        this.paint_additions = function (painter) {

            this.header.render(painter);
            base.paint_additions.call(this, painter);
        };



    });



})(flyingon);