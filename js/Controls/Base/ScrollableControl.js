//可滚动控件
flyingon.class("ScrollableControl", flyingon.Control, function (Class, flyingon) {




    this.defineProperty("horizontalScrollBar", function () {

        return this["x:hScrollBar"];
    });


    this.defineProperty("verticalScrollBar", function () {

        return this["x:vScrollBar"];
    });




    //定义水平及竖直滚动条显示方式 auto always never  见枚举flyingon.ScrollBarVisibility对象
    this.defineProperties(["horizontalScroll", "verticalScroll"], "auto", "measure");




    function defineProperty(name, boxModel, attributes) {

        this.defineProperty("name", 0, {

            attributes: attributes || "invalidate",
            valueChangedCode: "this['x:boxModel']['" + boxModel + "'] = value;"
        });
    };

    //
    defineProperty.call(this, "scrollLeft", "offsetX");

    //
    defineProperty.call(this, "scrollTop", "offsetY");

    //
    defineProperty.call(this, "scrollWidth", "maxWidth", "measure");

    //
    defineProperty.call(this, "scrollHeight", "maxHeight", "measure");





    this["event:scroll"] = function (event) {

        var box = this["x:boxModel"];

        event.changedX && (box.offsetX += event.changedX);
        event.changedY && (box.offsetY += event.changedY);

        this["x:render:children"] = null;
        this.invalidate();

        //修正因滚动造成的输入符位置变更问题
        var ownerWindow = this.ownerWindow;
        ownerWindow && this.isParent(ownerWindow["x:focusControl"]) && ownerWindow["y:caret"](event.changedX, event.changedY);

        event.stopPropagation();
    };

    this["event:mousewheel"] = function (event) {

        var vScrollBar = this["x:vScrollBar"];

        if (vScrollBar)
        {
            var storage = vScrollBar["x:storage"],
                step = event.wheelDelta < 0 ? storage.minStep : -storage.minStep;

            vScrollBar.changeValue(step);
            event.stopPropagation();
        }
    };





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



    this.measure = function (boxModel) {


        boxModel.compute();


        var innerRect = boxModel.innerRect,
            width = innerRect.width,
            height = innerRect.height;


        //自动滚动条时先按无滚动条进行排列
        var _hScrollBar = horizontalBar.call(this, width),
            _vScrollBar = verticalBar.call(this, height);

        _vScrollBar && (innerRect.width -= _vScrollBar["x:storage"].width);
        _hScrollBar && (innerRect.height -= _hScrollBar["x:storage"].height);

        this.arrange(boxModel, innerRect);


        var hScrollBar = horizontalBar.call(this, width),
            vScrollBar = verticalBar.call(this, height)

        //如果滚动条有变则重新计算及排列
        if (_hScrollBar != hScrollBar || _vScrollBar != vScrollBar)
        {
            innerRect.width = width;
            innerRect.height = height;

            vScrollBar && (width -= vScrollBar["x:storage"].width);
            hScrollBar && (height -= hScrollBar["x:storage"].height);

            this.arrange(boxModel, innerRect);
        }


        //处理滚动条
        if (hScrollBar || vScrollBar)
        {
            hScrollBar && (hScrollBar.maxValue = boxModel.maxWidth);
            vScrollBar && (vScrollBar.maxValue = boxModel.maxHeight);


            //设置滚动条位置
            this["y:measure:scroll"](boxModel, hScrollBar, vScrollBar);


            //处理拐角
            var scrollCorner = this["x:scrollCorner"];

            if (hScrollBar && vScrollBar)
            {
                !scrollCorner && (scrollCorner = this["x:scrollCorner"] = this["x:scrollCorner:cache"] || this.createScrollCorner());
                scrollCorner["x:boxModel"].measure(boxModel, 0, 0, 0, 0);
            }
            else if (scrollCorner)
            {
                this["x:scrollCorner:cache"] = scrollCorner;
                this["x:scrollCorner"] = null;
            }
        }
    };

    this.adjustAutoSize = function (boxModel, size) {

        //size.width = boxModel.maxWidth;
        //size.height = boxModel.maxHeight;
    };



    //排列子控件
    this.arrange = function (boxModel, usableRect) {

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

    function horizontalBar(viewportSize) {

        var storage = this["x:storage"],
            box = this["x:boxModel"],
            result = this["x:hScrollBar"];

        if (storage.horizontalScroll == "always" || (storage.horizontalScroll == "auto" && box.maxWidth > viewportSize &&
            storage.autoSize != "width" && storage.autoSize != "all"))
        {
            !result && (result = this["x:hScrollBar"] = restore.call(this, "x:hScrollBar:cache") || this.createHorizontalScrollBar());

            result["x:parent"] = this;

            storage = result["x:storage"];
            storage.value = box.offsetX;
            storage.maxValue = box.maxWidth;
            storage.viewportSize = viewportSize;

            return result;
        }
        else if (result)
        {
            cache.call(this, result, "x:hScrollBar");
        }
    };

    function verticalBar(viewportSize) {

        var storage = this["x:storage"],
            box = this["x:boxModel"],
            result = this["x:vScrollBar"];

        if (storage.verticalScroll == "always" || (storage.verticalScroll == "auto" && box.maxHeight > viewportSize &&
            storage.autoSize != "height" &&
            storage.autoSize != "all"))
        {
            !result && (result = this["x:vScrollBar"] = restore.call(this, "x:vScrollBar:cache") || this.createVerticalScrollBar());

            result["x:parent"] = this;

            storage = result["x:storage"];
            storage.value = box.offsetY;
            storage.maxValue = box.maxHeight;
            storage.viewportSize = viewportSize;

            return result;
        }
        else if (result)
        {
            cache.call(this, result, "x:vScrollBar");
        }
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
    this["y:measure:scroll"] = function (boxModel, hScrollBar, vScrollBar) {

        var storage_1 = hScrollBar && hScrollBar["x:storage"],
            storage_2 = vScrollBar && vScrollBar["x:storage"],
            r = boxModel.borderRect;


        if (storage_1 && storage_2) //如果出现两个滚动条
        {
            storage_1.width = r.width - storage_2.width;
            storage_2.height = r.height - storage_1.height;

            hScrollBar["x:boxModel"].measure(boxModel, r.x, r.bottom - storage_1.height, hScrollBar.width, storage_1.height, true);
            vScrollBar["x:boxModel"].measure(boxModel, r.right - storage_2.width, r.y, storage_2.width, vScrollBar.height, true);
        }
        else if (storage_1) //只出现水平滚动条
        {
            storage_1.width = r.width;
            hScrollBar["x:boxModel"].measure(boxModel, r.x, r.bottom - storage_1.height, r.width, storage_1.height, true);
        }
        else //只出现竖直滚动条
        {
            storage_2.height = r.height;
            vScrollBar["x:boxModel"].measure(boxModel, r.right - storage_2.width, r.y, storage_2.width, r.height, true);
        }
    };


});

