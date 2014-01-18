//可滚动控件
flyingon.class("ScrollableControl", flyingon.Control, function (Class, flyingon) {




    this.defaultValue("clipToBounds", true);



    this.defineProperty("horizontalScrollBar", function () {

        return this["x:horizontalScrollBar"];
    });


    this.defineProperty("verticalScrollBar", function () {

        return this["x:verticalScrollBar"];
    });




    //定义水平及竖直滚动条显示方式 auto always never  见枚举flyingon.ScrollBarVisibility对象
    this.defineProperties(["horizontalScroll", "verticalScroll"], "auto", "measure");




    function defineProperty(name, attributes) {

        this.defineProperty("name", 0, {

            attributes: attributes || "invalidate",
            valueChangedCode: "this['x:boxModel']['" + name + "'] = value;"
        });
    };

    //
    defineProperty.call(this, "scrollLeft");

    //
    defineProperty.call(this, "scrollTop");

    //
    defineProperty.call(this, "scrollWidth", "measure");

    //
    defineProperty.call(this, "scrollHeight", "measure");





    this["event-scroll"] = function (event) {

        var box = this["x:boxModel"];

        if (event.changedX)
        {
            box.scrollLeft += event.changedX;
        }

        if (event.changedY)
        {
            box.scrollTop += event.changedY;
        }

        this["x:render-children"] = null;
        this.invalidate();

        //修正因滚动造成的输入符位置变更问题
        var ownerWindow = this.ownerWindow;
        if (ownerWindow && this.isParent(ownerWindow["x:focused-control"]))
        {
            ownerWindow["y:change-caret"](event.changedX, event.changedY);
        }

        event.stopPropagation();
    };

    this["event-mousewheel"] = function (event) {

        var verticalScrollBar = this["x:verticalScrollBar"];

        if (verticalScrollBar)
        {
            var storage = verticalScrollBar["x:storage"],
                step = event.wheelDelta < 0 ? storage.minStep : -storage.minStep;

            verticalScrollBar.changeValue(step);
            event.stopPropagation();
            event.preventDefault();
        }
    };





    this.getControlAt = function (x, y) {

        var horizontalScrollBar = this["x:horizontalScrollBar"];
        if (horizontalScrollBar && horizontalScrollBar.hitTest(x, y))
        {
            return horizontalScrollBar;
        }

        var verticalScrollBar = this["x:verticalScrollBar"];
        if (verticalScrollBar && verticalScrollBar.hitTest(x, y))
        {
            return verticalScrollBar;
        }

        return this;
    };



    this.measure = function (boxModel) {


        boxModel.compute();


        var r = boxModel.clientRect,
            width = r.width,
            height = r.height;


        //初始化滚动条
        initialize.call(this, boxModel, width, height);

        //先按无滚动条进行排列
        this.arrange(boxModel, boxModel.clientRect);


        //再次初始化滚动条，如果滚动条有变则重新排列
        if (initialize.call(this, boxModel, width, height))
        {
            this.arrange(boxModel, boxModel.clientRect);
        }


        var horizontalScrollBar = this["x:horizontalScrollBar"],
            verticalScrollBar = this["x:verticalScrollBar"];

        //处理滚动条及拐角
        if (horizontalScrollBar || verticalScrollBar)
        {
            this["y:measure-scroll-bar"](boxModel, horizontalScrollBar, verticalScrollBar);
            this["y:measure-scroll-corner"](boxModel, horizontalScrollBar, verticalScrollBar);
        }
    };

    this.adjustAutoSize = function (boxModel) {

        var clientRect = boxModel.clientRect;

        boxModel.width = boxModel.scrollWidth + boxModel.width - clientRect.width;
        boxModel.height = boxModel.scrollHeight + boxModel.height - clientRect.height;
    };



    //排列子控件
    this.arrange = function (boxModel, clientRect) {

    };



    function cache(target, name) {

        target["x:boxModel"].visible = false;

        this[name + ":cache"] = target;
        this[name] = null;
    };

    function restore(name) {

        var result = this[name];
        if (result)
        {
            result["x:boxModel"].visible = true;
            this[name] = undefined;
        }

        return result;
    };

    function initialize(boxModel, width, height) {


        var result = false,
            storage = this["x:storage"],

            horizontalScrollBar = this["x:horizontalScrollBar"],
            verticalScrollBar = this["x:verticalScrollBar"],

            clientRect = boxModel.clientRect,

            horizontalScroll = false,
            verticalScroll = false;


        //判读是否有水平滚动条
        if (storage.horizontalScroll != "never" && storage.autoSize != "width" && storage.autoSize != "all")
        {
            horizontalScroll = storage.horizontalScroll != "auto" || (boxModel.scrollWidth > clientRect.width && (result = true));
        }

        //判断是否有垂直滚动条
        if (storage.verticalScroll != "never" && storage.autoSize != "height" && storage.autoSize != "all")
        {
            verticalScroll = storage.verticalScroll != "auto" || (boxModel.scrollHeight > clientRect.height && (result = true));
        }


        clientRect.width = width;
        clientRect.height = height;


        //创建或隐藏水平滚动条
        if (horizontalScroll)
        {
            if (!horizontalScrollBar)
            {
                horizontalScrollBar = this["x:horizontalScrollBar"] = restore.call(this, "x:horizontalScrollBar-cache") || this.createHorizontalScrollBar();
                horizontalScrollBar["x:parent"] = this;
            }

            clientRect.height -= horizontalScrollBar["x:storage"].height;
        }
        else if (horizontalScrollBar)
        {
            cache.call(this, horizontalScrollBar, "x:horizontalScrollBar");
        }


        //创建或隐藏垂直滚动条
        if (verticalScroll)
        {
            if (!verticalScrollBar)
            {
                verticalScrollBar = this["x:verticalScrollBar"] = restore.call(this, "x:verticalScrollBar-cache") || this.createVerticalScrollBar();
                verticalScrollBar["x:parent"] = this;
            }

            clientRect.width -= verticalScrollBar["x:storage"].width;
        }
        else if (verticalScrollBar)
        {
            cache.call(this, verticalScrollBar, "x:verticalScrollBar");
        }


        return result;
    };


    //创建水平滚动条
    this.createHorizontalScrollBar = function () {

        return new flyingon.ScrollBar();
    };

    //创建竖直滚动条
    this.createVerticalScrollBar = function () {

        var result = new flyingon.ScrollBar();
        result.isVertical = true;
        return result;
    };

    //创建滚动条拐角
    this.createScrollCorner = function () {

        return new flyingon.ScrollCorner();
    };



    //测量滚动条
    this["y:measure-scroll-bar"] = function (boxModel, horizontalScrollBar, verticalScrollBar) {


        var storage_1,
            storage_2,

            insideRect = boxModel.insideRect,
            clientRect = boxModel.clientRect;


        //调整盒模型
        if (horizontalScrollBar)
        {
            if (boxModel.scrollLeft > boxModel.scrollWidth)
            {
                boxModel.scrollLeft = boxModel.scrollWidth;
            }

            storage_1 = horizontalScrollBar["x:storage"];
            insideRect.height -= storage_1.height;
        }

        if (verticalScrollBar)
        {
            if (boxModel.scrollTop > boxModel.scrollHeight)
            {
                boxModel.scrollTop = boxModel.scrollHeight;
            }

            storage_2 = verticalScrollBar["x:storage"];
            insideRect.width -= storage_2.width;
        }


        //水平滚动条
        if (storage_1)
        {
            storage_1.width = insideRect.width;

            storage_1.value = boxModel.scrollLeft;
            storage_1.maxValue = boxModel.scrollWidth + insideRect.width - clientRect.width;
            storage_1.viewportSize = insideRect.width;

            horizontalScrollBar["x:boxModel"].measure(boxModel,
               insideRect.x,
               insideRect.bottom,
               insideRect.width,
               storage_1.height,
               true);
        }


        //垂直滚动条
        if (storage_2)
        {
            storage_2.height = insideRect.height;

            storage_2.value = boxModel.scrollTop;
            storage_2.maxValue = boxModel.scrollHeight + insideRect.height - clientRect.height;
            storage_2.viewportSize = insideRect.height;

            verticalScrollBar["x:boxModel"].measure(boxModel,
               insideRect.right,
               insideRect.y,
               storage_2.width,
               insideRect.height,
               true);
        }
    };

    //处理拐角
    this["y:measure-scroll-corner"] = function (boxModel, horizontalScrollBar, verticalScrollBar) {

        var corner = this["x:scroll-corner"];

        if (horizontalScrollBar && verticalScrollBar)
        {
            if (!corner)
            {
                corner = this["x:scroll-corner"] = restore.call(this, "x:scroll-corner-cache") || this.createScrollCorner();
                corner["x:parent"] = this;
            }


            var storage_1 = horizontalScrollBar["x:storage"],
                storage_2 = verticalScrollBar["x:storage"],
                insideRect = boxModel.insideRect;

            corner["x:boxModel"].measure(boxModel,
                insideRect.right,
                insideRect.bottom,
                storage_2.width,
                storage_1.height,
                true);
        }
        else if (corner)
        {
            cache.call(this, corner, "x:scroll-corner");
        }
    };


});

