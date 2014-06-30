
//文字扩展
(function (flyingon) {



    //缓存字体集
    var fonts = {};


    //初始化字体
    function initialize_font(css_font, font_size, lineHeight) {

        var font = fonts[css_font] = Object.create(null),
            context = font.context = document.createElement("canvas").getContext("2d"),
            char = String.fromCharCode,
            cache;

        //初始化字体
        font.size = font_size;
        font.lineHeight = lineHeight;
        font.css_font = context.font = css_font;

        //缓存字体宽度
        font.chinese = context.measureText("汉").width;            //缓存汉字宽度(汉字等宽)以加快测量速度
        font.space = font[" "] = context.measureText(" ").width;   //缓存空格
        font._ = context.measureText("_").width;                   //缓存下划线

        //缓存数字
        for (var i = 0; i <= 9; i++)
        {
            font[cache = "" + i] = context.measureText(cache).width;
        }

        //缓存大写字母
        for (var i = 65; i <= 90; i++)
        {
            font[cache = char(i)] = context.measureText(cache).width;
        }

        //缓存小写字母
        for (var i = 97; i <= 122; i++)
        {
            font[cache = char(i)] = context.measureText(cache).width;
        }

        return font;
    };





    //水平文字
    var horizontal_lines = flyingon.function_extend(function () {


        //注1: 缓存测量结果以提升canvas的measureText方法性能较差的问题
        //注2: 需注意此方法对内存占用有一定的影响 在IE下可能存在一定的误差(IE的字体渲染有问题:分段测量值的和<>直接测量值???)

        //unicode码: \u2e80-\uffffn:东方字符 \u00c0-\u00ff 拉丁字母  \u0400-\u04ff 西里尔字母
        //[\u2e80-\uffff]+  东方字符  按等宽字符 注:可能对某些语言字符处理不准确
        // +                空格      特殊处理
        //[\w\W]+           其它字符  按英文单词的方式处理(注:正则表达式"."匹配所有字符在某些情况下可能有问题,此处用"\w\W代替")


        //测量水平文字
        this.measure = function (line, text) {

            var font = this.font,
                letter_space = this.letter_space,
                x = this.text_indent,
                length = text.length,
                letter;

            for (var i = 0; i < length; i++)
            {
                line[i] = x;
                letter = text[i];

                if (letter >= "\u2e80")
                {
                    x += font.chinese;
                }
                else if (letter === " ")
                {
                    x += font.space + this.word_space;
                }
                else
                {
                    x += font[letter = text[i]] || (font[letter] = font.context.measureText(letter).width);
                }

                x += letter_space;
            }

            line.text = text;
            line.length = length;
            line.width = x;
        };


        var binary_between = flyingon.binary_between;


        this.paint = function (target, context, line) {

            var text = line.text,
                x = target.__visible_x,
                y,
                start = x <= 0 ? 0 : binary_between(line, x),
                end = (x += target.clientWidth) >= line.width ? line.length : binary_between(line, x) + 1;

            x = line.x || 0;
            y = line.y || 0;

            if (this.rtl)
            {

            }
            else
            {
                for (var i = start; i < end; i++)
                {
                    context.fillText(text[i], x + line[i], y);
                }
            }
        };


        return this;


    });


    //水平折行文字
    var horizontal_textWrap = flyingon.function_extend(function () {


        //注1: 缓存测量结果以提升canvas的measureText方法性能较差的问题
        //注2: 需注意此方法对内存占用有一定的影响 在IE下可能存在一定的误差(IE的字体渲染有问题:分段测量值的和<>直接测量值???)

        //unicode码: \u2e80-\uffffn:东方字符 \u00c0-\u00ff 拉丁字母  \u0400-\u04ff 西里尔字母
        //[\u2e80-\uffff]+  东方字符  按等宽字符 注:可能对某些语言字符处理不准确
        // +                空格      特殊处理
        //[\w\W]+           其它字符  按英文单词的方式处理(注:正则表达式"."匹配所有字符在某些情况下可能有问题,此处用"\w\W代替")
        var regex_split = /[\u2e80-\uffff]+| +|\w+|\W+/g;


        //测量水平文字
        this.measure = function (line, font, text, word_space) {

            var tokens = text.match(regex_split),
                width = 0,          //行宽
                text_index = 0,     //文字索引
                item_index = 0,     //子项索引
                item,               //当前项
                length,
                unit,
                cache;

            line.length = 0;

            for (var i = 0, _ = tokens.length; i < _; i++)
            {
                length = (text = tokens[i]).length;

                if ((cache = text[0]) >= "\u2e80") //东方字符
                {
                    unit = font.chinese;
                    item = { size: length * unit, unit: unit };
                }
                else if (cache === " ") //空格
                {
                    unit = font.space + word_space;
                    item = { size: length * unit, unit: unit };
                }
                else //按英语单词处理
                {
                    if (!(cache = font[text]))
                    {
                        cache = font[text] = {};

                        for (var j = 0; j < length; j++)
                        {
                            cache.size += (cache[j] = font[text[j]] || (font[text[j]] = font.context.measureText(text[j]).width));
                        }
                    }

                    item = { size: cache.size, unit: 0, items: cache }; //unit:0 标记非等宽字符(每个字符宽度由子项标记出,自动换行时不可折分)
                }

                line[item_index++] = item;

                item.index = index;
                item.length = length;
                item.text = text;

                width += item.size;
                text_index += length;
            }

            line.size = width;
        };


        this.paint = function (target, context, line) {

        };


        return this;


    });



    //竖直文字
    var vertical_lines = flyingon.function_extend(function () {


        //测量竖直文字(所有文字一样高,忽略wordSpacing,中国古文风格)
        this.measure_text = function (line, font, text, word_space) {

            var length = text.length,
                unit = font.size;

            line.length = 1;
            line[0] = {

                index: 0,
                length: length,
                text: text,
                size: length * unit,
                unit: unit
            };
        };


        this.paint = function (target, context, line) {

        };


        return this;


    });


    //竖直折行文字
    var vertical_textWrap = flyingon.function_extend(function () {


        //测量竖直文字(所有文字一样高,忽略wordSpacing,中国古文风格)
        this.measure_text = function (line, font, text, word_space) {

            var length = text.length,
                unit = font.size;

            line.length = 1;
            line[0] = {

                index: 0,
                length: length,
                text: text,
                size: length * unit,
                unit: unit
            };
        };


        this.paint = function (target, context, line) {

        };


        return this;


    });




    //文字扩展
    function text_extender() {



        //禁止访问子控件
        this.defineProperty("children", function () {

            return null;
        });



        //文字内容
        this.defineProperty("text", null, {

            attributes: "rearrange",
            change: "if (this.__text_lines) tihs.__text_lines = null;"
        });


        //是否竖直文字
        this.defineProperty("vertical", false, "previous-attributes");



        //文本被选中事件
        this.defineEvent("select");

        //取消文本选中事件
        this.defineEvent("unselect");



        //开始选中位置
        this.defineProperty("selectionStart", 0, {

            attributes: "invalidate",
            minValue: 0,
            maxValue: "fields.text.length"
        });

        //结束选中位置
        this.defineProperty("selectionEnd", 0, "previous-attributes");

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


        this.__fn_text_lines = function () {

            var lines,
                css_font = this.__css_font || this.__fn_css_font();

            if (this.vertical = this.vertical)
            {
                lines = new (this.textWrap ? vertical_textWrap : vertical_lines)();
                lines.vertical = true;
            }
            else
            {
                lines = new (this.textWrap ? horizontal_textWrap : horizontal_lines)();
            }

            lines.font = fonts[css_font] || initialize_font(css_font, this.__font_size, this.__line_height);
            lines.text_indent = this.textIndent;
            lines.word_space = this.wordSpacing;
            lines.letter_space = this.letterSpacing;

            return this.__text_lines = lines;
        };


    };



    //单行文本控件基类
    flyingon.defineClass("TextControl", flyingon.ScrollableControl, function (Class, base, flyingon) {



        text_extender.call(this);


        //重载排列方法
        this.__fn_arrange = function () {

            var line = this.__text_lines,
                text;

            if (!line && (text = this.text))
            {
                line = this.__fn_text_lines();
                line.measure(line, text);

                line.rtl = this.direction === "rtl";

                if (line.vertical)
                {

                }
                else
                {
                    this.contentWidth = line.size;
                    this.contentHeight = this.__font_size;
                }
            }

            this.__arrange_dirty = false;
        };


        this.paint = function (painter) {

            var context = painter.context,
                line = this.__text_lines;

            if (line)
            {
                painter.fillStyle = this.color;

                context.textBaseline = "top";
                context.font = line.font.css_font;

                line.paint(this, context, line);
            }
        };


    });




    //文字行
    function text_lines(text) {

        var result = {},
            start = 0,
            length = 0,
            index;

        while ((index = text.indexOf("\n", start)) > 0)
        {
            result[length++] = { start: start, end: index };
            start = index + 1;
        }

        if (start < text.length)
        {
            result[length++] = { start: start, end: text.length };
        }

        result.length = length;
    };



    //内嵌文字
    //内嵌文字在无法完全显示时可自动伸展至父控件容器区或指定的显示区域
    flyingon.defineClass("Text", flyingon.Control, function (Class, base, flyingon) {


        text_extender.call(this);


    });




})(flyingon);