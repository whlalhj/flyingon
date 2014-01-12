

//文本测量
(function (flyingon) {



    var prototype = (flyingon.TextMetrics = function (ownerControl) {

        this.ownerControl = ownerControl;

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
            cache_1 = this["x:cache:1"] = [0],
            cache_2 = this["x:cache:2"] = [0],
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

                this.width < piece.width && (this.width = piece.width); //最大宽度
                this.height += piece.height;
            }
        }
    };







    //获取指定索引的字符信息
    prototype.find = function (textIndex) {

        textIndex < 0 && (textIndex = 0);

        var index = (this["x:cache:1"] || initialize.call(this)["x:cache:1"]).binaryBetween(textIndex),
            start = this["x:cache:1"][index],
            result = this[index].find(textIndex - start);

        result.pieceIndex = index;
        result.textIndex = start + result.columnIndex;

        return result;
    };


    //查找指定位置的字符信息
    prototype.findAt = function (x, y) {

        var index = (this["x:cache:2"] || initialize.call(this)["x:cache:2"]).binaryBetween(y),
            result = this[index].findAt(x);

        result.pieceIndex = index;
        result.textIndex = this["x:cache:1"][index] + result.columnIndex;

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
    prototype.moveAt = function (x, y) {

        this.caretStart = this.caretEnd = this.caretMin = this.caretMax = this.findAt(x, y);
        this.selectionStart = this.selectionEnd = this.caretStart.textIndex;
        this.selectedText = "";
    };


    //选择至指定坐标
    prototype.selectionAt = function (x, y) {

        this.caretEnd = this.caretMax = this.findAt(x, y);
        selectionEnd.call(this);
    };


    prototype.moveTo = function (textIndex) {

        this.caretStart = this.caretEnd = this.caretMin = this.caretMax = this.find(textIndex);
        this.selectionStart = this.selectionEnd = this.caretStart.textIndex;
        this.selectedText = "";
    };


    prototype.selectionTo = function (textIndex) {

        this.caretEnd = this.caretMax = this.find(textIndex);
        selectionEnd.call(this);
    };


    prototype.replace = function (text) {

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


            var piece = new flyingon.TextPiece(this.font, text);
            piece.measureText();

            this.splice(index1, index2 - index1 + 1, piece);

            this.text = start + text + end;

            this.moveTo(textIndex);


            ownerControl.dispatchEvent("textchanged");
            return true;
        }

        return false;
    };


    prototype.remove = function (length) {

        !this.selectedText && this.selectionTo(this.selectionEnd + length); //未选择
        return this.replace("");
    };



})(flyingon);


