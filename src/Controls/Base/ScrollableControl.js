//可滚动控件基类
flyingon.defineClass("ScrollableControl", flyingon.Control, function (Class, base, flyingon) {



    this.__event_bubble_mousewheel = function (event) {

        var scrollbar_y = this.__scrollbar_y;

        if (scrollbar_y)
        {
            scrollbar_y.value += event.wheelDelta > 0 ? -20 : 20;
            event.stopImmediatePropagation();
        }
    };


    this.__fn_scrollTo = function (x, y) {

    };



    //是否需重新处理滚动条
    this.__scroll_dirty = false;



    //标记水平滚动条
    this.__fn_sign_scrollbar_x = function (box, rtl) {

        var scrollbar_x = this.__scrollbar_x || (this.__scrollbar_x = this.__scrollbar_x__ || new flyingon.ScrollBar(this));

        scrollbar_x.__rtl = rtl; //不支持单独设置rtl

        this.clientHeight = this.controlHeight - box.control_spaceY - (+scrollbar_x.height || 16);
        this.__scroll_dirty = true;
    };

    //标记竖直滚动条
    this.__fn_sign_scrollbar_y = function (box, rtl) {

        var scrollbar_y = this.__scrollbar_y || (this.__scrollbar_y = this.__scrollbar_y__ || new flyingon.ScrollBar(this, true)),
            thickness = +scrollbar_y.width || 16;

        if (scrollbar_y.__rtl = rtl) //滚动条在左边
        {
            this.clientX = box.clientX + thickness;
        }
        else
        {
            this.clientX = box.clientX;
        }

        this.clientWidth = this.controlWidth - box.control_spaceX - thickness;
        this.__scroll_dirty = true;
    };


    //测量滚动条 需先进行标记
    this.__fn_measure_scroll = function (box) {

        var scrollbar_x = this.__scrollbar_x,
            scrollbar_y = this.__scrollbar_y,
            thickness1 = scrollbar_x && +scrollbar_x.height || 16,
            thickness2 = scrollbar_y && +scrollbar_y.width || 16,
            x,
            y,
            width,
            height;

        //有水平滚动条
        if (scrollbar_x)
        {
            scrollbar_x.maxValue = this.contentWidth - this.clientWidth;
            this.contentX = scrollbar_x.__rtl ? scrollbar_x.maxValue - scrollbar_x.value : scrollbar_x.value;

            x = scrollbar_y && scrollbar_y.__rtl ? box.border_left + thickness2 : box.border_left;
            y = this.controlHeight - box.border_bottom - thickness1;
            width = this.controlWidth - box.border_spaceX - (scrollbar_y ? thickness2 : 0);

            this.__fn_scrollbar(scrollbar_x, x, y, width, thickness1, false);
        }

        //有竖直滚动条
        if (scrollbar_y)
        {
            scrollbar_y.maxValue = this.contentHeight - this.clientHeight;
            this.contentY = scrollbar_y.value;

            x = scrollbar_y && scrollbar_y.__rtl ? box.border_left : this.controlWidth - box.border_right - thickness2;
            height = this.controlHeight - box.border_spaceY - (scrollbar_x ? thickness1 : 0);

            this.__fn_scrollbar(scrollbar_y, x, box.border_top, thickness2, height, true);
        }

        //有双滚动条时生成拐角
        if (scrollbar_x && scrollbar_y)
        {
            var corner = this.__scroll_corner || (this.__scroll_corner = new flyingon.ScrollCorner(this));

            corner.measure(thickness2, thickness1, 1, 1);
            corner.locate(x, y);
        }

        this.__scroll_dirty = false;
    };


    //设置滚动条
    this.__fn_scrollbar = function (scrollbar, x, y, width, height, vertical) {

        scrollbar.measure(width, height, 1, 1);
        scrollbar.locate(x, y);
    };



    //排列子控件
    this.__fn_arrange = function () {

        var box = this.__box_style,
            overflowX = this.overflowX,
            overflowY = this.overflowY,
            rtl = this.direction === "rtl",
            cache = false;

        //处理横向滚动条
        if (overflowX === "scroll")
        {
            this.__fn_sign_scrollbar_x(box, rtl);
        }
        else if (this.__scrollbar_x) //如果存在滚动条则重算客户区
        {
            this.clientHeight = this.controlHeight - box.control_spaceY;
        }

        //处理纵向滚动条
        if (overflowY === "scroll")
        {
            this.__fn_sign_scrollbar_y(box, rtl);
        }
        else if (this.__scrollbar_y) //如果存在滚动条则重算客户区
        {
            this.clientX = box.clientX;
            this.clientWidth = this.controlWidth - box.control_spaceX;
        }

        //初始化内容区
        this.contentWidth = this.clientWidth;
        this.contentHeight = this.clientHeight;

        //排列 overflow === "auto" 时先按没有滚动条的方式排列
        this.arrange();

        //处理水平方向自动滚动
        if (this.contentWidth > this.clientWidth && overflowX === "auto")
        {
            this.__fn_sign_scrollbar_x(box, rtl);
            cache = true;
        }
        else if (this.__scrollbar_x) //如果存在滚动条则隐藏
        {
            this.__scrollbar_x.value = 0;
            this.__scrollbar_x__ = this.__scrollbar_x;
            this.__scrollbar_x = null;

            this.contentX = 0;
        }

        //处理竖直方向自动滚动
        if (this.contentHeight > this.clientHeight && overflowY === "auto")
        {
            this.__fn_sign_scrollbar_y(box, rtl);
            cache = true;
        }
        else if (this.__scrollbar_y) //如果存在滚动条则隐藏
        {
            this.__scrollbar_y.value = 0;
            this.__scrollbar_y__ = this.__scrollbar_y;
            this.__scrollbar_y = null;

            this.contentY = 0;
        }

        //重新排列
        if (cache)
        {
            this.arrange();
        }

        //测量滚动条
        if (this.__scroll_dirty)
        {
            this.__fn_measure_scroll(box);
        }

        //执行rtl变换
        if (rtl && this.__children)
        {
            this.__fn_arrange_rtl(this.__children);
        }

        //如果有字体则清空字体排列缓存
        if (this.__text)
        {
            this.__text.rows = null;
        }

        this.__arrange_dirty = false;
    };



    //查找指定位置的可视控件
    //注: 非可见控件不能命中
    this.fintAt = function (x, y) {

        var x1 = x - this.controlX,
            y1 = y - this.controlY;

        if (this.__scrollbar_x && this.__scrollbar_x.hitTest(x1, y1))
        {
            return this.__scrollbar_x.fintAt(x1, y1);
        }

        if (this.__scrollbar_y && this.__scrollbar_y.hitTest(x1, y1))
        {
            return this.__scrollbar_y.fintAt(x1, y1);
        }

        return base.fintAt.call(this, x, y);
    };


    //更新控件
    this.__fn_update = function (painter, visible_items) {

        var scrollbar_x = this.__scrollbar_x,
            scrollbar_y = this.__scrollbar_y,
            scroll_corner;

        //调用父类的更新方法
        base.__fn_update.call(this, painter, visible_items);

        //更新滚动条
        if (scrollbar_x && scrollbar_x.__current_dirty)
        {
            scrollbar_x.render(painter, false);
        }

        if (scrollbar_y)
        {
            if (scrollbar_y.__current_dirty)
            {
                scrollbar_y.render(painter, false);
            }

            if ((scroll_corner = this.__scroll_corner) && scroll_corner.__current_dirty)
            {
                scroll_corner.render(painter, false);
            }
        }
    };


    //绘制附加项(滚动动条)
    this.paint_additions = function (painter) {

        var scrollbar_x = this.__scrollbar_x,
            scrollbar_y = this.__scrollbar_y;

        if (scrollbar_x)
        {
            scrollbar_x.render(painter, false);
        }

        if (scrollbar_y)
        {
            scrollbar_y.render(painter, false);

            if (scrollbar_x && this.__scroll_corner)
            {
                this.__scroll_corner.render(painter, false);
            }
        }
    };



});