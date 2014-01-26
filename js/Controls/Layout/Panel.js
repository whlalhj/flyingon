//面板控件
flyingon.class("Panel", flyingon.ScrollableControl, function (Class, flyingon) {




    Class.create = function () {


        //子控件集合
        this.__children__ = new flyingon.ControlCollection(this);
    };





    //修改默认修值接受拖放
    this.defaultValue("droppable", true);



    this.defaultValue("width", 400);

    this.defaultValue("height", 400);



    //子控件集合
    this.defineProperty("children", function () {

        return this.__children__;
    });



    //当前布局 见枚举flyingon.Layout对象
    this.defineProperty("layout", "flow", {

        attributes: "locate|style",
        valueChangedCode: "boxModel.scrollLeft = 0;\nboxModel.scrollTop = 0;"
    });


    //排列方向 horizontal(横向)或vertical(纵向)
    this.defineProperty("orientation", "horizontal", "locate|style");

    //镜向变换 以容器中心点作为变换坐标原点
    //none: 不变换
    //x-axis: 沿x中心轴变换
    //y-axis: 沿y中心轴变换
    //origin: 沿坐标原点变换
    this.defineProperty("mirror", "none", "measure|style");



    //布局x轴间隔 0-1之间表示间隔值为总宽度百分比
    this.defineProperty("spaceX", 0, "locate|style");

    //布局y轴间隔 0-1之间表示间隔值为总高度的百分比
    this.defineProperty("spaceY", 0, "locate|style");

    //布局行高
    this.defineProperty("lineHeight", 0, "locate|style");

    //布局列宽
    this.defineProperty("lineWidth", 0, "locate|style");

    //当前布局页索引
    this.defineProperty("index", 0, "measure");

    //布局列数
    this.defineProperty("columns", 3, "measure|style");

    //布局行数
    this.defineProperty("rows", 3, "measure|style");

    //布局网格
    this.defineProperty("grid", null, "measure|style");




    //布局集
    var layouts = {};

    //单行布局 spaceX verticalAlign
    function line_horizontal(items, boxModel, clientRect, spaceX, spaceY) {

        var x = 0,
            width = clientRect.width,
            height = clientRect.height,
            scrollHeight = boxModel.scrollHeight;


        for (var i = 0, length = items.length; i < length; i++)
        {
            var item = items[i],
                box = item.__boxModel__;

            if (box.visible = (item.visibility != "collapsed"))
            {
                box.compute_size(boxModel, width - x, height);
                box.measure(boxModel, x, 0, box.width, height, false);

                x = box.right + box.margin[3] + spaceX;

                if (box.height > scrollHeight)
                {
                    scrollHeight = box.height;
                }
            }
        }


        boxModel.scrollWidth = items[items.length - 1].__boxModel__.right;
        boxModel.scrollHeight = scrollHeight;
    };


    //单列排列 spaceY horizontalAlign
    function line_vertical(items, boxModel, clientRect, spaceX, spaceY) {

        var y = 0,
            width = clientRect.width,
            height = clientRect.height,
            scrollWidth = 0;


        for (var i = 0, length = items.length; i < length; i++)
        {
            var item = items[i],
                box = item.__boxModel__;

            if (box.visible = (item.visibility != "collapsed"))
            {
                box.compute_size(boxModel, width, height - y);
                box.measure(boxModel, 0, y, width, box.height, false);

                y = box.bottom + box.margin[2] + spaceY;

                if (box.width > scrollWidth)
                {
                    scrollWidth = box.width;
                }
            }
        }


        boxModel.scrollWidth = scrollWidth;
        boxModel.scrollHeight = items[items.length - 1].__boxModel__.bottom;
    };

    //线性布局 spaceX verticalAlign
    layouts.line = function (items, boxModel, clientRect, orientation, spaceX, spaceY) {

        var fn = orientation == "horizontal" ? line_horizontal : line_vertical;
        fn.call(this, items, boxModel, clientRect, spaceX, spaceY);
    };


    //多行排列 spaceX spaceY lineHeight verticalAlign
    function flow_horizontal(items, boxModel, clientRect, spaceX, spaceY) {

        var x = 0,
            y = 0,
            cache,

            maxWidth = clientRect.width,
            lineHeight = this.lineHeight,
            maxHeight = lineHeight,

            scrollWidth = boxModel.scrollWidth;


        if (lineHeight <= 0)
        {
            lineHeight = clientRect.height;
        }


        for (var i = 0, length = items.length; i < length; i++)
        {
            var item = items[i],
                box = item.__boxModel__;

            if (box.visible = (item.visibility != "collapsed"))
            {
                box.compute_size(boxModel, maxWidth - x, maxHeight);
                box.measure(boxModel, x, y, box.width, maxHeight, false);

                cache = box.right + box.margin[1] + spaceX;

                if (x > 0 && cache > maxWidth) //如果超出宽度则折行
                {
                    //重新定位
                    box.moveTo(x = 0, y += maxHeight + spaceY);
                    cache = box.right + box.margin[1] + spaceX;
                    maxHeight = lineHeight;
                }

                if ((x = cache) > scrollWidth)
                {
                    scrollWidth = x;
                }

                if ((cache = box.height + box.margin[0] + box.margin[2]) > maxHeight)
                {
                    maxHeight = cache;
                }
            }
        }


        boxModel.scrollWidth = scrollWidth;
        boxModel.scrollHeight = items[items.length - 1].__boxModel__.bottom;
    };


    //多列排列 spaceX spaceY lineWidth  horizontalAlign
    function flow_vertical(items, boxModel, clientRect, spaceX, spaceY) {

        var x = 0,
            y = 0,
            cache,

            lineWidth = this.lineWidth,
            maxWidth = lineWidth,
            maxHeight = clientRect.height,

            scrollHeight = boxModel.scrollHeight;


        if (lineWidth <= 0)
        {
            lineWidth = clientRect.width;
        }

        for (var i = 0, length = items.length; i < length; i++)
        {
            var item = items[i],
                box = item.__boxModel__;

            if (box.visible = (this.visibility != "collapsed"))
            {
                box.compute_size(boxModel, maxWidth, maxHeight - y);
                box.measure(boxModel, x, y, maxWidth, box.height, false);

                cache = box.bottom + box.margin[2] + spaceY;

                if (y > 0 && cache > maxHeight) //如果超出高度则折行
                {
                    //重新定位
                    box.moveTo(x += maxWidth + spaceX, y = 0);
                    cache = box.bottom + box.margin[2] + spaceY;
                    maxWidth = lineWidth;
                }

                if ((y = cache) > scrollHeight)
                {
                    scrollHeight = y;
                }

                if ((cache = box.width + box.margin[3] + box.margin[1]) > maxWidth)
                {
                    maxWidth = cache;
                }
            }
        }


        boxModel.scrollWidth = items[items.length - 1].__boxModel__.right;
        boxModel.scrollHeight = scrollHeight;
    };

    //流式布局 spaceX verticalAlign
    layouts.flow = function (items, boxModel, clientRect, orientation, spaceX, spaceY) {

        var fn = orientation == "horizontal" ? flow_horizontal : flow_vertical;
        fn.call(this, items, boxModel, clientRect, spaceX, spaceY);
    };


    //单个显示 layoutPage  horizontalAlign verticalAlign
    layouts.single = function (items, boxModel, clientRect, orientation, spaceX, spaceY) {

        var index = this.index,
            length = items.length;

        if (index < 0)
        {
            index = 0;
        }
        else if (index >= length)
        {
            index = length - 1;
        }

        for (var i = 0; i < length; i++)
        {
            var item = items[i],
                box = item.__boxModel__;

            if (box.visible = (i == index))
            {
                box.measure(boxModel, 0, 0, clientRect.width, clientRect.height);
            }
        }
    };


    //停靠布局 spaceX spaceY dock  horizontalAlign verticalAlign
    layouts.dock = function (items, boxModel, clientRect, orientation, spaceX, spaceY) {

        var x = 0,
            y = 0,
            width = clientRect.width,
            height = clientRect.height,

            right = width,
            bottom = height,

            fill = [];

        for (var i = 0, length = items.length; i < length; i++)
        {
            var item = items[i],
                box = item.__boxModel__;

            if (box.visible = (item.visibility != "collapsed"))
            {
                if (width < 0 || height < 0)
                {
                    box.visible = false;
                }
                else
                {
                    switch (item.dock)
                    {
                        case "left":
                            box.measure(boxModel, x, y, item.width, height);

                            x = box.right + spaceX;
                            width = right - x;
                            break;

                        case "top":
                            box.measure(boxModel, x, y, width, item.height);

                            y = box.bottom + spaceY;
                            height = bottom - y;
                            break;

                        case "right":
                            box.compute_size(boxModel, width, height);
                            box.measure(boxModel, right, y, box.width, height, false);

                            right -= box.margin[1] + box.width;
                            right -= spaceX;
                            width = right - x;
                            break;

                        case "bottom":
                            box.compute_size(boxModel, width, height);
                            box.measure(boxModel, x, bottom, width, box.height, false);

                            bottom -= box.margin[2] + box.height;
                            bottom -= spaceY;
                            height = bottom - y;
                            break;

                        default:
                            fill.push(box);
                            break;
                    }
                }
            }
        }


        if (width > x && height > y)
        {
            for (var i = 0; i < fill.length; i++)
            {
                fill[i].measure(boxModel, x, y, width, height);
            }
        }

    };


    //队列布局 columns rows gridLineColor spaceX spaceY  horizontalAlign verticalAlign
    layouts.queue = function (items, boxModel, clientRect, orientation, spaceX, spaceY) {


        var horizontal = orientation == "horizontal",

            rows = this.rows,
            columns = this.columns,
            count = (rows = rows > 0 ? rows : 3) * (columns = (columns > 0 ? columns : 3)),
            row = 0,
            column = 0,

            width_cache = [],
            height_cache = [],

            x = spaceX,
            y = clientRect.width - spaceX * (columns + 1);


        //先计算好行列位置及宽度
        for (var i = 0; i < columns; i++)
        {
            var value = Math.floor(y / (columns - i));
            width_cache[i] = [x, value];

            x += value + spaceX;
            y -= value;
        }

        x = spaceY;
        y = clientRect.height - spaceY * (rows + 1);

        for (var i = 0; i < rows; i++)
        {
            var value = Math.floor(y / (rows - i));
            height_cache[i] = [x, value];

            x += value + spaceY;
            y -= value;
        }


        for (var i = 0, length = items.length; i < length; i++)
        {
            var item = items[i],
                box = item.__boxModel__;

            if (box.visible = row < rows && column < columns && item.visibility != "collapsed")
            {
                if (horizontal)
                {
                    var width = width_cache[column++],
                        height = height_cache[row];

                    box.measure(boxModel, width[0], height[0], width[1], height[1]);

                    if (column >= columns)
                    {
                        column = 0;
                        row++;
                    }
                }
                else
                {
                    var width = width_cache[column],
                        height = height_cache[row++];

                    box.measure(boxModel, width[0], height[0], width[1], height[1]);

                    if (row >= rows)
                    {
                        row = 0;
                        column++;
                    }
                }
            }
        }
    };


    //网格布局 table spaceX spaceY  horizontalAlign verticalAlign
    //示例: "T R* C* C* C* R* C* C* C* R* C* C* C* END"
    layouts.grid = function (items, boxModel, clientRect, orientation, spaceX, spaceY) {

        var grid = this.grid;

        if (!(grid instanceof flyingon.GridDefine))
        {
            grid = new flyingon.GridDefine().load(grid);
        }

        grid.spaceX = spaceX;
        grid.spaceY = spaceY;

        grid.compute(clientRect.width, clientRect.height);
        grid.match(items, boxModel, orientation == "vertical");
    };


    //绝对定位 left top
    layouts.absolute = function (items, boxModel, clientRect, spaceX, spaceY) {

        for (var i = 0, length = items.length; i < length; i++)
        {
            var item = items[i],
                box = item.__boxModel__;

            if (box.visible = (this.visibility != "collapsed"))
            {
                box.measure(boxModel, this.left, this.top, this.width, this.height);

                if (box.right > boxModel.scrollWidth)
                {
                    boxModel.scrollWidth = box.right;
                }

                if (box.bottom > boxModel.scrollHeight)
                {
                    boxModel.scrollHeight = box.bottom;
                }
            }
        }
    };



    //注册自定义布局 注意回调函数规范及设置盒模型的scrollWidth及scrollHeight值
    Class.registryLayout = function (name, fn) {

        layouts[name] = fn;
    };




    //测量
    this.measure = function (boxModel) {

        flyingon.Panel.super.measure.call(this, boxModel);

        var mirror = this.mirror;

        if (mirror != "none")
        {
            var children = boxModel.children,
                length = children && children.length;

            if (length > 0)
            {
                switch (this.mirror) //处理镜像变换
                {
                    case "x-axis": //沿x中心轴变换
                        var height = boxModel.scrollHeight;

                        for (var i = 0; i < length; i++)
                        {
                            var box = children[i];
                            box.moveTo(box.x, height - box.bottom);
                        }
                        break;

                    case "y-axis": //沿y中心轴变换
                        var width = boxModel.scrollWidth;

                        for (var i = 0; i < length; i++)
                        {
                            var box = children[i];
                            box.moveTo(width - box.right, box.y);
                        }
                        break;

                    case "origin": //沿坐标原点变换
                        width = boxModel.scrollWidth;
                        height = boxModel.scrollHeight;

                        for (var i = 0; i < length; i++)
                        {
                            var box = children[i];
                            box.moveTo(width - box.right, height - box.bottom);
                        }
                        break;
                }
            }
        }
    };

    //排列子控件
    this.arrange = function (boxModel, clientRect) {


        boxModel.children = null;
        this.__render_children__ = null;


        var items = this.__children__.__items__;

        if (items.length > 0)
        {
            var fn = layouts[this.layout];

            if (fn)
            {
                var spaceX = this.spaceX,
                    spaceY = this.spaceY;

                if (typeof spaceX != "number")
                {
                    spaceX = flyingon.parseInt(spaceX, clientRect.width);
                }

                if (typeof spaceY != "number")
                {
                    spaceY = flyingon.parseInt(spaceY, clientRect.height);
                }

                fn.call(this, items, boxModel, clientRect, this.orientation, spaceX, spaceY);
            }
        }

        return this;
    };



    //获取当前可渲染的子项
    this.__fn_render_children__ = function (boxModel) {

        var result = this.__render_children__;

        if (!result)
        {
            var clipToBounds = this.clipToBounds,

                children = boxModel.children,
                r = boxModel.clientRect,
                x = boxModel.scrollLeft,
                y = boxModel.scrollTop,
                right = x + r.width,
                bottom = y + r.height;

            result = this.__render_children__ = [];

            for (var i = 0, length = children.length; i < length; i++)
            {
                var item = children[i];

                if (item.visible &&
                    item.right >= x &&
                    item.bottom >= y &&
                    item.ownerControl.visibility == "visible" &&
                    (!clipToBounds || (item.x < right && item.y < bottom)))
                {
                    result.push(item);
                }
            }
        }

        return result;
    };





    //获取指定位置的控件
    this.getControlAt = function (x, y) {

        //判断滚动条
        var result = flyingon.Panel.super.getControlAt.call(this, x, y);

        if (result != this)
        {
            return result;
        }



        var box = this.__boxModel__,
            r = box.clientRect;


        x += box.scrollLeft - r.x;
        y += box.scrollTop - r.y;

        //if (this.transform)
        //{

        //}


        var items = this.__render_children__;

        if (items && items.length > 0)
        {
            for (var i = items.length - 1; i >= 0 ; i--)
            {
                var item = items[i].ownerControl;

                if (item.hitTest(x, y))
                {
                    return item.getControlAt ? item.getControlAt(x, y) : item;
                }
            }
        }


        return this;
    };




    this.focus = function () {


        if (this.containsFocused)
        {
            return true;
        }


        var items = this.__children__.__items__;

        for (var i = 0, length = items.length; i < length; i++)
        {
            if (items[i].focus(event))
            {
                return true;
            }
        }

        return flyingon.Panel.super.focus.call(this, event);
    };

    this.blur = function () {

        return this.containsFocused ? flyingon.Panel.super.blur.call(this, event) : false;
    };




    this.serialize = function (writer) {

        flyingon.Panel.super.serialize.call(this, writer);

        var items = this.__children__.__items__;
        if (items && items.length > 0)
        {
            writer.array("children", items);
        }
    };

    this.deserialize = function (reader, data) {

        flyingon.Panel.super.deserialize.call(this, reader, data);

        var items = reader.array(this.__children__, "__items__", data["children"]);
        if (items && items.length > 0)
        {
            for (var i = 0, length = items.length; i < length; i++)
            {
                items[i].__parent__ = this;
            }
        }
    };


}, true);
