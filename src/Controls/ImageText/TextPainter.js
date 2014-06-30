
//文字绘制器
flyingon.TextPainter = flyingon.function_extend(function (target) {

    this.target = target;

}, function (flyingon) {



    var fonts = {},                 //缓存字体集
        horizontal_painter = {},    //水平文字绘制器
        vertical_painter = {};      //竖直文字绘制器



    //初始化字体
    function initialize_font(target) {

        var font = Object.create(null),
            context = font.$context = document.createElement("canvas").getContext("2d"),
            char = String.fromCharCode,
            css_font = target.font,
            cache;

        context.font = css_font;

        font.$size = target.fontSize;
        font.$space = context.measureText(" ").width;    //缓存空格
        font.$chinese = context.measureText("汉").width; //缓存汉字宽度(汉字等宽)以加快测量速度
        font._ = context.measureText("_").width;         //缓存下划线

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

        return fonts[css_font] = font;
    };



    //水平文字
    (function () {


        //注1: 缓存测量结果以提升canvas的measureText方法性能较差的问题
        //注2: 需注意此方法对内存占用有一定的影响 在IE下可能存在一定的误差(IE的字体渲染有问题:分段测量值的和<>直接测量值???)

        //unicode码: \u2e80-\uffffn:东方字符 \u00c0-\u00ff 拉丁字母  \u0400-\u04ff 西里尔字母
        //[\u2e80-\uffff]+  东方字符  按等宽字符 注:可能对某些语言字符处理不准确
        // +                空格      特殊处理
        //[\w\W]+           其它字符  按英文单词的方式处理(注:正则表达式"."匹配所有字符在某些情况下可能有问题,此处用"\w\W代替")
        var regex_split = /[\u2e80-\uffff]+| +|\w+|\W+/g;


        //测量文字
        this.measure_text = function (line, font, text) {

            var tokens = (line.text || text.substring(line.start, line.end)).match(regex_split),
                text,
                index = 0,
                length,
                size = 0, //行宽
                unit,
                item_index = 0, //子项索引
                cache;

            for (var i = 0, _ = tokens.length; i < _; i++)
            {
                length = (text = tokens[i]).length;

                if ((cache = text[0]) >= "\u2e80") //东方字符
                {
                    unit = font.$chinese;
                }
                else if (cache === " ") //空格
                {
                    unit = font.$space + this.word_space;
                }
                else //按英语单词处理
                {
                    if ((cache = font[text]) === undefined)
                    {
                        cache = { index: index, length: length, size: 0, unit: 0 }; //unit:0 标记非等宽字符(每个字符宽度由子项标记出,自动换行时不可折分)

                        for (var j = 0; j < length; j++)
                        {
                            cache.size += (cache[j] = font[text[j]] || (font[text[j]] = font.$context.measureText(text[j]).width));
                        }
                    }

                    index += length;
                    size += cache.size;
                    line[item_index++] = cache;

                    continue;
                }

                size += length * unit;
                line[item_index++] = { index: index, length: length, size: size, unit: unit };

                index += length;
            }

            //记录行高及最大行高
            if ((line.size = (size += length * this.letter_space)) > this.max_size)
            {
                this.max_size = size;
            }

            line.length = item_index;
            return line;
        };


        //排列
        this.arrange = function () {

        };


        //从左到右绘制
        this.paint_ltr = this.paint = function () {

        };


        //从右到左绘制
        this.paint_rtl = function () {

        };


    }).call(horizontal_painter);



    //竖直文字(所有文字一样高,忽略wordSpacing,中国古文风格)
    (function () {


        //测量文字
        this.measure_text = function (line, font, text) {

            var length = line.end - line.start,
                unit = font.$size,
                size = length * unit;

            //记录行高及最大行高
            if ((line.size = (size += length * this.letter_space)) > this.max_size)
            {
                this.max_size = size;
            }

            line.length = 1;
            line[0] = { size: size, unit: unit, index: 0, length: length };

            return line;
        };


        //排列
        this.arrange = function () {

        };


        //从左到右绘制
        this.paint_ltr = this.paint = function () {

        };


        //从右到左绘制
        this.paint_rtl = function () {

        };


    }).call(vertical_painter);



    //文字行
    var text_lines = flyingon.function_extend(function (text, multiline) {

        if (multiline) //多行时按换行符截断
        {
            var start = 0,
                length = 0,
                index;

            while ((index = text.indexOf("\n", start)) > 0)
            {
                this[length++] = { start: start, end: index };
                start = index + 1;
            }

            if (start < text.length)
            {
                this[length++] = { start: start, end: text.length };
            }

            this.length = length;
        }
        else
        {
            this[0] = { text: text, start: start, end: text.length };
        }

    }, function () {


        //总行数
        this.length = 1;

        //字符间距
        this.letter_space = 0;

        //词间距
        this.word_space = 0;

        //已测量的最大大小
        this.max_size = 0;

    });





    //已排列的行数
    this.length = 0;



    //可视组件扩展
    flyingon.visual_extender.call(this);


    //重载测量方法
    this.measure = function (usable_width, usable_height) {


    };




    //绘制文字
    this.paint = function (painter, multiline) {

        var target = this.target,
            lines = this.lines,
            line_start = 0,
            line_end = 0,
            rows;

        //重新测量
        if (!lines)
        {
            lines = this.lines = new text_lines(target.text, multiline);

            lines.painter = target.vertical ? vertical_text : horizontal_text;
            lines.letter_space = target.letterSpacing;
            lines.word_space = target.wordSpacing;

            this.font = fonts[target.font] || initialize_font(target);
            this.rows = null;
        }

        //重新排列
        if (!(rows = this.rows))
        {
            rows = this.rows = [];
            rows.rtl = target.direction === "rtl";
            rows.text_indent = target.textIndent;
        }

        //找出要绘制的起始行
        //if (lines
    };



});

