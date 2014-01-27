//可滚动控件
flyingon.class("ScrollableControl", flyingon.Control, function (Class, flyingon) {




    this.defaultValue("clipToBounds", true);



    this.defineProperty("horizontalScrollBar", function () {

        return this.__horizontalScrollBar__;
    });


    this.defineProperty("verticalScrollBar", function () {

        return this.__verticalScrollBar__;
    });




    //定义水平及竖直滚动条显示方式 auto always never  见枚举flyingon.ScrollBarVisibility对象
    this.defineProperties(["horizontalScroll", "verticalScroll"], "auto", "measure");




    function defineProperty(name, attributes) {

        this.defineProperty("name", 0, {

            attributes: attributes || "invalidate",
            valueChangedCode: "this.__boxModel__." + name + " = value;"
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





    this.__event_scroll__ = function (event) {

        var box = this.__boxModel__;

        if (event.changedX)
        {
            box.scrollLeft += event.changedX;
        }

        if (event.changedY)
        {
            box.scrollTop += event.changedY;
        }

        this.__render_children__ = null;
        this.invalidate();

        //修正因滚动造成的输入符位置变更问题
        var ownerWindow = this.ownerWindow;
        if (ownerWindow && this.isParent(ownerWindow.__focused_control__))
        {
            ownerWindow.__fn_change_caret__(event.changedX, event.changedY);
        }

        event.stopPropagation();
    };

    this.__event_mousewheel__ = function (event) {

        var verticalScrollBar = this.__verticalScrollBar__;

        if (verticalScrollBar)
        {
            var step = verticalScrollBar.min_step;

            if (event.wheelDelta > 0)
            {
                step = -step;
            }

            verticalScrollBar.changeValue(step);
            event.stopPropagation();
            event.preventDefault();
        }
    };





    this.getControlAt = function (x, y) {

        var horizontalScrollBar = this.__horizontalScrollBar__;

        if (horizontalScrollBar && horizontalScrollBar.hitTest(x, y))
        {
            return horizontalScrollBar;
        }

        var verticalScrollBar = this.__verticalScrollBar__;
        if (verticalScrollBar && verticalScrollBar.hitTest(x, y))
        {
            return verticalScrollBar;
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


        if (boxModel.scrollWidth < r.width)
        {
            boxModel.scrollLeft = 0;
            boxModel.scrollWidth = r.width;
        }

        if (boxModel.scrollHeight < r.height)
        {
            boxModel.scrollTop = 0;
            boxModel.scrollHeight = r.height;
        }


        var horizontalScrollBar = this.__horizontalScrollBar__,
            verticalScrollBar = this.__verticalScrollBar__;

        //处理滚动条及拐角
        if (horizontalScrollBar || verticalScrollBar)
        {
            this.__fn_measure_scroll_bar__(boxModel, horizontalScrollBar, verticalScrollBar);
            this.__fn_measure_scroll_corner__(boxModel, horizontalScrollBar, verticalScrollBar);
        }
    };

    this.adjustAutoSize = function (boxModel) {

        var r = boxModel.clientRect;

        boxModel.width = boxModel.scrollWidth + boxModel.width - r.width;
        boxModel.height = boxModel.scrollHeight + boxModel.height - r.height;
    };



    //排列子控件
    this.arrange = function (clientRect) {

    };



    function cache(target, name) {

        target.__boxModel__.visible = false;

        this["__" + name + "_cache__"] = target;
        this["__" + name + "__"] = null;
    };

    function restore(name) {

        var key = "__" + name + "_cache__",
            result = this["__" + name + "__"] = this[key];

        if (result)
        {
            result.__boxModel__.visible = true;
            this[key] = undefined;
        }

        return result;
    };

    function initialize(boxModel, width, height) {


        var result = false,

            horizontalScrollBar = this.__horizontalScrollBar__,
            verticalScrollBar = this.__verticalScrollBar__,

            clientRect = boxModel.clientRect,

            horizontalScroll = false,
            verticalScroll = false,

            scroll;


        //判读是否有水平滚动条
        if ((scroll = this.horizontalScroll) != "never" && !boxModel.__auto_width__)
        {
            horizontalScroll = scroll != "auto" || (boxModel.scrollWidth > clientRect.width && (result = true));
        }

        //判断是否有垂直滚动条
        if ((scroll = this.verticalScroll) != "never" && !boxModel.__auto_height__)
        {
            verticalScroll = scroll != "auto" || (boxModel.scrollHeight > clientRect.height && (result = true));
        }


        clientRect.width = width;
        clientRect.height = height;


        //创建或隐藏水平滚动条
        if (horizontalScroll)
        {
            if (!horizontalScrollBar && !(horizontalScrollBar = restore.call(this, "horizontalScrollBar")))
            {
                horizontalScrollBar = this.__horizontalScrollBar__ = this.createHorizontalScrollBar();
                horizontalScrollBar.__parent__ = this;
                horizontalScrollBar.__boxModel__.initialize_addtions(boxModel);
            }

            clientRect.height -= horizontalScrollBar.height;
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
                verticalScrollBar = this.__verticalScrollBar__ = this.createVerticalScrollBar();
                verticalScrollBar.__parent__ = this;
                verticalScrollBar.__boxModel__.initialize_addtions(boxModel);
            }

            clientRect.width -= verticalScrollBar.width;
        }
        else if (verticalScrollBar)
        {
            cache.call(this, verticalScrollBar, "verticalScrollBar");
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
    this.__fn_measure_scroll_bar__ = function (boxModel, horizontalScrollBar, verticalScrollBar) {


        var insideRect = boxModel.insideRect,
            clientRect = boxModel.clientRect;


        //调整盒模型
        if (horizontalScrollBar)
        {
            if (boxModel.scrollLeft > boxModel.scrollWidth)
            {
                boxModel.scrollLeft = boxModel.scrollWidth;
            }

            insideRect.height -= horizontalScrollBar.height;
        }

        if (verticalScrollBar)
        {
            if (boxModel.scrollTop > boxModel.scrollHeight)
            {
                boxModel.scrollTop = boxModel.scrollHeight;
            }

            insideRect.width -= verticalScrollBar.width;
        }


        //水平滚动条
        if (horizontalScrollBar)
        {
            horizontalScrollBar.width = insideRect.width;

            horizontalScrollBar.value = boxModel.scrollLeft;
            horizontalScrollBar.maxValue = boxModel.scrollWidth + insideRect.width - clientRect.width;
            horizontalScrollBar.viewportSize = insideRect.width;

            horizontalScrollBar.__boxModel__.measure(insideRect.x, insideRect.bottom, insideRect.width, horizontalScrollBar.height);
        }


        //垂直滚动条
        if (verticalScrollBar)
        {
            verticalScrollBar.height = insideRect.height;

            verticalScrollBar.value = boxModel.scrollTop;
            verticalScrollBar.maxValue = boxModel.scrollHeight + insideRect.height - clientRect.height;
            verticalScrollBar.viewportSize = insideRect.height;

            verticalScrollBar.__boxModel__.measure(insideRect.right, insideRect.y, verticalScrollBar.width, insideRect.height);
        }
    };

    //处理拐角
    this.__fn_measure_scroll_corner__ = function (boxModel, horizontalScrollBar, verticalScrollBar) {

        var corner = this.__scroll_corner__;

        if (horizontalScrollBar && verticalScrollBar)
        {
            if (!corner && !(corner = restore.call(this, "scroll_corner")))
            {
                corner = this.__scroll_corner__ = this.createScrollCorner();
                corner.__parent__ = this;
                corner.__boxModel__.initialize_addtions(boxModel);
            }

            var r = boxModel.insideRect;
            corner.__boxModel__.measure(r.right, r.bottom, verticalScrollBar.width, horizontalScrollBar.height);
        }
        else if (corner)
        {
            cache.call(this, corner, "scroll_corner");
        }
    };


});

