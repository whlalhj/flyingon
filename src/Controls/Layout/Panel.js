//面板控件
flyingon.defineClass("Panel", flyingon.ScrollableControl, function (Class, base, flyingon) {




    Class.create = function () {


        //子控件集合
        this.__children__ = new flyingon.ControlCollection(this);

        //初始化子盒模型
        this.__boxModel__.children = [];
    };





    //修改默认修值接受拖放
    this.defaultValue("droppable", true);



    this.defaultValue("width", 400);

    this.defaultValue("height", 400);



    //子控件集合
    this.defineProperty("children", function () {

        return this.__children__;
    });



    var attributes = {

        attributes: "locate|style",
        changed: "boxModel.scrollLeft = 0;\nboxModel.scrollTop = 0;"
    };


    //当前布局
    //line:     线性布局
    //flow:     流式布局
    //single:   单个显示
    //dock:     停靠布局
    //queue:    队列布局
    //grid:     网格布局
    //absolute: 绝对定位
    this.defineProperty("layout", "flow", attributes);


    //排列方向
    //horizontal: 横向
    //vertical:   纵向
    this.defineProperty("orientation", "horizontal", attributes);

    //镜向变换 以容器中心点作为变换坐标原点
    //none: 不变换
    //x-axis: 沿x中心轴变换
    //y-axis: 沿y中心轴变换
    //origin: 沿坐标原点变换
    this.defineProperty("mirror", "none", "measure|style");



    //布局x轴间隔 0-1之间表示间隔值为总宽度百分比
    this.defineProperty("spaceX", 0, attributes);

    //布局y轴间隔 0-1之间表示间隔值为总高度的百分比
    this.defineProperty("spaceY", 0, attributes);

    //布局行高
    this.defineProperty("lineHeight", 0, attributes);

    //布局列宽
    this.defineProperty("lineWidth", 0, attributes);

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

    //单行布局 spaceX
    function line_horizontal(items, clientRect, spaceX, spaceY) {

        var x = 0,

            width = clientRect.width,
            height = clientRect.height,

            boxModel = this.__boxModel__,
            scrollWidth = boxModel.scrollWidth,
            scrollHeight = boxModel.scrollHeight;


        for (var i = 0, length = items.length; i < length; i++)
        {
            var item = items[i],
                box = item.__boxModel__;

            if (box.visible = (item.visibility != "collapsed"))
            {
                box.measure(x, 0, 0, 0, width - x, height, null, height);

                if ((x = box.right + box.margin.left) > scrollWidth)
                {
                    scrollWidth = x;
                }

                x += spaceX;

                if (box.height > scrollHeight)
                {
                    scrollHeight = box.height;
                }
            }
        }


        boxModel.scrollWidth = scrollWidth;
        boxModel.scrollHeight = scrollHeight;
    };


    //单列排列 spaceY
    function line_vertical(items, clientRect, spaceX, spaceY) {

        var y = 0,

            width = clientRect.width,
            height = clientRect.height,

            boxModel = this.__boxModel__,
            scrollWidth = boxModel.scrollWidth,
            scrollHeight = boxModel.scrollHeight;


        for (var i = 0, length = items.length; i < length; i++)
        {
            var item = items[i],
                box = item.__boxModel__;

            if (box.visible = (item.visibility != "collapsed"))
            {
                box.measure(0, y, 0, 0, width, height - y, width);

                if (box.width > scrollWidth)
                {
                    scrollWidth = box.width;
                }

                if ((y = box.bottom + box.margin.bottom) > scrollHeight)
                {
                    scrollHeight = y;
                }

                y += spaceY;
            }
        }


        boxModel.scrollWidth = scrollWidth;
        boxModel.scrollHeight = scrollHeight;
    };

    //线性布局 spaceX
    layouts.line = function (items, clientRect, orientation, spaceX, spaceY) {

        var fn = orientation == "horizontal" ? line_horizontal : line_vertical;
        fn.call(this, items, clientRect, spaceX, spaceY);
    };


    //多行排列 spaceX spaceY lineHeight
    function flow_horizontal(items, clientRect, spaceX, spaceY) {

        var x = 0,
            y = 0,

            lineHeight = this.lineHeight,

            maxWidth = clientRect.width,
            maxHeight = lineHeight,

            boxModel = this.__boxModel__,
            scrollWidth = boxModel.scrollWidth,
            scrollHeight = boxModel.scrollHeight,

            cache;



        for (var i = 0, length = items.length; i < length; i++)
        {
            var item = items[i],
                box = item.__boxModel__;

            if (box.visible = (item.visibility != "collapsed"))
            {
                box.measure(x, y, 0, 0, maxWidth - x, lineHeight, null, lineHeight);

                cache = box.right + box.margin.right;

                if (x > 0)
                {
                    var newline;

                    switch (item.flow)
                    {
                        case "auto": //如果超出宽度则折行
                            newline = cache > maxWidth;
                            break;

                        case "inline": //永远不换行
                            newline = false;
                            break;

                        case "newline": //永远换行
                            newline = true;
                            break;
                    }

                    //换行
                    if (newline)
                    {
                        box.moveTo(x = 0, y += maxHeight + spaceY, true);
                        cache = box.right + box.margin.right;
                        maxHeight = lineHeight;
                    }
                }

                if ((x = cache) > scrollWidth)
                {
                    scrollWidth = x;
                }

                if ((cache = y + maxHeight) > scrollHeight)
                {
                    scrollHeight = cache;
                }

                if ((cache = box.height + box.margin.spaceY) > maxHeight)
                {
                    maxHeight = cache;
                }

                x += spaceX;
            }
        }


        boxModel.scrollWidth = scrollWidth;
        boxModel.scrollHeight = scrollHeight;
    };


    //多列排列 spaceX spaceY lineWidth
    function flow_vertical(items, clientRect, spaceX, spaceY) {

        var x = 0,
            y = 0,

            lineWidth = this.lineWidth,

            maxWidth = lineWidth,
            maxHeight = clientRect.height,

            boxModel = this.__boxModel__,
            scrollWidth = boxModel.scrollWidth,
            scrollHeight = boxModel.scrollHeight,

            cache;


        for (var i = 0, length = items.length; i < length; i++)
        {
            var item = items[i],
                box = item.__boxModel__;

            if (box.visible = (this.visibility != "collapsed"))
            {
                box.measure(x, y, 0, 0, lineWidth, maxHeight - y, lineWidth);

                cache = box.bottom + box.margin.bottom;

                if (y > 0)
                {
                    var newline;

                    switch (item.flow)
                    {
                        case "auto": //如果超出高度则折行
                            newline = cache > maxHeight;
                            break;

                        case "inline": //永远不换行
                            newline = false;
                            break;

                        case "newline": //永远换行
                            newline = true;
                            break;
                    }

                    //换行
                    if (newline)
                    {
                        box.moveTo(x += maxWidth + spaceX, y = 0, true);
                        cache = box.bottom + box.margin.bottom;
                        maxWidth = lineWidth;
                    }
                }

                if ((y = cache) > scrollHeight)
                {
                    scrollHeight = y;
                }

                if ((cache = x + maxWidth) > scrollWidth)
                {
                    scrollWidth = cache;
                }

                if ((cache = box.width + box.margin.spaceX) > maxWidth)
                {
                    maxWidth = cache;
                }

                y += spaceY;
            }
        }


        boxModel.scrollWidth = scrollWidth;
        boxModel.scrollHeight = scrollHeight;
    };

    //流式布局 spaceX
    layouts.flow = function (items, clientRect, orientation, spaceX, spaceY) {

        var fn = orientation == "horizontal" ? flow_horizontal : flow_vertical;
        fn.call(this, items, clientRect, spaceX, spaceY);
    };


    //单个显示 index
    layouts.single = function (items, clientRect, orientation, spaceX, spaceY) {

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
                box.measure(0, 0, clientRect.width, clientRect.height);
            }
        }
    };


    //停靠布局 spaceX spaceY dock
    layouts.dock = function (items, clientRect, orientation, spaceX, spaceY) {

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
                if (width <= 0 || height <= 0)
                {
                    box.visible = false;
                }
                else
                {
                    switch (item.dock)
                    {
                        case "left":
                            box.measure(x, y, 0, height, width);
                            x = box.right + spaceX;
                            width = right - x;
                            break;

                        case "top":
                            box.measure(x, y, width, 0, null, height);
                            y = box.bottom + spaceY;
                            height = bottom - y;
                            break;

                        case "right":
                            box.measure(x, y, 0, height, width);
                            right -= box.width;

                            box.moveTo(right, y, true);

                            right -= spaceX;
                            width = right - x;
                            break;

                        case "bottom":
                            box.measure(x, y, width, 0, null, height);
                            bottom -= box.height;

                            box.moveTo(x, bottom, true);

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


        if (width <= 0 || height <= 0)
        {
            for (var i = 0; i < fill.length; i++)
            {
                fill[i].visible = false;
            }
        }
        else
        {
            for (var i = 0; i < fill.length; i++)
            {
                fill[i].measure(x, y, width, height);
            }
        }
    };


    //队列布局 columns rows spaceX spaceY
    layouts.queue = function (items, clientRect, orientation, spaceX, spaceY) {


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

                    box.measure(width[0], height[0], width[1], height[1]);

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

                    box.measure(width[0], height[0], width[1], height[1]);

                    if (row >= rows)
                    {
                        row = 0;
                        column++;
                    }
                }
            }
        }
    };


    //网格布局 grid spaceX spaceY
    //示例: "T R* C* C* C* R* C* C* C* R* C* C* C* END"
    layouts.grid = function (items, clientRect, orientation, spaceX, spaceY) {

        var grid = this.grid;

        if (!(grid instanceof flyingon.GridDefine))
        {
            grid = new flyingon.GridDefine().load(grid);
        }

        grid.spaceX = spaceX;
        grid.spaceY = spaceY;

        grid.compute(clientRect.width, clientRect.height);
        grid.match(items, orientation == "vertical");
    };


    //绝对定位 left top
    layouts.absolute = function (items, clientRect) {

        var boxModel = this.__boxModel__;

        for (var i = 0, length = items.length; i < length; i++)
        {
            var item = items[i],
                box = item.__boxModel__;

            if (box.visible = (this.visibility != "collapsed"))
            {
                box.measure(item.left, item.top, item.width, item.height);

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



    //注册自定义布局 
    //注意:
    //1. 遵守回调函数规范(items, clientRect, orientation, spaceX, spaceY)
    //2. 按需设置盒模型的scrollWidth及scrollHeight值
    Class.registryLayout = function (name, fn) {

        layouts[name] = fn;
    };




    //测量
    this.measure = function (boxModel) {

        base.measure.call(this, boxModel);

        var mirror = this.mirror,
            items,
            length;

        if (mirror != "none" && (items = boxModel.children) && (length = items.length) > 0)
        {
            switch (this.mirror) //处理镜像变换
            {
                case "x-axis": //沿x中心轴变换
                    var height = boxModel.scrollHeight;

                    for (var i = 0; i < length; i++)
                    {
                        var box = items[i];
                        box.moveTo(box.x, height - box.bottom);
                    }
                    break;

                case "y-axis": //沿y中心轴变换
                    var width = boxModel.scrollWidth;

                    for (var i = 0; i < length; i++)
                    {
                        var box = items[i];
                        box.moveTo(width - box.right, box.y);
                    }
                    break;

                case "origin": //沿坐标原点变换
                    width = boxModel.scrollWidth;
                    height = boxModel.scrollHeight;

                    for (var i = 0; i < length; i++)
                    {
                        var box = items[i];
                        box.moveTo(width - box.right, height - box.bottom);
                    }
                    break;
            }
        }
    };

    //排列子控件
    this.arrange = function (clientRect) {

        this.__render_children__ = null;

        var items = this.__children__;

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

                fn.call(this, items, clientRect, this.orientation, spaceX, spaceY);
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
    this.findAt = function (x, y) {

        //判断滚动条
        var result = base.findAt.call(this, x, y);

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
                    return item.findAt ? item.findAt(x, y) : item;
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


        var items = this.__children__;

        for (var i = 0, length = items.length; i < length; i++)
        {
            if (items[i].focus(event))
            {
                return true;
            }
        }

        return base.focus.call(this, event);
    };

    this.blur = function () {

        return this.containsFocused ? base.blur.call(this, event) : false;
    };




    this.serialize = function (writer) {

        base.serialize.call(this, writer);

        var items = this.__children__;
        if (items.length > 0)
        {
            writer.array("children", items);
        }
    };

    this.deserialize = function (reader, data, excludes) {

        excludes.children = true;

        base.deserialize.call(this, reader, data, excludes);
        this.__children__.deserialize(reader, data["children"]);
    };


}, true);
