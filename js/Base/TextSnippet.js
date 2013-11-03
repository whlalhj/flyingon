
//文字片段
(function ($) {



    $.TextSnippet = function (font, text) {

        this.font = font;
        this.text = text;
    };



    var p = $.TextSnippet.prototype = [];


    //字体
    p.font = null;

    //文本内容
    p.text = null;

    //文本内容
    p.text = null;

    //文字段宽度
    p.width = 0;


    //测量单词中每一个字符占用的宽度
    function measureText(font, text) {

        if (!text)
        {
            return [];
        }


        var result = [],
            cache = font["x:cache"],
            context = font["x:context"],

            i = 0,
            length = text.length;


        while (i < length)
        {
            var char = text[i++];
            result.push(cache[char] || (cache[char] = context.measureText(char).width));
        }

        return result;
    };


    function initialize() {

        var value = 0,
            chars = this.chars = measureText(this.font, this.text),
            cache = this.cache = [0],

            i = 0,
            length = chars.length;


        while (i < length)
        {
            cache.push(value += chars[i++]);
        }

        return cache;
    };




    //获取指定位置的字符索引
    p.charAt = function (x) {

        if (this.unit) //等宽字体
        {
            return Math.round(x / this.unit);
        }

        return (this.cache || initialize.call(this)).binaryBetween(x);
    };


    //获取指定字符索引的相对位置
    p.position = function (charIndex) {

        if (this.unit) //等宽字体
        {
            return charIndex * this.unit;
        }

        return (this.cache || initialize.call(this))[charIndex];
    };



})(flyingon);


