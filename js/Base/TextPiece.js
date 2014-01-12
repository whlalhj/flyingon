//文本行
(function (flyingon) {


    var prototype = (flyingon.TextPiece = function (font, text) {

        this.font = font;
        this.text = text;
        this.height = font.lineHeight;

    }).prototype = [];



    //字体
    prototype.font = null;

    //文本内容
    prototype.text = null;

    //文本行总宽度
    prototype.width = 0;

    //文本行总高度
    prototype.height = 0;



    function initialize() {

        var value_1 = 0,
            value_2 = 0,
            cache_1 = this["x:cache:1"] = [0],
            cache_2 = this["x:cache:2"] = [0];

        for (var i = 0, length = this.length - 1; i < length; i++)
        {
            var snippet = this[i];

            cache_1.push(value_1 += snippet.text.length);     //文本索引
            cache_2.push(value_2 += snippet.width);           //位置
        }

        return this;
    };





    //unicode码: \u2e80-\ufffy:东方字符 \u00c0-\u00ff 拉丁字母1  \u0400-\u04ff 西里尔字母
    //[\u2e80-\uffff]+                      汉字类 按等宽字符 注:可能对其它字符处理不好
    //[\w\u00c0-\u00ff\u0400-\u04ff]+       类英文单词类 按英文单词的方式处理
    //[^\w\u00c0-\u00ff\u0400-\u04ff]       其它符号类 按单个字符的方式处理
    var regex_measure = /[\u2e80-\uffff]+|[^\w\r\u00c0-\u00ff\u0400-\u04ff]|[\w\u00c0-\u00ff\u0400-\u04ff]+/g;


    //测量文字 以提升canvas的measureText方法性能较差的问题
    //请尽量使用相同的字体对象以获得较好的性能
    //需注意此方法对内存占用有一定的影响 在IE下可能存在一定的误差(IE的字体渲染有问题:分段测量值的和<>直接测量值???)
    prototype.measureText = function () {

        var font = this.font,
            cache = font["x:cache"],
            context = font["x:context"],
            chinese = cache["汉"],
            values = this.text.match(regex_measure) || [""],
            x = 0;


        for (var i = 0, length = values.length; i < length; i++)
        {
            var text = values[i],
                snippet = new flyingon.TextSnippet(font, text);


            if (text[0] > "\u2e80") //东方字符类
            {
                snippet.width = text.length * chinese;
                snippet.unit = chinese; //每个字符的宽度(汉字)
            }
            else //类英文单词及其它符号类
            {
                snippet.width = cache[text] || (cache[text] = context.measureText(text).width); //总宽
            }


            this.push(snippet);

            x += snippet.width;
        }


        this.width = x;
    };




    //获取指定索引的测量信息
    prototype.find = function (columnIndex) {

        if (columnIndex >= this.text.length)
        {
            return {

                snippetIndex: this.length - 1,
                charIndex: this[this.length - 1].text.length,
                columnIndex: this.text.length,
                x: this.width
            };
        }


        columnIndex < 0 && (columnIndex = 0);


        var index = (this["x:cache:1"] || initialize.call(this)["x:cache:1"]).binaryBetween(columnIndex),
            snippet = this[index],
            charIndex = columnIndex - this["x:cache:1"][index];


        return {

            snippetIndex: index,
            charIndex: charIndex,
            columnIndex: columnIndex,
            x: this["x:cache:2"][index] + snippet.position(charIndex)
        };
    };


    //查找指定位置的测量信息
    prototype.findAt = function (x) {

        var index = (this["x:cache:2"] || initialize.call(this)["x:cache:2"]).binaryBetween(x),
            snippet = this[index],
            charIndex,
            x;


        if (x >= this.width) //末尾
        {
            charIndex = snippet.text.length;
            x = this.width;
        }
        else
        {
            charIndex = snippet.charAt(x - this["x:cache:2"][index]);
            x = this["x:cache:2"][index] + snippet.position(charIndex);
        }


        return {

            snippetIndex: index,
            charIndex: charIndex,
            columnIndex: this["x:cache:1"][index] + charIndex,
            x: x
        };
    };



})(flyingon);

