
//窗口标题栏按钮
flyingon.defineClass("ChildWindow_ToolButton", flyingon.Control, function (Class, base, flyingon) {


    //修改默认值为充满
    this.defaultValue("width", "fill");

    //修改默认值为充满
    this.defaultValue("height", "fill");

    //图片
    this.defineProperty("image", null);


    //绘制图像
    this.paint = function (context, boxModel) {

        var image = this.__fn_state_image(this.image);

        if (image)
        {
            var r = boxModel.clientRect;
            context.paint_image(image, r.windowX, r.windowY, r.width, r.height, this.textAlign);
        }
    };


});



//窗口标题栏
flyingon.defineClass("ChildWindow_ToolBar", flyingon.Panel, function (Class, base, flyingon) {


    Class.create = function (parent) {

        this.__parent = parent;
        this.__addtions = true;
        this.__children = new flyingon.ControlCollection();

        this.__fn_initialize();
    };


    this.__fn_initialize = function () {

        var close = this.ownerWindow.close;

        button.call(this, "window-icon", "left");
        button.call(this, "window-close", "right", close);
        button.call(this, "window-maximize", "right", close);
        button.call(this, "window-minimize", "right", close);
    };




    this.defaultValue("focusable", false);

    this.defaultValue("width", "fill");

    this.defaultValue("height", 25);



    function button(image, dock, click) {

        var result = new flyingon.ChildWindow_ToolButton();

        result.image = image;
        result.dock = dock;

        if (click)
        {
            result.onclick = function (event) {

                click.call(this);
            };
        }

        this.__children.append(result);
        return result;
    };


    var offsetX, offsetY;

    function translate(ownerWindow) {

        var root = ownerWindow.mainWindow,
            x = ownerWindow.left,
            y = ownerWindow.top,
            width = root.width,
            height = root.height;

        if (x < 0)
        {
            x = 0;
        }
        else if (x >= width)
        {
            x = width - 8;
        }

        if (y < 0)
        {
            y = 0;
        }
        else if (y > height)
        {
            y = height - 8;
        }

        return { x: x, y: y };
    };



    this.__event_mousedown = function (event) {

        var ownerWindow = this.ownerWindow,
            offset = translate(ownerWindow);

        offsetX = offset.x - event.clientX;
        offsetY = offset.y - event.clientY;

        ownerWindow.__capture_control = this; //捕获鼠标
    };

    this.__event_mousemove = function (event) {

        if (event.mousedown)
        {
            var ownerWindow = this.ownerWindow,
                offset = translate(ownerWindow),
                style = ownerWindow.dom_window.style;

            ownerWindow.left = event.clientX + offsetX,
            ownerWindow.top = event.clientY + offsetY;

            style.left = offset.x + "px";
            style.top = offset.y + "px";
        }
    };

    this.__event_mouseup = function (event) {

        this.ownerWindow.__capture_control = null;
    };



    this.__fn_render = function (width) {

        var height = this.visibility === "visible" ? +this.height || 25 : 0;

        this.measure(width, height);
        this.locate(0, 0);
        this.__fn_arrange();
    };


});




//子窗口
flyingon.defineClass("ChildWindow", flyingon.Panel, function (Class, base, flyingon) {



    flyingon.window_extender.call(this, base, flyingon);



    Class.create = function () {

        this.__fn_create();
        this.toolbar = new flyingon.ChildWindow_ToolBar(this);
    };


    

    this.defineProperty("width", 640);

    this.defineProperty("height", 480);

    this.defineProperty("fill", false, {

        changed: "this.update();"
    });

    //窗口起始位置 center:居中  manual:自定义
    this.defineProperty("start", "center");



    this.defineEvent("closing");

    this.defineEvent("closed");




    this.__event_change = function (event) {

        switch (event.name)
        {
            case "left":
            case "top":
                this.dom_window.style[event.name] = event.value + "px";
                break;
        }
    };



    function show(parentWindow, showDialog) {

        if (!(this.__parentWindow = parentWindow) || !(this.__mainWindow = parentWindow.mainWindow))
        {
            throw new Error("parentWindow error!");
        }

        var host = this.__mainWindow.dom_host;

        if (showDialog) //如果是模式窗口则添加遮罩层
        {
            var mask = this.dom_mask = document.createElement("div");
            mask.setAttribute("flyingon", "mask");
            mask.setAttribute("style", "position:absolute;z-index:9990;width:100%;height:100%;overflow:hidden;-moz-user-select:none;-webkit-user-select:none;outline:none;cursor:default;background-color:silver;opacity:0.1;");
            host.appendChild(this.dom_mask);
        }

        host.appendChild(this.dom_window);

        this.setActive();
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
            if (this.dispatchEvent("closing"))
            {
                var root = this.__mainWindow,
                    host = root.dom_host;

                host.removeChild(this.dom_window);

                if (this.dom_mask)
                {
                    host.removeChild(this.dom_mask);
                }

                this.dispatchEvent("closed");

                this.__parentWindow = this.__mainWindow = root.__activeWindow = null;
                parent.setActive();
            }
        }

        this.dispose();
    };



    //刷新窗口
    this.update = function (center) {

        var rect = this.__fn_clientRect(this.fill),
            width = this.width,
            height = this.height,
            style = this.dom_window.style;

        if (center)
        {
            this.left = (rect.width - width) >> 1;
            this.top = (rect.height - height) >> 1;
        }

        style.left = this.left + "px";
        style.top = this.top + "px";
        style.width = width + "px";
        style.height = height + "px";

        this.toolbar.__fn_render(width);
        this.__fn_update(0, this.toolbar.marginBottom, width, height);
    };



    this.hitTest = function (x, y) {

        return this.toolbar.hitTest(x, y) || base.hitTest.call(this, x, y);
    };



}, true);

