

//文本测量
(function (flyingon) {



    var prototype = (flyingon.TextMetrics = function () {

    }).prototype = flyingon.__pseudo_array__();



    //字体
    prototype.font = null;

    //文本
    prototype.text = null;

    //初始x
    prototype.x = 0;

    //初始y
    prototype.y = 0;

    //最大宽度
    prototype.width = 0;

    //最大高度
    prototype.height = 0;

    //是否多行
    prototype.multiline = false;


    //开始选中位置
    prototype.selectionStart = 0;

    //结束选中位置
    prototype.selectionEnd = 0;

    //选中文本
    prototype.selectedText = "";






    function initialize() {

        var cache1 = this.__cache1__ = [0],
            cache2 = this.__cache2__ = [0];

        for (var i = 0, length = this.length - 1; i < length; i++)
        {
            var line0 = this[i],
                line1 = this[i + 1];

            cache1.push(line1.index = line0.index + line0.text.length); //文本索引
            cache2.push(line1.y = line0.y + line0.height);              //位置
        }

        return this;
    };




    prototype.measureText = function (font, text, multiline) {

        this.font = font;
        this.text = text;
        this.multiline = multiline;


        if (this.length > 0)
        {
            this.length = 0;
            this.width = 0;
            this.height = 0;
        }


        if (text)
        {
            var values = multiline ? text.split(/\r?\n/g) : [text.replace(/[\r\n]?/g, "")];

            for (var i = 0, length = values.length; i < length; i++)
            {
                var line = new flyingon.TextLine(font, values[i]);

                line.measureText();
                this.push(line);

                if (this.width < line.width)
                {
                    this.width = line.width; //最大宽度
                }

                this.height += line.height;
            }
        }
    };



    //获取指定索引的行信息
    prototype.lineBy = function (textIndex) {

        if (textIndex < 0)
        {
            textIndex = 0;
        }

        return this[(this.__cache1__ || initialize.call(this).__cache1__).binary_between(textIndex)];
    };

    //查找指定位置的行信息
    prototype.lineAt = function (y) {

        return this[(this.__cache2__ || initialize.call(this).__cache2__).binary_between(y)];
    };

    //获取指定索引的字符信息
    prototype.charBy = function (textIndex) {

        if (textIndex < 0)
        {
            textIndex = 0;
        }

        var index = (this.__cache1__ || initialize.call(this).__cache1__).binary_between(textIndex),
            start = this.__cache1__[index],
            result = this[index].charBy(textIndex - start);

        result.lineIndex = index;
        result.textIndex = start + result.columnIndex;

        return result;
    };

    //查找指定位置的字符信息
    prototype.charAt = function (x, y) {

        var index = (this.__cache2__ || initialize.call(this).__cache2__).binary_between(y),
            result = this[index].charAt(x);

        result.lineIndex = index;
        result.textIndex = this.__cache1__[index] + result.columnIndex;

        return result;
    };



    function selectionEnd() {

        if ((this.selectionEnd = this.end.textIndex) < (this.selectionStart = (this.start = this.__start__).textIndex))
        {
            this.selectionStart = (this.start = this.end).textIndex;
            this.selectionEnd = (this.end = this.__start__).textIndex;
        }

        this.selectedText = this.text.substring(this.selectionStart, this.selectionEnd);
    };



    //移动至指定坐标
    prototype.moveAt = function (x, y) {

        this.start = this.end = this.caret = this.__start__ = this.charAt(x, y);
        this.selectionStart = this.selectionEnd = this.start.textIndex;
        this.selectedText = "";
    };


    //选择至指定坐标
    prototype.selectionAt = function (x, y) {

        this.end = this.caret = this.charAt(x, y);
        selectionEnd.call(this);
    };


    prototype.moveTo = function (textIndex) {

        this.start = this.end = this.caret = this.__start__ = this.charBy(textIndex);
        this.selectionStart = this.selectionEnd = this.start.textIndex;
        this.selectedText = "";
    };


    prototype.selectionTo = function (textIndex) {

        this.end = this.caret = this.charBy(textIndex);
        selectionEnd.call(this);
    };


    prototype.replace = function (text) {

        var start = this.start,
            end = this.end,
            textIndex = start.textIndex + text.length,
            index1 = start.lineIndex,
            index2 = end.lineIndex;


        text = this[index1].text.substring(0, start.columnIndex) + (text || "") + this[index2].text.substring(end.columnIndex);

        start = index1 > 0 ? this[index1 - 1].text : "";
        end = index2 + 1 < this.length ? this[index2 + 1].text : "";


        var line = new flyingon.TextLine(this.font, text);
        line.measureText();

        this.splice(index1, index2 - index1 + 1, line);

        this.text = start + text + end;

        this.moveTo(textIndex);
    };


    prototype.remove = function (length) {

        if (!this.selectedText)
        {
            this.selectionTo(this.selectionEnd + length); //未选择
        }

        this.replace("");
    };



})(flyingon);


