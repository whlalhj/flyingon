
//文字单元
(function (flyingon) {



    var prototype = (flyingon.TextElement = function (text) {

        this.text = text;

    }).prototype = flyingon.__pseudo_array__();


    //文本内容
    prototype.text = null;

    //起始文本索引
    prototype.index = 0;

    //x偏移
    prototype.offsetX = 0;




    function initialize(target, font) {

        var result = target.__cache__ = [0],
            text = target.text,
            cache = font.__cache__,
            width = 0,
            value;

        //测量单词中每一个字符占用的宽度
        for (var i = 0, length = text.length; i < length; i++)
        {
            value = cache[value = text[i]] || font.measureText(value);

            target.push(value);
            cache.push(width += value);
        }

        return result;
    };


    //获取指定位置的字符索引
    prototype.charAt = function (font, offsetX) {

        return this.unit ? Math.round(offsetX / this.unit) : (this.__cache__ || initialize(this, font)).binary_between(offsetX);
    };


    //获取指定字符索引的相对位置
    prototype.position = function (font, text_index) {

        return this.unit ? text_index * this.unit : (this.__cache__ || initialize(this, font))[text_index];
    };



})(flyingon);


