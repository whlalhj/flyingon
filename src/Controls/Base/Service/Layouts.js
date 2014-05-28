﻿/// <reference path="../../../js/flyingon.js" />



(function (flyingon) {


    var layouts = {},
        layout_unkown = null;;


    //注册自定义布局 
    //注1. 遵守回调函数规范(items, spaceX, spaceY)
    //注2. 按需内容区宽高 contentWidth, contentHeight
    var registry = flyingon.registry_layout = function (name, arrange_fn) {

        layouts[name] = arrange_fn;
    };


    flyingon.execute_layout = function (layout_type, items, spaceX, spaceY) {

        if (spaceX == null)
        {
            spaceX = this.spaceX || 0;
            if (spaceX.constructor !== Number)
            {
                spaceX = flyingon.parseInt(spaceX, this.clientWidth);
            }
        }

        if (spaceY == null)
        {
            spaceY = this.spaceY || 0;

            if (spaceY.constructor !== Number)
            {
                spaceY = flyingon.parseInt(spaceY, this.clientHeight);
            }
        }

        (layouts[layout_type] || layout_unkown).call(this, items, spaceX, spaceY);
    };



    //线性布局
    (function (flyingon) {


        function fn1(items, spaceX, spaceY) {

            var x = 0,
                clientWidth = this.clientWidth,
                clientHeight = this.clientHeight,
                contentHeight = 0;

            for (var i = 0, _ = items.length; i < _; i++)
            {
                var item = items[i];

                if (item.__visible = (item.__style.visibility !== "collapsed"))
                {
                    if (x > 0)
                    {
                        x += spaceX;
                    }

                    item.__fn_measure(clientWidth - x, clientHeight, false, true);
                    item.__fn_position(x, 0, null, clientHeight);

                    x += item.layoutWidth;

                    if (item.layoutHeight > contentHeight)
                    {
                        contentHeight = item.layoutHeight;
                    }
                }
            }

            this.contentWidth = x;
            this.contentHeight = contentHeight;
        };

        function fn2(items, spaceX, spaceY) {

            var y = 0,
                clientWidth = this.clientWidth,
                clientHeight = this.clientHeight,
                contentWidth = 0;

            for (var i = 0, _ = items.length; i < _; i++)
            {
                var item = items[i];

                if (item.__visible = (item.__style.visibility !== "collapsed"))
                {
                    if (y > 0)
                    {
                        y += spaceY;
                    }

                    item.__fn_measure(clientWidth, clientHeight - y, false, true);
                    item.__fn_position(0, y, clientWidth);

                    x += item.layoutHeight;

                    if (item.layoutWidth > contentWidth)
                    {
                        contentWidth = item.layoutWidth;
                    }
                }
            }

            this.contentWidth = contentWidth;
            this.contentHeight = y;
        };


        registry("line", function (items, spaceX, spaceY) {

            (this.vertical ? fn2 : fn1).call(this, items, spaceX, spaceY);
        });


    })(flyingon);



    //流式布局
    (function (flyingon) {


        function fn1(items, spaceX, spaceY) {

            var x = 0,
                y = 0,
                clientWidth = this.clientWidth,
                maxHeight = this.clientHeight,
                layoutHeight = this.layoutHeight,
                contentWidth = 0,
                contentHeight = 0,
                cache;

            for (var i = 0, _ = items.length; i < _; i++)
            {
                var item = items[i];

                if (item.__visible = (item.__style.visibility !== "collapsed"))
                {
                    if (x > 0)
                    {
                        if (item.newline) //强制在新行显示
                        {
                            x = 0;
                            y = y > 0 ? contentHeight + spaceY : contentHeight;
                        }
                        else
                        {
                            x += spaceX;
                        }
                    }

                    item.__fn_measure(clientWidth - x, layoutHeight, false, true);

                    if (x > 0 && (x += item.layoutWidth) > clientWidth) //超行
                    {
                        x = 0;
                        y = y > 0 ? contentHeight + spaceY : contentHeight;
                    }

                    item.__fn_position(x, y, null, layoutHeight);

                    if ((cache = x + item.layoutWidth) > contentWidth)
                    {
                        contentWidth = cache;
                    }

                    if ((cache = y + item.layoutHeight) > contentHeight)
                    {
                        contentHeight = cache;
                    }
                }
            }

            this.contentWidth = contentWidth;
            this.contentHeight = contentHeight;
        };

        function fn2(items, spaceX, spaceY) {

            var x = 0,
                y = 0,
                clientHeight = this.clientHeight,
                maxWidth = this.clientWidth,
                layoutWidth = this.layoutWidth,
                contentWidth = 0,
                contentHeight = 0,
                cache;

            for (var i = 0, _ = items.length; i < _; i++)
            {
                var item = items[i];

                if (item.__visible = (item.__style.visibility !== "collapsed"))
                {
                    if (y > 0)
                    {
                        if (item.newline) //强制在新行显示
                        {
                            y = 0;
                            x = x > 0 ? contentWidth + spaceX : contentWidth;
                        }
                        else
                        {
                            y += spaceY;
                        }
                    }

                    item.__fn_measure(layoutWidth, clientHeight - y, false, true);

                    if (y > 0 && (y += item.layoutHeight) > clientHeight) //超行
                    {
                        y = 0;
                        x = x > 0 ? contentWidth + spaceX : contentWidth;
                    }

                    item.__fn_position(x, y, layoutWidth);

                    if ((cache = x + item.layoutWidth) > contentWidth)
                    {
                        contentWidth = cache;
                    }

                    if ((cache = y + item.layoutHeight) > contentHeight)
                    {
                        contentHeight = cache;
                    }
                }
            }

            this.contentWidth = contentWidth;
            this.contentHeight = contentHeight;
        };


        registry("flow", layout_unkown = function (items, spaceX, spaceY) {

            (this.vertical ? fn2 : fn1).call(this, items, spaceX, spaceY);
        });


    })(flyingon);



    //单个显示
    registry("page", function (items, spaceX, spaceY) {

        var page = this.layoutPage,
            length = items.length;

        if (page < 0)
        {
            page = 0;
        }
        else if (page >= length)
        {
            page = length - 1;
        }

        for (var i = 0; i < length; i++)
        {
            var item = items[i];

            if (item.__visible = (i === page))
            {
                item.__fn_measure(this.clientWidth, this.clientHeight, true, false);
                item.__fn_position(0, 0, this.clientWidth, this.clientHeight);
            }
        }
    });



    //停靠布局
    registry("dock", function (items, spaceX, spaceY) {

        var x = 0,
            y = 0,
            width = this.clientWidth,
            height = this.clientHeight,
            right = width,
            bottom = height,
            fill = [];

        for (var i = 0, _ = items.length; i < _; i++)
        {
            var item = items[i];

            if (item.__visible = (item.visibility !== "collapsed"))
            {
                if (width <= 0 || height <= 0)
                {
                    item.__visible = false;
                }
                else
                {
                    switch (item.dock)
                    {
                        case "left":
                            item.__fn_measure(width, height, true, false);
                            item.__fn_position(x, y);

                            width = right - (x += item.layoutWidth + spaceX);
                            break;

                        case "top":
                            item.__fn_measure(width, height, true, false);
                            item.__fn_position(x, y);

                            height = bottom - (y = item.layoutHeight + spaceY);
                            break;

                        case "right":
                            item.__fn_measure(width, height, true, false);
                            item.__fn_position(right -= item.layoutWidth, y);

                            width = (right -= spaceX) - x;
                            break;

                        case "bottom":
                            item.__fn_measure(width, height, true, false);
                            item.__fn_position(x, bottom -= item.layoutHeight);

                            height = (bottom -= spaceY) - y;
                            break;

                        default:
                            fill.push(item);
                            break;
                    }
                }
            }
        }

        if (width <= 0 || height <= 0)
        {
            for (var i = 0, _ = fill.length; i < _; i++)
            {
                fill[i].__visible = false;
            }
        }
        else
        {
            for (var i = 0, _ = fill.length; i < _; i++)
            {
                fill[i].__fn_measure(width, height, true, false);
                fill[i].__fn_position(x, y);
            }
        }
    });



    //队列布局 columns rows spaceX spaceY
    registry("queue", function (items, spaceX, spaceY) {

        var rows = this.layoutRows || 3,
            columns = this.layoutColumns || 3,
            row = 0,
            column = 0,

            width_cache = [],
            height_cache = [],
            width,
            height,
            cache;

        //分割横向空间
        width = columns > 1 ? this.clientWidth - spaceY * (columns - 1) : this.clientWidth;

        for (var i = 0; i < columns; i++)
        {
            width_cache[i] = [

                i > 0 ? (cache += spaceX) : (cache = 0),
                cache = Math.floor(width / (columns - i))
            ];

            width -= cache;
        }

        //分割纵向空间
        height = rows > 1 ? this.clientHeight - spaceY * (rows - 1) : this.clientHeight;

        for (var i = 0; i < rows; i++)
        {
            height_cache[i] = [

                i > 0 ? (cache += spaceY) : (cache = 0),
                cache = Math.floor(height / (columns - i))
            ];

            height -= cache;
        }

        //按顺序排列
        if (this.vertical)
        {
            for (var i = 0, _ = items.length; i < _; i++)
            {
                var item = items[i];

                if (item.__visible = row < rows && column < columns && item.visibility !== "collapsed")
                {
                    width = width_cache[column];
                    height = height_cache[row++];

                    item.__fn_measure(width[1], height[1], true, false);
                    item.__fn_position(width[0], height[0]);

                    if (row >= rows)
                    {
                        row = 0;
                        column++;
                    }
                }
            }
        }
        else
        {
            for (var i = 0, _ = items.length; i < _; i++)
            {
                var item = items[i];

                if (item.__visible = row < rows && column < columns && item.visibility !== "collapsed")
                {
                    width = width_cache[column++];
                    height = height_cache[row];

                    item.__fn_measure(width[1], height[1], true, false);
                    item.__fn_position(width[0], height[0]);

                    if (column >= columns)
                    {
                        column = 0;
                        row++;
                    }
                }
            }
        }
    });



    //网格布局 grid spaceX spaceY
    //示例: "T R* C* C* C* R* C* C* C* R* C* C* C* END"
    registry("grid", function (items, spaceX, spaceY) {

        var grid = new flyingon.GridDefine().load(this.layoutGrid);

        grid.spaceX = spaceX;
        grid.spaceY = spaceY;

        grid.compute(this.clientWidth, this.clientHeight);
        grid.match(items, this.vertical);
    });


    //绝对定位 left top
    registry("absolute", function (items) {

        var contentWidth = 0,
            contentHeight = 0,
            cache;

        for (var i = 0, _ = items.length; i < _; i++)
        {
            var item = items[i];

            if (item.__visible = (item.visibility !== "collapsed"))
            {
                item.__fn_measure(+item.width || item.__defaults.width, +item.height || item.__defaults.height, false, false, true);
                item.__fn_position(+item.left || 0, +item.top || 0);

                if ((cache = item.layoutX + item.layoutWidth) > contentWidth)
                {
                    contentWidth = cache;
                }

                if ((cache = item.layoutY + item.layoutHeight) > contentHeight)
                {
                    contentHeight = cache;
                }
            }
        }

        this.contentWidth = contentWidth;
        this.contentHeight = contentHeight;
    });



})(flyingon);




