//文字
(function (flyingon) {



    //选中文字背景色
    flyingon.selectionText_backgroundColor = "skyblue";

    //选中文字颜色
    flyingon.selectionText_color = "white";



    var Font = flyingon.Font,

        pseudo_array = flyingon.__pseudo_array__,

        prototype = (flyingon.Text = function (text, font) {

            this.__rows__ = new text_rows();
            this.__text__ = text || "";
            this.__font__ = font || Font.__default__;

        }).prototype,

        defineProperty = function (name, defaultValue, measure) {

            prototype["__" + name + "__"] = defaultValue;

            flyingon.defineProperty(prototype, name,

                new Function("return this.__" + name + "__;"),

                new Function("value", "var oldValue = this.__" + name + "__;\n"
                    + "if (oldValue == null) oldValue = flyingon.Text.prototype.__" + name + "__;"
                    + "if (oldValue !== value)\n"
                    + "{\n"
                    + "this.__" + name + "__ = value;\n"
                    + (measure ? "this.__lines__ = null;\n" : "")
                    + (name == "text" ? "if (!value) this.__rows__.clear();\n" : "")
                    + "this.__dirty__ = true;\n"
                    + "}"));
        };



    //需要重新排列
    prototype.__dirty__ = true;


    //文字内容
    defineProperty("text", "", true);

    //字体
    defineProperty("font", Font.__default__, true);

    //是否多行文本
    defineProperty("multiline", false, true);

    //行高(仅在多行时有效)
    defineProperty("lineHeight", 19);

    //是否自动换行
    defineProperty("wrap", false);

    //行缩进
    defineProperty("indent", 0);


    //宽度
    defineProperty("width", 100);

    //高度
    defineProperty("height", 21);



    defineProperty = flyingon.defineProperty;


    //x偏移
    prototype.offsetX = 0;

    //y偏移
    prototype.offsetY = 0;

    //x滚动偏移
    prototype.scrollLeft = 0;

    //y滚动偏移
    prototype.scrollTop = 0;

    //滚动宽度
    defineProperty(prototype, "scrollWidth", function () {

        return this.__scrollWidth__ || 0;
    });

    //滚动高度
    defineProperty(prototype, "scrollHeight", function () {

        return this.__scrollHeight__ || 0;
    });


    prototype.__selectionStart__ = 0;

    prototype.__selectionEnd__ = 0;

    function define_setter(name) {

        var body = "if ((value = +value) < 0) value = 0;\n"
            + "else if (value >= this.__text__.length) value = this.__text__.length - 1;\n"
            + "if (value != this." + name + ")\n"
            + "{\n"
            + "this." + name + " = value;\n"
            + "}";

        return new Function("value", body);
    };

    //开始选中文字位置
    defineProperty(prototype, "selectionStart", function () {

        return this.__selectionStart__;

    }, define_setter("__selectionStart__"));

    //选中文字长度
    defineProperty(prototype, "selectionLength",

        function () {

            return Math.abs(this.__selectionEnd__ - this.__selectionStart);
        },

        function (value) {

            if (value && typeof value == "number")
            {
                var value = this.__selectionEnd__ = this.__selectionStart__ + value;

                if (value < 0)
                {
                    this.__selectionEnd__ = 0;
                }
                else if (value > this.__text__.length)
                {
                    value = this.__text__.length;
                }
            }
        });

    //结束选中文字位置(不包含当前字符)
    defineProperty(prototype, "selectionEnd", function () {

        return this.__selectionEnd__;

    }, define_setter("__selectionEnd__"));




    //物理行集合
    function measure_lines() { };

    //初始化物理行集合默认值
    (function () {

        this.measure_length = 0;    //已测量文字数
        this.measure_index = 0;     //测量过的索引
        this.measure_width = 0;     //已测量总宽

        this.maxWidth = 0;          //已测量的最大行宽
        this.dirty = true;          //需要测量

    }).call(measure_lines.prototype = pseudo_array());


    //物理行
    function measure_line(lines, start, end) {

        this.start = start;
        this.end = end;

        lines.push(this);
    };

    measure_line.prototype = new pseudo_array();


    /*
    注1: 缓存测量结果以提升canvas的measureText方法性能较差的问题
    注2: 需注意此方法对内存占用有一定的影响 在IE下可能存在一定的误差(IE的字体渲染有问题:分段测量值的和<>直接测量值???)
    */

    //unicode码: 
    //\u2e80-\uffff:东方字符 按单个等宽字符处理
    //\u00c0-\u00ff 拉丁字母1
    //\u0400-\u04ff 西里尔字母

    //拆分
    function split_text() {

        var lines = this.__lines__ = new measure_lines(),
            text = this.__text__,
            length = text.length;

        if (this.multiline) //多行时按行截断
        {
            var start = 0, end;

            while ((end = text.indexOf("\n", start)) > 0)
            {
                new measure_line(lines, start, end);
                start = end + 1;
            }

            if (start < length)
            {
                new measure_line(lines, start, length);
            }
        }
        else
        {
            new measure_line(lines, 0, length);
        }
    };

    //测量文字行(每调用一次只测量一行)
    function measure_text() {

        var lines = this.__lines__,
            line = lines[lines.measure_index++],
            storage = this.__font__.__storage__,
            chinese = storage.chinese,
            index = line.start, //文本索引号
            width = 0,          //行宽
            text = this.__text__.substring(index, line.end),
            length = text.length;

        //每次处理一个字符效率差一些,但处理简单且不会有测量误差
        //使用局部测量及绘制以提升效率
        for (var i = 0; i < length; i++)
        {
            line.push(width);

            var item = text[i];
            width += item >= "\u2e80" ? chinese : storage[item] || (storage[item] = storage.context.measureText(item).width);
        }

        line.push(line.width = width);  //行宽

        lines.measure_length += length;   //已测量文字数
        lines.measure_width += width;     //已测量总宽

        if (width > lines.maxWidth)
        {
            lines.maxWidth = width;     //记录最大行宽
        }

        if (lines.measure_index >= lines.length)
        {
            lines.dirty = false; //标记已测量完
        }

        return line;
    };



    //逻辑行集合
    function text_rows() { };

    text_rows.prototype = pseudo_array();


    //逻辑行
    function text_row(rows, line) {

        this.line = line;                //物理行
        this.item_end = line.length - 1; //结束子项索引

        rows.push(this);
    };

    (function () {

        this.item_start = 0;    //开始子项索引
        this.item_end = 0;      //结束子项索引

        this.width = 0;     //行宽

    }).call(text_row.prototype);


    //排列
    function layout() {

        var rows = this.__rows__;

        if (this.__dirty__)
        {
            if (rows.length > 0)
            {
                rows.clear();
            }

            if (!this.__lines__) //需要重新测量
            {
                split_text.call(this);
            }

            this.__dirty__ = false;
        }

        (this.multiline ? (this.wrap ? layout_wrap : layout_rows) : layout_row).call(this, rows); //排列
    };


    //排列单行文字 排列逻辑行
    function layout_row(rows) {

        var lines = this.__lines__,                 //物理行集合
            line,                                   //物理行
            row;                                    //逻辑行

        if (lines.dirty)
        {
            line = measure_text.call(this);
            row = new text_row(rows, line);

            this.__scrollWidth__ = row.width = row.line.width;
            this.__scrollHeight__ = this.__lineHeight__;
        }
    };

    //排列多行文字
    function layout_rows(rows) {

        var lines = this.__lines__,     //物理行集合
            lineHeight = this.__lineHeight__, //行高
            count = Math.ceil((this.scrollTop + this.__height__) / lineHeight);

        while (lines.dirty && rows.length < count)
        {
            new text_row(rows, measure_text.call(this));
        }

        this.__scrollWidth__ = lines.maxWidth;
        this.__scrollHeight__ = lines.length * lineHeight;
    };

    var regex = /\w/;

    //排列自动换行
    function layout_wrap(rows) {

        var text = this.__text__,
            lines = this.__lines__,     //物理行集合
            lineHeight = this.__lineHeight__, //行高
            maxWidth = this.__width__,
            count = Math.ceil((this.scrollTop + this.__height__) / lineHeight);

        if (maxWidth < lineHeight)
        {
            maxWidth = lineHeight;
        }

        while (lines.dirty && rows.length < count)
        {
            var line = measure_text.call(this),                 //物理行
                row,                                            //逻辑行
                width = rows.length == 0 ? maxWidth - this.offsetX : maxWidth,
                start = 0,
                end = 0,
                length = line.length;

            while (start < length)
            {
                end = line.binary_between(line[start] + width);

                if (line[end] > width + line[start])
                {
                    end--;
                }

                //处理单词显示在同一行
                while (end > start && regex.test(text[line.start + end]))
                {
                    end--;
                }

                if (end == start)
                {
                    while (regex.test(text[line.start + end]))
                    {
                        end++;
                    }
                }

                row = new text_row(rows, line);    //逻辑行
                row.item_start = start;
                row.item_end = end;

                start = end + 1;
            }
        }

        this.__scrollWidth__ = maxWidth;
        this.__scrollHeight__ = Math.ceil(rows.length * lineHeight * lines.length / lines.measure_index);
    };


    //获取指定坐标的文字信息
    prototype.hitTest = function (x, y) {

        var lineHeight = this.__lineHeight__,
            rows = this.__rows__,
            row,
            index,
            line,
            item;

        x += this.scrollLeft;
        y += this.scrollTop + this.offsetY;

        switch (rows.length)
        {
            case 0:
                return null;

            case 1:
                index = 0;
                break;

            default:
                if ((index = Math.floor(y / lineHeight)) >= rows.length)
                {
                    index = rows.length - 1;
                }
                break;
        }

        if (index == 0 && (x -= this.offsetX) < 0)
        {
            x = 0;
        }

        row = rows[index];
        line = row.line;
        item = line.binary_between(x + line[row.item_start], row.item_start, row.item_end - 1);

        return {

            x: (index == 0 ? this.offsetX : 0) + line[item] - line[row.item_start],
            y: this.offsetY + index * lineHeight,
            index: line.start + item
        };
    };




    //重新测量
    prototype.invalidate = function (measure) {

        if (measure)
        {
            this.__lines__ = null;
        }

        this.__dirty__ = true;
    };


    //绘制文字(仅绘制可视范围以提升性能)
    prototype.paint = function (context, windowX, windowY, color) {

        var text = this.__text__;

        //无文字时不处理
        if (text)
        {
            if (this.__dirty__ || this.__lines__.dirty) //先测量未测量的文字
            {
                layout.call(this);
            }

            var lineHeight = this.__lineHeight__,
                rows = this.__rows__,       //逻辑行集合
                row_start = 0,              //起始可视行
                row_end = rows.length,      //终止可视行
                width = this.__width__,
                selectionStart = this.__selectionStart__,   //开始选中文字索引
                selectionEnd = this.__selectionEnd__,       //终止选中文字索引
                selection = selectionStart != selectionEnd, //是否有选中文字
                selection_start,
                selection_end,
                cache;

            if (selectionEnd < selectionStart)
            {
                cache = selectionStart;
                selectionStart = selectionEnd;
                selectionEnd = cache;
            }

            if (rows.length > 1) //如果有多行则计算出可视行范围
            {
                if ((cache = this.scrollTop) > 0)
                {
                    row_start = Math.floor(cache / lineHeight);
                    windowY -= cache;
                }

                if ((cache = Math.ceil((cache + this.__height__) / lineHeight)) < row_end)
                {
                    row_end = cache;
                }
            }

            context.fillStyle = color || "black";
            context.font = this.__font__.__value__;

            cache = this.scrollLeft;

            for (var i = row_start; i < row_end; i++)
            {
                var row = rows[i],   //逻辑行
                    line = row.line, //物理行
                    char_start = line.start, //开始字符索引
                    item_start = row.item_start,
                    item_end = row.item_end;

                if (cache > 0)
                {
                    item_start = line.binary_between(cache, item_start, item_end);
                }

                if (line[item_end] - line[item_start] > width)
                {
                    item_end = line.binary_between(cache + width, item_start, item_end);
                }

                //每次渲染一个字符以避免某些浏览器(如IE)测量多个字符不等于单个字符之和的误差
                var x = windowX - line[item_start],
                    y = windowY + i * lineHeight + this.offsetY;

                if (i == 0)
                {
                    x += this.offsetX;
                }

                if (selection && !(selectionStart > char_start + item_end || selectionEnd < char_start + item_start)) //绘制选中
                {
                    selection_start = Math.max(selectionStart - char_start, item_start);
                    selection_end = Math.min(selectionEnd - char_start, item_end);

                    //绘制前端未选中部分
                    if (selection_start > item_start)
                    {
                        for (var j = item_start; j < selection_start; j++)
                        {
                            context.fillText(text[char_start + j], line[j] + x, y);
                        }
                    }

                    //绘制选中背景
                    if (context.fillStyle = flyingon.selectionText_backgroundColor)
                    {
                        context.fillRect(line[selection_start] + x, y, line[selection_end] - line[selection_start], lineHeight);
                    }

                    //绘制选中文字
                    context.fillStyle = flyingon.selectionText_color;

                    for (var j = selection_start; j <= selection_end; j++)
                    {
                        context.fillText(text[char_start + j], line[j] + x, y);
                    }

                    //如果有后端未选中部分则继续绘制,否则跳过
                    if (selection_end < item_end)
                    {
                        context.fillStyle = color || "black";
                        item_start = selection_end;
                    }
                    else
                    {
                        continue;
                    }
                }

                for (var j = item_start; j <= item_end; j++)
                {
                    context.fillText(text[char_start + j], line[j] + x, y);
                }
            }
        }
    };


    //计算文本对齐(仅对单行文本有效)
    prototype.textAlign = function (align) {

        var x = 0, y = 0, cache;

        if (align)
        {
            if (cache = this.__width__ - row.width)
            {
                switch (align.horizontal)
                {
                    case "center":
                        x += cache >> 1;
                        break;

                    case "right":
                        x += cache;
                        break;
                }
            }

            if (cache = this.__height__ - this.__font__.__height__)
            {
                switch (align.vertical)
                {
                    case "middle":
                        y += cache >> 1;
                        break;

                    case "bottom":
                        y += cache;
                        break;
                }
            }
        }

        return { x: x, y: y };
    };

    prototype.replace = function (text) {

        if (text)
        {
            var start = this.__selectionStart__,
                end = this.__selectionEnd__;

            if (start != end)
            {
                if (start > end)
                {
                    start = end;
                    end = this.__selectionStart__;
                }

                var value = this.__text__;

            }
        }
    };


    prototype.remove = function (length) {

        if (!this.selectedText)
        {
            this.selectionTo(this.selectionEnd + length); //未选择
        }

        this.replace("");
    };



})(flyingon);

