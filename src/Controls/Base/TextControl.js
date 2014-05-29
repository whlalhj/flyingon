
//文字控件基类
flyingon.defineClass("TextControl", flyingon.Control, function (Class, base, flyingon) {



    //当前文本布局
    this.__text_layout = null;


    //文本布局类型
    this.__text_layout_type = flyingon.single_text_layout;


    //文字内容
    this.defineProperty("text", null, {

        attributes: "rearrange",
        changed: "this.__text = value ? new this.__text_layout_type(value) : null;"
    });



    //是否支持多行显示
    this.defineProperty("multiline", false, "rearrange");



    //文本被选中事件
    this.defineEvent("select");

    //取消文本选中事件
    this.defineEvent("unselect");



    attributes = {

        attributes: "invalidate",
        changing: "if ((value = +value) < 0) value = 0;\nelse if (value >= fields.text.length) value = fields.text.length - 1;",
        changed: ""
    };

    //开始选中位置
    this.defineProperty("selectionStart", 0, attributes);

    //结束选中位置
    this.defineProperty("selectionEnd", 0, attributes);

    //选中文字长度(只读)
    this.defineProperty("selectionLength", function () {

        var fields = this.__fields;
        return Math.abs(fields.selectionEnd - fields.selectionStart);
    });


    //获取或设置选中文本
    this.defineProperty("selectionText", function () {

        var fields = this.__fields, start, end;

        if (fields.text && (start = fields.selectionStart) !== (end = fields.selectionEnd))
        {
            if (start > end)
            {
                start = end;
                end = fields.selectionStart;
            }

            return fields.text.substring(start, end);
        }

        return null;
    });



});