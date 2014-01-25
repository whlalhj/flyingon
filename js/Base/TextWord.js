
//文本单词
(function (flyingon) {



    var prototype = (flyingon.TextWord = function (font, text) {

        this.font = font;
        this.text = text;

    }).prototype = [];



    //字体
    prototype.font = null;

    //文本内容
    prototype.text = null;

    //文字段宽度
    prototype.width = 0;

    //起始文本索引
    prototype.index = 0;

    //起始x坐标
    prototype.x = 0;



    //测量单词中每一个字符占用的宽度
    function measureText(font, text) {

        if (!text)
        {
            return [];
        }


        var result = [],
            cache = font["x:cache"],
            context = font["x:context"];


        for (var i = 0, length = text.length; i < length; i++)
        {
            var char = text[i];
            result.push(cache[char] || (cache[char] = context.measureText(char).width));
        }

        return result;
    };


    function initialize() {

        var value = 0,
            chars = this.chars = measureText(this.font, this.text),
            cache = this["x:cache"] = [0];


        for (var i = 0, length = chars.length; i < length; i++)
        {
            cache.push(value += chars[i]);
        }

        return cache;
    };




    //获取指定位置的字符索引
    prototype["char-at"] = function (x) {

        return this.unit ? Math.round(x / this.unit) : (this["x:cache"] || initialize.call(this)).binaryBetween(x);
    };


    //获取指定字符索引的相对位置
    prototype.position = function (charIndex) {

        return this.unit ? charIndex * this.unit : (this["x:cache"] || initialize.call(this))[charIndex];
    };



})(flyingon);