/*

网格布局定义

*/
(function (flyingon) {



    //布局格
    flyingon.CellDefine = (function (grid, row) {

        this.grid = grid;
        this.row = row;

    }).extend(function () {

        this.grid = null;

        this.x = 0;

        this.width = 0;

        this.__width_string = "*";

        this.__width_weight = 100;

        this.__width_auto = false;


        //设置列宽
        this.set_width = function (value) {

            if (this.__width_auto)
            {
                this.row.__width_weights -= this.__width_weight;
                this.__width_auto = false;
            }
            else if (this.width)
            {
                this.row.__width_fixed -= this.width;
            }

            this.__width_string = value = value || "*";

            var length = value.length - 1;

            if (value[length] === "*")
            {
                this.__width_weight = length ? value.substring(0, length) : 100;
                this.__width_auto = true;
                this.width = 0;
                this.row.__width_weights += this.__width_weight;
            }
            else
            {
                this.width = parseInt(value);
                this.row.__width_fixed += this.width;
            }
        };

    });



    //布局行
    flyingon.RowDefine = (function (grid) {

        this.grid = grid;
        this.cells = [];

    }).extend(function () {

        this.grid = null;

        this.y = 0;

        this.height = 0;

        this.__height_string = "*";

        this.__height_weight = 100;

        this.__height_auto = false;

        //所属单元格所有固定宽度的总和
        this.__width_fixed = 0;

        //自动宽度的表格数
        this.__width_weights = 0;



        //设置行高
        this.set_height = function (value) {

            if (this.__height_auto)
            {
                this.grid.__height_weights -= this.__height_weight;
                this.__height_auto = false;
            }
            else if (this.height)
            {
                this.grid.__height_fixed -= this.height;
            }

            this.__height_string = value = value || "*";
            var length = value.length - 1;

            if (value[length] === "*")
            {
                this.__height_weight = length === 0 ? 100 : value.substring(0, length);
                this.__height_auto = true;
                this.height = 0;
                this.grid.__height_weights += this.__height_weight;
            }
            else
            {
                this.height = parseInt(value);
                this.grid.__height_fixed += this.height;
            }
        };

    });



    //布局表
    flyingon.GridDefine = (function () {

        this.rows = [];

    }).extend(function () {


        //列留空
        this.spaceX = 0;

        //行留空
        this.spaceY = 0;

        //所属行中所有固定高度的总和
        this.__height_fixed = 0;

        //自动高度的权重总数
        this.__height_weights = 0;


        this.compute = function (width, height) {

            this.width = width || 0;
            this.height = height || 0;

            var spaceX = this.spaceX || 0,
                spaceY = this.spaceY || 0,

                rows = this.rows,
                length = rows.length,

                y = this.y || 0,
                height = Math.max(this.height - this.__height_fixed - (length - 1) * spaceY, 0),
                height_weights = this.__height_weights;


            for (var i = 0; i < length; i++)
            {
                var row = rows[i];

                row.y = y;

                if (row.__height_auto)
                {
                    row.height = Math.round(height * row.__height_weight / height_weights);
                    height_weights -= row.__height_weight;
                    height -= row.height;
                }


                var cells = row.cells,
                    count = cells.length,

                    x = this.x || 0,
                    width = Math.max(this.width - row.__width_fixed - (count - 1) * spaceX, 0),
                    width_weights = row.__width_weights;

                for (var j = 0; j < count; j++)
                {
                    var cell = cells[j];

                    cell.x = x;

                    if (cell.__width_auto)
                    {
                        cell.width = Math.round(width * cell.__width_weight / width_weights);
                        width_weights -= cell.__width_weight;
                        width -= cell.width;
                    }

                    if (cell.children)
                    {
                        var children = cell.children;

                        children.x = x;
                        children.y = y;
                        children.spaceX = spaceX;
                        children.spaceY = spaceY;
                        children.compute(cell.width, row.height);
                    }

                    x += cell.width + spaceX;
                }

                y += row.height + spaceY;
            }

            return this;
        };



        this.create = function (rows, columns) {

            var rows = Math.max(rows, 0) || 3,
                columns = Math.max(columns, 0) || 3;


            for (var i = 0; i < rows; i++)
            {
                var row = new flyingon.RowDefine(this);

                row.__height_auto = true;
                this.__height_weights += row.__height_weight;

                for (var j = 0; j < columns; j++)
                {
                    var cell = new flyingon.CellDefine(this, row);

                    cell.__width_auto = true;
                    row.__width_weights += cell.__width_weight;

                    row.cells.push(cell);
                }

                this.rows.push(row);
            }

            return this;
        };

        this.load = function (value) {

            value = value || "T R* C* C* C* R* C* C* C* R* C* C* C* END";

            var children = [],
                rows = [],
                grid = this,
                row,
                cell,
                tokens = value.split(/\s/g);


            for (var i = 0, _ = tokens.length; i < _; i++)
            {
                var token = tokens[i],
                    value = token.substring(1);

                if (token === "END")
                {
                    grid = children.pop();
                    row = rows.pop();
                }
                else
                {
                    switch (token[0])
                    {
                        case "T":
                            if (cell != null)
                            {
                                children.push(grid);
                                rows.push(row);

                                grid = cell.children = new flyingon.GridDefine();
                                row = null;
                            }
                            break;

                        case "R":
                            row = new flyingon.RowDefine(grid);
                            row.set_height(value);
                            grid.rows.push(row);

                            cell = null;
                            break;

                        case "C":
                            if (row)
                            {
                                cell = new flyingon.CellDefine(grid, row);
                                cell.set_width(value);
                                row.cells.push(cell);
                            }
                            break;
                    }
                }
            }

            return this;
        };


        this.serialize = function (writer) {

        };

        this.deserialize = function (reader, value, excludes) {


        };



        function horizontal_cells(result) {

            var rows = this.rows;

            result = result || [];

            for (var i = 0, _ = rows.length; i < _; i++)
            {
                var row = rows[i],
                    cells = row.cells;

                for (var j = 0, __ = cells.length; j < __; j++)
                {
                    var cell = cells[j];

                    if (cell.children)
                    {
                        horizontal_cells.call(cell.children, result);
                    }
                    else
                    {
                        result.push(cell);
                    }
                }
            }

            return result;
        };

        function vertical_cells(result) {

            var rows = this.rows,
                values = [];

            result = result || [];

            for (var i = 0, _ = rows.length; i < _; i++)
            {
                var row = rows[i],
                    cells = row.cells;

                for (var j = 0, __ = cells.length; j < __; j++)
                {
                    var cell = cells[j];

                    if (cell.children)
                    {
                        vertical_cells(cell.children, result);
                    }
                    else
                    {
                        (values[i] || (values[i] = [])).push(cell);
                    }
                }
            }

            for (var i = 0, _ = values.length; i < _; i++)
            {
                result.push.apply(result, values[i]);
            }

            return result;
        };



        //按顺序自动排列子控件
        this.match = function (items, vertical) {

            var cells = vertical ? vertical_cells() : horizontal_cells(),
                length = cells.length,
                index = 0;

            for (var i = 0, _ = items.length; i < _; i++)
            {
                var item = items[i];

                if (item.__visible = index < length && item.visibility !== "collapsed")
                {
                    var cell = cells[index++];

                    item.__fn_measure(cell.width, cell.row.height, true, false);
                    item.__fn_position(cell.x, cell.row.y);
                }
            }

            return this;
        };

    });


})(flyingon);
