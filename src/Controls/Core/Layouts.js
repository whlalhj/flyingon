/// <reference path="../../../js/flyingon.js" />



(function (flyingon) {



    var layouts = {},

        layout_unkown = null,

        parse = parseFloat,

        round = Math.round;




    //注册自定义布局 
    //注1. 遵守回调函数规范(items)
    //注2. 按需内容区宽高 contentWidth, contentHeight
    var registry = flyingon.registry_layout = function (name, arrange_fn) {

        layouts[name] = arrange_fn;
    };


    flyingon.execute_layout = function (layout_type, items) {

        (layouts[layout_type] || layout_unkown).call(this, items || this.__visiual_item || this.__children);
    };


    function get_line_space(target) {

        var result, cache;

        if ((result = +(cache = target.layoutLineSpace)) >= 0)
        {
            return result;
        }

        return round(target.clientWidth * parse(cache) / 100) || 0;
    };

    function get_item_space(target) {

        var result, cache;

        if ((result = +(cache = target.layoutItemSpace)) >= 0)
        {
            return result;
        }

        return round(target.clientHeight * parse(cache) / 100) || 0;
    };



    //线性布局(支持竖排)
    (function (flyingon) {


        function fn1(items) {

            var space2 = get_item_space(this),
                clientWidth = this.clientWidth,
                contentHeight = this.layoutAlignHeight,
                align_height = contentHeight || this.clientHeight,
                x = 0,
                width,
                bottom;

            for (var i = 0, _ = items.length; i < _; i++)
            {
                var item = items[i];

                if (item.__visible = (item.visibility !== "collapsed"))
                {
                    if (x > 0)
                    {
                        x += space2;
                    }

                    width = item.measure(clientWidth - x, align_height, 0, 1, 1, 0).width;
                    bottom = item.locate(x, 0, null, align_height).y;

                    x += width;

                    if (bottom > contentHeight)
                    {
                        contentHeight = bottom;
                    }
                }
            }

            this.contentWidth = x;
            this.contentHeight = contentHeight;
        };

        function fn2(items) {

            var space2 = get_item_space(this),
                contentWidth = this.layoutAlignWidth,
                align_width = contentWidth || this.clientWidth,
                clientHeight = this.clientHeight,
                y = 0,
                height,
                right;

            for (var i = 0, _ = items.length; i < _; i++)
            {
                var item = items[i];

                if (item.__visible = (item.visibility !== "collapsed"))
                {
                    if (y > 0)
                    {
                        y += space2;
                    }

                    height = item.measure(align_width, clientHeight - y, 1, 0, 0, 1).height;
                    right = item.locate(0, y, align_width).x;

                    y += height;

                    if (right > contentWidth)
                    {
                        contentWidth = right;
                    }
                }
            }

            this.contentWidth = contentWidth;
            this.contentHeight = y;
        };


        registry("line", function (items) {

            (this.layoutVertical ? fn2 : fn1).call(this, items);
        });


    })(flyingon);



    //流式布局(支持竖排)
    (function (flyingon) {


        function fn1(items) {

            var space1 = get_line_space(this),
                space2 = get_item_space(this),
                contentWidth = 0,
                contentHeight = 0,
                clientWidth = this.clientWidth,
                align_height = this.layoutAlignHeight || 0,
                x = 0,
                y = 0,
                width,
                bottom;

            for (var i = 0, _ = items.length; i < _; i++)
            {
                var item = items[i];

                if (item.__visible = (item.visibility !== "collapsed"))
                {
                    if (x > 0)
                    {
                        if (item.lineBreak) //强制换行
                        {
                            x = 0;
                            y = contentHeight + space1;
                        }
                        else
                        {
                            x += space2;
                        }
                    }

                    width = item.measure(clientWidth - x, align_height, 0, 1, 1, 0).width;

                    if (x > 0 && x + width > clientWidth) //超行
                    {
                        x = 0;
                        y = contentHeight + space1;
                    }

                    bottom = item.locate(x, y, null, align_height).y;

                    if ((x += width) > contentWidth)
                    {
                        contentWidth = x;
                    }

                    if (bottom > contentHeight)
                    {
                        contentHeight = bottom;
                    }
                }
            }

            this.contentWidth = contentWidth;
            this.contentHeight = contentHeight;
        };

        function fn2(items) {

            var space1 = get_line_space(this),
                space2 = get_item_space(this),
                x = 0,
                y = 0,
                clientHeight = this.clientHeight,
                align_width = this.layoutAlignWidth || 0,
                contentWidth = 0,
                contentHeight = 0,
                height,
                right;

            for (var i = 0, _ = items.length; i < _; i++)
            {
                var item = items[i];

                if (item.__visible = (item.visibility !== "collapsed"))
                {
                    if (y > 0)
                    {
                        if (item.lineBreak) //强制换行
                        {
                            y = 0;
                            x = contentWidth + space1;
                        }
                        else
                        {
                            y += space2;
                        }
                    }

                    height = item.measure(align_width, clientHeight - y, 1, 0, 0, 1).height;

                    if (y > 0 && y + height > clientHeight) //超行
                    {
                        y = 0;
                        x = contentWidth + space1;
                    }

                    right = item.locate(x, y, align_width).x;

                    if ((y += height) > contentHeight)
                    {
                        contentHeight = y;
                    }

                    if (right > contentWidth)
                    {
                        contentWidth = right;
                    }
                }
            }

            this.contentWidth = contentWidth;
            this.contentHeight = contentHeight;
        };


        registry("flow", layout_unkown = function (items) {

            (this.layoutVertical ? fn2 : fn1).call(this, items);
        });


    })(flyingon);



    //单页显示(不支持竖排)
    registry("page", function (items) {

        var width = this.clientWidth,
            height = this.clientHeight,
            index = this.layoutPage,
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
            var item = items[i];

            if (item.__visible = (i === index))
            {
                item.measure(width, height, 1, 1);
                item.locate(0, 0, width, height);
            }
        }
    });



    //停靠布局(不支持竖排)
    registry("dock", function (items) {

        var space1 = get_line_space(this),
            space2 = get_item_space(this),
            x = 0,
            y = 0,
            width = this.clientWidth,
            height = this.clientHeight,
            right = width,
            bottom = height,
            fill = [],
            cache;

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
                            cache = item.measure(width, height, 0, 1).width;
                            item.locate(x, y);

                            width = right - (x += cache + space2);
                            break;

                        case "top":
                            cache = item.measure(width, height, 1, 0).height;
                            item.locate(x, y);

                            height = bottom - (y += cache + space1);
                            break;

                        case "right":
                            cache = item.measure(width, height, 0, 1).width;
                            item.locate(right -= cache, y);

                            width = (right -= space2) - x;
                            break;

                        case "bottom":
                            cache = item.measure(width, height, 1, 0).height;
                            item.locate(x, bottom -= cache);

                            height = (bottom -= space1) - y;
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
                fill[i].measure(width, height, 1, 1);
                fill[i].locate(x, y);
            }
        }
    });



    //网格布局(支持竖排)
    registry("grid", function (items) {

        var space1 = get_line_space(this),
            space2 = get_item_space(this),
            rows = this.layoutGridRows || 3,
            columns = this.layoutGridColumns || 3,
            row = 0,
            column = 0,
            width_cache = [],
            height_cache = [],
            x = 0,
            y = 0,
            width,
            height,
            cache;

        //分割横向空间
        width = columns > 1 ? this.clientWidth - space2 * (columns - 1) : this.clientWidth;

        for (var i = 0; i < columns; i++)
        {
            width_cache[i] = [x, cache = Math.floor(width / (columns - i))];
            width -= cache;
            x += cache + space1;
        }

        //分割纵向空间
        height = rows > 1 ? this.clientHeight - space2 * (rows - 1) : this.clientHeight;

        for (var i = 0; i < rows; i++)
        {
            height_cache[i] = [y, cache = Math.floor(height / (columns - i))];
            height -= cache;
            y += cache + space2;
        }

        //按顺序排列
        if (this.layoutVertical)
        {
            for (var i = 0, _ = items.length; i < _; i++)
            {
                var item = items[i];

                if (item.__visible = row < rows && column < columns && item.visibility !== "collapsed")
                {
                    width = width_cache[column];
                    height = height_cache[row++];

                    item.measure(width[1], height[1], 1, 1);
                    item.locate(width[0], height[0], width[1], height[1]);

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

                    item.measure(width[1], height[1], 1, 1);
                    item.locate(width[0], height[0], width[1], height[1]);

                    if (column >= columns)
                    {
                        column = 0;
                        row++;
                    }
                }
            }
        }
    });



    //表格布局(不支持竖排)
    registry("table", function (items) {

        var grid = new flyingon.GridDefine().load(this.gridDefine);

        grid.spaceX = get_item_space(this);
        grid.spaceY = get_line_space(this);

        grid.compute(this.clientWidth, this.clientHeight);
        grid.match(items);
    });



    //绝对定位(不支持竖排)
    registry("absolute", function (items) {

        var contentWidth = 0,
            contentHeight = 0,
            width,
            height,
            cache;

        for (var i = 0, _ = items.length; i < _; i++)
        {
            var item = items[i];

            if (item.__visible = (item.visibility !== "collapsed"))
            {
                width = item.controlWidth = +item.width || item.__defaults.width;
                height = item.controlHeight = +item.height || item.__defaults.height;

                if ((cache = (item.controlX = +item.left || 0) + width) > contentWidth)
                {
                    contentWidth = cache;
                }

                if ((cache = (item.controlY = +item.top || 0) + height) > contentHeight)
                {
                    contentHeight = cache;
                }

                var box = item.__fn_box_style();

                if ((item.insideWidth = (width -= box.border_spaceX)) <= 0)
                {
                    item.insideWidth = 0;
                    item.clientWidth = 0;
                }
                else if ((item.clientWidth = width - box.padding_spaceX) < 0)
                {
                    item.clientWidth = 0;
                }

                if ((item.insideHeight = (height -= box.border_spaceY)) <= 0)
                {
                    item.insideHeight = 0;
                    item.clientHeight = 0;
                }
                else if ((item.clientHeight = height - box.padding_spaceY) < 0)
                {
                    item.clientHeight = 0;
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
    flyingon.CellDefine = flyingon.function_extend(

        function (grid, row) {

            this.grid = grid;
            this.row = row;
        },

        function () {

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
    flyingon.RowDefine = flyingon.function_extend(

        function (grid) {

            this.grid = grid;
            this.cells = [];
        },

        function () {

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
    flyingon.GridDefine = flyingon.function_extend(

        function () {

            this.rows = [];
        },

        function () {


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



            function match_cells(target, exports) {

                var rows = target.rows;

                exports = exports || [];

                for (var i = 0, _ = rows.length; i < _; i++)
                {
                    var row = rows[i],
                        cells = row.cells;

                    for (var j = 0, __ = cells.length; j < __; j++)
                    {
                        var cell = cells[j];

                        if (cell.children)
                        {
                            match_cells(cell.children, exports);
                        }
                        else
                        {
                            exports.push(cell);
                        }
                    }
                }

                return exports;
            };



            //按顺序自动排列子控件
            this.match = function (items) {

                var cells = match_cells(this),
                    length = cells.length,
                    index = 0;

                for (var i = 0, _ = items.length; i < _; i++)
                {
                    var item = items[i];

                    if (item.__visible = index < length && item.visibility !== "collapsed")
                    {
                        var cell = cells[index++];

                        item.measure(cell.width, cell.row.height, 1, 1);
                        item.locate(cell.x, cell.row.y);
                    }
                }

                return this;
            };

        });


})(flyingon);
