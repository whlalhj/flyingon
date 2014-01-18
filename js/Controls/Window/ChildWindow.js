

//窗口标题栏
flyingon.class("WindowTitleBar", flyingon.Panel, function (Class, flyingon) {


    Class.create = function (parent) {

        var storage = this["x:storage"];

        storage.horizontalScroll = "never";
        storage.verticalScroll = "never";
        storage.stretch = "all";
        storage.dock = "top";

        this["y:initialize-button"]();
        this["x:parent"] = parent;
    };


    this["y:initialize-button"] = function () {

        button.call(this, "icon-button", "left", "window-icon");
        button.call(this, "close-button", "right", "window-close", close);
        button.call(this, "maximize-button", "right", "window-maximize", close);
        button.call(this, "minimize-button", "right", "window-minimize", close);
    };



    this.defaultValue("focusable", false);

    this.defaultValue("height", 25);

    this.defaultValue("layout", "dock");



    function close() {

        this.ownerWindow.close();
    };

    function button(name, dock, styleKey, click) {

        var result = this[name] = new flyingon.PictureBox();

        result.dock = dock;
        result.stretch = "height";
        result.width = 20;
        result.styleKey = styleKey;

        if (click)
        {
            result.onclick = function (event) {

                click.call(this);
            };
        }

        this["x:children"].append(result);
        return result;
    };


    var offsetX, offsetY;

    function translate(storage, left, top) {

        if (left < 0)
        {
            left = 0;
        }
        else if (left >= storage.width)
        {
            left = storage.width - 8;
        }

        if (top < 0)
        {
            top = 0;
        }
        else if (top > storage.height)
        {
            top = storage.height - 8;
        }

        return {

            left: left,
            top: top
        };
    };



    this["event-mousedown"] = function (event) {

        var ownerWindow = this.ownerWindow,
            storage = ownerWindow["x:storage"],
            offset = translate(ownerWindow.mainWindow["x:storage"], storage.left, storage.top);

        offsetX = offset.left - event.clientX;
        offsetY = offset.top - event.clientY;

        ownerWindow["x:capture-control"] = this; //捕获鼠标
    };

    this["event-mousemove"] = function (event) {

        if (event.mousedown)
        {
            var ownerWindow = this.ownerWindow,
                storage = ownerWindow["x:storage"],
                style = ownerWindow["dom-window"].style;

            storage.left = event.clientX + offsetX,
            storage.top = event.clientY + offsetY;

            var offset = translate(ownerWindow.mainWindow["x:storage"], storage.left, storage.top);
            style.left = offset.left + "px";
            style.top = offset.top + "px";
        }
    };

    this["event-mouseup"] = function (event) {

        this.ownerWindow["x:capture-control"] = null;
    };



    this["y:measure"] = function (boxModel, width) {

        var storage = this["x:storage"],
            y = (storage.visibility == "visible" && storage.height) || 0;

        this["x:boxModel"].measure(boxModel, 0, 0, width, y, true).compute();
        return y;
    };


});




//子窗口
flyingon.class("ChildWindow", flyingon.WindowBase, function (Class, flyingon) {




    Class.create = function () {

        this["title-bar"] = new flyingon.WindowTitleBar(this);
    };



    this.defaultValue("stretch", "all");

    this.defineProperty("stretch", function () {

        return "all";
    });

    this.defineProperty("width", 640);

    this.defineProperty("height", 480);

    this.defineProperty("fullMode", false, "this.update();");

    //窗口起始位置 center:居中  manual:自定义
    this.defineProperty("startPosition", "center");




    this["event-change"] = function (event) {

        switch (event.name)
        {
            case "left":
            case "top":
                this["dom-window"].style[event.name] = event.value + "px";
                break;
        }
    };


    this.defineEvent("closing");

    this.defineEvent("closed");




    this.getControlAt = function (x, y) {

        //判断滚动条
        if (this["title-bar"].hitTest(x, y))
        {
            return this["title-bar"].getControlAt(x, y);
        }

        return flyingon.ChildWindow.super.getControlAt.call(this, x, y);
    };



    function show(parentWindow, showDialog) {


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

        flyingon.defineVariable(this, "parentWindow", parentWindow, true, true);
        flyingon.defineVariable(this, "mainWindow", parentWindow.mainWindow, true, true);


        var host = this.mainWindow["dom-host"];

        if (showDialog) //如果是模式窗口则添加遮罩层
        {
            var mask = this["dom-mask"] = document.createElement("div");
            mask.setAttribute("flyingon", "mask");
            mask.setAttribute("style", "position:absolute;z-index:9990;width:100%;height:100%;overflow:hidden;-moz-user-select:none;-webkit-user-select:none;outline:none;cursor:default;background-color:silver;opacity:0.1;");
            host.appendChild(this["dom-mask"]);
        }

        host.appendChild(this["dom-window"]);

        this.activate(true);
        this.update(this["x:storage"].startPosition == "center");
    };

    this.show = function (parentWindow) {

        show.call(this, parentWindow, false);
    };

    this.showDialog = function (parentWindow) {

        show.call(this, parentWindow, true);
    };





    this.close = function () {

        var parentWindow = this.parentWindow;

        if (parentWindow)
        {
            var index = parentWindow["x:windows"].indexOf(this);

            if (index >= 0 && this.dispatchEvent("closing"))
            {
                var host = this.mainWindow["dom-host"];

                host.removeChild(this["dom-window"]);
                if (this["dom-mask"])
                {
                    host.removeChild(this["dom-mask"]);
                }
                   
                parentWindow["x:windows"].splice(index, 1);

                delete this["parentWindow"];
                delete this["mainWindow"];

                this.dispatchEvent("closed");

                parentWindow.activate(true);
            }
        }

        this.dispose();
    };



    //刷新窗口
    this.update = function (center) {


        var storage = this["x:storage"],

            r = this["y:getBoundingClientRect"](storage.fullMode),
            width = storage.width,
            height = storage.height,

            style = this["dom-window"].style;


        if (center)
        {
            storage.left = Math.round((r.width - width) / 2);
            storage.top = Math.round((r.height - height) / 2);
        }


        style.left = storage.left + "px";
        style.top = storage.top + "px";
        style.width = width + "px";
        style.height = height + "px";


        var y = this["title-bar"]["y:measure"](this["x:boxModel"], width);
        this["y:resize"](0, y, width, height);
    };



}, true);

