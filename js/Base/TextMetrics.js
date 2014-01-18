

//文本测量
(function (flyingon) {



    var prototype = (flyingon.TextMetrics = function () {

    }).prototype = [];



    //字体
    prototype.font = null;

    //文本
    prototype.text = null;

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

        var value_1 = 0,
            value_2 = 0,
            cache_1 = this["x:cache-1"] = [0],
            cache_2 = this["x:cache-2"] = [0],
            length = this.length - 1;


        for (var i = 0; i < length; i++)
        {
            var line = this[i];

            cache_1.push(value_1 += line.text.length);     //文本索引
            cache_2.push(value_2 += line.height);          //位置
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
                var piece = new flyingon.TextPiece(font, values[i]);

                piece.measureText();
                this.push(piece);

                if (this.width < piece.width)
                {
                    this.width = piece.width; //最大宽度
                }

                this.height += piece.height;
            }
        }
    };







    //获取指定索引的字符信息
    prototype.find = function (textIndex) {

        if (textIndex < 0)
        {
            textIndex = 0;
        }

        var index = (this["x:cache-1"] || initialize.call(this)["x:cache-1"]).binaryBetween(textIndex),
            start = this["x:cache-1"][index],
            result = this[index].find(textIndex - start);

        result.pieceIndex = index;
        result.textIndex = start + result.columnIndex;

        return result;
    };


    //查找指定位置的字符信息
    prototype.findAt = function (x, y) {

        var index = (this["x:cache-2"] || initialize.call(this)["x:cache-2"]).binaryBetween(y),
            result = this[index].findAt(x);

        result.pieceIndex = index;
        result.textIndex = this["x:cache-1"][index] + result.columnIndex;

        return result;
    };



    function selectionEnd() {

        if ((this.selectionEnd = this.end.textIndex) < (this.selectionStart = (this.start = this["x:start"]).textIndex))
        {
            this.selectionStart = (this.start = this.end).textIndex;
            this.selectionEnd = (this.end = this["x:start"]).textIndex;
        }

        this.selectedText = this.text.substring(this.selectionStart, this.selectionEnd);
    };



    //移动至指定坐标
    prototype.moveAt = function (x, y) {

        this.start = this.end = this.caret = this["x:start"] = this.findAt(x, y);
        this.selectionStart = this.selectionEnd = this.start.textIndex;
        this.selectedText = "";
    };


    //选择至指定坐标
    prototype.selectionAt = function (x, y) {

        this.end = this.caret = this.findAt(x, y);
        selectionEnd.call(this);
    };


    prototype.moveTo = function (textIndex) {

        this.start = this.end = this.caret = this["x:start"] = this.find(textIndex);
        this.selectionStart = this.selectionEnd = this.start.textIndex;
        this.selectedText = "";
    };


    prototype.selectionTo = function (textIndex) {

        this.end = this.caret = this.find(textIndex);
        selectionEnd.call(this);
    };


    prototype.replace = function (text) {

        var start = this.start,
            end = this.end,
            textIndex = start.textIndex + text.length,
            index_1 = start.pieceIndex,
            index_2 = end.pieceIndex;


        text = this[index_1].text.substring(0, start.columnIndex) + (text || "") + this[index_2].text.substring(end.columnIndex);

        start = index_1 > 0 ? this[index_1 - 1].text : "";
        end = index_2 + 1 < this.length ? this[index_2 + 1].text : "";


        var piece = new flyingon.TextPiece(this.font, text);
        piece.measureText();

        this.splice(index_1, index_2 - index_1 + 1, piece);

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


