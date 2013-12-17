//面板控件
$.class("Panel", $.ScrollableControl, function (Class, $) {




    Class.create = function () {


        //子控件集合
        this["x:children"] = new $.ControlCollection(this);

    };





    //修改默认修值接受拖放
    this.setDefaultValue("droppable", true);



    this.setDefaultValue("width", 400);

    this.setDefaultValue("height", 400);



    //子控件集合
    this.defineProperty("children", undefined, {

        getter: function () {

            return this["x:children"];
        }
    }, true);



    //当前布局 见枚举flyingon.Layout对象
    this.defineProperty("layout", "rows", {

        attributes: "measure|layout",
        valueChangedCode: "var boxModel = this['x:boxModel'];\nboxModel.scrollLeft = 0;\nboxModel.scrollTop = 0;\nboxModel.renderItems = null;"
    });

    //布局x轴间隔 0-1之间表示间隔值为总宽度百分比
    this.defineProperty("layoutSpaceX", 0, "measure|layout");

    //布局y轴间隔 0-1之间表示间隔值为总高度的百分比
    this.defineProperty("layoutSpaceY", 0, "measure|layout");

    //布局行高
    this.defineProperty("layoutRowHeight", 0, "measure|layout");

    //布局列宽
    this.defineProperty("layoutColumnWidth", 0, "measure|layout");

    //当前布局页索引
    this.defineProperty("layoutPageIndex", 0, "measure|layout");

    //布局列数
    this.defineProperty("layoutColumns", 3, "measure|layout");

    //布局行数
    this.defineProperty("layoutRows", 3, "measure|layout");

    //布局表
    this.defineProperty("layoutTable", "T R* C* C* C* R* C* C* C* R* C* C* C* END", "measure|layout");




    //布局集
    var layouts = {};

    function getLayoutSpace(value, total) {

        return value > 0 ? (value > 1 ? value : Math.round(total * value)) : 0;
    };


    //单行排列 layoutSpaceX verticalAlign
    layouts.row = function (children, boxModel, usableRect, spaceX, spaceY) {

        var x = 0,
            height = usableRect.height,

            i = 0,
            length = children.length;


        while (i < length)
        {
            var item = children[i++],
                storage = item["x:storage"],
                box = item["x:boxModel"];


            if (box.visible = (storage.visibility != "collapsed"))
            {
                var margin = box.margin = item.getStyleValue("margin");

                x += margin[3];

                box.setUsableRect(
                    boxModel,
                    x,
                    margin[0],
                    storage.width,
                    height - margin[0] - margin[2]);

                x += storage.width + margin[3] + spaceX;
            }
        }


        boxModel.scrollWidth = children[children.length - 1]["x:boxModel"].right;
    };


    //单列排列 layoutSpaceY horizontalAlign
    layouts.column = function (children, boxModel, usableRect, spaceX, spaceY) {

        var y = 0,
            width = usableRect.width,

            i = 0,
            length = children.length;


        while (i < length)
        {
            var item = children[i++],
                storage = item["x:storage"],
                box = item["x:boxModel"];


            if (box.visible = (storage.visibility != "collapsed"))
            {
                var margin = box.margin = item.getStyleValue("margin");

                y += margin[0];

                box.setUsableRect(
                    boxModel,
                    margin[3],
                    y,
                    width - margin[3] - margin[1],
                    storage.height);

                y += storage.height + margin[2] + spaceY;
            }
        }


        boxModel.scrollHeight = children[children.length - 1]["x:boxModel"].bottom;
    };


    //多行排列 layoutSpaceX layoutSpaceY layoutRowHeight verticalAlign
    layouts.rows = function (children, boxModel, usableRect, spaceX, spaceY) {

        var storage = this["x:storage"],

            rowHeight = storage.layoutRowHeight > 0 ? storage.layoutRowHeight : 0,
            maxHeight = rowHeight,

            x = 0,
            y = 0,
            right = usableRect.width,

            i = 0,
            length = children.length;


        while (i < length)
        {
            var item = children[i++],
                storage = item["x:storage"],
                box = item["x:boxModel"];


            if (box.visible = (storage.visibility != "collapsed"))
            {
                var margin = box.margin = item.getStyleValue("margin");


                if (x > 0 && x + margin[3] + storage.width + margin[1] > right) //如果超出宽度则折行
                {
                    x = 0;
                    y += maxHeight + spaceY;

                    maxHeight = rowHeight;
                }



                x += margin[3];

                box.setUsableRect(
                  boxModel,
                  x,
                  y + margin[0],
                  storage.width,
                  Math.max(rowHeight && (rowHeight - margin[0] - margin[2]), storage.height));


                x += storage.width + margin[1] + spaceX;


                var height = storage.height + margin[0] + margin[2];
                if (height > maxHeight)
                {
                    maxHeight = height;
                }
            }
        }


        boxModel.scrollHeight = children[children.length - 1]["x:boxModel"].bottom;
    };


    //多列排列 layoutSpaceX layoutSpaceY layoutColumnWidth  horizontalAlign
    layouts.columns = function (children, boxModel, usableRect, spaceX, spaceY) {

        var storage = this["x:storage"],

            colWidth = storage.layoutColumnWidth > 0 ? storage.layoutColumnWidth : 0,
            maxWidth = colWidth,

            x = 0,
            y = 0,
            bottom = usableRect.height,

            i = 0,
            length = children.length;


        while (i < length)
        {
            var item = children[i++],
                storage = item["x:storage"],
                box = item["x:boxModel"];


            if (box.visible = (storage.visibility != "collapsed"))
            {
                var margin = box.margin = item.getStyleValue("margin");


                if (y > 0 && y + margin[0] + storage.height + margin[2] > bottom) //如果超出高度则折行
                {
                    x += maxWidth + spaceX;
                    y = 0;

                    maxWidth = colWidth;
                }



                y += margin[0];

                box.setUsableRect(
                    boxModel,
                    x + margin[3],
                    y,
                    Math.max(colWidth && (colWidth - margin[3] - margin[1]), storage.width),
                    storage.height);

                y += storage.height + margin[2] + spaceY;


                var width = storage.width + margin[3] + margin[1];
                if (width > maxWidth)
                {
                    maxWidth = width;
                }
            }
        }


        boxModel.scrollWidth = children[children.length - 1]["x:boxModel"].right;
    };


    //停靠 layoutSpaceX layoutSpaceY dock  horizontalAlign verticalAlign
    layouts.dock = function (children, boxModel, usableRect, spaceX, spaceY) {

        var storage = this["x:storage"],

            x = 0,
            y = 0,
            width = usableRect.width,
            height = usableRect.height,

            right = width,
            bottom = height,

            fills = [],

            i = 0,
            length = children.length;


        while (i < length)
        {
            var item = children[i++],
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
                    var margin = box.margin = item.getStyleValue("margin");

                    switch (storage.dock)
                    {
                        case "left":
                            x += margin[3];

                            box.setUsableRect(
                                boxModel,
                                x,
                                y + margin[0],
                                storage.width,
                                height - margin[0] - margin[2]);

                            x += storage.width + margin[1] + spaceX;
                            width = right - x;
                            break;

                        case "top":
                            y += margin[0];

                            box.setUsableRect(
                                boxModel,
                                x + margin[3],
                                y,
                                width - margin[3] - margin[1],
                                storage.height);

                            y += storage.height + margin[2] + spaceY;
                            height = bottom - y;
                            break;

                        case "right":
                            right -= margin[1] + storage.width;

                            box.setUsableRect(
                                boxModel,
                                right,
                                y + margin[0],
                                storage.width,
                                height - margin[0] - margin[2]);

                            right -= margin[3] + spaceX;
                            width = right - x;
                            break;

                        case "bottom":
                            bottom -= margin[2] + storage.height;

                            box.setUsableRect(
                                boxModel,
                                x + margin[3],
                                bottom,
                                width - margin[3] - margin[1],
                                storage.height);

                            bottom -= margin[0] + spaceY;
                            height = bottom - y;
                            break;

                        default:
                            fills.push(box);
                            break;
                    }
                }
            }
        }


        for (var i = 0; i < fills.length; i++)
        {
            fills[i].setUsableRect(boxModel, x, y, width, height);
        }

    };


    //单页显示 layoutPage  horizontalAlign verticalAlign
    layouts.page = function (children, boxModel, usableRect, spaceX, spaceY) {

        var index = this["x:storage"].layoutPageIndex || 0,

            i = 0,
            length = children.length;


        while (i < length)
        {
            var item = children[i++],
                box = item["x:boxModel"];

            if (box.visible = (i == index))
            {
                var margin = box.margin = item.getStyleValue("margin");

                box.setUsableRect(
                    boxModel,
                    margin[3],
                    margin[0],
                    usableRect.width - margin[3] - margin[1],
                    usableRect.height - margin[0] - margin[2]);
            }
        }
    };


    //网格排列 layoutColumns layoutRows gridLineColor layoutSpaceX layoutSpaceY  horizontalAlign verticalAlign
    layouts.grid = function (children, boxModel, usableRect, spaceX, spaceY) {

        var storage = this["x:storage"],
            table = new $.LayoutTable();


        table.create(storage.layoutRows, storage.layoutColumns);


        table.spaceX = spaceX;
        table.spaceY = spaceY;

        table.compute(usableRect.width, usableRect.height);
        table.sequenceLayout(children, boxModel);
    };


    //表格排列 layoutTable layoutSpaceX layoutSpaceY  horizontalAlign verticalAlign
    //示例: "T R* C* C* C* R* C* C* C* R* C* C* C* END"
    layouts.table = function (children, boxModel, usableRect, spaceX, spaceY) {

        var storage = this["x:storage"],
            table = storage.layoutTable;


        if (!(table instanceof $.LayoutTable))
        {
            table = new $.LayoutTable();
            table.load(storage.layoutTable);
        }

        table.spaceX = spaceX;
        table.spaceY = spaceY;

        table.compute(usableRect.width, usableRect.height);
        table.sequenceLayout(children, boxModel);
    };


    //绝对定位 left top
    layouts.absolute = function (children, boxModel, usableRect, spaceX, spaceY) {


        var i = 0,
            length = children.length;


        while (i < length)
        {
            var item = children[i++],
                storage = item["x:storage"],
                box = item["x:boxModel"];


            if (box.visible = (storage.visibility != "collapsed"))
            {
                box.setUsableRect(
                    boxModel,
                    storage.left,
                    storage.top,
                    storage.width,
                    storage.height);


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



    //自定义获取布局的方法
    this.getLayout = null;

    //排列子控件
    this.arrange = function (boxModel) {


        var storage = this["x:storage"],
            children = this["x:children"],
            fn = children.length > 0 && ((this.getLayout && this.getLayout(storage.layout)) || layouts[storage.layout]);


        boxModel.children = null;

        if (fn)
        {
            var usableRect = boxModel.innerRect,
                spaceX = storage.layoutSpaceX,
                spaceY = storage.layoutSpaceY;

            spaceX = spaceX > 0 ? (spaceX > 1 ? spaceX : Math.round(usableRect.width * spaceX)) : 0;
            spaceY = spaceY > 0 ? (spaceY > 1 ? spaceY : Math.round(usableRect.height * spaceY)) : 0;

            fn.call(this, children, boxModel, usableRect, spaceX, spaceY);
        }

        return this;
    };





    //获取指定位置的控件
    this.getControlAt = function (x, y) {

        //判断滚动条
        var result = $.Panel.super.getControlAt.call(this, x, y);

        if (result)
        {
            return result;
        }



        var box = this["x:boxModel"],
            r = box.innerRect;


        x += box.scrollLeft - r.x;
        y += box.scrollTop - r.y;

        //if (storage.transform)
        //{

        //}


        var items = box.renderItems;

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




    //注册自定义布局 注意回调函数规范及处理scrollWidth及scrollHeight
    $.Panel.registryLayout = function (name, layoutfn) {

        layouts[name] = layoutfn;
    };



    this.focus = function () {

        if (this.containsFocused)
        {
            return true;
        }


        var children = this["x:children"],
            i = 0,
            length = children.length;


        while (i < length)
        {
            if (children[i++].focus(event))
            {
                return true;
            }
        }

        return $.Panel.super.focus.call(this, event);
    };

    this.blur = function () {

        return this.containsFocused ? $.Panel.super.blur.call(this, event) : false;
    };




    this.serialize = function (writer) {

        $.Panel.super.serialize.call(this, writer);
        
        var children = this["x:children"];
        if (children && children.length > 0)
        {
            writer.object("children", children);
        }
    };

    this.deserialize = function (reader, data) {

        $.Panel.super.deserialize.call(this, reader, data);

        reader.object(this, "x:children", data["children"]);
    };


});
