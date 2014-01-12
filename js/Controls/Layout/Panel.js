//面板控件
flyingon.class("Panel", flyingon.ScrollableControl, function (Class, flyingon) {




    Class.create = function () {


        //子控件集合
        this["x:children"] = new flyingon.ControlCollection(this);
    };





    //修改默认修值接受拖放
    this.defaultValue("droppable", true);



    this.defaultValue("width", 400);

    this.defaultValue("height", 400);



    //子控件集合
    this.defineProperty("children", function () {

        return this["x:children"];
    });



    //当前布局 见枚举flyingon.Layout对象
    this.defineProperty("layout", "rows", {

        attributes: "locate",
        valueChangedCode: "boxModel.offsetX = 0;\nboxModel.offsetY = 0;"
    });

    //布局x轴间隔 0-1之间表示间隔值为总宽度百分比
    this.defineProperty("layoutSpaceX", 0, "locate");

    //布局y轴间隔 0-1之间表示间隔值为总高度的百分比
    this.defineProperty("layoutSpaceY", 0, "locate");

    //布局行高
    this.defineProperty("layoutRowHeight", 0, "locate");

    //布局列宽
    this.defineProperty("layoutColumnWidth", 0, "locate");

    //当前布局页索引
    this.defineProperty("layoutPageIndex", 0, "locate");

    //布局列数
    this.defineProperty("layoutColumns", 3, "locate");

    //布局行数
    this.defineProperty("layoutRows", 3, "locate");

    //布局表
    this.defineProperty("layoutTable", "T R* C* C* C* R* C* C* C* R* C* C* C* END", "locate");




    //布局集
    var layouts = {};

    function getLayoutSpace(value, total) {

        return value > 0 ? (value > 1 ? value : Math.round(total * value)) : 0;
    };


    //单行排列 layoutSpaceX verticalAlign
    layouts.row = function (items, boxModel, usableRect, spaceX, spaceY) {

        var x = 0,
            height = usableRect.height,
            scrollHeight = 0;


        for (var i = 0, length = items.length; i < length; i++)
        {
            var item = items[i],
                box = item["x:boxModel"];

            if (box.visible = (item["x:storage"].visibility != "collapsed"))
            {
                box.measure(boxModel, x, 0, 0, height);
                x = box.right + box.margin[3] + spaceX;

                box.height > scrollHeight && (scrollHeight = box.height);
            }
        }


        boxModel.maxWidth = items[items.length - 1]["x:boxModel"].right;
        scrollHeight > boxModel.maxHeight && (boxModel.maxHeight = scrollHeight);
    };


    //单列排列 layoutSpaceY horizontalAlign
    layouts.column = function (items, boxModel, usableRect, spaceX, spaceY) {

        var y = 0,
            width = usableRect.width,
            scrollWidth = 0;


        for (var i = 0, length = items.length; i < length; i++)
        {
            var item = items[i],
                box = item["x:boxModel"];

            if (box.visible = (item["x:storage"].visibility != "collapsed"))
            {
                box.measure(boxModel, 0, y, width, 0);

                y = box.bottom + box.margin[2] + spaceY;

                box.width > scrollWidth && (scrollWidth = box.width);
            }
        }


        scrollWidth > boxModel.maxWidth && (boxModel.maxWidth = scrollWidth);
        boxModel.maxHeight = items[items.length - 1]["x:boxModel"].bottom;
    };


    //多行排列 layoutSpaceX layoutSpaceY layoutRowHeight verticalAlign
    layouts.rows = function (items, boxModel, usableRect, spaceX, spaceY) {

        var storage = this["x:storage"],

            x = 0,
            y = 0,
            cache,

            maxWidth = usableRect.width,
            rowHeight = storage.layoutRowHeight > 0 ? storage.layoutRowHeight : 0,
            maxHeight = rowHeight,

            scrollWidth = 0;


        for (var i = 0, length = items.length; i < length; i++)
        {
            var item = items[i],
                storage = item["x:storage"],
                box = item["x:boxModel"];

            if (box.visible = (storage.visibility != "collapsed"))
            {
                box.measure(boxModel, x, y, storage.width, maxHeight);
                cache = box.right + box.margin[1] + spaceX;

                if (x > 0 && cache > maxWidth) //如果超出宽度则折行
                {
                    //重新定位
                    box.moveTo(x = 0, y += maxHeight + spaceY);
                    cache = box.right + box.margin[1] + spaceX;
                }

                (x = cache) > scrollWidth && (scrollWidth = x);
                (cache = box.height + box.margin[0] + box.margin[2]) > maxHeight && (maxHeight = cache);
            }
        }


        scrollWidth > boxModel.maxWidth && (boxModel.maxWidth = scrollWidth);
        boxModel.maxHeight = items[items.length - 1]["x:boxModel"].bottom;
    };


    //多列排列 layoutSpaceX layoutSpaceY layoutColumnWidth  horizontalAlign
    layouts.columns = function (items, boxModel, usableRect, spaceX, spaceY) {

        var storage = this["x:storage"],

            x = 0,
            y = 0,
            cache,

            colWidth = storage.layoutColumnWidth > 0 ? storage.layoutColumnWidth : 0,
            maxWidth = colWidth,
            maxHeight = usableRect.height,

            scrollHeight = 0;


        for (var i = 0, length = items.length; i < length; i++)
        {
            var item = items[i],
                storage = item["x:storage"],
                box = item["x:boxModel"];

            if (box.visible = (storage.visibility != "collapsed"))
            {
                box.measure(boxModel, x, y, maxWidth, storage.height);
                cache = box.bottom + box.margin[2] + spaceY;

                if (y > 0 && cache > maxHeight) //如果超出高度则折行
                {
                    //重新定位
                    box.moveTo(x += maxWidth + spaceX, y = 0);
                    cache = box.bottom + box.margin[2] + spaceY;
                }

                (y = cache) > scrollHeight && (scrollHeight = y);
                (cache = box.width + box.margin[3] + box.margin[1]) > maxWidth && (maxWidth = cache);
            }
        }


        boxModel.maxWidth = items[items.length - 1]["x:boxModel"].right;
        scrollHeight > boxModel.maxHeight && (boxModel.maxHeight = scrollHeight);
    };


    //停靠 layoutSpaceX layoutSpaceY dock  horizontalAlign verticalAlign
    layouts.dock = function (items, boxModel, usableRect, spaceX, spaceY) {

        var storage = this["x:storage"],

            x = 0,
            y = 0,
            width = usableRect.width,
            height = usableRect.height,

            right = width,
            bottom = height,

            fills = [];

        for (var i = 0, length = items.length; i < length; i++)
        {
            var item = items[i],
                storage = item["x:storage"],
                box = item["x:boxModel"];


            if (box.visible = (storage.visibility != "collapsed"))
            {
                if (width < 0 || height < 0)
                {
                    box.visible = false;
                }
                else
                {
                    switch (storage.dock)
                    {
                        case "left":
                            box.measure(boxModel, x, y, storage.width, height);

                            x = box.right + spaceX;
                            width = right - x;
                            break;

                        case "top":
                            box.measure(boxModel, x, y, width, storage.height);

                            y = storage.bottom + spaceY;
                            height = bottom - y;
                            break;

                        case "right":
                            right -= box.margin[1] + storage.width;
                            box.measure(boxModel, right, y, storage.width, height);

                            right -= spaceX;
                            width = right - x;
                            break;

                        case "bottom":
                            bottom -= box.margin[2] + storage.height;
                            box.measure(boxModel, x, bottom, width, storage.height);

                            bottom -= spaceY;
                            height = bottom - y;
                            break;

                        default:
                            fills.push(box);
                            break;
                    }
                }
            }
        }


        if (width > x && height > y)
        {
            for (var i = 0; i < fills.length; i++)
            {
                fills[i].measure(boxModel, x, y, width, height);
            }
        }

    };


    //单页显示 layoutPage  horizontalAlign verticalAlign
    layouts.page = function (items, boxModel, usableRect, spaceX, spaceY) {

        var index = this["x:storage"].layoutPageIndex || 0;

        for (var i = 0, length = items.length; i < length; i++)
        {
            var item = items[i],
                box = item["x:boxModel"];

            if (box.visible = (i == index))
            {
                box.measure(boxModel, 0, 0, usableRect.width, usableRect.height);
            }
        }
    };


    //网格排列 layoutColumns layoutRows gridLineColor layoutSpaceX layoutSpaceY  horizontalAlign verticalAlign
    layouts.grid = function (items, boxModel, usableRect, spaceX, spaceY) {

        var storage = this["x:storage"],
            table = new flyingon.LayoutTable();

        table.create(storage.layoutRows, storage.layoutColumns);

        table.spaceX = spaceX;
        table.spaceY = spaceY;

        table.compute(usableRect.width, usableRect.height);
        table.sequenceLayout(items, boxModel);
    };


    //表格排列 layoutTable layoutSpaceX layoutSpaceY  horizontalAlign verticalAlign
    //示例: "T R* C* C* C* R* C* C* C* R* C* C* C* END"
    layouts.table = function (items, boxModel, usableRect, spaceX, spaceY) {

        var storage = this["x:storage"],
            table = storage.layoutTable;

        if (!(table instanceof flyingon.LayoutTable))
        {
            table = new flyingon.LayoutTable();
            table.load(storage.layoutTable);
        }

        table.spaceX = spaceX;
        table.spaceY = spaceY;

        table.compute(usableRect.width, usableRect.height);
        table.sequenceLayout(items, boxModel);
    };


    //绝对定位 left top
    layouts.absolute = function (items, boxModel, usableRect, spaceX, spaceY) {

        for (var i = 0, length = items.length; i < length; i++)
        {
            var item = items[i],
                storage = item["x:storage"],
                box = item["x:boxModel"];

            if (box.visible = (storage.visibility != "collapsed"))
            {
                box.measure(boxModel, storage.left, storage.top, storage.width, storage.height);

                box.right > boxModel.maxWidth && (boxModel.maxWidth = box.right);
                box.bottom > boxModel.maxHeight && (boxModel.maxHeight = box.bottom);
            }
        }
    };



    //注册自定义布局 注意回调函数规范及设置盒模型的maxWidth及maxHeight值
    Class.registryLayout = function (name, layoutfn) {

        layouts[name] = layoutfn;
    };


    //自定义获取布局的方法
    this.getLayout = null;




    //排列子控件
    this.arrange = function (boxModel, usableRect) {


        boxModel.children = null;
        this["x:render:children"] = null;


        var storage = this["x:storage"],
            items = this["x:children"]["x:items"];

        if (items.length > 0)
        {
            var fn = this.getLayout;

            if (fn = ((fn && fn.call(this, storage.layout)) || layouts[storage.layout]))
            {
                var spaceX = storage.layoutSpaceX,
                    spaceY = storage.layoutSpaceY;

                spaceX = spaceX > 0 ? (spaceX > 1 ? spaceX : Math.round(usableRect.width * spaceX)) : 0;
                spaceY = spaceY > 0 ? (spaceY > 1 ? spaceY : Math.round(usableRect.height * spaceY)) : 0;

                fn.call(this, items, boxModel, usableRect, spaceX, spaceY);
            }
        }

        return this;
    };


    //获取当前可渲染的子项
    this["y:render:children"] = function (boxModel) {

        var result = this["x:render:children"];

        if (!result)
        {
            var clipToBounds = this["x:storage"].clipToBounds,

                children = boxModel.children,
                r = boxModel.innerRect,
                x = boxModel.offsetX,
                y = boxModel.offsetY,
                right = x + r.width,
                bottom = y + r.height;

            result = this["x:render:children"] = [];

            for (var i = 0, length = children.length; i < length; i++)
            {
                var item = children[i];

                if (item.visible &&
                    item.right >= x &&
                    item.bottom >= y &&
                    item.ownerControl["x:storage"].visibility == "visible" &&
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

        if (result)
        {
            return result;
        }



        var box = this["x:boxModel"],
            r = box.innerRect;


        x += box.offsetX - r.x;
        y += box.offsetY - r.y;

        //if (storage.transform)
        //{

        //}


        var items = this["x:render:children"];

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


        var items = this["x:children"]["x:items"];

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

        var items = this["x:children"]["x:items"];
        items && items.length > 0 && writer.array("children", items);
    };

    this.deserialize = function (reader, data) {

        if (data)
        {
            flyingon.Panel.super.deserialize.call(this, reader, data);

            var items = reader.array(this["x:children"], "x:items", data["children"]);
            if (items && items.length > 0)
            {
                for (var i = 0, length = items.length; i < length; i++)
                {
                    items[i]["x:parent"] = this;
                }
            }
        }
    };


}, true);
