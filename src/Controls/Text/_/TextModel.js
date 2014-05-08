
(function (flyingon) {



    var rows_type = {},

        row_type = {},

        defineClass = function (fn, base) {

            var Class,
                prototype = base ? Object.create(base) : new flyingon.__pseudo_array__();

            fn.call(prototype, Class);

            Class = Class.create || function () { };
            Class.prototype = prototype;

            return Class;
        };





    //文本绘制器
    flyingon.TextPainter = defineClass(function (Class) {


        //当前文字布局
        this.layout = null;

        //渲染范围
        this.clientRect = null;



        Class.create = function (ownerControl, text) {

            var lines = this.lines = new text_lines();

            this.ownerControl = ownerControl;

            if (this.text = text)
            {
                var length = text.length,
                    start = 0,
                    end;

                if (multiline) //多行时按行截断
                {
                    while ((end = text.indexOf("\n", start)) > 0)
                    {
                        new text_line(lines, start, end);
                        start = end + 1;
                    }

                    if (start < length)
                    {
                        new text_line(lines, start, length);
                    }
                }
                else
                {
                    new text_line(lines, 0, length);
                }
            }
        };


        //测量
        this.measure = function (clientRect) {

            var ownerControl = this.ownerControl,
                textWrap = ownerControl.textWrap;

            if (!this.clientRect || this.clientRect !== "" + clientRect)
            {
                this.clientRect = clientRect;

                if (textWrap)
                {
                    this.rows = null;
                }
            }

            if (!this.rows)
            {

            }
        };





        this.invalidate = function (measure) {

            if (measure)
            {
                this.lines.dirty = true; //需要重新测量物理行
            }

            this.rows = null;
        };

    });




    //文字布局基础
    var text_layout = (function () {


        //行集构造函数
        this.rows_fn = rows_type.tb;


        //切换书写模式
        this.writingMode = function (value) {

            //行构造函数
            this.row_fn = row_type.lr;

        };


        return this;


    }).call({});


    //单行文字布局
    var row_layout = defineClass(function () {




    }, text_layout);


    //多行文字模型
    var rows_layout = defineClass(function () {



    }, text_layout);


    //折行文字布局
    var wrap_layout = defineClass(function () {


    }, rows_layout.prototype);


    //内嵌文字布局
    var inline_layout = defineClass(function () {


    }, wrap_layout.prototype);




    //物理行集合
    var text_lines = defineClass(function () {


        //测量过的索引
        this.index = 0;

        //已测量的最大行大小
        this.max_size = 0;

        //需要测量
        this.dirty = true;



        //获取已测量的文字数
        this.measure_length = function () {

            return this.index > 0 ? this[this.index - 1].end : 0;
        };


        function measure_end(line, size) {

            line.push(line.size = size);  //行宽

            if (width > this.max_size)
            {
                this.max_size = size;     //记录最大行宽
            }

            if (this.index >= this.length)
            {
                this.dirty = false;        //标记已测量完
            }

            return line;
        };


        this.measureText = function (font, text, letterSpacing, wordSpacing) {

            var line = this[this.index++],
                storage = font.__storage__,
                chinese = storage.chinese,
                letter,
                width = 0;          //行宽

            //每次处理一个字符效率差一些,但处理简单且不会有测量误差
            //使用局部测量及绘制以提升效率
            for (var i = line.start, end = line.end; i < end; i++)
            {
                line.push(width);
                width += (letter = text[i]) >= "\u2e80" ? chinese : storage[letter] || (storage[letter] = storage.context.measureText(letter).width);

                if (letterSpacing)
                {
                    width += letterSpacing;
                }

                if (wordSpacing && letter === " ")
                {
                    width += wordSpacing;
                }
            }

            return measure_end.call(this, line, width);
        };


    });



    //物理行
    var text_line = defineClass(function (Class) {


        Class.create = function (lines, start, end) {

            this.start = start;
            this.end = end;
            lines.push(this);
        };

    });





    //从上到下
    rows_type.tb = defineClass(function () {

        this.paint = function () {

        };

    });


    //从下到上
    rows_type.bt = defineClass(function () {



    });


    //从左到右
    rows_type.lr = defineClass(function () {



    });


    //从右到左
    rows_type.rl = defineClass(function () {



    });




    //从左到右
    row_type.lr = defineClass(function (Class) {



    });


    //从右到左
    row_type.rl = defineClass(function (Class) {



    });


    //从上到下
    row_type.tb = defineClass(function (Class) {



    });


    //从下到上
    row_type.bt = defineClass(function (Class) {



    });




})(flyingon);