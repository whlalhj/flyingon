//可滚动控件
$.class("ScrollableControl", $.Control, function (Class, $) {



    Class.create = function () {

        this.addEventListener("scroll", this.handleScroll);
        this.addEventListener("mousewheel", this.handleMouseWheel);
    };



    this.defineProperty("horizontalScrollBar", undefined, {

        getter: function () {

            return this["x:hScrollBar"];
        }
    }, true);


    this.defineProperty("verticalScrollBar", undefined, {

        getter: function () {

            return this["x:vScrollBar"];
        }
    }, true);




    //定义水平及竖直滚动条显示方式 auto always never  见枚举flyingon.ScrollBarVisibility对象
    this.defineProperties(["horizontalScroll", "verticalScroll"], "auto", "measure|layout");




    function defineProperty(name) {

        this.defineProperty("name", 0, {

            attributes: "validate",
            valueChangedCode: "var boxModel = this['x:boxModel'];\nboxModel[name] = value;\nboxModel.renderItems = null;"
        });
    };

    //
    defineProperty.call(this, "scrollLeft");

    //
    defineProperty.call(this, "scrollTop");

    //
    defineProperty.call(this, "scrollWidth");

    //
    defineProperty.call(this, "scrollHeight");




    this.getControlAt = function (x, y) {

        var hScrollBar = this["x:hScrollBar"];
        if (hScrollBar && hScrollBar.hitTest(x, y))
        {
            return hScrollBar;
        }

        var vScrollBar = this["x:vScrollBar"];
        if (vScrollBar && vScrollBar.hitTest(x, y))
        {
            return vScrollBar;
        }

        return null;
    };



    this.defineEvent("scrollchanged");


    this.handleScroll = function (event) {

        var box = this["x:boxModel"];

        if (event.changedX)
        {
            box.scrollLeft += event.changedX;
        }

        if (event.changedY)
        {
            box.scrollTop += event.changedY;
        }


        box.renderItems = null;


        //修正因滚动造成的输入符位置变更问题
        var ownerWindow = this.ownerWindow;
        if (ownerWindow && this.isParent(ownerWindow["x:focusControl"]))
        {
            ownerWindow["y:caret"](event.changedX, event.changedY);
        }


        this.invalidate();

        event.stopPropagation();
    };

    this.handleMouseWheel = function (event) {

        var vScrollBar = this["x:vScrollBar"];

        if (vScrollBar)
        {
            var storage = vScrollBar["x:storage"],
                step = event.wheelDelta < 0 ? storage.minStep : -storage.minStep;

            vScrollBar.changeValue(step);
            event.stopPropagation();
        }

    };








    //测量
    this.measure = function (boxModel) {


        var innerRect = boxModel.innerRect;


        boxModel.scrollWidth = 0;
        boxModel.scrollHeight = 0;


        //自动滚动条时先按无滚动条进行排列
        var _hScrollBar = getHorizontalBar.call(this, innerRect.width),
            _vScrollBar = getVerticalBar.call(this, innerRect.height);


        this.adjustBoxModel(boxModel, _hScrollBar, _vScrollBar);
        this.arrange(boxModel);


        //如果滚动条有变则重新计算及排列
        var hScrollBar = getHorizontalBar.call(this, innerRect.width),
            vScrollBar = getVerticalBar.call(this, innerRect.height);

        if (_hScrollBar != hScrollBar || _vScrollBar != vScrollBar)
        {
            var measure = this.measure; //防止循环调用
            this.measure = null;

            boxModel.measure(); //退回重新测量

            this.measure = measure;

            this.adjustBoxModel(boxModel, hScrollBar, vScrollBar);
            this.arrange(boxModel);


            //重新设置滚动条
            if (hScrollBar)
            {
                hScrollBar.maxValue = boxModel.scrollWidth;
            }

            if (vScrollBar)
            {
                vScrollBar.maxValue = boxModel.scrollHeight;
            }
        }


        var scrollCorner = getScrollCorner.call(this, hScrollBar, vScrollBar);
        if (scrollCorner)
        {
            scrollCorner["x:boxModel"].setUsableRect(boxModel);
        }
    };

    //修正盒模型
    this.adjustBoxModel = function (boxModel, hScrollBar, vScrollBar) {

        if (hScrollBar || vScrollBar)
        {
            if (hScrollBar)
            {
                boxModel.innerRect.height -= hScrollBar["x:storage"].height;
            }

            if (vScrollBar)
            {
                boxModel.innerRect.width -= vScrollBar["x:storage"].width;
            }

            this.setScrollBarRect(boxModel, hScrollBar, vScrollBar);
        }
    };



    //排列子控件
    this.arrange = function (boxModel) {

    };




    function getHorizontalBar(viewportSize) {

        var storage = this["x:storage"],
            box = this["x:boxModel"],
            result = this["x:hScrollBar"];


        if (storage.horizontalScroll == "always" || (storage.horizontalScroll == "auto" && box.scrollWidth > viewportSize))
        {
            if (!result)
            {
                result = this["x:hScrollBar"] = this["x:hScrollBar:cache"] || this.createHorizontalScrollBar();
            }

            result["x:parent"] = this;

            storage = result["x:storage"];

            storage.value = box.scrollLeft;
            storage.maxValue = box.scrollWidth;
            storage.viewportSize = viewportSize;

            return result;
        }
        else if (result)
        {
            this["x:hScrollBar:cache"] = result;
            this["x:hScrollBar"] = null;
        }
    };

    function getVerticalBar(viewportSize) {

        var storage = this["x:storage"],
            box = this["x:boxModel"],
            result = this["x:vScrollBar"];


        if (storage.verticalScroll == "always" || (storage.verticalScroll == "auto" && box.scrollHeight > viewportSize))
        {
            if (!result)
            {
                result = this["x:vScrollBar"] = this["x:vScrollBar:cache"] || this.createVerticalScrollBar();
            }

            result["x:parent"] = this;

            storage = result["x:storage"];

            storage.value = box.scrollTop;
            storage.maxValue = box.scrollHeight;
            storage.viewportSize = viewportSize;

            return result;
        }
        else if (result)
        {
            this["x:vScrollBar:cache"] = result;
            this["x:vScrollBar"] = null;
        }
    };

    function getScrollCorner(hScrollBar, vScrollBar) {

        var result = this["x:scrollCorner"];


        if (hScrollBar && vScrollBar)
        {
            if (!result)
            {
                result = this["x:scrollCorner"] = this["x:scrollCorner:cache"] || this.createScrollCorner();
            }

            return result;
        }
        else if (result)
        {
            this["x:scrollCorner:cache"] = result;
            this["x:scrollCorner"] = null;
        }
    };



    //创建水平滚动条
    this.createHorizontalScrollBar = function () {

        return new $.ScrollBar();
    };

    //创建竖直滚动条
    this.createVerticalScrollBar = function () {

        var result = new $.ScrollBar();
        result.isVertical = true;
        return result;
    };

    //创建滚动条拐角
    this.createScrollCorner = function () {

        return new $.ScrollCorner();
    };



    //设置滚动条显示范围
    this.setScrollBarRect = function (boxModel, hScrollBar, vScrollBar) {

        var storage_1 = hScrollBar && hScrollBar["x:storage"],
            storage_2 = vScrollBar && vScrollBar["x:storage"],
            r = boxModel.borderRect;


        if (storage_1 && storage_2) //如果出现两个滚动条
        {
            storage_1.width = r.width - storage_2.width;
            storage_2.height = r.height - storage_1.height;

            hScrollBar["x:boxModel"].setUsableRect(boxModel, r.x, r.bottom - storage_1.height, hScrollBar.width, storage_1.height, true);
            vScrollBar["x:boxModel"].setUsableRect(boxModel, r.right - storage_2.width, r.y, storage_2.width, vScrollBar.height, true);
        }
        else if (storage_1) //只出现水平滚动条
        {
            storage_1.width = r.width;
            hScrollBar["x:boxModel"].setUsableRect(boxModel, r.x, r.bottom - storage_1.height, r.width, storage_1.height, true);
        }
        else //只出现竖直滚动条
        {
            storage_2.height = r.height;
            vScrollBar["x:boxModel"].setUsableRect(boxModel, r.right - storage_2.width, r.y, storage_2.width, r.height, true);
        }
    };


});

