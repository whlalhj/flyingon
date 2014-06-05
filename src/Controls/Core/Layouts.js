/// <reference path="../../../js/flyingon.js" />



(function (flyingon) {



    var layouts = flyingon.layouts = {},

        parse = parseFloat,

        round = Math.round;




    //注册自定义布局 
    //注1. 遵守回调函数规范(items)
    //注2. 按需内容区宽高 contentWidth, contentHeight
    var registry = flyingon.registry_layout = function (name, arrange_fn) {

        layouts[name] = arrange_fn;
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

                    width = item.measure(clientWidth - x, align_height, 0, 0, 1, 0).width;

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

                    height = item.measure(align_width, clientHeight - y, 0, 0, 1, 0).height;

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


        registry("flow", function (items) {

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




    //单页显示(不支持竖排)
    registry("xxxx", function (items) {

        var width = this.clientWidth,
            height = this.clientHeight;

        for (var i = 0, _ = items.length; i < _; i++)
        {
            var item = items[i];

            if (item.__visible = (item.visibility !== "collapsed"))
            {
                //item.measure(width, height, 1, 1);
                //item.locate(0, 0, width, height);
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

                        case "fill":
                            fill.push(item);
                            break;

                        default: //不停靠(使用绝对定位)
                            item.measure();
                            item.locate(+item.left || 0, +item.top || 0);
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

        var table = new flyingon.TableDefine().parse(this.layoutTable);

        table.compute(this.clientWidth, this.clientHeight, get_item_space(this), get_line_space(this));
        table.arrange(items);
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

                if ((item.clientWidth = width - box.control_spaceX) <= 0)
                {
                    item.clientWidth = 0;
                }

                if ((item.clientHeight = height - box.control_spaceY) <= 0)
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



    var round = Math.round,
        regex_value = /\d+(.\d*)?|[*%]/g;


    //定义表格属性
    function defineProperty(target, name) {

        flyingon.defineProperty(target, name,

            function () {

                return this.__type ? this.__value + this.__type : this.__value;
            },

            function (value) {

                var cache = this.__value;

                if (cache = +value) //固定大小
                {
                    this.__type = null;
                    this.__value = round(cache); //取整
                }
                else //字符串
                {
                    var values = (value = "" + value).match(regex_value);

                    this.__type = values.pop();
                    this.__value = values[0] || 100;
                }
            });
    };



    //单元
    var cell_type = flyingon.function_extend(

        function (row) {

            (this.parent = row)[row.length++] = this;
        },

        function () {

            //子表
            this.subtable = null;

            //x坐标
            this.x = 0;

            //实际宽度
            this.width = 0;



            //表格类型
            this.__type = "*";

            //表格值
            this.__value = 100;


            //表格值
            defineProperty(this, "value");


        });



    //表格行
    var row_type = flyingon.function_extend(

        function (table) {

            (this.parent = table)[table.length++] = this;
        },

        function () {

            //y坐标
            this.y = 0;

            //实际高度
            this.height = 0;

            //单元格数
            this.length = 0;


            //表格类型
            this.__type = "*";

            //表格值
            this.__value = 100;


            //表格行值
            defineProperty(this, "value");


            //添加单元格
            this.append = function (value) {

                var cell = new cell_type(this);
                cell.value = value;
                return cell;
            };

        });



    //表
    flyingon.TableDefine = flyingon.function_extend(

        function () {

        },

        function () {


            var round = Math.round,
                convert = parseFloat,
                regex_parse = /\d(.\d*)?[*%]?|[*%\[\]()]|table|end/g;


            this.__x = 0;

            this.__y = 0;

            //行数
            this.length = 0;

            //列间距(仅对子表有效)
            this.spaceX = "100%";

            //行间距(仅对子表有效)
            this.spaceY = "100%";


            //添加表格行
            this.append = function (value) {

                var row = new row_type(this);
                row.value = value;
                return row;
            };

            //创建均匀表格
            this.initialize = function (rows, columns) {

                var rows = rows > 0 ? rows : 3,
                    columns = columns > 0 ? columns : 3;

                for (var i = 0; i < rows; i++)
                {
                    var row = new row_type(this);

                    for (var j = 0; j < columns; j++)
                    {
                        new cell_type(row);
                    }
                }

                return this;
            };

            //解析表格定义
            this.parse = function (value) {

                if (!value)
                {
                    return this.create(3, 3);
                }

                var type = row_type,
                    row = true,
                    parent = this,
                    item,
                    values = ("" + value).match(regex_parse),
                    token;

                for (var i = 0, _ = values.length; i < _; i++)
                {
                    switch (token = values[i])
                    {
                        case "[": //开始单元格
                            if (row)
                            {
                                parent = item;
                                type = cell_type;
                                row = false;
                            }
                            break;

                        case "]": //结束单元格
                            if (!row)
                            {
                                parent = parent.parent || parent;
                                type = row_type;
                                row = true;
                            }
                            break;

                        case "table": //开始子表 
                            if (item instanceof cell_type)
                            {
                                parent = item.subtable = new flyingon.TableDefine();
                                parent.parent = item;
                                type = row_type;
                                row = true;
                            }
                            break;

                        case "end": //结束子表
                            if (parent.parent instanceof cell_type)
                            {
                                parent = parent.parent.parent;
                                type = cell_type;
                                row = false;
                            }
                            break;

                        case "(": //开始子表间距 以后可扩展成参数
                            var j = i++;
                            while (values[j] != ")")  //")" 结束子表间距
                            {
                                j++;
                            }

                            if (parent.parent instanceof cell_type)
                            {
                                if (j > i++)
                                {
                                    parent.spaceX = +(value = values[i]) || value;
                                }

                                if (j > i)
                                {
                                    parent.spaceY = +(value = values[i]) || value;
                                }
                            }

                            i = j;
                            break;

                        default:
                            item = new type(parent);

                            switch (token[token.length - 1])
                            {
                                case "*":
                                    item.__value = convert(token) || 100;
                                    break;

                                case "%":
                                    item.__type = "%";
                                    item.__value = convert(token) || 0;
                                    break;

                                default:
                                    item.__value = round(+token) || 0;
                                    break;
                            }
                            break;
                    }
                }

                return this;
            };

            //计算
            this.compute = function (width, height, spaceX, spaceY) {

                var length1 = this.length,
                    weight1 = 0,
                    y = this.__y || 0;

                //先计算并减去百分比行及固定高度
                for (var i = 0; i < length1; i++)
                {
                    var row = this[i];

                    switch (row.__type)
                    {
                        case "%":
                            height -= (row.height = round(height * row.__value / 100));
                            break;

                        case "*":
                            weight1 += row.__value;
                            break;

                        default:
                            height -= (row.height = row.__value);
                            break;
                    }
                }

                //再减去行距
                if (height > 0 && (height -= (length1 - 1) * spaceY) < 0)
                {
                    height = 0;
                }

                //循环处理行
                for (var i = 0; i < length1; i++)
                {
                    var row = this[i];

                    row.y = y;

                    if (row.__type === "*")
                    {
                        height -= (row.height = round(height * row.__value / weight1));
                        weight1 -= row.__value;
                    }

                    //处理行格
                    var length2 = row.length,
                        weight2 = 0,
                        width2 = width,
                        x = this.__x || 0;

                    //先计算并减去百分比行及固定高度
                    for (var j = 0; j < length2; j++)
                    {
                        var cell = row[j];

                        switch (cell.__type)
                        {
                            case "%":
                                width2 -= (cell.width = round(width * cell.__value / 100));
                                break;

                            case "*":
                                weight2 += cell.__value;
                                break;

                            default:
                                width2 -= (cell.width = cell.__value);
                                break;
                        }
                    }

                    //再减去列距
                    if (width2 > 0 && (width2 -= (length2 - 1) * spaceX) < 0)
                    {
                        width2 = 0;
                    }

                    for (var j = 0; j < length2; j++)
                    {
                        var cell = row[j];

                        cell.x = x;

                        if (cell.__type === "*")
                        {
                            width2 -= (cell.width = round(width2 * cell.__value / weight2));
                            weight2 -= cell.__value;
                        }

                        if (cell.subtable)
                        {
                            var table = cell.subtable;

                            table.__x = x;
                            table.__y = y;
                            table.compute(cell.width, row.height,
                                +table.spaceX || round(spaceX * convert(table.spaceX) / 100) || 0,
                                +table.spaceY || round(spaceY * convert(table.spaceY) / 100) || 0);
                        }

                        x += cell.width + spaceX;
                    }

                    y += row.height + spaceY;
                }

                return this;
            };


            this.serialize = function (writer) {

            };

            this.deserialize = function (reader, value, excludes) {


            };



            //按顺序自动排列子控件
            this.arrange = function (items) {

                var cells = template_cells(this),
                    length = cells.length,
                    index = 0;

                for (var i = 0, _ = items.length; i < _; i++)
                {
                    var item = items[i];

                    if (item.__visible = index < length && item.visibility !== "collapsed")
                    {
                        var cell = cells[index++];

                        item.measure(cell.width, cell.parent.height, 1, 1);
                        item.locate(cell.x, cell.parent.y);
                    }
                }

                return this;
            };


            //获取表格模板
            function template_cells(target, exports) {

                exports = exports || [];

                for (var i = 0, _ = target.length; i < _; i++)
                {
                    var row = target[i];

                    for (var j = 0, __ = row.length; j < __; j++)
                    {
                        var cell = row[j];

                        if (cell.subtable)
                        {
                            template_cells(cell.subtable, exports);
                        }
                        else
                        {
                            exports.push(cell);
                        }
                    }
                }

                return exports;
            };


        });


})(flyingon);
