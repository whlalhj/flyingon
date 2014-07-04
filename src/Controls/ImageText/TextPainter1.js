//文字
(function (flyingon) {



    //文字控件扩展(给指定控件扩展文字功能)
    flyingon.text_extender = function (base, multiline) {


        var attributes = {

            attributes: "invalidate",
            change: "this.__text = null;"
        };


        //文字内容
        this.defineProperty("text", "", attributes);

        //行高
        this.defineProperty("lineHeight", 0, attributes);



        //文字顺序
        //lr-tb: 从左到右 从上到下 (默认常见顺序)
        //lr-bt: 从左到右 从下到上 
        //rl-tb: 从右到左 从上到下 (如阿拉伯文等)
        //rl-bt: 从右到左 从下到上
        //tb-lr: 从上到下 从左到右
        //tb-rl: 从上到下 从右到左 (如中国古文)
        //bt-lr: 从下到上 从左到右
        //bt-rl: 从下到上 从右到左
        this.defineProperty("writingMode", "lr-tb", attributes);


        //字距
        this.defineProperty("letterSpacing", 0, attributes);

        //词距(空格调整)
        this.defineProperty("wordSpacing", 0, attributes);


        //文本行缩进
        this.defineProperty("multiline", false, attributes);


        //文字对齐方式(仅对单行有效)
        this.defineProperty("textAlign", null, attributes);


        //文本行缩进
        this.defineProperty("textIndent", 0, attributes);

        //开始位置偏移
        this.defineProperty("startOffset", 0, attributes);

        //是否自动换行
        this.defineProperty("textWrap", false, false, "this.__rows.clear();\n");


        attributes.change = "this.__font = new flyingon.Font(value);" + attributes.change;

        //字体
        this.defineProperty("font", Font.__default.__value, attributes);


        attributes.attributes = "invalidate|style";
        attributes.change = "(this.__font || (this.__font = new flyingon.Font()))[name.substring(4).toLocaleLowerCase()] = value;\nthis.__text = null;";

        //字体样式
        this.defineProperty("fontStyle", "normal", attributes);

        //字体变体 normal small-caps
        this.defineProperty("fontVariant", "normal", attributes);

        //字体粗细 normal bold bolder lighter 100 200 300 400 500 600 700 800 900
        this.defineProperty("fontWeight", "normal", attributes);

        //字体大小
        this.defineProperty("fontSize", "9pt", attributes);

        //字体系列
        this.defineProperty("fontFamily", "微软雅黑,宋体,Times New Roman", attributes);


        this.defineProperty("color", "", attributes);

        this.defineProperty("selectionColor", "", attributes);

        this.defineProperty("selectionBackgroundColor", "", attributes);


        //文本被选中事件
        this.defineEvent("select");

        //取消文本选中事件
        this.defineEvent("unselect");



        attributes = {

            attributes: "invalidate",
            check: "if ((value = +value) < 0) value = 0;\nelse if (value >= fields.text.length) value = fields.text.length - 1;",
            change: ""
        };

        //开始选中位置
        this.defineProperty("selectionStart", 0, attributes);

        //结束选中位置
        this.defineProperty("selectionEnd", 0, attributes);

        //选中文字长度(只读)
        this.defineProperty("selectionLength", function () {

            var fields = this.__fields;
            return Math.abs(fields.selectionEnd - fields.selectionStart);
        });


        //获取或设置选中文本
        this.defineProperty("selectionText", function () {

            var fields = this.__fields, start, end;

            if (fields.text && (start = fields.selectionStart) !== (end = fields.selectionEnd))
            {
                if (start > end)
                {
                    start = end;
                    end = fields.selectionStart;
                }

                return fields.text.substring(start, end);
            }

            return null;
        });


    };





    //文字绘制器(必须传入target目标控件)
    flyingon.TextPainter = function (target) {

        target.__text = this;

        this.__rows = new text_rows();
        this.target = target;
    };


    var Font = flyingon.Font,

        pseudo_array = flyingon.__pseudo_array,

        prototype = flyingon.TextPainter.prototype,

        selection = flyingon.selection_text = { //选中文字设置

            backgroundColor: "skyblue", //选中文字背景色

            color: "white" //选中文字颜色
        },

        defineProperty = function (name, defaultValue, measure, change) {

            prototype["__" + name] = defaultValue;

            flyingon.defineProperty(prototype, name,

                new Function("return this.__" + name + ";"),

                new Function("value", "var oldValue = this.__" + name + ";\n"
                    + "if (oldValue == null) oldValue = flyingon.TextPainter.prototype.__" + name + ";"
                    + "if (oldValue !== value)\n"
                    + "{\n"
                    + "this.__" + name + " = value;\n"
                    + (measure ? "this.__lines = null;\nthis.__rows.clear();\n" : "")
                    + (change || "")
                    + "this.__dirty = true;\n"
                    + "}"));
        };



    //需要重新排列
    prototype.__dirty = true;


    //文字内容
    defineProperty("text", "", true);

    //字体
    defineProperty("font", Font.__default, true);

    //文字顺序
    //lr-tb: 从左到右 从上到下 (默认常见顺序)
    //lr-bt: 从左到右 从下到上 
    //rl-tb: 从右到左 从上到下 (如阿拉伯文等)
    //rl-bt: 从右到左 从下到上
    //tb-lr: 从上到下 从左到右
    //tb-rl: 从上到下 从右到左 (如中国古文)
    //bt-lr: 从下到上 从左到右
    //bt-rl: 从下到上 从右到左
    defineProperty("writingMode", "lr-tb", true);

    //是否多行文本
    defineProperty("multiline", false, true, "this.__rows.offset = 0;\n");

    //是否自动换行
    defineProperty("wrap", false, false, "this.__rows.clear();\n");

    //行高(仅在多行时有效)
    defineProperty("lineHeight", 19);

    //字距
    defineProperty("letterSpacing", 2);

    //词距(空格调整)
    defineProperty("wordSpacing", 0);

    //文字对齐方式(仅对单行有效)
    defineProperty("textAlign", null);


    //行缩进
    defineProperty("indent", 0);

    //偏移距离
    defineProperty("offset", 0);

    //宽度
    defineProperty("width", 100);

    //高度
    defineProperty("height", 21);



    defineProperty = flyingon.defineProperty;



    //x滚动偏移
    prototype.scrollLeft = 0;

    //y滚动偏移
    prototype.scrollTop = 0;

    //滚动宽度
    defineProperty(prototype, "scrollWidth", function () {

        return this.__scrollWidth || 0;
    });

    //滚动高度
    defineProperty(prototype, "scrollHeight", function () {

        return this.__scrollHeight || 0;
    });


    prototype.__selectionStart = 0;

    prototype.__selectionEnd = 0;

    function define_setter(name) {

        var body = "if ((value = +value) < 0) value = 0;\n"
            + "else if (value >= this.__text.length) value = this.__text.length - 1;\n"
            + "if (value !== this." + name + ")\n"
            + "{\n"
            + "this." + name + " = value;\n"
            + "}";

        return new Function("value", body);
    };

    //开始选中文字位置
    defineProperty(prototype, "selectionStart", function () {

        return this.__selectionStart;

    }, define_setter("__selectionStart"));

    //选中文字长度
    defineProperty(prototype, "selectionLength",

        function () {

            return Math.abs(this.__selectionEnd - this.__selectionStart);
        },

        function (value) {

            if (value && typeof value === "number")
            {
                var value = this.__selectionEnd = this.__selectionStart + value;

                if (value < 0)
                {
                    this.__selectionEnd = 0;
                }
                else if (value > this.__text.length)
                {
                    this.__selectionEnd = this.__text.length;
                }
            }
        });

    //结束选中文字位置(不包含当前字符)
    defineProperty(prototype, "selectionEnd", function () {

        return this.__selectionEnd;

    }, define_setter("__selectionEnd"));


    //获取或设置选中文本
    defineProperty(prototype, "selectionText", function () {

        var start = this.__selectionStart,
            end = this.__selectionEnd;

        if (end === start)
        {
            return "";
        }

        if (start > end)
        {
            start = end;
            end = this.__selectionStart;
        }

        return this.__text.substring(start, end);

    });


    prototype.replace = function (value) {

        var start = this.__selectionStart,
            end = this.__selectionEnd;

        if (start !== end)
        {
            if (start > end)
            {
                start = end;
                end = this.__selectionStart;
            }
        }
        else if (!value) //没有选中没有替换则退出
        {
            return;
        }

        var lines = this.__lines,
            text = this.__text,
            index = lines.binary_between(function (index) {

                return lines[index].start - start;
            });

        //清除逻辑行
        this.__rows.clear();

        //清除以后物理行测量
        lines.index = index;
        lines.count = index > 0 ? lines[index - 1].end : 0;
        lines.splice(index, lines.length - index);

        //修改文字
        this.__text = text.substring(0, start) + value + text.substring(end);
        this.layout();
    };



    //物理行集合
    function measure_lines() { };

    //初始化物理行集合默认值
    (function () {

        this.index = 0;     //测量过的索引

        this.maxWidth = 0;  //已测量的最大行宽
        this.dirty = true;  //需要测量

        //获取已测量的文字数
        this.measure_length = function () {

            return this.index > 0 ? this[this.index - 1].end : 0;
        };

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
    function split_text(start) {

        var lines = this.__lines = new measure_lines(),
            text = this.__text,
            length = text.length,
            end;

        if (this.multiline) //多行时按行截断
        {
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

        var lines = this.__lines,
            line = lines[lines.index++],
            text = this.__text,
            letterSpacing = this.__letterSpacing,
            wordSpacing = this.__wordSpacing,
            storage = this.__font.__storage,
            chinese = storage.chinese,
            width = 0;          //行宽

        //每次处理一个字符效率差一些,但处理简单且不会有测量误差
        //使用局部测量及绘制以提升效率
        for (var i = line.start, end = line.end; i < end; i++)
        {
            line.push(width);

            var letter = text[i];

            width += letter >= "\u2e80" ? chinese : storage[letter] || (storage[letter] = storage.context.measureText(letter).width);

            if (letterSpacing && i + 1 < end) //不是最后一个
            {
                width += letterSpacing;
            }

            if (wordSpacing && letter === " ")
            {
                width += word;
            }
        }

        line.push(line.width = width);  //行宽

        if (width > lines.maxWidth)
        {
            lines.maxWidth = width;     //记录最大行宽
        }

        if (lines.index >= lines.length)
        {
            lines.dirty = false;        //标记已测量完
        }

        return line;
    };



    //逻辑行集合
    function text_rows() { };

    (text_rows.prototype = pseudo_array()).offset = 0; //行偏移


    //逻辑行
    function text_row(rows, line) {

        this.line = line;                //物理行
        this.item_end = line.length - 1; //结束子项索引

        rows.push(this);
    };

    (function () {

        this.item_start = 0;    //开始子项索引
        this.item_end = 0;      //结束子项索引

        this.indent = 0;    //缩进
        this.width = 0;     //行宽

    }).call(text_row.prototype);


    //排列
    prototype.layout = function () {

        var rows = this.__rows;

        if (this.__dirty)
        {
            if (rows.length > 0)
            {
                rows.clear();
            }

            if (!this.__lines) //需要重新测量
            {
                split_text.call(this, 0);
            }

            this.__dirty = false;
        }
        else if (!this.__lines.dirty) //没有未测量的物理行则退出
        {
            return;
        }

        (this.multiline ? (this.wrap ? layout_wrap : layout_rows) : layout_row).call(this, rows); //排列
    };


    //排列单行文字 排列逻辑行
    function layout_row(rows) {

        var row = rows[0],              //逻辑行
            align,
            cache;

        if (!row || this.__lines.dirty)
        {
            row = new text_row(rows, measure_text.call(this));
            row.width = row.line.width;
        }

        rows.offset = 0;
        row.indent = this.indent + this.offset;

        if (align = this.textAlign)
        {
            if (cache = this.__width - row.width)
            {
                switch (align.horizontal)
                {
                    case "center":
                        row.indent += cache >> 1;
                        break;

                    case "right":
                        row.indent += cache;
                        break;
                }
            }

            if (cache = this.__height - this.__font.__font_height)
            {
                switch (align.vertical)
                {
                    case "middle":
                        rows.offset += cache >> 1;
                        break;

                    case "bottom":
                        rows.offset += cache;
                        break;
                }
            }
        }

        this.__scrollWidth = row.offset + row.width;
        this.__scrollHeight = rows.space + this.__lineHeight;
    };

    //排列多行文字
    function layout_rows(rows) {

        var lines = this.__lines,     //物理行集合
            wslineHeight = this.__lineHeight, //行高
            count = Math.ceil((this.scrollTop + this.__height) / lineHeight);

        while (lines.dirty && rows.length < count)
        {
            var row = new text_row(rows, measure_text.call(this));
            row.indent = rows.length === 1 ? this.indent + this.offset : this.indent;
        }

        this.__scrollWidth = lines.maxWidth;
        this.__scrollHeight = lines.length * lineHeight;
    };

    var regex = /\w/;

    //排列自动换行
    function layout_wrap(rows) {

        var text = this.__text,
            lines = this.__lines,     //物理行集合
            lineHeight = this.__lineHeight, //行高
            indent = this.indent,
            offset = this.offset,
            maxWidth = this.__width,
            count = Math.ceil((this.scrollTop + this.__height) / lineHeight);

        if (maxWidth < lineHeight)
        {
            maxWidth = lineHeight;
        }

        while (lines.dirty && rows.length < count)
        {
            var line = measure_text.call(this),                 //物理行
                start = 0,
                length = line.length;


            while (start < length)
            {
                var row = new text_row(rows, line),    //逻辑行
                    width = start === 0 ? maxWidth - indent - (rows.length === 0 ? offset : 0) : maxWidth,
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

                if (end === start)
                {
                    while (regex.test(text[line.start + end]))
                    {
                        end++;
                    }
                }

                row.item_start = start;
                row.item_end = end;
                row.indent = start === 0 ? indent + offset : indent;

                start = end + 1;
            }
        }

        this.__scrollWidth = maxWidth;
        this.__scrollHeight = Math.ceil(rows.length * lineHeight * text.length / lines.count);
    };




    //获取指定坐标的文字信息
    prototype.hitTest = function (x, y) {

        var lineHeight = this.__lineHeight,
            rows = this.__rows,
            row,
            index,
            line,
            item;

        x += this.scrollLeft;
        y += this.scrollTop + rows.offset;

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

        row = rows[index];
        line = row.line;
        item = line.binary_between(Math.max(x - row.indent, 0) + 2 + line[row.item_start], row.item_start, row.item_end);

        return {

            x: row.indent + line[item] - line[row.item_start],
            y: rows.offset + index * lineHeight,
            index: line.start + (line.length === item + 1 ? item - 1 : item)
        };
    };




    //重新测量
    prototype.invalidate = function (measure) {

        if (measure)
        {
            this.__lines = null;
        }

        this.__dirty = true;
    };


    //绘制文字(仅绘制可视范围以提升性能)
    prototype.paint = function (context, windowX, windowY, color) {

        var text = this.__text;

        //无文字时不处理
        if (text)
        {
            var lineHeight = this.__lineHeight,
                rows = this.__rows,       //逻辑行集合
                row_start = 0,              //起始可视行
                row_end = rows.length,      //终止可视行
                width = this.__width,
                selectionStart = this.__selectionStart,   //开始选中文字索引
                selectionEnd = this.__selectionEnd,       //终止选中文字索引
                selection = selectionStart !== selectionEnd, //是否有选中文字
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

                if ((cache = Math.ceil((cache + this.__height) / lineHeight)) < row_end)
                {
                    row_end = cache;
                }
            }

            context.fillStyle = color || "black";
            context.font = this.__font.__value;

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
                var x = windowX + row.indent - line[item_start],
                    y = windowY + i * lineHeight + rows.offset;

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
                    if (context.fillStyle = selection.backgroundColor)
                    {
                        context.fillRect(line[selection_start] + x, y, line[selection_end] - line[selection_start], lineHeight);
                    }

                    //绘制选中文字
                    context.fillStyle = selection.color;

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



})(flyingon);

