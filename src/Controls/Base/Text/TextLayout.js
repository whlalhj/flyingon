//文字布局
(function (flyingon) {



    //测量
    function measure(boxModel) {

        var key = (this.writingMode = this.target.writingMode.split("-"))[0];

        this.font = target.__font__ || flyingon.__fn_style_value__(target, "font");
        this.letterSpacing = target.letterSpacing || 0;
        this.wordSpacing = target.wordSpacing || 0;

        (this.layout = this[key]).layout.call(this, boxModel);
    };


    //测量每个文字的宽度
    function measureText(start, end) {

        var text = this.text,
            line = new text_line(start = start || 0, end = end || text.length),
            storage = this.font.__storage__,
            letterSpacing = this.letterSpacing,
            wordSpacing = this.wordSpacing,
            width = 0;

        storage[" "] = storage.space + this.wordSpacing;

        for (var i = start; i < end; i++)
        {
            line.push(width);
            width += (storage[text[i]] || (storage[text[i]] = storage.context.measureText(text[i]).width)) + letterSpacing;
        }

        line.push(line.width = width - letterSpacing);

        return line;
    };






    //单行文字布局
    (function () {


        this.measure = measure;


        //从左到右排列
        (function () {

            this.layout = function (boxModel) {

                var line = measureText.call(this);

                this.target.align.position(line, boxModel.clientRect);

                this.splice(0, this.length);
                this.push(line);
            };

            this.paint = function (context, boxModel) {


            };

            this.hitTest = function (x, y) {


            };

        }).call(this.lr = {});


        //从右到左排列
        (function () {

            this.layout = this.lr.layout;

            this.paint = function (context, boxModel) {


            };

        }).call(this.rl = {});


        //从上到下
        (function () {

            this.layout = function (boxModel) {


            };

            this.paint = function (context, boxModel) {


            };

        }).call(this.tb = {});


        //从下到上
        (function () {

            this.layout = function (boxModel) {


            };

            this.paint = function (context, boxModel) {


            };

        }).call(this.bt = {});


    }).call((flyingon.single_text_layout = function (target, text) {

        this.target = target;
        this.text = text;

    }).prototype = flyingon.__pseudo_array__());







    //文本行
    function text_line(start, end) {

        this.start = start;
        this.end = end;
    };

    (function () {

        this.x = 0; //起始x坐标
        this.y = 0; //起始y坐标

    }).call(text_line.prototype = flyingon.__pseudo_array__());




    //多行文字布局
    (function () {


        //调用基础服务
        base_text.call(this);



    }).call((flyingon.multi_text_layout = function (target, text) {

        this.target = target;
        this.text = text;

    }).prototype);





    //内嵌文字布局
    (function () {


        //调用基础服务
        base_text.call(this);




    }).call((flyingon.inline_text_layout = function (target, text) {

        this.target = target;
        this.text = text;

    }).prototype);



})(flyingon);