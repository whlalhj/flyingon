/*

*/
(function (flyingon) {



    //布局格
    var Cell = function Cell(table, row) {

        this.table = table;
        this.row = row;

    }, prototype = Cell.prototype;



    prototype.subtable = null;

    prototype.x = 0;

    prototype.width = 0;

    prototype.widthSet = "*";

    prototype.widthWeight = 100;

    prototype.widthAuto = false;

    //设置列宽
    prototype.setWidth = function (value) {

        if (this.widthAuto)
        {
            this.row.widthWeights -= this.widthWeight;
            this.widthAuto = false;
        }
        else if (this.width)
        {
            this.row.widthFixed -= this.width;
        }

        this.widthSet = value = value || "*";

        var length = value.length - 1;

        if (value[length] == "*")
        {
            this.widthWeight = length ? value.substring(0, length) : 100;
            this.widthAuto = true;
            this.width = 0;
            this.row.widthWeights += this.widthWeight;
        }
        else
        {
            this.width = parseInt(value);
            this.row.widthFixed += this.width;
        }
    };





    //布局行
    var Row = function Row(table) {

        this.table = table;
        this.cells = [];

    }, prototype = Row.prototype;


    prototype.y = 0;

    prototype.height = 0;

    prototype.heightSet = "*";

    prototype.heightWeight = 100;

    prototype.heightAuto = false;

    //所属单元格所有固定宽度的总和
    prototype.widthFixed = 0;

    //自动宽度的表格数
    prototype.widthWeights = 0;

    //设置行高
    prototype.setHeight = function (value) {

        if (this.heightAuto)
        {
            this.table.heightWeights -= this.heightWeight;
            this.heightAuto = false;
        }
        else if (this.height)
        {
            this.table.heightFixed -= this.height;
        }

        this.heightSet = value = value || "*";
        var length = value.length - 1;

        if (value[length] == "*")
        {
            this.heightWeight = length == 0 ? 100 : value.substring(0, length);
            this.heightAuto = true;
            this.height = 0;
            this.table.heightWeights += this.heightWeight;
        }
        else
        {
            this.height = parseInt(value);
            this.table.heightFixed += this.height;
        }
    };





    //布局表
    var LayoutTable = flyingon.LayoutTable = function () {

        this.rows = [];

    }, prototype = LayoutTable.prototype;



    //列留空
    prototype.spaceX = 0;

    //行留空
    prototype.spaceY = 0;

    //所属行中所有固定高度的总和
    prototype.heightFixed = 0;

    //自动高度的权重总数
    prototype.heightWeights = 0;


    prototype.compute = function (width, height) {

        this.width = width || 0;
        this.height = height || 0;

        var spaceX = this.spaceX || 0,
            spaceY = this.spaceY || 0,

            rows = this.rows,
            length = rows.length,

            y = this.y || 0,
            height = Math.max(this.height - this.heightFixed - (length - 1) * spaceY, 0),
            heightWeights = this.heightWeights;


        for (var i = 0; i < length; i++)
        {
            var row = rows[i];

            row.y = y;

            if (row.heightAuto)
            {
                row.height = Math.round(height * row.heightWeight / heightWeights);
                heightWeights -= row.heightWeight;
                height -= row.height;
            }


            var cells = row.cells,
                count = cells.length,

                x = this.x || 0,
                width = Math.max(this.width - row.widthFixed - (count - 1) * spaceX, 0),
                widthWeights = row.widthWeights;

            for (var j = 0; j < count; j++)
            {
                var cell = cells[j];

                cell.x = x;

                if (cell.widthAuto)
                {
                    cell.width = Math.round(width * cell.widthWeight / widthWeights);
                    widthWeights -= cell.widthWeight;
                    width -= cell.width;
                }

                if (cell.subtable)
                {
                    var t = cell.subtable;

                    t.x = x;
                    t.y = y;
                    t.spaceX = spaceX;
                    t.spaceY = spaceY;
                    t.compute(cell.width, row.height);
                }

                x += cell.width + spaceX;
            }

            y += row.height + spaceY;
        }
    };


    prototype.appendRow = function (height) {

    };


    prototype.insertRow = function (index, height) {

    };

    prototype.appendColumn = function (width) {

    };

    prototype.insertColumn = function (index, width) {

    };



    prototype.create = function (rows, columns) {

        var rows = Math.max(rows, 0) || 3,
            columns = Math.max(columns, 0) || 3;


        for (var i = 0; i < rows; i++)
        {
            var row = new Row(this);

            row.heightAuto = true;
            this.heightWeights += row.heightWeight;

            for (var j = 0; j < columns; j++)
            {
                var cell = new Cell(this, row);

                cell.widthAuto = true;
                row.widthWeights += cell.widthWeight;

                row.cells.push(cell);
            }

            this.rows.push(row);
        }
    };

    prototype.load = function (value) {

        value = value || "T R* C* C* C* R* C* C* C* R* C* C* C* END";

        var tables = [],
            rows = [],
            table = this,
            row,
            cell,
            tokens = value.split(/\s/g);


        for (var i = 0, length = tokens.length; i < length; i++)
        {
            var token = tokens[i],
                value = token.substring(1);

            if (token == "END")
            {
                table = tables.pop();
                row = rows.pop();
            }
            else
            {
                switch (token[0])
                {
                    case "T":
                        if (cell != null)
                        {
                            tables.push(table);
                            rows.push(row);

                            table = cell.subtable = new flyingon.LayoutTable();
                            row = null;
                        }
                        break;

                    case "R":
                        row = new Row(table);
                        row.setHeight(value);
                        table.rows.push(row);

                        cell = null;
                        break;

                    case "C":
                        if (row)
                        {
                            cell = new Cell(table, row);
                            cell.setWidth(value);
                            row.cells.push(cell);
                        }
                        break;
                }
            }
        }
    };


    prototype.serialize = function () {

    };

    prototype.deserialize = function (value) {


    };

    prototype.getAllCells = function () {

        var result = [],
            rows = this.rows;

        for (var i = 0, length = rows.length; i < length; i++)
        {
            var row = rows[i],
                cells = row.cells;

            for (var j = 0, count = cells.length; j < count; j++)
            {
                var cell = cells[j];
                result.push((cell.subtable && cell.subtable.getAllCells()) || cell);
            }
        }

        return result;
    };



    //顺序排列子控件
    prototype.sequenceLayout = function (children, boxModel) {

        var cells = this.getAllCells(),
            length = cells.length,
            index = 0;

        for (var i = 0, count = children.length ; i < count; i++)
        {
            var item = children[i],
                box = item["x:boxModel"];

            if (box.visible = (item["x:storage"].visibility != "collapsed"))
            {
                if (box.visible = (index < length))
                {
                    var cell = cells[index++];
                    box.measure(boxModel, cell.x, cell.y, cell.width, cell.height);
                }
            }
        }
    };


})(flyingon);
