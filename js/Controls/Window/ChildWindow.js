

//窗口标题栏
$.class("WindowTitleBar", $.Panel, function (Class, $) {


    Class.create = function () {


        this["button:icon"] = button.call(this, "left", "window-icon");

        this["button:close"] = button.call(this, "right", "window-close", function (event) {

            this.ownerWindow.close();
        });

        this["button:maximize"] = button.call(this, "right", "window-maximize", function (event) {

            this.ownerWindow.close();
        });

        this["button:minimize"] = button.call(this, "right", "window-minimize", function (event) {

            this.ownerWindow.close();
        });


        this.addEventListener("mousedown", mousedown);
        this.addEventListener("mousemove", mousemove);
        this.addEventListener("mouseup", mouseup);
    };



    this.setDefaultValue("focusable", false);

    this.setDefaultValue("height", 25);

    this.setDefaultValue("layout", "dock");




    function button(dock, styleKey, click) {

        var result = new $.PictureBox();

        result.dock = dock;
        result.width = 20;
        result.styleKey = styleKey;

        if (click)
        {
            result.onclick = click;
        }

        this["x:children"].append(result);
        return result;
    };


    var offsetX, offsetY;

    function translate(mainWindow, left, top) {

        if (left < 0)
        {
            left = 0;
        }
        else if (left > mainWindow["x:storage"].width)
        {
            left = mainWindow["x:storage"].width - 4;
        }

        if (top < 0)
        {
            top = 0;
        }
        else if (top > mainWindow["x:storage"].height)
        {
            top = mainWindow["x:storage"].height - 4;
        }

        return { left: left, top: top };
    };

    function mousedown(event) {

        var ownerWindow = this.ownerWindow,
            storage = ownerWindow["x:storage"],
            p = translate(ownerWindow.mainWindow, storage.left, storage.top);


        offsetX = p.left - event.clientX;
        offsetY = p.top - event.clientY;

        ownerWindow["x:captureControl"] = this; //捕获鼠标
    };

    function mousemove(event) {

        if (event.mouseDown)
        {
            var ownerWindow = this.ownerWindow,
                storage = ownerWindow["x:storage"],
                style = ownerWindow.domWindow.style;


            storage.left = event.clientX + offsetX,
            storage.top = event.clientY + offsetY;

            var p = translate(ownerWindow.mainWindow, storage.left, storage.top);

            style.left = p.left + "px";
            style.top = p.top + "px";
        }
    };

    function mouseup(event) {

        this.ownerWindow["x:captureControl"] = null;
    };


});




//子窗口
$.class("ChildWindow", $.WindowBase, function (Class, $) {




    Class.create = function () {


        this.onlocationchange = function (event) {

            this.domWindow.style[event.name] = event.value + "px";
        };


        this.titleBar = this.createTitleBar() || new $.WindowTitleBar();
        this.titleBar["x:parent"] = this;
    };


    //创建标题栏
    this.createTitleBar = function () {

        return null;
    };




    this.defineProperty("width", 640);

    this.defineProperty("height", 480);

    this.defineProperty("fullMode", false, "this['x:resize'] = true");

    //窗口起始位置 center:居中  manual:自定义
    this.defineProperty("startPosition", "center");




    this.defineEvent("closing");

    this.defineEvent("closed");




    this.getControlAt = function (x, y) {

        //判断滚动条
        if (this.titleBar.hitTest(x, y))
        {
            return this.titleBar.getControlAt(x, y);
        }

        return $.ChildWindow.super.getControlAt.call(this, x, y);
    };



    var center;

    function show(parentWindow, modalWindow) {


        if (!parentWindow)
        {
            throw new Error("parentWindow not allow null!");
        }


        var children = parentWindow["x:windows"];
        if (!children)
        {
            throw new Error("parentWindow is not a flyingon.WindowBase object!");
        }


        children.push(this);

        $.defineVariable(this, "parentWindow", parentWindow, true, true);
        $.defineVariable(this, "mainWindow", parentWindow.mainWindow, true, true);


        var domHost = this.mainWindow.domHost;

        //如果是模式窗口则添加遮罩层
        if (modalWindow)
        {
            domHost.appendChild(this.domMask);
        }

        domHost.appendChild(this.domWindow);


        center = this["x:storage"].startPosition == "center";

        this.activate(true);
        this.update();
    };

    this.show = function (parentWindow) {

        show.call(this, parentWindow, false);
    };

    this.showDialog = function (parentWindow) {

        show.call(this, parentWindow, true);
    };




    this["y:activate"] = function () {

        this.titleBar["x:boxModel"].render(this.context);

        $.ChildWindow.super["y:activate"].call(this);
    };

    this["y:deactivate"] = function () {

        this.titleBar["x:boxModel"].render(this.context);

        $.ChildWindow.super["y:deactivate"].call(this);
    };



    this.close = function () {

        var parentWindow = this.parentWindow;

        if (parentWindow)
        {
            var index = parentWindow["x:windows"].indexOf(this);

            if (index >= 0 && this.dispatchEvent("closing"))
            {
                var domHost = this.mainWindow.domHost;

                domHost.removeChild(this.domWindow);

                if (this.domMask.parentNode)
                {
                    domHost.removeChild(this.domMask);
                }

                parentWindow["x:windows"].splice(index, 1);

                $.defineVariable(this, "parentWindow", null, true, true);
                $.defineVariable(this, "mainWindow", null, true, true);

                this.dispatchEvent("closed");


                parentWindow.activate(false);
            }
        }

        this.dispose();
    };




    this["y:before:measure"] = function (boxModel) {


        var storage = this["x:storage"],
            titleBar = this.titleBar,

            y = titleBar["x:storage"].height,

            width = storage.width,
            height = storage.height,

            style = this.domWindow.style;


        if (center)
        {
            var r = this["y:fill"](storage.fullMode);

            storage.left = Math.round((r.width - width) / 2);
            storage.top = Math.round((r.height - height) / 2);

            center = false;
        }


        style.left = storage.left + "px";
        style.top = storage.top + "px";
        style.width = width + "px";
        style.height = height + "px";


        //处理标题栏
        boxModel.children = null;
        titleBar["x:boxModel"].setUsableRect(boxModel, 0, 0, width, y, true);


        //绘制窗口内容
        var layers = this.layers,
            i = 0,
            length = layers.length;

        while (i < length)
        {
            var layer = layers[i++];

            layer["x:boxModel"].setUsableRect(null, 0, y, width, height - y);

            layer.domCanvas.width = width; //清空画布
            layer.domCanvas.height = height;
        }
    };



    //绘制内框
    this.paint = function (context) {

        //绘制窗口内容
        var layers = this.layers,
            i = 1,
            length = layers.length;


        while (i < length)
        {
            var layer = layers[i++];

            layer.unregistryUpdate();
            layer["x:boxModel"].render(layer.context);
        }

        $.ChildWindow.super.paint.call(this, context);
    };



});

