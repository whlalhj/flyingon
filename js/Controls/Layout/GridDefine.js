/*

*/
(function (flyingon) {



    //布局格
    var prototype = (flyingon.CellDefine = function (grid, row) {

        this.grid = grid;
        this.row = row;

    }).prototype;



    prototype.grid = null;

    prototype.x = 0;

    prototype.width = 0;

    prototype["width-string"] = "*";

    prototype["width-weight"] = 100;

    prototype["width-auto"] = false;


    //设置列宽
    prototype.set_width = function (value) {

        if (this["width-auto"])
        {
            this.row["width-weights"] -= this["width-weight"];
            this["width-auto"] = false;
        }
        else if (this.width)
        {
            this.row["width-fixed"] -= this.width;
        }

        this["width-string"] = value = value || "*";

        var length = value.length - 1;

        if (value[length] == "*")
        {
            this["width-weight"] = length ? value.substring(0, length) : 100;
            this["width-auto"] = true;
            this.width = 0;
            this.row["width-weights"] += this["width-weight"];
        }
        else
        {
            this.width = parseInt(value);
            this.row["width-fixed"] += this.width;
        }
    };





    //布局行
    var prototype = (flyingon.RowDefine = function (grid) {

        this.grid = grid;
        this.cells = [];

    }).prototype;


    prototype.grid = null;

    prototype.y = 0;

    prototype.height = 0;

    prototype["height-string"] = "*";

    prototype["height-weight"] = 100;

    prototype["height-auto"] = false;

    //所属单元格所有固定宽度的总和
    prototype["width-fixed"] = 0;

    //自动宽度的表格数
    prototype["width-weights"] = 0;

    //设置行高
    prototype.setHeight = function (value) {

        if (this["height-auto"])
        {
            this.grid["height-weights"] -= this["height-weight"];
            this["height-auto"] = false;
        }
        else if (this.height)
        {
            this.grid["height-fixed"] -= this.height;
        }

        this["height-string"] = value = value || "*";
        var length = value.length - 1;

        if (value[length] == "*")
        {
            this["height-weight"] = length == 0 ? 100 : value.substring(0, length);
            this["height-auto"] = true;
            this.height = 0;
            this.grid["height-weights"] += this["height-weight"];
        }
        else
        {
            this.height = parseInt(value);
            this.grid["height-fixed"] += this.height;
        }
    };





    //布局表
    var prototype = (flyingon.GridDefine = function () {

        this.rows = [];

    }).prototype;



    //列留空
    prototype.spaceX = 0;

    //行留空
    prototype.spaceY = 0;

    //所属行中所有固定高度的总和
    prototype["height-fixed"] = 0;

    //自动高度的权重总数
    prototype["height-weights"] = 0;


    prototype.compute = function (width, height) {

        this.width = width || 0;
        this.height = height || 0;

        var spaceX = this.spaceX || 0,
            spaceY = this.spaceY || 0,

            rows = this.rows,
            length = rows.length,

            y = this.y || 0,
            height = Math.max(this.height - this["height-fixed"] - (length - 1) * spaceY, 0),
            height_weights = this["height-weights"];


        for (var i = 0; i < length; i++)
        {
            var row = rows[i];

            row.y = y;

            if (row["height-auto"])
            {
                row.height = Math.round(height * row["height-weight"] / height_weights);
                height_weights -= row["height-weight"];
                height -= row.height;
            }


            var cells = row.cells,
                count = cells.length,

                x = this.x || 0,
                width = Math.max(this.width - row["width-fixed"] - (count - 1) * spaceX, 0),
                width_weights = row["width-weights"];

            for (var j = 0; j < count; j++)
            {
                var cell = cells[j];

                cell.x = x;

                if (cell["width-auto"])
                {
                    cell.width = Math.round(width * cell["width-weight"] / width_weights);
                    width_weights -= cell["width-weight"];
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



    prototype.create = function (rows, columns) {

        var rows = Math.max(rows, 0) || 3,
            columns = Math.max(columns, 0) || 3;


        for (var i = 0; i < rows; i++)
        {
            var row = new flyingon.RowDefine(this);

            row["height-auto"] = true;
            this["height-weights"] += row["height-weight"];

            for (var j = 0; j < columns; j++)
            {
                var cell = new flyingon.CellDefine(this, row);

                cell["width-auto"] = true;
                row["width-weights"] += cell["width-weight"];

                row.cells.push(cell);
            }

            this.rows.push(row);
        }

        return this;
    };

    prototype.load = function (value) {

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

            if (token == "END")
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
                        row.setHeight(value);
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


    prototype.serialize = function () {

    };

    prototype.deserialize = function (value) {


    };

    prototype["horizontal-cells"] = function (include_children, result) {

        var rows = this.rows;

        if (!result)
        {
            result = [];
        }

        for (var i = 0, length = rows.length; i < length; i++)
        {
            var row = rows[i],
                cells = row.cells;

            for (var j = 0, count = cells.length; j < count; j++)
            {
                var cell = cells[j];

                if (include_children && cell.children)
                {
                    cell.children["horizontal-cells"](true, result);
                }
                else
                {
                    result.push(cell);
                }
            }
        }

        return result;
    };

    prototype["vertical-cells"] = function (include_children, result) {

        var rows = this.rows;

        if (!result)
        {
            result = [];
        }


        var values = [];

        for (var i = 0, length = rows.length; i < length; i++)
        {
            var row = rows[i],
                cells = row.cells;

            for (var j = 0, count = cells.length; j < count; j++)
            {
                var cell = cells[j];

                if (include_children && cell.children)
                {
                    cell.children["vertical-cells"](true, result);
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
    prototype.match = function (items, boxModel, vertical) {

        var cells = this[vertical ? "vertical-cells" : "horizontal-cells"](true),
            count = cells.length,
            index = 0;

        for (var i = 0, length = items.length; i < length; i++)
        {
            var item = items[i],
                box = item["x:boxModel"];

            if (box.visible = index < count && item["x:storage"].visibility != "collapsed")
            {
                var cell = cells[index++];
                box.measure(boxModel, cell.x, cell.row.y, cell.width, cell.row.height);
            }
        }

        return this;
    };


})(flyingon);
