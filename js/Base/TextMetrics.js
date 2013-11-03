

//文本测量
(function ($) {



    $.TextMetrics = function (ownerControl) {

        this.ownerControl = ownerControl;
    };




    var p = $.TextMetrics.prototype = [];


    //字体
    p.font = null;

    //文本
    p.text = null;

    //最大宽度
    p.width = 0;

    //最大高度
    p.height = 0;

    //是否多行
    p.multiline = false;


    //开始选中位置
    p.selectionStart = 0;

    //结束选中位置
    p.selectionEnd = 0;

    //选中文本
    p.selectedText = "";






    function initialize() {

        var value1 = 0,
            value2 = 0,
            cache1 = this.cache1 = [0],
            cache2 = this.cache2 = [0],
            length = this.length - 1;


        for (var i = 0; i < length; i++)
        {
            var line = this[i];

            cache1.push(value1 += line.text.length);     //文本索引
            cache2.push(value2 += line.height);          //位置
        }

        return this;
    };




    p.measureText = function (font, text, multiline) {

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
            var values = multiline ? text.split(/\r?\n/g) : [text.replace(/[\r\n]?/g, "")],

                i = 0,
                length = values.length;


            while (i < length)
            {
                var piece = new $.TextPiece(font, values[i++]);
                piece.measureText();
                this.push(piece);

                if (this.width < piece.width) //最大宽度
                {
                    this.width = piece.width;
                }

                this.height += piece.height;
            }
        }
    };







    //获取指定索引的字符信息
    p.locate = function (textIndex) {

        if (textIndex < 0)
        {
            textIndex = 0;
        }


        var index = (this.cache1 || initialize.call(this).cache1).binaryBetween(textIndex),
            start = this.cache1[index],
            result = this[index].locate(textIndex - start);

        result.pieceIndex = index;
        result.textIndex = start + result.columnIndex;

        return result;
    };


    //查找指定位置的字符信息
    p.locateAt = function (x, y) {

        var index = (this.cache2 || initialize.call(this).cache2).binaryBetween(y),
            result = this[index].locateAt(x);

        result.pieceIndex = index;
        result.textIndex = this.cache1[index] + result.columnIndex;

        return result;
    };



    function selectionEnd() {

        this.selectionStart = this.caretStart.textIndex;
        this.selectionEnd = this.caretEnd.textIndex;

        if (this.selectionEnd < this.selectionStart)
        {
            this.selectionStart = (this.caretMin = this.caretEnd).textIndex;
            this.selectionEnd = (this.caretMax = this.caretStart).textIndex;
        }
        else
        {
            this.caretMin = this.caretStart;
        }

        this.selectedText = this.text.substring(this.selectionStart, this.selectionEnd);
    };



    //移动至指定坐标
    p.moveAt = function (x, y) {

        this.caretStart = this.caretEnd = this.caretMin = this.caretMax = this.locateAt(x, y);
        this.selectionStart = this.selectionEnd = this.caretStart.textIndex;
        this.selectedText = "";
    };


    //选择至指定坐标
    p.selectionAt = function (x, y) {

        this.caretEnd = this.caretMax = this.locateAt(x, y);
        selectionEnd.call(this);
    };


    p.moveTo = function (textIndex) {

        this.caretStart = this.caretEnd = this.caretMin = this.caretMax = this.locate(textIndex);
        this.selectionStart = this.selectionEnd = this.caretStart.textIndex;
        this.selectedText = "";
    };


    p.selectionTo = function (textIndex) {

        this.caretEnd = this.caretMax = this.locate(textIndex);
        selectionEnd.call(this);
    };


    p.replace = function (text) {

        var ownerControl = this.ownerControl;

        if (ownerControl.dispatchEvent("textchanging"))
        {
            var start = this.caretMin,
                end = this.caretMax,
                textIndex = start.textIndex + text.length,
                index1 = start.pieceIndex,
                index2 = end.pieceIndex;


            text = this[index1].text.substring(0, start.columnIndex) + (text || "") + this[index2].text.substring(end.columnIndex);

            start = index1 > 0 ? this[index1 - 1].text : "";
            end = index2 + 1 < this.length ? this[index2 + 1].text : "";


            var piece = new $.TextPiece(this.font, text);
            piece.measureText();

            this.splice(index1, index2 - index1 + 1, piece);

            this.text = start + text + end;

            this.moveTo(textIndex);


            ownerControl.dispatchEvent("textchanged");
            return true;
        }

        return false;
    };


    p.remove = function (length) {

        if (!this.selectedText) //未选择
        {
            this.selectionTo(this.selectionEnd + length);
        }

        return this.replace("");
    };



})(flyingon);


