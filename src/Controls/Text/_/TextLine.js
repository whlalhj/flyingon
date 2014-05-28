//文本行
(function (flyingon) {


    var prototype = (flyingon.TextLine = function (font, text) {

        this.font = font;
        this.text = text;
        this.height = font.height;

    }).prototype = flyingon.__pseudo_array();



    //字体
    prototype.font = null;

    //文本内容
    prototype.text = null;

    //起始文本索引
    prototype.index = 0;

    //起始y坐标
    prototype.y = 0;

    //文本行总宽度
    prototype.width = 0;

    //文本行总高度
    prototype.height = 0;



    function initialize() {

        var cache1 = this.__cache1 = [0],
            cache2 = this.__cache2 = [0];

        for (var i = 0, _ = this.length - 1; i < _; i++)
        {
            var word0 = this[i],
                word1 = this[i + 1];

            cache1.push(word1.index = word0.index + word0.text.length); //文本索引
            cache2.push(word1.x = word0.x + word0.width);               //位置
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
            cache = font.__cache,
            context = font.__context,
            chinese = cache["汉"],
            values = this.text.match(regex_measure) || [""],
            x = 0;


        for (var i = 0, _ = values.length; i < _; i++)
        {
            var text = values[i],
                word = new flyingon.TextWord(font, text);


            if (text[0] > "\u2e80") //东方字符类
            {
                word.width = text.length * chinese;
                word.unit = chinese; //每个字符的宽度(汉字)
            }
            else //类英文单词及其它符号类
            {
                word.width = cache[text] || (cache[text] = context.measureText(text).width); //总宽
            }


            this.push(word);

            x += word.width;
        }


        this.width = x;
    };




    //获取指定索引的文字信息
    prototype.charBy = function (columnIndex) {

        if (columnIndex >= this.text.length)
        {
            return {

                wordIndex: this.length - 1,
                charIndex: this[this.length - 1].text.length,
                columnIndex: this.text.length,
                x: this.width,
                y: this.y
            };
        }


        if (columnIndex < 0)
        {
            columnIndex = 0;
        }


        var index = (this.__cache1 || initialize.call(this).__cache1).binary_between(columnIndex),
            word = this[index],
            charIndex = columnIndex - this.__cache1[index];


        return {

            wordIndex: index,
            charIndex: charIndex,
            columnIndex: columnIndex,
            x: this.__cache2[index] + word.position(charIndex),
            y: this.y
        };
    };


    //查找指定位置的文字信息
    prototype.charAt = function (x) {

        var index = (this.__cache2 || initialize.call(this).__cache2).binary_between(x),
            word = this[index],
            charIndex,
            x;


        if (x >= this.width) //末尾
        {
            charIndex = word.text.length;
            x = this.width;
        }
        else
        {
            charIndex = word.charAt(x - this.__cache2[index]);
            x = this.__cache2[index] + word.position(charIndex);
        }


        return {

            wordIndex: index,
            charIndex: charIndex,
            columnIndex: this.__cache1[index] + charIndex,
            x: x,
            y: this.y
        };
    };



})(flyingon);

