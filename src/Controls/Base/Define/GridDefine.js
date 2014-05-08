/*

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

        this.__width_string__ = "*";

        this.__width_weight__ = 100;

        this.__width_auto__ = false;


        //设置列宽
        this.set_width = function (value) {

            if (this.__width_auto__)
            {
                this.row.__width_weights__ -= this.__width_weight__;
                this.__width_auto__ = false;
            }
            else if (this.width)
            {
                this.row.__width_fixed__ -= this.width;
            }

            this.__width_string__ = value = value || "*";

            var length = value.length - 1;

            if (value[length] === "*")
            {
                this.__width_weight__ = length ? value.substring(0, length) : 100;
                this.__width_auto__ = true;
                this.width = 0;
                this.row.__width_weights__ += this.__width_weight__;
            }
            else
            {
                this.width = parseInt(value);
                this.row.__width_fixed__ += this.width;
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

        this.__height_string__ = "*";

        this.__height_weight__ = 100;

        this.__height_auto__ = false;

        //所属单元格所有固定宽度的总和
        this.__width_fixed__ = 0;

        //自动宽度的表格数
        this.__width_weights__ = 0;



        //设置行高
        this.set_height = function (value) {

            if (this.__height_auto__)
            {
                this.grid.__height_weights__ -= this.__height_weight__;
                this.__height_auto__ = false;
            }
            else if (this.height)
            {
                this.grid.__height_fixed__ -= this.height;
            }

            this.__height_string__ = value = value || "*";
            var length = value.length - 1;

            if (value[length] === "*")
            {
                this.__height_weight__ = length === 0 ? 100 : value.substring(0, length);
                this.__height_auto__ = true;
                this.height = 0;
                this.grid.__height_weights__ += this.__height_weight__;
            }
            else
            {
                this.height = parseInt(value);
                this.grid.__height_fixed__ += this.height;
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
        this.__height_fixed__ = 0;

        //自动高度的权重总数
        this.__height_weights__ = 0;


        this.compute = function (width, height) {

            this.width = width || 0;
            this.height = height || 0;

            var spaceX = this.spaceX || 0,
                spaceY = this.spaceY || 0,

                rows = this.rows,
                length = rows.length,

                y = this.y || 0,
                height = Math.max(this.height - this.__height_fixed__ - (length - 1) * spaceY, 0),
                height_weights = this.__height_weights__;


            for (var i = 0; i < length; i++)
            {
                var row = rows[i];

                row.y = y;

                if (row.__height_auto__)
                {
                    row.height = Math.round(height * row.__height_weight__ / height_weights);
                    height_weights -= row.__height_weight__;
                    height -= row.height;
                }


                var cells = row.cells,
                    count = cells.length,

                    x = this.x || 0,
                    width = Math.max(this.width - row.__width_fixed__ - (count - 1) * spaceX, 0),
                    width_weights = row.__width_weights__;

                for (var j = 0; j < count; j++)
                {
                    var cell = cells[j];

                    cell.x = x;

                    if (cell.__width_auto__)
                    {
                        cell.width = Math.round(width * cell.__width_weight__ / width_weights);
                        width_weights -= cell.__width_weight__;
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

                row.__height_auto__ = true;
                this.__height_weights__ += row.__height_weight__;

                for (var j = 0; j < columns; j++)
                {
                    var cell = new flyingon.CellDefine(this, row);

                    cell.__width_auto__ = true;
                    row.__width_weights__ += cell.__width_weight__;

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


            for (var i = 0, length = tokens.length; i < length; i++)
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

        this.__fn_horizontal_cells__ = function (include_children, result) {

            var rows = this.rows;

            result = result || [];

            for (var i = 0, length = rows.length; i < length; i++)
            {
                var row = rows[i],
                    cells = row.cells;

                for (var j = 0, count = cells.length; j < count; j++)
                {
                    var cell = cells[j];

                    if (include_children && cell.children)
                    {
                        cell.children.__fn_horizontal_cells__(true, result);
                    }
                    else
                    {
                        result.push(cell);
                    }
                }
            }

            return result;
        };

        this.__fn_vertical_cells__ = function (include_children, result) {

            var rows = this.rows,
                values = [];

            result = result || [];

            for (var i = 0, length = rows.length; i < length; i++)
            {
                var row = rows[i],
                    cells = row.cells;

                for (var j = 0, count = cells.length; j < count; j++)
                {
                    var cell = cells[j];

                    if (include_children && cell.children)
                    {
                        cell.children.__fn_vertical_cells__(true, result);
                    }
                    else
                    {
                        (values[i] || (values[i] = [])).push(cell);
                    }
                }
            }

            for (var i = 0, length = values.length; i < length; i++)
            {
                result.push.apply(result, values[i]);
            }

            return result;
        };



        //按顺序自动排列子控件
        this.match = function (items, vertical) {

            var cells = this[vertical ? "__fn_vertical_cells__" : "__fn_horizontal_cells__"](true),
                count = cells.length,
                index = 0;

            for (var i = 0, length = items.length; i < length; i++)
            {
                var item = items[i],
                    box = item.__boxModel__;

                if (box.visible = index < count && item.visibility !== "collapsed")
                {
                    var cell = cells[index++];

                    box.measure(cell.x, cell.row.y, cell.width, cell.row.height);
                }
            }

            return this;
        };

    });


})(flyingon);
