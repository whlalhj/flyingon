﻿//可滚动控件
flyingon.defineClass("ScrollableControl", flyingon.Control, function (Class, base, flyingon) {



    this.defaultValue("clipToBounds", true);



    this.defineProperty("horizontalScrollBar", function () {

        return this.__horizontalScrollBar;
    });


    this.defineProperty("verticalScrollBar", function () {

        return this.__verticalScrollBar;
    });




    //定义水平及竖直滚动条显示方式
    //auto   自动显示
    //always 总是显示
    //never  从不显示
    this.defineProperties(["horizontalScroll", "verticalScroll"], "auto", "measure");




    function defineProperty(name, attributes) {

        this.defineProperty("name", 0, {

            attributes: attributes || "invalidate",
            complete: "this.__boxModel." + name + " = value;"
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







    this.__event_scroll = function (event) {

        var box = this.__boxModel;

        if (event.changeX)
        {
            box.scrollLeft += event.changeX;
        }

        if (event.changeY)
        {
            box.scrollTop += event.changeY;
        }

        this.__render_children = null;
        this.__boxModel.invalidate(false);

        //修正因滚动造成的输入符位置变更问题
        var ownerWindow = this.ownerWindow;
        if (ownerWindow && this.isParent(ownerWindow.__focused_control))
        {
            ownerWindow.__fn_change_caret(event.changeX, event.changeY);
        }

        event.stopPropagation();
        event.preventDefault();
    };

    this.__event_mousewheel = function (event) {

        var verticalScrollBar = this.__verticalScrollBar;

        if (verticalScrollBar)
        {
            var step = verticalScrollBar.minChange;

            if (event.wheelDelta > 0)
            {
                step = -step;
            }

            verticalScrollBar.step_to(step);
            event.stopPropagation();
            event.preventDefault();
        }
    };





    this.findAt = function (x, y) {

        var cache;

        if ((cache = this.__horizontalScrollBar) && cache.hitTest(x, y))
        {
            return cache;
        }

        if ((cache = this.__verticalScrollBar) && cache.hitTest(x, y))
        {
            return cache;
        }

        return this;
    };



    this.measure = function (boxModel) {


        boxModel.compute();


        var r = boxModel.clientRect,
            width = boxModel.scrollWidth = r.width,
            height = boxModel.scrollHeight = r.height;


        //初始化滚动条
        initialize.call(this, boxModel, width, height);

        //先按无滚动条进行排列
        this.arrange(boxModel.clientRect);


        //再次初始化滚动条，如果滚动条有变则重新排列
        if (initialize.call(this, boxModel, width, height))
        {
            this.arrange(boxModel.clientRect);
        }


        var horizontalScrollBar = this.__horizontalScrollBar,
            verticalScrollBar = this.__verticalScrollBar;

        //处理滚动条及拐角
        if (horizontalScrollBar || verticalScrollBar)
        {
            this.__fn_measure_scroll_bar(boxModel, horizontalScrollBar, verticalScrollBar);
            this.__fn_measure_scroll_corner(boxModel, horizontalScrollBar, verticalScrollBar);
        }
    };

    this.adjustAutoSize = function (boxModel, auto_width, auto_height) {

        var r = boxModel.clientRect;

        if (auto_width)
        {
            boxModel.width = boxModel.scrollWidth + boxModel.width - r.width;
        }

        if (auto_height)
        {
            boxModel.height = boxModel.scrollHeight + boxModel.height - r.height;
        }
    };



    //排列子控件
    this.arrange = function (clientRect) {

    };



    function cache(target, name) {

        target.__boxModel.visible = false;

        this["__" + name + "_cache"] = target;
        this["__" + name] = null;
    };

    function restore(name) {

        var key = "__" + name + "_cache",
            result = this["__" + name] = this[key];

        if (result)
        {
            result.__boxModel.visible = true;
            this[key] = undefined;
        }

        return result;
    };

    function initilaize_ScrollBar(boxModel, target, parent) {

        target.__parent = parent;
        target.width = "fill";
        target.height = "fill";
        target.__boxModel.initialize_addtions(boxModel);
    };

    function initialize(boxModel, width, height) {


        var result = false,

            horizontalScrollBar = this.__horizontalScrollBar,
            verticalScrollBar = this.__verticalScrollBar,

            clientRect = boxModel.clientRect,

            horizontalScroll = false,
            verticalScroll = false,

            scroll;


        //判读是否有水平滚动条
        if ((scroll = this.horizontalScroll) !== "never" && !boxModel.__auto_width)
        {
            horizontalScroll = scroll !== "auto" || (boxModel.scrollWidth > clientRect.width && (result = true));
        }

        //判断是否有垂直滚动条
        if ((scroll = this.verticalScroll) !== "never" && !boxModel.__auto_height)
        {
            verticalScroll = scroll !== "auto" || (boxModel.scrollHeight > clientRect.height && (result = true));
        }


        clientRect.width = width;
        clientRect.height = height;


        //创建或隐藏水平滚动条
        if (horizontalScroll)
        {
            if (!horizontalScrollBar && !(horizontalScrollBar = restore.call(this, "horizontalScrollBar")))
            {
                horizontalScrollBar = this.__horizontalScrollBar = this.create_ScrollBar();
                initilaize_ScrollBar(boxModel, horizontalScrollBar, this);
            }

            clientRect.height -= horizontalScrollBar.thickness;
            boxModel.scrollHeight -= horizontalScrollBar.thickness;
        }
        else if (horizontalScrollBar)
        {
            cache.call(this, horizontalScrollBar, "horizontalScrollBar");
        }


        //创建或隐藏垂直滚动条
        if (verticalScroll)
        {
            if (!verticalScrollBar && !(verticalScrollBar = restore.call(this, "verticalScrollBar")))
            {
                verticalScrollBar = this.__verticalScrollBar = this.create_ScrollBar(true);
                initilaize_ScrollBar(boxModel, verticalScrollBar, this);
            }

            clientRect.width -= verticalScrollBar.thickness;
            boxModel.scrollWidth -= verticalScrollBar.thickness;
        }
        else if (verticalScrollBar)
        {
            cache.call(this, verticalScrollBar, "verticalScrollBar");
        }


        return result;
    };


    //创建滚动条
    this.create_ScrollBar = function (vertical) {

        var result = new flyingon.ScrollBar();

        if (vertical)
        {
            result.vertical = vertical;
        }

        return result;
    };

    //创建滚动条拐角
    this.create_ScrollCorner = function () {

        return new flyingon.ScrollCorner();
    };



    //测量滚动条
    this.__fn_measure_scroll_bar = function (boxModel, horizontalScrollBar, verticalScrollBar) {


        var usableRect = boxModel.usableRect,
            clientRect = boxModel.clientRect;


        //调整盒模型
        if (horizontalScrollBar)
        {
            if (boxModel.scrollLeft > boxModel.scrollWidth)
            {
                boxModel.scrollLeft = boxModel.scrollWidth;
            }

            usableRect.height -= horizontalScrollBar.thickness;
        }

        if (verticalScrollBar)
        {
            if (boxModel.scrollTop > boxModel.scrollHeight)
            {
                boxModel.scrollTop = boxModel.scrollHeight;
            }

            usableRect.width -= verticalScrollBar.thickness;
        }


        //水平滚动条
        if (horizontalScrollBar)
        {
            horizontalScrollBar.width = usableRect.width;

            horizontalScrollBar.value = boxModel.scrollLeft;
            horizontalScrollBar.maxValue = boxModel.scrollWidth + usableRect.width - clientRect.width;
            horizontalScrollBar.viewportSize = usableRect.width;

            horizontalScrollBar.__boxModel.measure(usableRect.x, usableRect.bottom, usableRect.width, horizontalScrollBar.thickness);
        }


        //垂直滚动条
        if (verticalScrollBar)
        {
            verticalScrollBar.height = usableRect.height;

            verticalScrollBar.value = boxModel.scrollTop;
            verticalScrollBar.maxValue = boxModel.scrollHeight + usableRect.height - clientRect.height;
            verticalScrollBar.viewportSize = usableRect.height;

            verticalScrollBar.__boxModel.measure(usableRect.right, usableRect.y, verticalScrollBar.thickness, usableRect.height);
        }
    };

    //处理拐角
    this.__fn_measure_scroll_corner = function (boxModel, horizontalScrollBar, verticalScrollBar) {

        var corner = this.__scroll_corner;

        if (horizontalScrollBar && verticalScrollBar)
        {
            if (!corner && !(corner = restore.call(this, "scroll_corner")))
            {
                corner = this.__scroll_corner = this.create_ScrollCorner();
                corner.__parent = this;
                corner.__boxModel.initialize_addtions(boxModel);
            }

            var r = boxModel.usableRect;
            corner.__boxModel.measure(r.right, r.bottom, verticalScrollBar.thickness, horizontalScrollBar.__thickness);
        }
        else if (corner)
        {
            cache.call(this, corner, "scroll_corner");
        }
    };


});

