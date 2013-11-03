/*

*/
(function ($) {



    //布局格
    function Cell(table, row) {

        this.table = table;
        this.row = row;
    };


    var p = Cell.prototype;

    p.subtable = null;

    p.x = 0;

    p.width = 0;

    p.widthSet = "*";

    p.widthWeight = 100;

    p.widthAuto = false;

    //设置列宽
    p.setWidth = function (value) {

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
    function Row(table) {

        this.table = table;
        this.cells = [];
    };


    var p = Row.prototype;

    p.y = 0;

    p.height = 0;

    p.heightSet = "*";

    p.heightWeight = 100;

    p.heightAuto = false;

    //所属单元格所有固定宽度的总和
    p.widthFixed = 0;

    //自动宽度的表格数
    p.widthWeights = 0;

    //设置行高
    p.setHeight = function (value) {

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
    $.LayoutTable = function () {

        this.rows = [];

    };


    var p = $.LayoutTable.prototype;

    //列留空
    p.spaceX = 0;

    //行留空
    p.spaceY = 0;

    //所属行中所有固定高度的总和
    p.heightFixed = 0;

    //自动高度的权重总数
    p.heightWeights = 0;


    p.compute = function (width, height) {

        this.width = width || 0;
        this.height = height || 0;

        var spaceX = this.spaceX || 0,
            spaceY = this.spaceY || 0,

            rows = this.rows,

            y = this.y || 0,
            height = Math.max(this.height - this.heightFixed - (rows - 1) * spaceY, 0),
            heightWeights = this.heightWeights,

            i = 0;
        length = row.length;



        while (i < length)
        {
            var row = rows[i++];

            row.y = y;

            if (row.heightAuto)
            {
                row.height = Math.round(height * row.heightWeight / heightWeights);
                heightWeights -= row.heightWeight;
                height -= row.height;
            }


            var cells = row.cells,

                x = this.x || 0,
                width = Math.max(this.width - row.widthFixed - (cells - 1) * spaceX, 0),
                widthWeights = row.widthWeights,

                j = 0,
                count = cells.length;

            while (j < count)
            {
                var cell = cells[j++];

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


    p.appendRow = function (height) {

    };


    p.insertRow = function (index, height) {

    };

    p.appendColumn = function (width) {

    };

    p.insertColumn = function (index, width) {

    };



    p.create = function (rows, columns) {

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

    p.load = function (value) {

        value = value || "T R* C* C* C* R* C* C* C* R* C* C* C* END";

        var tables = [],
            rows = [],
            table = this,
            row,
            cell,
            tokens = value.split(/\s/g),

            i = 0,
            length = tokens.length;


        while (i < length)
        {
            var token = tokens[i++],
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

                            table = cell.subtable = new $.LayoutTable();
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


    p.serialize = function () {

    };

    p.deserialize = function (value) {


    };

    p.getAllCells = function () {

        var result = [],
            rows = this.rows,
            i = 0,
            length = rows.length;


        while (i < length)
        {
            var row = rows[i++],
                cells = row.cells,
                j = 0,
                count = row.cells.length;


            while (j < count)
            {
                var cell = cells[j++];

                if (cell.subtable)
                {
                    result = result.concat(cell.subtable.getAllCells());
                }
                else
                {
                    result.push(cell);
                }
            }
        }

        return result;
    };



    //顺序排列子控件
    p.sequenceLayout = function (children, boxModel) {

        var index = 0,
            cells = this.getAllCells(),
            length = children.length;


        for (var i = 0; i < length; i++)
        {
            var item = children[i],
                box = item["x:boxModel"];


            if (box.visible = (item["x:storage"].visibility != "collapsed"))
            {
                if (index >= cells.length)
                {
                    box.visible = false;
                }
                else
                {
                    var cell = cells[index++],
                        margin = box.margin = item.getStyleValue("margin");

                    box.setUsableRect(
                        boxModel,
                        cell.x + margin[3],
                        cell.row.y + margin[0],
                        cell.width - margin[3] - margin[1],
                        cell.row.height - margin[0] - margin[2]);
                }
            }
        }
    };


})(flyingon);
